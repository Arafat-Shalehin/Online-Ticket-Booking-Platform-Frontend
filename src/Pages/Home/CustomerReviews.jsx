import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import ReviewCard from "../../Components/Cards/ReviewCard";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/customerReview.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to load customer reviews:", err));
  }, []);

  if (!reviews.length) return null;

  // Split into 2 rows (even / odd index)
  const row1 = reviews.filter((_, index) => index % 2 === 0);
  const row2 = reviews.filter((_, index) => index % 2 === 1);

  return (
    <section className="bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Customer feedback
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              What our travelers say
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Real, verified reviews from trips across Bangladesh. Updated
            dynamically from recent bookings.
          </p>
        </header>

        <div className="space-y-6">
          {/* Row 1 */}
          <Marquee
            pauseOnHover
            speed={45}
            gradient
            gradientColor={[15, 23, 42]}
          >
            {row1.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Marquee>

          {/* Row 2 (reverse direction for subtle variation) */}
          <Marquee
            pauseOnHover
            speed={35}
            direction="right"
            gradient
            gradientColor={[15, 23, 42]}
            gradientWidth={80}
          >
            {row2.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
