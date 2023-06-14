module.exports = (superClass, sequelize, Sequelize, onlineOrderModel) => {
  const moment = require("moment");
  const Driver = sequelize.define(
    "driver",
    {},
    {
      // Other model options go here
    }
  );

  Driver.createWithAbstractClass = async function (
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

    const driver = await Driver.create({});

    await driver.setEmployee(employeeObj);

    return driver;
  };
  // Driver picks order and status changes to 'OUT FOR DELIVERY'
  Driver.prototype.pickUpOrder = async function (onlineOrderId) {
    var canPickMoreDeliveries = await this.canPickUpDelivery();
    if (!canPickMoreDeliveries) {
      throw new Error(
        "Driver reached the maximum number of 'OUT FOR DELIVERY' deliveries."
      );
    }
    const onlineOrderObj = await onlineOrderModel.findByPk(onlineOrderId);
    if (onlineOrderObj.status === "READY") {
      onlineOrderObj.status = "OUT FOR DELIVERY";
      onlineOrderObj.driverId = this.id;
      onlineOrderObj.pickedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      await onlineOrderObj.save();
    } else {
      console.log("Status of online order must be 'READY'");
    }
  };
  // Driver completes order and status changes to 'DELIVERED' ( )
  Driver.prototype.completeDelivery = async function (onlineOrderId) {
    const onlineOrderObj = await onlineOrderModel.findByPk(onlineOrderId);
    if (onlineOrderObj.status === "OUT FOR DELIVERY") {
      onlineOrderObj.status = "DELIVERED";
      const superOrderObj = await onlineOrderObj.getOrder();
      const orderItems = await superOrderObj.getOrderItems();
      for (const orderItem of orderItems) {
        orderItem.status = "COMPLETED";
        await orderItem.save();
      }
      await onlineOrderObj.save();
    } else {
      console.log("Status of online order must be 'READY'");
    }
  };
  // Checks whatever the current driver can pick additional deliveries
  Driver.prototype.canPickUpDelivery = async function () {
    const pendingDeliveries = await this.getOnlineOrders({
      where: { status: "OUT FOR DELIVERY" },
    });

    return pendingDeliveries.length <= 3;
  };

  return Driver;
};
