import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import formatDateTime from "../Common/formatDateTime";

const clampInt = (n, min, max) => {
  const x = Math.trunc(Number(n));
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
};

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
};

const BookNowModal = ({ isOpen, onClose, ticket }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const maxQuantityRaw = ticket?.ticketQuantity ?? ticket?.quantity ?? 0;
  const maxQuantity = Number.isFinite(Number(maxQuantityRaw))
    ? Math.max(0, Math.trunc(Number(maxQuantityRaw)))
    : 0;

  const departureDateTime = ticket?.departureDateTime || ticket?.departureTime;

  const departure = useMemo(() => {
    if (!departureDateTime) return null;
    const d = new Date(departureDateTime);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [departureDateTime]);

  const { isSoldOut, hasDeparted } = useMemo(() => {
    const now = new Date();
    return {
      isSoldOut: maxQuantity <= 0,
      hasDeparted: departure ? departure.getTime() <= now.getTime() : false,
    };
  }, [maxQuantity, departure]);

  const price = Number(ticket?.price);
  const priceText = formatMoney(ticket?.price);
  const totalText =
    Number.isFinite(price) && Number.isFinite(Number(quantity))
      ? formatMoney(price * Number(quantity))
      : "—";

  // Reset state per open/ticket (prevents stale errors/success/quantity)
  useEffect(() => {
    if (!isOpen) return;
    setQuantity(1);
    setError("");
    setSuccessMsg("");
    setSubmitting(false);
  }, [isOpen, ticket?._id]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Focus + Escape + basic focus trap
  useEffect(() => {
    if (!isOpen) return;

    // focus first interactive element
    setTimeout(() => {
      firstFieldRef.current?.focus?.();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (!submitting) onClose?.();
        return;
      }

      if (e.key !== "Tab") return;
      if (!dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, submitting]);

  if (!isOpen || !ticket) return null;

  const isDisabled = submitting || isSoldOut || hasDeparted || !user?.email;

  const title = ticket?.title || "Ticket";
  const from = ticket?.from || "—";
  const to = ticket?.to || "—";

  const helperText = isSoldOut
    ? "No tickets remaining for this trip."
    : hasDeparted
    ? "Departure time has passed. Booking is closed."
    : `You can book up to ${maxQuantity} tickets.`;

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

    const numQty = clampInt(quantity, 1, Math.max(1, maxQuantity));
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

        // Refresh relevant cached data
        queryClient.invalidateQueries({
          queryKey: ["booked-tickets"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["ticket", ticket._id],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["all-tickets"],
          exact: false,
        });

        setTimeout(() => {
          onClose?.();
        }, 400);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onMouseDown={() => {
        if (!submitting) onClose?.();
      }}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Book tickets for ${title}`}
        className="mx-4 w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              Book Tickets
            </h2>
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {title} • {from} → {to}
            </p>
            {departureDateTime ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Departure: {formatDateTime(departureDateTime)}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => !submitting && onClose?.()}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            aria-label="Close booking modal"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Price per ticket:{" "}
              <span className="font-semibold text-foreground">
                {priceText === "—" ? "—" : `$${priceText}`}
              </span>
            </span>

            <span className="text-xs text-muted-foreground">
              Available:{" "}
              <span
                className={`font-semibold ${
                  isSoldOut ? "text-destructive" : "text-foreground"
                }`}
              >
                {maxQuantity}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total (est.):</span>
            <span className="font-semibold text-foreground">
              {totalText === "—" ? "—" : `$${totalText}`}
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ticket Quantity
            </label>

            <div className="flex items-stretch gap-2">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() =>
                  setQuantity((q) =>
                    clampInt(Number(q) - 1, 1, Math.max(1, maxQuantity))
                  )
                }
                disabled={isDisabled || Number(quantity) <= 1}
              >
                −
              </button>

              <input
                ref={firstFieldRef}
                type="number"
                min={1}
                max={maxQuantity}
                step={1}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={() => {
                  // clamp on blur (keeps typing flexible)
                  setQuantity((q) => clampInt(q, 1, Math.max(1, maxQuantity)));
                }}
                disabled={isDisabled}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60"
                aria-label="Ticket quantity"
              />

              <button
                type="button"
                className="btn btn-sm"
                onClick={() =>
                  setQuantity((q) =>
                    clampInt(Number(q) + 1, 1, Math.max(1, maxQuantity))
                  )
                }
                disabled={isDisabled || Number(quantity) >= maxQuantity}
              >
                +
              </button>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {helperText}
            </p>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          ) : null}

          {successMsg ? (
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
              {successMsg}
            </div>
          ) : null}

          {!user?.email ? (
            <p className="text-[11px] text-muted-foreground">
              Please{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                log in
              </Link>{" "}
              to book tickets.
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => !submitting && onClose?.()}
              className="btn btn-sm btn-ghost"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isDisabled}
              className="btn btn-sm btn-primary"
            >
              {submitting
                ? "Booking…"
                : hasDeparted
                ? "Booking Closed"
                : isSoldOut
                ? "Sold Out"
                : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookNowModal;
