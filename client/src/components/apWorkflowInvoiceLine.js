import React, { useEffect, useState } from "react";
import WorkflowInvoiceLineTransaction from "./apWorkflowInvoiceLineTransaction";
import apiService from "../services/apiService";

function WorkflowInvoiceLine({ line, invoice, disabled }) {
  const emptyTransaction = {
    id: "",
    accountId: "",
    costCenterId: "",
    factoryId: "",
    description: "",
    taxValueId: "",
    netAmount: "",
    taxAmount: "",
    totalAmount: "",
    businessLineId: "",
    invoiceLineId: line.id,
  };

  const [transactions, setTransactions] = useState([]);

  const getProductTransactions = () => {
    var newTransactions = apiService.getInvoiceProductLines(
      invoice,
      line.orderProduct.product,
      line.id
    ).lines;
    setTransactions(newTransactions);
    var netAmount = line.netAmount;
    var taxAmount = line.taxAmount;
    var totalAmount = line.totalAmount;

    newTransactions.forEach((transaction) => {
      netAmount -= parseFloat(transaction.netAmount).toFixed() || 0;
      taxAmount -= parseFloat(transaction.taxAmount) || 0;
      totalAmount -= parseFloat(transaction.totalAmount) || 0;
    });
    netAmount = netAmount.toFixed();
    taxAmount = taxAmount.toFixed();
    totalAmount = totalAmount.toFixed();
    setLineData((prevNote) => ({
      ...prevNote,
      ["netAmount"]: netAmount,
      ["taxAmount"]: taxAmount,
      ["totalAmount"]: totalAmount,
    }));
  };
  const addTransaction = () => {
    apiService.addInvoiceLine(
      invoice,
      line.orderProduct.product,
      emptyTransaction
    );
    getProductTransactions();
  };

  const removeTransaction = (i) => {
    apiService.removeInvoiceProductLine(
      invoice.id,
      line.orderProduct.product.id,
      i
    );
    getProductTransactions();
  };

  const [lineData, setLineData] = useState({
    netAmount: parseFloat(line.netAmount),
    taxAmount: line.taxAmount,
    totalAmount: line.totalAmount,
    productName: line.orderProduct.product.name,
  });

  const insertTransactions = (transactions) => {
    transactions.forEach((transaction) => {
      apiService.addProposedLine(invoice, transaction.productId, {
        accountId: transaction.accountId,
        costCenterId: transaction.costCenterId,
        factoryId: transaction.factoryId,
        description: transaction.description,
        taxValueId: transaction.taxValueId,
        netAmount: transaction.netAmount,
        taxAmount: transaction.taxAmount,
        totalAmount: transaction.totalAmount,
        businessLineId: transaction.businessLineId,
        invoiceLineId: line.id,
        dbId: transaction.id,
      });
    });
  };
  const getSuggestedTransactions = async () => {
    try {
      var transactions = [];
      if (invoice.status != "New") {
        transactions = line.transactions;
      } else {
        let res = await apiService.getSuggestedTransactions(
          apiService.getCompany().id,
          invoice.id,
          line.id
        );
        transactions = res.data;
      }

      insertTransactions(transactions);

      getProductTransactions();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSuggestedTransactions();
  }, [invoice]);

  return (
    line.orderProduct &&
    transactions.map((transaction, i) => {
      return (
        <WorkflowInvoiceLineTransaction
          disabled={disabled}
          getProductTransactions={getProductTransactions}
          product={line.orderProduct.product}
          invoice={invoice}
          lineData={lineData}
          setLineData={setLineData}
          transaction={transaction}
          addTransaction={addTransaction}
          removeTransaction={removeTransaction}
          i={i}
        />
      );
    })
  );
}

export default WorkflowInvoiceLine;
