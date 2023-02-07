import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
function ConfirmEmail() {
  // return <Navigate to="/" />;
  const dispatch = dispatchFeedbackContexts();
  const [code, setCode] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [verified, SetVerified] = useState(false);
  const verifyCode = async () => {
    try {
      let user = await apiService.verifyConfirmationCode(params.get("code"));
      SetVerified(true);
      dispatch({
        value: true,
        message: `Success, your account is verified`,
        type: "Success",
      });
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
      SetVerified(false);
    }
  };

  useEffect(() => {
    setCode(params.get("code"));
    verifyCode();
  }, [code]);

  return <Navigate to="/login" />;
  // return <h1>{code}</h1>;
}

export default ConfirmEmail;
