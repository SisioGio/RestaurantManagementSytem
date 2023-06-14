module.exports = (superClass, sequelize, Sequelize, timeTracker) => {
  var bcrypt = require("bcryptjs");
  const Employee = sequelize.define(
    "employee",
    {
      salary: {
        type: Sequelize.DOUBLE(10, 2),
      },

      role: {
        type: Sequelize.ENUM,
        values: ["WAITER", "CHEF", "DRIVER", "OWNER"],
      },
    },
    {
      // Other model options go here
    }
  );

  Employee.discountPercentage = 0.1;
  // Create employee with abstract class 'User' as super class
  Employee.createWithAbstractClass = async function (
    firstName,
    lastName,
    email,
    phoneNo,
    password,
    salary
  ) {
    encryptedPassword = await bcrypt.hash(password, 10);
    const userObj = await superClass.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo,
      password: encryptedPassword,
    });

    const employee = await Employee.create({ salary: salary });

    await employee.setUser(userObj);

    return employee;
  };
  // Employee starts shifts
  Employee.prototype.clockIn = async function () {
    const timeEntry = await timeTracker.create({
      activity: "IN",
    });
    timeEntry.setEmployee(this);
  };
  // Employee ends shift
  Employee.prototype.clockOut = async function () {
    console.log("Clocking out");
    const timeEntry = await timeTracker.create({
      activity: "OUT",
    });
    timeEntry.setEmployee(this);
  };

  Employee.getChild = async function (empId) {
    const employeeObj = await Employee.findByPk(empId);

    if (employeeObj.role === "WAITER") {
      return await employeeObj.getWaiter();
    }
    if (employeeObj.role === "DRIVER") {
      return await employeeObj.getDriver();
    }
    if (employeeObj.role === "CHEF") {
      return await employeeObj.getChef();
    }
    if (employeeObj.role === "OWNER") {
      return await employeeObj.getOwner();
    }
  };
  return Employee;
};
