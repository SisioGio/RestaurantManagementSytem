module.exports = (app) => {
  const image = require("../controllers/image.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Delete an image with id
  router.delete("/:id", [authJwt.isAdmin], image.delete);

  app.use("/api/image", router);
};
