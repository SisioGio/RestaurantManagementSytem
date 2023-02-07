const db = require("../models");
const Notification = db.notification;
const Op = db.Sequelize.Op;

exports.findAllByUserID = async (req, res) => {
  const userId = req.params.userId;
  await Notification.findAll({
    where: {
      userId: userId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Notifications.",
      });
    });
};
