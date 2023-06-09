module.exports = (sequelize, Sequelize) => {
  const Table = sequelize.define(
    "table",
    {
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  return Table;
};
