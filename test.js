var assert = require("assert");
var server = require("./server/server"); // Replace './myScript' with the path to your Node.js script
var moment = require("moment");
describe("Server", async function () {
  var db = server.db;
  var customer;
  var waiter;
  var chef;
  var driver;
  var chef;
  var starters;
  var firstCourses;
  var secondCourses;
  var pizza;
  var sides;
  var desserts;
  var beverages;
  var specials;
  var spaghetti;
  var mozzarella;
  var tomatoSauce;
  var tuna;
  var mushrooms;
  var water;
  var whiteWine;
  var redWine;
  var beer;
  var flour;
  var brewersYest;
  var salt;
  var oliveOil;
  var penne;
  var rigatoni;
  var gnocchi;
  var seafood;
  var parsley;
  var basil;
  var frenchFries;
  var bread;
  var sanDanieleHam;
  var mussles;
  var eggs;
  var pecorinoCheese;
  var parmesan;
  var steak;
  var potatoes;
  var rocket;
  var giltheadBream;
  var seaBass;
  var tomato;
  var garlic;
  var rosmarin;
  var lemon;
  var spaghettiAlPomodoro;
  var spaghettiAlloScoglio;
  var bruschetteAlPomodoro;
  var souteDiCozze;
  var steakWithPotatoes;
  var seaBassWithPotatoes;
  var bottleOfWhiteWine;
  var bottleOfRedWine;
  var bottleOfWater;
  var bottleOfBeer;

  it("server initialization", async function () {
    this.timeout(100000);
    await db.sequelize.sync({ force: true });
    var result = 1;

    assert.strictEqual(result, 1);
  });

  it("customer creation (abstract class user)", async function () {
    customer = await db.customer.createWithAbstractClass(
      "Alessio",
      "Giovannini",
      "alessio.giovannini@oerlikon.com",
      "3454646930",
      "customer"
    );
    var userObj = await customer.getUser();
    var result = userObj.firstName;
    assert.strictEqual(result, "Alessio");
  });

  it("waiter creation (abstract class Employee->User)", async function () {
    waiter = await db.waiter.createWithAbstractClass(
      "Marco",
      "Caliri",
      "marco.caliri@oerlikon.com",
      "34536434243",
      "waiter",
      1000.0
    );
    var empObj = await waiter.getEmployee();
    var userObj = await empObj.getUser();
    var result = userObj.firstName;
    assert.strictEqual(result, "Marco");
  });
  it("chef creation (abstract class Employee->User)", async function () {
    chef = await db.chef.createWithAbstractClass(
      "Luca",
      "Pili",
      "luca.pili@oerlikon.com",
      "34536434243",
      "chef",
      2000.0
    );
    var empObj = await chef.getEmployee();
    var userObj = await empObj.getUser();
    var result = userObj.firstName;
    assert.strictEqual(result, "Luca");
  });

  it("driver creation (abstract class Employee->User)", async function () {
    driver = await db.driver.createWithAbstractClass(
      "Giulio",
      "Amitrano",
      "giulio.amitrano@oerlikon.com",
      "34536434243",
      "Hello123!",
      800.0
    );
    var empObj = await driver.getEmployee();
    var userObj = await empObj.getUser();
    var result = userObj.firstName;
    assert.strictEqual(result, "Giulio");
  });

  it("owner creation (abstract class Employee->User)", async function () {
    owner = await db.owner.createWithAbstractClass(
      "Alessandro",
      "Lacci",
      "alessandro.lacci@oerlikon.com",
      "34536434243",
      "owner",
      800.0
    );
    var empObj = await owner.getEmployee();
    var userObj = await empObj.getUser();
    var result = userObj.firstName;
    assert.strictEqual(result, "Alessandro");
  });

  it("categories initialization", async function () {
    starters = await owner.addCategory("STARTERS", 0);
    firstCourses = await owner.addCategory("FIRST COURSES", 1);
    secondCourses = await owner.addCategory("SECOND COURSES", 2);
    pizza = await owner.addCategory("PIZZA", 3);
    sides = await owner.addCategory("SIDES", 4);
    desserts = await owner.addCategory("DESSERTS", 5);
    beverages = await owner.addCategory("BEVERAGES", 6);
    specials = await owner.addCategory("SPECIALS", 7);

    var result = await db.category.count();
    assert.strictEqual(result, 8);
  });

  it("waiter clocks in", async function () {
    var employObj = await waiter.getEmployee();
    await employObj.clockIn();

    var result = await db.timeTracker.count({ where: { activity: "IN" } });
    assert.strictEqual(result, 1);
  });

  it("owner creates inventory items", async function () {
    spaghetti = await owner.addInventory("Spaghetti", 100.0, "kg", 20.0);
    mozzarella = await owner.addInventory("Mozzarella", 50.0, "pcs", 10.0);
    tomatoSauce = await owner.addInventory("Tomato Sauce", 50.0, "kg", 10.0);
    tuna = await owner.addInventory("Tuna", 10.0, "kg", 5);
    mushrooms = await owner.addInventory("Mushrooms", 5.0, "kg", 1.0);
    water = await owner.addInventory("Water", 100.0, "L", 10.0);
    whiteWine = await owner.addInventory("White Wine", 100.0, "L", 10.0);
    redWine = await owner.addInventory("Red Wine", 100.0, "L", 10.0);
    beer = await owner.addInventory("Beer", 100.0, "L", 10.0);
    flour = await owner.addInventory("Flour", 10000.0, "g", 3000.0);
    brewersYest = await owner.addInventory(
      "Brewer's yeast",
      2000.0,
      "g",
      500.0
    );
    salt = await owner.addInventory("Salt", 100000.0, "g", 1000.0);
    oliveOil = await owner.addInventory("Olive Oil", 100.0, "L", 10.0);
    penne = await owner.addInventory("Penne", 100.0, "kg", 10.0);
    rigatoni = await owner.addInventory("Rigatoni", 100.0, "kg", 10.0);
    gnocchi = await owner.addInventory("Gnocchi", 100.0, "kg", 10.0);
    seafood = await owner.addInventory("Seafood", 10.0, "kg", 1.0);
    parsley = await owner.addInventory("Parsley", 1000.0, "g", 1.0);
    basil = await owner.addInventory("Basil", 1000.0, "g", 100.0);
    frenchFries = await owner.addInventory("French Fries", 100.0, "kg", 10.0);
    bread = await owner.addInventory("Bread", 10000.0, "g", 1000.0);
    sanDanieleHam = await owner.addInventory(
      "San Daniele Dry Ham",
      10000.0,
      "g",
      1000.0
    );
    mussles = await owner.addInventory("Mussles", 10000.0, "g", 1000.0);
    eggs = await owner.addInventory("Egg", 100.0, "pcs", 30.0);
    pecorinoCheese = await owner.addInventory(
      "Pecorino Cheese",
      5000.0,
      "g",
      1000.0
    );
    parmesan = await owner.addInventory("Parmesan", 5000.0, "g", 1000.0);
    steak = await owner.addInventory("Steak", 10.0, "kg", 3.0);
    potatoes = await owner.addInventory("Potatoes", 10000.0, "g", 1000.0);
    rocket = await owner.addInventory("Rocket", 2000.0, "g", 500.0);
    giltheadBream = await owner.addInventory("Gilthead Bream", 10.0, "kg", 2.0);
    seaBass = await owner.addInventory("Seabass", 10.0, "kg", 2.0);
    tomato = await owner.addInventory("Tomato", 5.0, "kg", 1.0);
    garlic = await owner.addInventory("Garlic", 2000.0, "g", 200.0);
    rosmarin = await owner.addInventory("Rosmarin", 5000.0, "g", 500.0);
    lemon = await owner.addInventory("Lemon", 5000.0, "g", 500.0);

    result = await db.inventory.count();
    assert.strictEqual(result, 35);
  });

  it("owner updates inventory item", async function () {
    await owner.updateInventory(spaghetti.id, "Spaghetti ", 80.0, "kg", 20.0);

    const invObj = await db.inventory.findByPk(spaghetti.id);
    result = invObj.quantity;
    assert.strictEqual(result, 80.0);
  });

  it("owner deletes inventory item", async function () {
    await owner.deleteInventory(pecorinoCheese.id);

    result = await db.inventory.count();
    assert.strictEqual(result, 34);
  });

  it("chef creates menu items", async function () {
    spaghettiAlPomodoro = await chef.addMeal(
      "Spaghetti al pomodoro",
      13.0,
      firstCourses.id,
      [
        { inventoryId: spaghetti.id, quantityNeeded: 0.1 },
        { inventoryId: basil.id, quantityNeeded: 10.0 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: tomatoSauce.id, quantityNeeded: 0.1 },
        { inventoryId: parmesan.id, quantityNeeded: 50.0 },
      ]
    );

    var spaghettiAlloScoglio = await chef.addMeal(
      "Spaghetti allo scoglio",
      18.0,
      firstCourses.id,
      [
        { inventoryId: spaghetti.id, quantityNeeded: 0.1 },
        { inventoryId: parsley.id, quantityNeeded: 20.0 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: seafood.id, quantityNeeded: 0.1 },
      ]
    );

    var bruschetteAlPomodoro = await chef.addMeal(
      "Bruschette al pomororo",
      8.0,
      starters.id,
      [
        { inventoryId: bread.id, quantityNeeded: 300.0 },
        { inventoryId: tomato.id, quantityNeeded: 0.15 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: garlic.id, quantityNeeded: 5 },
      ]
    );
    var souteDiCozze = await chef.addMeal("Soute' di cozze", 8.0, starters.id, [
      { inventoryId: mussles.id, quantityNeeded: 300.0 },
      { inventoryId: whiteWine.id, quantityNeeded: 0.1 },
      { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
      { inventoryId: salt.id, quantityNeeded: 5.0 },
      { inventoryId: garlic.id, quantityNeeded: 5 },
      { inventoryId: parsley.id, quantityNeeded: 25 },
    ]);

    var steakWithPotatoes = await chef.addMeal(
      "Steak",
      26.0,
      secondCourses.id,
      [
        { inventoryId: steak.id, quantityNeeded: 1.0 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: rosmarin.id, quantityNeeded: 25.0 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: garlic.id, quantityNeeded: 5 },

        { inventoryId: potatoes.id, quantityNeeded: 250.0 },
      ]
    );
    var seaBassWithPotatoes = await chef.addMeal(
      "Seabass",
      22.0,
      secondCourses.id,
      [
        { inventoryId: seaBass.id, quantityNeeded: 1.0 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: parsley.id, quantityNeeded: 25.0 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: garlic.id, quantityNeeded: 5 },
        { inventoryId: lemon.id, quantityNeeded: 25.0 },
        { inventoryId: potatoes.id, quantityNeeded: 250.0 },
      ]
    );

    var bottleOfWhiteWine = await chef.addMeal(
      "White wine",
      21.0,
      beverages.id,
      [{ inventoryId: whiteWine.id, quantityNeeded: 0.75 }]
    );

    var bottleOfRedWine = await chef.addMeal("Red wine", 21.0, beverages.id, [
      { inventoryId: redWine.id, quantityNeeded: 0.75 },
    ]);

    var bottleOfWater = await chef.addMeal("Water", 4.0, beverages.id, [
      { inventoryId: water.id, quantityNeeded: 1.0 },
    ]);
    var bottleOfBeer = await chef.addMeal("Beer", 7.0, beverages.id, [
      { inventoryId: beer.id, quantityNeeded: 0.5 },
    ]);
    result = await db.menuItem.count();
    assert.strictEqual(result, 10);
  });

  it("check menu item ingredients", async function () {
    var meal = await db.menuItem.findByPk(1);
    ingredients = await meal.getIngredients();
    result = ingredients.length;

    assert.strictEqual(result, 6);
  });

  it("chef update menu item (recipe included)", async function () {
    var meal = await db.menuItem.findByPk(1);

    await chef.updateMeal(
      meal.id,
      "Penne al pomodoro",
      11.0,

      [
        { inventoryId: penne.id, quantityNeeded: 0.1 },
        { inventoryId: basil.id, quantityNeeded: 10.0 },
        { inventoryId: oliveOil.id, quantityNeeded: 0.01 },
        { inventoryId: salt.id, quantityNeeded: 5.0 },
        { inventoryId: tomatoSauce.id, quantityNeeded: 0.1 },
        { inventoryId: parmesan.id, quantityNeeded: 50.0 },
      ]
    );
    var ingredients = await meal.getIngredients();

    var isPenneInclude =
      ingredients.findIndex((ingredient) => ingredient.inventoryId === 14) > -1;
    result = isPenneInclude;
    assert.strictEqual(result, true);
  });

  it("owner adds tables", async function () {
    await owner.addTable(2);
    await owner.addTable(4);
    await owner.addTable(6);
    await owner.addTable(8);
    await owner.addTable(10);
    result = await db.tableMdl.count();
    assert.strictEqual(result, 5);
  });

  it("owner adds slots", async function () {
    await owner.addSlot({
      start: moment("12:00", "HH:mm").format("HH:mm"),
      end: moment("15:00", "HH:mm").format("HH:mm"),
    });
    await owner.addSlot({
      start: moment("15:00", "HH:mm").format("HH:mm"),
      end: moment("18:00", "HH:mm").format("HH:mm"),
    });
    await owner.addSlot({
      start: moment("18:00", "HH:mm").format("HH:mm"),
      end: moment("21:00", "HH:mm").format("HH:mm"),
    });
    await owner.addSlot({
      start: moment("21:00", "HH:mm").format("HH:mm"),
      end: moment("24:00", "HH:mm").format("HH:mm"),
    });
    result = await db.slot.count();
    assert.strictEqual(result, 4);
  });

  it("customer creates reservation without order", async function () {
    const reservationObj = await customer.makeReservation({
      noOfPeople: 4,
      date: moment("17.04.2023", "DD.MM.yyyy").format("YYYY-MM-DD"),
      comment: "TestinComment",
      slotId: 1,
      tableId: 1,
    });

    result = reservationObj.customerId;
    assert.strictEqual(result, customer.id);
  });

  it("check if table is available for the selected date/slot (unavailable)", async function () {
    const checkAvailability = await db.reservation.checkAvailability(
      1,
      1,
      moment("17.04.2023", "DD.MM.YYYY")
    );

    result = checkAvailability;
    assert.strictEqual(result, false);
  });

  it("check if table is available for the selected date/slot (available)", async function () {
    const checkAvailability = await db.reservation.checkAvailability(
      1,
      1,
      moment("18.04.2023", "DD.MM.YYYY")
    );

    result = checkAvailability;
    assert.strictEqual(result, true);
  });

  it("customer creates reservation with order", async function () {
    const secondReservationObj = await customer.makeReservation({
      noOfPeople: 4,
      date: moment("18.04.2023", "DD.MM.yyyy").format("YYYY-MM-DD"),
      comment: "TestinComment",
      slotId: 1,
      tableId: 1,
      menuItems: [
        {
          menuItemId: 1,
          quantity: 2,
        },
        {
          menuItemId: 7,
          quantity: 1,
        },
      ],
    });

    result = await db.onsiteOrder.count({
      where: { reservationId: secondReservationObj.id },
    });
    assert.strictEqual(result, 1);
  });

  it("check  status of preordered items", async function () {
    const preOrderedOrder = await db.onsiteOrder.findOne({ where: { id: 1 } });

    result = preOrderedOrder.status;
    assert.strictEqual(result, "PREORDER");
  });

  it("customer cancels reservation", async function () {
    await customer.cancelReservation(2);

    result = await db.reservation.count();
    assert.strictEqual(result, 1);
  });

  it("check orders when reservation is deleted", async function () {
    result = await db.onsiteOrder.count();
    assert.strictEqual(result, 0);
  });

  it("waiter confirms reservation", async function () {
    await waiter.confirmReservation(1);
    var reservationObj = await db.reservation.findByPk(1);

    result = reservationObj.status;
    assert.strictEqual(result, "CONFIRMED");
  });

  it("waiter starts reservation", async function () {
    await waiter.initializeReservation(1);
    var reservationObj = await db.reservation.findByPk(1);

    result = reservationObj.status;
    assert.strictEqual(result, "PROCESSING");
  });

  it("waiter creates onsite order for reservation", async function () {
    await waiter.createOnSiteOrder({
      reservationId: 1,

      orderItems: [
        {
          menuItemId: 1,
          quantity: 2,
        },
        {
          menuItemId: 7,
          quantity: 1,
        },
      ],
    });

    result = await db.onsiteOrder.count();
    assert.strictEqual(result, 1);
  });

  it("order items are correctly created", async function () {
    result = await db.orderItem.count();
    assert.strictEqual(result, 2);
  });

  it("error when trying to update an existing order item", async function () {
    try {
      await waiter.updateOrderItemQuantity(2, 100);
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(err.message, "Order item with ID =2 not found");
    }
  });

  it("waiter updates order item", async function () {
    await waiter.updateOrderItemQuantity(4, 100);
    result = await db.orderItem.findByPk(4);
    assert.strictEqual(result.quantity, 100);
  });
  it("chef retrieves the order items ( test grouping by status)", async function () {
    var items = await db.chef.getOrderItems();
    result = Object.keys(items).length;
    assert.strictEqual(result, 1);
  });
  it("chef retrieves the order items", async function () {
    var items = await db.chef.getOrderItems();
    result = items["NEW"].length;
    assert.strictEqual(result, 2);
  });

  it("chef marks order item as 'PREPARING'", async function () {
    var items = await chef.prepareOrderItem(3);
    var orderItemObj = await db.orderItem.findByPk(3);
    result = orderItemObj.status;
    assert.strictEqual(result, "PREPARING");
  });
  it("check if order status changes to 'IN_PROGRESS' when one order item changes to 'PREPARING'", async function () {
    var orderObj = await db.order.findByPk(2);
    var onsiteOrderObj = await orderObj.getChild();

    result = onsiteOrderObj.status;
    assert.strictEqual(result, "IN_PROGRESS");
  });
  it("chef tries to set as 'READY' an order item which has status 'NEW' -> Error", async function () {
    try {
      await chef.markOrderItemAsPrepared(4);

      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "To set as 'READY' an order item its status must be 'PREPARING' but it's NEW"
      );
    }
  });

  it("chef marks as 'PREPARING' the second order item", async function () {
    await chef.prepareOrderItem(4);

    result = await db.orderItem.count({ where: { status: "PREPARING" } });
    assert.strictEqual(result, 2);
  });

  it("chef marks as 'READY' one  item", async function () {
    await chef.markOrderItemAsPrepared(3);

    result = await db.orderItem.count({ where: { status: "READY" } });
    assert.strictEqual(result, 1);
  });

  it("order status should still be 'IN_PROGRESS'", async function () {
    var orderObj = await db.onsiteOrder.findByPk(2);

    result = orderObj.status;
    assert.strictEqual(result, "IN_PROGRESS");
  });

  it("chef marks as 'READY' the second  item", async function () {
    await chef.markOrderItemAsPrepared(4);

    result = await db.orderItem.count({ where: { status: "READY" } });
    assert.strictEqual(result, 2);
  });

  it("order status should still be 'IN_PROGRESS'", async function () {
    var orderObj = await db.onsiteOrder.findByPk(2);
    result = orderObj.status;
    assert.strictEqual(result, "IN_PROGRESS");
  });

  it("waiter marks as 'COMPLETED' one order item", async function () {
    await waiter.serveOrderItem(3);

    result = await db.orderItem.count({ where: { status: "COMPLETED" } });
    assert.strictEqual(result, 1);
  });
  it("order status should still be 'IN_PROGRESS'", async function () {
    var orderObj = await db.onsiteOrder.findByPk(2);
    result = orderObj.status;
    assert.strictEqual(result, "IN_PROGRESS");
  });

  it("waiter marks as 'COMPLETED' the second and last order item", async function () {
    await waiter.serveOrderItem(4);

    result = await db.orderItem.count({ where: { status: "COMPLETED" } });
    assert.strictEqual(result, 2);
  });

  it("order status should  be 'COMPLETED'", async function () {
    var orderObj = await db.onsiteOrder.findByPk(2);
    result = orderObj.status;
    assert.strictEqual(result, "COMPLETED");
  });
  it("waiter generates bill for reservation", async function () {
    await waiter.generateBill(1);
    result = await db.bill.count();
    assert.strictEqual(result, 1);
  });

  it("bill totalAmount =  2122.0", async function () {
    var bill = await db.bill.findByPk(1);
    result = parseFloat(bill.totalAmount);
    assert.strictEqual(result, 2122.0);
  });

  it("customer creates online order for past date", async function () {
    try {
      await customer.createOnlineOrder(
        moment("17.04.2023", "DD.MM.yyyy").format("YYYY-MM-DD")
      );
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "Cannot create reservation for past date"
      );
    }
  });
  it("customer creates online order without menu items", async function () {
    try {
      await customer.createOnlineOrder(
        moment("17.04.2024", "DD.MM.yyyy").format("YYYY-MM-DD"),
        []
      );
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "Online order must have at least one menu item"
      );
    }
  });

  it("customer creates online order wiht invalid menu item id", async function () {
    try {
      await customer.createOnlineOrder(
        moment("17.04.2024", "DD.MM.yyyy").format("YYYY-MM-DD"),
        [
          {
            menuItemId: 1333,
            quantity: 1,
          },
        ]
      );
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(err.message, "No menu item was found");
    }
  });

  it("customer creates online order wiht invalid menu item quantity", async function () {
    try {
      await customer.createOnlineOrder(
        moment("17.04.2024", "DD.MM.yyyy").format("YYYY-MM-DD"),
        [
          {
            menuItemId: 1,
            quantity: 3333,
          },
        ]
      );
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "Menu item quantity must be between 1 and 30 (incl)"
      );
    }
  });
  it("customer creates online order with wrong transaction amount", async function () {
    try {
      await customer.createOnlineOrder(
        moment("17.04.2024", "DD.MM.yyyy").format("YYYY-MM-DD"),
        [
          {
            menuItemId: 2,
            quantity: 3,
          },
        ],
        100,
        "TRANSACTION_HASH"
      );
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      assert.strictEqual(
        err.message,
        "Transaction amount does not match order amount (54)"
      );
    }
  });

  it("customer creates online order", async function () {
    await customer.createOnlineOrder(
      moment("17.04.2024", "DD.MM.yyyy").format("YYYY-MM-DD"),
      [
        {
          menuItemId: 2,
          quantity: 3,
        },
      ],
      54.0,
      "TRANSACTION_HASH"
    );
    result = await db.onlinePayment.count();
    assert.strictEqual(result, 1);
  });
  // it("error when trying to delete an order item with status <> 'NEW'", async function () {
  //   try {
  //     await waiter.removeItemFromOrder(2, 100);
  //     assert.fail("Expected an error to be thrown");
  //   } catch (err) {
  //     assert.strictEqual(err.message, "Order item with ID =2 not found");
  //   }
  // });
});
