module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define(
    "ticket",
    {
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "subject is required" },
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "status is required" },
        },
        defaultValue: "NEW",
      },
    },
    {
      paranoid: true,
    }
  );

  return Ticket;
};
