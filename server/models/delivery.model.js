module.exports = (sequelize, Sequelize) => {
  const Delivery = sequelize.define(
    "delivery",
    {
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "status is required" },
        },
        defaultValue: "RECEIVED",
      },
    },
    {
      paranoid: true,
    }
  );

  return Delivery;
};
