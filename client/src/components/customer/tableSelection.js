import { React, useEffect, useState } from "react";
import Table from "./table";

import apiService from "../../api/apiService";
import { Link } from "react-router-dom";

function TableSelection({}) {
  const [selectedTable, setTable] = useState(null);
  const [slot, setSlot] = useState(null);
  const saveTableToReservation = () => {
    apiService.selectTable(selectedTable);
  };
  const getSlot = () => {
    var slot = apiService.getSelectedSlot();
    setSlot(slot);
    setTable(slot.tables[0]);
  };
  useEffect(() => {
    getSlot();
  }, []);
  return slot ? (
    <div>
      <div className="reservation-confirmation text-center d-flex flex-column gap-2 p-5">
        <h3>It's time to choose a table! </h3>

        <p>
          In this step you are free to select the desired table if you have any.
        </p>
        <div className="table-list d-flex gap-2">
          {slot.tables.map((table) => (
            <Table
              table={table}
              date={slot.date}
              isTableAvailable={table.available}
              setTable={setTable}
              selectedTable={selectedTable}
            />
          ))}
        </div>

        <div className="buttons d-flex justify-content-between">
          <Link to="/make-reservation" className="btn btn-danger">
            Back
          </Link>

          <p>Reservation for table #{selectedTable.id}</p>
          <Link
            to="menu-items"
            className="btn btn-success"
            onClick={() => saveTableToReservation()}
          >
            Proceed
          </Link>
          {/* <button onClick={() => setProceed(true)}>Proceed</button> */}
        </div>
      </div>
    </div>
  ) : (
    <p>You didn't select any slot, please go back and select one</p>
  );

  // return proceed ? (
  //   <MenuSelection selectedSlot={selectedSlot} selectedTable={selectedTable} />
  // ) : (
  //   selectedSlot && (
  //     <div className="reservation-confirmation text-center d-flex flex-column gap-2">
  //       <h3>You can also select a specific table</h3>

  //       <div className="table-list d-flex gap-2">
  //         {tables.map((table) => (
  //           <Table
  //             table={table}
  //             date={selectedSlot.date}
  //             isTableAvailable={isTableAvailable}
  //             setSelectedTable={setSelectedTable}
  //           />
  //         ))}
  //       </div>

  //       <div className="buttons d-flex justify-content-between">
  //         <button
  //           className="btn btn-danger"
  //           onClick={() => setSelectedSlot(null)}
  //         >
  //           Back
  //         </button>
  //         <button onClick={() => setProceed(true)}>Proceed</button>
  //       </div>
  //     </div>
  //   )
  // );
}

export default TableSelection;
