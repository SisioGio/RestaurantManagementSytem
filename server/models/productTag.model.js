module.exports = (sequelize, Sequelize) => {
  const ProductTag = sequelize.define(
    "productTag",
    {},
    {
      paranoid: true,
    }
  );

  return ProductTag;
};
