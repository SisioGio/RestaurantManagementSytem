import React, { useState } from "react";

import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import { Link } from "react-router-dom";
import { dispatchFeedbackContexts } from "./../../App";
import { dispatchUserContexts } from "./../../App";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const requestedUrl = params.get("requestedRoute");
  const dispatch = dispatchFeedbackContexts();
  const userAuthDispatcher = dispatchUserContexts();
  const [verifyAccount, setVerifyAccount] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const sendconfirmationemail = async () => {
    try {
      await apiService.sendconfirmationemail(data.email);
      dispatch({
        value: true,
        message: `Success, email was sent to ${data.email}`,
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
  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  const SignIn = async (event) => {
    event.preventDefault();

    try {
      let res = await apiService.signin(data.email, data.password);
      console.log(res);
      userAuthDispatcher({
        authenticated: true,
        admin: res.data.roles.indexOf("ADMIN") > -1,
      });
      dispatch({
        value: true,
        message: "Success, you're logged in",
        type: "Success",
      });
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
      if (
        err.response &&
        err.response.data.message &&
        err.response.data.message === "Please verify your account first"
      ) {
        setVerifyAccount(true);
      }
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
  };
  const resetPassword = async () => {
    if (!data.email) {
      dispatch({
        value: true,
        message: "Enter your email address",
        type: "Error",
      });
      return;
    }

    try {
      await apiService.resetPassword(data.email);
      dispatch({
        value: true,
        message:
          "Success, you will soon receive a linkt to reset your password",
        type: "Success",
      });
    } catch (err) {
      dispatch({
        value: true,
        message: "Something went wrong while sending the link",
        type: "Error",
      });
    }
  };
  return (
    <div id="registration">
      {isSuccess ? (
        requestedUrl ? (
          <Navigate to={"/" + requestedUrl} />
        ) : (
          <Navigate to="/" />
        )
      ) : null}

      <form onsubmit="return false;">
        <h1>Login form</h1>

        <div>
          <div className="single-input">
            <label htmlFor="">Email</label>
            <input
              placeholder="Email"
              onChange={handleChange}
              type="text"
              disabled={false}
              name="email"
              value={data.email}
            />
          </div>

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

          <a className="signin-btn" onClick={SignIn}>
            Sign in
          </a>
        </div>
        <Link className="small-link text-white mt-2 " to="/signup">
          Need an account? Sign up!
        </Link>

        <a
          href="#"
          className="small-link text-white mt-2 "
          onClick={() => resetPassword()}
        >
          I forgot my password
        </a>
        {verifyAccount && (
          <a
            href="#"
            onClick={sendconfirmationemail}
            class="small-link text-blu mt-2 "
          >
            Send a new confirmation code
          </a>
        )}
      </form>
    </div>
  );
}

export default Login;
