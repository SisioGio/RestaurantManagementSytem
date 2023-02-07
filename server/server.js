const express = require("express");
const cors = require("cors");
const generateSitemap = require("./sitemap-generator");
const { sequelize, stock } = require("./models");
const app = express();
var bcrypt = require("bcryptjs");
var multipart = require("connect-multiparty");
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.static("./../client/public/"));
app.use(express.static("./../client/public/prod_images/"));
app.use(cors(corsOptions));
app.use(
  multipart({
    uploadDir:
      "/home/alessio/Documents/TIN/TIN TASK 10/client/public/prod_images",
  })
);
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// app.all("*", function (req, res, next) {

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./../server/models");
const { cart } = require("./../server/models");
const { DB } = require("./config/db.config");

// Stock

db.product.hasMany(db.stock, { onDelete: "RESTRICT" });
db.stock.belongsTo(db.product, { onDelete: "RESTRICT" });

db.size.hasMany(db.stock, { onDelete: "RESTRICT" });
db.stock.belongsTo(db.size, { onDelete: "RESTRICT" });

// Image - Product
db.product.hasMany(db.image, { onDelete: "RESTRICT" });
db.image.belongsTo(db.image, { onDelete: "RESTRICT" });

// User - Order
db.user.hasMany(db.order, { onDelete: "RESTRICT" });
db.order.belongsTo(db.user, { onDelete: "RESTRICT" });

// Discount - Product

db.product.hasMany(db.discount, { onDelete: "RESTRICT" });
db.discount.belongsTo(db.product, { onDelete: "RESTRICT" });

// Stock - Order many to many

db.stock.belongsToMany(db.order, { through: db.orderProduct });
db.order.belongsToMany(db.stock, { through: db.orderProduct });

db.stock.hasMany(db.orderProduct);
db.orderProduct.belongsTo(db.stock);

db.order.hasMany(db.orderProduct);
db.orderProduct.belongsTo(db.order);

// Product - Tag many to many

db.product.belongsToMany(db.tag, { through: db.productTag });
db.tag.belongsToMany(db.product, { through: db.productTag });

db.product.hasMany(db.productTag);
db.productTag.belongsTo(db.product);

db.tag.hasMany(db.productTag);
db.productTag.belongsTo(db.tag);

// Coupon - Order : 1 to many

db.coupon.hasMany(db.order, { onDelete: "RESTRICT" });
db.order.belongsTo(db.coupon, { onDelete: "RESTRICT" });

// Order - Delivery 1:1

db.order.hasOne(db.delivery, { onDelete: "RESTRICT" });
db.delivery.hasOne(db.order, { onDelete: "RESTRICT" });

// Address - Delivery 1 to many
db.address.hasMany(db.delivery, { onDelete: "RESTRICT" });
db.delivery.belongsTo(db.address, { onDelete: "RESTRICT" });

// Address - Order
db.address.hasOne(db.order, { onDelete: "RESTRICT" });
db.order.belongsTo(db.address, { onDelete: "RESTRICT" });

// User - Address  1 to many

db.user.hasMany(db.address, { onDelete: "RESTRICT" });
db.address.belongsTo(db.user, { onDelete: "RESTRICT" });

// User - Verification code 1 to many
db.user.hasMany(db.verificationCode, { onDelete: "RESTRICT" });
db.verificationCode.belongsTo(db.user, { onDelete: "RESTRICT" });

// Product - Category code 1 to many
db.category.hasMany(db.product, { onDelete: "RESTRICT" });
db.product.belongsTo(db.category, { onDelete: "RESTRICT" });

// Order - Payment 1:1
db.payment.hasOne(db.order, { onDelete: "RESTRICT" });
db.order.hasOne(db.payment, { onDelete: "RESTRICT" });

// User - Roles
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
  onDelete: "RESTRICT",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  onDelete: "RESTRICT",
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
  onDelete: "RESTRICT",
});
db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
  onDelete: "RESTRICT",
});

// User - Tickets many to many

db.user.hasMany(db.ticket);
db.ticket.belongsTo(db.user);

db.ticket.hasMany(db.message);
db.message.belongsTo(db.ticket);

db.user.hasMany(db.message);
db.message.belongsTo(db.user);
// Uncomment when gettin error "Unknown column 'ticketId' in 'field list'"
// db.message.sync({ force: true }).then(() => {
//   console.log("ticket messages synched");
// });
db.ROLES = ["user", "admin"];

db.sequelize
  .authenticate({ force: true })
  .then(async () => {
    const userRole = await db.role.findOrCreate({ where: { name: "user" } });
    const adminRole = await db.role.findOrCreate({ where: { name: "admin" } });
    const visitorRole = await db.role.findOrCreate({
      where: { name: "visitor" },
    });

    await db.category.findOrCreate({ where: { name: "Pants" } });
    await db.category.findOrCreate({ where: { name: "T-shirts" } });
    await db.category.findOrCreate({ where: { name: "Jackets" } });
    await db.category.findOrCreate({ where: { name: "Shoes" } });
    await db.category.findOrCreate({ where: { name: "Hats" } });

    await db.size.findOrCreate({ where: { name: "XS" } });
    await db.size.findOrCreate({ where: { name: "S" } });
    await db.size.findOrCreate({ where: { name: "M" } });
    await db.size.findOrCreate({ where: { name: "L" } });
    await db.size.findOrCreate({ where: { name: "XL" } });
    await db.size.findOrCreate({ where: { name: "XXL" } });
    await db.size.findOrCreate({ where: { name: "XXXL" } });

    generateSitemap(await db.product.findAll());
    console.log("Sync completed");
  })
  .catch((err) => {
    console.log("Sync failed - " + err.message ? err.message : null);
  });
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require("./routes/user.routes")(app);
require("./routes/address.routes")(app);
require("./routes/discount.routes")(app);
require("./routes/ticket.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/coupon.routes")(app);
require("./routes/product.routes")(app);
require("./routes/category.routes")(app);
require("./routes/stock.routes")(app);
require("./routes/image.routes")(app);
require("./routes/order.routes")(app);
require("./routes/tag.routes")(app);
require("./routes/size.routes")(app);
require("./routes/stripe.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
