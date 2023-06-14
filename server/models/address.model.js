module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define(
    "address",
    {
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      postCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      streetNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {}
  );

  return Address;
};
