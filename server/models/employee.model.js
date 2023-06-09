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

  Employee.prototype.clockIn = async function () {
    console.log("Clocking in");
    const timeEntry = await timeTracker.create({
      activity: "IN",
    });
    timeEntry.setEmployee(this);
    console.log(this.id);
  };
  Employee.prototype.clockOut = async function () {
    console.log("Clocking out");
    const timeEntry = await timeTracker.create({
      activity: "OUT",
    });
    timeEntry.setEmployee(this);
  };
  return Employee;
};
