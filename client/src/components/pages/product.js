import React, { useEffect, useState } from "react";
import ProdImg from "./../../images/prod1.jpg";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "./../../App";
import { dispatchCartContexts } from "./../../App";
import { Link } from "react-router-dom";
function Product(props) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [totalAmount, setTotalAmount] = useState(parseFloat(props.price));
  const [selectedStock, setSelectedStock] = useState(null);
  const dispatch = dispatchFeedbackContexts();
  const cartDispatch = dispatchCartContexts();
  const [sizes, setSizes] = useState([]);

  const editQuantity = (event, value) => {
    event.preventDefault();

    if (availableQuantity - selectedQuantity - parseInt(value) < 0) {
      return;
    } else if (selectedQuantity + parseInt(value) < 1) {
      return;
    } else {
      setSelectedQuantity(selectedQuantity + parseInt(value));
      setTotalAmount(
        (selectedQuantity + parseInt(value)) * parseFloat(props.price)
      );
    }
  };

  // Retrieves available size from stock
  const getSizes = (stocks) => {
    let sizes = [];
    stocks.forEach((stock) => {
      if (
        sizes.findIndex(
          (x) => x.name.toUpperCase() === stock.size.name.toUpperCase()
        ) === -1
      ) {
        sizes.push({
          id: stock.size.id,
          name: stock.size.name,
          quantity: stock.quantity,
        });
      }
    });

    setSizes(sizes);
  };
  const toCart = async (event) => {
    event.preventDefault();

    if (!selectedSize) {
      dispatch({
        value: true,
        message: "You need to select a size first!",
        type: "Error",
      });
      return;
    }
    apiService.addProductToCart(
      selectedStock,
      props.product,
      selectedSize,
      selectedQuantity
    );

    cartDispatch({
      cart: JSON.parse(localStorage.getItem("cart")),
    });

    dispatch({
      value: true,
      message: "Great! Product added to cart",
      type: "Success",
    });
  };

  useEffect(() => {
    getSizes(props.stocks);

    if (selectedSize) {
      var selectedStock = props.stocks.filter((stock) => {
        return stock.size.id === selectedSize.id;
      });
      if (selectedStock.length > 0) {
        setSelectedStock(selectedStock[0]);
        setAvailableQuantity(selectedStock[0].quantity);
      }
    }
  }, [selectedSize, props.stocks]);

  const generateImageAlt = () => {
    let altImage = "";

    props.tags.forEach((tag) => {
      altImage = altImage + " " + tag;
    });

    altImage = altImage + " " + props.category;

    return altImage.toUpperCase();
  };

  return (
    <div className="product">
      <Link
        className="prod-link"
        params={{ productId: props.product.id }}
        to={`/product/${props.product.name}`}
      >
        <img src={props.images[0].url} alt={generateImageAlt()} />

        <div class="prod-details">
          <h4>{props.name}</h4>
        </div>
      </Link>
      <div className="size-selection">
        <div className="size">
          {props.stocks && props.stocks.length === 0 && (
            <small className="text-red">Product not available</small>
          )}
          {sizes &&
            sizes.map((stock) => {
              return (
                <small
                  className={
                    selectedSize && selectedSize.id === stock.id
                      ? "selected-size"
                      : ""
                  }
                  onClick={() => setSelectedSize(stock)}
                >
                  {stock.name}
                </small>
              );
            })}
        </div>
      </div>
      <div id="buy-container">
        <div className="quantity-selector">
          <a onClick={(event) => editQuantity(event, -1)} href="#">
            -
          </a>
          <span>{selectedQuantity}</span>
          <a onClick={(event) => editQuantity(event, +1)} href="#">
            +
          </a>
        </div>
        <span>
          € {totalAmount.toFixed(2)} <br></br>{" "}
          <small>
            {availableQuantity
              ? "Remaning items: " + availableQuantity
              : "Select a size"}
          </small>
        </span>
      </div>

      <div className="add-to-cart">
        <a onClick={(event) => toCart(event)} href="#">
          Add to cart
        </a>
      </div>
    </div>
  );
}

export default Product;
