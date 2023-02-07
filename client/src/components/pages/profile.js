import React, { useEffect, useState } from "react";

import apiService from "../../services/apiService";
import PersonalInformation from "../partials/personalInformation";
import UserOrders from "../partials/userOrders";
import UserTickets from "../partials/userTickets";
import Orders from "../tables/orders";
function Profile() {
  const [table, setTable] = useState("tickets");

  const selectedContainer = () => {
    switch (table) {
      case "orders":
        return <UserOrders />;
      case "personal-data":
        return <PersonalInformation />;
      case "tickets":
        return <UserTickets />;
      default:
        return <UserOrders />;
    }
  };
  useEffect(() => {}, [table]);
  return (
    <div id="profile">
      <div className="user-data-container">
        <div className="user-data-headers">
          <a onClick={() => setTable("orders")} href="#">
            My Orders
          </a>
          <a onClick={() => setTable("personal-data")} href="#">
            My Personal Information
          </a>
          <a onClick={() => setTable("tickets")} href="#">
            My Tickets
          </a>
        </div>

        <div className="user-data orders">{selectedContainer()}</div>
      </div>
    </div>
  );
}

export default Profile;
