import React, { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import apiService from "./../api/apiService";
import { DispatchUserContexts } from "../App";
function ProtectedRoute({ children, requestedRoute }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userContext = DispatchUserContexts();

  const checkIfIsAuthenticated = async () => {
    if (!apiService.getCurrentUser()) {
      console.log("User not found in local storage");
      setIsAuthenticated(false);
    }

    await apiService

      .isAuthenticated()
      .then((res) => {
        console.log({ res: res });
        setIsAuthenticated(true);
        userContext({
          data: res.data,
          authenticated: true,
          type: res.data.type,
        });
      })
      .catch((error) => {
        console.log({ resError: error });
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    checkIfIsAuthenticated();
  }, []);

  if (isAuthenticated != null) {
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to={"/signin?requestedRoute=" + requestedRoute} />
    );
  }
}

export default ProtectedRoute;
