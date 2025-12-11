import React from "react";
import { Link } from "react-router-dom";
import { HiLockClosed } from "react-icons/hi";

const ROLE_CONFIG = {
  user: {
    badge: "User Area",
    title: "Sign in to access this page",
    message:
      "This page is available only to authenticated TicketBari users. Log in to manage your bookings, profile and dashboard.",
    points: [
      "Use your email & password or Google to sign in.",
      "New to TicketBari? Create a free account in seconds.",
    ],
    primary: { label: "Go to Login", to: "/auth/login" },
    secondary: { label: "Back to Home", to: "/" },
  },
  vendor: {
    badge: "Vendor Dashboard",
    title: "Vendor access required",
    message:
      "This section is reserved for approved TicketBari vendors to add tickets, manage bookings and view revenue.",
    points: [
      "Your current account doesn’t have vendor permissions.",
      "Ask an Admin to upgrade your role to Vendor from the Manage Users panel.",
    ],
    primary: { label: "Back to Home", to: "/" },
    secondary: { label: "Go to User Dashboard", to: "/dashboard" },
  },
  admin: {
    badge: "Admin Console",
    title: "Admin access required",
    message:
      "This area is restricted to TicketBari Admins for managing users, tickets and advertisements across the platform.",
    points: [
      "Your account doesn’t have admin privileges.",
      "Only Admins can approve tickets, manage users and control advertisements.",
    ],
    primary: { label: "Back to Home", to: "/" },
    secondary: { label: "Go to Dashboard", to: "/dashboard" },
  },
};

const NotAuthorized = ({ role = "user" }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="relative w-full max-w-xl">
        {/* Soft gradient blobs in background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-10 h-40 w-40 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/15" />
          <div className="absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-500/15" />
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/90">
          {/* Top labels */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {config.badge}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              401 · Unauthorized
            </span>
          </div>

          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/40">
              <HiLockClosed className="h-7 w-7" />
            </div>

            {/* Text content */}
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
                {config.title}
              </h1>

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {config.message}
              </p>

              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                {config.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to={config.primary.to}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-500/40 transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                >
                  {config.primary.label}
                </Link>

                {config.secondary && (
                  <Link
                    to={config.secondary.to}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {config.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom helper text */}
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          If you believe this is a mistake, please contact TicketBari support.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;