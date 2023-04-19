import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";
import { Link } from "react-router-dom";
import { ShowUserContexts } from "../App";
function Vendors() {
  const [vendors, setVendors] = useState([]);
  const UserContext = ShowUserContexts();
  const [companies, setCompanies] = useState([]);
  const dispatch = DispatchFeedbackContexts();
  const [visible, setVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const getCompanies = async () => {
    try {
      const userId = apiService.getUser().id;
      var res = await apiService.getCompanies(userId);
      const customerId = apiService.getCompany().id;
      const filtered_companies = res.data.filter(
        (company) => company.id != customerId
      );
      console.log({ companies: filtered_companies });
      setCompanies(filtered_companies);
    } catch (err) {
      console.log(err);
    }
  };

  const getVendors = async () => {
    try {
      const customerId = apiService.getCompany().id;
      var res = await apiService.getVendors(customerId);
      console.log(res.data);
      setVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const empty = (object) => {
    console.log("Resetting form");
    Object.keys(object).forEach(function (k) {
      object[k] = "";
    });
    return object;
  };

  const CreateCompany = async (event) => {
    event.preventDefault();
    try {
      data.customerId = apiService.getCompany().id;
      let res = await apiService.addVendor(data);

      dispatch({
        value: true,
        message: `Success, vendor ${data.name} has been ${
          data.id ? "updated" : "created"
        }.`,
        type: "Success",
      });

      getVendors();
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
    referenceVendorCompanyId: "",
    customerId: apiService.getCompany().id,
    type: "",
    days: "",
  });

  function updateCustomer(event, companyId) {
    const company = companies.find((company) => company.id == companyId);
    if (company) {
      setData({
        name: company.name,
        vatNo: company.vatNo,
        email: company.email,
        walletAddress: company.walletAddress,
        country: company.address.country,
        region: company.address.region,
        city: company.address.city,
        street: company.address.street,
        streetNo: company.address.streetNo,
        postcode: company.address.postcode,
        referenceVendorCompanyId: companyId,
        days: data.days,
        type: data.type,
        customerId: apiService.getCompany().id,
      });
      setFormDisabled(true);
    }
  }
  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getVendors();
    getCompanies();
  }, [UserContext]);

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
            <div className="col-md-12">
              <select
                class="form-select  mb-3"
                onChange={(event) => updateCustomer(event, event.target.value)}
                aria-label=". example"
              >
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>
                {companies.map((company) => {
                  return (
                    <option
                      selected={data.referenceCompanyId === company.id}
                      value={company.id}
                    >
                      {company.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class="col-md-6">
              <label for="inputCompanyName">Company Name</label>
              <input
                type="text"
                name="name"
                disabled
                onChange={handleChange}
                value={data.name}
                required
                class="form-control"
                id="inputCompanyName"
                placeholder="Alessio"
              ></input>
            </div>
            <div class="col-md-6">
              <label for="inputVatNo">Vat No.</label>
              <input
                disabled
                type="text"
                required
                class="form-control"
                name="vatNo"
                onChange={handleChange}
                value={data.vatNo}
                id="inputVatNo"
                placeholder="Giovannini"
              ></input>
            </div>
          </div>

          <div class="row">
            <div class=" col-md-6">
              <label for="inputEmail4">Email</label>
              <input
                type="email"
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled={formDisabled}
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
                disabled={formDisabled}
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
                disabled={formDisabled}
                value={data.streetNo}
                class="form-control"
                id="inputStreetNo"
                placeholder="42/A"
              ></input>
            </div>

            <div className="col-6">
              <label for="inputStreetNo">Payment Terms</label>
              <select
                class="form-select  mb-3"
                onChange={(event) => (data.type = event.target.value)}
                aria-label=". example"
              >
                <option selected={data.name === ""} value>
                  {" "}
                  -- select an option --{" "}
                </option>

                <option
                // selected={data.type === company.paymentTerm.type}
                >
                  EOM
                </option>
                <option
                // selected={data.type === company.paymentTerm.type}
                >
                  NET
                </option>
              </select>
            </div>

            <div className="col-6">
              <label for="inputDays">Days</label>
              <input
                type="number"
                required
                name="days"
                onChange={handleChange}
                value={data.days}
                class="form-control"
                id="inputDays"
                placeholder="60"
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

          <button
            onClick={(event) => (empty(data), setFormDisabled(false))}
            type="submit"
            class="btn btn-warning btn-lg btn-block m-2 w-100"
          >
            Clear
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
              <th scope="col">Payment Terms</th>

              <th scope="col">Catalog</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((company, i) => {
              return (
                <tr>
                  <th scope="row">{company.id}</th>
                  <td>{company.referenceVendorCompany.name}</td>
                  <td>{company.referenceVendorCompany.vatNo}</td>
                  <td>{company.referenceVendorCompany.walletAddress}</td>
                  <td>{company.referenceVendorCompany.email}</td>
                  <td>{company.referenceVendorCompany.address.country}</td>
                  <td>{company.referenceVendorCompany.address.region}</td>
                  <td>{company.referenceVendorCompany.address.city}</td>
                  <td>{company.referenceVendorCompany.address.postcode}</td>
                  <td>{company.referenceVendorCompany.address.street}</td>
                  <td>{company.referenceVendorCompany.address.streetNo}</td>
                  <td>
                    {company.paymentTerm.type + " " + company.paymentTerm.days}
                  </td>
                  <td>
                    <Link
                      to={`/products?vendorId=${company.referenceVendorCompanyId}`}
                    >
                      <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      >
                        <path d="M7 16.462l1.526-.723c1.792-.81 2.851-.344 4.349.232 1.716.661 2.365.883 3.077 1.164 1.278.506.688 2.177-.592 1.838-.778-.206-2.812-.795-3.38-.931-.64-.154-.93.602-.323.818 1.106.393 2.663.79 3.494 1.007.831.218 1.295-.145 1.881-.611.906-.72 2.968-2.909 2.968-2.909.842-.799 1.991-.135 1.991.72 0 .23-.083.474-.276.707-2.328 2.793-3.06 3.642-4.568 5.226-.623.655-1.342.974-2.204.974-.442 0-.922-.084-1.443-.25-1.825-.581-4.172-1.313-6.5-1.6v-5.662zm-1 6.538h-4v-8h4v8zm15-11.497l-6.5 3.468v-7.215l6.5-3.345v7.092zm-7.5-3.771v7.216l-6.458-3.445v-7.133l6.458 3.362zm-3.408-5.589l6.526 3.398-2.596 1.336-6.451-3.359 2.521-1.375zm10.381 1.415l-2.766 1.423-6.558-3.415 2.872-1.566 6.452 3.558z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vendors;
