import { ARCHIVE_SITES } from "../_lib/archiveSites.js";
import { sendEmail } from "../_lib/sendEmail.js";

function createReviewToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function hashToken(token) {
  const encoded = new TextEncoder().encode(token);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoded
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const {
      site,
      name,
      organisation = "",
      email,
      purpose,
    } = body;

    if (!site || !name || !email || !purpose) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const wildclocksToken = createReviewToken();
    const partnerToken = createReviewToken();

    const [
    wildclocksTokenHash,
    partnerTokenHash,
    ] = await Promise.all([
    hashToken(wildclocksToken),
    hashToken(partnerToken),
    ]);

    const tokenExpiresAt = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString();

    await context.env.ARCHIVE_DB
    .prepare(`
        INSERT INTO archive_requests (
        id,
        site,
        name,
        organisation,
        email,
        purpose,
        wildclocks_status,
        partner_status,
        status,
        created_at,
        wildclocks_token_hash,
        partner_token_hash,
        token_expires_at
        )
        VALUES (
        ?, ?, ?, ?, ?, ?,
        'pending',
        'pending',
        'pending',
        ?, ?, ?, ?
        )
    `)
    .bind(
        id,
        site,
        name.trim(),
        organisation.trim(),
        email.trim(),
        purpose.trim(),
        createdAt,
        wildclocksTokenHash,
        partnerTokenHash,
        tokenExpiresAt
    )
    .run();

    const siteConfig = ARCHIVE_SITES[site];

    if (siteConfig) {
    const notifications = siteConfig.reviewers.map((reviewer) =>
        sendEmail(context, {
        to: reviewer.email,
        subject: `New full-resolution data request — ${siteConfig.name}`,
        text: `
    A new request has been submitted to the Wild Clocks archive.

    Site: ${siteConfig.name}
    Name: ${name}
    Organisation: ${organisation || "Not provided"}
    Email: ${email}

    How will they use the data?
    ${purpose}

    Request ID: ${id}

    This is currently a notification only. No action is required.
        `.trim(),
        })
    );

    context.waitUntil(
        Promise.all(notifications).catch((error) => {
        console.error("Archive notification failed:", error);
        })
    );
    }

    return Response.json(
      {
        success: true,
        id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to submit request" },
      { status: 500 }
    );
  }
}