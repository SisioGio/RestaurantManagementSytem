import React, { useEffect, useState } from "react";
import { Navigate, Route, useSearchParams } from "react-router-dom";
import apiService from "../../services/apiService";

function ProtectedRoute({ children, requestedRoute, requiredRole }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const checkIfIsAuthenticated = async (requiredRole) => {
    if (!apiService.getCurrentUser()) {
      setIsAuthenticated(false);
    }
    console.log(requiredRole);
    await apiService

      .isAuthenticated(requiredRole)
      .then((res) => {
        console.log({ res: res });
        setIsAuthenticated(res);
      })
      .catch((error) => {
        console.log({ resError: error });
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    checkIfIsAuthenticated(requiredRole);
  }, []);


  if (isAuthenticated != null) {
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to={"/login?requestedRoute=" + requestedRoute} />
    );
  }
  
}

export default ProtectedRoute;
