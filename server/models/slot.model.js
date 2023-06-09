const db = require(".");

module.exports = (sequelize, Sequelize) => {
  const Slot = sequelize.define(
    "slot",
    {
      start: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    },
    {}
  );

  return Slot;
};
