import React from "react";

const TicketCardSkeleton = () => (
  <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
    <div className="aspect-[16/9] w-full bg-muted animate-pulse" />
    <div className="p-4 sm:p-5">
      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
      <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      </div>
      <div className="mt-5 h-9 w-28 rounded bg-muted animate-pulse" />
    </div>
  </article>
);

const AllTicketsSkeleton = ({ count = 6 }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-8 w-40 rounded bg-muted animate-pulse" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-muted animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-2 h-3 w-20 rounded bg-muted animate-pulse" />
                <div className="h-10 w-full rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTicketsSkeleton;
