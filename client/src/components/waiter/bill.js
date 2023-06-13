import { React, useEffect, useState } from "react";
import moment from "moment";
import apiService from "../../api/apiService";
function Bill({ reservation, setReservation, getReservations }) {
  const [paymentType, setPaymentType] = useState("Card");
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

  const ordersAreCompleted = () => {
    var check = true;
    reservation.onsiteOrders.forEach((order) => {
      console.log(order.status);
      if (order.status !== "COMPLETED") {
        check = false;
      }
    });
    console.log(check);
    return check;
  };

  const completeReservation = async () => {
    try {
      console.log({
        userId: apiService.getUser().id,
        reservationId: reservation.id,
        paymentType: paymentType,
      });
      await apiService.completeReservation({
        userId: apiService.getUser().id,
        reservationId: reservation.id,
        paymentType: paymentType,
      });
      setReservation(null);
      getReservations();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bill p-5 d-flex flex-column gap-2">
      <h1>Reservation Summary</h1>

      <div className="bill-details d-flex justify-content-around gap-2">
        <div>
          <p className="bold">Customer</p>
          <p>
            {reservation.customer.user.firstName +
              " " +
              reservation.customer.user.lastName}
          </p>
        </div>

        <div>
          <p className="bold">Date</p>
          <p>
            {moment(reservation.date).format("DD-MM-YYYY") +
              " (" +
              moment(reservation.slot.start, "HH:mm:ss.sss").format("hh:mm A") +
              " - " +
              moment(reservation.slot.end, "HH:mm:ss.sss").format("hh:mm A") +
              " )"}{" "}
          </p>
        </div>

        <div>
          <p className="bold">Total amount to pay</p>
          <p>
            {reservation.onsiteOrders &&
              parseFloat(
                calculateReservationTotalPrice(reservation.onsiteOrders)
              ).toFixed(2)}{" "}
            €
          </p>
        </div>
      </div>
      <div>
        <select
          onChange={(event) => setPaymentType(event.target.value)}
          className="form-select w-100"
          name="paymentType"
          id="paymentType"
        >
          <option value="card">Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      <div className="bill-actions d-flex justify-content-between">
        <button className="btn btn-danger" onClick={() => setReservation(null)}>
          Back
        </button>

        <button
          disabled={ordersAreCompleted() ? 0 : 1}
          className="btn btn-success"
          onClick={() => completeReservation()}
        >
          Paid
        </button>
      </div>
    </div>
  );
}

export default Bill;
