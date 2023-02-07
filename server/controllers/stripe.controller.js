const db = require("../models");
const config = require("./../config/auth.config");
// This is your test secret API key.
const stripe = require("stripe")(config.STRIPE_KEY);
const { sequelize } = require("../models");

exports.etherPayment = async (req, res) => {
  try {
    let success_url = "";
    const result = await sequelize.transaction(async (t) => {
      const userId = req.body.userId;
      const totalAmount = req.body.totalAmount;
      const cart_items = JSON.parse(req.body.cartItems);
      const shippinAddressID = req.body.shipping;
      const user = await db.user.findByPk(userId, { transaction: t });

      if (!user) {
        return res.status(500).send({ message: "User does not exists" });
      }
      // To do: Mark unavailable items on client side

      // Check if requested items are available
      let unavailableProducts = [];

      for (let item of cart_items) {
        let stock = await db.stock.findByPk(item.stock, { transaction: t });
        if (stock.quantity < item.quantity) {
          // Add stock to unavailable items
          console.log("Product not available");
          unavailableProducts.push({
            stock: stock.id,
            availableQuantity: stock.quantity,
          });
        } else {
          // Update stock quantity
          console.log("Updating stock quantity");
          stock.quantity = stock.quantity - item.quantity;
          await stock.save({ transaction: t });
        }
      }

      // Send unavailable items details
      if (unavailableProducts.length > 0) {
        console.log("Products not available");
        return res.status(400).send({
          message: "Products not available",
          unavailableProducts: unavailableProducts,
        });
      }

      // Creare order as unpaid
      const order = await db.order.create(
        {
          totalAmount: parseFloat(totalAmount),
          paid: false,
          userId: userId,
          addressId: shippinAddressID,
        },
        { transaction: t }
      );
      const order_id = order.id;
      console.log("Products in order: " + cart_items.length);
      // Create order items in database
      for (let item of cart_items) {
        console.log("Creating order  product item");
        await db.orderProduct.create(
          {
            stockId: item.stock,
            orderId: order_id,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      }

      console.log("Sending url");
      console.log(order_id);
      let success_url = `http://localhost:3000/order?status=success&order=${order_id}`;
      console.log(success_url);
      return res.send({ url: success_url });
    });
  } catch (err) {
    console.log("Error while creating order");
    console.log(err);
    return res.status(500).send({
      message: err.message || "Some error occurred while creating the order.",
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const userId = req.body.userId;
      const items = JSON.parse(req.body.items);
      const totalAmount = req.body.totalAmount;
      const cart_items = JSON.parse(req.body.cartItems);
      const shippinAddressID = req.body.shipping;
      const user = await db.user.findByPk(userId);
      const user_stripe_id = user.stripeId;
      if (!user) {
        return res.status(500).send({ message: "User does not exists" });
      }

      // Check if requested items are available
      let unavailableProducts = [];
      for (let item of cart_items) {
        let stock = await db.stock.findByPk(item.stock, { transaction: t });
        if (stock.quantity < item.quantity) {
          // Add stock to unavailable items
          unavailableProducts.push({
            stock: stock.id,
            availableQuantity: stock.quantity,
          });
        } else {
          // Update stock quantity
          stock.quantity = stock.quantity - item.quantity;
          await stock.save({ transaction: t });
        }
      }
      // Send unavailable items details
      if (unavailableProducts.length > 0) {
        return res
          .status(400)
          .send({ unavailableProducts: unavailableProducts });
      }

      // Creare order as unpaid
      const order = await db.order.create(
        {
          totalAmount: parseFloat(totalAmount),
          paid: false,
          userId: userId,
          addressId: shippinAddressID,
        },
        { transaction: t }
      );
      // Create order items in database
      for (let item of cart_items) {
        await db.orderProduct.create(
          {
            stockId: item.stock,
            orderId: order.id,
            quantity: item.quantity,
          },
          { transaction: t }
        );
      }
      // Create stripe session ( url is then used by client to redirect)
      const session = await stripe.checkout.sessions.create({
        line_items: items,
        mode: "payment",
        customer: user_stripe_id,
        success_url: `http://localhost:3000/order?status=success&order=${order.id}`,
        cancel_url: `http://localhost:3000/order?status=failed&order=${order.id}`,
      });

      //return session url to client
      return res.send({ url: session.url });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ticket message.",
    });
  }
};
