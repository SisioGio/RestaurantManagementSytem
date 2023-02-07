import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
function PasswordReset() {
  const dispatch = dispatchFeedbackContexts();
  const [code, setCode] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({
    password: "",
    RepeatPassword: "",
    resetPasswordCode: params.get("code"),
  });
  const ResetPassword = async () => {
    try {
      if (!data.password || !data.RepeatPassword) {
        dispatch({
          value: true,
          message: "All fields are required",
          type: "Error",
        });
      }
      if (data.password != data.RepeatPassword) {
        dispatch({
          value: true,
          message: "Passowords do not match",
          type: "Error",
        });
      }
      await apiService.updatePassword(data);

      setIsSuccess(true);
      dispatch({
        value: true,
        message: `Password succesfully updated`,
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
    }
  };
  const checkPassword = (event) => {
    if (event.target.value !== data.password) {
      dispatch({
        value: true,
        message: "Repeat password does not match 'Password'",
        type: "Error",
      });
    } else {
      dispatch({
        value: false,
      });
    }
  };
  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  return (
    <div id="registration">
      {isSuccess ? <Navigate to="/login" /> : null}
      <form onsubmit="return false;">
        <h1>Password reset</h1>

        <div>
          <div className="single-input">
            <label htmlFor="">Password</label>
            <input
              type="password"
              disabled={false}
              name="password"
              onChange={handleChange}
              value={data.password}
            />
          </div>

          <div className="single-input">
            <label htmlFor="">Repeat Password</label>
            <input
              type="password"
              disabled={false}
              name="RepeatPassword"
              onChange={checkPassword}
            />
          </div>

          <a className="signin-btn" onClick={() => ResetPassword()}>
            Reset Password
          </a>
        </div>
      </form>
    </div>
  );
}

export default PasswordReset;
