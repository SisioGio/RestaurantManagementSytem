module.exports = (app) => {
  const reservation = require("../controllers/reservation.controller.js");

  var router = require("express").Router();

  router.post("/", reservation.makeReservation);
  router.get("/", reservation.getAllReservations);
  router.get("/:reservationId", reservation.getReservationById);

  router.put("/confirm", reservation.markAsConfirmed);
  router.put("/initialize", reservation.initializeReservation);
  router.put("/complete", reservation.markAsCompleted);

  router.delete("/:reservationId", reservation.deleteReservation);

  app.use("/api/reservation/", router);
};
