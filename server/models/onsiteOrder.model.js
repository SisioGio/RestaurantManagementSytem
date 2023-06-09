module.exports = (superClass, sequelize, Sequelize, orderItem) => {
  const OnsiteOrder = sequelize.define(
    "onsiteOrder",
    {
      status: {
        type: Sequelize.ENUM,
        values: ["NEW", "IN_PROGRESS", "COMPLETED"],
        defaultValue: "NEW",
      },
    },
    {}
  );
  // Create onsite order with Order class as super class
  OnsiteOrder.createWithAbstractClass = async function (
    waiterId,
    reservationId,
    orderItems
  ) {
    const superObj = await superClass.create({});
    const onsiteOrder = await OnsiteOrder.create({
      waiterId: waiterId,
      reservationId: reservationId,
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
