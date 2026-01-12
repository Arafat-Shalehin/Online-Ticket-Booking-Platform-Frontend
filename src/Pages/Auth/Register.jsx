import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../Hooks/useAuth";
import useCreateUser from "../../QueryOptions/UserFunctions/createUser";

const getAuthErrorMessage = (error) => {
  const code = error?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "This email is already in use. Try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before finishing.";
    case "auth/cancelled-popup-request":
      return "Another sign-in popup is already open. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    default:
      return error?.message || "Registration failed. Please try again.";
  }
};

const Register = () => {
  const {
    registerUser,
    googleLogin,
    updateUser,
    setIsRegistering,
    loading,
    setLoading,
  } = useAuth();

  const createUser = useCreateUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const from = useMemo(
    () => location.state?.from?.pathname || "/",
    [location.state]
  );

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      photoUrl: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const busy = loading || isSubmitting;

  const onSubmit = async (data) => {
    clearErrors("root");

    const userProfile = {
      name: data.name?.trim(),
      email: data.email?.trim(),
      photoURL: data.photoUrl?.trim(),
    };

    try {
      setLoading(true);
      setIsRegistering(true);

      // 1) Create Firebase account
      await registerUser(userProfile.email, data.password);

      // 2) Update Firebase profile
      await updateUser(userProfile);

      // 3) Create user in your DB (only after Firebase succeeds)
      await createUser(userProfile);

      toast.success("Registered successfully.");
      reset();
      navigate(from, { replace: true });
    } catch (error) {
      const message = getAuthErrorMessage(error);

      // If the email already exists, guide user to login (better UX)
      if (error?.code === "auth/email-already-in-use") {
        toast.warn(message);
      } else {
        toast.error(message);
      }

      setError("root", { type: "server", message });

      // Keep setIsRegistering consistent even on failures
    } finally {
      setIsRegistering(false);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearErrors("root");

    try {
      setLoading(true);
      setIsRegistering(true);

      const result = await googleLogin();
      const firebaseUser = result?.user;

      const userProfile = {
        name: firebaseUser?.displayName || "User",
        email: firebaseUser?.email,
        photoURL: firebaseUser?.photoURL || "",
      };

      if (!userProfile.email) {
        throw new Error("Google sign-in did not return an email address.");
      }

      // Update profile (safe even if already present)
      await updateUser(userProfile);

      // Create/Upsert in DB (your backend should ideally be idempotent)
      await createUser(userProfile);

      toast.success("Google registration successful.");
      navigate(from, { replace: true });
    } catch (error) {
      const message = getAuthErrorMessage(error);
      toast.error(message);
      setError("root", { type: "server", message });
    } finally {
      setIsRegistering(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Join TicketBari to book tickets and manage your trips.
              </p>
            </div>

            {/* Root error */}
            {errors.root?.message ? (
              <div
                className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {errors.root.message}
              </div>
            ) : null}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  disabled={busy}
                  aria-invalid={!!errors.name}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name is too short" },
                  })}
                />
                {errors.name?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={busy}
                  aria-invalid={!!errors.email}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              {/* Photo URL */}
              <div className="space-y-1">
                <label
                  htmlFor="photoUrl"
                  className="text-sm font-medium text-foreground"
                >
                  Photo URL
                </label>
                <input
                  id="photoUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/your-photo.jpg"
                  disabled={busy}
                  aria-invalid={!!errors.photoUrl}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                  {...register("photoUrl", {
                    required: "Photo URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message:
                        "Please enter a valid URL starting with http(s)://",
                    },
                  })}
                />
                {errors.photoUrl?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.photoUrl.message}
                  </p>
                ) : null}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={busy}
                    aria-invalid={!!errors.password}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          "At least one uppercase letter required",
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          "At least one lowercase letter required",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-1 my-1 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={busy}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              {/* Confirm Password (extra safety, doesn’t change backend) */}
              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={busy}
                    aria-invalid={!!errors.confirmPassword}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) =>
                        val === passwordValue || "Passwords do not match",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-1 my-1 rounded-md px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    disabled={busy}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.confirmPassword?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary w-full"
                aria-busy={busy}
              >
                {busy ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="loading loading-spinner loading-sm"
                      aria-hidden="true"
                    />
                    Creating account…
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google sign-in (Register only) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={busy}
              className="btn w-full bg-background text-foreground border border-border hover:bg-muted"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="loading loading-spinner loading-sm"
                    aria-hidden="true"
                  />
                  Please wait…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt=""
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  Continue with Google
                </span>
              )}
            </button>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Optional small trust note */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By creating an account, you’ll be able to manage bookings and
            payments securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
