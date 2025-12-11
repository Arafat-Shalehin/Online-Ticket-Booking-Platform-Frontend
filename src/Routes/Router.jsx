import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import Error from "../Components/Common/Error";

// Pages
import App from "../App";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AllTickets from "../Pages/Tickets/AllTickets";
import TicketDetails from "../Pages/Tickets/TicketDetails";

// User Dashboard Pages
import UserProfile from "../Pages/Dashboard/User/UserProfile";
import MyBookedTickets from "../Pages/Dashboard/User/MyBookedTickets";
import TransactionHistory from "../Pages/Dashboard/User/TransactionHistory";

// Route Wrappers
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "*",
        element: <Error />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/all-tickets",
        element: (
          <PrivateRoute>
            <AllTickets />
          </PrivateRoute>
        ),
      },
      {
        path: "/ticket/:id",
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ---------------- DASHBOARD ----------------
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ----------------- USER -----------------
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/profile",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/my-booked-tickets",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <MyBookedTickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/transaction-history",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <TransactionHistory />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
