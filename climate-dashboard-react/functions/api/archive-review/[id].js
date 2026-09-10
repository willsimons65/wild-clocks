import { hashToken } from "../../_lib/reviewTokens.js";

async function getReview(context, token) {
  const id = context.params.id;

  const request = await context.env.ARCHIVE_DB
    .prepare(`
      SELECT *
      FROM archive_requests
      WHERE id = ?
    `)
    .bind(id)
    .first();

  if (!request || !token) {
    return null;
  }

  if (
    !request.token_expires_at ||
    Date.now() > Date.parse(request.token_expires_at)
  ) {
    return { error: "expired" };
  }

  const tokenHash = await hashToken(token);

  let reviewer = null;

  if (tokenHash === request.wildclocks_token_hash) {
    reviewer = "wildclocks";
  } else if (tokenHash === request.partner_token_hash) {
    reviewer = "partner";
  }

  if (!reviewer) {
    return null;
  }

  return {
    request,
    reviewer,
  };
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  const review = await getReview(context, token);

  if (!review) {
    return Response.json(
      { error: "Invalid review link" },
      { status: 403 }
    );
  }

  if (review.error === "expired") {
    return Response.json(
      { error: "This review link has expired" },
      { status: 410 }
    );
  }

  const { request, reviewer } = review;

  return Response.json({
    id: request.id,
    site: request.site,
    name: request.name,
    organisation: request.organisation,
    email: request.email,
    purpose: request.purpose,
    reviewer,
    reviewerStatus:
      reviewer === "wildclocks"
        ? request.wildclocks_status
        : request.partner_status,
    status: request.status,
  });
}

export async function onRequestPost(context) {
  try {
    const { token, decision } = await context.request.json();

    if (!["approved", "declined"].includes(decision)) {
      return Response.json(
        { error: "Invalid decision" },
        { status: 400 }
      );
    }

    const review = await getReview(context, token);

    if (!review) {
      return Response.json(
        { error: "Invalid review link" },
        { status: 403 }
      );
    }

    if (review.error === "expired") {
      return Response.json(
        { error: "This review link has expired" },
        { status: 410 }
      );
    }

    const { request, reviewer } = review;

    const currentReviewerStatus =
      reviewer === "wildclocks"
        ? request.wildclocks_status
        : request.partner_status;

    if (currentReviewerStatus !== "pending") {
      return Response.json(
        { error: "This request has already been reviewed" },
        { status: 409 }
      );
    }

    const reviewedAt = new Date().toISOString();

    const wildclocksStatus =
      reviewer === "wildclocks"
        ? decision
        : request.wildclocks_status;

    const partnerStatus =
      reviewer === "partner"
        ? decision
        : request.partner_status;

    let overallStatus = "pending";

    if (
      wildclocksStatus === "declined" ||
      partnerStatus === "declined"
    ) {
      overallStatus = "declined";
    } else if (
      wildclocksStatus === "approved" &&
      partnerStatus === "approved"
    ) {
      overallStatus = "approved";
    }

    const completedAt =
      overallStatus === "pending"
        ? null
        : reviewedAt;

    if (reviewer === "wildclocks") {
      await context.env.ARCHIVE_DB
        .prepare(`
          UPDATE archive_requests
          SET
            wildclocks_status = ?,
            wildclocks_reviewed_at = ?,
            status = ?,
            decision_completed_at = ?
          WHERE id = ?
        `)
        .bind(
          decision,
          reviewedAt,
          overallStatus,
          completedAt,
          request.id
        )
        .run();
    } else {
      await context.env.ARCHIVE_DB
        .prepare(`
          UPDATE archive_requests
          SET
            partner_status = ?,
            partner_reviewed_at = ?,
            status = ?,
            decision_completed_at = ?
          WHERE id = ?
        `)
        .bind(
          decision,
          reviewedAt,
          overallStatus,
          completedAt,
          request.id
        )
        .run();
    }

    return Response.json({
      success: true,
      decision,
      status: overallStatus,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to record decision" },
      { status: 500 }
    );
  }
}