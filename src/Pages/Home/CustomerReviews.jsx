import React, { useMemo } from "react";
import Marquee from "react-fast-marquee";
import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";

import ReviewCard from "../../Components/Cards/ReviewCard";
import CustomerReviewsSkeleton from "../../Components/skeletons/CustomerReviewsSkeleton";

const fetchReviews = async () => {
  const res = await fetch("/customerReview.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load customer reviews");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

/**
 * Makes cards fade out as they approach the left/right edges.
 * This uses CSS masking so the *content itself* fades (not an overlay).
 */
const EdgeFadeMask = ({ children }) => {
  return (
    <div
      className="
        relative overflow-hidden
        [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
        [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
      "
    >
      {children}
    </div>
  );
};

const ScrollRow = ({ items }) => (
  <EdgeFadeMask>
    <div className="flex gap-4 overflow-x-auto pb-2 pr-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((review, idx) => (
        <div key={review?.id ?? idx} className="shrink-0 snap-start">
          <ReviewCard {...review} />
        </div>
      ))}
    </div>
  </EdgeFadeMask>
);

const CustomerReviews = () => {
  const reduceMotion = useReducedMotion();

  const query = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const reviews = query.data ?? [];
  const isInitialLoading = query.isPending ?? query.isLoading;

  const { row1, row2 } = useMemo(() => {
    const safe = Array.isArray(reviews) ? reviews : [];
    return {
      row1: safe.filter((_, index) => index % 2 === 0),
      row2: safe.filter((_, index) => index % 2 === 1),
    };
  }, [reviews]);

  if (isInitialLoading) return <CustomerReviewsSkeleton />;

  if (query.isError) {
    return (
      <section className="w-full bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-destructive">
                Couldn’t load customer reviews. Please try again.
              </p>
              <button
                type="button"
                onClick={() => query.refetch()}
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

  // Keep homepage clean: if no reviews, hide the entire section.
  if (!reviews.length) return null;

  return (
    <section className="w-full bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Customer feedback
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What our travelers say
            </h2>
          </div>

          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Real stories from travelers across Bangladesh.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-6">
          {reduceMotion ? (
            <>
              <ScrollRow items={row1} />
              {row2.length ? <ScrollRow items={row2} /> : null}
            </>
          ) : (
            <>
              <EdgeFadeMask>
                <Marquee pauseOnHover speed={42} gradient={false}>
                  {row1.map((review, idx) => (
                    <div key={review?.id ?? idx} className="px-2">
                      <ReviewCard {...review} />
                    </div>
                  ))}
                </Marquee>
              </EdgeFadeMask>

              {row2.length ? (
                <EdgeFadeMask>
                  <Marquee
                    pauseOnHover
                    speed={34}
                    direction="right"
                    gradient={false}
                  >
                    {row2.map((review, idx) => (
                      <div key={review?.id ?? idx} className="px-2">
                        <ReviewCard {...review} />
                      </div>
                    ))}
                  </Marquee>
                </EdgeFadeMask>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
