const { coupon } = require("../models");
const db = require("../models");
const Coupon = db.coupon;
const Op = db.Sequelize.Op;
const randomstring = require("randomstring");
// Create and Save a new Coupon
exports.create = (req, res) => {
  const validTo = req.body.validTo;
  const validFrom = req.body.validFrom;
  const amount = req.body.amount;
  const code = "COUPON-" + randomstring.generate({ length: 10 });
  Coupon.create({
    validTo: validTo,
    validFrom: validFrom,
    amount: amount,
    code: code,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Coupon.",
      });
    });
};

exports.verifyCoupon = async (req, res) => {
  const couponCode = req.params.code;

  const coupon = await Coupon.findOne({ where: { code: couponCode } });

  if (!coupon) {
    return res.status(400).send({
      message: `Cannot find coupon with code=${couponCode}.`,
    });
  }

  if (coupon.validFrom > new Date()) {
    return res.status(400).send({
      message: `Coupon is valid starting from ${coupon.validFrom}.`,
    });
  }

  if (coupon.validTo < new Date()) {
    return res.status(400).send({
      message: `Coupon is expired.`,
    });
  }

  return res.send(coupon);
};

exports.findAll = (req, res) => {
  // Validate request
  Coupon.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Coupons.",
      });
    });
};
// Update a Coupon by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Coupon.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Coupon was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Coupon with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Coupon with id=" + id,
      });
    });
};

// Delete a Coupon with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Coupon.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Coupon was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Coupon with id=${id}. Maybe Coupon was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Coupon with id=" + id,
      });
    });
};

// Delete all Coupon from the database.
exports.deleteAll = (req, res) => {
  Coupon.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Coupon were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Coupon.",
      });
    });
};
