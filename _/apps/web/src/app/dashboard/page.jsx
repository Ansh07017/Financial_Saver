import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    enabled: !!user,
  });

  const seedData = async () => {
    setSeedLoading(true);
    setSeedMessage("");

    try {
      const response = await fetch("/api/seed-data", {
        method: "POST",
      });

      const result = await response.json();
      setSeedMessage(result.message);

      if (result.seeded) {
        // Refresh dashboard data after seeding
        queryClient.invalidateQueries(["dashboard"]);
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      setSeedMessage("Failed to seed sample data. Please try again.");
    } finally {
      setSeedLoading(false);
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect above
  }

  const stats = dashboardData?.stats || {
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    savingsGoalProgress: 0,
  };

  const recentTransactions = dashboardData?.recentTransactions || [];
  const savingsGoals = dashboardData?.savingsGoals || [];
  const hasNoData =
    recentTransactions.length === 0 && savingsGoals.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700">
                <span className="text-lg font-bold text-white">$</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                MoneyFlow
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
              <a
                href="/account/logout"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Message for New Users */}
        {hasNoData && (
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
              <span className="text-2xl">🎉</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              Welcome to MoneyFlow!
            </h2>
            <p className="mb-6 text-gray-600">
              Get started by adding your financial transactions, or try our
              sample data to explore the features.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={seedData}
                disabled={seedLoading}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {seedLoading ? "Loading..." : "🌱 Try Sample Data"}
              </button>
              <button className="rounded-lg border border-indigo-600 bg-white px-6 py-3 text-indigo-600 font-medium transition-colors hover:bg-indigo-50">
                📊 Add First Transaction
              </button>
            </div>
            {seedMessage && (
              <div
                className={`mt-4 rounded-lg p-3 text-sm ${
                  seedMessage.includes("success")
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {seedMessage}
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Income */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 17H7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Net Savings */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Savings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.savings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
                <svg
                  className="h-6 w-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Goal Progress
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.savingsGoalProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                  Add Transaction
                </button>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            transaction.type === "income"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <span
                            className={`text-sm font-bold ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No transactions yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Get started by adding your first transaction.
                  </p>
                  <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                    Add First Transaction
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Savings Goals */}
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Savings Goals
                </h2>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  New Goal
                </button>
              </div>

              {savingsGoals.length > 0 ? (
                <div className="space-y-6">
                  {savingsGoals.map((goal, index) => {
                    const progress = Math.min(
                      (goal.current_amount / goal.target_amount) * 100,
                      100,
                    );
                    return (
                      <div key={index}>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {goal.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="mb-2 h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>${goal.current_amount.toFixed(2)}</span>
                          <span>${goal.target_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No savings goals
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Create your first savings goal to start tracking progress.
                  </p>
                  <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                    Create Goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-indigo-300 hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Add Income
              </span>
            </button>

            <button className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-indigo-300 hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Add Expense
              </span>
            </button>

            <button className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-indigo-300 hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
                <svg
                  className="h-6 w-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Set Goal
              </span>
            </button>

            <button className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-indigo-300 hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                View Reports
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainComponent;
