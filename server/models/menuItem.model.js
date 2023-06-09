module.exports = (sequelize, Sequelize) => {
  const MenuItem = sequelize.define(
    "menuItem",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      price: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
      },
    },
    {}
  );

  return MenuItem;
};
