module.exports = (app) => {
  const customer = require("../controllers/customer.controller.js");
  const { authJwt } = require("../middleware/index.js");
  var router = require("express").Router();

  // Create a new reservation
  // router.post("/", customer.makeReservation);

  // Update an reservation
  // router.put("/", customer.updateReservation);

  // Retrieve all customer reservations
  router.get("/reservation/:userId", customer.getReservations);

  router.get("/test", customer.test);
  // Delete an user with id
  // router.delete("/:id", reservation.delete);

  app.use("/api/customer", router);
};
