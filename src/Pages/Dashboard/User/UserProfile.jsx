// src/components/UserProfileSection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiEdit3,
  FiLogOut,
} from "react-icons/fi";
import useAuthProfile from "../../../Hooks/useAuthProfile";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router";

const roleConfig = {
  admin: {
    label: "Administrator",
    color: "from-rose-500 to-orange-500",
    icon: <FiShield className="w-4 h-4" />,
  },
  vendor: {
    label: "Vendor",
    color: "from-emerald-500 to-teal-500",
    icon: <FiShoppingBag className="w-4 h-4" />,
  },
  user: {
    label: "User",
    color: "from-sky-500 to-indigo-500",
    icon: <FiUser className="w-4 h-4" />,
  },
};

const UserProfile = () => {
  const { userDetails, isLoading, isAdmin, isVendor, isUser } =
    useAuthProfile();
  // console.log(userDetails);
  const { logoutUser } = useAuth();

  //   LogOut Function
  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be log out from this website!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log Out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
          .then((result) => {
            console.log(result);
            toast.success("LogOut Successful.");
          })
          .catch((error) => {
            console.log(error);
            toast.error("LogOut Failed. Please try again later.");
          });
      }
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="w-full py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="h-7 w-40 bg-slate-800 rounded-md animate-pulse" />
            <div className="mt-2 h-4 w-64 bg-slate-900 rounded-md animate-pulse" />
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40 backdrop-blur-xl">
            <div className="flex gap-6">
              <div className="w-20 h-20 rounded-full bg-slate-800 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-44 bg-slate-800 rounded-md animate-pulse" />
                <div className="h-4 w-60 bg-slate-900 rounded-md animate-pulse" />
                <div className="h-7 w-32 bg-slate-800 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-20 bg-slate-900 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If not logged in
  if (!userDetails) {
    return (
      <section className="w-full bg-slate-950/95 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center text-slate-100">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            User Profile
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to view and manage your profile information.
          </p>
          <div className="mt-6 inline-flex items-center gap-3">
            <Link
              to="/auth/login"
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="px-5 py-2.5 text-sm font-medium rounded-full border border-slate-600 text-slate-200 hover:bg-slate-900 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const roleKey = isAdmin ? "admin" : isVendor ? "vendor" : "user";
  const role = roleConfig[roleKey];

  const initials =
    userDetails?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    userDetails?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto text-slate-100">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-slate-900/80 text-2xl md:text-3xl font-semibold tracking-tight">
            User Profile
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Overview of your account, role, and profile details.
          </p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          {/* Top row: avatar + basic info + actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="relative"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-sky-500 via-emerald-500 to-indigo-500 opacity-70 blur-sm" />
                <div className="relative w-full h-full rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {userDetails?.photoURL ? (
                    <img
                      src={userDetails?.photoURL}
                      alt={userDetails?.displayName || "User avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-slate-100">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl md:text-2xl font-semibold truncate">
                  {userDetails?.displayName || "Unnamed User"}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-linear-to-r ${role.color} text-white shadow-sm shadow-black/20`}
                >
                  {role.icon}
                  <span>{role.label}</span>
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                {userDetails?.email && (
                  <div className="inline-flex items-center gap-1.5">
                    <FiMail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{userDetails?.email}</span>
                  </div>
                )}

                {userDetails?.uid && (
                  <div className="inline-flex items-center gap-1.5 text-xs bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded-full text-slate-400">
                    <span className="font-mono truncate">
                      ID: {userDetails?.uid.slice(0, 8)}…
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions (no-op handlers for now) */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-3">
              <button
                onClick={handleLogOut}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border border-red-500/70 text-red-300 hover:bg-red-500/10 transition"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6 border-t border-slate-800/80 pt-6" />

          {/* Stats / meta grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role & permissions */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Role
                </span>
                <div className="flex gap-1.5">
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Admin
                    </span>
                  )}
                  {isVendor && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Vendor
                    </span>
                  )}
                  {isUser && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      User
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-200">
                {isAdmin &&
                  "Full administrative access, including user and content management."}
                {isVendor &&
                  !isAdmin &&
                  "Vendor access for managing products, orders, and catalog."}
                {isUser &&
                  !isAdmin &&
                  !isVendor &&
                  "Standard user access for browsing and purchasing."}
              </p>
            </div>

            {/* Database / internal ID */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Internal Reference
              </span>
              <p className="mt-2 text-sm font-mono text-slate-200 truncate">
                {userDetails?.dbId ? (
                  <>
                    DB ID:{" "}
                    <span className="text-slate-300">{userDetails?.dbId}</span>
                  </>
                ) : (
                  <span className="text-slate-500">
                    Not linked to DB record
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Used internally for database‑level operations and relations.
              </p>
            </div>

            {/* Security / status */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Account Status
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span className="text-sm text-emerald-300 font-medium">
                  Active & authenticated
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                You are currently signed in. Keep your credentials secure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserProfile;
