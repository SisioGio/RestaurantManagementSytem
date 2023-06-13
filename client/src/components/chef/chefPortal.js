import { React, useEffect, useState } from "react";
import "./../../style/customer.css";
import { ShowUserContexts } from "../../App";
import apiService from "../../api/apiService";
import moment from "moment";
import { Link } from "react-router-dom";
function ChefPortal() {
  const [orderItems, setOrderItems] = useState({});
  const [role, setRole] = useState(null);
  // const [filteredItems, setFilteredItems] = useState([]);
  const [status, setStatus] = useState("NEW");
  const getOrderItems = async () => {
    try {
      const res = await apiService.getOrderItems();
      setOrderItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const filterItems = (status) => {
    setStatus(status);
  };

  const startPreparingItem = async (orderItemId) => {
    try {
      await apiService.markItemAsPreparing({
        userId: apiService.getUser().id,
        orderItemId: orderItemId,
      });
      getOrderItems();
    } catch (err) {
      console.log(err);
    }
  };

  const completeOrderItem = async (orderItemId) => {
    try {
      await apiService.markItemAsReady({
        userId: apiService.getUser().id,
        orderItemId: orderItemId,
      });
      getOrderItems();
    } catch (err) {
      console.log(err);
    }
  };

  const serveOrder = async (orderItemId) => {
    try {
      await apiService.markItemAsServed({
        userId: apiService.getUser().id,
        orderItemId: orderItemId,
      });
      getOrderItems();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getOrderItems();

    const role = apiService.getUser().role;
    setRole(role);
    if (role === "WAITER") {
      filterItems("READY");
    } else {
      filterItems("NEW");
    }
  }, []);
  return (
    <div>
      <div className="order-items-filters d-flex justify-content-around">
        <button
          value="NEW"
          onClick={(event) => filterItems(event.target.value)}
          className={`status flex-grow-1 btn ${
            status === "NEW" ? "active" : "  "
          }`}
        >
          NEW{" "}
          <small>({orderItems["NEW"] ? orderItems["NEW"].length : "0"})</small>
        </button>
        <button
          value="PREPARING"
          onClick={(event) => filterItems(event.target.value)}
          className={`status flex-grow-1 btn ${
            status === "PREPARING" ? "active" : "  "
          }`}
        >
          PREPARING{" "}
          <small>
            ({orderItems["PREPARING"] ? orderItems["PREPARING"].length : "0"})
          </small>
        </button>
        <button
          value="READY"
          onClick={(event) => filterItems(event.target.value)}
          className={`status flex-grow-1 btn ${
            status === "READY" ? "active" : "  "
          }`}
        >
          READY
          <small>
            ({orderItems["READY"] ? orderItems["READY"].length : "0"})
          </small>
        </button>
        <button
          value="COMPLETED"
          onClick={(event) => filterItems(event.target.value)}
          className={`status flex-grow-1 btn ${
            status === "COMPLETED" ? "active" : "  "
          }`}
        >
          COMPLETED
          <small>
            ({orderItems["COMPLETED"] ? orderItems["COMPLETED"].length : "0"})
          </small>
        </button>
        <button
          value="CANCELED"
          onClick={(event) => filterItems(event.target.value)}
          className={`status flex-grow-1 btn ${
            status === "CANCELED" ? "active" : "  "
          }`}
        >
          CANCELED
          <small>
            ({orderItems["CANCELED"] ? orderItems["CANCELED"].length : "0"})
          </small>
        </button>
      </div>
      <div className="">
        {status}
        <table class="table table-dark  m-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Updated At</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Status</th>

              <th scope="col">
                {status === "NEW"
                  ? "PREPARE"
                  : status === "PREPARING"
                  ? "COMPLETE"
                  : status === "READY"
                  ? "SERVE"
                  : null}
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems[status] &&
              orderItems[status].map((orderItem) => {
                return (
                  <tr>
                    <th>#{orderItem.id}</th>
                    <th>
                      {moment(orderItem.updatedAt).format("DD-MM-YYYY hh:mm A")}
                    </th>
                    <th>{orderItem.menuItem.name}</th>
                    <th>{orderItem.quantity}</th>

                    <th>{orderItem.status}</th>

                    <th>
                      {status === "NEW" ? (
                        <button
                          disabled={role === "CHEF" ? 0 : 1}
                          className="btn btn-success"
                          onClick={() => startPreparingItem(orderItem.id)}
                        >
                          PREPARE
                        </button>
                      ) : status === "PREPARING" ? (
                        <button
                          disabled={role === "CHEF" ? 0 : 1}
                          className="btn btn-success"
                          onClick={() => completeOrderItem(orderItem.id)}
                        >
                          COMPLETE
                        </button>
                      ) : status === "READY" ? (
                        orderItem.order.type === "ONSITE" ? (
                          <button
                            disabled={role === "WAITER" ? 0 : 1}
                            className="btn btn-success"
                            onClick={() => serveOrder(orderItem.id)}
                          >
                            SERVE
                          </button>
                        ) : null
                      ) : null}
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChefPortal;
