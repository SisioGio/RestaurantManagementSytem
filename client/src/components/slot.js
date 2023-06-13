import { React, useState } from "react";
import apiService from "../api/apiService";
import { Link, Navigate } from "react-router-dom";
import moment from "moment";
function Slot({ date, slot, noOfPeople }) {
  const [proceed, setProceed] = useState(false);

  const goToTableSelection = () => {
    slot.date = date.date;
    slot.noOfPeople = noOfPeople;
    apiService.selectSlot(slot);
    setProceed(true);
  };
  return proceed ? (
    <Navigate to="table-selection" />
  ) : (
    <div
      className={`slot-view border text-center slot ${
        slot.available ? "available" : "unavailable"
      }`}
      onClick={slot.available ? () => goToTableSelection() : null}
    >
      <p className="day">
        {moment(date.date, "DD-MM-YYYY").format("MM-DD-YYYY")}
      </p>
      <p>
        {slot.start}-{slot.end}
      </p>
    </div>
  );
}

export default Slot;
