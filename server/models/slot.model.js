const { Op } = require("sequelize");
const db = require(".");
const moment = require("moment");
module.exports = (sequelize, Sequelize, tableModel, reservationModel) => {
  const Slot = sequelize.define(
    "slot",
    {
      start: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    },
    {}
  );
  const getDatesBetween = (from, to) => {
    var dates = [];
    var current = moment(from, "YYYY-MM-DD");
    var last = moment(to, "YYYY-MM-DD");

    while (current.isBefore(last) || current.isSame(last)) {
      dates.push(moment(current));
      current = current.add(1, "days");
    }

    console.log(dates);
    return dates;
  };
  Slot.showTablesSchedule = async function (from, to, noOfPeople) {
    var threshold = 1;
    if (!noOfPeople) {
      noOfPeople = 0;
      threshold = 1000;
    }
    dateFilters = {};
    if (from && to) {
      dateFilters.date = {
        [Op.between]: [moment(from, "yyyy-MM-DD"), moment(to, "yyyy-MM-DD")],
      };
    }

    const tables = await tableModel.findAll();
    const reservations = await reservationModel.findAll({ dateFilters });
    const slots = await Slot.findAll();
    console.log(noOfPeople);
    const dates = getDatesBetween(from, to);
    var output = [];
    for (const date of dates) {
      console.log(date);
      var slotsArr = [];
      var dateAvailable = false;
      for (const slot of slots) {
        var tablesArr = [];
        var slotAvailable = false;
        for (const table of tables) {
          var canTableBeReserved = false;
          var reservationIndex = reservations.findIndex((reservation) => {
            var reservationDate = moment(
              reservation.date,
              "YYYY-MM-DD"
            ).startOf("day");
            var currentDate = moment(date, "YYYY-MM-DD").startOf("day");
            var dateCheck = reservationDate.isSame(currentDate);
            var slotCheck = reservation.slotId === slot.id;
            var tableCheck = reservation.tableId === table.id;
            return dateCheck && slotCheck && tableCheck;
          });
          canTableBeReserved =
            reservationIndex === -1 && table.capacity - noOfPeople <= threshold;
          if (canTableBeReserved) {
            slotAvailable = true;
          }

          tablesArr.push({
            id: table.id,
            capacity: table.capacity,
            available: canTableBeReserved,
          });
        }
        if (slotAvailable) {
          dateAvailable = true;
        }
        // slot.tables = tablesArr;
        slotsArr.push({
          id: slot.id,
          start: slot.start,
          end: slot.end,
          available: slotAvailable,
          tables: tablesArr,
        });
      }
      output.push({
        date: date,
        available: dateAvailable,
        slots: slotsArr,
      });
    }
    return output;
  };

  return Slot;
};
