import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";
import "./../../style/order.css";
import moment from "moment";
import "./../../style/reservation.css";
import MenuSelection from "../menu/menuSelection.js";
import OrderRow from "./orderRow";

function Order() {
  const [reservation, setReservation] = useState();
  const [menu, setMenu] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const getOrderDetails = async () => {
    var reservationId = apiService.getSelectedReservation().id;
    try {
      var res = await apiService.getReservationByID(reservationId);
      setReservation(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotalPrices = (onsiteOrder) => {
    var totalAmount = onsiteOrder.order.orderItems.reduce((total, item) => {
      if (item.status !== "CANCELED") {
        return total + item.quantity * item.menuItem.price;
      }
      return total;
    }, 0);

    return totalAmount;
  };

  const addOrderToReservation = async () => {
    try {
      const data = {
        userId: apiService.getUser().id,
        reservationId: reservation.id,
        orderItems: orderItems,
      };
      await apiService.createOnsiteOrder(data);
      getOrderDetails();
      setMenu(false);
    } catch (err) {
      console.log(err);
    }
  };
  const startOrder = async (orderId) => {
    try {
      const res = await apiService.startOrder({
        userId: apiService.getUser().id,
        onsiteOrderId: orderId,
      });
      getOrderDetails();
    } catch (err) {
      console.log(err);
    }
  };
  const calculateReservationTotalPrice = (orderItems) => {
    console.log({ orderItems: orderItems });
    const totalAmounts = orderItems.map((order) =>
      order.order.orderItems.reduce((total, item) => {
        if (item.status !== "CANCELED") {
          return total + item.quantity * item.menuItem.price;
        }
        return total;
      }, 0)
    );
    console.log(totalAmounts);

    const totalPrice = totalAmounts.reduce(
      (total, amount) => total + amount,
      0
    );

    return totalPrice;
  };
  useEffect(() => {
    getOrderDetails();
  }, []);
  return reservation ? (
    <div className="d-flex flex-column gap-2 justify-content-center p-5 text-center bg-white m-5">
      <div>
        <div className="text-start">
          <h3>Reservation Details</h3>
        </div>

        <div className="d-flex gap-2 justify-content-around p-4 reservation-header">
          <div>
            <p>Reservation ID</p>
            <p># {reservation.id}</p>
          </div>
          <div>
            <p>Reservation Status</p>
            <p>{reservation.status}</p>
          </div>
          <div>
            <p>Created At</p>
            <p>
              {moment(reservation.createdAt).format("DD-MM-YYYY hh:mm:ss A")}
            </p>
          </div>

          <div>
            <p>Customer</p>
            <p>
              {reservation.customer.user.firstName +
                " " +
                reservation.customer.user.lastName}
            </p>
          </div>

          <div>
            <p>Table</p>
            <p>{reservation.table.id}</p>
          </div>

          <div>
            <p>Date</p>
            <p>{moment(reservation.date).format("DD-MM-YYYY")}</p>
          </div>
          <div>
            <p>From</p>
            <p>
              {moment(reservation.slot.start, "HH:mm:ss.sss").format("hh:mm A")}
            </p>
          </div>
          <div>
            <p>To</p>
            <p>
              {moment(reservation.slot.end, "HH:mm:ss.sss").format("hh:mm A")}
            </p>
          </div>
          <div>
            <p>Total Price</p>
            <p>
              {parseFloat(
                calculateReservationTotalPrice(reservation.onsiteOrders)
              ).toFixed(2)}{" "}
              €
            </p>
          </div>
        </div>
      </div>

      <div className="orders d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <h3>Orders</h3>
          <button
            disabled={reservation.status === "PROCESSING" ? 0 : 1}
            className="btn btn-success"
            onClick={() => setMenu(true)}
          >
            ADD ORDER
          </button>
        </div>

        {reservation &&
          reservation.onsiteOrders.map((order) => (
            <div className="order">
              <div className="order-header d-flex justify-content-around pb-3">
                <div>
                  <p>Order No.</p>
                  <p className="text-bold col-4"># {order.id}</p>
                </div>
                <div>
                  <p>Status</p>
                  <p className="text-bold col-4">{order.status}</p>
                </div>
                <div>
                  <p>Created At</p>
                  <p className="text-bold col-4">
                    {moment(order.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </p>
                </div>
                <div>
                  <p>Assigned To</p>
                  {order.status === "PREORDER" ? (
                    <button
                      disabled={reservation.status === "PROCESSING" ? 0 : 1}
                      onClick={() => startOrder(order.id)}
                      className="btn btn-info"
                    >
                      START
                    </button>
                  ) : (
                    <p className="text-bold col-4">
                      {order.waiter &&
                        order.waiter.employee.user.firstName +
                          " " +
                          order.waiter.employee.user.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <p>Total Amount</p>
                  <p className="text-bold col-4">
                    {calculateTotalPrices(order).toFixed(2)} €
                  </p>
                </div>
              </div>
              <div className="">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                      <th scope="col">Total Price</th>
                      <th scope="col">Status</th>

                      <th scope="col">Update</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.order.orderItems.map((item, index) => (
                      <OrderRow
                        reservation={reservation}
                        item={item}
                        index={index}
                        getOrderDetails={getOrderDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      {menu && (
        <MenuSelection
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          onBack={() => setMenu(false)}
          OnSubmit={() => addOrderToReservation()}
        />
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default Order;
