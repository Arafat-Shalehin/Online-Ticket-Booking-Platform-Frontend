import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EachTickets from "../../Components/Cards/EachTickets";
import useSixTickets from "../../QueryOptions/UserFunctions/sixTicketQuery";
import Loader from "../../Components/Common/Loader";
import AdvertisementSkeleton from "../../Components/skeletons/AdvertisementSkeleton";

const Advertisement = () => {
  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSixTickets();

  if (isLoading) {
    return <AdvertisementSkeleton count={6} />;
  }

  if (!isError && tickets.length === 0) {
    return (
      <section className="w-full bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted text-lg">
              <span aria-hidden>📢</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No featured tickets yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Check back soon—our admins will highlight top deals here as they
              become available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-destructive">
                Failed to load featured tickets.
                <span className="font-normal text-destructive/80">
                  {" "}
                  Please try again.
                </span>
              </p>

              {typeof refetch === "function" && (
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn btn-sm btn-primary"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Featured Tickets
              </h2>
              {isFetching && (
                <span
                  className="loading loading-spinner loading-sm text-primary"
                  aria-label="Refreshing featured tickets"
                />
              )}
            </div>

            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {tickets.length} curated offers, hand‑picked by our admins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/15">
              Limited availability
            </span>

            {/* Adjust this route if your list page uses a different path */}
            <Link to="/tickets" className="btn btn-sm btn-ghost">
              View all
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket, index) => (
            <EachTickets
              key={ticket?._id ?? index}
              ticket={ticket}
              index={index}
              badgeLabel="Featured"
              badgeTone="primary"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisement;
