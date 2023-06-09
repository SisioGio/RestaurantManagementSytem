module.exports = (
  sequelize,
  Sequelize,
  orderModel,
  menuItemModel,
  orderItemModel
) => {
  const Reservation = sequelize.define(
    "reservation",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numberOfPeople: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["NEW", "PROCESSING", "COMPLETED", "CANCELED"],
        defaultValue: "NEW",
      },
      comment: {
        type: Sequelize.STRING,
      },
    },
    {}
  );
  // Calculates reservation total amount for the bill generation
  Reservation.prototype.getTotalAmount = async function () {
    const onsiteOrders = await this.getOnsiteOrders({
      include: [
        {
          model: orderModel,
          include: [{ model: orderItemModel, include: menuItemModel }],
        },
      ],
    });
    console.log(JSON.stringify(onsiteOrders));
    var totalAmount = 0;
    onsiteOrders.every((order) => {
      order.order.orderItems.every((orderItem) => {
        totalAmount += orderItem.quantity * orderItem.menuItem.price;
      });
    });
    return totalAmount;
  };

  return Reservation;
};
