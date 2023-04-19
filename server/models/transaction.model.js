module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      netAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "netAmount is required" },
        },
      },
      taxAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "taxAmount is required" },
        },
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "totalAmount is required" },
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "description is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Transaction;
};
