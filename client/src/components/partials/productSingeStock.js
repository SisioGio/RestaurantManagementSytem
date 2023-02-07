import React, { useEffect, useState } from "react";
import SizeInputField from "./sizeInputField";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "../../App";

function ProductSingleStock({
  sizes,
  product,
  updateProducts,
  updateSizeList,
  stock,
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(stock.quantity);
  const dispatch = dispatchFeedbackContexts();
  const saveStock = async () => {
    const form = new FormData();

    form.append("quantity", quantity);
    form.append("productId", product.id);
    form.append("sizeName", selectedSize.name);

    try {
      let res = await apiService.addStock(form);
      updateProducts();
      dispatch({
        value: true,
        message: "Success, stock created/updated",
        type: "Success",
      });
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
  };
  const [object, setObject] = useState([]);
  const deleteStock = async () => {
    try {
      await apiService.deleteStock(stock.id);

      dispatch({
        value: true,
        message: "Success, stock deleted",
        type: "Success",
      });
    } catch (err) {
      dispatch({
        value: true,
        message: err.response.data.message
          ? err.response.data.message
          : "Error",
        type: "Error",
      });
    }
    updateProducts();
  };
  useEffect(() => {
    console.log("SINGLE STOCK UPDATED");
    setObject(stock);
    setSelectedSize(stock.size);
    setQuantity(stock.quantity);
  }, [stock]);
  return (
    <div className="stock">
      <SizeInputField
        updateSizeList={updateSizeList}
        sizes={sizes}
        setSelectedSize={setSelectedSize}
        selectedSize={selectedSize}
        stock={object}
      />

      <input
        type="number"
        onChange={(event) => setQuantity(event.target.value)}
        name="quantity"
        value={quantity}
      />
      <div className="flex-around">
        <svg
          onClick={(event) => (event.preventDefault(), saveStock())}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z" />
        </svg>

        <svg
          width="24"
          height="24"
          onClick={() => deleteStock()}
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
      </div>
    </div>
  );
}

export default ProductSingleStock;
