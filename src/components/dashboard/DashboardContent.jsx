import React, { use } from "react";
import AnalyticsChart from "./AnalyticsChart";
import RevenueChart from "./RevenueChart";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url.js";
import axios from "axios";
import { useEffect, useState } from "react";
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
import { TableView } from "../DataTable.jsx";

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
  const [revenueYear, setRevenueYear] = useState("");
  const [yearData, setYearData] = useState(null);
  const [analyticTable, setAnalyticTable] = useState([]);
  const [revenueTable, setRevenueTable] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

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
        text: `Total Revenue Analytics Report (${revenueYear || "—"})`,
      },
    },
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

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "month",
      header: "Month",
      accessorFn: (row) => (row.month || "").toLowerCase(),
      cell: ({ row }) => row.original.month || "Not Provided",
    },
    {
      accessorKey: "totalJobSeekers",
      header: "JobSeekers",
      accessorFn: (row) => (row.totalJobSeekers || "").toLowerCase(),
      cell: ({ row }) => row.original.totalJobSeekers || "Not Provided",
    },
    {
      accessorKey: "totalRecruiters",
      header: "Recruiters",
      accessorFn: (row) => (row.totalRecruiters || "").toLowerCase(),
      cell: ({ row }) => row.original.totalRecruiters || "Not Provided",
    },
  ];

  const fetchCompanyStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getDashboardStats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", response.data);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error While fetching Header Details:", error);
    }
  };

  const fetchCompanyAnalytics = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getJobseekerCompanyAnalytics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
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
      console.error("Error while fetching analytics:", error);
    }
  };

  const fetchCompanyRevenu = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getRevenueAnalytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { graphData } = response.data.data;
      const year = response.data.year;

      setRevenueTable(response.data.data.listData);
      setRevenueYear(year);

      setRevenueChartData({
        labels: graphData.months,
        datasets: [
          {
            label: "Revenue ($)",
            data: graphData.revenue,
            backgroundColor: "#42a5f5",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Error while fetching Revenue:", error);
    }
  };

  useEffect(() => {
    fetchCompanyStats();
    fetchCompanyAnalytics();
    fetchCompanyRevenu();
  }, []);

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
            <div className="super-dashboard-dashboard-box">
              <div className="super-dashboard-icon-box">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="super-dashboard-box-detail">
                <h5>Total Users</h5>
                <p>{stats.totalUsers || 0}</p>
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
                <p>{stats.totalJobSeekers || 0}</p>
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

          <table className="table table-bordered">
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

      {/* Revenue */}
      <div className="super-dashboard-common-heading">
        <h5>Total Revenue Report</h5>
      </div>
      <div className="super-dashboard-total-revenue-report my-4">
        <div className="total-revenue-report-chart">
          <h5>Total Revenue Analytics Report {revenueYear?.year}</h5>
          {revenueChartData ? (
            <Bar data={revenueChartData} options={options2} />
          ) : (
            <p>Loading revenue analytics...</p>
          )}
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
              {revenueTable.map((data, e) => (
                <tr key={e}>
                  <td>{data.date}</td>
                  <td>{data.name}</td>
                  <td>{data.userType}</td>
                  <td>{data.subscriptionPlan}</td>
                  <td>{data.transactionId}</td>
                  <td>$ {data.amount}</td>
                  <td className="status-success">{data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardContent;
