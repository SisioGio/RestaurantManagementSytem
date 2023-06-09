import { React, useState } from "react";
import "./../style/signup.css";
import apiService from "../api/apiService";
import FormField from "./formField";
import { Link, Navigate } from "react-router-dom";
import { DispatchFeedbackContexts } from "../App";

function Signup() {
  const dispatch = DispatchFeedbackContexts();

  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneNo: "",
  });

  const [data, setData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneNo: "",
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
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (!data.surname) {
      errors.surname = "Surname is required";
    }
    if (!data.email) {
      errors.email = "Email is required";
    }
    if (!data.phoneNo) {
      errors.phoneNo = "Phone No. is required";
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    if (!data.password) {
      errors.repeatPassword = "Repeat password is required";
    }
    if (
      data.password &&
      data.repeatPassword &&
      data.password != data.repeatPassword
    ) {
      errors.password = "Passwords do not match";
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const res = await apiService.signup(data);
        setIsSuccess(true);
        dispatch({
          value: true,
          message: `Your account has been created!`,
          type: "Success",
        });
      } catch (err) {
        console.log(err);
        dispatch({
          value: true,
          message: err.response.data.message
            ? err.response.data.message
            : "Error",
          type: "Error",
        });
      }
    }
  };

  return (
    <div className="signup">
      {isSuccess ? <Navigate to="/signin" /> : null}

      <div className="form">
        <h2>Sign Up</h2>
        <form onSubmit="">
          <FormField
            name="name"
            value={data.name}
            placeHolder="Name"
            handleChange={handleChange}
            error={formErrors.name}
            type="text"
          />

          <FormField
            name="surname"
            value={data.surname}
            placeHolder="Surname"
            handleChange={handleChange}
            error={formErrors.surname}
            type="text"
          />
          <FormField
            name="phoneNo"
            value={data.phoneNo}
            placeHolder="Phone Number"
            handleChange={handleChange}
            error={formErrors.phoneNo}
            type="text"
          />
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

          <FormField
            name="repeatPassword"
            value={data.repeatPassword}
            placeHolder="RepeatPassword"
            handleChange={handleChange}
            error={formErrors.repeatPassword}
            type="password"
          />

          <button type="button" onClick={submitForm}>
            Sign Up
          </button>

          <small>
            Need an account? <Link to="/signin"> Sign In!</Link>{" "}
          </small>
        </form>
      </div>
    </div>
  );
}

export default Signup;
