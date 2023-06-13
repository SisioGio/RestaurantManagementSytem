import { React, useState } from "react";
import "./../../style/customer.css";
import { ShowUserContexts } from "../../App";
import AllReservations from "./allReservations";

function WaiterPortal() {
  const userContext = ShowUserContexts();

  return (
    <div>
      <p className="ligh-title-xxl">Welcome back {userContext.data.name}</p>
      <AllReservations />
    </div>
  );
}

export default WaiterPortal;
