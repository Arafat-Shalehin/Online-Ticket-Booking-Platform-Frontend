import { useEffect, useState } from "react";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RequestedBookings = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);
  // const axiosSecure = useAxiosSecure();
  // const [bookings, setBookings] = useState([]);

  // Progress bar for Loader
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  // console.log(user);

  // Fetch pending booking requests for this vendor
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(
    ["vendorBookings", user?.email],
    `/bookings/vendor?email=${user?.email}`,
    {
      enabled: !!user?.email && !loading,
    }
  );

  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     if (!user?.email) return;

  //     try {
  //       const res = await axiosSecure.get(`/bookings/vendor?email=${user?.email}`);
  //       console.log(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchBookings();
  // }, [user?.email, axiosSecure]);

  // fetch(`/bookings/vendor?email=${user?.email}`)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));

  const { mutate: mutateBooking, isPending: isMutating } = useApiMutation();

  const handleAccept = (id) => {
    mutateBooking(
      { url: `/bookings/${id}/accept`, method: "patch" },
      {
        onSuccess: () => {
          toast.success("Booking accepted.");
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to accept booking. Please try again."
          );
        },
      }
    );
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject this booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, reject it",
    }).then((result) => {
      if (result.isConfirmed) {
        mutateBooking(
          { url: `/bookings/${id}/reject`, method: "patch" },
          {
            onSuccess: () => {
              toast.info("Booking rejected.");
              refetch();
            },
            onError: (err) => {
              console.error(err);
              toast.error(
                err?.response?.data?.message ||
                  "Failed to reject booking. Please try again."
              );
            },
          }
        );
      }
    });
  };

  // Loading
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Fetching booking requests..."
          subMessage="Please wait a moment."
          progress={progress}
        />
      </div>
    );
  }

  // Error;
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">
          Failed to load booking requests.
        </p>
        <p className="text-sm text-slate-500 mb-4">
          {error?.message || "Something went wrong."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
            Requested Bookings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review booking requests for your tickets and accept or reject them.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {bookings.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
            No booking requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            You currently have no pending booking requests. When users request
            to book your tickets, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Ticket
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">
                    Total Price
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <tr
                    key={booking._id}
                    className={`border-t border-slate-100 dark:border-slate-800 ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/40 dark:bg-slate-900/60"
                    }`}
                  >
                    {/* User */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {booking.userName || "Unknown User"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {booking.userEmail}
                        </span>
                      </div>
                    </td>

                    {/* Ticket */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {booking.title}
                        </span>
                        {booking.unitPrice != null && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Unit price: {booking.unitPrice} ৳
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 text-center align-top text-slate-700 dark:text-slate-200 font-semibold">
                      {booking.bookedQuantity}
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-3 text-right align-top text-slate-800 dark:text-slate-100 font-semibold">
                      {booking.totalPrice} ৳
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center align-top">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(booking._id)}
                          disabled={isMutating}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(booking._id)}
                          disabled={isMutating}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
              Total requests:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {bookings.length}
              </span>
            </span>
            <span>Only pending requests are shown here.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
