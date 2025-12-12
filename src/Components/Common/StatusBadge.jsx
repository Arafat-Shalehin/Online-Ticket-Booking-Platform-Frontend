const statusStyles = {
  pending: {
    label: "Pending",
    classes:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  accepted: {
    label: "Accepted",
    classes:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    classes:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-200",
    dot: "bg-rose-500",
  },
  paid: {
    label: "Paid",
    classes:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-sky-200",
    dot: "bg-sky-500",
  },
};

const StatusBadge = ({ status }) => {
  const config = statusStyles[status] || statusStyles.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
