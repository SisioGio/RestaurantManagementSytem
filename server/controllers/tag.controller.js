const db = require("../models");
const Tag = db.tag;
const Op = db.Sequelize.Op;

exports.findAll = async (req, res) => {
  // Validate request
  try {
    const rawData = await Tag.findAll();
    var outputData = [];
    for (var tag of rawData) {
      outputData.push(tag.name);
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
    const [data, created] = await Tag.findOrCreate({
      where: {
        name: req.params.name,
      },
    });
    var outputData = [];
    for (var tag of await Tag.findAll()) {
      outputData.push(tag.name);
    }
    res.send(outputData);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating Tag.",
    });
  }
};
