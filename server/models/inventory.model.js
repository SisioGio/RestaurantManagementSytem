module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define(
    "inventory",
    {
      quantity: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
      },
      unitOfMeasure: {
        type: Sequelize.ENUM,
        values: ["ml", "kg", "g", "L", "CL", "pcs"],
      },
      notifyAt: {
        type: Sequelize.FLOAT(10, 2),
        defaultValue: 0.0,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {}
  );

  return Inventory;
};
