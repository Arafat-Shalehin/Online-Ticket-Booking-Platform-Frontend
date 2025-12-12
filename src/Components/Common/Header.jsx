import { HiOutlineTicket } from "react-icons/hi";

const Header = ({ count = 0 }) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        My Booked Tickets
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Review your upcoming and past bookings. Complete payments for accepted
        tickets before departure.
      </p>
    </div>

    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      <HiOutlineTicket className="h-4 w-4 text-sky-500" />
      <span className="uppercase tracking-wide">Total Bookings</span>
      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] shadow-sm dark:bg-slate-900">
        {count}
      </span>
    </div>
  </div>
);

export default Header;
