import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../Hooks/useAuth";
import useBookingTickets from "../../../QueryOptions/UserFunctions/bookingTickets";
import BookingCard from "../../../Components/Cards/BookingCard";
import Header from "../../../Components/Common/Header";
import Loader from "../../../Components/Common/Loader";
import EmptyState from "../../../Components/Common/EmptyState";

const MyBookedTickets = ({ onPay }) => {
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState(null);
  const [progress, setProgress] = useState(0);

  const {
    data: bookings = [],
    isFetching,
    isError,
    refetch,
  } = useBookingTickets({ email: user?.email });

  // console.log(bookings);

  // Loader Logic
  useEffect(() => {
    if (!isFetching) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFetching]);

  // Will work on this later.
  const handlePay = async ({ bookingId, totalPrice, booking }) => {
    try {
      setProcessingId(bookingId);

      // Have to Call parent handler
      if (onPay) {
        // await onPay({ bookingId, totalPrice, booking, refetch });
      } else {
        console.log(
          "Trigger Stripe payment with:",
          bookingId,
          totalPrice,
          booking
        );
        // After successful payment, refetch()
        await refetch();
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Finding Your Booked Tickets..."
          subMessage="Accessing tickets for your booked page..."
          progress={progress}
        />
      </div>
    );
  }
  if (isError)
    return (
      <p className="flex justify-center items-center text-2xl text-red-400 font-semibold">
        Failed to load your BOOKED Tickets.
      </p>
    );

  return (
    <section className="space-y-6 px-20 py-5">
      <Header count={bookings.length} />

      {bookings?.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking._id || index}
              booking={booking}
              index={index}
              onPay={handlePay}
              isPaying={processingId === booking._id}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default MyBookedTickets;
