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
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending', ?)
      `)
      .bind(
        id,
        site,
        name.trim(),
        organisation.trim(),
        email.trim(),
        purpose.trim(),
        createdAt
      )
      .run();

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