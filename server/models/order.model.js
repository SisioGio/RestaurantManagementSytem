module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      // Model attributes are defined here

      type: {
        type: Sequelize.ENUM,
        values: ["ONLINE", "ONSITE"],
      },
    },
    { paranoid: false }
  );
  // Add items to order
  Order.prototype.addItemsToOrder = async function (listOfItems, transaction) {
    // Method to add items to the order
    const { orderItem, menuItem } = require("./../models");

    for (const item of listOfItems) {
      var checkMenuItem = await menuItem.findOne({
        where: { id: item.menuItemId },
        transaction,
      });
      if (checkMenuItem === null) {
        throw Error("No menu item was found");
      }
      if (item.quantity <= 0 || item.quantity > 30) {
        throw Error("Menu item quantity must be between 1 and 30 (incl)");
      }
      await orderItem.create(
        {
          orderId: this.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        },
        { transaction }
      );
    }
  };
  Order.prototype.getChild = async function () {
    if (this.type === "ONLINE") {
      return this.getOnlineOrder();
    } else {
      return this.getOnsiteOrder();
    }
  };
  // Checks whatever each of the assigned orderItems has status 'SERVED' or 'CANCELED'
  // If the above condition is true, then the status of the order changes to 'COMPLETED'

  Order.prototype.checkIfCompleted = async function () {
    const orderItems = await this.getOrderItems();

    isCompleted = true;
    var childOrder;
    if (this.type === "ONSITE") {
      childOrder = await this.getOnsiteOrder();
      var isCompleted = orderItems.every((orderItem) => {
        return (
          orderItem.status === "COMPLETED" || orderItem.status === "CANCELED"
        );
      });

      if (isCompleted) {
        childOrder.status = "COMPLETED";
        await childOrder.save();
      }
    } else if (this.type === "ONLINE") {
      childOrder = await this.getOnlineOrder();
      console.log(childOrder);
      var isReadyToBeDelivered = orderItems.every((orderItem) => {
        return orderItem.status === "READY" || orderItem.status === "CANCELED";
      });

      if (isReadyToBeDelivered) {
        childOrder.status = "READY";
        await childOrder.save();
      }
      console.log(
        "Order  isReadyToBeDelivered? ",
        isReadyToBeDelivered.toString()
      );
    }
  };

  return Order;
};
