// client/src/App.js

import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { dispatchCartContexts, showCartContexts } from "./../../App";
function QuantitySelector({ quantity, stockId }) {
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const dispatch = dispatchCartContexts();
  const updateCartItemQuantity = (quantity) => {
    if (quantity < 1) {
      return;
    }
    apiService.updateCartItemQuantity(stockId, quantity);
    dispatch({
      cart: JSON.parse(localStorage.getItem("cart")),
    });
  };

  useEffect(() => {
    setSelectedQuantity(quantity);
  }, [quantity]);
  return (
    <div className="quantity-selector-cart">
      <input
        type="number"
        value={selectedQuantity}
        onChange={(event) => updateCartItemQuantity(event.target.value)}
      />
    </div>
  );
}

export default QuantitySelector;
