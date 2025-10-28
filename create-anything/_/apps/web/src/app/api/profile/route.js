import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user profile from our custom users table
    const userRows = await sql`
      SELECT id, email, phone, name, is_verified, preferred_otp_method, created_at 
      FROM users 
      WHERE email = ${session.user.email} 
      LIMIT 1
    `;

    let userProfile = userRows?.[0] || null;

    // If user doesn't exist in our custom table, create them
    if (!userProfile) {
      const insertedRows = await sql`
        INSERT INTO users (email, phone, name, password_hash, preferred_otp_method)
        VALUES (${session.user.email}, '', ${session.user.name || ""}, '', 'email')
        RETURNING id, email, phone, name, is_verified, preferred_otp_method, created_at
      `;
      userProfile = insertedRows?.[0];

      // Create wallet for new user
      if (userProfile) {
        await sql`
          INSERT INTO wallets (user_id, balance)
          VALUES (${userProfile.id}, 0.00)
        `;
      }
    }

    return Response.json({ user: userProfile });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, preferred_otp_method } = body || {};

    // First ensure user exists in our custom table
    const existingUserRows = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;

    let userId;
    if (existingUserRows.length === 0) {
      // Create user if they don't exist
      const insertedRows = await sql`
        INSERT INTO users (email, phone, name, password_hash, preferred_otp_method)
        VALUES (${session.user.email}, ${phone || ""}, ${session.user.name || ""}, '', ${preferred_otp_method || "email"})
        RETURNING id
      `;
      userId = insertedRows[0].id;

      // Create wallet for new user
      await sql`
        INSERT INTO wallets (user_id, balance)
        VALUES (${userId}, 0.00)
      `;
    } else {
      userId = existingUserRows[0].id;
    }

    const setClauses = [];
    const values = [];

    if (typeof phone === "string" && phone.trim().length > 0) {
      setClauses.push("phone = $" + (values.length + 1));
      values.push(phone.trim());
    }

    if (
      typeof preferred_otp_method === "string" &&
      ["email", "sms"].includes(preferred_otp_method)
    ) {
      setClauses.push("preferred_otp_method = $" + (values.length + 1));
      values.push(preferred_otp_method);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    setClauses.push("updated_at = CURRENT_TIMESTAMP");

    const finalQuery = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING id, email, phone, name, is_verified, preferred_otp_method, created_at`;

    const result = await sql(finalQuery, [...values, userId]);
    const updated = result?.[0] || null;

    return Response.json({ user: updated });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
