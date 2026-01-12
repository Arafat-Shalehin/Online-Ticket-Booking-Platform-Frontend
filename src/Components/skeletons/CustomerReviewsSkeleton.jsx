import React from "react";

const ReviewCardSkeleton = () => {
  return (
    <article className="w-80 shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-3 w-40 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-muted animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted animate-pulse" />
        <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      </div>
    </article>
  );
};

const RowSkeleton = ({ count = 6 }) => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <ReviewCardSkeleton key={i} />
    ))}
  </div>
);

const CustomerReviewsSkeleton = () => {
  return (
    <section
      className="w-full bg-muted/30 py-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading customer reviews"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xl">
            <div className="h-3 w-40 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-8 w-72 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-full max-w-md rounded bg-muted animate-pulse" />
        </header>

        <div className="space-y-6">
          <RowSkeleton />
          <RowSkeleton />
        </div>

        <span className="sr-only">Loading…</span>
      </div>
    </section>
  );
};

export default CustomerReviewsSkeleton;
