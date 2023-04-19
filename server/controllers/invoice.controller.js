const db = require("../models");
const Invoice = db.invoice;
const Op = db.Sequelize.Op;
const { sequelize } = require("../models");
// createInvoice.js
const AWS = require("aws-sdk");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const randomstring = require("randomstring");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});
const saveFileToS3 = async (file) => {
  let fileLocation;
  // const filePath = file.path;
  console.log("Saving image to S3");
  // const fileContent = fs.readFileSync(filePath);
  const randomName = randomstring.generate({
    length: 30,
  });

  const params = {
    Bucket: "s21285",
    Key: `${randomName}${".pdf"}`,
    Body: file,
    contentType: "application/pdf",
  };

  try {
    let res = await s3.upload(params).promise();
    console.log("Saved succesfully!");
    return res.Location;
  } catch (err) {
    console.log("Error while saving to S3");
    console.log(err);
  }
};
function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(30, y).lineTo(550, y).stroke();
}

const InvoiceVendorHeader = (doc, vendor) => {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(vendor.name, 200, 55, { align: "right" })
    .fontSize(10)
    .text(vendor.vatNo, 200, 85, { align: "right" })
    .text(vendor.address.street + " " + vendor.address.streetNo, 200, 105, {
      align: "right",
    })
    .text(
      vendor.address.city +
        ", " +
        vendor.address.postcode +
        ", " +
        vendor.address.country,
      200,
      125,
      { align: "right" }
    )
    .moveDown();
  generateHr(doc, 150);
};

const InvoiceCustomerHeader = (doc, customer) => {
  doc
    .font("Helvetica")
    .text(customer.name, 300, 160)
    .text(customer.vatNo, 300, 180)
    .text(
      customer.address.street +
        " " +
        customer.address.streetNo +
        ", " +
        customer.address.city +
        ", " +
        customer.address.postcode +
        ", " +
        customer.address.country,
      300,
      200
    )

    .moveDown();
};

const InvoiceLineItemHeader = (doc) => {
  // Invoice line items header
  doc.font("Helvetica-Bold");
  doc.fontSize(10);

  InvoiceLineItem(doc, 250, [
    "#",
    "Order",
    "Description",
    "Price",
    "Qty",
    "Net",
    "Tax",
    "Total",
  ]);
};

const InvoiceLineItem = (doc, y, line) => {
  doc
    .fontSize(10)
    .text(line[0], 30, y)
    .text(line[1], 60, y)
    .text(line[2], 100, y)
    .text(line[3], 200, y)
    .text(line[4], 270, y)
    .text(line[5], 350, y)
    .text(line[6], 430, y)
    .text(line[7], 500, y);
};
const InvoiceDataHeader = (doc, key, invoiceDetails) => {
  doc
    .font("Helvetica-Bold")
    .text(`Invoice Number: ${key}`, 30, 160)
    .text(`Invoice Date: ${invoiceDetails.invoiceDate}`, 30, 180)
    .text(`Invoice Due Date: ${invoiceDetails.invoiceDueDate}`, 30, 200);
};

