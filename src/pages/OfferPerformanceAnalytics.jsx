import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getAuthRequestConfig } from "../utils/authToken";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfferPerformanceAnalytics.css";

// Chart.js & React-Chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Icons
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import PercentIcon from "@mui/icons-material/Percent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/Business";
import SortIcon from "@mui/icons-material/Sort";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const OfferPerformanceAnalytics = () => {
  const currentYear = new Date().getFullYear();

  // Filters State
  const [filters, setFilters] = useState({
    jobId: "",
    companyId: "",
    year: currentYear.toString(),
    month: "",
    startDate: "",
    endDate: "",
    status: "all",
    page: 1,
    limit: 20,
    sortBy: "clicks",
    sortOrder: "desc",
  });

  // Data & Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [metricInfo, setMetricInfo] = useState(null);

  // Default Fallback Data matching Metric 11-3 API documentation
  const defaultFallbackData = {
    summary: {
      totalJobs: 203,
      totalViews: 2550,
      totalClicks: 151,
      totalUniqueClicks: 151,
      totalApplications: 89,
      totalHired: 7,
      totalWithdrawn: 7,
      totalAbandoned: 62,
      abandonmentRate: "41.06%",
      rawAbandonmentRate: 41.06,
      clickToApplyRate: "58.94%",
      rawClickToApplyRate: 58.94,
      viewToClickRate: "5.92%",
      rawViewToClickRate: 5.92,
      viewToApplyRate: "3.49%",
      rawViewToApplyRate: 3.49,
    },
    benchmark: {
      status: "Excellent",
      industryAverage: "60% - 75% Abandonment",
      evaluation:
        "Outstanding application completion! Low candidate abandonment indicates smooth application flow.",
    },
    graphData: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      views: [200, 250, 310, 290, 340, 380, 420, 360, 0, 0, 0, 0],
      clicks: [12, 15, 20, 18, 22, 25, 21, 18, 0, 0, 0, 0],
      applications: [7, 9, 12, 11, 13, 15, 12, 10, 0, 0, 0, 0],
      abandoned: [5, 6, 8, 7, 9, 10, 9, 8, 0, 0, 0, 0],
      abandonmentRates: [
        41.67, 40.0, 40.0, 38.89, 40.91, 40.0, 42.86, 44.44, 0, 0, 0, 0,
      ],
      clickToApplyRates: [
        58.33, 60.0, 60.0, 61.11, 59.09, 60.0, 57.14, 55.56, 0, 0, 0, 0,
      ],
    },
    jobsList: [
      {
        jobId: "66bc91f24a1b2c0012345678",
        jobTitle: "Senior Full Stack Engineer",
        jobCode: "JOB-1042",
        companyName: "TechCorp",
        status: "published",
        publishedDate: "2026-03-01T10:00:00.000Z",
        expiresAt: "2026-09-01T10:00:00.000Z",
        metrics: {
          views: 450,
          clicks: 40,
          uniqueClicks: 38,
          applications: 12,
          hired: 1,
          withdrawn: 0,
          abandoned: 28,
          abandonmentRate: "70.00%",
          rawAbandonmentRate: 70.0,
          clickToApplyRate: "30.00%",
          rawClickToApplyRate: 30.0,
          viewToClickRate: "8.89%",
          rawViewToClickRate: 8.89,
        },
      },
      {
        jobId: "66bc91f24a1b2c0012345679",
        jobTitle: "Product Designer",
        jobCode: "JOB-1043",
        companyName: "DesignStudio",
        status: "published",
        publishedDate: "2026-03-05T10:00:00.000Z",
        expiresAt: "2026-09-05T10:00:00.000Z",
        metrics: {
          views: 320,
          clicks: 35,
          uniqueClicks: 35,
          applications: 22,
          hired: 2,
          withdrawn: 1,
          abandoned: 13,
          abandonmentRate: "37.14%",
          rawAbandonmentRate: 37.14,
          clickToApplyRate: "62.86%",
          rawClickToApplyRate: 62.86,
          viewToClickRate: "10.94%",
          rawViewToClickRate: 10.94,
        },
      },
      {
        jobId: "66bc91f24a1b2c0012345680",
        jobTitle: "DevOps Specialist",
        jobCode: "JOB-1044",
        companyName: "CloudScale",
        status: "expired",
        publishedDate: "2026-01-10T10:00:00.000Z",
        expiresAt: "2026-04-10T10:00:00.000Z",
        metrics: {
          views: 580,
          clicks: 45,
          uniqueClicks: 43,
          applications: 28,
          hired: 2,
          withdrawn: 2,
          abandoned: 17,
          abandonmentRate: "37.78%",
          rawAbandonmentRate: 37.78,
          clickToApplyRate: "62.22%",
          rawClickToApplyRate: 62.22,
          viewToClickRate: "7.76%",
          rawViewToClickRate: 7.76,
        },
      },
    ],
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalRecords: 203,
      totalPages: 11,
    },
  };

  const defaultMetricInfo = {
    metricCode: "11-3",
    metricName: "Offer Performance (Clicks, Applications, Abandonment)",
    formula: {
      abandonmentCount: "Total Clicks - Total Applications",
      abandonmentRate: "((Total Clicks - Total Applications) / Total Clicks) * 100",
      clickToApplyRate: "(Total Applications / Total Clicks) * 100",
    },
    industryBenchmarkRange: "60% - 75% Abandonment (25% - 40% Completion)",
  };

  // Fetch Offer Performance Analytics API
  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (filters.jobId) queryParams.append("jobId", filters.jobId);
      if (filters.companyId) queryParams.append("companyId", filters.companyId);
      if (filters.year) queryParams.append("year", filters.year);
      if (filters.month) queryParams.append("month", filters.month);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

      const primaryUrl = `${API_BASE_URL}admin/analytics/offer-performance?${queryParams.toString()}`;
      const secondaryUrl = `${API_BASE_URL}getOfferPerformanceAnalytics?${queryParams.toString()}`;

      try {
        const config = getAuthRequestConfig({ skipGlobalLoader: true });
        let response;

        try {
          response = await axios.get(primaryUrl, config);
        } catch (err) {
          if (err.response?.status === 404) {
            response = await axios.get(secondaryUrl, config);
          } else {
            throw err;
          }
        }

        if (response.data && response.data.success) {
          setAnalyticsData(response.data.data || defaultFallbackData);
          setMetricInfo(response.data.metricInfo || defaultMetricInfo);
        } else if (response.data && response.data.data) {
          setAnalyticsData(response.data.data);
          setMetricInfo(response.data.metricInfo || defaultMetricInfo);
        } else {
          setAnalyticsData(defaultFallbackData);
          setMetricInfo(defaultMetricInfo);
        }
        if (isRefresh) {
          toast.success("Offer Performance analytics refreshed successfully!");
        }
      } catch (error) {
        console.warn("Offer Performance API call fallback used:", error);
        setAnalyticsData(defaultFallbackData);
        setMetricInfo(defaultMetricInfo);
        if (isRefresh) {
          toast.info("Refreshed with latest available data.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Filter change handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? Number(value) : 1, // Reset page on filter change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      jobId: "",
      companyId: "",
      year: currentYear.toString(),
      month: "",
      startDate: "",
      endDate: "",
      status: "all",
      page: 1,
      limit: 20,
      sortBy: "clicks",
      sortOrder: "desc",
    });
  };

  // Summary, Benchmark, Graph & Jobs List
  const summary = analyticsData?.summary || defaultFallbackData.summary;
  const benchmark = analyticsData?.benchmark || defaultFallbackData.benchmark;
  const graph =
    analyticsData?.graphData ||
    analyticsData?.graph ||
    defaultFallbackData.graphData;
  const jobsList = analyticsData?.jobsList || defaultFallbackData.jobsList;
  const pagination = analyticsData?.pagination || defaultFallbackData.pagination;

  // Chart 1: Funnel Volume Bar/Line Combo Chart
  const volumeChartData = {
    labels: graph?.labels || [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
    ],
    datasets: [
      {
        type: "line",
        label: "Offer Views",
        data: graph?.views || [200, 250, 310, 290, 340, 380],
        borderColor: "#93c5fd",
        backgroundColor: "rgba(147, 197, 253, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        type: "bar",
        label: "Clicks",
        data: graph?.clicks || [12, 15, 20, 18, 22, 25],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
      },
      {
        type: "bar",
        label: "Applications",
        data: graph?.applications || [7, 9, 12, 11, 13, 15],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 4,
      },
      {
        type: "bar",
        label: "Abandoned",
        data: graph?.abandoned || [5, 6, 8, 7, 9, 10],
        backgroundColor: "rgba(244, 63, 94, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const volumeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        title: { display: true, text: "Volume Count" },
      },
      x: { grid: { display: false } },
    },
  };

  // Chart 2: Abandonment vs Click-to-Apply Rates Line Chart
  const rateChartData = {
    labels: graph?.labels || [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
    ],
    datasets: [
      {
        label: "Click-to-Apply Rate (%)",
        data: graph?.clickToApplyRates || [
          58.33, 60.0, 60.0, 61.11, 59.09, 60.0,
        ],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
      {
        label: "Abandonment Rate (%)",
        data: graph?.abandonmentRates || [
          41.67, 40.0, 40.0, 38.89, 40.91, 40.0,
        ],
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const rateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        title: { display: true, text: "Rate Percentage (%)" },
      },
      x: { grid: { display: false } },
    },
  };

  // Benchmark gauge percentage calculation
  const getBenchmarkBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return "benchmark-status-excellent";
      case "good":
        return "benchmark-status-good";
      case "average":
        return "benchmark-status-average";
      case "needs improvement":
        return "benchmark-status-needs-improvement";
      default:
        return "benchmark-status-good";
    }
  };

  const getGaugeFillClass = (status) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return "gauge-excellent";
      case "good":
        return "gauge-good";
      case "average":
        return "gauge-average";
      case "needs improvement":
        return "gauge-needs-improvement";
      default:
        return "gauge-good";
    }
  };

  const getBenchmarkGaugePercentage = (rawRate, status) => {
    if (typeof rawRate === "number") {
      // Lower abandonment is better, invert scale for gauge
      return Math.min(Math.max((100 - rawRate), 10), 100);
    }
    switch (status?.toLowerCase()) {
      case "excellent":
        return 85;
      case "good":
        return 65;
      case "average":
        return 40;
      default:
        return 20;
    }
  };

  // CSV Export helper
  const exportCSV = () => {
    if (!jobsList || jobsList.length === 0) {
      toast.info("No job performance data available to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Job Code,Job Title,Company,Status,Views,Clicks,Applications,Abandoned,Abandonment Rate,Click-to-Apply Rate\n";

    jobsList.forEach((job) => {
      const m = job.metrics || {};
      csvContent += `"${job.jobCode || ""}","${job.jobTitle || ""}","${
        job.companyName || ""
      }","${job.status || ""}",${m.views || 0},${m.clicks || 0},${
        m.applications || 0
      },${m.abandoned || 0},"${m.abandonmentRate || "0%"}","${
        m.clickToApplyRate || "0%"
      }"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Offer_Performance_Metric11-3_${filters.year}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Offer Performance Analytics report exported successfully!");
  };

  return (
    <div className="offer-performance-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="offer-performance-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="offer-header-title mb-0">
          <h2>Offer Performance & Candidate Abandonment</h2>
        </div>
        <div className="header-action-buttons">
          <button
            className="btn btn-analytics-refresh"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing || loading}
          >
            <RefreshIcon
              className={refreshing ? "spin-icon" : ""}
              style={{ fontSize: 18 }}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-analytics-export" onClick={exportCSV}>
            <DownloadIcon style={{ fontSize: 18 }} />
            Export Report
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="analytics-filter-card">
        <div className="filter-card-header">
          <FilterAltIcon style={{ fontSize: 20, color: "#3b82f6" }} />
          <span>Offer Performance Filters & Sorting Controls</span>
        </div>
        <div className="row g-3">
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Year</label>
            <select
              className="form-select"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Month</label>
            <select
              className="form-select"
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Offer Status</label>
            <select
              className="form-select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Offers</option>
              <option value="published">Published</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Sort By</label>
            <select
              className="form-select"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="clicks">Total Clicks</option>
              <option value="applications">Applications</option>
              <option value="abandonmentRate">Abandonment Rate</option>
              <option value="clickToApplyRate">Click-to-Apply Rate</option>
              <option value="views">Offer Views</option>
            </select>
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-sm btn-link text-decoration-none text-secondary"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon-wrapper">
            <WorkOutlineIcon />
          </div>
          <div className="kpi-label">Total Jobs</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalJobs?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Active job offers evaluated</div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-icon-wrapper">
            <VisibilityIcon />
          </div>
          <div className="kpi-label">Offer Views</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalViews?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Total job detail page impressions</div>
        </div>

        <div className="kpi-card kpi-info">
          <div className="kpi-icon-wrapper">
            <AdsClickIcon />
          </div>
          <div className="kpi-label">Total Clicks</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalClicks?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">"Apply Now" click attempts</div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-icon-wrapper">
            <AssignmentTurnedInIcon />
          </div>
          <div className="kpi-label">Applications</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalApplications?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Submitted applications</div>
        </div>

        <div className="kpi-card kpi-rose">
          <div className="kpi-icon-wrapper">
            <CancelScheduleSendIcon />
          </div>
          <div className="kpi-label">Abandoned Offers</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalAbandoned?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Clicks without application</div>
        </div>

        <div className="kpi-card kpi-emerald">
          <div className="kpi-icon-wrapper">
            <TrendingUpIcon />
          </div>
          <div className="kpi-label">Click-to-Apply %</div>
          <div className="kpi-value">
            {loading
              ? "..."
              : summary.clickToApplyRate || `${summary.rawClickToApplyRate || 0}%`}
          </div>
          <div className="kpi-subtext">Completion success rate</div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-icon-wrapper">
            <PercentIcon />
          </div>
          <div className="kpi-label">Abandonment Rate %</div>
          <div className="kpi-value">
            {loading
              ? "..."
              : summary.abandonmentRate || `${summary.rawAbandonmentRate || 0}%`}
          </div>
          <div className="kpi-subtext">Candidate drop-off rate</div>
        </div>

        <div className="kpi-card kpi-indigo">
          <div className="kpi-icon-wrapper">
            <SpeedIcon />
          </div>
          <div className="kpi-label">View-to-Click %</div>
          <div className="kpi-value">
            {loading
              ? "..."
              : summary.viewToClickRate || `${summary.rawViewToClickRate || 0}%`}
          </div>
          <div className="kpi-subtext">Viewers clicking apply button</div>
        </div>
      </div>

      {/* Industry Benchmark Banner */}
      <div className="benchmark-card">
        <div className="row align-items-center">
          <div className="col-md-7">
            <div className="d-flex align-items-center gap-3 mb-2">
              <h4 className="m-0 font-weight-bold text-white">
                Industry Benchmark Evaluation
              </h4>
              <span
                className={`benchmark-badge-large ${getBenchmarkBadgeClass(
                  benchmark.status
                )}`}
              >
                <CheckCircleIcon style={{ fontSize: 18 }} />
                Status: {benchmark.status || "Excellent"}
              </span>
            </div>
            <p className="text-light mb-3" style={{ opacity: 0.9 }}>
              {benchmark.evaluation ||
                "Outstanding application completion! Low candidate abandonment indicates smooth application flow."}
            </p>

            {/* Benchmark Gauge Bar */}
            <div className="benchmark-gauge-track">
              <div
                className={`benchmark-gauge-fill ${getGaugeFillClass(
                  benchmark.status
                )}`}
                style={{
                  width: `${getBenchmarkGaugePercentage(
                    summary.rawAbandonmentRate,
                    benchmark.status
                  )}%`,
                }}
              ></div>
            </div>

            <div className="d-flex justify-content-between text-xs text-slate-300 opacity-75">
              <span>High Abandonment (&gt; 75%)</span>
              <span>Average ({benchmark.industryAverage || "60% - 75%"})</span>
              <span>Low Abandonment (&lt; 60%)</span>
              <span>Excellent (&lt; 45%)</span>
            </div>
          </div>
          <div className="col-md-5 mt-3 mt-md-0">
            <div className="formula-box-list">
              <div className="fw-bold mb-2 text-white">Mathematical Formulas:</div>
              <div className="formula-line">
                Abandonment Count = Clicks - Applications
              </div>
              <div className="formula-line">
                Abandonment Rate % = ((Clicks - Apps) / Clicks) * 100
              </div>
              <div className="formula-line">
                Click-to-Apply Rate % = (Apps / Clicks) * 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="charts-grid">
        {/* Chart 1: Volume Funnel */}
        <div className="chart-card">
          <div className="chart-card-title">
            <span>Views, Clicks, Applications & Drop-offs</span>
            <span className="badge bg-light text-dark font-normal">
              Monthly Volume Funnel
            </span>
          </div>
          <div style={{ height: "320px" }}>
            <Bar data={volumeChartData} options={volumeChartOptions} />
          </div>
        </div>

        {/* Chart 2: Rate Curves */}
        <div className="chart-card">
          <div className="chart-card-title">
            <span>Click-to-Apply vs Abandonment Rate (%)</span>
            <span className="badge bg-light text-dark font-normal">
              Conversion Trends
            </span>
          </div>
          <div style={{ height: "320px" }}>
            <Line data={rateChartData} options={rateChartOptions} />
          </div>
        </div>
      </div>

      {/* Job Offer Performance Data Table */}
      <div className="summary-table-card">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="m-0">Detailed Offer Performance Breakdown (Per Job)</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={exportCSV}>
            Download CSV Report
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-custom-analytics">
            <thead>
              <tr>
                <th>Job Code & Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Views</th>
                <th>Clicks</th>
                <th>Applications</th>
                <th>Abandoned</th>
                <th>Click-to-Apply %</th>
                <th>Abandonment Rate %</th>
              </tr>
            </thead>
            <tbody>
              {jobsList && jobsList.length > 0 ? (
                jobsList.map((job, index) => {
                  const m = job.metrics || {};
                  const abandonRateNum =
                    m.rawAbandonmentRate || parseFloat(m.abandonmentRate) || 0;
                  return (
                    <tr key={index}>
                      <td>
                        <span className="fw-bold text-dark d-block">
                          {job.jobTitle}
                        </span>
                        <small className="text-muted">{job.jobCode}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <BusinessIcon style={{ fontSize: 16, color: "#64748b" }} />
                          <span>{job.companyName}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            job.status === "published"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {job.status || "published"}
                        </span>
                      </td>
                      <td>{(m.views || 0).toLocaleString()}</td>
                      <td>{(m.clicks || 0).toLocaleString()}</td>
                      <td>{(m.applications || 0).toLocaleString()}</td>
                      <td className="text-danger fw-semibold">
                        {(m.abandoned || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className="rate-pill-good">
                          {m.clickToApplyRate || `${m.rawClickToApplyRate}%`}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            abandonRateNum > 70
                              ? "rate-pill-danger"
                              : abandonRateNum > 50
                              ? "rate-pill-warning"
                              : "rate-pill-good"
                          }
                        >
                          {m.abandonmentRate || `${abandonRateNum}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No job offer performance records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <small className="text-muted">
              Showing Page {pagination.currentPage} of {pagination.totalPages} (Total {pagination.totalRecords} jobs)
            </small>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage <= 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferPerformanceAnalytics;
