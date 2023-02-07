// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import UserAddress from "./userAddress";
// Shows products of a selected order
function PersonalInformation() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [disabled, setDisabled] = useState(true);
  const getUserData = async () => {
    try {
      let res = await apiService.getUserFromDB(apiService.getUser().id);
      setUser(res.data);
      console.log(res.data);

      setForm({
        id: res.data.id,
        firstname: res.data.firstname,
        surname: res.data.surname,
        email: res.data.email,
        birthDate: res.data.birthDate,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const saveUserData = async () => {
    try {
      const formData = new FormData();
      formData.append("id", form.id);
      formData.append("firstname", form.firstname);
      formData.append("surname", form.surname);

      formData.append("birthDate", form.birthDate);
      console.log(form);
      await apiService.updateUser(form.id, formData);
      getUserData();
      setDisabled(true);
    } catch (err) {
      console.log(err);
    }
  };
  function handleChange(event) {
    const { value, name } = event.target;
    setForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  useEffect(() => {
    getUserData();
  }, []);
  return user ? (
    <div className="user-data">
      <div className="personal-data">
        {disabled ? (
          <svg
            className="user-data-button"
            onClick={() => setDisabled(false)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M18.308 0l-16.87 16.873-1.436 7.127 7.125-1.437 16.872-16.875-5.691-5.688zm-15.751 21.444l.723-3.585 12.239-12.241 2.861 2.862-12.239 12.241-3.584.723zm17.237-14.378l-2.861-2.862 1.377-1.377 2.861 2.861-1.377 1.378z" />
          </svg>
        ) : (
          <svg
            className="user-data-button"
            onClick={() => saveUserData()}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z" />
          </svg>
        )}
        <div className="user-data-title">Basic Information</div>
        <div className="personal-data-form">
          <div className="personal-data-item">
            <label htmlFor="">Firstname</label>
            <input
              disabled={disabled}
              type="text"
              name="firstname"
              onChange={handleChange}
              value={form.firstname}
            />
          </div>
          <div className="personal-data-item">
            <label htmlFor="">Lastname</label>
            <input
              disabled={disabled}
              type="text"
              name="surname"
              onChange={handleChange}
              value={form.surname}
            />
          </div>

          <div className="personal-data-item">
            <label htmlFor="">Email</label>
            <input
              disabled
              type="text"
              name="email"
              onChange={handleChange}
              value={form.email}
            />
          </div>
          <div className="personal-data-item">
            <label htmlFor="">Birthdate</label>

            <input
              disabled={disabled}
              type="date"
              name="birthDate"
              onChange={handleChange}
              value={moment(form.birthDate).format("yyyy-MM-DD")}
            />
          </div>
        </div>

        <small>
          Last time updated:{" "}
          {moment(user.updatedAt).format("yyyy-MM-DD hh:mm:ss")}
        </small>
      </div>

      {user.addresses.map((address, index) => {
        return (
          <UserAddress
            index={index}
            getUserData={getUserData}
            address={address}
          />
        );
      })}

      <UserAddress getUserData={getUserData} address={null} />
    </div>
  ) : (
    <h1>Loading...</h1>
  );
}

export default PersonalInformation;
