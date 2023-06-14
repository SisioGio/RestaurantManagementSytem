const cron = require("node-cron");
const { Op } = require("sequelize");
const { sendEmail } = require("./mail");
const reservationDeletionNotification = require("./templates/reservationDeletion");
const reservationNotConfirmed = require("./templates/reservationReminder");
const reservationReminder = require("./templates/reservationReminder");
function scheduleJobs(db) {
  // DAILY: 0 0 12 * * *
  // HOURLY : 0 0 * * * *
  // MINUTELY: * * * * * *
  // SECONDS: */1 * * * * *

  // Check inventory levels
  cron.schedule("0 0 12 * * *", async () => {
    try {
      const inventories = await db.inventory.findAll({
        where: {
          quantity: {
            [Op.lt]: db.sequelize.col("notifyAt"),
          },
        },
      });

      if (inventories.length > 0) {
        const inventoryNotification = require("./templates/inventory");

        sendEmail(
          "alessiogiovannini23@gmail.com",
          "WARNGIN! Inventory items below the minimum level",
          inventoryNotification(inventories)
        );
      }
      console.log(inventories.length);
    } catch (err) {
      console.log(err);
    }
  });

  // Check old reservations not confirmed
  cron.schedule("0 0 12 * * *", async () => {
    try {
      const reservations = await db.reservation.findAll({
        where: {
          status: "NEW",
          date: {
            [Op.lt]: new Date(),
          },
        },
      });

      if (reservations.length > 0) {
        var subject = "Important: Deleted Reservations Notification";
        var to = "alessio.giovannini23@gmail.com";
        var body = reservationDeletionNotification(reservations);

        sendEmail(to, subject, body);
        for (const reservation of reservations) {
          await db.reservation.deleteReservation(reservation.id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Send reminder to waiter when reservation is not confirmed at the latest two days before the reservation

  cron.schedule("0 0 * * * *", async () => {
    try {
      const today = new Date();

      const endDate = new Date(today.getTime() + 72 * 60 * 60 * 1000);

      const reservations = await db.reservation.findAll({
        where: {
          status: "NEW",
          date: {
            [Op.between]: [today, endDate],
          },
        },
      });

      if (reservations.length > 0) {
        const waiters = await db.waiter.findAll({
          include: { model: db.employee, include: db.user },
        });

        const emailAddresses = waiters
          .map((waiter) => waiter.employee.user.email)
          .join(",");

        console.log(emailAddresses);
        var subject = "Important: Reservation must be confirmed!";

        var to = emailAddresses;
        var body = reservationNotConfirmed(reservations);

        sendEmail(to, subject, body);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Send reminder customer about the reservation

  cron.schedule("0 0 * * * *", async () => {
    try {
      const today = new Date();

      const endDate = new Date(today.getTime() + 72 * 60 * 60 * 1000);

      const reservations = await db.reservation.findAll({
        where: {
          status: "CONFIRMED",
          date: {
            [Op.between]: [today, endDate],
          },
        },
      });

      if (reservations.length > 0) {
        var subject = "Reservation Reminder";
        for (const reservation of reservations) {
          var customer = await reservation.getCustomer({ include: db.user });

          var to = customer.dataValues.user.dataValues.email;
          var body = reservationReminder(reservation);

          sendEmail(to, subject, body);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = {
  scheduleJobs,
};
