module.exports = (app) => {
  const ticket = require("../controllers/ticket.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Add message to ticket

  router.post("/", [authJwt.verifyToken], ticket.addMessage);
  // Update an ticket
  router.put("/", [authJwt.verifyToken], ticket.update);

  router.put("/close/:id", [authJwt.verifyToken], ticket.closeTicket);

  // Retrieve all ticket
  router.get("/", [authJwt.isAdmin], ticket.findAll);

  // Delete an ticket with id
  router.delete("/:id", [authJwt.isAdmin], ticket.delete);

  // Delete all tickets
  router.delete("/", [authJwt.isAdmin], ticket.deleteAll);

  app.use("/api/ticket", router);
};
