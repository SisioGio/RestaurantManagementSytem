import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import PaymentConfirmation from "./paymentConfirmation";
import { dispatchCartContexts } from "../../App";

function PaymentStatus(props) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentStatus = params.get("status");
  const orderId = params.get("order");
  const paymentHash = params.get("paymentID");
  const [success, setSuccess] = useState(null);
  const [data, setData] = useState({});
  const cart = dispatchCartContexts();
  const confirmOrder = async () => {
    try {
      let res = await apiService.confirmOrder(orderId);
      setSuccess(true);
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (paymentStatus === "success" && orderId) {
      confirmOrder();
      apiService.deleteCart();
      cart({
        cart: {},
      });
    }
  }, []);
  return (
    <div>
      {success ? (
        !success ? (
          <h1>Payment failed!</h1>
        ) : (
          <PaymentConfirmation data={data} />
        )
      ) : (
        "Waiting payment confirmation"
      )}
    </div>
  );
}

export default PaymentStatus;
