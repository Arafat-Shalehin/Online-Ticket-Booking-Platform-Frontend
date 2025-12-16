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

// Vendor Dashboard Pages
import VendorProfile from "../Pages/Dashboard/Vendor/VendorProfile";
import AddTicket from "../Pages/Dashboard/Vendor/AddTicket";
import MyAddedTickets from "../Pages/Dashboard/Vendor/MyAddedTickets";
import RequestedBookings from "../Pages/Dashboard/Vendor/RequestedBookings";
import RevenueOverview from "../Pages/Dashboard/Vendor/RevenueOverview";

// Admin Dashboard Pages
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile";
import ManageTickets from "../Pages/Dashboard/Admin/ManageTickets";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AdvertiseTickets from "../Pages/Dashboard/Admin/AdvertiseTickets";

// Route Wrappers
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/Payment/PaymentCancelled";

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
      {
        path: "user/my-booked-tickets/dashboard/payment/:ticketId",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
      // ----------------- USER -----------------
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
      // ----------------- VENDOR -----------------
      {
        path: "vendor/profile",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <VendorProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor/add-ticket",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <AddTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor/my-added-tickets",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <MyAddedTickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor/requested-bookings",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <RequestedBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor/revenue-overview",
        element: (
          <ProtectedRoute allowedRoles={["vendor"]}>
            <RevenueOverview />
          </ProtectedRoute>
        ),
      },
      // ----------------- ADMIN -----------------
      {
        path: "admin/profile",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-tickets",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageTickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/advertise-tickets",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdvertiseTickets />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
