import React, { useEffect, useState } from "react";
import ProdImg from "./../../images/prod1.jpg";
import apiService from "../../services/apiService";
import { dispatchFeedbackContexts } from "./../../App";
import { dispatchCartContexts } from "./../../App";
import { useLocation, useParams } from "react-router-dom";
import OrderDetails from "../partials/orderDetails";
import ProductImage from "../partials/productImage";

function ProductDetails() {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const dispatch = dispatchFeedbackContexts();
  const cartDispatch = dispatchCartContexts();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [productName, setProductName] = useState(null);
  const [data, setData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tags, setTags] = useState([]);
  const [sizes, setSizes] = useState([]);

  const editQuantity = (event, value) => {
    event.preventDefault();
    if (!selectedSize) {
      dispatch({
        value: true,
        message: "Please selected a size!",
        type: "Error",
      });
      return;
    }
    if (selectedSize.quantity - selectedQuantity - parseInt(value) < 0) {
      return;
    } else if (selectedQuantity + parseInt(value) < 1) {
      return;
    } else {
      setSelectedQuantity(selectedQuantity + parseInt(value));
      setTotalAmount(
        (selectedQuantity + parseInt(value)) * parseFloat(data.price)
      );
      setSelectedSize({
        id: selectedSize.id,
        size: selectedSize.name,
        quantity: parseFloat(selectedSize.quantity) - parseInt(value),
      });
    }
  };

  const toCart = async (event) => {
    event.preventDefault();
    if (!selectedSize) {
      dispatch({
        value: true,
        message: "Please selected a size!",
        type: "Error",
      });
      return;
    }

    apiService.addProductToCart(
      selectedStock,
      data,
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

  const getSizes = (stocks) => {
    let sizes = [];

    stocks.forEach((stock) => {
      if (
        sizes.findIndex((x) => x.size.toUpperCase() === stock.size.name) === -1
      ) {
        sizes.push({
          id: stock.size.id,
          size: stock.size.name,
          quantity: stock.quantity,
        });
      }
    });

    setSizes(sizes);
  };
  const getProduct = async (prodName) => {
    let prod_tags = [];
    if (prodName) {
      try {
        let res = await apiService.getProductDetails(prodName);
        setData(res.data);
        res.data.tags.forEach((tag) => {
          prod_tags.push(tag.name);
        });

        setTags(prod_tags);
        getSizes(res.data.stocks);
        setTotalAmount(parseFloat(res.data.price));
        setSelectedStock(res.data.stocks[0]);
      } catch (err) {
        dispatch({
          value: true,
          message: `Error while retrieving data for product ${prodName}`,
          type: "Error",
        });
      }
    }
  };
  useEffect(() => {
    if (selectedSize) {
      var selectedStock = data.stocks.filter((stock) => {
        return stock.size.id === selectedSize.id;
      });
      setSelectedStock(selectedStock[0]);
      setAvailableQuantity(selectedStock[0].quantity);
    }
  }, [selectedSize]);

  useEffect(() => {
    const prodName = decodeURI(
      window.location.href.substring(window.location.href.lastIndexOf("/") + 1)
    );

    setProductName(prodName);
    getProduct(prodName);
  }, []);
  return data ? (
    <div className="product-details">
      <ProductImage
        images={data.images}
        tags={tags}
        category={data.category.name}
      />

      <div className="product-details-title">
        <h3>{data.name}</h3>
      </div>

      <div className="description details-field">
        <h4>Description</h4>
        <p>{data.description}</p>
      </div>

      <div className="product-details-tags  details-field">
        <div>
          <h4>Tags</h4>
        </div>
        <div className="product-details-pills  details-field">
          {tags.map((tag) => {
            return <small>{tag}</small>;
          })}
        </div>
      </div>
      <div className="category details-field">
        <div>
          <h4>Category</h4>
        </div>
        <div className="product-details-pills  details-field">
          <small>{data.category.name}</small>
        </div>
      </div>
      <div className="sizes  details-field">
        <div>
          <h4>Select a size </h4>
        </div>

        <div>
          {sizes.length === 0 && (
            <small className="text-red">Unavailable</small>
          )}
          {sizes.map((size) => {
            return (
              <a
                href="#"
                className={
                  selectedSize && selectedSize.id === size.id
                    ? "product-details-size selected-size"
                    : "product-details-size"
                }
                onClick={(event) => (
                  event.preventDefault(),
                  setSelectedQuantity(1),
                  setSelectedSize(size)
                )}
              >
                {size.size} <small>Qty: {size.quantity} </small>
              </a>
            );
          })}
        </div>
      </div>

      <div className="quantity-selector-details  details-field">
        <a onClick={(event) => editQuantity(event, -1)} href="#">
          -
        </a>
        <span>{selectedQuantity}</span>
        <a onClick={(event) => editQuantity(event, +1)} href="#">
          +
        </a>
      </div>
      <div className="product-details-total  details-field">
        <h4>Total</h4>
        <p> € {totalAmount.toFixed(2)}</p>
      </div>
      <div className="prod-details-buy  details-field">
        <a onClick={(event) => toCart(event)} href="#">
          Add to cart
        </a>
      </div>
    </div>
  ) : (
    "Loading data..."
  );
}

export default ProductDetails;
