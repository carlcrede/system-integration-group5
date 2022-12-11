import { FunctionComponent } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import AcceptInvitePage from "./routes/AcceptInvitePage";
import InvitesPage from "./routes/InvitesPage";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import SendInvitePage from "./routes/SendInvitePage";
import SignUpPage from "./routes/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    children: [
    ],
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
    children: [
    ],
  },
  {
    path: "/invites",
    element: <ProtectedRoute><SendInvitePage /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
    ],
  },
  {
      path: "/invites/:token",
      element: <ProtectedRoute><AcceptInvitePage /></ProtectedRoute>,
      errorElement: <ErrorPage />,
  
  },
]);

const Router: FunctionComponent = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default Router;