import useCountdown from "../../Hooks/useCountdown";
import formatDateTime from "../Common/formatDateTime";
import { motion } from "framer-motion";
import StatusBadge from "../Common/StatusBadge";
import {
  HiOutlineTicket,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiArrowRight,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import Countdown from "../Common/Countdown";

const BookingCard = ({ booking, index, onPay, isPaying }) => {
  const {
    _id,
    title,
    image,
    from,
    to,
    departureTime,
    status = "pending",
    bookedQuantity,
    unitPrice,
    totalPrice,
  } = booking;

  const countdown = useCountdown(departureTime);
  const isExpired = countdown?.isExpired;

  const canPay =
    status === "accepted" && !isExpired && !isPaying && totalPrice > 0;

    // Will work on this later.
  const handlePayClick = () => {
    if (!canPay) return;
    if (onPay) {
      onPay({ bookingId: _id, totalPrice, booking });
    } else {
      console.warn("onPay handler is not defined for BookingCard");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/60 ring-1 ring-transparent transition-all duration-300 hover:shadow-xl hover:shadow-sky-200/60 hover:ring-sky-200/80 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-sky-500/50 dark:hover:ring-sky-500/40"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/0 to-slate-900/0" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusBadge status={status} />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-100/90">
          <div className="flex items-center gap-1.5">
            <HiOutlineTicket className="h-4 w-4 text-sky-300" />
            <span className="line-clamp-1 font-medium">{title}</span>
          </div>
          <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[11px]">
            Qty: {bookedQuantity}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Route + date */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900 dark:text-slate-50">
              <HiOutlineLocationMarker className="h-4 w-4 text-sky-500" />
              <span className="truncate">{from}</span>
              <HiArrowRight className="h-3 w-3 text-slate-400" />
              <span className="truncate">{to}</span>
            </p>
            <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <HiOutlineClock className="h-3.5 w-3.5" />
              <span>{formatDateTime(departureTime)}</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total
            </p>
            <p className="flex items-center justify-end gap-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
              <HiOutlineCurrencyDollar className="h-4 w-4 text-emerald-500" />
              {totalPrice}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {unitPrice} / ticket
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="border-t border-dashed border-slate-200 pt-2 dark:border-slate-700">
          <Countdown
            countdown={countdown}
            departureDateTime={departureTime}
            status={status}
          />
        </div>

        {/* Info line */}
        <div className="mt-auto space-y-1.5 text-[11px]">
          {status === "pending" && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
              <HiOutlineClock className="h-3.5 w-3.5" />
              <span>Waiting for vendor approval.</span>
            </div>
          )}

          {status === "accepted" && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-300">
              <HiCheckCircle className="h-3.5 w-3.5" />
              <span>
                Approved by vendor. Complete payment before departure.
              </span>
            </div>
          )}

          {status === "rejected" && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-300">
              <HiXCircle className="h-3.5 w-3.5" />
              <span>Booking was rejected. You will not be charged.</span>
            </div>
          )}

          {status === "paid" && (
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-300">
              <HiCheckCircle className="h-3.5 w-3.5" />
              <span>
                Payment completed. See Transaction History for details.
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            <span className="font-medium text-slate-500 dark:text-slate-300">
              Booking ID:
            </span>{" "}
            <span className="font-mono text-[10px] opacity-80">
              {_id?.slice(-8) || "N/A"}
            </span>
          </div>

          {status === "accepted" && (
            <button
              type="button"
              disabled={!canPay}
              onClick={handlePayClick}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${
                canPay
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-400/40 hover:bg-sky-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
              }`}
            >
              {isPaying && (
                <span className="h-3 w-3 animate-spin rounded-full border border-white/40 border-t-transparent" />
              )}
              <span>{isExpired ? "Departure Passed" : "Pay Now"}</span>
            </button>
          )}

          {status !== "accepted" && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {status === "paid"
                ? "Already paid"
                : status === "rejected"
                ? "No further action required"
                : "Awaiting vendor decision"}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default BookingCard;
