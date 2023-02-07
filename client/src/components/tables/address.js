import React, { useState } from "react";
// import OrderRow from "./rows/orderRow";
import { dispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";
import AddressRow from "./rows/addressRow";
function Address(props) {
  const [data, setData] = React.useState([]);
  const dispatch = dispatchFeedbackContexts();

  const updateValues = async () => {
    try {
      var res;

      res = await apiService.getUserAddress(apiService.getUser().id);

      setData(res.data);
    } catch (err) {
      console.log(err);
      dispatch({
        value: true,
        message: err.message || "Error",
        type: "Error",
      });
    }
  };

  React.useEffect(() => {
    updateValues();
  }, []);

  return (
    <div id="shipping-addresses">
      {data.length > 0
        ? data.map((row, i) => {
            return (
              <AddressRow
                new={false}
                shippingAddress={props.shippingAddress}
                setShippingAddress={props.setShippingAddress}
                userId={apiService.getUser().id}
                row={row}
                i={i}
                update={updateValues}
              ></AddressRow>
            );
          })
        : null}

      <AddressRow
        new={true}
        row={{
          country: null,
          city: null,
          postcode: null,
          street: null,
          streetNo: null,
        }}
        userId={apiService.getUser().id}
        update={updateValues}
      ></AddressRow>
    </div>
  );
}

export default Address;
