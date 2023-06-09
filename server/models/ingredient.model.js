module.exports = (sequelize, Sequelize) => {
  const Ingredient = sequelize.define(
    "ingredient",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      quantityNeeded: {
        type: Sequelize.FLOAT(5, 2),
        allowNull: false,
      },
    },
    {}
  );

  return Ingredient;
};
