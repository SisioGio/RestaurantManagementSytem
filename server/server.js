const express = require("express");
const cors = require("cors");
const generateSitemap = require("./sitemap-generator");
const cron = require("node-cron");
const { initializeDatabase } = require("./utils/initialization");
const { createAssociations } = require("./utils/associations");
const scheduler = require("./utils/scheduler");
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

// Create all required associations between tables
createAssociations(db);

scheduler.scheduleJobs(db);
db.sequelize
  .authenticate({ force: true })
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

exports.db = db;
