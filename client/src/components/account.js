import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts } from "../App";

function Account() {
  const [accounts, setAccounts] = useState([]);
  const getAccounts = async () => {
    try {
      const companyId = apiService.getCompany().id;
      var res = await apiService.getAccounts(companyId);

      setAccounts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createAccount = async (event) => {
    event.preventDefault();
    try {
      data.companyId = apiService.getCompany().id;

      let res = await apiService.createAccount(data);

      getAccounts();
    } catch (err) {
      console.log(err);
    }
  };
  const [data, setData] = useState({
    code: "",
    name: "",
    isNode: false,
    type: "Asset",
  });

  function handleChange(event) {
    const { value, name } = event.target;

    setData((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }
  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className="container d-flex justify-center flex-column">
      <form className="">
        <div class="row">
          <div class="col">
            <label for="inputAccountCode">Account Code</label>
            <input
              type="text"
              name="code"
              onChange={handleChange}
              value={data.code}
              required
              class="form-control"
              id="inputAccountCode"
              placeholder="IS1000"
            ></input>
          </div>
          <div class="col">
            <label for="inputAccountName">Account Name</label>
            <input
              type="text"
              required
              class="form-control"
              name="name"
              onChange={handleChange}
              value={data.name}
              id="inputAccountName"
              placeholder="Purchase of materials"
            ></input>
          </div>
        </div>
        <div className="col">
          <button
            onClick={(event) => createAccount(event)}
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
              <th scope="col">Account Code</th>
              <th scope="col">Account Name</th>
              <th scope="col">IsNode</th>
              <th scope="col">Type</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, i) => {
              return (
                <tr>
                  <th scope="row">{i}</th>
                  <td>{account.code}</td>
                  <td>{account.name}</td>
                  <td>{account.isNode.toString()}</td>
                  <td>{account.type}</td>
                  <td>{account.balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Account;
