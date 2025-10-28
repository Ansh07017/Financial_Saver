import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get dashboard statistics
    const [incomeResult, expenseResult, goalsResult] = await sql.transaction([
      sql`
        SELECT COALESCE(SUM(amount), 0) as total_income 
        FROM transactions 
        WHERE user_id = ${userId} AND type = 'income'
      `,
      sql`
        SELECT COALESCE(SUM(amount), 0) as total_expenses 
        FROM transactions 
        WHERE user_id = ${userId} AND type = 'expense'
      `,
      sql`
        SELECT 
          COUNT(*) as total_goals,
          AVG(CASE WHEN target_amount > 0 THEN (current_amount / target_amount) * 100 ELSE 0 END) as avg_progress
        FROM savings_goals 
        WHERE user_id = ${userId}
      `,
    ]);

    const totalIncome = parseFloat(incomeResult[0].total_income);
    const totalExpenses = parseFloat(expenseResult[0].total_expenses);
    const savings = totalIncome - totalExpenses;
    const savingsGoalProgress = Math.round(
      parseFloat(goalsResult[0].avg_progress || 0),
    );

    // Get recent transactions
    const recentTransactions = await sql`
      SELECT 
        t.id,
        t.amount,
        t.description,
        t.type,
        t.transaction_date,
        c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ${userId}
      ORDER BY t.transaction_date DESC, t.created_at DESC
      LIMIT 10
    `;

    // Get savings goals
    const savingsGoals = await sql`
      SELECT 
        id,
        title,
        description,
        target_amount,
        current_amount,
        target_date
      FROM savings_goals 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Format transactions for frontend
    const formattedTransactions = recentTransactions.map((transaction) => ({
      id: transaction.id,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      type: transaction.type,
      category: transaction.category_name || "Uncategorized",
      date: transaction.transaction_date,
    }));

    // Format savings goals for frontend
    const formattedGoals = savingsGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      target_amount: parseFloat(goal.target_amount),
      current_amount: parseFloat(goal.current_amount),
      target_date: goal.target_date,
    }));

    return Response.json({
      stats: {
        totalIncome,
        totalExpenses,
        savings,
        savingsGoalProgress,
      },
      recentTransactions: formattedTransactions,
      savingsGoals: formattedGoals,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
