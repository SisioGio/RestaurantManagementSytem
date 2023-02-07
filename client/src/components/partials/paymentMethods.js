// client/src/App.js

import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import PaymentMethodRow from "../tables/rows/paymentMethodRow";
import { dispatchFeedbackContexts } from "../../App";

function PaymentMethod(props) {
  const [data, setData] = useState(null);
  const dispatch = dispatchFeedbackContexts();
  const cart = dispatchCartContexts();
  const getPaymentMethods = async () => {
    try {
      let res = await apiService.getPaymentMethods();
      props.setPaymentMethods(res.data);
      setData(res.data);
    } catch (err) {
      dispatch({
        value: true,
        message: err.message
          ? "Error getting payment methods from server: " + err.message
          : "Error",
        type: "Error",
      });
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);
  return (
    <div className="paymentMethods">
      <br></br>
      <br></br>
      <h1>Your payment methods</h1>
      <br></br>
      <br></br>
      <table>
        <thead>
          <th>BANK NAME</th>
          <th>IBAN</th>
          <th>SWITFT</th>
          <th>CVV</th>
          <th></th>
        </thead>
        <tbody>
          {data !== null && data !== "undefined"
            ? data.map((paymentMethod) => {
                return (
                  <PaymentMethodRow
                    new={false}
                    getPaymentMethods={getPaymentMethods}
                    row={paymentMethod}
                  />
                );
              })
            : null}

          <PaymentMethodRow
            getPaymentMethods={getPaymentMethods}
            new={true}
            row={{
              id: "",
              bankName: "",
              IBAN: "",
              swift: "",
              cvv: "",
              userId: apiService.getUser() ? apiService.getUser().id : "",
            }}
          />
        </tbody>
      </table>
    </div>
  );
}

export default PaymentMethod;
