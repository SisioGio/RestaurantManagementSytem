module.exports = (app) => {
  const address = require("../controllers/address.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new address
  router.post("/", [authJwt.verifyToken], address.create);
  router.get("/:userId", [authJwt.verifyToken], address.getUserAddress);
  // Update an address
  router.put("/", [authJwt.verifyToken], address.update);

  // Retrieve all address
  router.get("/", [authJwt.isAdmin], address.findAll);

  // Delete an address with id
  router.delete("/:id", [authJwt.verifyToken], address.delete);

  // Delete all addresss
  router.delete("/", [authJwt.isAdmin], address.deleteAll);

  app.use("/api/address", router);
};
