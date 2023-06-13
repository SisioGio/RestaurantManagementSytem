module.exports = (sequelize, Sequelize) => {
  const OnsiteOrder = sequelize.define(
    "onsiteOrder",
    {
      status: {
        type: Sequelize.ENUM,
        values: ["NEW", "PREORDER", "IN_PROGRESS", "COMPLETED"],
        defaultValue: "NEW",
      },
    },
    {
      paranoid: true,
    }
  );
  // Create onsite order with Order class as super class
  OnsiteOrder.createWithAbstractClass = async function (attributes) {
    const { order } = require("./../models");
    var waiterId = attributes.waiterId;
    var reservationId = attributes.reservationId;
    var orderItems = attributes.orderItems;
    var status = attributes.status;
    const superObj = await order.create({});
    const onsiteOrder = await OnsiteOrder.create({
      waiterId: waiterId,
      reservationId: reservationId,
      status: status,
    });
    let transaction;
    try {
      transaction = await sequelize.transaction();

      await onsiteOrder.setOrder(superObj, { transaction });

      // Add items if any
      if (Array.isArray(orderItems)) {
        await superObj.addItemsToOrder(orderItems, transaction);
      }
      await transaction.commit();
      return onsiteOrder;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new Error(err.message);
    }
  };

  return OnsiteOrder;
};
