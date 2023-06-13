module.exports = (sequelize, Sequelize) => {
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
  // Create online order with class 'Order' as super class
  OnlineOrder.createWithAbstractClass = async function (
    customerId,
    plannedDateTime,
    orderItems
  ) {
    const { order } = require("./../models");
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const superObj = await order.create({}, { transaction });

      const onlineOrder = await OnlineOrder.create(
        {
          customerId: customerId,
          plannedDateTime: plannedDateTime,
        },
        { transaction }
      );

      await onlineOrder.setOrder(superObj, { transaction });

      if (Array.isArray(orderItems)) {
        await superObj.addItemsToOrder(orderItems, transaction);
      }
      await transaction.commit();

      return onlineOrder;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }

      throw Error(err.message);
    }
  };

  return OnlineOrder;
};
