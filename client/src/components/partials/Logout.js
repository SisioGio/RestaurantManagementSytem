import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { dispatchUserContexts } from "./../../App";

function Logout() {
  const userAuthDispatcher = dispatchUserContexts();
  const logoutUser = (e) => {
    apiService.logout();
    userAuthDispatcher({
      authenticated: false,
      admin: false,
    });
  };
  useEffect(() => {
    logoutUser();
  }, []);
  return <Navigate to="/" />;
}

export default Logout;
