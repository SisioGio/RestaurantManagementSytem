module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define(
    "message",
    {
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "message is required" },
        },
      },
      sender: {
        type: Sequelize.TEXT,
        enum: ["user", "admin"],
        default: "user",
      },
    },
    {
      paranoid: true,
    }
  );

  return Message;
};
