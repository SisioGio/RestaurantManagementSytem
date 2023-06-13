module.exports = (app) => {
  const slot = require("../controllers/slot.controller.js");

  var router = require("express").Router();

  // Get tables availability
  router.get(
    "/availability/:from/:to/:noOfPeople?",
    slot.getTablesAvailability
  );

  app.use("/api/slot", router);
};
