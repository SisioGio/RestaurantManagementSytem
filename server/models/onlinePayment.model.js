module.exports = (sequelize, Sequelize) => {
  const OnlinePayment = sequelize.define(
    "onlinePayment",
    {
      totalAmount: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
      },
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {}
  );

  return OnlinePayment;
};
