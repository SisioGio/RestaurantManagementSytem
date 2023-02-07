module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalAmount is required" },
        },
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaulValue: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return Order;
};
