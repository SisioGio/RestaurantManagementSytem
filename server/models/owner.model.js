module.exports = (
  superClass,
  sequelize,
  Sequelize,
  inventory,
  table,
  category
) => {
  const Owner = sequelize.define(
    "owner",
    {},
    {
      // Other model options go here
    }
  );

  Owner.createWithAbstractClass = async function (
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

    const owner = await Owner.create({});

    await owner.setEmployee(employeeObj);

    return owner;
  };

  Owner.prototype.addCategory = async function (
    categoryName,
    categorySortOrder
  ) {
    return await category.create({
      name: categoryName,
      sortOrder: categorySortOrder,
    });
  };

  Owner.prototype.addInventory = async function (
    name,
    quantity,
    unitOfMeasure,
    notifyAtQuantity
  ) {
    const inventoryObj = await inventory.create({
      name: name,
      quantity: quantity,
      unitOfMeasure: unitOfMeasure,
      notifyAt: notifyAtQuantity,
    });
    return inventoryObj;
  };

  Owner.prototype.updateInventory = async function (
    inventoryId,
    name,
    quantity,
    unitOfMeasure,
    notifyAtQuantity
  ) {
    const inventoryObj = await inventory.update(
      {
        name: name,
        quantity: quantity,
        unitOfMeasure: unitOfMeasure,
        notifyAt: notifyAtQuantity,
      },
      { where: { id: inventoryId } }
    );
  };

  Owner.prototype.addSlot = async function (attributes) {
    const { slot } = require("./../models");

    return await slot.create(attributes);
  };
  // Owner deletes inventory
  Owner.prototype.deleteInventory = async function (inventoryId) {
    await inventory.destroy({
      where: { id: inventoryId },
    });
  };
  // Owner adds new table
  Owner.prototype.addTable = async function (capacity) {
    await table.create({
      capacity: capacity,
    });
  };

  Owner.prototype.getReviews = async function () {
    const { review } = require("./../models");

    const reviews = await review.findAll({
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("createdAt")), "year"],
        [sequelize.fn("AVG", sequelize.col("star")), "averagePoints"],
      ],
      group: sequelize.fn("YEAR", sequelize.col("createdAt")), // Group by the year extracted from the createdAt column
    });

    return reviews;
  };

  Owner.prototype.giveRaise = async function (employeeId, percentageIncrease) {
    const { employee } = require("./../models");

    const emp = await employee.findByPk(employeeId);
    if (!emp) {
      throw Error("Employee not found");
    }
    if (percentageIncrease < 1 || percentageIncrease > 20) {
      throw Error(
        "Percentage increase must be a positive integer between 1 and 20"
      );
    }
    emp.salary = emp.salary + emp.salary * (percentageIncrease / 100);

    await emp.save();
  };
  Owner.prototype.updateEmployeeInformation = async function (attributes) {
    const { employee } = require("./../models");

    const emp = await employee.findByPk(attributes.employeeId);
    if (!emp) {
      throw Error("Employee not found");
    }

    const userObj = await emp.getUser();

    await userObj.update({
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      email: attributes.email,
      phoneNo: attributes.phoneNo,
    });
  };

  // Function to get the most ordered menu items
  Owner.prototype.showMostOrderedMenuItems = async function () {
    const { menuItem, orderItem } = require("./../models");
    const result = await orderItem.findAll({
      attributes: [
        "menuItemId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
      ],
      group: "menuItemId",
      order: [[sequelize.literal("totalQuantity"), "DESC"]],
      include: [
        {
          model: menuItem,
          attributes: ["name"],
        },
      ],
      limit: 10,
    });

    return result.map((item) => ({
      menuItemId: item.menuItemId,
      totalQuantity: item.getDataValue("totalQuantity"),
      menuItemName: item.menuItem.name,
    }));
  };

  return Owner;
};
