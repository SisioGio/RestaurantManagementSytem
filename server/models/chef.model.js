const { Op } = require("sequelize");

module.exports = (
  superClass,
  sequelize,
  Sequelize,
  meal,
  ingredient,
  orderItemModel,
  category
) => {
  const moment = require("moment");
  const Chef = sequelize.define(
    "chef",
    {},
    {
      // Other model options go here
    }
  );
  // Creation of chef class using User as super class

  Chef.createWithAbstractClass = async function (
    firsTname,
    lastName,
    email,
    phoneNo,
    password,
    salary
  ) {
    const employeeObj = await superClass.createWithAbstractClass(
      firsTname,
      lastName,
      email,
      phoneNo,
      password,
      salary
    );

    const chef = await Chef.create({});

    await chef.setEmployee(employeeObj);

    return chef;
  };
  // Check add meal ( menu item)
  Chef.prototype.addMeal = async function (
    mealName,
    mealPrice,
    categoryId,
    recipe
  ) {
    const mealObj = await meal.create({
      name: mealName,
      price: mealPrice,
      categoryId: categoryId,
    });

    for (const ingredientItem of recipe) {
      await ingredient.create({
        quantityNeeded: ingredientItem.quantityNeeded,
        menuItemId: mealObj.id,
        inventoryId: ingredientItem.inventoryId,
      });
    }

    return mealObj;
  };
  // Check updates meal (recipe includes objects of  quantity and inventory item)
  Chef.prototype.updateMeal = async function (
    mealId,
    mealName,
    mealPrice,
    recipe
  ) {
    // Update meal object
    const mealObj = await meal.update(
      {
        name: mealName,
        price: mealPrice,
      },
      {
        where: {
          id: mealId,
        },
      }
    );
    // Check if recipe was provided
    if (recipe.length === 0) return;

    await ingredient.destroy({ where: { menuItemId: mealId } });

    for (const ingredientObj of recipe) {
      await ingredient.create({
        menuItemId: mealId,
        inventoryId: ingredientObj.inventoryId,
        quantityNeeded: ingredientObj.quantityNeeded,
      });
    }
  };
  // Chef delets menu item ( meal)
  Chef.prototype.deleteMeal = async function (mealId) {
    console.log("Deleting meal....");
    await meal.destroy({ where: { id: mealId } });
  };
  // Chef starts working on an order item and the status changes to 'PREPARING'
  Chef.prototype.prepareOrderItem = async function (orderItemId) {
    const orderItemObj = await orderItemModel.findByPk(orderItemId);
    if (!orderItemObj) {
      throw Error(`Order item with ID ${orderItemModel.id} not found`);
    }
    const orderObj = await orderItemObj.getOrder();
    const childOrder = await orderObj.getChild();

    if (!childOrder.status === "NEW") {
      throw Error(`Cannot update order item with status ${childOrder.status}`);
    }

    const menuItem = await orderItemObj.getMenuItem();
    const ingredients = await menuItem.getIngredients();
    for (const ingredient of ingredients) {
      var inventoryItem = await ingredient.getInventory();

      await inventoryItem.increment("quantity", {
        by: -ingredient.quantityNeeded,
      });
      await inventoryItem.save();
    }
    childOrder.status = "IN_PROGRESS";
    orderItemObj.status = "PREPARING";
    await orderItemObj.save();
    await childOrder.save();
  };
  // Chef marks order items as 'PREPARED'
  Chef.prototype.markOrderItemAsPrepared = async function (orderItemId) {
    const orderItemObj = await orderItemModel.findByPk(orderItemId);
    if (!orderItemObj) {
      throw Error(`Order item with ID ${orderItemObj.id} not found`);
    }

    if (orderItemObj.status !== "PREPARING") {
      throw Error(
        `To set as 'READY' an order item its status must be 'PREPARING' but it's ${orderItemObj.status}`
      );
    }
    const orderObj = await orderItemObj.getOrder();

    orderItemObj.status = "READY";
    await orderItemObj.save();
    if (orderObj.type === "ONLINE") {
      await orderObj.checkIfCompleted();
    }
  };

  Chef.getOrderItems = async function () {
    const {
      orderItem,
      menuItem,
      ingredient,
      inventory,
      order,
      onsiteOrder,
    } = require("./../models");

    var orderItems = await orderItem.findAll({
      include: [
        {
          model: order,
          include: {
            model: onsiteOrder,
            where: {
              status: {
                [Op.ne]: "PREORDER",
              },
            },
          },
        },
        {
          model: menuItem,
          include: { model: ingredient, include: inventory },
        },
      ],
    });

    const sorted = orderItems.sort((a, b) => {
      const datea = moment(a.updatedAt);
      const dateb = moment(b.updatedAt);
      return datea - dateb;
    });

    const grouped = sorted.reduce((acc, item) => {
      const { status } = item;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(item);
      return acc;
    }, {});

    return grouped;
  };

  return Chef;
};
