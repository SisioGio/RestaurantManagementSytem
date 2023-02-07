module.exports = (app) => {
  const Order = require("../controllers/order.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  router.post("/confirm/:id", [authJwt.verifyToken], Order.confirmOrder);
  // Retrieve all order
  // Retrieve a single Order with id
  router.get("/", Order.findAll);
  // Retrieve a single Order with id
  router.get("/:id", [authJwt.verifyToken], Order.findOne);

  // Delete an order with id
  router.delete("/:id", [authJwt.verifyToken], Order.delete);

  // Delete all orders
  router.delete("/", [authJwt.isAdmin], Order.deleteAll);

  app.use("/api/order", router);
};
