import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const useUserDetails = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email || loading) return;

    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/users/${user.email}`);
        setUserDetails(res.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.email, loading, axiosSecure]);

  return {
    userDetails,
    isLoading,
    error,
  };
};

export default useUserDetails;
