import React, { useEffect, useState } from "react";
import WorkflowInvoiceLine from "./apWorkflowInvoiceLine";
import "./../style/workflow.css";
import apiService from "../services/apiService";
function WorkflowAccounting({
  invoice,
  getPurchaseInvoices,
  disabled,
  setDisabled,
}) {
  const saveDocumentLines = () => {
    const products = apiService.getInvoiceLines(invoice.id);
    const companyId = apiService.getCompany().id;
    try {
      let res = apiService.parkInvoice({
        products: products,
        companyId: companyId,
        invoiceId: invoice.id,
      });
      setDisabled(true);
      console.log("Getting purchase documents");
      getPurchaseInvoices();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log(invoice);
  }, [invoice]);
  return (
    <div className="col">
      <h1>{disabled.toString()}</h1>
      <div className="row border rounded  mb-3">
        <form className="">
          <div class="row">
            <div class="col-md-3">
              <label for="inputCompanyName">Company Name</label>
              <input
                type="text"
                name="name"
                disabled
                value={invoice.vendor.name}
                required
                class="form-control form-control-sm"
                id="inputCompanyName"
                placeholder="Alessio"
              ></input>
            </div>
            <div class="col-md-3">
              <label for="inputVatNo">Vat No.</label>
              <input
                disabled
                type="text"
                required
                class="form-control form-control-sm"
                name="vatNo"
                value={invoice.vendor.vatNo}
                id="inputVatNo"
                placeholder="Giovannini"
              ></input>
            </div>

            <div className="col-2">
              <label for="inputCountry">Country</label>
              <input
                type="text"
                disabled
                required
                name="country"
                value={invoice.vendor.address.country}
                class="form-control form-control-sm"
                id="inputCountry"
                placeholder="Italy"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputRegion">Region</label>
              <input
                type="text"
                disabled
                required
                name="region"
                value={invoice.vendor.address.region}
                class="form-control form-control-sm"
                id="inputRegion"
                placeholder="Lazio"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputPostCode">Post Code</label>
              <input
                type="text"
                required
                disabled
                name="postcode"
                value={invoice.vendor.address.postcode}
                class="form-control form-control-sm"
                id="inputPostCode"
                placeholder="01-100"
              ></input>
            </div>

            <div className="col-2">
              <label for="inputCity">City</label>
              <input
                disabled
                type="text"
                required
                name="city"
                value={invoice.vendor.address.city}
                class="form-control form-control-sm"
                id="inputCity"
                placeholder="Viterbo"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputStreet">Street</label>
              <input
                disabled
                type="text"
                required
                name="street"
                value={invoice.vendor.address.street}
                class="form-control form-control-sm"
                id="inputStreet"
                placeholder="S. Agostino"
              ></input>
            </div>
            <div className="col-2">
              <label for="inputStreetNo">Street No.</label>
              <input
                disabled
                type="text"
                required
                name="streetNo"
                value={invoice.vendor.address.streetNo}
                class="form-control form-control-sm"
                id="inputStreetNo"
                placeholder="42/A"
              ></input>
            </div>
            <div className="col-6">
              <label for="inputStreetNo">Wallet Address</label>
              <input
                disabled
                type="text"
                required
                name="streetNo"
                value={invoice.vendor.walletAddress}
                class="form-control form-control-sm"
                id="inputStreetNo"
                placeholder="42/A"
              ></input>
            </div>
          </div>
        </form>
      </div>

      <div className="row border rounded">
        <div className="d-flex justify-content-center w-100">
          <button
            className="btn btn-success m-1"
            disabled={disabled}
            onClick={() => saveDocumentLines()}
          >
            Post Document
          </button>
          <a href={invoice.url} className="btn btn-success m-1">
            Get Invoice
          </a>
        </div>

        <table class="table accounting-table">
          <thead>
            <tr>
              <th scope="col">Billed Item</th>
              <th scope="col">Net Amount</th>
              <th scope="col">Vat Amount</th>
              <th scope="col">Tax Amount</th>
              <th scope="col">Account</th>
              <th scope="col">Cost Center</th>
              <th scope="col">Factory</th>
              <th scope="col">BL</th>

              <th scope="col">Description</th>
              <th scope="col">Net Amount</th>
              <th scope="col">Tax Code</th>
              <th scope="col">Vat Amount</th>
              <th scope="col">Total Amount</th>

              <th scope="col"></th>
              <th scope="col">SAVE</th>
            </tr>
          </thead>
          <tbody>
            {invoice.invoiceLines.map((line, i) => {
              return (
                <WorkflowInvoiceLine
                  invoice={invoice}
                  line={line}
                  disabled={disabled}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkflowAccounting;
