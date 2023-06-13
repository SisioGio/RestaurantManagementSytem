const { Op } = require("sequelize");
const moment = require("moment");
module.exports = (
  sequelize,
  Sequelize,
  reservationModel,
  tableModel,
  slotModel
) => {
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
  // Verify incoming request by checking the received token
  User.findByToken = async function (token) {
    return await User.findOne({ where: { token: token } });
  };
  // Check if a user exists with a given email ( login )
  User.checkIfExists = async function (email) {
    const userObj = await User.findOne({ where: { email: email } });

    return userObj;
  };
  // Check if given password matches the stored one
  User.prototype.passwordIsCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  // Generates access token for authentication
  User.prototype.generateAccessToken = async function () {
    const token = jwt.sign({ id: this._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return token;
  };
  // Update user object
  User.prototype.updateObject = async function (data) {
    await this.update({
      data,
    });

    return;
  };
  // Retrieves all reservations
  User.getAllReservations = async function () {
    const reservations = reservationModel.findAll();
  };

  // Retrieve waiter object
  User.getWaiter = async function (userId) {
    const { employee, waiter } = require("./../models");
    const userObj = await User.findByPk(userId);
    const empObj = await userObj.getEmployee();
    const waiterObj = await empObj.getWaiter();
    return waiterObj;
  };

  // Retrieve chef object
  User.getChef = async function (userId) {
    const { employee, chef } = require("./../models");
    const userObj = await User.findByPk(userId);
    const empObj = await userObj.getEmployee();
    const chefObj = await empObj.getChef();
    return chefObj;
  };

  User.showSchedule = async function (from, to) {
    var dateFilters = {};

    var allowedThreshold = 1;

    if (from && to) {
      dateFilters.date = {
        [Op.between]: [moment(from, "yyyy-MM-DD"), moment(to, "yyyy-MM-DD")],
      };
    }

    const tables = await tableModel.findAll({
      include: {
        model: reservationModel,
        where: dateFilters,
        include: slotModel,
        required: false,
      },
    });

    var output = {};
    output.schedule = tables;
    output.slots = await slotModel.findAll();
    return output;
  };

  return User;
};
