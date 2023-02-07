import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";

function SizeInputField({
  selectedSize,
  sizes,
  updateSizeList,
  setSelectedSize,
}) {
  const dispatch = dispatchFeedbackContexts();
  const [open, setOpen] = useState(false);
  const [newSize, setNewSize] = useState("");
  const addSize = async () => {
    const form = new FormData();
    form.append("name", newSize);

    try {
      await apiService.addSize(form);

      updateSizeList();
    } catch (err) {
      console.log(err);
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
  };
  const handleSizeInput = (event) => {
    const size = event.target.value.toUpperCase();
    console.log(size);

    setNewSize(size);
  };
  return (
    selectedSize && (
      <div className="admin-stock-select">
        <a
          href="#"
          onClick={(event) => (event.preventDefault(), setOpen(!open))}
        >
          {selectedSize.name ? selectedSize.name : "Select"}
        </a>
        {open && (
          <ul className="admin-stock-menu">
            <li>
              <input
                type="text"
                value={newSize}
                placeholder="Create..."
                onChange={(event) => handleSizeInput(event)}
              />
              <a href="#" onClick={() => addSize()}>
                ADD
              </a>
            </li>
            {sizes.map((size) => {
              return (
                <li>
                  <a
                    className="admin-stock-menu-item"
                    href="#"
                    onClick={(event) => (
                      setSelectedSize(size),
                      event.preventDefault(),
                      setOpen(false)
                    )}
                  >
                    {size.name}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    )
  );
}

export default SizeInputField;
