module.exports = (app) => {
  const customer = require("../controllers/customer.controller.js");
  const { authJwt } = require("../middleware/index.js");
  var router = require("express").Router();

  // Create a new user
  router.post("/", customer.register);

  // Try to get new accessToken using refreshToken
  router.post("/refreshToken", customer.refreshToken);

  // Login
  router.post("/login", customer.login);
  router.get(
    "/is_authenticated",
    [authJwt.verifyToken],
    customer.isAuthenticated
  );

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
