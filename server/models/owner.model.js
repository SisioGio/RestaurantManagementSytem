module.exports = (superClass, sequelize, Sequelize, inventory, table) => {
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

  Owner.prototype.deleteInventory = async function (inventoryId) {
    await inventory.destroy({
      where: { id: inventoryId },
    });
  };

  Owner.prototype.addTable = async function (capacity) {
    await table.create({
      capacity: capacity,
    });
  };

  return Owner;
};
