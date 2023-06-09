module.exports = (
  superClass,
  sequelize,
  Sequelize,
  onsiteOrderModel,
  orderItemModel,
  reservationModel,
  billModel
) => {
  const Waiter = sequelize.define(
    "waiter",
    {},
    {
      // Other model options go here
    }
  );
  // Create with class 'Employee' as super class ( User super class is then created for class Employee)
  Waiter.createWithAbstractClass = async function (
    firsTname,
    lastName,
    email,
    phoneNo,
    password,
    salary
  ) {
    const employeeObj = await superClass.createWithAbstractClass(
      firsTname,
      lastName,
      email,
      phoneNo,
      password,
      salary
    );

    const waiter = await Waiter.create({});

    await waiter.setEmployee(employeeObj);

    return waiter;
  };
  // Creates on site order when customer arrives
  Waiter.prototype.createOnSiteOrder = async function (
    reservationId,
    orderItems
  ) {
    console.log(orderItems);

    const onSiteOrderObj = await onsiteOrderModel.createWithAbstractClass(
      this.id,
      reservationId,
      orderItems
    );

    return onSiteOrderObj;
  };
  // Removes order item
  Waiter.prototype.removeItemFromOrder = async function (orderId, menuItemId) {
    const orderItemObj = await orderItemModel.findOne({
      where: { orderId: orderId, menuItemId: menuItemId },
    });
    if (orderItemObj.status === "NEW") {
      orderItemObj.status = "CANCELED";
      await orderItemObj.save();
    }
  };
  // Updates order item
  Waiter.prototype.updateOrderItemQuantity = async function (
    orderId,
    menuItemId,
    quantity
  ) {
    const orderItemObj = await orderItemModel.findOne({
      where: { orderId: orderId, menuItemId: menuItemId },
    });
    console.log(orderItemObj);
    if (orderItemObj.status === "NEW") {
      orderItemObj.quantity = quantity;
      orderItemObj.save();
    }
  };
  // Marks order item as 'COMPLETED' ( when it's served)

  Waiter.prototype.serveOrderItem = async function (orderItemId) {
    const orderItemObj = await orderItemModel.findByPk(orderItemId);
    const orderObj = await orderItemObj.getOrder();
    if (orderObj.type === "ONSITE") {
      if (orderItemObj.status === "READY") {
        orderItemObj.status = "COMPLETED";
        await orderItemObj.save();
        const superOrderObj = await orderItemObj.getOrder();

        superOrderObj.checkIfCompleted();
      } else {
        console.log(
          "Cannot update order item with status '",
          orderItemObj.status,
          "'"
        );
      }
    } else {
      console.log("Online orders cannot be served!");
    }
  };
  // Generates bill
  Waiter.prototype.generateBill = async function (reservationId, paymentType) {
    const reservationObj = await reservationModel.findByPk(reservationId);

    const totalAmount = await reservationObj.getTotalAmount();
    await billModel.create({
      reservationId: reservationId,
      waiterId: this.id,
      totalAmount: totalAmount,
      paymentType: paymentType,
    });
  };

  return Waiter;
};