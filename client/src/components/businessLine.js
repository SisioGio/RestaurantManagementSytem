import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts } from "../App";

function BusinessLine() {
  const [businessLines, setBusinessLines] = useState([]);
  const getBusinessLines = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getBusinessLines(companyId);

      setBusinessLines(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createBusinessLine = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createBusinessLine(data);

      getBusinessLines();
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
    getBusinessLines();
  }, []);

  return (
    <div className="container d-flex justify-center flex-column">
      <form className="">
        <div class="row">
          <div class="col">
            <label for="inputBusinessLineCode">Business Line Code</label>
            <input
              type="text"
              name="code"
              onChange={handleChange}
              value={data.code}
              required
              class="form-control"
              id="inputBusinessLineCode"
              placeholder="BL18"
            ></input>
          </div>
          <div class="col">
            <label for="inputBusinessLineName">Business Line Name</label>
            <input
              type="text"
              required
              class="form-control"
              name="name"
              onChange={handleChange}
              value={data.name}
              id="inputBusinessLineName"
              placeholder="Tools"
            ></input>
          </div>
        </div>
        <div className="col">
          <button
            onClick={(event) => createBusinessLine(event)}
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
              <th scope="col">Business Line Code</th>
              <th scope="col">Business Line Name</th>
            </tr>
          </thead>
          <tbody>
            {businessLines.map((businessLine, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{businessLine.code}</td>
                  <td>{businessLine.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessLine;
