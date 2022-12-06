import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactElement
}
 
const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({children}) => {
    const { getUserToken } = useAuth();
  
    if (!getUserToken()) {
      console.log("not logged in")
      return <Navigate to="/login" />;
    }
  
    return children;
}
 
export default ProtectedRoute;