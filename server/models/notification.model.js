module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      message: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "message is required" },
        },
      },

      visualized: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
    }
  );

  return Notification;
};
