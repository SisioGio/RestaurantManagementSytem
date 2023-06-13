module.exports = (app) => {
  const menu = require("../controllers/menu.controller.js");

  var router = require("express").Router();

  router.get("/", menu.getItems);

  app.use("/api/menu", router);
};
