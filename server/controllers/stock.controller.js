const { Console } = require("console");
const { accessSync } = require("fs");
const { sequelize, stock } = require("../models");
const db = require("../models");

const Stock = db.stock;
const Op = db.Sequelize.Op;
// Get all products + stock details such as quantity,size,images
exports.getCatalog = async (req, res) => {
  const data = await db.product.findAll({
    include: [
      {
        model: db.stock,
        include: db.size,
      },
      { model: db.image },
      { model: db.discount },
      { model: db.category },
      { model: db.tag },
    ],
  });
  return res.send(data);
};
// Create and Save a new Stock { product,size,quantity}
exports.create = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      // Check if product exists
      var product = await db.product.findByPk(req.body.productId, {
        transaction: t,
      });
      if (!product) {
        return res.status(400).send({
          message: "Product does not exist",
        });
      }

      var [size, createdAt] = await db.size.findOrCreate({
        where: { name: req.body.sizeName },
        transaction: t,
      });

      var stock = await db.stock.findOne({
        where: { sizeId: size.id, productId: product.id },
        transaction: t,
      });
      let output = [];
      if (stock) {
        stock.quantity = req.body.quantity;
        await stock.save({ transaction: t });
        // output = await db.product.findAll({
        //   include: [
        //     db.category,
        //     db.tag,
        //     db.image,
        //     { model: db.stock, include: db.size },
        //   ],
        //   transaction: t,
        // });
      } else {
        // Create a Stock
        stock = {
          quantity: req.body.quantity,
          productId: req.body.productId,
          sizeId: size.id,
        };

        // Save Stock in the database
        // var newStock = await Stock.create(stock, { transaction: t });
        var stock = Stock.build(
          {
            quantity: req.body.quantity,
            productId: req.body.productId,
            sizeId: size.id,
          },
          { transaction: t }
        );
        await stock.save({ transaction: t });
      }

      // output = await db.product.findAll({
      //   include: [
      //     db.category,
      //     db.tag,
      //     db.image,
      //     { model: db.stock, include: db.size },
      //   ],
      //   transaction: t,
      // });
      // await product.update({ stockId: newStock.id });
    });
    return res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Stock.",
    });
  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  Stock.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Stock was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Stock with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Stock with id=" + id,
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.idStock;

  Stock.findByPk(id, { include: db.product })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Stock with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

async function CheckQuantityAvailability(res, stockItemQuantity, quantity) {
  if (stockItemQuantity < quantity) {
    return false;
  }
}

async function GetStockItem(res, productId, sizeId) {
  try {
    const output = await Stock.findOne({
      where: { productId: productId, sizeId: sizeId },
      include: db.product,
    });
    if (!output) {
      return res.status(400).send({
        message: "Product not found",
      });
    }
    return output;
  } catch (e) {
    return res.status(500).send({
      message: e,
    });
  }
}

// Display all stocks
exports.findAll = (req, res) => {
  Stock.findAll({ include: [db.product, db.size] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Sizes.",
      });
    });
};

// Delete a Cart with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Stock.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Stock was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Stock with id=${id}. Maybe Stock was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Stock with id=" + id,
      });
    });
};

// Delete all Stock from the database.
exports.deleteAll = (req, res) => {
  Stock.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Stock were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Stock.",
      });
    });
};
