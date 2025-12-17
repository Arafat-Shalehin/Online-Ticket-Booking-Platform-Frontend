import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Components/Common/Loader";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError("Missing session ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`
        );
        if (res.data?.success) {
          setPaymentInfo(res.data);
        } else {
          setError(
            res.data?.message || "Payment status could not be verified."
          );
        }
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Something went wrong while confirming your payment."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, axiosSecure]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Confirming your payment..."
          subMessage="Please wait while we verify your transaction."
          progress={80}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 text-center">
          <h1 className="text-xl font-semibold text-rose-600 mb-2">
            Payment Issue
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate("/dashboard/user/my-booked-tickets")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Back to My Booked Tickets
          </button>
        </div>
      </div>
    );
  }

  const { transactionId, amount, title } = paymentInfo || {};

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-emerald-200/70 dark:border-emerald-700/60 p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-2xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Payment Successful
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Your payment has been confirmed. Thank you for booking with us.
        </p>

        {title && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Ticket: <span className="font-medium">{title}</span>
          </p>
        )}
        {amount != null && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Amount Paid:{" "}
            <span className="font-medium">${Number(amount).toFixed(2)}</span>
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Transaction ID:{" "}
          <span className="font-mono text-[11px]">
            {transactionId || "N/A"}
          </span>
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard/user/transaction-history")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            View Transaction History
          </button>
          <button
            onClick={() => navigate("/dashboard/user/my-booked-tickets")}
            className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Back to My Booked Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
