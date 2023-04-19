const db = require("../models");
const Company = db.company;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
// Create and Save a new company
exports.create = async (req, res) => {
  var newCompany;
  try {
    const result = await sequelize.transaction(async (t) => {
      let payLoad = req.body;
      delete payLoad.id;
      delete payLoad.addressId;
      delete payLoad.companyId;

      // if (!payLoad.userId) {
      //   throw new Error("User id is required!");
      // }
      let newAddress = await db.address.create(req.body, { transaction: t });
      let newCompany = await Company.create(req.body, { transaction: t });

      await newCompany.setAddress(newAddress, { transaction: t });
      // await newAddress.save({ transaction: t });
      return res.send(newCompany);
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the company.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Company.findAll({ include: db.address })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companys.",
      });
    });
};

exports.findCompanyProducts = async (req, res) => {
  // Validate request
  try {
    let company = await Company.findByPk(req.params.companyId);
    let products = await company.getProducts({
      include: [db.company, db.taxCode],
    });
    res.send(products);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving companys.",
    });
  }
};
exports.findUserCompanies = (req, res) => {
  const userId = req.params.userId;
  // Validate request
  Company.findAll({
    where: { userId: userId },
    include: [{ model: db.address }, { model: db.vendor, as: "vendors" }],
  })
    .then((data) => {
      var output = [];
      // data.forEach((company) => {
      //   output.push({
      //     id: company.id,
      //     name: company.name,
      //     vatNo: company.vatNo,
      //     walletAddress: company.walletAddress,
      //     email: company.email,
      //     userId: company.userId,
      //     addressId: company.address.id,
      //     country: company.address.country,
      //     region: company.address.region,
      //     city: company.address.city,
      //     postcode: company.address.postcode,
      //     street: company.address.street,
      //     streetNo: company.address.streetNo,
      //     companyId: company.address.companyId,
      //   });
      // });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving companys.",
      });
    });
};
// Update a company by the id in the request form
exports.update = async (req, res) => {
  const id = req.body.id;
  const addressId = req.body.addressId;

  try {
    const result = await sequelize.transaction(async (t) => {
      let company = await Company.update(req.body, {
        where: { id: id },
        transaction: t,
      });
      let address = await db.address.update(req.body, {
        where: { id: addressId },
        transaction: t,
      });
    });
    return res.send();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error updating company with id=" + id,
    });
  }
};
// Delete a Company with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Company.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Company was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Company with id=${id}. Maybe Company was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Company with id=" + id,
      });
    });
};

// Get Company  Purchase Invoices
exports.getPurchaseOrders = async (req, res) => {
  const id = req.params.id;
  try {
    let purchaseOrders = await db.purchaseOrders.findAll({
      where: { CustomerID: id },
    });
    return res.send(purchaseOrders);
  } catch (err) {
    res.status(500).send({
      message: "Error getting purchase orders",
    });
  }
};
// Get Company Sales Invoices

// Get Company Purchase Orders

// Get Company Sales Orders

// Get Company Products

// Get Company Transactions

// Get Company

// Delete all company from the database.
exports.deleteAll = (req, res) => {
  Company.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} company were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all company.",
      });
    });
};
