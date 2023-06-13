import { React, useEffect, useState } from "react";
import "./../../style/menu.css";
function MenuItem({ item, orderItems, setOrderItems }) {
  const [expanded, setExpanded] = useState(false);
  const [selectQuantity, setSelectQuantity] = useState(false);
  const [orderedItem, setOrderedItem] = useState(null);
  const getItemFromOrder = () => {
    var menuItemId = item.id;
    var itemIndex = orderItems.findIndex(
      (item) => item.menuItemId === menuItemId
    );
    if (itemIndex > -1) {
      setOrderedItem(orderItems[itemIndex]);
    } else {
      setOrderedItem(null);
    }
  };
  const addItemToOrder = () => {
    if (orderedItem) {
      // Item already added

      orderedItem.quantity = parseFloat(orderedItem.quantity) + 1;
      orderedItem.price = parseFloat(item.price * orderedItem.quantity);
      const newOrderItems = [...orderItems];
      setOrderItems(newOrderItems);
      console.log(newOrderItems);
    } else {
      var itemObj = {
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        price: parseFloat(item.price),
      };
      const newOrderItems = [...orderItems, itemObj];
      setOrderItems(newOrderItems);
      console.log(newOrderItems);
    }
  };

  const deductItemOrder = () => {
    if (orderedItem && orderedItem.quantity > 0) {
      orderedItem.quantity = parseFloat(orderedItem.quantity) - parseFloat(1);
      orderedItem.price =
        parseFloat(orderedItem.quantity) * parseFloat(item.price);
      const newOrderItems = [...orderItems];
      setOrderItems(newOrderItems);
    }
  };
  useEffect(() => {
    getItemFromOrder();
  }, [orderItems]);
  return (
    <div className="menu-item row position-relative justify-content-between">
      <p className="col-8 text-start">{item.name}</p>
      <div className="col-4">
        <div className="row">
          <p className="col-2">{item.price} €</p>
          <div className="col-2">
            <a href="#" onClick={() => setExpanded(!expanded)}>
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
                  d="m15.985 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007zm.741 8.499h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75h4.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm3-2.5h-7.5c-.414 0-.75.336-.75.75s.336.75.75.75h7.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm0-2.5h-7.5c-.414 0-.75.336-.75.75s.336.75.75.75h7.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"
                  fill-rule="nonzero"
                />
              </svg>
            </a>
            {expanded && (
              <div className="item-ingredients">
                {item.ingredients.map((ingredient) => (
                  <div>
                    <p> {ingredient.inventory.name}</p>

                    <p>
                      {ingredient.quantityNeeded}{" "}
                      {ingredient.inventory.unitOfMeasure}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-2">
            <a href="#" onClick={() => setSelectQuantity(!selectQuantity)}>
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
                  d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                  fill-rule="nonzero"
                />
              </svg>
            </a>

            {selectQuantity && (
              <div className="quantitySelection">
                <a
                  className="btn btn-danger"
                  href="#"
                  onClick={() => deductItemOrder()}
                >
                  -
                </a>
                <p className="m-0">{orderedItem ? orderedItem.quantity : 0}</p>
                <a
                  className="btn btn-success border-radius-0"
                  href="#"
                  onClick={() => addItemToOrder()}
                >
                  +
                </a>
              </div>
            )}
          </div>

          <p className="col-2">{orderedItem ? orderedItem.quantity : 0}</p>
          <p className="col-4">
            {orderedItem
              ? parseFloat(orderedItem.price).toFixed(2)
              : (0.0).toFixed(2)}{" "}
            €
          </p>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
