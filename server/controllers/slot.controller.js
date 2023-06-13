const db = require("../models");

// Get tables availability
exports.getTablesAvailability = async (req, res) => {
  try {
    var { from, to, noOfPeople } = req.params;
    console.log(req.params);
    var schedule = await db.slot.showTablesSchedule(from, to, noOfPeople);

    return res.send(schedule);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
