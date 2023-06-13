import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";
import moment from "moment";
import { Link, Navigate } from "react-router-dom";
import "./../../style/reservation.css";
import { DispatchFeedbackContexts } from "../../App";
function ReservationConfirmation() {
  const feedback = DispatchFeedbackContexts();
  const [details, setDetails] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const getDetails = () => {
    var details = apiService.getSelectedSlot();
    setDetails(details);
  };
  const makeReservation = () => {
    const data = {};
    data.userId = apiService.getUser().id;
    data.tableId = details.selectedTable.id;
    data.date = details.date;
    data.slotId = details.id;
    data.noOfPeople = details.noOfPeople;
    data.menuItems = details.menuItems;
    data.comment = comment;

    try {
      apiService.makeReservation(data);
      feedback({
        value: true,
        message: `Reservation created!`,
        type: "Success",
      });
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <div className="text-center d-flex flex-column gap-2 p-5">
      {success && <Navigate to="/customerPortal" />}
      <h1>Confirm Reservation</h1>
      {details && (
        <div className="reservation-details ">
          <div className="row justify-content-around py-2">
            <p>
              You're about to make a reservation for{" "}
              <b>{moment(details.date, "YYYY-MM-DD").format("YYYY-MM-DD")}</b>{" "}
              starting at{" "}
              <b>{moment(details.start, "HH:mm:ss").format("hh:mm A")}</b> and
              ending at{" "}
              <b>{moment(details.end, "HH:mm:ss").format("hh:mm A")}</b>, with a
              party size of <b>{details.noOfPeople}</b>.
            </p>
          </div>
          {details.menuItems ? (
            <div className="row text-center justify-content-center gap-2">
              <h5 className="text-center">
                Please find below the pre-ordered items from the menu
              </h5>
              <div className="rounded-2 w-100">
                <table class="table table-dark  m-0 w-100">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>

                      <th scope="col">Quantity</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.menuItems.map((menuItem, index) => {
                      return (
                        <tr>
                          <th>#{index}</th>
                          <th>{menuItem.name}</th>

                          <th>{menuItem.quantity}</th>

                          <th>{parseFloat(menuItem.price).toFixed(2)} €</th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>It looks like you didn't preorder any item from menu...</p>
          )}
        </div>
      )}

      <div className="d-flex justify-content-between">
        <Link
          to="/make-reservation/table-selection/menu-items"
          className="btn btn-danger"
        >
          Back
        </Link>

        <a
          href="#"
          onClick={() => setShowComment(true)}
          className="btn btn-success"
        >
          Make Reservation
        </a>
      </div>

      {showComment && (
        <div className="reservation-submission d-flex flex-column p-2 w-25 m-auto gap-2 ">
          <h3>Want to add a comment?</h3>
          <textarea
            name="comment"
            id="reservation-comment"
            cols="30"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows="3"
          ></textarea>
          <div className="d-flex justify-content-between">
            <a
              href="#"
              className="btn btn-danger"
              onClick={() => setShowComment(false)}
            >
              Back
            </a>
            <a
              href="#"
              className="btn btn-success"
              onClick={() => makeReservation()}
            >
              Submit
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationConfirmation;
