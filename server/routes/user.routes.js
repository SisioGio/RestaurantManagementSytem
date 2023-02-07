module.exports = (app) => {
  const user = require("../controllers/user.controller");
  const { verifySignUp } = require("./../middleware");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  router.get("/refTokens/:idUser", user.getRefreshTokens);
  router.get("/:idUser/order/", [authJwt.verifyToken], user.getUserOrders);
  router.post("/login", user.login);
  router.get("/:idUser/roles", [authJwt.verifyToken], user.getRoles);
  router.get("/:id/tickets", [authJwt.verifyToken], user.getUserTickets);
  router.get("/is_authenticated", [authJwt.verifyToken], user.isAuthenticated);
  router.post("/refreshToken", user.refreshToken);
  router.post(
    "/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    user.register
  );
  router.get("/sendconfirmationemail/:email", user.sendConfirmationEmail);
  router.get("/confirmation/:confirmationCode", user.verifyUser);
  router.put("/updatePassword", user.updatePassword);
  router.post("/resetPassword/", user.resetPassword);
  router.get("/", user.findAll);
  router.get("/tickets/:id", user.getUserTickets);
  router.get("/:id", [authJwt.verifyToken], user.findOne);
  router.get("/reset/verifyCode", user.verifyResetPasswordCode);
  router.put("/:id", [authJwt.verifyToken], user.update);
  app.use("/api/user", router);
};
