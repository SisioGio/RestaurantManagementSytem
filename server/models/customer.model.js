const db = require("./../models");

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
  const moment = require("moment");
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

  Customer.prototype.increasePoints = async function (increaseBy) {
    this.increment("points", { by: increaseBy });
    await this.save();
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

  Customer.prototype.updatePersonalInfo = async function (attributes) {
    const userObj = await this.getUser();
    await userObj.update({
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      phoneNo: attributes.phoneNo,
    });
  };

  Customer.prototype.addAddress = async function (attributes) {
    const { address } = require("./../models");
    const addressObj = await address.create(attributes);

    const userObj = await this.setAddress(addressObj);
  };

  Customer.prototype.updateAddress = async function (attributes) {
    const { address } = require("./../models");

    const addressObj = await this.getAddress();
    addressObj.update(attributes);

    await addressObj.save();
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
    const { orderItem, order, reservation } = require("./../models");
    // var reservationObj =  await reservation.findByPk(reservatoionId)
    // var orders = await reservation.getOrders()
    var reservationObj = await reservation.findByPk(reservatoionId);
    if (!reservation) {
      throw Error("Reservation not found");
    }
    var onsiteOrders = await reservationObj.getOnsiteOrders();
    for (const onsiteOrderObj of onsiteOrders) {
      var orderObj = await onsiteOrderObj.getOrder();

      await orderObj.destroy();
    }

    await reservation.destroy({ where: { id: reservatoionId } });

    // await orderItem.destroy({where:{orderId}})
  };

  // Customer creates online order (thid service provider handles the only payment by sending a transaction hash in the callback url)
  Customer.prototype.createOnlineOrder = async function (
    plannedDateTime,
    orderItems,
    transactionAmount,
    transactionHash
  ) {
    const { menuItem } = require("./../models");
    let transaction;
    try {
      transaction = await sequelize.transaction();

      if (moment().isAfter(plannedDateTime)) {
        throw Error("Cannot create reservation for past date");
      }
      if (!orderItems || orderItems.length === 0) {
        throw Error("Online order must have at least one menu item");
      }
      var totalAmount = 0;
      for (const item of orderItems) {
        const quantity = item.quantity;
        const menuItemObj = await menuItem.findByPk(item.menuItemId);
        if (!menuItemObj) {
          throw Error("No menu item was found");
        }
        const price = menuItemObj.price;
        const itemTotal = quantity * price;
        totalAmount += parseFloat(itemTotal);
      }

      if (parseFloat(totalAmount) !== parseFloat(transactionAmount)) {
        throw Error(
          `Transaction amount does not match order amount (${totalAmount})`
        );
      }

      const onlineOrderObj = await onlineOrderModel.createWithAbstractClass(
        this.id,
        plannedDateTime,
        orderItems
      );

      await this.payOnlineOrder(
        onlineOrderObj,

        transactionAmount,
        transactionHash
      );
      await this.increasePoints(1);

      await transaction.commit();
      return onlineOrderObj;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw Error(err.message);
    }
  };

  // Customer pays online order
  Customer.prototype.payOnlineOrder = async function (
    onlineOrderObj,
    transactionAmount,
    transactionHash
  ) {
    const onlinePaymentObj = await onlinePaymentModel.create({
      totalAmount: transactionAmount,
      transactionHash: transactionHash,
      onlineOrderId: onlineOrderObj.id,
      customerId: this.id,
    });

    await onlineOrderObj.save();
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
