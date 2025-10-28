import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  Plus,
  CreditCard,
  Shield,
  Menu,
  Bell,
  Settings,
  ChevronDown,
  Search,
} from "lucide-react";

export default function HomePage() {
  const { data: user, loading: userLoading } = useUser();
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [walletRes, transactionsRes] = await Promise.all([
          fetch("/api/wallet"),
          fetch("/api/transactions?limit=5"),
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.wallet);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3562FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#A1A1AA]">
            Loading your financial dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#3562FF] dark:bg-[#4F7CFF] rounded-full flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE] mb-2">
            Welcome to Financial Saver
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mb-6">
            Sign in to access your financial dashboard and manage your money
            better
          </p>
          <div className="space-y-3">
            <a
              href="/account/signin"
              className="w-full block bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] transition-colors"
            >
              Sign In
            </a>
            <a
              href="/account/signup"
              className="w-full block bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  const balance = walletData?.balance || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121212]">
      {/* Header */}
      <header className="h-16 border-b border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#121212] px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3562FF] rounded-full flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                Financial Saver
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] rounded-md">
              <Bell size={20} className="text-[#6B7280] dark:text-[#A1A1AA]" />
            </button>
            <div className="h-6 w-px bg-[#E5E7EB] dark:bg-[#262626] mx-2"></div>
            <a
              href="/account/logout"
              className="flex items-center gap-2 p-1.5 hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] rounded-md"
            >
              <div className="w-8 h-8 bg-[#3562FF] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <ChevronDown
                size={16}
                className="text-[#6B7280] dark:text-[#A1A1AA]"
              />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Wallet Balance Card */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <Banknote
                size={20}
                className="text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <div className="text-xs text-[#6B7280] dark:text-[#A1A1AA] font-medium uppercase tracking-wider">
                WALLET BALANCE
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                ₹{balance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <TrendingUp
                size={20}
                className="text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <div className="text-xs text-[#6B7280] dark:text-[#A1A1AA] font-medium uppercase tracking-wider">
                TOTAL INCOME
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                ₹0.00
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-4 py-4 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-2">
              <TrendingDown
                size={20}
                className="text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <div className="text-xs text-[#6B7280] dark:text-[#A1A1AA] font-medium uppercase tracking-wider">
                TOTAL EXPENSES
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                ₹0.00
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626]">
                <h3 className="text-base font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                  Recent Transactions
                </h3>
              </div>
              <div className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#F3F4F6] dark:bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp
                        size={20}
                        className="text-[#6B7280] dark:text-[#A1A1AA]"
                      />
                    </div>
                    <p className="text-[#6B7280] dark:text-[#A1A1AA] text-sm">
                      No transactions yet
                    </p>
                    <p className="text-[#6B7280] dark:text-[#A1A1AA] text-xs mt-1">
                      Start by adding money to your wallet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                            {transaction.description ||
                              transaction.transaction_type}
                          </p>
                          <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                            {new Date(
                              transaction.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.transaction_type === "wallet_topup"
                                ? "text-[#12B76A]"
                                : "text-[#F04438]"
                            }`}
                          >
                            {transaction.transaction_type === "wallet_topup"
                              ? "+"
                              : "-"}
                            ₹{transaction.amount}
                          </p>
                          <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-4 pt-4 pb-6">
              <h3 className="text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE] mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/wallet/topup"
                  className="w-full bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Add Money to Wallet
                </a>
                <a
                  href="/bills"
                  className="w-full bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={14} />
                  Pay Bills
                </a>
                <a
                  href="/transfer"
                  className="w-full bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUp size={14} />
                  Send Money
                </a>
              </div>
            </div>

            {/* Download APK */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-4 pt-4 pb-6">
              <h3 className="text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE] mb-4">
                Mobile App
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mb-4">
                Download our mobile app for easier access to your finances on
                the go.
              </p>
              <button className="w-full bg-[#12B76A] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#0F9756] transition-colors">
                Download APK
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
