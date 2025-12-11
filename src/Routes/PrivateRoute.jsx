import React, { useEffect, useState } from "react";
import useAuthProfile from "../Hooks/useAuthProfile";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../Components/Common/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthProfile();
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading)
    return <Loader message="Checking authentication..." progress={progress} />;
  if (!user)
    return <Navigate to="/auth/login" replace state={{ from: location }} />;

  return children;
};

export default PrivateRoute;
