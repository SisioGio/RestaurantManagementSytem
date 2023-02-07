module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "firstname is required" },
        },
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "surname is required" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "email is required" },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
        },
      },

      stripeId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "pasword is required" },
        },
      },
      token: {
        type: Sequelize.STRING,
      },
      birthDate: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
        enum: ["Pending", "Active"],
        default: "Pending",
      },
      confirmationCode: {
        type: Sequelize.STRING,
        unique: true,
      },
    },
    {
      paranoid: true,
    }
  );

  return User;
};
