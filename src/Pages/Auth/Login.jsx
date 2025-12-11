import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useCreateUser from "../../QueryOptions/createUser";
import Loader from "../../Components/Common/Loader";

const Login = () => {
  const { signInUser, googleLogin, loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const createUser = useCreateUser();
  const [progress, setProgress] = useState(0);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handle Email/Password Login
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await signInUser(data.email, data.password);
      setLoading(false);
      // console.log(result.user.email);
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email, Kindly Register.");
        return;
      }

      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
        return;
      }
    }
  };

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await googleLogin();
      const firebaseUser = result.user;

      const userProfile = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      };

      const userGoogleInfo = await createUser(userProfile);
      console.log(userGoogleInfo);

      setLoading(false);

      toast.success("Google Login Successful.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google Login Failed, Please Try again later.");
    }
  };

  // Loader Logic
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Login is on process..."
          subMessage="Taking to your desire route..."
          progress={progress}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-3">
          Welcome Back To TicketBari
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Login Now</h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="mb-4 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Root error (e.g., invalid credentials) */}
          {errors.root && (
            <p className="mb-3 text-sm text-red-600">{errors.root.message}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center">
          <div className="grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="grow border-t border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
