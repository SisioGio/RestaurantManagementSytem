module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define(
    "orderItem",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      status: {
        type: Sequelize.ENUM,
        values: ["NEW", "PREPARING", "READY", "COMPLETED", "CANCELED"],
        defaultValue: "NEW",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  return OrderItem;
};
