const Countdown = ({ departureDateTime, status, countdown }) => {
  if (!departureDateTime) return null;
  if (!countdown) return null;

  const { days, hours, minutes, seconds, isExpired } = countdown;

  // No countdown for rejected bookings
  if (status === "rejected") {
    return (
      <p className="text-xs font-medium text-rose-500 dark:text-rose-300">
        Countdown removed – booking was rejected.
      </p>
    );
  }

  if (isExpired) {
    return (
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Departure time has already passed.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
      {/* …icon and labels… */}
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] dark:bg-slate-800">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
};

export default Countdown;
