// client/src/App.js

import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import apiService from "../../../services/apiService";
import CategoryCell from "./cells/category";
import { dispatchFeedbackContexts } from "./../../../App";
import TagCell from "./cells/tags";
import ProductImage from "./../../partials/productImage";
import ProductStock from "../../partials/productStock";
function ProductRow(props) {
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = dispatchFeedbackContexts();
  const [showStock, setShowStock] = useState(false);
  const [images, setImages] = useState([]);
  const [row, setRow] = useState({});
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    id: props.row.id,
    name: props.row.name,
    description: props.row.description,
    price: props.row.price,
  });

  const makeRowEditable = () => {
    setIsEditable(true);
  };

  const deleteImage = async (id) => {
    try {
      await apiService.deleteImageFromDb(id);
      props.update();
      dispatch({
        value: true,
        message: "Image deleted",
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
  };
  const addProduct = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("name", formData.name || "");
    form.append("description", formData.description || "");
    form.append("price", formData.price || "");
    tags.forEach((tag) => form.append("tags[]", tag));
    form.append("category", category);
    for (let i = 0; i < files.length; i++) {
      form.append("files[]", files[i]);
    }
    console.log(tags);
    try {
      let res = await axios.post("/api/product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      dispatch({
        value: true,
        message: "Success, product added",
        type: "Success",
      });

      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
      });
      props.setShowForm(false);
      // props.update(res.data);
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

  const updateProduct = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("name", formData.name || "");
    form.append("description", formData.description || "");
    form.append("price", formData.price || "");
    if (files) {
      for (let i = 0; i < files.length; i++) {
        form.append("files[]", files[i]);
      }
    }

    tags.forEach((tag) => form.append("tags[]", tag));
    form.append("category", category);

    try {
      let res = await axios.put("/api/product/" + formData.id, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        value: true,
        message: "Success, product updated",
        type: "Success",
      });
      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
      });
      props.setShowForm(false);
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

  const closeStock = () => {
    setShowStock(false);
  };
  const deleteRow = async (event) => {
    event.preventDefault();

    try {
      await apiService.deleteProduct(formData.id);
      props.update();
      dispatch({
        value: true,
        message: "Success, product deleted",
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

    setFormData((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  const handleFileInput = (e) => {
    // handle validations
    e.preventDefault();
    const files = e.target.files;
    setFiles(files);
    console.log(files);
  };

  useEffect(() => {
    setImages(props.row.images);

    setRow(props.row);
  }, [props.row]);
  return (
    <div className="product-admin">
      {images && (
        <ProductImage
          tags={props.tags}
          deleteImage={deleteImage}
          images={images}
        />
      )}

      <div
        className={
          props.new || showDetails
            ? "product-admin-title visible"
            : "product-admin-title product-admin-field"
        }
      >
        <label htmlFor="">Title</label>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          disabled={!isEditable & !props.new}
          value={formData.name}
          placeholder="Name"
        />
      </div>
      <div
        className={
          props.new || showDetails
            ? "product-admin-description visible"
            : "product-admin-description product-admin-field"
        }
      >
        <label htmlFor="">Description</label>
        <textarea
          placeholder="Description"
          name="description"
          type="text"
          rows={5}
          onChange={handleChange}
          disabled={!isEditable & !props.new}
          value={formData.description}
        />
      </div>

      <div
        className={
          props.new || showDetails
            ? "product-admin-price visible"
            : "product-admin-price product-admin-field"
        }
      >
        <label htmlFor="">Price</label>
        <input
          placeholder="Price"
          name="price"
          type="number"
          onChange={handleChange}
          disabled={!isEditable & !props.new}
          value={formData.price}
        />
      </div>

      <CategoryCell
        className={
          props.new || showDetails
            ? "product-admin-category visible"
            : "product-admin-category product-admin-field"
        }
        disabled={!isEditable & !props.new}
        categories={props.categories}
        setCategory={setCategory}
        category={props.new ? null : props.row.category.name}
      />

      <TagCell
        className={
          props.new || showDetails
            ? "product-admin-tags visible"
            : "product-admin-tags product-admin-field"
        }
        disabled={!isEditable & !props.new}
        tags={props.tags}
        assignedTags={props.new ? [] : props.row.tags.map((x) => x.name)}
        setTags={setTags}
      />

      <div
        className={
          props.new || showDetails
            ? "product-admin-upload visible"
            : "product-admin-upload product-admin-field"
        }
      >
        {isEditable || props.new ? (
          <div className="input-container py-3 custom-file">
            <input
              id="customFile"
              required
              multiple
              name="picture"
              className="custom-file-input my-2"
              accept="image/*"
              type="file"
              onChange={handleFileInput}
            />
          </div>
        ) : null}
      </div>

      <div
        className={
          props.new || showDetails
            ? "product-admin-action visible"
            : "product-admin-action product-admin-field"
        }
      >
        {isEditable || props.new ? (
          <div>
            <svg
              onClick={props.new ? addProduct : updateProduct}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171z" />
            </svg>
          </div>
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

        {!props.new && (
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
        )}

        {!props.new && (
          <a
            className="stock-btn"
            onClick={(event) => (event.preventDefault(), setShowStock(true))}
            href="#"
          >
            Stocks
          </a>
        )}
      </div>

      <a
        href="#"
        className="admin-product-show-details"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide" : "Show"}
      </a>

      {showStock && (
        <ProductStock
          updateProducts={props.update}
          product={props.row}
          closeStock={closeStock}
        />
      )}
    </div>
  );
}

export default ProductRow;
