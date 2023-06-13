import { React, useEffect, useState } from "react";
import "./../style/signup.css";
import apiService from "../api/apiService";
import FormField from "./formField";
import { Link, Navigate, useLocation } from "react-router-dom";
import { DispatchFeedbackContexts } from "../App";
import { DispatchUserContexts, ShowUserContexts } from "../App";

function Signin() {
  const userContext = ShowUserContexts();
  const dispatch = DispatchFeedbackContexts();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const UserDispatcher = DispatchUserContexts();
  const requestedUrl = params.get("requestedRoute");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  const submitForm = async (event) => {
    const errors = {};

    if (!data.email) {
      errors.email = "Email is required";
    }

    if (!data.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log(data);
      try {
        const res = await apiService.signin(data);
        console.log(res);
        UserDispatcher({
          authenticated: true,
          data: res.data,
        });

        dispatch({
          value: true,
          message: `Welcome!`,
          type: "Success",
        });

        setIsSuccess(true);
      } catch (err) {
        console.log(err);
        dispatch({
          value: true,
          message: "Error from server",
          type: "Error",
        });
      }
    }
  };

  useEffect(() => {}, [userContext]);
  return (
    <div className="signup">
      {isSuccess ? (
        requestedUrl ? (
          <Navigate to={"/" + requestedUrl} />
        ) : userContext.data.role === "CUSTOMER" ? (
          <Navigate to="/customerPortal" />
        ) : userContext.data.role === "WAITER" ? (
          <Navigate to="/waiterPortal" />
        ) : userContext.data.role === "CHEF" ? (
          <Navigate to="/order-items" />
        ) : null
      ) : null}

      <div className="form">
        <h2>Sign In</h2>
        <form onSubmit="">
          <FormField
            name="email"
            value={data.email}
            placeHolder="Email"
            handleChange={handleChange}
            error={formErrors.email}
            type="email"
          />
          <FormField
            name="password"
            value={data.password}
            placeHolder="Password"
            handleChange={handleChange}
            error={formErrors.password}
            type="password"
          />

          <button type="button" onClick={submitForm}>
            Sign In
          </button>

          <small>
            Already have an account? <Link to="/signup"> Sign Up!</Link>{" "}
          </small>
        </form>
      </div>
    </div>
  );
}

export default Signin;
