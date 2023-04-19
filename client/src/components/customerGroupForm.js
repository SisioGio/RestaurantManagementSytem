import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../App";
import { Form } from "react-router-dom";

function CustomerGroupForm(props) {
  const feedback = DispatchFeedbackContexts();
  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const addCustomerGroup = async (event) => {
    event.preventDefault();
    try {
      let companyId = apiService.getCompany().id;
      form.companyId = companyId;
      let res = await apiService.createCustomerGroup(form);
      feedback({
        type: "Success",
        message: "Success! New customer group added",
      });

      props.refreshData();

      console.log(res.data);
    } catch (err) {
      feedback({
        type: "Error",
        message: `Ops! Something went wrong while creating the customer group. (${
          err.response.data.message
            ? err.response.data.message
            : "Error from server"
        })`,
      });
      console.log("Error while creating group");
      console.log(err);
    }
  };

  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setForm((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  return (
    <form className="w-25 bg-white   rounded border m-5 p-2">
      <div class="row">
        <div class="col-md-6">
          <label for="inputCustomerGroupCode">Customer Group</label>
          <input
            type="text"
            name="code"
            onChange={handleChange}
            value={form.code}
            required
            class="form-control"
            id="inputCustomerGroupCode"
            placeholder="LOCAL/UE/EXTRA-UE"
          ></input>
        </div>

        <div class="col-md-6">
          <label for="inputCustomerGroupName">Customer Group Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={form.name}
            required
            class="form-control"
            id="inputCustomerGroupName"
            placeholder="LOCAL/UE/EXTRA-UE"
          ></input>
        </div>
      </div>

      <button
        onClick={(event) => addCustomerGroup(event)}
        type="submit"
        class="btn btn-primary btn-lg btn-block m-2 w-100"
      >
        Create
      </button>
    </form>
  );
}

export default CustomerGroupForm;
