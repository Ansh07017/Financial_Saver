import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { otp_type, delivery_method } = body;

    if (!otp_type || !delivery_method) {
      return Response.json(
        { error: "Missing required fields: otp_type, delivery_method" },
        { status: 400 },
      );
    }

    if (!["email", "sms"].includes(delivery_method)) {
      return Response.json(
        { error: "Invalid delivery method. Must be 'email' or 'sms'" },
        { status: 400 },
      );
    }

    // Get user from custom users table
    const userRows = await sql`
      SELECT id, email, phone, name FROM users 
      WHERE email = ${session.user.email} 
      LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json(
        { error: "User profile not found. Please complete onboarding first." },
        { status: 404 },
      );
    }

    const user = userRows[0];

    // Validate delivery method requirements
    if (
      delivery_method === "sms" &&
      (!user.phone || user.phone.trim() === "")
    ) {
      return Response.json(
        { error: "Phone number required for SMS delivery" },
        { status: 400 },
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing unused OTPs for this user and type
    await sql`
      DELETE FROM otp_verifications 
      WHERE user_id = ${user.id} 
      AND otp_type = ${otp_type} 
      AND is_used = false
    `;

    // Store OTP in database
    await sql`
      INSERT INTO otp_verifications (user_id, otp_code, otp_type, delivery_method, expires_at)
      VALUES (${user.id}, ${otpCode}, ${otp_type}, ${delivery_method}, ${expiresAt})
    `;

    // Send OTP based on delivery method
    if (delivery_method === "email") {
      const emailSubject = `Financial Saver - Your OTP Code`;
      const emailText = `Your OTP code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3562FF; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Financial Saver</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #0F172A; margin-bottom: 20px;">Your OTP Code</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #3562FF; letter-spacing: 8px;">${otpCode}</div>
            </div>
            <p style="color: #6B7280; margin: 20px 0;">This code will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #6B7280; margin: 20px 0;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6B7280;">
            © 2024 Financial Saver. All rights reserved.
          </div>
        </div>
      `;

      const emailResponse = await fetch(
        `${process.env.APP_URL}/api/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.email,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
            type: otp_type,
          }),
        },
      );

      if (!emailResponse.ok) {
        throw new Error("Failed to send email");
      }
    } else if (delivery_method === "sms") {
      // SMS implementation would go here
      // For now, we'll return an error since SMS service isn't set up yet
      return Response.json(
        {
          error: "SMS service not yet implemented. Please use email delivery.",
        },
        { status: 501 },
      );
    }

    return Response.json({
      success: true,
      message: `OTP sent successfully via ${delivery_method}`,
      delivery_method,
      expires_in_minutes: 10,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return Response.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
