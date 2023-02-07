module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "stock",
    {
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
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

  return Stock;
};
