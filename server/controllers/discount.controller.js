const db = require("../models");
const Discount = db.Discount;
const Op = db.Sequelize.Op;

// Create and Save a new Discount
exports.create = (req, res) => {
  // Save Discount in the database

  Discount.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Discount.",
      });
    });
};

exports.findAll = (req, res) => {
  // Validate request
  Discount.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Discounts.",
      });
    });
};
// Update a Discount by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Discount.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Discount was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Discount with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Discount with id=" + id,
      });
    });
};

// Delete a Discount with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Discount.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Discount was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Discount with id=${id}. Maybe Discount was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Discount with id=" + id,
      });
    });
};

// Delete all Discount from the database.
exports.deleteAll = (req, res) => {
  Discount.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Discount were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Discount.",
      });
    });
};
