// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";
import useCreateUser from "../../QueryOptions/UserFunctions/createUser";
import Loader from "../../Components/Common/Loader";

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
  const from = location.state?.from?.pathname || "/";
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm();

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

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setIsRegistering(true);

      const userProfile = {
        name: data.name,
        email: data.email,
        photoURL: data.photoUrl,
      };

      const userAllInfo = await createUser(userProfile);

      const result = await registerUser(data.email, data.password);

      // Update user profile in Firebase
      await updateUser(userProfile);

      console.log({ userAllInfo, result });
      setLoading(false);
      setIsRegistering(false);

      toast.success("Registered successfully");
      reset();
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);

      // Firebase error handling
      if (error.code === "auth/email-already-in-use") {
        toast.warn("You already have an account. Try to Log-In.");
        return;
      }

      // Show general failure message
      toast.error("Registration Failed, Please Try again later.");

      // Pass error to React Hook Form
      setError("root", {
        type: "manual",
        message: error.message || "Registration failed",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleLogin();
      const firebaseUser = result.user;

      const userProfile = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      };

      const userGoogleInfo = await createUser(userProfile);
      console.log(userGoogleInfo);
      await updateUser(userProfile);
      // console.log(result.user);

      toast.success("Google Registration Successful.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google Registration Failed, Please Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white">
        <Loader
          message="Registration is On going..."
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
        <h2 className="text-2xl font-bold text-center mb-6">
          Register To TicketBari
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          {/* Photo URL */}
          <div className="mb-4">
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Photo URL
            </label>
            <input
              id="photoUrl"
              type="url"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/your-photo.jpg"
              {...register("photoUrl", {
                required: "Photo URL is required",
              })}
            />
            {errors.photoUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.photoUrl.message}
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
                validate: {
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Root/server error */}
          {errors.root && (
            <p className="mb-3 text-sm text-red-600">{errors.root.message}</p>
          )}

          {/* Register button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
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

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
