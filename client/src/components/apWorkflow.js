import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../App";
import apiService from "../services/apiService";
import "./../style/dashboard.css";
import "./../style/companies.css";

import { DispatchUserContexts, ShowUserContexts } from "../App";
import OrderDetails from "./orderDetails";
import SalesOrderRow from "./salesOrdersRow";
import WorkflowInvoices from "./apWorkflowInvoices";
import WorkflowAccounting from "./apWorkflowAccounting";
import WorkflowPDF from "./apWorkflowPDF";

function ApWorkflow() {
  const [selected, setSelected] = useState(null);
  const showUserContext = ShowUserContexts();
  const [disabled, setDisabled] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const getPurchaseInvoices = async () => {
    try {
      var res = await apiService.getPurchaseInvoices();

      if (selected) {
        var selectedIndex = res.data.findIndex(
          (invoice) => invoice.id == selected.id
        );
        setSelected(res.data[selectedIndex]);
      }

      setInvoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPurchaseInvoices();
  }, [showUserContext]);

  useEffect(() => {}, [invoices]);
  useEffect(() => {}, [selected]);
  return (
    <div className="d-flex flex-grow-1 ">
      <div className="row w-100">
        <div className="col-12 ">
          <div className="row h-30 overflow-auto border p-2 rounded m-3">
            <WorkflowInvoices
              setSelected={setSelected}
              selected={selected}
              getPurchaseInvoices={getPurchaseInvoices}
              invoices={invoices}
            />
          </div>
          <div className="row h-70  m-3">
            {selected && (
              <WorkflowAccounting
                invoice={selected}
                getPurchaseInvoices={getPurchaseInvoices}
                disabled={selected ? selected.status === "Saved" : false}
                setDisabled={setDisabled}
              />
            )}
          </div>
        </div>

        {/* <div className="col">
          <WorkflowPDF invoice={selected} />
        </div> */}
      </div>
    </div>

    // <div className="d-flex justify-content-center">
    //   <div className="col-6">
    //     <div className="row ">
    //       INVOICES
    //       {/* <WorkflowInvoices /> */}
    //     </div>
    //     <div className="row ">ACCOUNTING DATA</div>
    //   </div>
    //   {/* <div className="col-6">
    //     <div className="row">PDF WINDOW</div>
    //   </div> */}
    // </div>
  );
}

export default ApWorkflow;
