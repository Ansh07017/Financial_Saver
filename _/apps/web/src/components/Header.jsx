import { ArrowLeft, ChevronDown, Filter, Calendar } from "lucide-react";

export default function Header() {
  return (
    <div className="h-16 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 flex items-center justify-between shadow-sm dark:shadow-none">
      {/* Left cluster - brand + quick back action */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          {/* Square icon with MF */}
          <div className="w-8 h-8 bg-[#4F46E5] dark:bg-[#4F46E5] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">MF</span>
          </div>

          {/* Wordmark */}
          <div className="ml-2 flex items-center">
            <span className="text-[#1F2937] dark:text-white font-medium text-lg">
              Money
            </span>
            <span className="text-[#4F46E5] dark:text-[#22D3EE] font-medium text-lg">
              Flow
            </span>
          </div>
        </div>

        {/* Divider + back arrow */}
        <div className="flex items-center ml-4">
          <div className="w-px h-6 bg-[#E4E4E4] dark:bg-gray-600"></div>
          <button className="ml-4 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 rounded transition-colors duration-150">
            <ArrowLeft
              size={24}
              strokeWidth={1.5}
              className="text-[#B0B0B0] dark:text-gray-400 hover:text-[#8A8A8A] dark:hover:text-gray-300 transition-colors duration-150"
            />
          </button>
        </div>
      </div>

      {/* Center cluster - section tabs */}
      <div className="flex items-center space-x-7">
        <button className="relative text-[#4F46E5] dark:text-[#22D3EE] font-medium text-[15px] tracking-[-0.15px] hover:text-[#4338CA] dark:hover:text-[#06B6D4] active:text-[#3730A3] dark:active:text-[#0891B2] transition-colors duration-150">
          Dashboard
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4F46E5] dark:bg-[#22D3EE]"></div>
        </button>
        <button className="text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] tracking-[-0.15px] hover:text-[#1F2937] dark:hover:text-white active:text-[#111111] dark:active:text-white transition-colors duration-150">
          Transactions
        </button>
        <button className="text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] tracking-[-0.15px] hover:text-[#1F2937] dark:hover:text-white active:text-[#111111] dark:active:text-white transition-colors duration-150">
          Budgets
        </button>
        <button className="text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] tracking-[-0.15px] hover:text-[#1F2937] dark:hover:text-white active:text-[#111111] dark:active:text-white transition-colors duration-150">
          Goals
        </button>
        <button className="text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] tracking-[-0.15px] hover:text-[#1F2937] dark:hover:text-white active:text-[#111111] dark:active:text-white transition-colors duration-150">
          Analytics
        </button>
        <button className="flex items-center text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] tracking-[-0.15px] hover:text-[#1F2937] dark:hover:text-white active:text-[#111111] dark:active:text-white transition-colors duration-150 group">
          <Calendar
            size={16}
            className="mr-2 group-hover:text-[#1F2937] dark:group-hover:text-white group-active:text-[#111111] dark:group-active:text-white transition-colors duration-150"
          />
          Monthly Summary
        </button>
      </div>

      {/* Right cluster - contextual controls */}
      <div className="flex items-center space-x-3">
        {/* Date-range dropdown */}
        <button className="flex items-center px-5 py-2 border border-[#D1D1D1] dark:border-gray-600 rounded-lg bg-white dark:bg-[#1E293B] hover:border-[#B8B8B8] dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 active:border-[#A0A0A0] dark:active:border-gray-400 transition-colors duration-150">
          <span className="text-[#1F2937] dark:text-white font-medium text-[15px] tracking-[-0.1px]">
            Last 3 Months
          </span>
          <ChevronDown
            size={14}
            className="ml-2 text-[#8A8A8A] dark:text-gray-400"
          />
        </button>

        {/* Filters button */}
        <button className="flex items-center px-5 py-2 border border-[#D1D1D1] dark:border-gray-600 rounded-lg bg-transparent hover:border-[#B8B8B8] dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 active:border-[#A0A0A0] dark:active:border-gray-400 transition-colors duration-150 group">
          <Filter
            size={16}
            className="text-[#8A8A8A] dark:text-gray-400 group-hover:text-[#1F2937] dark:group-hover:text-white group-active:text-[#111111] dark:group-active:text-white transition-colors duration-150"
          />
          <span className="ml-2 text-[#6F6F6F] dark:text-gray-400 font-medium text-[15px] group-hover:text-[#1F2937] dark:group-hover:text-white group-active:text-[#111111] dark:group-active:text-white transition-colors duration-150">
            Filters
          </span>
        </button>
      </div>
    </div>
  );
}
