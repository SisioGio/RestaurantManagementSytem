import React, { useEffect, useState } from "react";

function PaymentConfirmation(props) {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  return (
    <div className="checkout">
      <br></br>
      <br></br>
      <h1>Congrats! Your order is completed and it's ready to be delivered</h1>
      <br></br>
      <br></br>

      <div className="checkout-cart">
        {data && data.order_products
          ? data.order_products.map((item, i) => {
              return (
                <div className="checkout-cart-item">
                  <div className="image">
                    <img src={item.stock.product.images[0].url}></img>
                  </div>
                  <div className="checkout-cart-item-details">
                    <div className="product-cart-field">
                      <div> Product:</div>
                      <div> {item.stock.product.name}</div>
                    </div>
                    <div className="product-cart-field">
                      <div>Size:</div>
                      <div> {item.stock.size.name}</div>
                    </div>

                    <div className="product-cart-field">
                      <div>Qty:</div>
                      <div> {item.quantity}</div>
                    </div>
                    <div className="product-cart-field">
                      <div>Price: </div>
                      <div>
                        € {parseFloat(item.stock.product.price).toFixed(2)}
                      </div>
                    </div>

                    <div className="product-cart-field">
                      <div>Total: </div>
                      <div>
                        {" "}
                        €{" "}
                        {(
                          parseFloat(item.stock.product.price) *
                          parseFloat(item.quantity)
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="product-cart-field"></div>
                  </div>
                </div>
              );
            })
          : null}
      </div>

      <br></br>
      <br></br>

      <h2>
        Total Amount Paid:{" "}
        {data.totalAmount && parseFloat(data.totalAmount).toFixed(2)}
      </h2>
    </div>
  );
}

export default PaymentConfirmation;
