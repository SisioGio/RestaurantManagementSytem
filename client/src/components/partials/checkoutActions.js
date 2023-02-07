// client/src/App.js

import React, { useEffect, useState } from "react";

import { dispatchFeedbackContexts } from "./../../App";
import { Navigate } from "react-router-dom";
import apiService from "../../services/apiService";
import EthPayment from "./EthPayment";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { showCartContexts } from "./../../App";
function CheckoutActions(props) {
  const dispatch = dispatchFeedbackContexts();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [products, setProducts] = useState({});
  const [isSuccess, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethodId: null,
  });
  const cart = showCartContexts();
  const stripePromise = loadStripe(
    "pk_test_51MT8KwGigBa3rtfTguJoMPz4sjeu40arTsZcQjSwaMTcNyLuORO3DXiNOGB1KNBOZATppBL07QUdOJKHfLNpbRB300Nd0fSWZH"
  );

  const createStripeSession = async (event) => {
    try {
      if (!props.shippingAddress) {
        dispatch({
          value: true,
          message: "You need to select a shipping address ",
          type: "Error",
        });
        return;
      }

      const form = new FormData();
      form.append("userId", apiService.getUser().id);
      form.append("shipping", props.shippingAddress);
      const stripe_items = [];

      cart.cart.items.forEach((item) => {
        stripe_items.push({
          price: item.stripe_price,
          quantity: item.quantity,
        });
      });
      form.append("items", JSON.stringify(stripe_items));
      form.append("totalAmount", cart.cart.totalAmount);

      form.append("cartItems", JSON.stringify(cart.cart.items));

      console.log({ form: form });
      let session = await apiService.createCreditCardPayment(form);

      window.location.replace(session.data.url);
    } catch (err) {
      if (
        err.response.data.unavailableProducts &&
        err.response.data.unavailableProducts.length > 0
      ) {
        console.log(err.response.data.unavailableProducts);
        props.setUnavailableProducts(err.response.data.unavailableProducts);
      }

      dispatch({
        value: true,
        message: err.message ? err.message : "Error creating a payment session",
        type: "Error",
      });
    }
  };

  return (
    <div id="checkout-payment">
      <a onClick={(event) => createStripeSession(event)}>Checkout</a>

      <EthPayment
        setUnavailableProducts={props.setUnavailableProducts}
        shippingAddress={props.shippingAddress}
        amountToPay={products.totalAmount}
      />
    </div>
  );
}
export default CheckoutActions;
