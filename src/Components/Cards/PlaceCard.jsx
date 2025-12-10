const PlaceCard = ({ place }) => {
  const {
    name,
    location,
    description,
    heroImage,
    rating,
    tags,
    bestTimeToVisit,
  } = place;

  const shortDescription =
    description && description.length > 110
      ? description.slice(0, 110) + "…"
      : description;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Rating badge */}
        {typeof rating === "number" && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-black/70 text-amber-300 text-xs font-medium px-2.5 py-1 backdrop-blur">
              <span className="mr-1">★</span>
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Best time badge */}
        {bestTimeToVisit && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/90 text-white text-[11px] font-medium px-3 py-1 shadow-sm">
              Best: {bestTimeToVisit}
            </span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold drop-shadow-md">{name}</h3>
          <p className="mt-1 text-xs text-slate-100/80">{location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {shortDescription && (
          <p className="text-sm text-slate-600 line-clamp-1">{shortDescription}</p>
        )}

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-slate-400">More is coming soon...</div>

        </div>
      </div>
    </article>
  );
};

export default PlaceCard;