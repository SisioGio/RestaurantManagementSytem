module.exports = (sequelize, Sequelize, reservationModel) => {
  var bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const config = require("../config/auth.config");
  const User = sequelize.define(
    "user",
    {
      // Model attributes are defined here
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: ["CUSTOMER", "EMPLOYEE"],
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
        },
      },

      token: {
        type: Sequelize.STRING,
      },
    },
    {
      // Other model options go here
    }
  );

  User.checkIfExists = async function (email) {
    const userObj = await User.findOne({ where: { email: email } });

    return userObj;
  };

  User.prototype.passwordIsCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  User.prototype.generateAccessToken = async function () {
    const token = jwt.sign({ id: this._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return token;
  };
  User.prototype.updateObject = async function (data) {
    await this.update({
      data,
    });

    return;
  };

  User.getAllReservations = async function () {
    const reservations = reservationModel.findAll();
  };

  return User;
};
