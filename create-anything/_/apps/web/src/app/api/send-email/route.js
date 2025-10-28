// Email service using SendGrid
export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html, type } = body;

    if (!to || !subject || (!text && !html)) {
      return Response.json(
        { error: "Missing required fields: to, subject, and text/html" },
        { status: 400 },
      );
    }

    // SendGrid API endpoint
    const sendGridUrl = "https://api.sendgrid.com/v3/mail/send";

    // Get the API key from environment variables
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      console.error("SENDGRID_API_KEY environment variable is not set");
      return Response.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    // Email payload for SendGrid
    const emailData = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject,
        },
      ],
      from: {
        email: "noreply@yourdomain.com", // Replace with your verified sender email
        name: "Financial Saver",
      },
      content: [
        {
          type: "text/plain",
          value: text || "",
        },
      ],
    };

    // Add HTML content if provided
    if (html) {
      emailData.content.push({
        type: "text/html",
        value: html,
      });
    }

    // Send email via SendGrid API
    const response = await fetch(sendGridUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendGrid API error:", response.status, errorText);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log(`Email sent successfully to ${to} for ${type || "general"}`);
    return Response.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email service error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
