import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get wallet balance and details
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from our custom users table
    const userRows = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRows[0].id;

    // Get wallet details
    const walletRows = await sql`
      SELECT id, balance, created_at, updated_at 
      FROM wallets 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    let wallet = walletRows?.[0] || null;

    // Create wallet if it doesn't exist
    if (!wallet) {
      const insertedRows = await sql`
        INSERT INTO wallets (user_id, balance)
        VALUES (${userId}, 0.00)
        RETURNING id, balance, created_at, updated_at
      `;
      wallet = insertedRows[0];
    }

    return Response.json({ wallet });
  } catch (err) {
    console.error("GET /api/wallet error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update wallet balance (for top-ups)
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      transaction_type = "wallet_topup",
      payment_gateway_id,
      description,
    } = body || {};

    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Get user from our custom users table
    const userRows = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRows[0].id;

    // Use transaction to ensure data consistency
    const result = await sql.transaction([
      // Update wallet balance
      sql`
        UPDATE wallets 
        SET balance = balance + ${amount}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ${userId}
        RETURNING id, balance
      `,
      // Record transaction
      sql`
        INSERT INTO transactions (
          user_id, transaction_type, amount, status, payment_gateway_id, description
        ) VALUES (
          ${userId}, ${transaction_type}, ${amount}, 'completed', ${payment_gateway_id || null}, ${description || "Wallet top-up"}
        )
        RETURNING id, amount, status, created_at
      `,
    ]);

    const updatedWallet = result[0][0];
    const transaction = result[1][0];

    return Response.json({
      wallet: updatedWallet,
      transaction,
    });
  } catch (err) {
    console.error("PUT /api/wallet error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
