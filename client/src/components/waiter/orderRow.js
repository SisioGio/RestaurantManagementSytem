import { React, useEffect, useState } from "react";
import apiService from "../../api/apiService";

function OrderRow({ item, index, getOrderDetails, reservation }) {
  const [update, setUpdate] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const updateOrderItemQuantity = async () => {
    try {
      await apiService.updateOrderItemQuantity({
        userId: apiService.getUser().id,
        orderItemId: item.id,
        quantity: quantity,
      });
      getOrderDetails();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteOrderItem = async () => {
    try {
      await apiService.deleteOrderItem({
        userId: apiService.getUser().id,
        orderItemId: item.id,
      });
      getOrderDetails();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr>
      <th>#{index}</th>
      <th>{item.menuItem.name}</th>
      <th>{item.quantity}</th>

      <th>{item.menuItem.price.toFixed(2)} €</th>

      <th>{(item.quantity * item.menuItem.price).toFixed(2)}€</th>

      <th>{item.status}</th>

      <th className="text-right position-relative">
        {item.status.toString() === "NEW" && (
          <button
            disabled={reservation.status === "PROCESSING" ? 0 : 1}
            className="btn btn-info"
            onClick={() => setUpdate(!update)}
          >
            UPDATE
          </button>
        )}
        {update && (
          <div className="position-absolute update-order-item d-flex flex-column gap-1 p-1 rounded">
            <div className="d-flex justify-content-between align-items-center  ">
              <a
                href="#"
                className="btn btn-danger col-3"
                onClick={(event) =>
                  quantity > 1 &&
                  (event.preventDefault(),
                  setQuantity(parseFloat(quantity) - 1))
                }
              >
                -
              </a>
              <input
                className="col-3 m-0 text-center btn "
                onChange={(event) => setQuantity(event.target.value)}
                value={quantity}
              ></input>
              {/* <p className="col-4 m-0 text-center">{quantity}</p> */}
              <a
                href="#"
                className="btn btn-success col-3"
                onClick={(event) => (
                  event.preventDefault(), setQuantity(parseFloat(quantity) + 1)
                )}
              >
                +
              </a>
            </div>
            <div className="d-flex gap-1">
              <a
                onClick={() => setUpdate(!update)}
                className="btn btn-danger w-50"
              >
                Back
              </a>

              <a
                className="btn btn-success w-50"
                onClick={() => updateOrderItemQuantity()}
              >
                Update
              </a>
            </div>
          </div>
        )}
      </th>

      <th className="text-right position-relative">
        {item.status.toString() === "NEW" && (
          <button
            className="btn btn-danger"
            disabled={reservation.status === "PROCESSING" ? 0 : 1}
            onClick={() => deleteOrderItem(item.id)}
          >
            DELETE
          </button>
        )}
      </th>
    </tr>
  );
}

export default OrderRow;
