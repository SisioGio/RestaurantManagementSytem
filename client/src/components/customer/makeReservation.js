import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";
import moment from "moment";
import TableList from "./table";
import Slot from "../slot";
import TableSelection from "./tableSelection";
function CustomerMakeReservation() {
  const [form, setForm] = useState({
    from: moment().format("yyyy-MM-DD"),
    to: moment().format("yyyy-MM-DD"),
    noOfPeople: 2,
  });
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [data, setData] = useState([]);
  const getScheduleInformation = async () => {
    try {
      var res = await apiService.getSchedule(
        form.from,
        form.to,
        form.noOfPeople
      );
      console.log(res);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  function handleChange(event) {
    const { value, name } = event.target;

    setForm((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));

    console.log(value);
  }

  useEffect(() => {
    getScheduleInformation();
  }, [form]);
  return (
    <div className="reservation-form d-flex flex-column gap-2 pt-5 w-75 m-auto">
      <div>
        <h3 className="text-center p-3">
          Reserve Your Spot: Make a Reservation Today!
        </h3>

        <form className="p-5">
          <div class="form-row">
            <div class="col">
              <label htmlFor="">For how many people is the reservation?</label>
              <input
                onChange={handleChange}
                type="number"
                className="form-control-lg"
                placeholder="Type here..."
                name="noOfPeople"
                value={form.noOfPeople}
              ></input>
            </div>
            <div class="col">
              <label htmlFor="">From</label>
              <input
                name="from"
                onChange={handleChange}
                value={form.from}
                placeholder="Select a date"
                type="date"
                class="form-control-lg"
                id="dateInput"
                // min={moment().format("YYYY-MM-DD")}
              ></input>
            </div>
            <div class="col">
              <label htmlFor="">To</label>
              <input
                name="to"
                onChange={handleChange}
                value={form.to}
                placeholder="Select a date"
                type="date"
                class="form-control-lg"
                id="dateInput"
                // min={moment().format("YYYY-MM-DD")}
              ></input>
            </div>
          </div>
        </form>

        <div className="tables-view text-center ">
          <h4>Below you can find the list of all possibles slots</h4>
          <div className="d-flex  justify-content-around pt-5">
            {data.map((date) =>
              date.slots.map((slot) => (
                <Slot date={date} slot={slot} noOfPeople={form.noOfPeople} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerMakeReservation;
