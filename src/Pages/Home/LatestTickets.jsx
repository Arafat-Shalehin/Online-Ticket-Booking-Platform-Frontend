import React from "react";
import useLatestTickets from "../../QueryOptions/UserFunctions/latestTicketQuery";
import { useState } from "react";
import { useEffect } from "react";
import EachTickets from "../../Components/Cards/EachTickets";
import Loader from "../../Components/Common/Loader";

const LatestTickets = () => {
  const { data: tickets, isFetching, isError } = useLatestTickets();
  // console.log(tickets);

  // Loader progress code
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isFetching) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFetching]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Finding Latest Tickets..."
          subMessage="Accessing update tickets..."
          progress={progress}
        />
      </div>
    );
  }
  if (isError)
    return (
      <p className="flex justify-center items-center text-2xl text-red-400 font-semibold">
        Failed to load latest tickets.
      </p>
    );
  return (
    <section className="bg-[#E3E3E3] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row items-center justify-center">
          <div>
            <h2 className="text-5xl text-center mb-3 font-bold tracking-tight text-black sm:text-3xl">
              Latest Tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {tickets?.length} more newly added tickets for your comfort
            </p>
          </div>
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

export default LatestTickets;
