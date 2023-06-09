module.exports = (
  superClass,
  sequelize,
  Sequelize,
  meal,
  ingredient,
  orderItemModel
) => {
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
  Chef.prototype.addMeal = async function (mealName, mealPrice, recipe) {
    const mealObj = await meal.create({
      name: mealName,
      price: mealPrice,
    });

    recipe.forEach(async (x) => {
      await ingredient.create({
        quantityNeeded: x.quantityNeeded,
        mealId: mealObj.id,
        inventoryId: x.inventoryId,
      });
    });
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

    recipe.forEach(async (x) => {
      // upsert -> Update or create row
      await ingredient.upsert(
        {
          mealId: mealId,
          inventoryId: x.inventoryId,
          quantityNeeded: x.quantityNeeded,
        },
        {
          where: {
            mealId: mealId,
            inventoryId: x.inventoryId,
          },
        }
      );
    });
  };
  // Chef delets menu item ( meal)
  Chef.prototype.deleteMeal = async function (mealId) {
    console.log("Deleting meal....");
    await meal.destroy({ where: { id: mealId } });
  };
  // Chef starts working on an order item and the status changes to 'PREPARING'
  Chef.prototype.prepareOrderItem = async function (orderItemId) {
    const orderItemObj = await orderItemModel.findByPk(orderItemId);

    orderItemObj.status = "PREPARING";
    await orderItemObj.save();
  };
  // Chef marks order items as 'PREPARED'
  Chef.prototype.markOrderItemAsPrepared = async function (orderItemId) {
    const orderItemObj = await orderItemModel.findByPk(orderItemId);
    const orderObj = await orderItemObj.getOrder();
    orderItemObj.status = "READY";
    await orderItemObj.save();
    if (orderObj.type === "ONLINE") {
      await orderObj.checkIfCompleted();
    }
  };

  return Chef;
};
