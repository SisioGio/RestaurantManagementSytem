module.exports = {
  async createAssociations(db) {
    // Define inheritcance between user and customer by using association and scope
    db.customer.hasOne(db.user, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "CUSTOMER",
      },
    });
    db.user.belongsTo(db.customer, { foreignKey: "refId", constraints: false });
    // Define inheritance between employee and user by using association
    db.employee.hasOne(db.user, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "EMPLOYEE",
      },
    });
    db.user.belongsTo(db.employee, { foreignKey: "refId", constraints: false });
    // Define inheritance between waiter and employee by using association
    db.waiter.hasOne(db.employee, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "WAITER",
      },
    });
    db.employee.belongsTo(db.waiter, {
      foreignKey: "refId",
      constraints: false,
    });
    // Define inheritance between chef and employee by using association
    db.chef.hasOne(db.employee, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "CHEF",
      },
    });
    db.employee.belongsTo(db.chef, {
      foreignKey: "refId",
      constraints: false,
    });
    // Define inheritance between driver and employee by using association
    db.driver.hasOne(db.employee, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "DRIVER",
      },
    });
    db.employee.belongsTo(db.driver, {
      foreignKey: "refId",
      constraints: false,
    });
    // Define inheritance between driver and employee by using association
    db.owner.hasOne(db.employee, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        role: "OWNER",
      },
    });
    db.employee.belongsTo(db.owner, {
      foreignKey: "refId",
      constraints: false,
    });
    // Define inheritance between onlineOrder and order by using association
    db.onlineOrder.hasOne(db.order, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        type: "ONLINE",
      },
    });
    db.order.belongsTo(db.onlineOrder, {
      foreignKey: "refId",
      constraints: false,
    });
    // Define inheritance between onlineOrder and order by using association
    db.onsiteOrder.hasOne(db.order, {
      foreignKey: "refId",
      constraints: false,
      scope: {
        type: "ONSITE",
      },
    });
    db.order.belongsTo(db.onsiteOrder, {
      foreignKey: "refId",
      constraints: false,
    });
    // Employee - timeTracker
    db.employee.hasMany(db.timeTracker, { onDelete: "cascade" });
    db.timeTracker.belongsTo(db.employee, { onDelete: "cascade" });
    // Meal-Inventory ( M:N on Ingredients)
    db.menuItem.belongsToMany(db.inventory, {
      through: db.ingredient,
      onDelete: "cascade",
      constraints: false,
    });
    db.inventory.belongsToMany(db.menuItem, {
      through: db.ingredient,
      onDelete: "cascade",
      constraints: false,
    });
    db.menuItem.hasMany(db.ingredient, {
      onDelete: "cascade",
      constraints: false,
    });
    db.ingredient.belongsTo(db.menuItem, {
      onDelete: "cascade",
      constraints: false,
    });
    db.inventory.hasMany(db.ingredient, {
      onDelete: "cascade",
      constraints: false,
    });
    db.ingredient.belongsTo(db.inventory, {
      onDelete: "cascade",
      constraints: false,
    });

    // Customer-Table ( M:N on Reservations)
    db.customer.belongsToMany(db.tableMdl, {
      through: { model: db.reservation, unique: false, onDelete: "cascade" },

      constraints: false,
    });
    db.tableMdl.belongsToMany(db.customer, {
      through: { model: db.reservation, unique: false, onDelete: "cascade" },

      constraints: false,
    });
    db.customer.hasMany(db.reservation, { onDelete: "cascade" });
    db.reservation.belongsTo(db.customer, { onDelete: "cascade" });
    db.tableMdl.hasMany(db.reservation, { onDelete: "cascade" });
    db.reservation.belongsTo(db.tableMdl, { onDelete: "cascade" });
    // Reservation - Slot
    db.slot.hasMany(db.reservation, { onDelete: "cascade" });
    db.reservation.belongsTo(db.slot, { onDelete: "cascade" });

    // Order - menuItem ( M:N on OrderMeals)
    db.order.belongsToMany(db.menuItem, {
      through: db.orderItem,
      onDelete: "cascade",
    });
    db.menuItem.belongsToMany(db.order, {
      through: db.orderItem,
      onDelete: "cascade",
    });
    db.order.hasMany(db.orderItem, { onDelete: "cascade" });
    db.orderItem.belongsTo(db.order, { onDelete: "cascade" });
    db.menuItem.hasMany(db.orderItem, { onDelete: "cascade" });
    db.orderItem.belongsTo(db.menuItem, { onDelete: "cascade" });

    // Waiter -  OnsiteOrder ( 1 to many)
    db.waiter.hasMany(db.onsiteOrder);
    db.onsiteOrder.belongsTo(db.waiter);

    // Reservation  - OnsiteOrder (1:N)
    db.reservation.hasMany(db.onsiteOrder, {
      onDelete: "CASCADE",
      hooks: true,
    });
    db.onsiteOrder.belongsTo(db.reservation);

    // Customer - OnlineOrder (1:N)
    db.customer.hasMany(db.onlineOrder);
    db.onlineOrder.belongsTo(db.customer);

    // Driver - OnlineOrder (1:N)
    db.driver.hasMany(db.onlineOrder);
    db.onlineOrder.belongsTo(db.driver);

    // Customer - OnlinePayment (1:N)
    db.customer.hasMany(db.onlinePayment);
    db.onlinePayment.belongsTo(db.customer);

    // OnlineOrder - OnlinePayment (1:N)
    db.onlineOrder.hasOne(db.onlinePayment);
    db.onlinePayment.belongsTo(db.onlineOrder);

    // Waiter - Bill (1:N)
    db.waiter.hasMany(db.bill);
    db.bill.belongsTo(db.waiter);

    // Reservation - Bill (1:N)
    db.reservation.hasOne(db.bill);
    db.bill.belongsTo(db.reservation);

    // Customer - Review (1:N)
    db.customer.hasMany(db.review);
    db.review.belongsTo(db.customer);

    // user - refreshToken
    db.user.hasMany(db.refreshToken, { onDelete: "RESTRICT" });
    db.refreshToken.belongsTo(db.user, { onDelete: "RESTRICT" });

    // Menu item - category
    db.category.hasMany(db.menuItem);
    db.menuItem.belongsTo(db.category);
  },
};
