const moment = require("moment-timezone");
const { getLineAndCharacterOfPosition } = require("typescript");
const { meal } = require("./models");
module.exports = {
  async initializeDatabase(db, sequelize) {
    const customer = await db.customer.createWithAbstractClass(
      "Alessio",
      "Giovannini",
      "alessio.giovannini@oerlikon.com",
      "3454646930",
      "customer"
    );

    const waiter = await db.waiter.createWithAbstractClass(
      "Marco",
      "Caliri",
      "marco.caliri@oerlikon.com",
      "34536434243",
      "waiter",
      1000.0
    );

    const chef = await db.chef.createWithAbstractClass(
      "Luca",
      "Pili",
      "luca.pili@oerlikon.com",
      "34536434243",
      "Hello123!",
      2000.0
    );
    const driver = await db.driver.createWithAbstractClass(
      "Giulio",
      "Amitrano",
      "giulio.amitrano@oerlikon.com",
      "34536434243",
      "Hello123!",
      800.0
    );

    const owner = await db.owner.createWithAbstractClass(
      "Alessandro",
      "Lacci",
      "alessandro.lacci@oerlikon.com",
      "34536434243",
      "owner",
      800.0
    );

    // const onsiteOrder = await db.onsiteOrder.createWithAbstractClass();

    // const employObj = await waiter.getEmployee();
    // await employObj.clockIn();
    // await employObj.clockOut();

    // Owner creates inventory items

    const spaghetti = await owner.addInventory("Spaghetti", 100.0, "kg", 20.0);
    const mozzarella = await owner.addInventory(
      "Mozzarella",
      50.0,
      "pcs",
      10.0
    );
    const tomatoSauce = await owner.addInventory(
      "Tomato Sauce",
      50.0,
      "kg",
      10.0
    );
    const tuna = await owner.addInventory("Tuna", 10.0, "kg", 5);
    const mushrooms = await owner.addInventory("Mushrooms", 5.0, "kg", 1.0);
    const water = await owner.addInventory("Water", 100.0, "L", 10.0);
    const whiteWine = await owner.addInventory("White Wine", 100.0, "L", 10.0);
    const redWine = await owner.addInventory("Red Wine", 100.0, "L", 10.0);
    const beer = await owner.addInventory("Beer", 100.0, "L", 10.0);
    const flour = await owner.addInventory("Flour", 10000.0, "gr", 3000.0);
    const brewersYest = await owner.addInventory(
      "Brewer's yeast",
      2000.0,
      "gr",
      500.0
    );
    const salt = await owner.addInventory("Salt", 100000.0, "gr", 1000.0);
    const oliveOil = await owner.addInventory("Olive Oil", 100.0, "L", 10.0);
    const penne = await owner.addInventory("Penne", 100.0, "kg", 10.0);
    const rigatoni = await owner.addInventory("Rigatoni", 100.0, "kg", 10.0);
    const gnocchi = await owner.addInventory("Gnocchi", 100.0, "kg", 10.0);
    const seafood = await owner.addInventory("Seafood", 10.0, "kg", 1.0);
    const parsley = await owner.addInventory("Parsley", 1000.0, "gr", 1.0);
    const basil = await owner.addInventory("Basil", 1000.0, "gr", 100.0);
    const frenchFries = await owner.addInventory(
      "French Fries",
      100.0,
      "kg",
      10.0
    );
    const bread = await owner.addInventory("Bread", 10000.0, "gr", 1000.0);
    const sanDanieleHam = await owner.addInventory(
      "San Daniele Dry Ham",
      10000.0,
      "gr",
      1000.0
    );
    const mussles = await owner.addInventory("Mussles", 10000.0, "gr", 1000.0);
    const eggs = await owner.addInventory("Egg", 100.0, "pcs", 30.0);
    const pecorinoCheese = await owner.addInventory(
      "Pecorino Cheese",
      5000.0,
      "gr",
      1000.0
    );
    const parmesan = await owner.addInventory("Parmesan", 5000.0, "gr", 1000.0);
    const steak = await owner.addInventory("Steak", 10.0, "kg", 3.0);
    const potatoes = await owner.addInventory(
      "Potatoes",
      10000.0,
      "gr",
      1000.0
    );
    const rocket = await owner.addInventory("Rocket", 2000.0, "gr", 500.0);
    const giltheadBream = await owner.addInventory(
      "Gilthead Bream",
      10.0,
      "kg",
      2.0
    );
    const seaBass = await owner.addInventory("Seabass", 10.0, "kg", 2.0);

    // await owner.updateInventory(1, "Spaghetti", 80.0, "kg", 20.0);

    const spaghettiAlPomodoro = await chef.addMeal(
      "Spaghetti al pomodoro",
      13.0,
      [
        { inventoryId: spaghetti.id, quantityNeeded: 0.1 },
        { inventoryId: basil.id, quantityNeeded: 10 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
      ]
    );

    // await chef.deleteMeal(1);

    await owner.addTable(2);
    await owner.addTable(4);
    await owner.addTable(6);
    await owner.addTable(8);
    await owner.addTable(10);

    await db.slot.create({
      start: moment("12:00", "HH:mm").format("HH:mm"),
      end: moment("15:00", "HH:mm").format("HH:mm"),
    });
    await db.slot.create({
      start: moment("15:00", "HH:mm").format("HH:mm"),
      end: moment("18:00", "HH:mm").format("HH:mm"),
    });
    await db.slot.create({
      start: moment("18:00", "HH:mm").format("HH:mm"),
      end: moment("21:00", "HH:mm").format("HH:mm"),
    });
    await db.slot.create({
      start: moment("21:00", "HH:mm").format("HH:mm"),
      end: moment("24:00", "HH:mm").format("HH:mm"),
    });

    await customer.makeReservation({
      numberOfPeople: 4,
      date: moment("17.04.2023", "DD.MM.yyyy").format("YYYY-MM-DD"),
      comment: "TestinComment",
      slotId: 1,
      tableId: 1,
    });

    await customer.makeReservation({
      numberOfPeople: 2,
      date: moment("17.03.2023", "DD.MM.yyyy").format("YYYY-MM-DD"),
      comment: "gedsfsdfsad",
      slotId: 2,
      tableId: 2,
    });

    await customer.updateReservation(1, {
      numberOfPeople: 6,
    });

    await customer.cancelReservation(2);
    var arrayOfMenuItems = [1, 2];
    console.log(Array.isArray(arrayOfMenuItems));

    const onsiteOrderObj = await waiter.createOnSiteOrder(1, [
      { menuItemId: 1, quantity: 2 },
    ]);

    const superOrderObj = await onsiteOrderObj.getOrder();

    await waiter.updateOrderItemQuantity(superOrderObj.id, 1, 10);

    // // MARK ORDER ITEM AS PREPARING
    await chef.prepareOrderItem(1);

    // MARK ORDER ITEM AS READY
    await chef.markOrderItemAsPrepared(1);

    // //  Waiter serves prepared orderItem
    await waiter.serveOrderItem(1);

    // Customer creates online order
    await customer.createOnlineOrder(
      moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      [{ menuItemId: 1, quantity: 2 }]
    );
    // // MARK ORDER ITEM STATUS =  PREPARING
    await chef.prepareOrderItem(2);
    // MARK ORDER ITEM AS READY
    await chef.markOrderItemAsPrepared(2);

    await driver.pickUpOrder(1);

    //Driver  completes delivery
    await driver.completeDelivery(1);

    await waiter.generateBill(1, "CASH");

    customer.leaveReview("5", "Excellent service!");
  },
};
