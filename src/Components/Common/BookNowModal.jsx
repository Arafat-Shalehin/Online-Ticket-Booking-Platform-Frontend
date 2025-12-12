import { useState } from "react";
// import { useNavigate } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const BookNowModal = ({ isOpen, onClose, ticket }) => {
  const { user } = useAuth();
  // console.log(user);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || !ticket) return null;

  const maxQuantity = ticket.quantity ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

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
        ticketId: ticket._id,
        quantity: numQty,
        status: "Pending",
        userEmail: user?.email,
      });

      console.log(res.data);

      if (res.data?.success) {
        setSuccessMsg("Booking created but it is currently Pending.");

        queryClient.invalidateQueries({
          queryKey: ["booked-tickets"],
          exact: false,
        });
        setTimeout(() => {
          // navigate("/dashboard/user/my-booked-tickets");
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
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Book Tickets
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {ticket.title} • {ticket.from} → {ticket.to}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="sr-only">Close</span>✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Price per ticket:{" "}
              <span className="font-semibold">${ticket.price.toFixed(2)}</span>
            </span>
            <span className="text-xs text-slate-500">
              Available:{" "}
              <span className="font-semibold text-emerald-600">
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              You can book up to {maxQuantity} tickets.
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
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNowModal;
