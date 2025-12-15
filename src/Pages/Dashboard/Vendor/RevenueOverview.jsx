import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useFetchData from "../../../hooks/useFetchData";
import Loader from "../../../Components/Common/Loader";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#6366f1"]; // sky-500, green-500, indigo-500

const RevenueOverview = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  // Loader progress animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  // Fetch vendor stats
  const {
    data: stats = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(
    ["vendorStats", user?.email],
    `/stats/vendor?email=${user?.email}`,
    {
      enabled: !!user?.email,
    }
  );

  const totalRevenue = Number(stats.totalRevenue || 0);
  const totalTicketsSold = Number(stats.totalTicketsSold || 0);
  const totalTicketsAdded = Number(stats.totalTicketsAdded || 0);

  const chartData = [
    { name: "Total Revenue (৳)", value: totalRevenue },
    { name: "Tickets Sold", value: totalTicketsSold },
    { name: "Tickets Added", value: totalTicketsAdded },
  ];

  const isAllZero =
    totalRevenue === 0 && totalTicketsSold === 0 && totalTicketsAdded === 0;

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Analyzing your performance..."
          subMessage="Gathering revenue and ticket statistics."
          progress={progress}
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">
          Failed to load revenue overview.
        </p>
        <p className="text-sm text-slate-500 mb-4">
          {error?.message || "Something went wrong."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
            Revenue Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your total revenue, ticket sales, and the number of tickets
            you&apos;ve added.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Total Revenue
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            ৳{" "}
            {totalRevenue.toLocaleString("en-BD", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sum of all paid bookings
          </p>
        </div>

        {/* Total Tickets Sold */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Tickets Sold
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {totalTicketsSold.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total seats sold (paid bookings)
          </p>
        </div>

        {/* Total Tickets Added */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Tickets Added
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {totalTicketsAdded.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total tickets you have created
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Performance Breakdown
        </h3>

        {isAllZero ? (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            You don&apos;t have any paid bookings yet. Once users complete their
            payments, you&apos;ll see your revenue and sales breakdown here.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent < 0.05
                      ? null
                      : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    if (name.includes("Revenue")) {
                      return [
                        `৳ ${Number(value).toLocaleString("en-BD", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`,
                        name,
                      ];
                    }
                    return [Number(value).toLocaleString(), name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueOverview;
