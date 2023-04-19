import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../App";

function Inventory() {
  const dispatchUserContext = DispatchUserContexts();
  const showUserContext = ShowUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [taxCodes, setTaxCodes] = useState([]);
  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const getTaxCodes = async () => {
    try {
      let res = await apiService.getTaxCodes(apiService.getCompany().id);
      setTaxCodes(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getProducts = async () => {
    try {
      const companyId = showUserContext.selectedCompany;
      var res = await apiService.getProduct(apiService.getCompany().id);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const addProduct = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      if (data.id) {
        var res = await apiService.updateProduct(data);
      } else {
        res = await apiService.addProduct(data);
      }

      dispatch({
        value: true,
        message: `Success, product ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });

      getProducts();
      setIsSuccess(true);
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
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    quantity: "",
    type: "",
    unitOfMeasure: "",
    taxCodeId: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    // alert("Getting companies");
    getProducts();
    getTaxCodes();
  }, [showUserContext]);

  return (
    <div>
      {/* New Product Form */}

      <div className={`company-form  ${visible ? "visible" : "hidden"}`}>
        <form className="w-50 bg-white  center rounded border p-5">
          <svg
            className="close-btn"
            onClick={() => setVisible(false)}
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>
          <div class="row">
            <div class="col-md-8">
              <label for="inputProductName">Product/Service Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
                class="form-control"
                id="inputProductName"
                placeholder="Energy"
              ></input>
            </div>
            <div class=" col-md-4">
              <label for="inputPrice">Price</label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                value={data.price}
                required
                class="form-control"
                id="inputPrice"
                placeholder="99.99"
              ></input>
            </div>

            <div class="col-md-12">
              <label for="inputDescription">Description</label>
              <textarea
                type="text"
                required
                class="form-control"
                name="description"
                onChange={handleChange}
                value={data.description}
                id="inputDescription"
                placeholder="Product description"
              ></textarea>
            </div>
            <div className="col-3">
              <label for="inputPostCode">Type</label>
              <select
                onChange={(event) => (data.type = event.target.value)}
                class="form-control "
              >
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>

                <option>Product</option>
                <option>Service</option>
              </select>
            </div>
            <div className="col-2">
              <label for="inputunitOfMeasure">Unit of Measure</label>
              <input
                type="text"
                required
                name="unitOfMeasure"
                onChange={handleChange}
                value={data.unitOfMeasure}
                class="form-control"
                id="inputunitOfMeasure"
                placeholder="KG"
              ></input>
            </div>

            <div className="col-2">
              <label for="inputQuantity">Quantity</label>
              <input
                type="number"
                required
                name="quantity"
                onChange={handleChange}
                value={data.quantity}
                class="form-control"
                id="inputQuantity"
                placeholder="100"
              ></input>
            </div>
            <div class=" col-md-2">
              <label for="inputcost">Cost</label>
              <input
                type="number"
                required
                name="cost"
                onChange={handleChange}
                value={data.cost}
                class="form-control"
                id="inputcost"
                placeholder="50.00"
              ></input>
            </div>
            <div className="col-3">
              <label for="inputStreetNo">Tax Code</label>
              <select
                class="form-select  mb-3"
                onChange={(event) => (data.taxCodeId = event.target.value)}
                aria-label=". example"
              >
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>

                {taxCodes.map((taxCode) => {
                  return (
                    <option
                      value={taxCode.id}
                      selected={data.taxCodeId == taxCode.id}
                    >
                      {taxCode.code}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            onClick={(event) => addProduct(event)}
            type="submit"
            class="btn btn-primary btn-lg btn-block m-2 w-100"
          >
            {data.id ? "Update" : "Create"}
          </button>
        </form>
      </div>

      <a href="#">
        <svg
          width={36}
          onClick={() => (
            setVisible(true), setData(empty(Object.assign({}, data)))
          )}
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
            fill-rule="nonzero"
          />
        </svg>
      </a>
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Cost</th>
              <th scope="col">Type</th>
              <th scope="col">unitOfMeasure</th>
              <th scope="col">Quantity</th>
              <th scope="col">Tax Code</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              return (
                <tr
                  onClick={() => (
                    setVisible(true), setData(Object.assign({}, product))
                  )}
                >
                  <th scope="row">{i}</th>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.cost}</td>
                  <td>{product.type}</td>
                  <td>{product.unitOfMeasure}</td>
                  <td>{product.quantity}</td>
                  <td>{product.taxCode ? product.taxCode.code : "MISSING"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
