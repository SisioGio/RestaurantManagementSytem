module.exports = (app) => {
  const coupon = require("../controllers/coupon.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new coupon
  router.post("/", [authJwt.isAdmin], coupon.create);

  // Update an coupon
  router.put("/", [authJwt.isAdmin], coupon.update);

  // Retrieve all coupon
  router.get("/", [authJwt.isAdmin], coupon.findAll);

  router.get("/verify/:code", [authJwt.isAdmin], coupon.verifyCoupon);
  // Delete an coupon with id
  router.delete("/:id", [authJwt.isAdmin], coupon.delete);

  // Delete all coupons
  router.delete("/", [authJwt.isAdmin], coupon.deleteAll);

  app.use("/api/coupon", router);
};
