import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const accounts = await sql`
      SELECT id, name, account_type, account_number, balance, created_at, updated_at
      FROM accounts 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return Response.json({ accounts });
  } catch (error) {
    console.error("GET /api/accounts error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, accountType, accountNumber, balance = 0 } = body;

    if (!name || !accountType) {
      return Response.json(
        { error: "Name and account type are required" },
        { status: 400 }
      );
    }

    const [account] = await sql`
      INSERT INTO accounts (user_id, name, account_type, account_number, balance)
      VALUES (${userId}, ${name}, ${accountType}, ${accountNumber || null}, ${balance})
      RETURNING id, name, account_type, account_number, balance, created_at, updated_at
    `;

    return Response.json({ account });
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { id, name, accountType, accountNumber, balance } = body;

    if (!id) {
      return Response.json({ error: "Account ID is required" }, { status: 400 });
    }

    // Build dynamic update query
    const setClauses = [];
    const values = [];

    if (name !== undefined) {
      setClauses.push(`name = $${values.length + 1}`);
      values.push(name);
    }
    if (accountType !== undefined) {
      setClauses.push(`account_type = $${values.length + 1}`);
      values.push(accountType);
    }
    if (accountNumber !== undefined) {
      setClauses.push(`account_number = $${values.length + 1}`);
      values.push(accountNumber);
    }
    if (balance !== undefined) {
      setClauses.push(`balance = $${values.length + 1}`);
      values.push(balance);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    setClauses.push(`updated_at = NOW()`);
    const query = `
      UPDATE accounts 
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
      RETURNING id, name, account_type, account_number, balance, created_at, updated_at
    `;

    const result = await sql(query, [...values, id, userId]);
    const account = result[0];

    if (!account) {
      return Response.json({ error: "Account not found" }, { status: 404 });
    }

    return Response.json({ account });
  } catch (error) {
    console.error("PUT /api/accounts error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}