import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts } from "../App";

function CostCenter() {
  const [costCenters, setCostCenters] = useState([]);
  const getCostCenters = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getCostCenters(companyId);

      setCostCenters(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createCostCenter = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createCostCenter(data);

      getCostCenters();
    } catch (err) {
      console.log(err);
    }
  };
  const [data, setData] = useState({
    code: "",
    name: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getCostCenters();
  }, []);

  return (
    <div className="container d-flex justify-center flex-column">
      <form className="">
        <div class="row">
          <div class="col">
            <label for="inputCostCenterCode">Cost Center Code</label>
            <input
              type="text"
              name="code"
              onChange={handleChange}
              value={data.code}
              required
              class="form-control"
              id="inputCostCenterCode"
              placeholder="100190"
            ></input>
          </div>
          <div class="col">
            <label for="inputCostCenterName">Cost Center Name</label>
            <input
              type="text"
              required
              class="form-control"
              name="name"
              onChange={handleChange}
              value={data.name}
              id="inputCostCenterName"
              placeholder="Tools"
            ></input>
          </div>
        </div>
        <div className="col">
          <button
            onClick={(event) => createCostCenter(event)}
            type="submit"
            class="btn btn-primary btn-lg btn-block m-2 w-100"
          >
            Create
          </button>
        </div>
      </form>

      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Cost Center Code</th>
              <th scope="col">Cost Center Name</th>
            </tr>
          </thead>
          <tbody>
            {costCenters.map((costCenter, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{costCenter.code}</td>
                  <td>{costCenter.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CostCenter;
