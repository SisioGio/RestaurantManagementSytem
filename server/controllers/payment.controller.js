const db = require("../models");
const Payment = db.payment;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");

// Not used
// Create and Save a new User
exports.create = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const amount = req.body.amount;
      const userId = req.body.userId;
      const cartId = req.body.cartId;
      const paymentMethodId = req.body.paymentMethodId;
      const type = req.body.type;
      const transactionHash = req.body.transactionHash;
      // Check if user exists

      const user = await db.user.findByPk(userId);
      if (!user) {
        return res.status(500).send({
          message: "User does not exist",
        });
      }

      // Check if cart exists

      var cart = await db.cart.findByPk(cartId);
      if (!cart) {
        return res.status(500).send({
          message: "Cart does not exist",
        });
      }

      // Check if payment method exists
      console.log(!paymentMethod && !transactionHash);
      console.log(transactionHash);
      var paymentMethod = await db.paymentMethod.findByPk(paymentMethodId);
      if (!paymentMethod && !transactionHash) {
        return res.status(500).send({
          message: "paymentMethod does not exist",
        });
      }
      // Check if payment method is assigned to the purchaser user
      if (paymentMethod.userId != userId) {
        return res.status(500).send({
          message:
            "Nice try! The payment method is not assigned to the specified user. Get a job",
        });
      }

      // Check if payment has been already done
      var payment = await Payment.findOne({
        where: {
          userId: userId,
          cartId: cartId,
          amount: amount,
          type: type,
          transactionHash: transactionHash,
        },
      });

      if (payment) {
        return res.send(payment);
      }
      // Create a payment
      payment = {
        amount: amount,
        cartId: cartId,
        userId: userId,
        paymentMethodId: paymentMethodId,
        type: type,
        transactionHash: transactionHash,
      };

      // Save User in the database
      await db.payment.create(payment);

      return res.send(payment);
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving Orders.",
    });
  }
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  Payment.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Payment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Payments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
