const db = require("../models");
const Ticket = db.ticket;
const Op = db.Sequelize.Op;
const { sequelize, stock } = require("../models");
// Add ticket message
exports.addMessage = async (req, res) => {
  let messageObject = null;
  try {
    const result = await sequelize.transaction(async (t) => {
      var ticketId = req.body.ticketId;
      const userId = req.body.userId;
      const message = req.body.message;
      const subject = req.body.subject;

      // Validate input - If new ticket, a subject must be provided
      if (!ticketId && !subject) {
        return res
          .status(400)
          .send({ message: "New ticket must have a subject" });
      }
      // Validate input - If ticket exists, userId and message must be provided
      if (!userId && !message && ticketId) {
        return res
          .status(400)
          .send({ message: "UserID and message are required" });
      }
      // Create ticket is no ticketID was provided
      if (!ticketId) {
        const [ticket, created] = await Ticket.findOrCreate({
          where: {
            subject: subject,
            userId: userId,
          },
          transaction: t,
        });
        ticketId = ticket.id;
      }
      // Create a new message object
      messageObject = await db.message.create(
        {
          message: message,
          userId: userId,
          ticketId: ticketId,
        },
        { transaction: t }
      );
    });
    return res.send();
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ticket message.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const tickets = await db.ticket.findAll(
        {
          include: [{ model: db.message, include: [db.user] }],
        },
        { transaction: t }
      );

      return res.send(tickets);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Tickets.",
    });
  }
};
// Update a Ticket by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Ticket.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Ticket was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Ticket with id=${id}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Ticket with id=" + id,
      });
    });
};

// Delete a Ticket with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Ticket.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Ticket was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Ticket with id=${id}. Maybe Ticket was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Ticket with id=" + id,
      });
    });
};

// Delete all Ticket from the database.
exports.deleteAll = (req, res) => {
  Ticket.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Ticket were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Ticket.",
      });
    });
};

exports.closeTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      res.status(400).send({
        message: `Ticket with ID ${ticketId} not found`,
      });
    }

    ticket.status = "Closed";
    await ticket.save();

    return res.send("Ticket updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while closing the ticket ",
    });
  }
};
