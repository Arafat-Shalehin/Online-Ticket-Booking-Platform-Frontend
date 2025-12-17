import { useEffect, useMemo, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";

const AdvertiseTickets = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  // Loader progress animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 5));
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  // Fetch all approved tickets that can be advertised
  const {
    data: tickets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(["advertiseTickets"], "/tickets/advertise", {
    enabled: !!user?.email,
  });

  // console.log(tickets);

  const { mutate: toggleAdvertise, isPending: isToggling } = useApiMutation();

  const advertisedCount = useMemo(
    () => tickets.filter((t) => t.advertised).length,
    [tickets]
  );

  const handleToggle = (ticket) => {
    const desired = !ticket.advertised;

    if (desired && !ticket.advertised && advertisedCount >= 6) {
      toast.error("You can only advertise up to 6 tickets at a time.");
      return;
    }

    toggleAdvertise(
      {
        url: `/tickets/${ticket._id}/advertise`,
        method: "patch",
        body: { advertised: desired },
      },
      {
        onSuccess: () => {
          toast.success(
            desired ? "Ticket advertised successfully." : "Ticket unadvertised."
          );
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to update advertise status. Please try again."
          );
        },
      }
    );
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Loading tickets..."
          subMessage="Fetching approved tickets for advertisement."
          progress={progress}
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">
          Failed to load tickets for advertisement.
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
            Advertise Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose up to 6 approved tickets to highlight in the homepage
            advertisement section.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-700 dark:text-slate-200 font-semibold">
              {advertisedCount}
            </span>
            <span>/ 6 advertised</span>
          </span>
        </div>
      </div>

      {/* Empty state */}
      {tickets.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-3xl">🎫</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No approved tickets
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Once vendors add tickets and you approve them, they will appear here
            so you can choose which ones to advertise.
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
                    Advertise
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => {
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
                      {/* Ticket */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-3">
                          {ticket.image && (
                            <img
                              src={ticket.image}
                              alt={ticket.title}
                              className="h-10 w-16 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {ticket.title}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              ID: {ticket._id}
                            </span>
                          </div>
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

                      {/* Advertise toggle */}
                      <td className="px-4 py-3 text-center align-top">
                        <button
                          type="button"
                          onClick={() => handleToggle(ticket)}
                          disabled={isToggling}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium border transition hover:cursor-pointer ${
                            ticket.advertised
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span
                            className={`mr-1 h-2 w-2 rounded-full ${
                              ticket.advertised
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {ticket.advertised ? "On" : "Off"}
                        </button>
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
              Total approved tickets:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {tickets.length}
              </span>
            </span>
            <span>Maximum of 6 tickets can be advertised at a time.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiseTickets;
