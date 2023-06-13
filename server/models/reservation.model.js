const db = require("./../models");

module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define(
    "reservation",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numberOfPeople: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["NEW", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELED"],
        defaultValue: "NEW",
      },
      comment: {
        type: Sequelize.STRING,
      },
    },
    { paranoid: false }
  );

  Reservation.deleteReservation = async function (reservationId) {
    const reservation = await Reservation.findByPk(reservationId);
    await reservation.destroy();

    // await Reservation.destroy({ where: { id: reservationId } });
  };
  // Calculates reservation total amount for the bill generation
  Reservation.prototype.getTotalAmount = async function () {
    const { order, orderItem, menuItem, employee } = require("./../models");
    const onsiteOrders = await this.getOnsiteOrders({
      include: [
        {
          model: order,
          include: [{ model: orderItem, include: menuItem }],
        },
      ],
    });
    console.log(JSON.stringify(onsiteOrders));
    var totalAmount = 0;
    onsiteOrders.every((order) => {
      order.order.orderItems.every((orderItem) => {
        totalAmount += orderItem.quantity * orderItem.menuItem.price;
      });
    });
    return totalAmount;
  };

  Reservation.getAllReservations = async function () {
    const {
      slot,
      tableMdl,
      customer,
      user,
      onsiteOrder,
      orderItem,
      menuItem,
      inventory,
      ingredient,
      order,
      waiter,
      employee,
    } = require("./../models");
    return await Reservation.findAll({
      include: [
        slot,
        tableMdl,
        {
          model: onsiteOrder,
          include: [
            {
              model: order,
              include: {
                model: orderItem,
                include: {
                  model: menuItem,
                  include: { model: ingredient, include: inventory },
                },
              },
            },
            { model: waiter, include: { model: employee, include: user } },
          ],
        },
        { model: customer, include: user },
      ],
    });
  };

  Reservation.getReservationById = async function (reservationId) {
    const {
      slot,
      tableMdl,
      customer,
      user,
      onsiteOrder,
      orderItem,
      menuItem,
      inventory,
      ingredient,
      order,
      waiter,
      employee,
    } = require("./../models");
    return await Reservation.findByPk(reservationId, {
      include: [
        slot,
        tableMdl,
        {
          model: onsiteOrder,
          include: [
            {
              model: order,
              include: {
                model: orderItem,
                include: {
                  model: menuItem,
                  include: { model: ingredient, include: inventory },
                },
              },
            },
            { model: waiter, include: { model: employee, include: user } },
          ],
        },
        { model: customer, include: user },
      ],
    });
  };

  return Reservation;
};
