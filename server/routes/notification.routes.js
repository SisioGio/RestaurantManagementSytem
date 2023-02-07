module.exports = (app) => {
  const notification = require("../controllers/notification.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Retrieve all notification
  router.get("/:userId", notification.findAllByUserID);

  app.use("/api/notification", router);
};
