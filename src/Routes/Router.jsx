import { createBrowserRouter } from "react-router";
import MainLayout from "../Components/Layout/MainLayout";
import Error from "../Components/Common/Error";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
        {
            path: "*",
            Component: Error
        },
    ]
  },
]);

export default router;