// client/src/App.js

import React, { useEffect } from "react";
import { useState } from "react";
import apiService from "../../../services/apiService";
import { dispatchFeedbackContexts } from "../../../App";

function AddressRow(props) {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = dispatchFeedbackContexts();

  const [formData, setFormData] = useState({
    id: props.row.id,
    country: props.row.country,
    city: props.row.city,
    postcode: props.row.postcode,
    street: props.row.street,
    streetNo: props.row.streetNo,
  });
  const [row, setRow] = useState({});
  const makeRowEditable = () => {
    setIsEditable(true);
  };
  useEffect(() => {
    setRow(props.row);
  }, [props.row]);

  const updateAddress = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("country", formData.country);
    form.append("city", formData.city);
    form.append("postcode", formData.postcode);
    form.append("street", formData.street);
    form.append("streetNo", formData.streetNo);
    form.append("id", formData.id);

    try {
      await apiService.updateAddress(form);
      dispatch({
        value: true,
        message: "Success, address updated",
        type: "Success",
      });
      props.update();
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }

    setIsEditable(false);
  };

  const addAddress = async (event) => {
    event.preventDefault();
    console.log(formData);
    const form = new FormData();
    form.append("country", formData.country);
    form.append("city", formData.city);
    form.append("postcode", formData.postcode);
    form.append("street", formData.street);
    form.append("streetNo", formData.streetNo);
    form.append("userId", props.userId);

    try {
      await apiService.addAddress(form);
      dispatch({
        value: true,
        message: "Success, address created",
        type: "Success",
      });
      props.update();
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }

    setIsEditable(false);
  };

  const deleteAddress = async (event) => {
    event.preventDefault();

    try {
      await apiService.deleteAddress(formData.id);
      dispatch({
        value: true,
        message: "Success, address deleted",
        type: "Success",
      });
      props.update();
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
    setIsEditable(false);
  };

  function handleChange(event) {
    const { value, name } = event.target;

    if (event.target.type === "checkbox") {
      let checkBoxValue = event.target.checked ? "checked" : "";

      setFormData((prevNote) => ({
        ...prevNote,
        [name]: checkBoxValue,
      }));
    } else {
      setFormData((prevNote) => ({
        ...prevNote,
        [name]: value,
      }));
    }
  }

  return (
    <div
      currentAddress={props.row.id}
      selectedAddress={props.shippingAddress}
      className={
        !props.new && props.shippingAddress === props.row.id
          ? "shipping-address-item address-selected"
          : "shipping-address-item"
      }
      onClick={() =>
        props.new ? null : props.setShippingAddress(props.row.id)
      }
    >
      <p>{props.new ? "Add a new address" : "Address #" + props.row.id}</p>

      <input
        name="country"
        type="text"
        onChange={handleChange}
        placeholder="Country"
        disabled={!isEditable & !props.new}
        value={formData.country}
      />

      <input
        name="city"
        type="text"
        placeholder="City"
        onChange={handleChange}
        disabled={!isEditable & !props.new}
        value={formData.city}
      />

      <input
        name="postcode"
        type="text"
        placeholder="Postcode"
        onChange={handleChange}
        disabled={!isEditable & !props.new}
        value={formData.postcode}
      />

      <input
        name="street"
        type="text"
        placeholder="Street"
        onChange={handleChange}
        disabled={!isEditable & !props.new}
        value={formData.street}
      />

      <input
        name="streetNo"
        type="text"
        placeholder="Street No."
        onChange={handleChange}
        disabled={!isEditable & !props.new}
        value={formData.streetNo}
      />
      <div className="shipping-address-action">
        {isEditable || props.new ? (
          <a
            href="#"
            className="shipping-save-btn"
            onClick={props.new ? addAddress : updateAddress}
          >
            Save
          </a>
        ) : (
          <svg
            onClick={makeRowEditable}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M18.308 0l-16.87 16.873-1.436 7.127 7.125-1.437 16.872-16.875-5.691-5.688zm-15.751 21.444l.723-3.585 12.239-12.241 2.861 2.862-12.239 12.241-3.584.723zm17.237-14.378l-2.861-2.862 1.377-1.377 2.861 2.861-1.377 1.378z" />
          </svg>
        )}

        {!props.new ? (
          <svg
            onClick={deleteAddress}
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z" />
          </svg>
        ) : null}
      </div>
    </div>
  );
}

export default AddressRow;
