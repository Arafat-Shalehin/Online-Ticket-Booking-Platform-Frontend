import React from "react";

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-size='18' font-family='Arial'%3EUser%3C/text%3E%3C/svg%3E";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ReviewCard = ({
  name,
  avatar,
  rating,
  review,
  tripType,
  route,
  createdAt,
  verified,
}) => {
  const safeName = (name || "Anonymous").trim() || "Anonymous";
  const safeTripType = tripType || "Trip";
  const safeRoute = route || "—";
  const safeReview = review || "";
  const formattedDate = formatDate(createdAt);

  const ratingNum = Number(rating);
  const ratingSafe = Number.isFinite(ratingNum) ? clamp(ratingNum, 0, 5) : null;
  const ratingRounded = ratingSafe == null ? 0 : Math.round(ratingSafe);

  return (
    <article className="w-80 shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Top: avatar + name + meta */}
      <div className="mb-3 flex items-center gap-3">
        <img
          src={avatar || FALLBACK_AVATAR}
          alt={`${safeName} avatar`}
          className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {safeName}
            </p>

            {verified ? (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/20">
                Verified
              </span>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground">
            {safeTripType} ·{" "}
            <span className="text-foreground/80">{safeRoute}</span>
          </p>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {safeReview}
      </p>

      {/* Bottom: rating + date */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1" aria-label="Rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < ratingRounded ? "text-chart-3" : "text-muted-foreground/30"
              }
              aria-hidden="true"
            >
              ★
            </span>
          ))}

          <span className="ml-2 font-medium text-foreground/80">
            {ratingSafe == null ? "—" : ratingSafe.toFixed(1)}
          </span>
        </div>

        {formattedDate ? <span>{formattedDate}</span> : null}
      </div>
    </article>
  );
};

export default ReviewCard;
