module.exports = (app) => {
  const stock = require("../controllers/stock.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new stock
  router.post("/", [authJwt.isAdmin], stock.create);
  router.get("/", stock.findAll);
  router.get("/catalog", stock.getCatalog);
  router.get("/:idStock", stock.findOne);

  // Delete a stock with id
  router.delete("/:id", [authJwt.isAdmin], stock.delete);

  router.put("/:id", [authJwt.isAdmin], stock.update);
  // Delete all stock
  router.delete("/", [authJwt.isAdmin], stock.deleteAll);

  app.use("/api/stock", router);
};
