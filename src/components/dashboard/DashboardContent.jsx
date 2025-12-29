import React from "react";
import AnalyticsChart from "./AnalyticsChart";
import RevenueChart from "./RevenueChart";

const DashboardContent = ({ isSidebarHidden }) => {
  return (
    <section
      className={`main-dashboard-content ${
        isSidebarHidden ? "full-width" : ""
      }`}
    >
      <div className="super-dashboard-breadcrumb-info">
        <h4>Dashboard</h4>
      </div>

      {/* User Details */}
      <div className="super-dashboard-detail-info my-4">
        {/* <div className="super-dashboard-common-heading">
          <h5>User Details</h5>
        </div> */}
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Users</h5>
                <p>2143</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Job Seekers</h5>
                <p>2420</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Recruiters</h5>
                <p>2487</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Revenue</h5>
                <p>$ 1000000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {/* <div className="super-dashboard-common-heading">
        <h5>Total User & Recruiter Analytics</h5>
      </div> */}
      <div className="super-dashboard-users-recruiters-analytics">
        <div className="users-recruiters-analytics-chart">
          <h5>User & Recruiter Analytics (2025)</h5>
          <AnalyticsChart />
        </div>
        <div className="users-recruiters-analytics-table">
          <h5>User & Recruiter Analytics Data</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Users</th>
                <th>Total Recruiters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>January</td>
                <td>1200</td>
                <td>150</td>
              </tr>
              <tr>
                <td>February</td>
                <td>1350</td>
                <td>180</td>
              </tr>
              <tr>
                <td>March</td>
                <td>1500</td>
                <td>210</td>
              </tr>
              <tr>
                <td>April</td>
                <td>1650</td>
                <td>230</td>
              </tr>
              <tr>
                <td>May</td>
                <td>1700</td>
                <td>250</td>
              </tr>
              <tr>
                <td>June</td>
                <td>1900</td>
                <td>270</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue */}
      {/* <div className="super-dashboard-common-heading">
        <h5>Total Revenue Report</h5>
      </div> */}
      <div className="super-dashboard-total-revenue-report my-4">
        <div className="total-revenue-report-chart">
          <h5>Total Revenue Analytics Report (2025)</h5>
          <RevenueChart />
        </div>
        <div className="total-revenue-report-tabel">
          <h5>Total Revenue Analytics Report Data</h5>
          <table className="table-responsive transaction-table table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>User Type</th>
                <th>Subscription Plans</th>
                <th>Transaction ID</th>
                <th>Amount ($)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-09-01</td>
                <td>Alice Johnson</td>
                <td>Job Seeker</td>
                <td>Basic</td>
                <td>TXN001</td>
                <td>49.99</td>
                <td className="status-success">Success</td>
              </tr>
              <tr>
                <td>2025-09-02</td>
                <td>XYZ Corp</td>
                <td>Recruiter</td>
                <td>Premium</td>
                <td>TXN002</td>
                <td>199.00</td>
                <td className="status-success">Success</td>
              </tr>
              <tr>
                <td>2025-09-03</td>
                <td>Bob Smith</td>
                <td>Job Seeker</td>
                <td>Basic</td>
                <td>TXN003</td>
                <td>49.99</td>
                <td className="status-pending">Pending</td>
              </tr>
              <tr>
                <td>2025-09-03</td>
                <td>Alpha HR</td>
                <td>Recruiter</td>
                <td>Standard</td>
                <td>TXN004</td>
                <td>149.00</td>
                <td className="status-failed">Failed</td>
              </tr>
              <tr>
                <td>2025-09-04</td>
                <td>Emily Carter</td>
                <td>Job Seeker</td>
                <td>Basic</td>
                <td>TXN005</td>
                <td>49.99</td>
                <td className="status-success">Success</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardContent;
