const db = require("../models");

exports.createOnSiteOrder = async (req, res) => {
  try {
    const userId = req.body.userId;

    const waiterObj = await db.user.getWaiter(userId);

    await waiterObj.createOnSiteOrder(req.body);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

exports.updateOrderItemQuantity = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orderItemId = req.body.orderItemId;
    const quantity = req.body.quantity;

    const waiterObj = await db.user.getWaiter(userId);

    await waiterObj.updateOrderItemQuantity(orderItemId, quantity);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
exports.prepareOrderItem = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orderItemId = req.body.orderItemId;

    const chefObj = await db.user.getChef(userId);

    await chefObj.prepareOrderItem(orderItemId);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

exports.completeOrderItem = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orderItemId = req.body.orderItemId;

    const chefObj = await db.user.getChef(userId);

    await chefObj.markOrderItemAsPrepared(orderItemId);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
exports.serveOrderItem = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orderItemId = req.body.orderItemId;

    const waiterObj = await db.user.getWaiter(userId);

    await waiterObj.serveOrderItem(orderItemId);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
exports.startOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    const onsiteOrderId = req.body.onsiteOrderId;

    const waiterObj = await db.user.getWaiter(userId);

    await waiterObj.startPreOrder(onsiteOrderId);
    return res.send("OK");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderItemId = req.params.orderItemId;

    const waiterObj = await db.user.getWaiter(userId);

    await waiterObj.removeItemFromOrder(orderItemId);
    return res.send("OK");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const orderItems = await db.chef.getOrderItems();
    return res.send(orderItems);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};
