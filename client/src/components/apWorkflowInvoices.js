import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

function WorkflowInvoices({
  invoices,
  setSelected,
  selected,
  getPurchaseInvoices,
}) {
  const dispatch = DispatchFeedbackContexts();

  useEffect(() => {}, [invoices]);
  return (
    <div>
      <div className="list">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Vendor Name</th>
              <th scope="col">Vendor VAT no</th>

              <th scope="col">Net Amount</th>
              <th scope="col">Vat Amount</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => {
              return (
                <tr
                  onClick={() => setSelected(invoice)}
                  className={
                    selected && selected.id === invoice.id
                      ? "bg-primary text-white"
                      : ""
                  }
                >
                  <td>{invoice.vendor.name}</td>
                  <td>{invoice.vendor.vatNo}</td>

                  <td>{invoice.netAmount}</td>
                  <td>{invoice.taxAmount}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.status}</td>
                  <td>{invoice.createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkflowInvoices;
