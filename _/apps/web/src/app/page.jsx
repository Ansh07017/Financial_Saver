import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import useUser from "@/utils/useUser";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SavingsChart from "@/components/SavingsChart";
import TransactionsList from "@/components/TransactionsList";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user, loading: userLoading } = useUser();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive flexbox item */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1E293B] border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:flex-shrink-0
      `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area - Flexbox container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4F46E5] dark:focus:ring-[#4F46E5] transition-colors duration-150"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Mobile logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#4F46E5] dark:bg-[#4F46E5] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
              <div className="ml-2 flex items-center">
                <span className="text-[#1F2937] dark:text-white font-medium text-lg">
                  Money
                </span>
                <span className="text-[#4F46E5] dark:text-[#22D3EE] font-medium text-lg">
                  Flow
                </span>
              </div>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Header - Always visible on desktop, hidden on mobile - Now sticky */}
        <div className="hidden lg:block flex-shrink-0 sticky top-0 z-30">
          <Header />
        </div>

        {/* Main Content - Flexible scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 lg:p-4">
            {/* Savings Chart Section */}
            <div className="mb-4">
              <SavingsChart />
            </div>

            {/* Transactions List Section */}
            <TransactionsList />
          </div>
        </div>
      </div>
    </div>
  );
}
