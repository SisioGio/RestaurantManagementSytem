import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";
import moment from "moment";
import { Link } from "react-router-dom";
import { DispatchFeedbackContexts } from "../../App";
function CustomerReservations() {
  const feedback = DispatchFeedbackContexts();
  const [data, setData] = useState([]);
  const getReservations = async () => {
    try {
      var res = await apiService.getUserReservation();
      setData(res.data);
    } catch (err) {
      console.log("Error while getting reservations...");
    }
  };

  const deleteReservation = async (reservationId) => {
    try {
      await apiService.deleteReservation(reservationId);
      feedback({
        value: true,
        message: `Reservation deleted!`,
        type: "Success",
      });
      getReservations();
    } catch (err) {
      feedback({
        value: true,
        message: `Couldn't delete reservation`,
        type: "Error",
      });
      console.log(err);

      feedback({
        value: true,
        message: `Error while deleing reservation`,
        type: "Error",
      });
    }
  };
  useEffect(() => {
    getReservations();
  }, []);
  return (
    <div className="customer-section">
      <div className="section-header d-flex justify-content-between">
        <p className="ligh-title-xxl">My reservations</p>

        <Link
          to="/make-reservation"
          className="btn btn-success add-btn text-white"
        >
          Make Reservation
        </Link>
      </div>

      <div className="rounded-2">
        <table class="table table-dark  m-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col"># People</th>
              <th scope="col">Table</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((reservation) => {
              return (
                <tr>
                  <th>#{reservation.id}</th>
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
                    {reservation.status != "COMPLETED" && (
                      <a
                        className="edit-btn"
                        onClick={() => deleteReservation(reservation.id)}
                      >
                        <svg
                          width="24"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                          stroke-linejoin="round"
                          stroke-miterlimit="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z"
                            fill-rule="nonzero"
                          />
                        </svg>
                      </a>
                    )}
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

export default CustomerReservations;
