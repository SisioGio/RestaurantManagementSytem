const express = require("express");
const cors = require("cors");
const generateSitemap = require("./sitemap-generator");
const cron = require("node-cron");
const { initializeDatabase } = require("./initialization");
const { createAssociations } = require("./associations");

// const { defineClassMethods } = require("./methods/user.methods");
const app = express();
var bcrypt = require("bcryptjs");
var multipart = require("connect-multiparty");
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.static("./../client/public/"));

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Import database model
const db = require("./../server/models");

// Define class/instance methods

// defineUserMethods(db);

// Create all required associations between tables
createAssociations(db);

db.sequelize
  .sync({ force: true })
  .then(async () => {
    // Initialize dataset
    // initializeDatabase(db, db.sequelize);
    // db.user.getAllUsers();
    console.log("Sync completed");
  })
  .catch((err) => {
    console.log("Sync failed - " + err.message ? err.message : null);
  });
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});
require("./routes/order.routes")(app);
require("./routes/user.routes")(app);
require("./routes/customer.routes")(app);
require("./routes/menu.routes")(app);
require("./routes/slot.routes")(app);
require("./routes/reservation.routes")(app);
// require("./routes/address.routes")(app);
// require("./routes/businessLine.routes")(app);
// require("./routes/company.routes")(app);
// require("./routes/costCenter.routes")(app);
// require("./routes/factory.routes")(app);
// require("./routes/image.routes")(app);
// require("./routes/order.routes")(app);
// require("./routes/payment.routes")(app);
// require("./routes/product.routes")(app);
// require("./routes/taxCode.routes")(app);
// require("./routes/transaction.routes")(app);
// require("./routes/user.routes")(app);
// require("./routes/invoice.routes")(app);
// require("./routes/vendor.routes")(app);
// require("./routes/customer.routes")(app);
// require("./routes/customerGroup.routes")(app);
// require("./routes/taxValues.routes")(app);
// require("./routes/invoiceLine.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

exports.db = db;
