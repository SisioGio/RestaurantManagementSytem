module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const { authJwt } = require("../middleware/index.js");
  var router = require("express").Router();

  // Create a new user
  router.post("/", user.register);

  // Try to get new accessToken using refreshToken
  router.post("/refreshToken", user.refreshToken);

  // Login
  router.post("/login", user.login);
  router.get("/is_authenticated", [authJwt.verifyToken], user.isAuthenticated);
  // Show schedule ( table-reservation-slot)
  // router.get("/schedule/:from?/:to?", user.getSchedule);

  // // Update an user
  // router.put("/", user.update);

  // // Retrieve all user
  // router.get("/",  user.findAll);

  // // Delete an user with id
  // router.delete("/:id", user.delete);

  // // Delete all users
  // router.delete("/",  user.deleteAll);

  app.use("/api/user", router);
};
