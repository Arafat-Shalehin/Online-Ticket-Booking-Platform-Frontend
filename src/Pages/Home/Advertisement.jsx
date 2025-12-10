import React, { useEffect, useState } from "react";
import EachTickets from "../../Components/Cards/EachTickets";
import useSixTickets from "../../QueryOptions/sixTicketQuery";
import Loader from "../../Components/Common/Loader";

const Advertisement = () => {
  const { data: tickets, isLoading, isError } = useSixTickets();
  // console.log(tickets);

  // Loader progress code
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Finding Available Tickets..."
          subMessage="Accessing admin approved tickets..."
          progress={progress}
        />
      </div>
    );
  }
  if (isError)
    return (
      <p className="flex justify-center items-center text-2xl text-red-400 font-semibold">
        Failed to load tickets
      </p>
    );
  return (
    <section className="bg-[#E3E3E3] py-12 sm:py-16 mt-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Featured Tickets
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Exactly 6 curated offers, hand‑picked by our travel experts for
              this week.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500">
            Limited availability
          </p>
        </div>

        {/* Grid of 6 tickets */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket, index) => (
            <EachTickets key={index} ticket={ticket} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
