import { createBrowserRouter } from "react-router";
import MainLayout from "../Components/Layout/MainLayout";
import Error from "../Components/Common/Error";
import App from "../App";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import AllTickets from "../Pages/Tickets/AllTickets";
import TicketDetails from "../Pages/Tickets/TicketDetails";
import DashboardLayout from "../Components/Layout/DashboardLayout";
import UserProfile from "../Pages/Dashboard/User/UserProfile";
import MyBookedTickets from "../Pages/Dashboard/User/MyBookedTickets";
import TransactionHistory from "../Pages/Dashboard/User/TransactionHistory";
import UserRoute from "../Layouts/UserRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "*",
        Component: Error,
      },
      {
        index: true,
        Component: App,
      },
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/auth/register",
        Component: Register,
      },
      {
        path: "/all-tickets",
        element: (
          <PrivateRoute>
            <AllTickets></AllTickets>
          </PrivateRoute>
        ),
      },
      {
        path: "/ticket/:id",
        element: (
          <PrivateRoute>
            <TicketDetails></TicketDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/user/profile",
        element: (
          <UserRoute>
            <UserProfile></UserProfile>
          </UserRoute>
        ),
      },
      {
        path: "/dashboard/user/my-booked-tickets",
        element: (
          <UserRoute>
            <MyBookedTickets></MyBookedTickets>
          </UserRoute>
        ),
      },
      {
        path: "/dashboard/user/transaction-history ",
        element: (
          <UserRoute>
            <TransactionHistory></TransactionHistory>
          </UserRoute>
        ),
      },
    ],
  },
]);

export default router;
