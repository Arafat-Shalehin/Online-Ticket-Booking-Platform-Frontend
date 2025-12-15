import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

const ManageTickets = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  // Loader progress bar
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

  // Fetch all tickets for admin
  const {
    data: tickets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(["adminTickets"], "/tickets/admin", {
    enabled: !!user?.email, // and route should be admin-protected
  });

  const { mutate: mutateTicketStatus, isPending: isMutating } =
    useApiMutation();

  const handleApprove = (id) => {
    mutateTicketStatus(
      { url: `/tickets/${id}/approve`, method: "patch" },
      {
        onSuccess: () => {
          toast.success("Ticket approved. It will now appear in All Tickets.");
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to approve ticket. Please try again."
          );
        },
      }
    );
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject this ticket?",
      text: "This will hide the ticket from users.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, reject it",
    }).then((result) => {
      if (result.isConfirmed) {
        mutateTicketStatus(
          { url: `/tickets/${id}/reject`, method: "patch" },
          {
            onSuccess: () => {
              toast.info("Ticket rejected.");
              refetch();
            },
            onError: (err) => {
              console.error(err);
              toast.error(
                err?.response?.data?.message ||
                  "Failed to reject ticket. Please try again."
              );
            },
          }
        );
      }
    });
  };

  // Loading
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Loading tickets..."
          subMessage="Please wait while we fetch all vendor tickets."
          progress={progress}
        />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">Failed to load tickets.</p>
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

  const getStatusClass = (status) =>
    statusStyles[status] || statusStyles.pending;

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
            Manage Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review all vendor-added tickets. Approve to show them on the
            platform or reject to hide them.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {tickets.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-3xl">🎫</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No tickets found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Once vendors add tickets, they will appear here for your review and
            approval.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Ticket
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Route
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Transport
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => {
                  const status = ticket.verificationStatus || "pending";
                  const statusClass = getStatusClass(status);
                  const quantity =
                    ticket.ticketQuantity ?? ticket.quantity ?? 0;
                  const departure =
                    ticket.departureDateTime || ticket.departureTime;

                  return (
                    <tr
                      key={ticket._id}
                      className={`border-t border-slate-100 dark:border-slate-800 ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50/40 dark:bg-slate-900/60"
                      }`}
                    >
                      {/* Ticket info */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {ticket.title}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {ticket._id}
                          </span>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {ticket.vendorName || "Unknown Vendor"}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {ticket.vendorEmail}
                          </span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {ticket.from} → {ticket.to}
                          </span>
                          {departure && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Departs: {new Date(departure).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Transport */}
                      <td className="px-4 py-3 text-center align-top text-slate-700 dark:text-slate-200">
                        {ticket.transportType}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-center align-top text-slate-800 dark:text-slate-100 font-semibold">
                        {ticket.price} ৳
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3 text-center align-top text-slate-700 dark:text-slate-200 font-semibold">
                        {quantity}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center align-top">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(ticket._id)}
                            disabled={isMutating || status === "approved"}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(ticket._id)}
                            disabled={isMutating || status === "rejected"}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          >
                            Reject
                          </button>
                        </div>
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
              Total tickets:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {tickets.length}
              </span>
            </span>
            <span>Use Approve to show tickets on the All Tickets page.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
