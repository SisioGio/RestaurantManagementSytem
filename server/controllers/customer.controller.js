const { Op } = require("sequelize");
const db = require("../models");
const moment = require("moment");
const e = require("express");
const Customer = db.customer;

// Retrieve reservations
exports.getReservations = async (req, res) => {
  // Check if given userId is valid
  const userId = req.params.userId;
  const userObj = await db.user.findByPk(userId);
  if (!userObj) {
    return res.status(403).send({
      message: `No user was found with ID ${userId}`,
    });
  }

  const customerObj = await userObj.getCustomer();

  const reservations = await customerObj.getOwnReservations();

  return res.send(reservations);
};
// Retrieve reservations
exports.test = async (req, res) => {
  // Check if given userId is valid
  const customerId = 1;
  const data = await Customer.findAll({ include: { all: true } });

  return res.send(data);
};
