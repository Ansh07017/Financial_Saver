import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 50;
    const offset = parseInt(url.searchParams.get("offset")) || 0;
    const category = url.searchParams.get("category");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let query = `
      SELECT 
        t.id, t.merchant, t.description, t.amount, t.transaction_type, t.transaction_date,
        t.ml_category_confidence, t.created_at, t.updated_at,
        a.name as account_name, a.account_type, a.account_number,
        c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;

    const values = [userId];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      values.push(category);
    }

    if (startDate) {
      paramCount++;
      query += ` AND t.transaction_date >= $${paramCount}`;
      values.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND t.transaction_date <= $${paramCount}`;
      values.push(endDate);
    }

    query += ` ORDER BY t.transaction_date DESC, t.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const transactions = await sql(query, values);

    return Response.json({ transactions });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
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
    const { 
      accountId, 
      merchant, 
      description, 
      amount, 
      transactionType, 
      transactionDate, 
      categoryId,
      autoCategorizе = true 
    } = body;

    if (!accountId || !merchant || !amount || !transactionType || !transactionDate) {
      return Response.json(
        { error: "Account ID, merchant, amount, transaction type, and date are required" },
        { status: 400 }
      );
    }

    let finalCategoryId = categoryId;
    let mlConfidence = null;

    // Auto-categorize if no category provided and it's an expense
    if (!categoryId && autoCategorizе && transactionType === 'expense') {
      try {
        const categorizationResponse = await fetch(`${process.env.APP_URL}/api/transactions/categorize`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Cookie": request.headers.get("Cookie") || ""
          },
          body: JSON.stringify({
            merchant,
            description,
            amount
          })
        });

        if (categorizationResponse.ok) {
          const categorization = await categorizationResponse.json();
          finalCategoryId = categorization.categoryId;
          mlConfidence = categorization.confidence;
        }
      } catch (error) {
        console.error("Auto-categorization failed:", error);
        // Continue without categorization
      }
    }

    const [transaction] = await sql`
      INSERT INTO transactions (
        user_id, account_id, category_id, merchant, description, amount, 
        transaction_type, transaction_date, ml_category_confidence
      )
      VALUES (
        ${userId}, ${accountId}, ${finalCategoryId}, ${merchant}, ${description}, 
        ${amount}, ${transactionType}, ${transactionDate}, ${mlConfidence}
      )
      RETURNING id, merchant, description, amount, transaction_type, transaction_date, 
                ml_category_confidence, created_at, updated_at
    `;

    // Update account balance
    const balanceChange = transactionType === 'income' ? amount : -amount;
    await sql`
      UPDATE accounts 
      SET balance = balance + ${balanceChange}, updated_at = NOW()
      WHERE id = ${accountId} AND user_id = ${userId}
    `;

    return Response.json({ transaction });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
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
    const { id, categoryId, merchant, description, amount, transactionType, transactionDate } = body;

    if (!id) {
      return Response.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Get original transaction for balance adjustment
    const [originalTransaction] = await sql`
      SELECT amount, transaction_type, account_id
      FROM transactions 
      WHERE id = ${id} AND user_id = ${userId}
    `;

    if (!originalTransaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Build dynamic update query
    const setClauses = [];
    const values = [];

    if (merchant !== undefined) {
      setClauses.push(`merchant = $${values.length + 1}`);
      values.push(merchant);
    }
    if (description !== undefined) {
      setClauses.push(`description = $${values.length + 1}`);
      values.push(description);
    }
    if (amount !== undefined) {
      setClauses.push(`amount = $${values.length + 1}`);
      values.push(amount);
    }
    if (transactionType !== undefined) {
      setClauses.push(`transaction_type = $${values.length + 1}`);
      values.push(transactionType);
    }
    if (transactionDate !== undefined) {
      setClauses.push(`transaction_date = $${values.length + 1}`);
      values.push(transactionDate);
    }
    if (categoryId !== undefined) {
      setClauses.push(`category_id = $${values.length + 1}`);
      values.push(categoryId);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    const query = `
      UPDATE transactions 
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
      RETURNING id, merchant, description, amount, transaction_type, transaction_date, 
                ml_category_confidence, created_at, updated_at
    `;

    const result = await sql(query, [...values, id, userId]);
    const transaction = result[0];

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update account balance if amount or type changed
    if (amount !== undefined || transactionType !== undefined) {
      const newAmount = amount !== undefined ? amount : originalTransaction.amount;
      const newType = transactionType !== undefined ? transactionType : originalTransaction.transaction_type;
      
      // Reverse original transaction effect
      const originalBalanceChange = originalTransaction.transaction_type === 'income' 
        ? -originalTransaction.amount 
        : originalTransaction.amount;
      
      // Apply new transaction effect
      const newBalanceChange = newType === 'income' ? newAmount : -newAmount;
      
      const totalBalanceChange = originalBalanceChange + newBalanceChange;

      await sql`
        UPDATE accounts 
        SET balance = balance + ${totalBalanceChange}, updated_at = NOW()
        WHERE id = ${originalTransaction.account_id} AND user_id = ${userId}
      `;
    }

    return Response.json({ transaction });
  } catch (error) {
    console.error("PUT /api/transactions error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}