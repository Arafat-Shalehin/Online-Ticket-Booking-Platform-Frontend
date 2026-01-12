import React from "react";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='1200' height='675' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-size='32' font-family='Arial'%3ETwitter image unavailable%3C/text%3E%3C/svg%3E";

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
};

const TicketCard = ({ ticket }) => {
  const title = ticket?.title || "Ticket";
  const from = ticket?.from || "—";
  const to = ticket?.to || "—";
  const transportType = ticket?.transportType || "Travel";

  const qty = Number(ticket?.ticketQuantity);
  const hasQty = Number.isFinite(qty);
  const soldOut = hasQty && qty <= 0;

  const perks = Array.isArray(ticket?.perks) ? ticket.perks : [];
  const visiblePerks = perks.slice(0, 3);
  const remainingPerks = Math.max(0, perks.length - visiblePerks.length);

  const departure = new Date(ticket?.departureDateTime);
  const hasDeparture = isValid(departure);
  const departureDate = hasDeparture ? format(departure, "PPP") : null;
  const departureTime = hasDeparture ? format(departure, "p") : null;

  const price = formatMoney(ticket?.price);
  const toDetails = ticket?._id ? `/ticket/${ticket._id}` : "/all-tickets";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        to={toDetails}
        aria-label={`Open details for ${title}`}
        className="relative block"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={ticket?.image || FALLBACK_IMAGE}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* subtle overlay for badge legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/10 to-transparent" />

          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary/90 px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-border">
              {transportType}
            </span>

            <span
              className={[
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
                soldOut
                  ? "bg-destructive/10 text-destructive ring-destructive/20"
                  : "bg-primary/10 text-primary ring-primary/20",
              ].join(" ")}
            >
              {soldOut
                ? "Sold out"
                : hasQty
                ? `${qty} left`
                : "Availability varies"}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          <Link to={toDetails} className="hover:underline">
            {title}
          </Link>
        </h3>

        {/* Route */}
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-sm font-medium text-foreground">
            {from} <span className="text-muted-foreground">→</span> {to}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {departureDate && departureTime
              ? `Departs ${departureDate} at ${departureTime}`
              : "Departure time not available"}
          </p>
        </div>

        {/* Perks */}
        {visiblePerks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visiblePerks.map((perk) => (
              <span
                key={perk}
                className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border"
              >
                {perk}
              </span>
            ))}
            {remainingPerks > 0 && (
              <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
                +{remainingPerks} more
              </span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-xs text-muted-foreground">Price (per ticket)</p>
            <p className="text-lg font-semibold text-foreground">
              {price === "—" ? "—" : `$${price}`}
            </p>
          </div>

          <Link to={toDetails} className="btn btn-sm btn-primary">
            See details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TicketCard;
