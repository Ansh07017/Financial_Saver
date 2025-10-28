import { useState, useEffect } from "react";
import { ChevronRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="font-bold text-[#1F2937] dark:text-white text-sm">
          {data.fullDate}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
          ${payload[0].value}.00
        </p>
      </div>
    );
  }
  return null;
};

// Empty state component for the chart
const EmptyChartState = () => (
  <div className="h-80 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
        <Wallet className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#1F2937] dark:text-white">
          Start Your Financial Journey
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Add your first transaction to see your spending patterns and savings
          trends.
        </p>
      </div>
    </div>
  </div>
);

export default function SavingsChart() {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [savingsData, setSavingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        // For now, create sample data - this will be replaced with real API calls
        const sampleData = [
          {
            date: "Oct 2024",
            shortDate: "Oct",
            value: 45,
            fullDate: "October 2024",
          },
          {
            date: "Nov 2024",
            shortDate: "Nov",
            value: 78,
            fullDate: "November 2024",
          },
          {
            date: "Dec 2024",
            shortDate: "Dec",
            value: 125,
            fullDate: "December 2024",
          },
          {
            date: "Jan 2025",
            shortDate: "Jan",
            value: 92,
            fullDate: "January 2025",
          },
        ];

        setSavingsData(sampleData);
      } catch (error) {
        console.error("Error fetching savings data:", error);
        setSavingsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsData();
  }, []);

  // Check if we have data to display
  const hasData = savingsData && savingsData.length > 0;

  const totalSavings = hasData
    ? savingsData.reduce((sum, item) => sum + item.value, 0)
    : 0;
  const growthAmount = 175;
  const growthPercentage = 62.1;

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Breadcrumb Strip */}
      <div className="bg-[#F9FAFB] dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3">
        <div className="flex items-center text-sm">
          <span className="font-bold text-[#1F2937] dark:text-white">
            Financial Overview
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-2" />
          <span className="text-gray-500 dark:text-gray-400">
            Last 4 Months
          </span>
        </div>
      </div>

      {/* Chart Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Left: Chart Title */}
          <h3 className="text-xl lg:text-2xl font-bold text-[#1F2937] dark:text-white">
            Monthly Savings
          </h3>

          {/* Right: KPI Cluster */}
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
            {/* Primary Amount */}
            <div className="text-xl lg:text-2xl font-bold text-[#1F2937] dark:text-white">
              ${totalSavings.toLocaleString()}.00
            </div>

            {/* Growth Indicator */}
            {hasData && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-[#22D3EE] dark:text-[#22D3EE]" />
                <span className="text-[#22D3EE] dark:text-[#22D3EE] font-medium text-sm lg:text-base">
                  +${growthAmount}.00 ({growthPercentage}%)
                </span>
              </div>
            )}

            {/* Time Period */}
            <div className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
              Last 4 Months
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 lg:p-6">
        {hasData ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={savingsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onMouseMove={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setHoveredBar(state.activeTooltipIndex);
                  } else {
                    setHoveredBar(null);
                  }
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <CartesianGrid
                  strokeDasharray="none"
                  stroke={
                    typeof window !== "undefined" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "#374151"
                      : "#f3f4f6"
                  }
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="shortDate"
                  axisLine={{
                    stroke:
                      typeof window !== "undefined" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#6b7280"
                        : "#e5e7eb",
                    strokeWidth: 1,
                  }}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill:
                      typeof window !== "undefined" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#9ca3af"
                        : "#9ca3af",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill:
                      typeof window !== "undefined" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "#9ca3af"
                        : "#9ca3af",
                  }}
                  tickFormatter={(value) => `$${value}`}
                  domain={[0, 150]}
                  ticks={[0, 25, 50, 75, 100, 125]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                  position={{ y: 0 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {savingsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={hoveredBar === index ? "#22D3EE" : "#4F46E5"}
                      style={{
                        filter:
                          hoveredBar === index
                            ? "drop-shadow(0 0 6px rgba(34,211,238,0.3))"
                            : "none",
                        transition: "all 150ms ease-out",
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChartState />
        )}
      </div>
    </div>
  );
}
