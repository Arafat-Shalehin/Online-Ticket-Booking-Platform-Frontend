// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import useFetchData from "../../../Hooks/useFetchData";
// import Loader from "../../../Components/Common/Loader";
// import useAuth from "../../../Hooks/useAuth";
// import useAxiosSecure from "../../../Hooks/useAxiosSecure";

// const Payment = () => {
//   const { ticketId } = useParams();
//   console.log(ticketId);
//   const { user, loading } = useAuth();
//   const [progress, setProgress] = useState(0);
//   const axiosSecure = useAxiosSecure();

//   const {
//     data: ticket,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useFetchData(["ticketId", ticketId], `/singleTicket/${ticketId}`, {
//     enabled: !!ticketId && !!user?.accessToken && !loading,
//   });
//     console.log(ticket);

//   // Loader Logic
//   useEffect(() => {
//     if (!isLoading) return;

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 90) return prev;
//         return prev + 5;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   const handlePayment = async () => {
//     const paymentInfo = {
//       title: ticket.title,
//       totalPrice: ticket.price * ticket.quantity,
//       ticketId: ticket._id,
//       userEmail: user?.email,
//     };

//     const res = await axiosSecure.post("/create-checkout-session", paymentInfo);
//     console.log(res.data);
//     window.location.href = res.data.url;
//   };

//   //   Loading and error states
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center bg-white">
//         <Loader
//           message="Finding Your Ticket you wanted to pay..."
//           subMessage="It may take a while..."
//           progress={progress}
//         />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 text-center">
//         <p className="text-red-600 font-medium mb-2">
//           Failed to load your ticket.
//         </p>
//         <p className="text-sm text-slate-500 mb-4">
//           {error?.message || "Something went wrong."}
//         </p>
//         <button
//           onClick={() => refetch()}
//           className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }
//   return (
//     <div>
//       <h1>Payment</h1>
//       <button onClick={handlePayment} className="px-6 py-1 bg-green-500">
//         Pay
//       </button>
//     </div>
//   );
// };

// export default Payment;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchData from "../../../Hooks/useFetchData";
import Loader from "../../../Components/Common/Loader";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import formatDateTime from "../../../Components/Common/formatDateTime";
import {
  HiOutlineLocationMarker,
  HiOutlineArrowRight,
  HiOutlineClock,
} from "react-icons/hi";
import { toast } from "react-toastify";

const Payment = () => {
  const { ticketId } = useParams();
  // console.log(ticketId);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [progress, setProgress] = useState(0);
  const [paying, setPaying] = useState(false);

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(["booking", ticketId], `/bookings/${ticketId}`, {
    enabled: !!ticketId && !!user?.email && !loading,
  });

  // Loader Logic
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 5));
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!ticketId) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium">
          Invalid payment URL. Booking ID is missing.
        </p>
      </div>
    );
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Loading your booking details..."
          subMessage="Preparing payment information."
          progress={progress}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">
          Failed to load booking details.
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

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium">Booking not found.</p>
      </div>
    );
  }

  const {
    title,
    image,
    from,
    to,
    departureDateTime,
    bookedQuantity,
    unitPrice,
    totalPrice,
    status,
    userEmail,
  } = booking;

  const now = new Date();
  const departure = departureDateTime ? new Date(departureDateTime) : null;
  const hasDeparted = departure ? departure <= now : false;

  const canPay =
    status === "accepted" &&
    !hasDeparted &&
    totalPrice > 0 &&
    userEmail === user?.email;

  const handlePayment = async () => {
    if (!canPay) return;
    try {
      setPaying(true);
      const res = await axiosSecure.post("/create-checkout-session", {
        ticketId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to initialize payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: booking summary */}
          <div className="relative h-56 md:h-full">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-2 text-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-300">
                You&apos;re booking
              </p>
              <h1 className="text-lg font-semibold line-clamp-2">{title}</h1>
              <p className="flex items-center gap-1.5 text-xs">
                <HiOutlineLocationMarker className="h-3.5 w-3.5 text-sky-300" />
                <span>{from}</span>
                <HiOutlineArrowRight className="h-3 w-3 text-slate-200" />
                <span>{to}</span>
              </p>
              {departure && (
                <p className="flex items-center gap-1.5 text-xs text-slate-200">
                  <HiOutlineClock className="h-3.5 w-3.5" />
                  <span>{formatDateTime(departureDateTime)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right: payment details */}
          <div className="p-6 md:p-7 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Payment Summary
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
                Complete your payment
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Booking ID:{" "}
                <span className="font-mono text-[11px]">
                  {ticketId?.slice(-8)}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Tickets
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {bookedQuantity} x ${unitPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 mt-1">
                <span className="text-slate-600 dark:text-slate-300">
                  Total Amount
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  ${Number(totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>
                Status:{" "}
                <span className="font-semibold capitalize">{status}</span>
              </p>
              {hasDeparted && (
                <p className="text-rose-500">
                  Departure time has passed. You can no longer complete this
                  payment.
                </p>
              )}
              {!hasDeparted && status !== "accepted" && (
                <p>
                  You can only pay for bookings that have been accepted by the
                  vendor.
                </p>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={handlePayment}
                disabled={!canPay || paying}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-400/40 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {paying
                  ? "Redirecting to Stripe..."
                  : canPay
                  ? "Pay with Stripe"
                  : "Payment Unavailable"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/user/my-booked-tickets")}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline-offset-2 hover:underline"
              >
                Back to My Booked Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
