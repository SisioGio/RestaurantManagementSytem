import { React, useState } from "react";
import "./../../style/customer.css";
import { ShowUserContexts } from "../../App";
import CustomerReservations from "./myReservations";
function CustomerPortal() {
  const userContext = ShowUserContexts();

  return (
    <div>
      <p className="ligh-title-xxl">Welcome back {userContext.data.name}</p>

      <CustomerReservations />
    </div>
  );
}

export default CustomerPortal;
