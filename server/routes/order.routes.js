module.exports = (app) => {
  const order = require("../controllers/order.controller.js");

  var router = require("express").Router();

  router.post("/onsite", order.createOnSiteOrder);

  router.put("/item", order.updateOrderItemQuantity);
  router.get("/items", order.getOrderItems);
  router.delete("/item/:userId/:orderItemId", order.deleteOrderItem);

  router.put("/onsite/start", order.startOrder);
  router.put("/item/preparing", order.prepareOrderItem);
  router.put("/item/prepared", order.completeOrderItem);
  router.put("/item/serve", order.serveOrderItem);

  app.use("/api/order/", router);
};
