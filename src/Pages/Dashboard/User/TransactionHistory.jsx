import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useFetchData from "../../../hooks/useFetchData";
import Loader from "../../../Components/Common/Loader";
import formatDateTime from "../../../Components/Common/formatDateTime";

const TransactionHistory = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  // Loader animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 5));
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(
    ["userPayments", user?.email],
    `/payments/user?email=${user?.email}`,
    {
      enabled: !!user?.email && !loading,
    }
  );

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Loading your transactions..."
          subMessage="Fetching your payment history."
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
          Failed to load transaction history.
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
            Transaction History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View all your completed ticket payments. Keep track of your booking
            expenses over time.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Total transactions:{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {payments.length}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {payments.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No transactions yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Once you complete your first payment, your transaction history will
            appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Ticket Title
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Payment Date
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => {
                  const amount = Number(p.amount || 0);
                  const title = p.title || "N/A";
                  const date = p.paidAt ? formatDateTime(p.paidAt) : "N/A";
                  const status = p.paymentStatus || "paid";

                  return (
                    <tr
                      key={p._id}
                      className={`border-t border-slate-100 dark:border-slate-800 ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50/40 dark:bg-slate-900/60"
                      }`}
                    >
                      {/* Transaction ID */}
                      <td className="px-4 py-3 align-top font-mono text-[11px] text-slate-700 dark:text-slate-200 break-all">
                        {p.transactionId || "N/A"}
                      </td>

                      {/* Ticket Title */}
                      <td className="px-4 py-3 align-top">
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {title}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 align-top text-right text-slate-800 dark:text-slate-100 font-semibold">
                        ${amount.toFixed(2)}
                      </td>

                      {/* Payment Date */}
                      <td className="px-4 py-3 align-top text-center text-slate-700 dark:text-slate-200">
                        {date}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 align-top text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 capitalize">
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {payments.length}
              </span>{" "}
              transaction{payments.length !== 1 && "s"}.
            </span>
            <span>Only completed Stripe payments are listed here.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
