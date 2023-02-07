module.exports = (app) => {
  const Payment = require("../controllers/payment.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new Payment
  router.post("/", [authJwt.verifyToken], Payment.create);

  // Retrieve all Payment
  router.get("/", [authJwt.isAdmin], Payment.findAll);

  // Delete all Payment
  router.delete("/", [authJwt.isAdmin], Payment.deleteAll);

  app.use("/api/payment", router);
};
