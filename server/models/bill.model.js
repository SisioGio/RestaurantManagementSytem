module.exports = (sequelize, Sequelize) => {
  const Bill = sequelize.define(
    "bill",
    {
      totalAmount: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM,
        values: ["CARD", "CASH"],
      },
    },
    {}
  );

  return Bill;
};
