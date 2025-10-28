import { useEffect } from "react";
import useUser from "@/utils/useUser";

function MainComponent() {
  const { data: user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        // User is not authenticated, show landing page
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* MoneyFlow Logo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg">
            <span className="text-3xl font-bold text-white">$</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl">
            Money<span className="text-indigo-600">Flow</span>
          </h1>

          <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
            Take control of your finances with smart tracking, insightful
            analytics, and powerful savings tools.
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/account/signup"
              className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Get Started Free
            </a>
            <a
              href="/account/signin"
              className="rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
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
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Smart Tracking
              </h3>
              <p className="text-gray-600">
                Automatically categorize expenses and track your income with
                intelligent insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200">
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
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Savings Goals
              </h3>
              <p className="text-gray-600">
                Set and achieve your financial goals with visual progress
                tracking and smart recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200">
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
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Budget Control
              </h3>
              <p className="text-gray-600">
                Create personalized budgets and receive alerts to stay on track
                with your spending.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-16 bg-gradient-to-r from-indigo-600 to-cyan-600">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl">
            Trusted by Smart Savers
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold text-white">$2.5M+</div>
              <div className="text-indigo-100">Total Savings Tracked</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-white">50K+</div>
              <div className="text-indigo-100">Active Users</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-white">95%</div>
              <div className="text-indigo-100">Goal Achievement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            Start Your Financial Journey Today
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of users who have taken control of their finances
            with MoneyFlow.
          </p>
          <a
            href="/account/signup"
            className="inline-block rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Create Free Account
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 mx-auto">
            <span className="text-lg font-bold text-white">$</span>
          </div>
          <p className="text-gray-600">
            © 2025 MoneyFlow. Take control of your financial future.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