const InvoiceLineItems = (doc, items, position) => {
  j = 0;
  items.forEach((item, index) => {
    position = position + (index + 1) * 30;
    generateHr(doc, position + 20);
    doc.fontSize(10);
    j += 1;
    InvoiceLineItem(doc, position, [
      j,
      item.order,
      item.description,
      item.price.toFixed(2),
      item.unitOfMeasure + " " + item.quantity,
      parseFloat(item.netAmount).toFixed(2),
      "[" + item.taxCode.code + "] " + item.vatAmount.toFixed(2),
      item.totalAmount.toFixed(2),
    ]);
  });

  return position;
};
const generateInvoiceData = async (orders, customer, invoice, t) => {
  let output = {
    invoiceDate: new Date().toISOString().slice(0, 10),
    invoiceDueDate: calculateDueDate(customer).toISOString().slice(0, 10),
    totalAmount: 0,
    vatAmount: 0,
    netAmount: 0,
    items: [],
    taxCodes: [],
  };
  for (i = 0; i < orders.length; i++) {
    var orderId = orders[i].id;
    for (j = 0; j < orders[i].orderProducts.length; j++) {
      var item = orders[i].orderProducts[j];
      console.log("Customer group id " + customer.customerGroupId);
      var taxValueIndex = item.product.taxCode.taxValues.findIndex(
        (taxValue) => taxValue.customerGroupId == customer.customerGroupId
      );

      var taxCodeValue = item.product.taxCode.taxValues[taxValueIndex];
      var taxCode = item.product.taxCode;
      var netAmount = (
        parseFloat(item.quantity) * parseFloat(item.product.price)
      ).toFixed(2);
      var vatAmount = (
        (netAmount * parseFloat(taxCodeValue.percentage)) /
        100
      ).toFixed(2);
      var totalAmount = (parseFloat(netAmount) + parseFloat(vatAmount)).toFixed(
        2
      );
      output.totalAmount += parseFloat(totalAmount);
      output.netAmount += parseFloat(netAmount);
      output.vatAmount += parseFloat(vatAmount);

      let taxCodeIndex = output.taxCodes.findIndex(
        (taxCode) => taxCode.id === taxCode.id
      );
      if (taxCodeIndex > -1) {
        output.taxCodes[taxCodeIndex].amount += parseFloat(vatAmount);
      } else {
        output.taxCodes.push({
          id: taxCode.id,
          code: taxCode.code,
          amount: parseFloat(vatAmount),
          percentage: taxCodeValue.percentage,
        });
      }
      await db.invoiceLine.create(
        {
          netAmount: parseFloat(netAmount),
          taxAmount: parseFloat(vatAmount),
          totalAmount: parseFloat(totalAmount),
          invoiceId: invoice.id,
          taxValueId: taxCodeValue.id,
          orderProductId: item.id,
        },
        { transaction: t }
      );
      // Add item to array
      output.items.push({
        index: j,
        order: orderId,
        description: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        unitOfMeasure: item.product.unitOfMeasure,
        netAmount: parseFloat(netAmount),
        vatAmount: parseFloat(vatAmount),
        totalAmount: parseFloat(totalAmount),
        taxCode: {
          code: taxCode.code,
          percentage: taxCodeValue.percentage,
        },
      });
    }
  }

  return output;
};

const calculateDueDate = (customer) => {
  var today = new Date();

  var dueDate = new Date();

  if (customer.paymentTerm.type === "EOM") {
    var lastDayOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    dueDate.setDate(
      lastDayOfCurrentMonth.getDate() + customer.paymentTerm.days
    );
  } else {
    dueDate.setDate(today.getDate() + customer.paymentTerm.days);
  }
  return dueDate;
};
// Create and Save a new invoice
exports.create = async (req, res) => {
  // Save invoice in the database
  try {
    let invoices = [];
    const result = await sequelize.transaction(async (t) => {
      // Input is a list of orders
      const body = req.body.orders;

      // Group orders by customerId

      var result = body.reduce((x, y) => {
        (x[y.customerId] = x[y.customerId] || []).push(y);
        return x;
      }, {});

      // For each customer
      for (const [key, value] of Object.entries(result)) {
        // Set document path
        let customer = value[0].customer;
        let vendor = value[0].vendor;
        var path = `/home/alessio/Documents/Projects/Thesis/server/invoices/Invoice ${customer.name}.pdf`;

        let orders = [...new Set(value.map((order) => order.id))];
        // Get customer object from database
        let customerObj = await db.customer.findOne({
          where: { vendorId: vendor.id, referenceCustomerCompanyId: key },
          include: db.paymentTerm,
        });

        let invoice = await db.invoice.create({
          paid: false,
          dueDate: "2023-04-05",
          documentDate: "2023-04-05",
          totalAmount: 0,
          taxAmount: 0,
          netAmount: 0,
          customerId: customer.id,
          vendorId: vendor.id,
          url: "",
          status: "New",
        });
        let invoiceDetails = await generateInvoiceData(
          value,
          customerObj,
          invoice,
          t
        );

        invoice.netAmount = invoiceDetails.netAmount;
        invoice.taxAmount = invoiceDetails.vatAmount;
        invoice.totalAmount = invoiceDetails.totalAmount;
        invoice.dueDate = invoiceDetails.invoiceDueDate;
        invoice.documentDate = invoiceDetails.invoiceDate;

        await invoice.save({ transaction: t });

        for (let i = 0; i < orders.length; i++) {
          var orderObj = await db.order.findByPk(orders[i]);
          orderObj.invoiceId = invoice.id;
          orderObj.status = "Invoiced";
          await orderObj.save({ transaction: t });
        }

        // Create document vendor header
        let doc = new PDFDocument({ margin: 50 });

        InvoiceVendorHeader(doc, vendor);

        InvoiceCustomerHeader(doc, customer);

        InvoiceDataHeader(doc, key, invoiceDetails);

        generateHr(doc, 220);

        InvoiceLineItemHeader(doc);
        // Invoice line items
        let i;
        let j;

        doc.font("Helvetica");
        // return res.send(invoiceDetails);
        var position = 250;

        position = InvoiceLineItems(doc, invoiceDetails.items, position);

        console.log(position);
        // Net Amount
        doc.font("Helvetica-Bold");
        position = position + 50;
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total Net",
          "€ " + parseFloat(invoiceDetails.netAmount).toFixed(2),
        ]);

        invoiceDetails.taxCodes.forEach((taxCode) => {
          position = position + 30;
          doc.font("Helvetica");
          InvoiceLineItem(doc, position, [
            "",
            "",
            "",
            "",
            "",
            "",
            "VAT [" + taxCode.code + "]",
            "€ " + parseFloat(taxCode.amount).toFixed(2),
          ]);
        });
        doc.font("Helvetica-Bold");
        position = position + 30;
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total Vat",
          "€ " + parseFloat(invoiceDetails.vatAmount).toFixed(2),
        ]);

        position = position + 30;
        doc.font("Helvetica-Bold");
        InvoiceLineItem(doc, position, [
          "",
          "",
          "",
          "",
          "",
          "",
          "Total",
          "€ " + parseFloat(invoiceDetails.totalAmount).toFixed(2),
        ]);

        doc.end();
        doc.pipe(fs.createWriteStream(path));

        let invoiceUrl = await saveFileToS3(doc);
        invoice.url = invoiceUrl;
        await invoice.save({ transaction: t });
      }
      return res.send(await result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the invoice.",
    });
  }
};

