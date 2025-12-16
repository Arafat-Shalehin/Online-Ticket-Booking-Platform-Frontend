import { useMemo } from "react";
import useUserDetails from "../QueryOptions/UserFunctions/getUserDetails";

export default function useAuthProfile() {
  const { userDetails, isLoading } = useUserDetails();
  // console.log(userDetails?.name);

  // Derived info
  const profile = useMemo(() => {
    if (!userDetails) return null;

    return {
      uid: userDetails?._id,
      email: userDetails?.email,
      displayName: userDetails?.name,
      photoURL: userDetails?.photoURL,
      role: userDetails?.role || "user",
      dbId: userDetails?._id || null,
      isAdmin: userDetails?.role === "admin",
      isVendor: userDetails?.role === "vendor",
      isUser: userDetails?.role === "user",
    };
  }, [userDetails]);

  return {
    userDetails: profile,
    isLoading,
    isAdmin: profile?.isAdmin || false,
    isVendor: profile?.isVendor || false,
    isUser: profile?.isUser || false,
  };
}
