import React from "react";
import { dispatchFeedbackContexts } from "./../../App";
import apiService from "../../services/apiService";
import moment from "moment";
function Users() {
  const [data, setData] = React.useState([]);
  const dispatch = dispatchFeedbackContexts();
  const updateValues = async () => {
    try {
      let res = await apiService.getUsers();
      setData(res.data);
    } catch (err) {
      dispatch({
        value: true,
        message: err.message ? err.message : "Error",
        type: "Error",
      });
    }
  };
  function checkIfAdmin(row) {
    var output = false;
    row.roles.map((role) => {
      if (role.name.toString() === "admin") {
        output = true;
      }
    });

    return output;
  }
  React.useEffect(() => {
    console.log("Updating data...");
    updateValues();
  }, []);

  return (
    <div className="admin-users">
      {!data ? (
        <p>Waiting to fetch data...</p>
      ) : (
        data.map((row) => {
          return (
            <div className="admin-user">
              <div className="admin-user-field">
                <div>
                  <p>ID:</p>
                </div>
                <div>
                  <p> {row.id}</p>
                </div>
              </div>
              <div className="admin-user-field">
                <div>
                  <p>NAME:</p>
                </div>
                <div>
                  <p> {row.firstname}</p>
                </div>
              </div>
              <div className="admin-user-field">
                <div>
                  <p>SURNAME:</p>
                </div>
                <div>
                  {" "}
                  <p>{row.surname}</p>
                </div>
              </div>
              <div className="admin-user-field">
                <div>
                  <p>EMAIL:</p>
                </div>
                <div>
                  {" "}
                  <p>{row.email}</p>
                </div>
              </div>
              <div className="admin-user-field">
                <div>
                  <p>BIRTHDATE:</p>
                </div>
                <div>
                  {" "}
                  <p>{moment(row.birthdate).format("DD.MM.yyyy")}</p>
                </div>
              </div>
              <div className="admin-user-field">
                <div>
                  <p>ROLE:</p>
                </div>
                <div>
                  {" "}
                  <p>{checkIfAdmin(row) ? "ADMIN" : "USER"}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Users;
