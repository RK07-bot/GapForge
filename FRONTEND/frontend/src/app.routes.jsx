import { createBrowserRouter } from "react-router-dom";
import Landing from "./features/auth/pages/Landing.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview.jsx";
import History from "./features/interview/pages/History.jsx";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        element: <Protected />,
        children: [
          { path: "/analyze", element: <Home /> },
          { path: "/history", element: <History /> },
          { path: "/interview/:interviewId", element: <Interview /> },
        ],
      },
    ],
  },
]);