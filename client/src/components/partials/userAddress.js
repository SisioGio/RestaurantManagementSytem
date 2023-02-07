// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
// Shows products of a selected order
function UserAddress(props) {
  const [form, setForm] = useState({});
  const [disabled, setDisabled] = useState(true);
  const dispatch = dispatchFeedbackContexts();

  const saveAddressData = async () => {
    try {
      const formData = new FormData();

      formData.append("country", form.country);
      formData.append("city", form.city);
      formData.append("postcode", form.postcode);
      formData.append("street", form.street);
      formData.append("streetNo", form.streetNo);

      console.log(form);
      if (form.id) {
        formData.append("id", form.id);
        await apiService.updateAddress(formData);
      } else {
        formData.append("userId", apiService.getUser().id);
        await apiService.addAddress(formData);
      }

      props.getUserData();
      setDisabled(true);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAddress = async (event) => {
    try {
      await apiService.deleteAddress(form.id);
      dispatch({
        value: true,
        message: "Success, address delete",
        type: "Success",
      });
      props.getUserData();
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
    setDisabled(true);
  };

  function handleChange(event) {
    const { value, name } = event.target;
    setForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (props.address) {
      setForm({
        id: props.address.id || "",
        country: props.address.country || "",
        city: props.address.city || "",
        postcode: props.address.postcode || "",
        street: props.address.street || "",
        streetNo: props.address.streetNo || "",
      });
    }
  }, []);
  return (
    <div className="personal-data">
      <div className="user-data-title">
        {form.id ? "Shipping address #" + props.index : "Add a new address"}
      </div>
      {disabled && form.id ? (
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
          onClick={() => saveAddressData()}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z" />
        </svg>
      )}
      <div className="personal-data-form">
        <div className="personal-data-item">
          <label htmlFor="">Country</label>
          <input
            disabled={disabled && form.id}
            type="text"
            name="country"
            onChange={handleChange}
            value={form.country}
          />
        </div>
        <div className="personal-data-item">
          <label htmlFor="">City</label>
          <input
            disabled={disabled && form.id}
            type="text"
            name="city"
            onChange={handleChange}
            value={form.city}
          />
        </div>

        <div className="personal-data-item">
          <label htmlFor="">Post Code</label>
          <input
            disabled={disabled && form.id}
            type="text"
            name="postcode"
            onChange={handleChange}
            value={form.postcode}
          />
        </div>
        <div className="personal-data-item">
          <label htmlFor="">street</label>

          <input
            disabled={disabled && form.id}
            type="text"
            name="street"
            onChange={handleChange}
            value={form.street}
          />
        </div>

        <div className="personal-data-item">
          <label htmlFor="">Street No.</label>

          <input
            disabled={disabled && form.id}
            type="text"
            name="streetNo"
            onChange={handleChange}
            value={form.streetNo}
          />
        </div>
      </div>

      <div className="personal-data-action">
        {!disabled && form.id && (
          <svg
            className="bottom-right"
            onClick={() => deleteAddress()}
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z" />
          </svg>
        )}
      </div>
      <small>
        Last time updated:{" "}
        {moment(props.updatedAt).format("yyyy-MM-DD hh:mm:ss")}
      </small>
    </div>
  );
}

export default UserAddress;
