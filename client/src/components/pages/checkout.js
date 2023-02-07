// client/src/App.js

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import QuantitySelector from "../partials/quantitySelector";
import apiService from "../../services/apiService";
import CheckoutActions from "../partials/checkoutActions";
import Address from "../tables/address";
import { dispatchCartContexts, showCartContexts } from "./../../App";
function Checkout(props) {
  const cart = showCartContexts();
  const dispatch = dispatchCartContexts();
  const [shippingAddress, setShippingAddress] = useState(null);
  const [unavailableProducts, setUnavailableProducts] = useState([]);
  const deleteCartItem = (stockId) => {
    apiService.removeProductFromCart(stockId);

    dispatch({
      cart: JSON.parse(localStorage.getItem("cart")),
    });
  };

  const isProductAvailable = (stockId) => {
    return unavailableProducts.findIndex((prod) => prod.stock === stockId) > -1;
  };
  useEffect(() => {}, [cart, unavailableProducts]);

  useEffect(() => {}, [shippingAddress]);
  return (
    <div className="checkout">
      {!apiService.getUser() && <Link to="/login"></Link>}
      <p>
        {cart.cart.items && cart.cart.items.length > 0
          ? `You're almost there! Continue to complete your purchase of ${cart.cart.numberOfItems} products`
          : "Your cart is empty"}
      </p>

      <div className="checkout-cart">
        {cart && cart.cart.items
          ? cart.cart.items.map((item, i) => {
              return (
                <div
                  className={
                    isProductAvailable(item.stock)
                      ? "checkout-cart-item border-red"
                      : "checkout-cart-item"
                  }
                >
                  <div className="image">
                    <img src={item.image}></img>
                  </div>
                  <div className="checkout-cart-item-details">
                    <div className="product-cart-field">
                      <div> Product:</div>
                      <div> {item.productName}</div>
                    </div>
                    <div className="product-cart-field">
                      <div>Size:</div>
                      <div> {item.sizeName}</div>
                    </div>

                    <div className="product-cart-field">
                      <div>Qty:</div>
                      {/* <div> {item.quantity}</div> */}
                      <QuantitySelector
                        quantity={item.quantity}
                        stockId={item.stock}
                      />
                      {isProductAvailable(item.stock) && (
                        <div className="product-quantity-unavailable">
                          Available:{" "}
                          {
                            unavailableProducts[
                              unavailableProducts.findIndex(
                                (prod) => prod.stock === item.stock
                              )
                            ].availableQuantity
                          }
                        </div>
                      )}
                    </div>
                    <div className="product-cart-field">
                      <div>Price: </div>
                      <div>€ {parseFloat(item.productPrice).toFixed(2)}</div>
                    </div>

                    <div className="product-cart-field">
                      <div>Total: </div>
                      <div>
                        {" "}
                        €{" "}
                        {(
                          parseFloat(item.productPrice) *
                          parseFloat(item.quantity)
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="product-cart-field">
                      <a onClick={() => deleteCartItem(item.stock)} href="#">
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>

      <div id="continue-btn">
        <p>Total Amount: € {parseFloat(cart.cart.totalAmount).toFixed(2)}</p>
      </div>

      <div className="shipping">
        <p>Please select one of your addresses or create a new one</p>
        <Address
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          setUnavailableProducts={setUnavailableProducts}
        ></Address>
      </div>

      <CheckoutActions
        setUnavailableProducts={setUnavailableProducts}
        shippingAddress={shippingAddress}
      />
    </div>
  );
}

export default Checkout;
