import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user already has data
    const existingTransactions = await sql`
      SELECT COUNT(*) as count FROM transactions WHERE user_id = ${userId}
    `;

    if (parseInt(existingTransactions[0].count) > 0) {
      return Response.json({
        message: "User already has transaction data",
        seeded: false,
      });
    }

    // Get category IDs
    const categories = await sql`
      SELECT id, name, type FROM categories
    `;

    const incomeCategories = categories.filter((cat) => cat.type === "income");
    const expenseCategories = categories.filter(
      (cat) => cat.type === "expense",
    );

    // Sample transactions
    const sampleTransactions = [
      // Income transactions
      {
        category_id:
          incomeCategories.find((c) => c.name === "Salary")?.id ||
          incomeCategories[0]?.id,
        amount: 5000.0,
        description: "Monthly Salary - October",
        type: "income",
        transaction_date: "2025-10-01",
      },
      {
        category_id:
          incomeCategories.find((c) => c.name === "Freelance")?.id ||
          incomeCategories[1]?.id,
        amount: 750.0,
        description: "Website Design Project",
        type: "income",
        transaction_date: "2025-10-15",
      },
      {
        category_id:
          incomeCategories.find((c) => c.name === "Investments")?.id ||
          incomeCategories[2]?.id,
        amount: 120.5,
        description: "Dividend Payment",
        type: "income",
        transaction_date: "2025-10-20",
      },

      // Expense transactions
      {
        category_id:
          expenseCategories.find((c) => c.name === "Food & Dining")?.id ||
          expenseCategories[0]?.id,
        amount: 85.2,
        description: "Grocery Shopping",
        type: "expense",
        transaction_date: "2025-10-28",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Transportation")?.id ||
          expenseCategories[1]?.id,
        amount: 60.0,
        description: "Gas Station Fill-up",
        type: "expense",
        transaction_date: "2025-10-27",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Bills & Utilities")?.id ||
          expenseCategories[4]?.id,
        amount: 120.0,
        description: "Electricity Bill",
        type: "expense",
        transaction_date: "2025-10-25",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Shopping")?.id ||
          expenseCategories[2]?.id,
        amount: 200.0,
        description: "New Clothes for Winter",
        type: "expense",
        transaction_date: "2025-10-24",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Entertainment")?.id ||
          expenseCategories[3]?.id,
        amount: 45.0,
        description: "Movie Night",
        type: "expense",
        transaction_date: "2025-10-22",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Healthcare")?.id ||
          expenseCategories[5]?.id,
        amount: 75.0,
        description: "Doctor Visit Co-pay",
        type: "expense",
        transaction_date: "2025-10-20",
      },
      {
        category_id:
          expenseCategories.find((c) => c.name === "Food & Dining")?.id ||
          expenseCategories[0]?.id,
        amount: 35.5,
        description: "Lunch at Downtown Café",
        type: "expense",
        transaction_date: "2025-10-19",
      },
    ];

    // Insert sample transactions
    for (const transaction of sampleTransactions) {
      if (transaction.category_id) {
        await sql`
          INSERT INTO transactions (user_id, category_id, amount, description, type, transaction_date)
          VALUES (${userId}, ${transaction.category_id}, ${transaction.amount}, ${transaction.description}, ${transaction.type}, ${transaction.transaction_date})
        `;
      }
    }

    // Insert sample savings goals
    const sampleGoals = [
      {
        title: "Emergency Fund",
        description: "6 months of living expenses for financial security",
        target_amount: 15000.0,
        current_amount: 8500.0,
        target_date: "2025-12-31",
      },
      {
        title: "Vacation to Europe",
        description: "Dream trip to visit Paris, Rome, and Barcelona",
        target_amount: 5000.0,
        current_amount: 2100.0,
        target_date: "2025-06-01",
      },
      {
        title: "New Laptop",
        description: "MacBook Pro for work and personal projects",
        target_amount: 2500.0,
        current_amount: 1800.0,
        target_date: "2025-02-14",
      },
    ];

    for (const goal of sampleGoals) {
      await sql`
        INSERT INTO savings_goals (user_id, title, description, target_amount, current_amount, target_date)
        VALUES (${userId}, ${goal.title}, ${goal.description}, ${goal.target_amount}, ${goal.current_amount}, ${goal.target_date})
      `;
    }

    return Response.json({
      message: "Sample data created successfully!",
      seeded: true,
      transactions: sampleTransactions.length,
      goals: sampleGoals.length,
    });
  } catch (error) {
    console.error("Seed data API error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
