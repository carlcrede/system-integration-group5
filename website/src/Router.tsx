import { FunctionComponent } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
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
  ]);

const Router: FunctionComponent = () => {
    return (
        <RouterProvider router={router} />
    );
}
 
export default Router;