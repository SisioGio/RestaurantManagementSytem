module.exports = (sequelize, Sequelize) => {
  const Discount = sequelize.define(
    "discount",
    {
      percentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "percentage is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Discount;
};
