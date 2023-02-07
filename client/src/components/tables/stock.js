import React from "react";
import StockRow from "./rows/stockRow";
import { dispatchFeedbackContexts } from "./../../App";
import apiService from "../../services/apiService";

function Stock() {
  const [data, setData] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const dispatch = dispatchFeedbackContexts();

  const getStocks = async () => {
    try {
      let res = await apiService.getStocks();
      setData(res.data);
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

  const getProducts = async () => {
    try {
      let res = await apiService.getProducts();
      setProducts(res.data);
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

  const getSizes = async () => {
    try {
      let res = await apiService.getSizes();
      setSizes(res.data);
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

  React.useEffect(() => {
    getStocks();
    getProducts();
    getSizes();
  }, []);

  return (
    <div id="table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {!data ? (
            <p>Waiting to fetch data...</p>
          ) : (
            data.map((row) => {
              return (
                <StockRow
                  products={products}
                  sizes={sizes}
                  new={false}
                  update={getStocks}
                  row={row}
                />
              );
            })
          )}
          <StockRow
            new={true}
            products={products}
            sizes={sizes}
            update={getStocks}
            row={{ id: "", quantity: "", productId: "", sizeId: "" }}
          />
        </tbody>
      </table>
    </div>
  );
}

export default Stock;
