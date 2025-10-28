import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { otp_code, otp_type } = body;

    if (!otp_code || !otp_type) {
      return Response.json(
        { error: "Missing required fields: otp_code, otp_type" },
        { status: 400 },
      );
    }

    // Get user from custom users table
    const userRows = await sql`
      SELECT id, email FROM users 
      WHERE email = ${session.user.email} 
      LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    const user = userRows[0];

    // Find the OTP
    const otpRows = await sql`
      SELECT id, otp_code, expires_at, is_used, delivery_method 
      FROM otp_verifications 
      WHERE user_id = ${user.id} 
      AND otp_type = ${otp_type} 
      AND otp_code = ${otp_code}
      AND is_used = false
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (otpRows.length === 0) {
      return Response.json(
        { error: "Invalid or expired OTP code" },
        { status: 400 },
      );
    }

    const otpRecord = otpRows[0];

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);

    if (now > expiresAt) {
      // Mark as used to prevent reuse
      await sql`
        UPDATE otp_verifications 
        SET is_used = true 
        WHERE id = ${otpRecord.id}
      `;

      return Response.json({ error: "OTP code has expired" }, { status: 400 });
    }

    // Mark OTP as used
    await sql`
      UPDATE otp_verifications 
      SET is_used = true 
      WHERE id = ${otpRecord.id}
    `;

    // If this is a login OTP, we might want to update user verification status
    if (otp_type === "login") {
      await sql`
        UPDATE users 
        SET is_verified = true 
        WHERE id = ${user.id}
      `;
    }

    return Response.json({
      success: true,
      message: "OTP verified successfully",
      otp_type,
      delivery_method: otpRecord.delivery_method,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return Response.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
