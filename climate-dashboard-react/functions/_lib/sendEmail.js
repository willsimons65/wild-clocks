export async function sendEmail(context, {
  to,
  subject,
  text,
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Wild Clocks Archive <${context.env.ARCHIVE_EMAIL_FROM}>`,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend email failed: ${error}`);
  }

  return response.json();
}