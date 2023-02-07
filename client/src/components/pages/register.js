import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { dispatchFeedbackContexts } from "./../../App";

function Register() {
  const [data, setData] = useState({
    firstname: "",
    surname: "",
    email: "",
    birthDate: moment.now(),
    password: "",
    RepeatPassword: "",
    roles: ["user"],
  });
  const [isSuccess, setIsSuccess] = useState(false);
  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  const dispatch = dispatchFeedbackContexts();

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
  const SignUp = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/api/user/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({
        value: true,
        message: "Account created'",
        type: "Success",
      });

      setIsSuccess(true);
    } catch (err) {
      console.log(err.response.data.message);
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error from server",
        type: "Error",
      });
    }
  };

  return (
    <div id="registration">
      {/* <Feedback /> */}
      {isSuccess ? <Navigate to="/login" /> : null}
      <form onsubmit="return false;">
        <h1>Registration form</h1>

        <div>
          <div className="single-input">
            <label htmlFor="">Firstname</label>
            <input
              onChange={handleChange}
              type="text"
              placeholder="Firstname"
              disabled={false}
              name="firstname"
              value={data.firstname}
            />
          </div>

          <div className="single-input">
            <label htmlFor="">Surname</label>
            <input
              placeholder="Surname"
              onChange={handleChange}
              type="text"
              name="surname"
              disabled={false}
              value={data.surname}
            />
          </div>

          <div className="single-input">
            <label htmlFor="">Email</label>
            <input
              placeholder="Email"
              onChange={handleChange}
              type="email"
              disabled={false}
              name="email"
              value={data.email}
            />
          </div>

          <div className="single-input">
            <label htmlFor="">Birthdate</label>
            <input
              type="date"
              disabled={false}
              name="birthDate"
              onChange={handleChange}
              value={moment(data.birthDate).format("yyyy-MM-DD")}
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

          <div className="single-input">
            <label htmlFor="">Repeat Password</label>
            <input
              type="password"
              disabled={false}
              name="RepeatPassword"
              onChange={checkPassword}
            />
          </div>

          <a className="signin-btn" onClick={SignUp}>
            Singup
          </a>
        </div>
        <Link class="small-link text-white mt-2 " to="/login">
          Already have an account? Sign in!
        </Link>
      </form>
    </div>
  );
}

export default Register;
