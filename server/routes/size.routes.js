module.exports = (app) => {
  const size = require("../controllers/size.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new Size
  router.post("/", [authJwt.isAdmin], size.create);

  router.get("/", size.findAll);

  // Delete a Size with id
  router.delete("/:id", [authJwt.isAdmin], size.delete);

  router.put("/:id", [authJwt.isAdmin], size.update);

  // Delete all Size
  router.delete("/", [authJwt.isAdmin], size.deleteAll);

  app.use("/api/size", [authJwt.isAdmin], router);
};
