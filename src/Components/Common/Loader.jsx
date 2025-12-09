import React from "react";
import { FaBusAlt } from "react-icons/fa";

const Loader = ({
  message = "Preparing your trip...",
  subMessage = "Loading routes, seats and prices from our vendors.",
  progress = 0
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500">
      <div className="max-w-sm w-full mx-4 rounded-2xl bg-slate-900/70 border border-slate-800 px-8 py-10 shadow-xl backdrop-blur">
        {/* Logo / brand */}
        <div className="flex items-center justify-center mb-6">
          <FaBusAlt className="h-7 w-7 text-indigo-400 mr-2" />
          <span className="text-2xl font-semibold tracking-tight">
            TicketBari
          </span>
        </div>

        {/* Simple circular loader */}
        <div className="flex justify-center mb-6">
          <div className="relative h-14 w-14">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
            {/* Spinning arc */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            {/* Icon */}
            <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
              <FaBusAlt className={`h-6 w-6 ${progress < 80 ? "text-indigo-300" : "text-indigo-900"} animate-pulse`} />
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-lg font-medium text-center mb-1">{message}</h2>
        <p className="text-sm text-slate-300 text-center mt-4 mb-6">{subMessage}</p>

        {/* Progress bar (controlled by progress prop) */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-linear-to-r from-indigo-400 via-sky-400 to-indigo-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 text-right mb-3">
          {Math.round(progress)}%
        </p>

        {/* Small helper text */}
        <p className="text-[11px] text-slate-400 text-center">
          You’ll be able to compare bus, train, launch and flight tickets in one
          place.
        </p>
      </div>
    </div>
  );
};

export default Loader;
