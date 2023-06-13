import { React, useState } from "react";

function Table({ table, date, isTableAvailable, setTable, selectedTable }) {
  return (
    <div
      className={`p-2 text-center table ${
        isTableAvailable ? "available " : "unavailable "
      } ${selectedTable.id === table.id && "selected "}`}
      onClick={isTableAvailable ? () => setTable(table) : false}
    >
      <p>Table No.:{table.id} </p>
      <p>Capacity: {table.capacity}</p>
    </div>
  );
}

export default Table;
