module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "category",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  return Category;
};
