import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const goals = await sql`
      SELECT id, name, target_amount, current_amount, target_date, goal_type, emoji, created_at, updated_at
      FROM financial_goals 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return Response.json({ goals });
  } catch (error) {
    console.error("GET /api/goals error:", error);
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
    const { name, targetAmount, currentAmount = 0, targetDate, goalType = "savings", emoji = "🎯" } = body;

    if (!name || !targetAmount) {
      return Response.json(
        { error: "Name and target amount are required" },
        { status: 400 }
      );
    }

    const [goal] = await sql`
      INSERT INTO financial_goals (user_id, name, target_amount, current_amount, target_date, goal_type, emoji)
      VALUES (${userId}, ${name}, ${targetAmount}, ${currentAmount}, ${targetDate || null}, ${goalType}, ${emoji})
      RETURNING id, name, target_amount, current_amount, target_date, goal_type, emoji, created_at, updated_at
    `;

    return Response.json({ goal });
  } catch (error) {
    console.error("POST /api/goals error:", error);
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
    const { id, name, targetAmount, currentAmount, targetDate, goalType, emoji } = body;

    if (!id) {
      return Response.json({ error: "Goal ID is required" }, { status: 400 });
    }

    // Build dynamic update query
    const setClauses = [];
    const values = [];

    if (name !== undefined) {
      setClauses.push(`name = $${values.length + 1}`);
      values.push(name);
    }
    if (targetAmount !== undefined) {
      setClauses.push(`target_amount = $${values.length + 1}`);
      values.push(targetAmount);
    }
    if (currentAmount !== undefined) {
      setClauses.push(`current_amount = $${values.length + 1}`);
      values.push(currentAmount);
    }
    if (targetDate !== undefined) {
      setClauses.push(`target_date = $${values.length + 1}`);
      values.push(targetDate);
    }
    if (goalType !== undefined) {
      setClauses.push(`goal_type = $${values.length + 1}`);
      values.push(goalType);
    }
    if (emoji !== undefined) {
      setClauses.push(`emoji = $${values.length + 1}`);
      values.push(emoji);
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    setClauses.push(`updated_at = NOW()`);
    const query = `
      UPDATE financial_goals 
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
      RETURNING id, name, target_amount, current_amount, target_date, goal_type, emoji, created_at, updated_at
    `;

    const result = await sql(query, [...values, id, userId]);
    const goal = result[0];

    if (!goal) {
      return Response.json({ error: "Goal not found" }, { status: 404 });
    }

    return Response.json({ goal });
  } catch (error) {
    console.error("PUT /api/goals error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}