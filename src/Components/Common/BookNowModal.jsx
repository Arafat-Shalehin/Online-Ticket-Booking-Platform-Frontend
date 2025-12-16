import { useState, useMemo } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import formatDateTime from "../Common/formatDateTime";

const BookNowModal = ({ isOpen, onClose, ticket }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const maxQuantity = ticket.ticketQuantity ?? ticket.quantity ?? 0; // fallback for safety

  const departureDateTime = ticket?.departureDateTime || ticket?.departureTime;

  const departure = useMemo(() => {
    return departureDateTime ? new Date(departureDateTime) : null;
  }, [departureDateTime]);

  const { isSoldOut, hasDeparted } = useMemo(() => {
    const now = new Date();
    return {
      isSoldOut: maxQuantity <= 0,
      hasDeparted: departure ? departure <= now : false,
    };
  }, [maxQuantity, departure]);

  if (!isOpen || !ticket) return null;

  const isDisabled = submitting || isSoldOut || hasDeparted || !user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!user?.email) {
      setError("You must be logged in to book tickets.");
      return;
    }

    if (isSoldOut) {
      setError("This ticket is sold out.");
      return;
    }

    if (hasDeparted) {
      setError(
        "Departure time has passed. You can no longer book this ticket."
      );
      return;
    }

    const numQty = Number(quantity);

    if (!numQty || numQty < 1) {
      setError("Please enter a valid quantity (at least 1).");
      return;
    }

    if (numQty > maxQuantity) {
      setError(`You cannot book more than ${maxQuantity} tickets.`);
      return;
    }

    try {
      setSubmitting(true);

      const res = await axiosSecure.post(`/bookingTicket/${ticket._id}`, {
        quantity: numQty,
        status: "pending",
        userName: user?.displayName,
        userEmail: user?.email,
        vendorEmail: ticket?.vendorEmail,
      });

      if (res.data?.success) {
        setSuccessMsg(
          "Booking request created. Please wait for the vendor to approve."
        );
        toast.success(
          "Your booking request has been created. Awaiting vendor approval."
        );

        queryClient.invalidateQueries({
          queryKey: ["booked-tickets"],
          exact: false,
        });

        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.data?.message || "Could not create booking.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/80">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Book Tickets
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {ticket.title} • {ticket.from} → {ticket.to}
            </p>
            {departure && (
              <p className="mt-0.5 text-[11px] text-slate-400">
                Departure: {formatDateTime(departureDateTime)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="sr-only">Close</span>✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Price per ticket:{" "}
              <span className="font-semibold">
                ${Number(ticket.price).toFixed(2)}
              </span>
            </span>
            <span className="text-xs text-slate-500">
              Available:{" "}
              <span
                className={`font-semibold ${
                  isSoldOut ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {maxQuantity}
              </span>
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Ticket Quantity
            </label>
            <input
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isDisabled}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              {isSoldOut
                ? "No tickets remaining for this trip."
                : hasDeparted
                ? "Departure time has passed. Booking is closed."
                : `You can book up to ${maxQuantity} tickets.`}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {successMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting
                ? "Booking..."
                : hasDeparted
                ? "Booking Closed"
                : isSoldOut
                ? "Sold Out"
                : "Confirm Booking"}
            </button>
          </div>

          {!user?.email && (
            <p className="pt-1 text-[11px] text-amber-600">
              Please log in to book tickets.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookNowModal;
