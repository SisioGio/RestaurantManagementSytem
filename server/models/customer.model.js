module.exports = (
  user,
  sequelize,
  reservationModel,
  onlineOrderModel,
  onlinePaymentModel,
  reviewModel,

  slot,
  onsiteOrderModel
) => {
  const Sequelize = require("sequelize");
  var bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const config = require("../config/auth.config");
  const Customer = sequelize.define(
    "customer",
    {
      points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        // allowNull defaults to true
      },
    },
    {
      // Other model options go here
    }
  );

  Customer.prototype.increasePoints = function () {
    this.points += 1;
    console.log("Customer points increased by one! New points " + this.points);
  };
  // Create customer object using User model as super class
  Customer.createWithAbstractClass = async function (
    firsTname,
    lastName,
    email,
    phoneNo,
    password
  ) {
    encryptedPassword = await bcrypt.hash(password, 10);
    const userObj = await user.create({
      firstName: firsTname,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo,
      password: encryptedPassword,
    });
    // Create customer object
    const customer = await Customer.create({});
    //Associate user to the created customer
    await customer.setUser(userObj);

    // await customer.setUser(user);
    return customer;
  };

  Customer.prototype.getOwnReservations = async function () {
    const reservations = await this.getReservations({ include: slot });
    return reservations;
  };
  // Customer creates reservation
  Customer.prototype.makeReservation = async function (attributes) {
    const customerId = this.id;
    const tableId = attributes.tableId;
    const slotId = attributes.slotId;
    const date = attributes.date;
    const noOfPeople = attributes.noOfPeople;
    const comment = attributes.comment;
    const reservationObj = await reservationModel.create({
      date: date,
      numberOfPeople: noOfPeople,
      comment: comment,
      customerId: customerId,
      tableId: tableId,
      slotId: slotId,
    });
    if (attributes.menuItems) {
      await onsiteOrderModel.createWithAbstractClass({
        reservationId: reservationObj.id,
        orderItems: attributes.menuItems,
        status: "PREORDER",
      });
    }

    return reservationObj;
  };
  // Customer deletes reservation
  Customer.prototype.cancelReservation = async function (reservatoionId) {
    await reservationModel.destroy({ where: { id: reservatoionId } });
  };
  // CUstomer updates reservation
  Customer.prototype.updateReservation = async function (
    reservationId,
    attributes
  ) {
    await reservationModel.update(attributes, { where: { id: reservationId } });
  };
  // Customer creates online order
  Customer.prototype.createOnlineOrder = async function (
    plannedDateTime,
    orderItems
  ) {
    const onlineOrderObj = await onlineOrderModel.createWithAbstractClass(
      this.id,
      plannedDateTime,
      orderItems
    );

    return onlineOrderObj;
  };
  // Customer pays online order
  Customer.prototype.payOnlineOrder = async function (
    onlineOrderId,
    transactionAmount,
    transactionHash
  ) {
    const onlineOrderObj = await onlineOrderModel.findByPk(onlineOrderId);
    const onlinePaymentObj = await onlinePaymentModel.create({
      totalAmount: transactionAmount,
      transactionHash: transactionHash,
      onlineOrderId: onlineOrderObj.id,
      customerId: this.id,
    });
    onlineOrderObj.status = "PAID";
  };
  // Customer leaves review
  Customer.prototype.leaveReview = async function (stars, comment) {
    const reviewObj = await reviewModel.create({
      star: stars,
      comment: comment,
      customerId: this.id,
    });
  };
  return Customer;
};
