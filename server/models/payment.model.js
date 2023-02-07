module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    "payment",
    {
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "transactionHash is required" },
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "type is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Payment;
};
