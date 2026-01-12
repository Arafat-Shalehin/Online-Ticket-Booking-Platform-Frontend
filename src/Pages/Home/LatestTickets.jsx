import React from "react";
import { Link } from "react-router-dom";
import useLatestTickets from "../../QueryOptions/UserFunctions/latestTicketQuery";
import LatestTicketsSkeleton from "../../Components/skeletons/LatestTicketsSkeleton";
import EachTickets from "../../Components/Cards/EachTickets";

const LatestTickets = () => {
  const query = useLatestTickets();
  const { data: tickets = [], isFetching, isError, error, refetch } = query;

  // v4/v5 safe initial loading detection
  const isInitialLoading = query.isPending ?? query.isLoading;

  if (isInitialLoading) return <LatestTicketsSkeleton count={6} />;

  if (isError) {
    return (
      <section className="w-full bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-destructive">
                Failed to load latest tickets
                {error?.message ? (
                  <span className="font-normal text-destructive/80">
                    : {error.message}
                  </span>
                ) : null}
                .
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-sm btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!tickets.length) {
    return (
      <section className="w-full bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              No latest tickets yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              New tickets will appear here as vendors add them.
            </p>
            <div className="mt-5">
              <Link to="/tickets" className="btn btn-sm btn-primary">
                Browse all tickets
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Latest Tickets
              </h2>

              {/* Background refresh indicator (does NOT replace content) */}
              {isFetching && (
                <span
                  className="loading loading-spinner loading-sm text-primary"
                  aria-label="Refreshing latest tickets"
                />
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {tickets.length} newly added tickets for your comfort.
            </p>
          </div>

          <Link to="/tickets" className="btn btn-sm btn-ghost">
            View all
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket, index) => (
            <EachTickets
              key={ticket?._id ?? index}
              ticket={ticket}
              index={index}
              badgeLabel="New"
              badgeTone="accent"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestTickets;
