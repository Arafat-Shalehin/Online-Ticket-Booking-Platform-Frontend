import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../Hooks/useAuth";

const getAuthErrorMessage = (error) => {
  const code = error?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later or reset your password.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return error?.message || "Login failed. Please try again.";
  }
};

const Login = () => {
  const { signInUser, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = useMemo(() => {
    const from = location.state?.from?.pathname;
    // Avoid redirect loops back into auth pages
    if (!from || from.startsWith("/auth")) return "/dashboard";
    return from;
  }, [location.state]);

  const demoAdmin = useMemo(
    () => ({
      email: import.meta.env.VITE_DEMO_ADMIN_EMAIL,
      password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD,
    }),
    []
  );

  const demoVendor = useMemo(
    () => ({
      email: import.meta.env.VITE_DEMO_VENDOR_EMAIL,
      password: import.meta.env.VITE_DEMO_VENDOR_PASSWORD,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const busy = loading || isSubmitting;

  const doLogin = async ({ email, password }, successLabel = "Logged in") => {
    clearErrors("root");

    try {
      setLoading(true);
      await signInUser(email, password);

      toast.success(successLabel);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setError("root", { type: "server", message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    return doLogin(
      { email: data.email, password: data.password },
      "Logged in successfully."
    );
  };

  const handleDemoAdmin = async () => {
    if (!demoAdmin.email || !demoAdmin.password) {
      toast.error("Demo Admin credentials are not configured.");
      return;
    }
    return doLogin(
      { email: demoAdmin.email, password: demoAdmin.password },
      "Logged in as Demo Admin."
    );
  };

  const handleDemoVendor = async () => {
    if (!demoVendor.email || !demoVendor.password) {
      toast.error("Demo Vendor credentials are not configured.");
      return;
    }
    return doLogin(
      { email: demoVendor.email, password: demoVendor.password },
      "Logged in as Demo Vendor."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Log in to manage bookings and continue your journey with
                TicketBari.
              </p>
            </div>

            {/* Demo buttons */}
            <div className="mb-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={busy}
                className="btn btn-sm btn-secondary"
              >
                {busy ? "Please wait…" : "Demo Login: Admin"}
              </button>

              <button
                type="button"
                onClick={handleDemoVendor}
                disabled={busy}
                className="btn btn-sm btn-secondary"
              >
                {busy ? "Please wait…" : "Demo Login: Vendor"}
              </button>
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
                    autoComplete="current-password"
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

              {/* Forgot password */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
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
                    Logging in…
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              Prefer Google sign-in? It’s available on the Register page.
            </p>
          </div>

          {/* Optional note for devs */}
          {(!demoAdmin.email || !demoVendor.email) && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Demo buttons require VITE_DEMO_* credentials in your env file.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
