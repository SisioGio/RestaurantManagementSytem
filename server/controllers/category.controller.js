const db = require("../models");
const Category = db.category;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  // Validate request
  try {
    const rawData = await Category.findAll();
    var outputData = [];
    for (var cat of rawData) {
      outputData.push(cat.name);
    }
    res.send(outputData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Addresss.",
    });
  }
};
exports.create = async (req, res) => {
  // Validate request
  try {
    const [data, created] = await Category.findOrCreate({
      where: {
        name: req.params.name,
      },
    });
    var outputData = [];
    for (var cat of await Category.findAll()) {
      outputData.push(cat.name);
    }
    res.send(outputData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating category.",
    });
  }
};
