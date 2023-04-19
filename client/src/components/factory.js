import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts } from "../App";

function Factory() {
  const [factories, setFactories] = useState([]);
  const getFactories = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getFactories(companyId);

      setFactories(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createFactory = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createFactory(data);

      getFactories();
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
    getFactories();
  }, []);

  return (
    <div className="container d-flex justify-center flex-column">
      <form className="">
        <div class="row">
          <div class="col">
            <label for="inputFactoryCode">Factory Code</label>
            <input
              type="text"
              name="code"
              onChange={handleChange}
              value={data.code}
              required
              class="form-control"
              id="inputFactoryCode"
              placeholder="LMN"
            ></input>
          </div>
          <div class="col">
            <label for="inputFactoryName">Factory Name</label>
            <input
              type="text"
              required
              class="form-control"
              name="name"
              onChange={handleChange}
              value={data.name}
              id="inputFactoryName"
              placeholder="Limena"
            ></input>
          </div>
        </div>
        <div className="col">
          <button
            onClick={(event) => createFactory(event)}
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
              <th scope="col">Factory Code</th>
              <th scope="col">Factory Name</th>
            </tr>
          </thead>
          <tbody>
            {factories.map((factory, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{factory.code}</td>
                  <td>{factory.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Factory;
