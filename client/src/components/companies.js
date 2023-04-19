import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts } from "../App";

function CompaniesTest() {
  const dispatchUserContext = DispatchUserContexts();

  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [companies, setCompanies] = useState([]);

  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const getCompanies = async () => {
    try {
      const userId = apiService.getUser().id;
      var res = await apiService.getCompanies(userId);

      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const CreateCompany = async (event) => {
    event.preventDefault();
    try {
      data.userId = apiService.getUser().id;

      if (data.id) {
        var res = await apiService.updateCompany(data);
      } else {
        res = await apiService.createCompany(data);
      }

      dispatch({
        value: true,
        message: `Success, company ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });
      apiService.addCompanyToLocalStorage(res.data);
      getCompanies();
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
    vatNo: "",
    email: "",
    walletAddress: "",
    country: "",
    region: "",
    city: "",
    street: "",
    streetNo: "",
    postcode: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    // alert("Getting companies");
    getCompanies();
  }, []);

  return (
    <div>
      {/* New Company Form */}

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
            <div class="col-md-6">
              <label for="inputCompanyName">Company Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
                class="form-control"
                id="inputCompanyName"
                placeholder="Company XYZ"
              ></input>
            </div>
            <div class="col-md-6">
              <label for="inputVatNo">Vat No.</label>
              <input
                type="text"
                required
                class="form-control"
                name="vatNo"
                onChange={handleChange}
                value={data.vatNo}
                id="inputVatNo"
                placeholder="IT12345678"
              ></input>
            </div>
          </div>

          <div class="row">
            <div class=" col-md-6">
              <label for="inputEmail4">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                class="form-control"
                id="inputEmail4"
                placeholder="Email"
              ></input>
            </div>
            <div class=" col-md-6">
              <label for="inputWalletAddress">Wallet Address</label>
              <input
                type="text"
                required
                name="walletAddress"
                onChange={handleChange}
                value={data.walletAddress}
                class="form-control"
                id="inputWalletAddress"
                placeholder="ABC12223423FSDFADSDFASDC"
              ></input>
            </div>
          </div>

          <div class="row">
            <div className="col-6">
              <label for="inputCountry">Country</label>
              <input
                type="text"
                required
                name="country"
                onChange={handleChange}
                value={data.country}
                class="form-control"
                id="inputCountry"
                placeholder="Italy"
              ></input>
            </div>
            <div className="col-4">
              <label for="inputRegion">Region</label>
              <input
                type="text"
                required
                name="region"
                onChange={handleChange}
                value={data.region}
                class="form-control"
                id="inputRegion"
                placeholder="Lazio"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputPostCode">Post Code</label>
              <input
                type="text"
                required
                name="postcode"
                onChange={handleChange}
                value={data.postcode}
                class="form-control"
                id="inputPostCode"
                placeholder="01-100"
              ></input>
            </div>
          </div>
          <div class="row">
            <div className="col-6">
              <label for="inputCity">City</label>
              <input
                type="text"
                required
                name="city"
                onChange={handleChange}
                value={data.city}
                class="form-control"
                id="inputCity"
                placeholder="Viterbo"
              ></input>
            </div>
            <div className="col-4">
              <label for="inputStreet">Street</label>
              <input
                type="text"
                required
                name="street"
                onChange={handleChange}
                value={data.street}
                class="form-control"
                id="inputStreet"
                placeholder="S. Agostino"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputStreetNo">Street No.</label>
              <input
                type="text"
                required
                name="streetNo"
                onChange={handleChange}
                value={data.streetNo}
                class="form-control"
                id="inputStreetNo"
                placeholder="42/A"
              ></input>
            </div>
          </div>

          <button
            onClick={(event) => CreateCompany(event)}
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
              <th scope="col">Company Name</th>
              <th scope="col">VAT No.</th>
              <th scope="col">Wallet Address</th>
              <th scope="col">Email Address</th>
              <th scope="col">Country</th>
              <th scope="col">Region</th>
              <th scope="col">City</th>
              <th scope="col">Post Code</th>
              <th scope="col">Street</th>
              <th scope="col">Street No.</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, i) => {
              return (
                <tr
                  onClick={() => (
                    setVisible(true), setData(Object.assign({}, company))
                  )}
                >
                  <th scope="row">{i}</th>
                  <td>{company.name}</td>
                  <td>{company.vatNo}</td>
                  <td>{company.walletAddress}</td>
                  <td>{company.email}</td>
                  <td>{company.address.country}</td>
                  <td>{company.address.region}</td>
                  <td>{company.address.city}</td>
                  <td>{company.address.postcode}</td>
                  <td>{company.address.street}</td>
                  <td>{company.address.streetNo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompaniesTest;
