import React from "react";

const PlaceCardSkeleton = () => (
  <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
    <div className="aspect-[16/10] w-full bg-muted animate-pulse" />
    <div className="p-4">
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
      <div className="mt-3 h-3 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  </article>
);

const PopularPlacesSkeleton = ({ count = 3 }) => {
  return (
    <section
      className="w-full bg-background py-12"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading popular places"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xl">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="mt-3 h-8 w-80 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-full max-w-md rounded bg-muted animate-pulse" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPlacesSkeleton;
