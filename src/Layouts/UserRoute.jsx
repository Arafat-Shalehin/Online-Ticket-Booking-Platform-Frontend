// PrivateRoute.jsx
import Loader from "../Components/Common/Loader";
import { UserNotAuthorized } from "../Components/NotAuthorized/RoleNotAuthorized";
import useAuth from "../Hooks/useAuth";
import { useEffect, useState } from "react";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader
          message="Checking user authentication status"
          subMessage="Validating access..."
          progress={progress}
        />
      </div>
    );
  }

  if (!user) {
    return <UserNotAuthorized />;
  }

  return children;
};

export default UserRoute;
