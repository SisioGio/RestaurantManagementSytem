module.exports = (app) => {
  const invoice = require("../controllers/invoice.controller.js");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();

  // Create a new invoice
  router.post("/", invoice.create);

  // Update an invoice
  router.put("/", invoice.update);

  // Retrieve all invoice
  router.get("/", invoice.findAll);

  router.get("/sales/:vendorId", invoice.getSalesInvoices);

  // Retrieve suggested transaction for product/companyId
  router.get(
    "/suggestion/:companyId/:invoiceId/:invoiceLineId",
    invoice.getSuggestedLines
  );

  router.get("/purchase/:customerId", invoice.getPurchaseInvoices);

  // Delete an invoice with id
  router.delete("/:id", invoice.delete);

  // Delete all invoices
  router.delete("/", invoice.deleteAll);

  app.use("/api/invoice", router);
};
