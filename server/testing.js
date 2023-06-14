const { literal, fn } = require("sequelize");
const server = require("./server");
const db = server.db;

const testing = async () => {
  const order = await db.order.findByPk(2, {
    include: { model: db.orderItem, include: db.menuItem },
  });

  const orderTotal = order.orderItems.reduce((total, orderItem) => {
    const productTotal = orderItem.quantity * orderItem.menuItem.price;
    return total + productTotal;
  }, 0);

  console.log(orderTotal);
};

testing();
