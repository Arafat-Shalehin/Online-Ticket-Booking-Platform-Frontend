import React from "react";
import { motion } from "framer-motion";
import {Link} from "react-router";
import { RiArrowRightSLine } from "react-icons/ri";

const EachTickets = ({ ticket, index }) => {
  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/90 shadow-xl shadow-slate-900/30 ring-1 ring-slate-200/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:ring-indigo-300/80"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-50 shadow-sm ring-1 ring-white/10">
            {ticket.transportType}
          </span>
          <span className="rounded-full bg-emerald-400/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-950 shadow-sm">
            Featured
          </span>
        </div>

        {/* Bottom text over image */}
        <div className="absolute inset-x-4 bottom-3">
          <p className="line-clamp-1 text-sm font-medium text-slate-100 drop-shadow">
            {ticket.title}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        {/* Title & price */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
            {ticket.title}
          </h3>
          <div className="text-right">
            <p className="text-lg font-bold text-indigo-600 sm:text-xl">
              ${ticket.price.toFixed(2)}
              <span className="ml-1 text-xs font-medium text-slate-500">
                /ticket
              </span>
            </p>
          </div>
        </div>

        {/* Quantity + meta */}
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            <span className="font-semibold text-emerald-600">
              {ticket.ticketQuantity}
            </span>{" "}
            tickets left
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Instant confirmation
          </span>
        </div>

        {/* Perks */}
        <ul className="mb-4 flex flex-wrap gap-2 mt-2">
          {ticket.perks.map((perk) => (
            <li
              key={perk}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100"
            >
              {perk}
            </li>
          ))}
        </ul>

        {/* Footer / CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="text-[11px] text-slate-400">
            Ticket Status: {ticket.verificationStatus}
          </span>

          <Link
            to={`/ticket/${ticket._id}`}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span>See details</span>
            <RiArrowRightSLine size={20} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default EachTickets;
