import React, { useEffect, useState } from "react";
import Users from "../tables/users";
import Products from "../tables/products";
import Orders from "../tables/orders";
import Size from "../tables/size";
import Stock from "../tables/stock";

import UserTickets from "../partials/userTickets";
function Admin(props) {
  const [table, setTable] = useState("product");

  const tableName = () => {
    switch (table) {
      case "product":
        return <Products />;
      case "user":
        return <Users />;
      case "order":
        return <Orders />;

      case "ticket":
        return <UserTickets />;
      default:
        return <Stock />;
    }
  };

  return (
    <div id="admin">
      {/* {!apiService.isAdmin() && <Navigate to="/login" replace />} */}

      <div className="user-data-container">
        <div className="user-data-headers">
          <a onClick={() => setTable("product")} href="#">
            PRODUCTS
          </a>
          <a onClick={() => setTable("user")} href="#">
            USERS
          </a>
          <a onClick={() => setTable("order")} href="#">
            ORDERS
          </a>

          <a onClick={() => setTable("ticket")} href="#">
            TICKETS
          </a>
        </div>

        <div className="user-data orders">{tableName()}</div>
      </div>
    </div>
  );
}

export default Admin;
