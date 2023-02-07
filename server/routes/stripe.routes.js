module.exports = (app) => {
  const { authJwt } = require("../middleware");

  var router = require("express").Router();
  const stripe = require("../controllers/stripe.controller");

  router.post(
    "/create-checkout-session",
    [authJwt.verifyToken],
    stripe.createSession
  );
  router.post("/ether", stripe.etherPayment);

  app.use("/stripe", router);
};
