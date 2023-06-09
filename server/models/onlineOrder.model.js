module.exports = (superClass, sequelize, Sequelize) => {
  const OnlineOrder = sequelize.define(
    "onlineOrder",
    {
      plannedDateTime: {
        type: Sequelize.DATE,
      },
      pickedAt: {
        type: Sequelize.DATE,
      },
      deliveredAt: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          "NEW",
          "PAID",
          "IN_PROGRESS",
          "READY",
          "OUT FOR DELIVERY",
          "DELIVERED",
        ],
        defaultValue: "NEW",
      },
    },
    {}
  );

  OnlineOrder.createWithAbstractClass = async function (
    customerId,
    plannedDateTime,
    orderItems
  ) {
    const superObj = await superClass.create({});
    const onlineOrder = await OnlineOrder.create({
      customerId: customerId,
      plannedDateTime: plannedDateTime,
    });

    await onlineOrder.setOrder(superObj);

    if (Array.isArray(orderItems)) {
      await superObj.addItemsToOrder(orderItems);
    }
    return onlineOrder;
  };

  return OnlineOrder;
};
