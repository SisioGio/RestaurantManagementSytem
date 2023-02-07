// client/src/App.js

import React, { useEffect, useState } from "react";
// Shows products of a selected order
function OrderDetails(props) {
  const [orderDetails, setOrderDetails] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setOrderDetails(props.orderDetails);
    setVisible(true);
  }, [props.orderDetails]);

  return Object.keys(orderDetails).length && visible ? (
    <div id="order-details">
      <a
        href="#"
        class="close-cart"
        onClick={(e) => (
          e.preventDefault(), props.setOrderDetails([]), setVisible(false)
        )}
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
      <h1>Details</h1>
      {orderDetails && (
        <div className="cartItems">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item, i) => {
                return (
                  <tr className="1">
                    <td>
                      <img src={item.stock.product.images[0].url}></img>
                    </td>
                    <td>{item.stock.product.name}</td>

                    <td>{item.stock.size.name}</td>
                    <td>{item.quantity}</td>
                    <td>{parseFloat(item.stock.product.price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ) : null;
}

export default OrderDetails;
