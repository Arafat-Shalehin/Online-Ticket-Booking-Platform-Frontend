import React from "react";
import { FaBusAlt, FaTrain, FaShip, FaPlaneDeparture } from "react-icons/fa";

const Error = ({
  statusCode = 404,
  title = "Oops! Page not found.",
  message = "The page you’re looking for might have been removed, had its name changed, or is temporarily unavailable.",
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center">
          {/* Logo / Brand */}
          <div className="flex justify-center items-center mb-6">
            <FaBusAlt className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-2xl font-bold text-slate-900">
              TicketBari
            </span>
          </div>

          {/* Status code */}
          <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-2">
            Error {statusCode}
          </p>

          {/* Title & message */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-6">
            {message}
          </p>

          {/* Themed icons row */}
          <div className="flex justify-center items-center space-x-4 mb-8 text-slate-400">
            <FaBusAlt className="h-7 w-7" title="Bus" />
            <FaTrain className="h-7 w-7" title="Train" />
            <FaShip className="h-7 w-7" title="Launch" />
            <FaPlaneDeparture className="h-7 w-7" title="Flight" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="/"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Go back home
            </a>
            <a
              href="/tickets"
              className="inline-flex justify-center rounded-md border border-slate-300 bg-white shadow-sm px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Browse all tickets
            </a>
            <a
              href="/contact"
              className="inline-flex justify-center rounded-md border border-transparent px-5 py-2.5 text-sm font-medium text-indigo-700 hover:text-indigo-800"
            >
              Contact support
            </a>
          </div>
        </div>
      </main>

      {/* Optional bottom bar (matches your project branding) */}
      <footer className="border-t border-slate-200 py-3">
        <p className="text-center text-xs text-slate-500">
          © 2025 TicketBari. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Error;