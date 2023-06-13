const db = require("../models");

// Get menu items
exports.getItems = async (req, res) => {
  try {
    var items = await db.menuItem.getMenuItems();

    return res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
