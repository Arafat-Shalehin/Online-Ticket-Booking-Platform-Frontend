import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='1200' height='675' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-size='32' font-family='Arial'%3ETwitter image unavailable%3C/text%3E%3C/svg%3E";

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
};

const EachTickets = ({ ticket, index = 0 }) => {
  const reduceMotion = useReducedMotion();

  const title = ticket?.title || "Ticket";
  const transportType = ticket?.transportType || "Travel";
  const price = formatMoney(ticket?.price);

  const quantity = Number(ticket?.ticketQuantity);
  const hasQuantity = Number.isFinite(quantity);
  const soldOut = hasQuantity && quantity <= 0;

  const perks = Array.isArray(ticket?.perks) ? ticket.perks : [];
  const visiblePerks = perks.slice(0, 3);
  const remainingPerks = Math.max(0, perks.length - visiblePerks.length);

  const toDetails = ticket?._id ? `/ticket/${ticket._id}` : "/tickets";

  return (
    <motion.article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-shadow hover:shadow-md",
      ].join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
    >
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

          {/* Calm overlay for text legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />

          {/* Badges */}
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary/90 px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-border">
              {transportType}
            </span>

            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              Featured
            </span>
          </div>

          {/* Bottom title */}
          <div className="absolute inset-x-4 bottom-3">
            <p className="line-clamp-1 text-sm font-semibold text-background">
              {title}
            </p>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title + price */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <Link
            to={toDetails}
            className="line-clamp-2 text-sm font-semibold text-foreground hover:underline sm:text-base"
          >
            {title}
          </Link>

          <div className="text-right">
            <p className="text-lg font-bold text-primary sm:text-xl">
              {price === "—" ? "—" : `$${price}`}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              per ticket
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {soldOut ? (
              <span className="font-semibold text-destructive">Sold out</span>
            ) : hasQuantity ? (
              <>
                <span className="font-semibold text-foreground">
                  {quantity}
                </span>{" "}
                left
              </>
            ) : (
              "Availability varies"
            )}
          </span>

          <span className="inline-flex items-center gap-2">
            <span
              className={[
                "h-2 w-2 rounded-full",
                soldOut ? "bg-destructive/70" : "bg-primary",
              ].join(" ")}
              aria-hidden="true"
            />
            <span>{soldOut ? "Limited" : "Instant confirmation"}</span>
          </span>
        </div>

        {/* Perks */}
        {visiblePerks.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-2">
            {visiblePerks.map((perk) => (
              <li
                key={perk}
                className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border"
              >
                {perk}
              </li>
            ))}
            {remainingPerks > 0 && (
              <li className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
                +{remainingPerks} more
              </li>
            )}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">
            Featured offer
          </span>

          <Link
            to={toDetails}
            className="btn btn-sm btn-primary"
            aria-label={`See details for ${title}`}
          >
            See details <RiArrowRightSLine size={18} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default EachTickets;
