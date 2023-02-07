// client/src/App.js

import moment from "moment";
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";
// Shows products of a selected order
function UserOrders() {
  const user = apiService.getUser();
  const [data, setData] = React.useState([]);
  const dispatch = dispatchFeedbackContexts();
  const [orderDetails, setOrderDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const getOrders = async () => {
    try {
      var res;

      if (user.id) {
        res = await apiService.getUserOrders(user.id);
        console.log(res.data);
        setData(res.data);
      } else {
        if (apiService.isAdmin()) {
          res = await apiService.getAdminOrders();
          console.log(res.data);
          setData(res.data);
        } else {
          dispatch({
            value: true,
            message: "You need to be an admin",
            type: "Error",
          });
        }
      }
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
    getOrders();
  }, []);
  return (
    <div className="user-orders">
      {data.map((order) => {
        return (
          <div className="user-order">
            <div className="user-order-header">
              <div className="user-order-header-data bold-text upper light-text order-title ">
                <p>Amount Paid €{order.totalAmount}</p>
              </div>
              <div className="user-order-header-data bold-text upper order-title">
                <h3>Order ID # {order.id}</h3>
              </div>
              <div className="user-order-header-data light-text order-title ">
                <p>
                  {" "}
                  Created on{" "}
                  {moment(order.createdAt).format("DD.MM.yyyy HH:mm:ss")}
                </p>
              </div>
            </div>
            <div
              className={
                showDetails ? "user-order-details" : "user-order-details hide"
              }
            >
              {order.order_products.map((product) => {
                return (
                  product.stock && (
                    <div className="user-order-product">
                      <img src={product.stock.product.images[0].url} alt="" />
                      <h3>{product.stock.product.name}</h3>
                      <div className="user-order-product-info">
                        <div>PRICE</div>
                        <div>€ {product.stock.product.price}</div>
                      </div>
                      <div className="user-order-product-info">
                        <div>QTY</div>
                        <div>{product.quantity}</div>
                      </div>

                      <div className="user-order-product-info">
                        <div>SIZE</div>
                        <div>{product.stock.size.name}</div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>

            <a
              href="#"
              className="orders-details-expand"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "Show Details"}
            </a>
            {order.address && (
              <div className="user-order-address">
                <h5>
                  Shipped to {order.address.street} no. {order.address.streetNo}
                  ,{order.address.city}, {order.address.postcode} -{" "}
                  {order.address.country}{" "}
                </h5>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserOrders;
