import { React, useEffect, useState } from "react";
import "./../../style/customer.css";
import { ShowUserContexts } from "../../App";
import apiService from "../../api/apiService";
import moment from "moment";
import { Link } from "react-router-dom";
import Bill from "./bill";

function AllReservations() {
  const userContext = ShowUserContexts();
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(null);
  const getReservations = async () => {
    try {
      const res = await apiService.getAllReservations();

      setReservations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmReservation = async (reservationId) => {
    try {
      await apiService.confirmReservation({
        userId: apiService.getUser().id,
        reservationId: reservationId,
      });
      getReservations();
    } catch (err) {
      console.log(err);
    }
  };

  const initializeReservation = async (reservationId) => {
    try {
      await apiService.initializeReservation({
        userId: apiService.getUser().id,
        reservationId: reservationId,
      });
      getReservations();
    } catch (err) {
      console.log(err);
    }
  };

  const generateBill = async (reservation) => {
    setReservation(reservation);
  };
  const selectReservation = (reservation) => {
    apiService.selectReservation(reservation);
  };
  useEffect(() => {
    getReservations();
  }, []);
  return (
    <div>
      {reservation && (
        <Bill
          reservation={reservation}
          setReservation={setReservation}
          getReservations={getReservations}
        />
      )}
      <div className="rounded-2">
        <table class="table table-dark  m-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col"># People</th>
              <th scope="col">Table</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return (
                <tr>
                  <th>#{reservation.id}</th>
                  <th>
                    {reservation.customer.user.firstName}{" "}
                    {reservation.customer.user.lastName}
                  </th>
                  <th>{moment(reservation.date).format("DD/MM/yyyy")}</th>

                  <th>
                    {moment(reservation.slot.start, "HH:mm:ss").format(
                      "HH:mm A"
                    )}
                  </th>

                  <th>
                    {moment(reservation.slot.end, "HH:mm:ss").format("HH:mm A")}
                  </th>

                  <th>{reservation.numberOfPeople}</th>
                  <th>{reservation.tableId}</th>
                  <th>{reservation.status}</th>
                  <th>
                    {reservation.status === "NEW" ? (
                      <a
                        className="btn btn-warning text-white w-100"
                        onClick={() => confirmReservation(reservation.id)}
                      >
                        CONFIRM
                      </a>
                    ) : reservation.status === "CONFIRMED" ? (
                      <a
                        className="btn btn-info text-white w-100"
                        onClick={() => initializeReservation(reservation.id)}
                      >
                        START
                      </a>
                    ) : reservation.status === "PROCESSING" ? (
                      <a
                        className="btn btn-success text-white w-100"
                        onClick={() => generateBill(reservation)}
                      >
                        GET BILL
                      </a>
                    ) : null}
                  </th>

                  <th>
                    <Link
                      to="/order"
                      className="btn btn-outline-info"
                      onClick={() => selectReservation(reservation)}
                    >
                      ORDERS
                    </Link>
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

export default AllReservations;
