const db = require("../models");
const Size = db.size;
const Op = db.Sequelize.Op;

// Create and Save a new Size
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  let sizeName = req.body.name.toUpperCase();
  console.log(sizeName);
  // Save Size in the database
  try {
    let [size, createdAt] = await Size.findOrCreate({
      where: { name: sizeName },
    });
    console.log("test");
    return res.send(size);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Size.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Size.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Sizes.",
      });
    });
};
// Update a Size by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Size.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Size was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Size with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Size with id=" + id,
      });
    });
};

// Delete a Cart with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Size.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Size was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Size with id=${id}. Maybe Size was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Size with id=" + id,
      });
    });
};

// Delete all Size from the database.
exports.deleteAll = (req, res) => {
  Size.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Size were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Size.",
      });
    });
};
