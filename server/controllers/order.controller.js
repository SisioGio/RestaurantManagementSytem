const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const { sequelize, stock, payment } = require("../models");

// Set order as paid as soon as the payment is completed, it returns the order details
exports.confirmOrder = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      // Get order
      let order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: db.orderProduct,
            include: [
              {
                model: db.stock,
                include: [
                  { model: db.size },
                  { model: db.product, include: db.image },
                ],
              },
            ],
          },
        ],
      });
      // Set paid  = true
      order.paid = true;
      await order.save();
      return res.send(order);
    });
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ticket message.",
    });
  }
};
// Retrieve all Orders from the database.
exports.findAll = (req, res) => {
  Order.findAll({
    include: [
      { model: db.user },
      { model: db.address },
      {
        model: db.orderProduct,
        include: [
          {
            model: db.stock,
            include: [
              { model: db.size },
              { model: db.product, include: [db.image] },
            ],
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Orders.",
      });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Order.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Order with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Order with id=" + id,
      });
    });
};

// Update a Order by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const published = req.body.published;
  console.log(published);
  console.log(req.body);
  Order.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Order with id=" + id,
      });
    });
};

// Delete a Order with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  await Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id,
      });
    });
};

// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Orders were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Orders.",
      });
    });
};
