const db = require("../models");

exports.makeReservation = async (req, res) => {
  try {
    const { userId, tableId, date, slotId, noOfPeople, comment, menuItems } =
      req.body;
    const userObj = await db.user.findByPk(userId);
    const customerObj = await userObj.getCustomer();
    await customerObj.makeReservation(req.body);
    return res.send(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    console.log(reservationId);
    await db.reservation.deleteReservation(reservationId);
    return res.send("Reservation deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await db.reservation.getAllReservations();
    return res.send(reservations);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};
exports.getReservationById = async (req, res) => {
  try {
    var reservationId = req.params.reservationId;
    const reservation = await db.reservation.getReservationById(reservationId);
    return res.send(reservation);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

exports.markAsConfirmed = async (req, res) => {
  try {
    const { reservationId, userId } = req.body;
    const userObj = await db.user.findByPk(userId);
    const employee = await userObj.getEmployee();
    const waiter = await employee.getWaiter();
    await waiter.confirmReservation(reservationId);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const { reservationId, userId, paymentType } = req.body;
    const waiterObj = await db.user.getWaiter(userId);
    await waiterObj.generateBill(reservationId, paymentType);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

exports.initializeReservation = async (req, res) => {
  try {
    const { reservationId, userId } = req.body;
    const userObj = await db.user.findByPk(userId);
    const employee = await userObj.getEmployee();
    const waiter = await employee.getWaiter();
    await waiter.initializeReservation(reservationId);

    return res.send("OK");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};
