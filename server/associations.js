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
    db.employee.hasMany(db.timeTracker);
    db.timeTracker.belongsTo(db.employee);
    // Meal-Inventory ( M:N on Ingredients)
    db.menuItem.belongsToMany(db.inventory, { through: db.ingredient });
    db.inventory.belongsToMany(db.menuItem, { through: db.ingredient });
    db.menuItem.hasMany(db.ingredient);
    db.ingredient.belongsTo(db.menuItem);
    db.inventory.hasMany(db.ingredient);
    db.ingredient.belongsTo(db.inventory);

    // Customer-Table ( M:N on Reservations)
    db.customer.belongsToMany(db.tableMdl, { through: db.reservation });
    db.tableMdl.belongsToMany(db.customer, { through: db.reservation });
    db.customer.hasMany(db.reservation);
    db.reservation.belongsTo(db.customer);
    db.tableMdl.hasMany(db.reservation);
    db.reservation.belongsTo(db.tableMdl);
    // Reservation - Slot
    db.slot.hasMany(db.reservation);
    db.reservation.belongsTo(db.slot);

    // Order - menuItem ( M:N on OrderMeals)
    db.order.belongsToMany(db.menuItem, { through: db.orderItem });
    db.menuItem.belongsToMany(db.order, { through: db.orderItem });
    db.order.hasMany(db.orderItem);
    db.orderItem.belongsTo(db.order);
    db.menuItem.hasMany(db.orderItem);
    db.orderItem.belongsTo(db.menuItem);

    // Waiter -  OnsiteOrder ( 1 to many)
    db.waiter.hasMany(db.onsiteOrder);
    db.onsiteOrder.belongsTo(db.waiter);

    // Reservation  - OnsiteOrder (1:N)
    db.reservation.hasMany(db.onsiteOrder);
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
  },
};