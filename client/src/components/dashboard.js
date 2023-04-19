import "./../style/dashboard.css";
import { Link } from "react-router-dom";
function Dashboard() {
  return (
    <div>
      <div className="dashboard">
        <Link to="/companies">
          <span>Companies</span>
        </Link>
        <Link to="/Vendors">
          <span>Vendors</span>
        </Link>

        <Link to="/Customers">
          <span>Customers</span>
        </Link>
        <Link to="/Inventory">
          <span>Inventory</span>
        </Link>

        <Link to="/PurchaseOrders">
          <span>Purchase Orders</span>
        </Link>
        <Link to="/SalesOrders">
          <span>Sales Orders</span>
        </Link>
        <Link to="/purchase-invoices">
          <span>Purchase Invoices</span>
        </Link>
        <Link to="/ap-workflow">
          <span>AP Workflow</span>
        </Link>
        <Link to="/sales-invoices">
          <span>Sales Invoices</span>
        </Link>
        <Link to="/account">
          <span>Account</span>
        </Link>
        <Link to="/taxcodes">
          <span>Tax Codes</span>
        </Link>
        <Link to="/factories">
          <span>Factories</span>
        </Link>
        <Link to="/businesslines">
          <span>Business Lines</span>
        </Link>
        <Link to="/costcenters">
          <span>Cost Centers</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
