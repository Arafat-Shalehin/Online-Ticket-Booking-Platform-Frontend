// src/components/TicketCard.jsx
import { Link } from "react-router-dom";
import { format } from "date-fns";

const TicketCard = ({ ticket }) => {
  const departure = new Date(ticket?.departureDateTime);
  const departureDate = format(departure, "PPP");
  const departureTime = format(departure, "p");

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
          {ticket.transportType}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900">
            {ticket.title}
          </h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {ticket.ticketQuantity} left
          </span>
        </div>

        {/* Route */}
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <p className="font-medium text-slate-800">
            {ticket.from} → {ticket.to}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Departs {departureDate} at {departureTime}
          </p>
        </div>

        {/* Perks */}
        {ticket.perks?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 text-xs">
            {ticket.perks.map((perk, idx) => (
              <span
                key={idx}
                className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
              >
                {perk}
              </span>
            ))}
          </div>
        )}

        {/* Price & CTA */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-xs text-slate-500">Price (per ticket)</p>
            <p className="text-lg font-semibold text-slate-900">
              ${ticket.price.toFixed(2)}
            </p>
          </div>
          <Link
            to={`/ticket/${ticket._id}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            See details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
