const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  define: {
    timestamps: true,
    paranoid: true,
  },

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.timeTracker = require("./timeTracker.model.js")(sequelize, Sequelize);
db.ingredient = require("./ingredient.model.js")(sequelize, Sequelize);
db.review = require("./review.model.js")(sequelize, Sequelize);

db.bill = require("./bill.model.js")(sequelize, Sequelize);

db.inventory = require("./inventory.model.js")(sequelize, Sequelize);
db.tableMdl = require("./table.model.js")(sequelize, Sequelize);
db.orderItem = require("./orderItem.model.js")(sequelize, Sequelize);

db.menuItem = require("./menuItem.model.js")(sequelize, Sequelize);
db.onlinePayment = require("./onlinePayment.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize, db.orderItem);

db.onlineOrder = require("./onlineOrder.model.js")(
  db.order,
  sequelize,
  Sequelize
);
db.onsiteOrder = require("./onsiteOrder.model.js")(
  db.order,
  sequelize,
  Sequelize,
  db.orderItem
);
db.reservation = require("./reservation.model.js")(
  sequelize,
  Sequelize,
  db.order,
  db.menuItem,
  db.orderItem
);
db.slot = require("./slot.model.js")(
  sequelize,
  Sequelize,
  db.tableMdl,
  db.reservation
);
db.refreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize, db.reservation);
db.customer = require("./customer.model.js")(
  db.user,
  sequelize,
  Sequelize,
  db.reservation,
  db.onlineOrder,
  db.onlinePayment,
  db.review
);

db.employee = require("./employee.model.js")(
  db.user,
  sequelize,
  Sequelize,
  db.timeTracker
);

db.waiter = require("./waiter.model.js")(
  db.employee,
  sequelize,
  Sequelize,
  db.onsiteOrder,
  db.orderItem,
  db.reservation,
  db.bill
);

db.chef = require("./chef.model.js")(
  db.employee,
  sequelize,
  Sequelize,
  db.menuItem,
  db.ingredient,
  db.orderItem
);

db.driver = require("./driver.model.js")(
  db.employee,
  sequelize,
  Sequelize,
  db.onlineOrder
);

db.owner = require("./owner.model.js")(
  db.employee,
  sequelize,
  Sequelize,
  db.inventory,
  db.tableMdl
);

module.exports = db;
