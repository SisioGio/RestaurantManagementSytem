import Feedback from "../partials/feedback";
import React, { useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";

function User() {
  const [data, setData] = useState({});
  let { id } = useParams();

  const getUser = () => {
    console.log("Retrieving data from database...");
    fetch("/api/user/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw "An error occurred";
        }
      })
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log("error");
        dispatch({
          value: true,
          message: `Error, the user with id = ${id} does not exist `,
          title: "Error",
          type: "Error",
        });
      });
  };
  const dispatch = dispatchContexts();
  React.useEffect(() => {
    getUser();
  }, [id]);
  return (
    <div id="user">
      <Feedback />
      <div className="spacerS"></div>
      <h1>Requested User ID: {id}</h1>
      <div>
        <label htmlFor="">Firstname</label>
        <input type="text" disabled={true} value={data.firstname} />
      </div>

      <div>
        <label htmlFor="">Surname</label>
        <input type="text" disabled={true} value={data.surname} />
      </div>
      <div>
        <label htmlFor="">WalletAddress</label>
        <input type="text" disabled={true} value={data.walletAddress} />
      </div>
      <div>
        <label htmlFor="">Email</label>
        <input type="email" disabled={true} value={data.email} />
      </div>
      <div>
        <label htmlFor="">birthDate</label>
        <input
          type="date"
          disabled={true}
          value={moment(data.birthDate).format("yyyy-MM-DD")}
        />
      </div>
      <div>
        <label htmlFor="">createdAt</label>
        <input
          type="datetime-local"
          disabled={true}
          value={moment(data.createdAt).format("yyyy-MM-DD hh:mm:ss")}
        />
      </div>
      <div>
        <label htmlFor="">updatedAt</label>
        <input
          type="datetime-local"
          disabled={true}
          value={moment(data.updatedAt).format("yyyy-MM-DD hh:mm:ss")}
        />
      </div>
    </div>
  );
}

export default User;
