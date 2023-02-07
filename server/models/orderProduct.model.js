module.exports = (sequelize, Sequelize) => {
  const OrderProduct = sequelize.define(
    "order_product",
    {
      idOrderProduct: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "quantity is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return OrderProduct;
};
