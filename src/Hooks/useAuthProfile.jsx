import { useContext, useMemo } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function useAuthProfile() {
  const { user, loading } = useContext(AuthContext);
  // console.log(user);

  // Derived info
  const profile = useMemo(() => {
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role || "user",
      dbId: user.dbId || null,
      isAdmin: user.role === "admin",
      isVendor: user.role === "vendor",
      isUser: user.role === "user",
    };
  }, [user]);

  return {
    user: profile,
    loading,
    isAdmin: profile?.isAdmin || false,
    isVendor: profile?.isVendor || false,
    isUser: profile?.isUser || false,
  };
}
