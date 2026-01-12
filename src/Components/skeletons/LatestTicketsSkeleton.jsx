import React from "react";

const TicketCardSkeleton = () => {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-[16/9] w-full bg-muted animate-pulse" />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full">
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
          </div>
          <div className="shrink-0 text-right">
            <div className="h-6 w-16 rounded bg-muted animate-pulse" />
            <div className="mt-2 h-3 w-14 rounded bg-muted animate-pulse" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </article>
  );
};

const LatestTicketsSkeleton = ({ count = 6 }) => {
  return (
    <section
      className="w-full bg-muted/30 py-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading latest tickets"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xl">
            <div className="h-8 w-52 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-4 w-full rounded bg-muted animate-pulse" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded bg-muted animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>

        <span className="sr-only">Loading…</span>
      </div>
    </section>
  );
};

export default LatestTicketsSkeleton;
