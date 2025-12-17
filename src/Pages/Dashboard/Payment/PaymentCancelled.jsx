import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center dark:bg-slate-950">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-2xl text-amber-600">!</span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Your payment was not completed. You can try again anytime before the
          departure time.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard/user/my-booked-tickets")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Back to My Booked Tickets
          </button>
          <button
            onClick={() => navigate("/all-tickets")}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Browse Other Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
