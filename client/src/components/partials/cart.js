// client/src/App.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/apiService";
import { dispatchCartContexts, showCartContexts } from "./../../App";

function Cart(props) {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const cart = showCartContexts();

  const dispatch = dispatchCartContexts();

  const deleteFromCart = (stockId) => {
    apiService.removeProductFromCart(stockId);

    dispatch({
      cart: JSON.parse(localStorage.getItem("cart")),
    });
  };
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <div>
      <div
        className="cart-icon"
        onClick={(e) => (e.preventDefault(), setVisible(!visible))}
      >
        <a href="#">
          Cart{" "}
          <span>{cart.cart.numberOfItems ? cart.cart.numberOfItems : 0}</span>
        </a>
      </div>

      <div className={visible ? "cart" : "cart hidden"}>
        <a
          href="#"
          class="close-cart"
          onClick={(e) => (e.preventDefault(), setVisible(!visible))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M24 3.752l-4.423-3.752-7.771 9.039-7.647-9.008-4.159 4.278c2.285 2.885 5.284 5.903 8.362 8.708l-8.165 9.447 1.343 1.487c1.978-1.335 5.981-4.373 10.205-7.958 4.304 3.67 8.306 6.663 10.229 8.006l1.449-1.278-8.254-9.724c3.287-2.973 6.584-6.354 8.831-9.245z" />
          </svg>
        </a>
        <h1>CART</h1>
        {cart.cart && cart.cart.items ? (
          <div className="cartItems">
            {cart && cart.cart && cart.cart.items
              ? cart.cart.items.map((item, i) => {
                  return (
                    <div className="cart-item">
                      <div>
                        <img src={item.image}></img>
                      </div>

                      <div>
                        <span>Product:{item.productName}</span>
                        <span>
                          {" "}
                          <small>Size: {item.sizeName}</small>
                        </span>
                        <span>
                          <small>Quantity: {item.quantity}</small>
                        </span>

                        <span>
                          <small>
                            Price: EUR{" "}
                            {parseFloat(item.productPrice).toFixed(2)}
                          </small>
                        </span>
                      </div>

                      <div>
                        <span>
                          EUR{" "}
                          {(
                            parseFloat(item.productPrice).toFixed(2) *
                            parseFloat(item.quantity).toFixed(2)
                          ).toFixed(2)}
                        </span>

                        <svg
                          onClick={() => deleteFromCart(item.stock)}
                          width="24"
                          height="24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        >
                          <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z" />
                        </svg>
                      </div>
                    </div>
                  );
                })
              : null}

            <div className="summary">
              <h5>Total EUR {parseFloat(cart.cart.totalAmount).toFixed(2)}</h5>
              <Link to="/checkout" onClick={() => setVisible(!visible)}>
                Checkout
              </Link>
            </div>
          </div>
        ) : (
          <h1>Data not available</h1>
        )}
      </div>
    </div>
  );
}

export default Cart;
