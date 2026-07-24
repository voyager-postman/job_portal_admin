import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../Url/Url.js";
import axios from "axios";
import { ensureAuthRequestConfig } from "../../utils/authToken";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const formatRevenueDate = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-GB");
};

const truncateText = (value, maxLength = 28) => {
  if (!value) return "-";
  const text = String(value);
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const getRevenueStatusClass = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "success") {
    return "revenue-status-badge revenue-status-success";
  }
  if (normalized === "pending") {
    return "revenue-status-badge revenue-status-pending";
  }
  if (normalized === "failed") {
    return "revenue-status-badge revenue-status-failed";
  }
  return "revenue-status-badge revenue-status-default";
};

// Register chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
);

const DashboardContent = ({ isSidebarHidden }) => {
  const [stats, setStats] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState(null);
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [yearData, setYearData] = useState(null);
  const [analyticTable, setAnalyticTable] = useState([]);
  const [revenueTable, setRevenueTable] = useState([]);
  const [revenuePage, setRevenuePage] = useState(1);
  const [revenueLimit, setRevenueLimit] = useState(10);
  const [revenueTotalPages, setRevenueTotalPages] = useState(1);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      title: {
        display: true,
        text: "Job Seeker & Recruiter Analytics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Total Revenue Analytics Report (${revenueYear})`,
      },    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue in USD",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  const fetchCompanyStats = async (signal) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getDashboardStats`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true, signal }),
      );
      setStats(response.data.data);
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error.code === "ERR_CANCELED" ||
        error.code === "ECONNABORTED"
      ) {
        return;
      }
      console.error("Error While fetching Header Details:", error);
    }
  };

  const fetchCompanyAnalytics = async (signal) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getJobseekerCompanyAnalytics`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true, signal }),
      );
      const graphData = response.data.data.graphData;
      const graphYear = response.data;
      setYearData(graphYear);
      setAnalyticTable(response.data.data.listData);
      setChartData({
        labels: graphData.months,
        datasets: [
          {
            label: "Total Job Seekers",
            data: graphData.jobSeekers,
            backgroundColor: "#42a5f5",
          },
          {
            label: "Total Recruiters",
            data: graphData.recruiters,
            backgroundColor: "#66bb6a",
          },
        ],
      });
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error.code === "ERR_CANCELED" ||
        error.code === "ECONNABORTED"
      ) {
        return;
      }
      console.error("Error while fetching analytics:", error);
    }
  };

  const fetchCompanyRevenue = useCallback(async (signal) => {
    try {
      setRevenueLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}getRevenueAnalytics`,
        await ensureAuthRequestConfig({
          skipGlobalLoader: true,
          signal,
          params: {
            year: revenueYear,
            page: revenuePage,
            limit: revenueLimit,
          },
        }),
      );

      const payload = response.data?.data || {};
      const graphData = payload.graphData || { months: [], revenue: [] };

      setRevenueTable(payload.listData || []);
      setRevenueTotalPages(
        response.data?.totalPages || payload.totalPages || 1,
      );

      setRevenueChartData({
        labels: graphData.months || [],
        datasets: [
          {
            label: "Revenue ($)",
            data: graphData.revenue || [],
            backgroundColor: "#42a5f5",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error.code === "ERR_CANCELED" ||
        error.code === "ECONNABORTED"
      ) {
        return;
      }
      console.error("Error while fetching Revenue:", error);
      setRevenueTable([]);
      setRevenueChartData(null);
    } finally {
      setRevenueLoading(false);
    }
  }, [revenueYear, revenuePage, revenueLimit]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCompanyStats(controller.signal);
    fetchCompanyAnalytics(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCompanyRevenue(controller.signal);
    return () => controller.abort();
  }, [fetchCompanyRevenue]);
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
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <Link
              to="/admin/manage-recruiter"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="super-dashboard-dashboard-box">
                <div className="super-dashboard-icon-box">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="super-dashboard-box-detail">
                  <h5>Total Company</h5>
                  <p>{stats.totalCompany || 0}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <Link
              to="/admin/manage-candidates"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="super-dashboard-dashboard-box">
                <div className="super-dashboard-icon-box">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div className="super-dashboard-box-detail">
                  <h5>Total Job Seekers</h5>
                  <p>{stats.totalJobSeekers || 0}</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Recruiters</h5>
                <p>{stats.totalRecruiters || 0}</p>
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
                <p>$ {stats.totalRevenue || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="super-dashboard-common-heading">
        <h5>Total User & Recruiter Analytics</h5>
      </div>
      <div className="super-dashboard-users-recruiters-analytics">
        <div className="users-recruiters-analytics-chart">
          <h5>Job Seeker & Recruiter Analytics {yearData?.year}</h5>

          {chartData ? (
            <Bar data={chartData} options={options} />
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>

        <div className="users-recruiters-analytics-table">
          <h5>Job Seeker & Recruiter Analytics Data</h5>
          {/* <TableView
            columns={columns}
            data={analyticTable}
            limit={limit}
            setLimit={(value) => {
              setLimit(value);
              setPage(1);
            }}
          /> */}
          <div className="revenue-report-table-wrap">
            <table className="table revenue-report-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Seeker</th>
                  <th>Total Company</th>
                </tr>
              </thead>
              <tbody>
                {analyticTable.map((data, i) => (
                  <tr key={i}>
                    <td>{data.month}</td>
                    <td>{data.totalJobSeekers}</td>
                    <td>{data.totalRecruiters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="super-dashboard-common-heading d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0">Total Revenue Report</h5>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="revenue-year" className="mb-0 small text-muted">
            Year
          </label>
          <select
            id="revenue-year"
            className="form-select form-select-sm"
            style={{ width: "100px" }}
            value={revenueYear}
            onChange={(e) => {
              setRevenueYear(Number(e.target.value));
              setRevenuePage(1);
            }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>
        </div>
      </div>
      <div className="super-dashboard-total-revenue-report my-4">
        <div className="total-revenue-report-chart">
          <h5>Total Revenue Analytics Report {revenueYear}</h5>
          <div className="revenue-chart-container">
            {revenueLoading ? (
              <p>Loading revenue analytics...</p>
            ) : revenueChartData ? (
              <Bar data={revenueChartData} options={options2} />
            ) : (
              <p>No revenue analytics available.</p>
            )}
          </div>
        </div>
        <div className="total-revenue-report-tabel revenue-report-data-panel">
          <div className="revenue-report-header">
            <div>
              <h5>Total Revenue Analytics Report Data</h5>
              <p className="revenue-report-subtitle mb-0">
                Transaction history for {revenueYear}
              </p>
            </div>
            <div className="revenue-report-controls">
              <label htmlFor="revenue-limit" className="revenue-report-control-label">
                Show
              </label>
              <select
                id="revenue-limit"
                className="form-select form-select-sm revenue-report-limit-select"
                value={revenueLimit}
                onChange={(e) => {
                  setRevenueLimit(Number(e.target.value));
                  setRevenuePage(1);
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="revenue-report-control-label">entries</span>
            </div>
          </div>
          <div className="revenue-report-table-wrap">
            <table className="table revenue-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Plan</th>
                  <th className="text-end">Amount</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {revenueLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : revenueTable.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No revenue records found.
                    </td>
                  </tr>
                ) : (
                  revenueTable.map((data, index) => (
                    <tr key={data.transactionId || index}>
                      <td className="revenue-report-cell-date">
                        {formatRevenueDate(data.date)}
                      </td>
                      <td
                        className="revenue-report-cell-truncate"
                        title={data.name || "-"}
                      >
                        {truncateText(data.name, 22)}
                      </td>
                      <td
                        className="revenue-report-cell-truncate"
                        title={data.subscriptionPlan || "-"}
                      >
                        {truncateText(data.subscriptionPlan, 24)}
                      </td>
                      <td className="text-end revenue-report-cell-amount">
                        $ {data.amount ?? "-"}
                      </td>
                      <td className="text-center">
                        <span className={getRevenueStatusClass(data.status)}>
                          {data.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {revenueTotalPages > 1 && (
            <div className="revenue-report-pagination">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={revenuePage === 1 || revenueLoading}
                onClick={() => setRevenuePage((p) => p - 1)}
              >
                Prev
              </button>
              <div className="revenue-report-page-list">
                {[...Array(revenueTotalPages)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`btn btn-sm ${
                      revenuePage === i + 1 ? "btn-primary" : "btn-outline-primary"
                    }`}
                    disabled={revenueLoading}
                    onClick={() => setRevenuePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={revenuePage === revenueTotalPages || revenueLoading}
                onClick={() => setRevenuePage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default DashboardContent;
