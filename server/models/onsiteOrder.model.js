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
    await onsiteOrder.setOrder(superObj);

    // Add items if any
    if (Array.isArray(orderItems)) {
      await superObj.addItemsToOrder(orderItems);
    }

    return onsiteOrder;
  };

  return OnsiteOrder;
};
