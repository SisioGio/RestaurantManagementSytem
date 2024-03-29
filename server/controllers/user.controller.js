const db = require("../models");
const jwt = require("jsonwebtoken");
const CustomerModel = db.customer;
const RefreshTokenModel = db.refreshToken;
const config = require("../config/auth.config");
const UserModel = db.user;

exports.isAuthenticated = async (req, res) => {
  return res.send({ message: "Token verified!" });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, surname, email, password, phoneNo } = req.body;

    if (!(name && surname && email && password && phoneNo)) {
      return res.status(400).send({ message: "All fields are mandatory" });
    }

    const user = await CustomerModel.createWithAbstractClass(
      name,
      surname,
      email.toLowerCase(),
      phoneNo,
      password
    );

    return res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check fiels
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    //  Check if customer exists
    const userObj = await UserModel.checkIfExists(email);

    if (!userObj) {
      return res
        .status(400)
        .send({ message: "You need to create an account first" });
    }
    // Check password
    if (!(await userObj.passwordIsCorrect(password))) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password",
      });
    }

    // Generate access token
    const accessToken = await userObj.generateAccessToken();
    //  Create refresh token

    let refreshToken = await RefreshTokenModel.createToken(userObj);

    // // Set access Token

    await userObj.update({ token: accessToken });
    // const customerObj = await userObj.getCustomer({ include: User });
    const customerObj = await userObj.getCustomer();
    var role = "";

    if (userObj.role === "EMPLOYEE") {
      var employeeObj = await userObj.getEmployee();
      role = employeeObj.role;
    } else {
      role = userObj.role;
    }
    return res.status(200).send({
      id: userObj.id,
      name: userObj.firstName,
      surname: userObj.lastName,
      email: userObj.email,
      phoneNo: userObj.phoneNo,
      role: role,
      accessToken: userObj.token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

// Retrieve schedule
exports.getSchedule = async (req, res) => {
  var { from, to } = req.params;
  return res.send(await db.user.showSchedule(from, to));
};

exports.getSlotsAvailabaility = async (req, res) => {
  return res.send(await db.slot.showTablesSchedule());
};
// // Verify if confirmation code exists
// exports.verifyUser = async (req, res) => {
//   const confirmationCode = req.params.confirmationCode;

//   const userToValidate = await User.findOne({
//     where: { confirmationCode: confirmationCode },
//   });

//   if (!userToValidate) {
//     return res.status(400).send({
//       message: `User with confirmation code ${confirmationCode} not found`,
//     });
//   }

//   userToValidate.status = "Active";
//   await userToValidate.save();
//   return res.send(userToValidate);
// };

// exports.getRefreshTokens = async (req, res) => {
//   return res.send(
//     await db.refreshToken.findAll({
//       where: { userId: req.params.idUser },
//       order: [["expiryDate", "DESC"]],
//     })
//   );
// };
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  console.log("Generating new access token");
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshTokenModel.findOne({
      where: { token: requestToken },
    });
    console.log("Refresh token received:", refreshToken.token);
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    console.log(
      `Refresh token exp date: ${refreshToken.expiryDate.toString()}`
    );
    console.log(
      `Expired? ${RefreshTokenModel.verifyExpiration(refreshToken).toString()}`
    );
    // Check if token is still valid
    if (RefreshTokenModel.verifyExpiration(refreshToken)) {
      // Token not valid
      RefreshTokenModel.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }
    // Token is valid
    // Get user
    const user = await UserModel.findByPk(refreshToken.userId);
    // Generate new access token
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    console.log("newAccessToken created ", newAccessToken);
    // Update user with new access token
    user.token = newAccessToken;
    await user.save();
    // Output access token + refresh token
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log("Error while generating refresh token");
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

// exports.getRoles = async (req, res) => {
//   const user = await User.findByPk(1);
//   let userRoles = await user.getRoles();
//   return res.send(userRoles);
// };

// exports.resetPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ where: { email: email } });

//   if (!user) {
//     return res.status(400).send({
//       message: `User with email ${email} not found`,
//     });
//   }

//   const confirmationCode = randomstring.generate({ length: 50 });
//   user.confirmationCode = confirmationCode;
//   await user.save();

//   sendResetPasswordEmail(user.firstname, user.email, confirmationCode);
// };

// // Configure gmail account to send emails
// const transport = nodemailer.createTransport({
//   service: "Gmail",

//   type: "SMTP",
//   host: "smtp.gmail.com",

//   auth: {
//     user: config.GMAIL_EMAIL,
//     pass: config.GMAIL_SECRET,
//   },
// });

// exports.sendConfirmationEmail = async (req, res) => {
//   const email = req.params.email;
//   if (!email) {
//     return res.status(400).send({
//       message: `Please provide an email address`,
//     });
//   }
//   const user = await User.findOne({ where: { email: email } });
//   if (!user) {
//     return res.status(400).send({
//       message: `User with email  ${email} not found`,
//     });
//   }
//   const confirmationCode = randomstring.generate({ length: 30 });
//   user.confirmationCode = confirmationCode;
//   await user.save();
//   sendAccountConfirmationEmail(user.firstname, user.email, confirmationCode);
//   return res.send();
// };
// // Send account confirmation email
// const sendAccountConfirmationEmail = (name, email, confirmationCode) => {
//   console.log({
//     user: config.GMAIL_EMAIL,
//     pass: config.GMAIL_SECRET,
//   });
//   transport
//     .sendMail({
//       from: config.GMAIL_EMAIL,
//       to: "juventuseth@gmail.com",
//       subject: "Action Required! Verify your account",
//       html: `<h1>Email Confirmation</h1>
//       <h2>Dear ${name},</h2>
//       <p>Please confirm your email by clicking on the below link</p>
//       <a href=${config.FRONTEND_LOCAL_HOST}/confirmation?code=${confirmationCode}> Click here</a>
//       </div>`,
//     })
//     .catch((err) => {
//       console.log(err);
//       throw new Error(err);
//     });
// };
// // Update user password
// exports.updatePassword = async (req, res) => {
//   const newPassword = req.body.password;
//   const resetPasswordCode = req.body.resetPasswordCode;
//   const encryptedPassword = await bcrypt.hash(newPassword, 10);

//   const user = await User.findOne({
//     where: { confirmationCode: resetPasswordCode },
//   });
//   if (!user) {
//     return res.status(400).send({
//       message: `No user was found with code ${resetPasswordCode}`,
//     });
//   }

//   user.password = encryptedPassword;
//   await user.save();

//   return res.send(user);
// };

// // Verify if reset password code is valid
// exports.verifyResetPasswordCode = async (req, res) => {
//   const confirmationCode = req.body.confirmationCode;
//   const user = await User.findOne({
//     where: { confirmationCode: confirmationCode },
//   });
//   if (!user) {
//     return res.status(400).send({
//       message: `User with confirmation code ${confirmationCode} not found`,
//     });
//   }
//   return res.send(user);
// };

// // Send email to reset password
// const sendResetPasswordEmail = (name, email, confirmationCode) => {
//   try {
//     transport.sendMail({
//       from: config.GMAIL_EMAIL,
//       to: "juventuseth@gmail.com",
//       subject: "Action Required! Reset your password",
//       html: `<h1>Password reset</h1>
//       <h2>Dear ${name},</h2>
//       <p>Please click the below link to reset your password:</p>
//       <a href=${config.FRONTEND_LOCAL_HOST}/resetPassword?code=${confirmationCode}> Click here</a>
//       </div>`,
//     });
//     console.log("Reset email sent to " + email);
//   } catch (err) {
//     console.log(err);
//   }
// };

// // Retrieve all Users from the database.
// exports.findAll = async (req, res) => {
//   await User.findAll()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving Users.",
//       });
//     });
// };

// // Find a single User with an id
// exports.findOne = async (req, res) => {
//   const id = req.params.id;

//   await User.findByPk(id, { include: db.address })
//     .then((data) => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: `Cannot find User with id=${id}.`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving User with id=" + id,
//       });
//     });
// };

// // Update a User by the id in the request
// exports.update = async (req, res) => {
//   try {
//     const result = await sequelize.transaction(async (t) => {
//       const id = req.params.id;

//       const user = await User.findByPk(id, { transaction: t });
//       if (!user) {
//         res.status(400).send({
//           message: `User with id ${id} not found`,
//         });
//       }
//       const userRoles = await user.getRoles();
//       if (req.body.roles) {
//         const roles = await Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles,
//             },
//           },
//           transaction: t,
//         });

//         await user.setRoles(roles, { transaction: t });
//         await user.save({ transaction: t });
//       }

//       await User.update(req.body, {
//         where: { id: id },
//         transaction: t,
//       });
//       const ouputUser = await User.findOne({
//         where: { id: id },
//         include: db.role,
//         transaction: t,
//       });
//       return res.send(ouputUser);
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: "Error updating User",
//     });
//   }
// };
// // Uncomment for production
// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   User.destroy({
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "User was deleted successfully!",
//         });
//       } else {
//         res.send({
//           message: `Cannot delete User with id=${id}. Maybe User was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete User with id=" + id,
//       });
//     });
// };

// // Delete all Users from the database.
// exports.deleteAll = async (req, res) => {
//   await User.destroy({
//     where: {},
//     truncate: false,
//   })
//     .then((nums) => {
//       res.send({ message: `${nums} Users were deleted successfully!` });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all Users.",
//       });
//     });
// };
