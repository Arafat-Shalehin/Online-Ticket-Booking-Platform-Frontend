import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Common/Loader";
import {
  UserNotAuthorized,
  VendorNotAuthorized,
  AdminNotAuthorized,
} from "../Components/NotAuthorized/RoleNotAuthorized";
import useAuth from "../Hooks/useAuth";
import useUserDetails from "../QueryOptions/UserFunctions/getUserDetails";

const ROLE_COMPONENT_MAP = {
  user: UserNotAuthorized,
  vendor: VendorNotAuthorized,
  admin: AdminNotAuthorized,
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const { userDetails, loading } = useUserDetails();
  // console.log(userDetails);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading)
    return <Loader message="Validating role..." progress={progress} />;

  if (userDetails?.email && user?.email === false)
    return <Navigate to="/auth/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userDetails?.role)) {
    const NotAuthComponent =
      ROLE_COMPONENT_MAP[allowedRoles[0]] || UserNotAuthorized;
    return <NotAuthComponent />;
  }

  return children;
};

export default ProtectedRoute;
