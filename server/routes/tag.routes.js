module.exports = (app) => {
  const tag = require("../controllers/tag.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Retrieve all address
  router.get("/", tag.findAll);
  router.post("/:name", [authJwt.isAdmin], tag.create);
  app.use("/api/tag", router);
};