exports.findAll = (req, res) => {
  // Validate request
  Invoice.findAll({
    include: [
      { model: db.company, as: "vendor", include: db.address },

      {
        model: db.invoiceLine,
        include: [
          { model: db.orderProduct, include: db.product },
          { model: db.taxValues },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    });
};

exports.getSalesInvoices = (req, res) => {
  const vendorId = req.params.vendorId;

  Invoice.findAll({
    where: { vendorId: vendorId },
    include: [{ model: db.company, as: "customer" }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving invoices.",
      });
    });
};

exports.getPurchaseInvoices = async (req, res) => {
  const customerId = req.params.customerId;
  data = [];
  try {
    const result = await sequelize.transaction(async (t) => {
      data = await Invoice.findAll(
        {
          where: { customerId: customerId },
          include: [
            { model: db.company, as: "vendor", include: db.address },
            {
              model: db.company,
              as: "customer",
              include: [
                db.account,
                db.costCenter,
                db.businessLine,
                { model: db.taxCode, include: db.taxValues },
                db.factory,
              ],
            },

            {
              model: db.invoiceLine,
              include: [
                {
                  model: db.orderProduct,
                  include: { model: db.product, include: db.transaction },
                },
                { model: db.taxValues },
                {
                  model: db.transaction,
                  include: [
                    {
                      model: db.company,
                    },
                    {
                      model: db.account,
                    },
                    {
                      model: db.factory,
                    },
                    {
                      model: db.costCenter,
                    },
                    {
                      model: db.businessLine,
                    },
                    {
                      model: db.taxValues,
                      include: db.taxCode,
                    },
                  ],
                },
              ],
            },
          ],
        },
        { transaction: t }
      );
    });
    // const copyData = JSON.parse(JSON.stringify(data));
    // for (let i = 0; i < copyData.length; i++) {
    //   let invoice = copyData[i];

    //   for (let j = 0; j < invoice.invoiceLines.length; j++) {
    //     let invoiceLine = invoice.invoiceLines[j];

    //     var productId = invoiceLine.orderProduct.productId;
    //     var suggestedTransactions = await db.transaction.findAll({
    //       where: {
    //         companyId: customerId,
    //         productId: productId,
    //       },
    //       include: db.invoiceLine,
    //     });
    //     var uniqueInvoideSuggestedTransaction = groupBy(
    //       suggestedTransactions,
    //       "invoiceId"
    //     );

    //     if (Object.keys(uniqueInvoideSuggestedTransaction).length === 0) {
    //       uniqueInvoideSuggestedTransaction = [];
    //     } else {
    //       uniqueInvoideSuggestedTransaction =
    //         uniqueInvoideSuggestedTransaction[
    //           Object.keys(uniqueInvoideSuggestedTransaction)[
    //             Object.keys(uniqueInvoideSuggestedTransaction).length - 1
    //           ]
    //         ];

    //       // Suggested transaction exists! Calculate net amount proportionally to new invoiceLine amount
    //     }

    //     copyData[i].invoiceLines[j].proposedTransactions =
    //       uniqueInvoideSuggestedTransaction;
    //     // uniqueInvoideSuggestedTransaction;

    //     // uniqueInvoideSuggestedTransaction;
    //   }
    // }

    return res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving invoices.",
    });
  }
};
var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
// This function looks for previous transactions related to the provided product and customer ( companyId)
// In case transactions change during the time, the last invoice is taken into consideration
exports.getSuggestedLines = async (req, res) => {
  const companyId = req.params.companyId;
  const invoiceId = req.params.invoiceId;
  const invoiceLineId = req.params.invoiceLineId;
  var outSuggestedTransactions = [];
  // Get the invoiceLine data
  const invoiceLine = await db.invoiceLine.findByPk(invoiceLineId, {
    include: db.orderProduct,
  });
  // Look for transactions related to the provided product/company
  var suggestedProductTransactions = await db.transaction.findAll({
    where: {
      companyId: companyId,
      productId: invoiceLine.orderProduct.productId,
    },
    include: { model: db.invoiceLine, include: db.orderProduct },
  });
  // Group transactions by invoice, this grouping is needed otherwise the function would retrieve all the transactions of all invoices with the same product

  var groupedInvoideSuggestedTransactions = groupBy(
    suggestedProductTransactions,
    "invoiceId"
  );
  // Get object keys to see how many invoices were posted with this product
  var suggestedTransactionsKeys = Object.keys(
    groupedInvoideSuggestedTransactions
  );

  // If no invoices were found then the output array is empty
  if (suggestedTransactionsKeys.length === 0) {
    suggestedProductTransactions = [];
  } else {
    // If invoices were found, then set the output array to be equal to the last posted invoice transactions
    suggestedProductTransactions =
      groupedInvoideSuggestedTransactions[
        suggestedTransactionsKeys[suggestedTransactionsKeys.length - 1]
      ];

    // Calculate suggested proportionally to new  amount
    var newQuantity = invoiceLine.orderProduct.quantity;
    let currentNetLine = parseFloat(invoiceLine.netAmount);

    for (let i = 0; i < suggestedProductTransactions.length; i++) {
      let transaction = suggestedProductTransactions[i];
      var oldQuantity = transaction.invoiceLine.orderProduct.quantity;
      console.log("Old quantity :" + oldQuantity);
      console.log("New quantity :" + newQuantity);

      // Calculate new netAmount
      suggestedProductTransactions[i].netAmount = getProportionatedAmount(
        transaction.netAmount,
        transaction.invoiceLine.netAmount,
        invoiceLine.netAmount,
        oldQuantity,
        newQuantity
      );

      // Calculate new taxAmount
      suggestedProductTransactions[i].taxAmount = getProportionatedAmount(
        transaction.taxAmount,
        transaction.invoiceLine.taxAmount,
        invoiceLine.taxAmount,
        oldQuantity,
        newQuantity
      );

      //Calculate new totalAmount
      suggestedProductTransactions[i].totalAmount = getProportionatedAmount(
        transaction.totalAmount,
        transaction.invoiceLine.totalAmount,
        invoiceLine.totalAmount,
        oldQuantity,
        newQuantity
      );
      outSuggestedTransactions.push(suggestedProductTransactions);
    }
  }

  return res.send(suggestedProductTransactions);
};

const getProportionatedAmount = (x, y, z, oldQuantity, newQuantity) => {
  return (parseFloat(x) / parseFloat(y)) * parseFloat(z);
};
// Update a invoice by the id in the request form
exports.update = async (req, res) => {
  let invoice = await db.invoice.findByPk(10);
  if (invoice.status === "New") {
    invoice.status = "Saved";
  } else {
    invoice.status = "New";
  }

  await invoice.save();
  return res.send();
  // const id = req.body.id;
  // try {
  //   let invoice = await Invoice.update(req.body, { where: { id: id } });
  //   return res.send(await invoice.findByPk(id));
  // } catch (err) {
  //   res.status(500).send({
  //     message: "Error updating invoice with id=" + id,
  //   });
  // }
};
// Delete a invoice with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Invoice.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "invoice was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete invoice with id=${id}. Maybe invoice was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete invoice with id=" + id,
      });
    });
};

// Delete all invoice from the database.
exports.deleteAll = (req, res) => {
  Invoice.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} invoice were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all invoice.",
      });
    });
};
