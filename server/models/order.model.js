module.exports = (sequelize, Sequelize, orderItemModel) => {
  const Order = sequelize.define(
    "order",
    {
      // Model attributes are defined here

      type: {
        type: Sequelize.ENUM,
        values: ["ONLINE", "ONSITE"],
      },
    },
    {}
  );
  // Add items to order
  Order.prototype.addItemsToOrder = async function (listOfItems) {
    // Method to add items to the order
    for (const item of listOfItems) {
      await orderItemModel.create({
        orderId: this.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      });
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

      console.log("Order is completed? ", isCompleted.toString());
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
