import { motion } from "framer-motion";
import { HiOutlineTicket } from "react-icons/hi";
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
      <HiOutlineTicket className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
      No bookings yet
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Once you book tickets, they will appear here with live countdowns and
      payment status.
    </p>
  </motion.div>
);

export default EmptyState;
