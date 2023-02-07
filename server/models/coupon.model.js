module.exports = (sequelize, Sequelize) => {
  const Coupon = sequelize.define(
    "coupon",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "code is required" },
        },
      },
      amount: {
        type: Sequelize.FLOAT(7, 2),
        allowNull: false,

        validate: {
          notNull: { msg: "amount is required" },
        },
      },
      validFrom: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "validFrom is required" },
        },
      },
      validTo: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "validTo is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Coupon;
};
