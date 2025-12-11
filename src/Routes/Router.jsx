import { createBrowserRouter } from "react-router";
import MainLayout from "../Components/Layout/MainLayout";
import Error from "../Components/Common/Error";
import App from "../App";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import AllTickets from "../Pages/Tickets/AllTickets";
import TicketDetails from "../Pages/Tickets/TicketDetails";

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
]);

export default router;
