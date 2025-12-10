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
  const date = new Date(createdAt);
  const formattedDate = isNaN(date)
    ? ""
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <article className="mx-3 w-80 shrink-0 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 p-5 shadow-lg shadow-black/40 backdrop-blur-sm">
      {/* Top: avatar + name + meta */}
      <div className="mb-3 flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-11 w-11 rounded-full border border-slate-700 object-cover shadow-md shadow-black/40"
          loading="lazy"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-white">{name}</p>
            {verified && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400 border border-emerald-500/30">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {tripType} · <span className="text-slate-300">{route}</span>
          </p>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed text-slate-200">{review}</p>

      {/* Bottom: rating + date */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < Math.round(rating) ? "text-amber-400" : "text-slate-700"
              }
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-amber-300 font-medium">
            {rating.toFixed(1)}
          </span>
        </div>
        {formattedDate && <span>{formattedDate}</span>}
      </div>
    </article>
  );
};

export default ReviewCard;
