module.exports = (app) => {
  var multipart = require("connect-multiparty");
  var multipartMiddleware = multipart();
  const product = require("../controllers/product.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new Product
  router.post("/", [multipartMiddleware], product.create);

  // Retrieve all product
  router.get("/", product.findAll);

  // Retrieve a single Product with id
  router.get("/:name", product.findOne);

  // Update a Product with id
  router.put("/:id", product.update);

  // Delete a Product with id
  router.delete("/:id", product.delete);

  // Delete all product
  router.delete("/", product.deleteAll);

  app.use("/api/product", router);
};
