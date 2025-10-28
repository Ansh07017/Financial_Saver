import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get user transactions
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;
    const type = url.searchParams.get("type"); // wallet_topup, bill_payment, transfer

    // Get user from our custom users table
    const userRows = await sql`
      SELECT id FROM users WHERE email = ${session.user.email} LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRows[0].id;

    let whereClause = "WHERE user_id = $1";
    let params = [userId];

    if (type && ["wallet_topup", "bill_payment", "transfer"].includes(type)) {
      whereClause += " AND transaction_type = $2";
      params.push(type);
    }

    const query = `
      SELECT 
        id, transaction_type, amount, currency, status, 
        payment_gateway_id, description, recipient_name, 
        recipient_account, category, created_at, updated_at
      FROM transactions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const transactions = await sql(query, [...params, limit, offset]);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
    const countResult = await sql(countQuery, params);
    const total = parseInt(countResult[0].total);

    return Response.json({
      transactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (err) {
    console.error("GET /api/transactions error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create a new transaction
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      transaction_type,
      amount,
      description,
      recipient_name,
      recipient_account,
      category,
      payment_gateway_id,
    } = body || {};

    // Validation
    if (
      !transaction_type ||
      !["wallet_topup", "bill_payment", "transfer"].includes(transaction_type)
    ) {
      return Response.json(
        { error: "Invalid transaction type" },
        { status: 400 },
      );
    }

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

    // For bill payments and transfers, check wallet balance
    if (transaction_type !== "wallet_topup") {
      const walletRows = await sql`
        SELECT balance FROM wallets WHERE user_id = ${userId} LIMIT 1
      `;

      if (walletRows.length === 0 || walletRows[0].balance < amount) {
        return Response.json(
          { error: "Insufficient wallet balance" },
          { status: 400 },
        );
      }
    }

    // Create transaction
    const insertedRows = await sql`
      INSERT INTO transactions (
        user_id, transaction_type, amount, status, payment_gateway_id, 
        description, recipient_name, recipient_account, category
      ) VALUES (
        ${userId}, ${transaction_type}, ${amount}, 'pending', 
        ${payment_gateway_id || null}, ${description || null}, 
        ${recipient_name || null}, ${recipient_account || null}, ${category || null}
      )
      RETURNING id, transaction_type, amount, status, created_at
    `;

    const transaction = insertedRows[0];

    return Response.json({ transaction }, { status: 201 });
  } catch (err) {
    console.error("POST /api/transactions error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
