import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  // Loader progress animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  // Fetch all users (Admin only)
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(["allUsers"], "/users", {
    enabled: !!user?.email,
  });

  const { mutate: mutateUser, isPending: isMutating } = useApiMutation();

  const handleMakeAdmin = (id) => {
    mutateUser(
      { url: `/users/${id}/make-admin`, method: "patch" },
      {
        onSuccess: () => {
          toast.success("User role updated to Admin.");
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to make admin. Please try again."
          );
        },
      }
    );
  };

  const handleMakeVendor = (id) => {
    mutateUser(
      { url: `/users/${id}/make-vendor`, method: "patch" },
      {
        onSuccess: () => {
          toast.success("User role updated to Vendor.");
          refetch();
        },
        onError: (err) => {
          console.error(err);
          toast.error(
            err?.response?.data?.message ||
              "Failed to make vendor. Please try again."
          );
        },
      }
    );
  };

  const handleMarkFraud = (userDoc) => {
    Swal.fire({
      title: "Mark this vendor as fraud?",
      text: "All of this vendor's tickets will be hidden and they cannot add tickets anymore.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, mark as fraud",
    }).then((result) => {
      if (!result.isConfirmed) return;

      mutateUser(
        { url: `/users/${userDoc._id}/mark-fraud`, method: "patch" },
        {
          onSuccess: (res) => {
            toast.info(
              `Vendor marked as fraud. Hidden tickets: ${
                res?.modifiedTickets ?? 0
              }.`
            );
            refetch();
          },
          onError: (err) => {
            console.error(err);
            toast.error(
              err?.response?.data?.message ||
                "Failed to mark vendor as fraud. Please try again."
            );
          },
        }
      );
    });
  };

  // Loading
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Loading users..."
          subMessage="Please wait while we fetch all users."
          progress={progress}
        />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-red-600 font-medium mb-2">Failed to load users.</p>
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
            Manage Users
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View all users and manage their roles. Mark fraudulent vendors to
            protect the platform.
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                  Email
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                  Role
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const isAdmin = u.role === "admin";
                const isVendor = u.role === "vendor";
                const isFraud = u.isFraud === true;

                return (
                  <tr
                    key={u._id}
                    className={`border-t border-slate-100 dark:border-slate-800 ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50/40 dark:bg-slate-900/60"
                    }`}
                  >
                    {/* User name */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        {u.photoURL && (
                          <img
                            src={u.photoURL}
                            alt={u.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {u.name || "Unnamed User"}
                          </span>
                          {isFraud && (
                            <span className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                              Fraudulent Vendor
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 align-top text-slate-700 dark:text-slate-200">
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 align-top text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 capitalize">
                        {u.role || "user"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* Make Admin */}
                        <button
                          type="button"
                          onClick={() => handleMakeAdmin(u._id)}
                          disabled={isMutating || isAdmin}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Make Admin
                        </button>

                        {/* Make Vendor */}
                        <button
                          type="button"
                          onClick={() => handleMakeVendor(u._id)}
                          disabled={isMutating || isVendor}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Make Vendor
                        </button>

                        {/* Mark as Fraud (only if vendor & not already fraud) */}
                        {isVendor && !isFraud && (
                          <button
                            type="button"
                            onClick={() => handleMarkFraud(u)}
                            disabled={isMutating}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          >
                            Mark as Fraud
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            Total users:{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {users.length}
            </span>
          </span>
          <span>Use roles and fraud flags responsibly.</span>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
