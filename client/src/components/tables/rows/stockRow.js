// client/src/App.js

import React, { useEffect } from "react";
import { useState } from "react";

import { dispatchFeedbackContexts } from "./../../../App";
import apiService from "../../../services/apiService";

function StockRow(props) {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = dispatchFeedbackContexts();
  const [formData, setFormData] = useState({
    id: props.row.id,
    quantity: props.row.quantity,
    productId: props.row.productId,
    sizeId: props.row.sizeId,
  });
  const [row, setRow] = useState({});
  const makeRowEditable = () => {
    setIsEditable(true);
  };

  const updateRow = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("quantity", formData.quantity);
    form.append("productId", formData.productId);
    form.append("sizeId", formData.sizeId);
    console.log("Updating entry " + formData.id);

    try {
      await apiService.updateStock(formData.id, form);

      dispatch({
        value: true,
        message: "Success, stock updated",
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

  const addStock = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("quantity", formData.quantity);
    form.append("productId", formData.productId);
    form.append("sizeId", formData.sizeId);

    try {
      let res = await apiService.addStock(formData);
      props.update();
      dispatch({
        value: true,
        message: "Success, product created",
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

    setIsEditable(false);
  };

  const deleteRow = async (event) => {
    event.preventDefault();
    try {
      await apiService.deleteStock(formData.id);
      props.update();
      dispatch({
        value: true,
        message: "Success, stock deleted",
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
  useEffect(() => {
    setRow(props.row);
  }, [props.row]);
  return (
    <tr key={props.id}>
      <td>
        <input
          type="number"
          onChange={handleChange}
          disabled={true}
          value={formData.id}
        />
      </td>
      <td>
        <select
          name="productId"
          onChange={handleChange}
          disabled={!isEditable & !props.new}
        >
          {props.new ? (
            <option disabled selected value>
              {" "}
              -- select a product --
            </option>
          ) : (
            <option selected value={formData.productId}>
              {props.row.product.name}
            </option>
          )}

          {props.products.map((product) => {
            return <option value={product.id}>{product.name}</option>;
          })}
        </select>
      </td>
      <td>
        <select
          name="sizeId"
          onChange={handleChange}
          disabled={!isEditable & !props.new}
        >
          {props.new ? (
            <option disabled selected value>
              {" "}
              -- select a size --{" "}
            </option>
          ) : (
            <option selected value={formData.sizeId}>
              {props.row.size.name}
            </option>
          )}
          {props.sizes.map((size) => {
            return <option value={size.id}>{size.name}</option>;
          })}
        </select>
      </td>

      <td>
        <input
          name="quantity"
          type="number"
          onChange={handleChange}
          disabled={!isEditable & !props.new}
          value={formData.quantity}
        />
      </td>

      <td>
        {isEditable || props.new ? (
          <svg
            onClick={props.new ? addStock : updateRow}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z" />
          </svg>
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
      </td>
      {!props.new ? (
        <td>
          <svg
            onClick={deleteRow}
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z" />
          </svg>
        </td>
      ) : null}
    </tr>
  );
}

export default StockRow;
