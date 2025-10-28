import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  PiggyBank,
  DollarSign,
  DownloadCloud,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";

// Sample transaction data
const sampleTransactions = [
  {
    id: 1,
    account: {
      name: "Chase Checking",
      type: "Checking Account",
      number: "...3731",
      logo: "chase",
    },
    date: "Jan 15, 2025",
    merchant: "Starbucks",
    description: "Coffee Purchase",
    amount: 5.85,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: 2,
    account: {
      name: "Chase Checking",
      type: "Checking Account",
      number: "...3731",
      logo: "chase",
    },
    date: "Jan 14, 2025",
    merchant: "Salary Deposit",
    description: "Monthly Salary",
    amount: 5000.0,
    category: "Salary",
    type: "income",
  },
  {
    id: 3,
    account: {
      name: "Chase Checking",
      type: "Checking Account",
      number: "...3731",
      logo: "chase",
    },
    date: "Jan 13, 2025",
    merchant: "Amazon",
    description: "Online Purchase",
    amount: 124.99,
    category: "Shopping",
    type: "expense",
  },
];

const AccountLogo = ({ account }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-[#4F46E5] dark:bg-[#4F46E5] flex items-center justify-center shadow-sm">
      <DollarSign className="w-4 h-4 text-white" />
    </div>
  );
};

const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>
      <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition-colors">
        <Plus className="w-4 h-4" />
        Add Transaction
      </button>
    </div>
  </div>
);

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTransactions = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTransactions(sampleTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 dark:bg-gray-600 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <h2 className="text-xl lg:text-2xl font-bold text-[#1F2937] dark:text-white">
          Recent Transactions
        </h2>

        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              className="block w-full lg:w-64 pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E293B] placeholder-gray-500 dark:placeholder-gray-400 text-[#1F2937] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-[#4F46E5] focus:border-transparent transition-colors duration-150"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E293B] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg transition-colors duration-150">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Add your first transaction to start tracking your finances."
          icon={FileText}
        />
      ) : (
        <div className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#F9FAFB] dark:bg-[#0F172A]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Account & Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AccountLogo account={transaction.account} />
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1F2937] dark:text-white truncate">
                            {transaction.merchant}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {transaction.account.name} (
                            {transaction.account.number})
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[#1F2937] dark:text-white text-sm">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.type === "income"
                              ? "bg-[#22D3EE]"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {transaction.category}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-[#22D3EE] dark:text-[#22D3EE]"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
