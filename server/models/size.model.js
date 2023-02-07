module.exports = (sequelize, Sequelize) => {
  const Size = sequelize.define(
    "size",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name is required" },
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return Size;
};
