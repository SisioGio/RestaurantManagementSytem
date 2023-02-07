module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define(
    "tag",
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

  return Tag;
};
