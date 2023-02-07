module.exports = (app) => {
  const category = require("../controllers/category.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Retrieve all address
  router.get("/", category.findAll);
  router.post("/:name", [authJwt.isAdmin], category.create);
  app.use("/api/category", router);
};
