module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "product",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "description is required" },
        },
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "price is required" },
        },
      },
      stripe_price: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );

  return Product;
};
