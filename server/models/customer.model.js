module.exports = (
  user,
  sequelize,
  Sequelize,
  reservationModel,
  onlineOrderModel,
  onlinePaymentModel,
  reviewModel
) => {
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

    const customer = await Customer.create({});

    await customer.setUser(userObj);

    // await customer.setUser(user);
    return customer;
  };

  Customer.prototype.makeReservation = async function (attributes) {
    attributes.customerId = this.id;

    const reservationObj = await reservationModel.create(attributes);
  };

  Customer.prototype.cancelReservation = async function (reservatoionId) {
    await reservationModel.destroy({ where: { id: reservatoionId } });
  };

  Customer.prototype.updateReservation = async function (
    reservationId,
    attributes
  ) {
    await reservationModel.update(attributes, { where: { id: reservationId } });
  };

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

  Customer.prototype.leaveReview = async function (stars, comment) {
    const reviewObj = await reviewModel.create({
      star: stars,
      comment: comment,
      customerId: this.id,
    });
  };
  return Customer;
};
