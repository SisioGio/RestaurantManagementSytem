module.exports = (app) => {
  const discount = require("../controllers/discount.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new discount
  router.post("/", [authJwt.isAdmin], discount.create);

  // Update an discount
  router.put("/", [authJwt.isAdmin], discount.update);

  // Retrieve all discount
  router.get("/", [authJwt.isAdmin], discount.findAll);

  // Delete an discount with id
  router.delete("/:id", [authJwt.isAdmin], discount.delete);

  // Delete all discounts
  router.delete("/", [authJwt.isAdmin], discount.deleteAll);

  app.use("/api/discount", router);
};
