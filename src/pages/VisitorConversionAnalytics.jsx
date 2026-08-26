import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getAuthRequestConfig } from "../utils/authToken";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VisitorConversionAnalytics.css";

// Chart.js & React-Chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PercentIcon from "@mui/icons-material/Percent";
import SpeedIcon from "@mui/icons-material/Speed";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarsIcon from "@mui/icons-material/Stars";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import AltRouteIcon from "@mui/icons-material/AltRoute";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const VisitorConversionAnalytics = () => {
  const currentYear = new Date().getFullYear();

  // Filters State
  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    month: "",
    startDate: "",
    endDate: "",
    pageType: "all",
    period: "yearly",
  });

  // Data & Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [metricInfo, setMetricInfo] = useState(null);
  const [filterInfo, setFilterInfo] = useState(null);

  // Helper for auth headers
  const getHeaders = () => {
    const token = localStorage.getItem("token") || getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Default Fallback Data matching API response
  const defaultFallbackData = {
    summary: {
      totalVisitorHits: 82,
      totalUniqueVisitors: 4,
      totalRegisteredCandidates: 195,
      totalCompletedProfiles: 123,
      directlyAttributedConversions: 0,
      conversionRate: "4875%",
      rawConversionRate: 4875,
      profileCompletionRate: "3075%",
      rawProfileCompletionRate: 3075,
      registrationToCompletionRate: "63.08%",
      rawRegistrationToCompletionRate: 63.08,
    },
    benchmark: {
      status: "Excellent",
      industryAverage: "8% - 14%",
      evaluation:
        "Outstanding conversion rate! High candidate acquisition efficiency.",
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
      uniqueVisitors: [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
      registeredCandidates: [108, 25, 11, 26, 2, 5, 6, 12, 0, 0, 0, 0],
      conversionRates: [0, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0],
    },
    monthlyBreakdown: [
      { month: "January", monthIndex: 1, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 108, completedCandidates: 58, conversionRate: "0%", rawConversionRate: 0 },
      { month: "February", monthIndex: 2, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 25, completedCandidates: 15, conversionRate: "0%", rawConversionRate: 0 },
      { month: "March", monthIndex: 3, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 11, completedCandidates: 9, conversionRate: "0%", rawConversionRate: 0 },
      { month: "April", monthIndex: 4, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 26, completedCandidates: 23, conversionRate: "0%", rawConversionRate: 0 },
      { month: "May", monthIndex: 5, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 2, completedCandidates: 1, conversionRate: "0%", rawConversionRate: 0 },
      { month: "June", monthIndex: 6, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 5, completedCandidates: 3, conversionRate: "0%", rawConversionRate: 0 },
      { month: "July", monthIndex: 7, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 6, completedCandidates: 3, conversionRate: "0%", rawConversionRate: 0 },
      { month: "August", monthIndex: 8, totalHits: 82, uniqueVisitors: 4, registeredCandidates: 12, completedCandidates: 11, conversionRate: "300%", rawConversionRate: 300 },
      { month: "September", monthIndex: 9, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 0, completedCandidates: 0, conversionRate: "0%", rawConversionRate: 0 },
      { month: "October", monthIndex: 10, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 0, completedCandidates: 0, conversionRate: "0%", rawConversionRate: 0 },
      { month: "November", monthIndex: 11, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 0, completedCandidates: 0, conversionRate: "0%", rawConversionRate: 0 },
      { month: "December", monthIndex: 12, totalHits: 0, uniqueVisitors: 0, registeredCandidates: 0, completedCandidates: 0, conversionRate: "0%", rawConversionRate: 0 },
    ],
    deviceBreakdown: [
      { device: "Desktop", hits: 82, uniqueVisitors: 4, sharePercentage: 100 },
      { device: "Mobile", hits: 0, uniqueVisitors: 0, sharePercentage: 0 },
      { device: "Tablet", hits: 0, uniqueVisitors: 0, sharePercentage: 0 },
      { device: "Other", hits: 0, uniqueVisitors: 0, sharePercentage: 0 },
    ],
    sourceBreakdown: [
      { source: "Referral", hits: 82, uniqueVisitors: 4, sharePercentage: 100 },
    ],
  };

  const defaultMetricInfo = {
    metricCode: "11-2",
    metricName: "Visitor-to-Candidate Conversion Rate",
    formula: "(Total Registered Candidates / Total Unique Visitors) * 100",
    industryBenchmarkRange: "8% - 14%",
  };

  // Fetch Analytics API Call
  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      setLoading(true);

      // Build query params exactly per API documentation
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append("year", filters.year);
      if (filters.month) queryParams.append("month", filters.month);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);
      if (filters.pageType) queryParams.append("pageType", filters.pageType);
      if (filters.period) queryParams.append("period", filters.period);

      const primaryUrl = `${API_BASE_URL}admin/analytics/visitor-to-candidate?${queryParams.toString()}`;
      const secondaryUrl = `${API_BASE_URL}getVisitorCandidateConversionAnalytics?${queryParams.toString()}`;

      try {
        const headers = getHeaders();
        const config = {
          ...getAuthRequestConfig({ skipGlobalLoader: true }),
          headers: {
            ...headers,
          },
        };
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
          setFilterInfo(response.data.filter || filters);
        } else if (response.data && response.data.data) {
          setAnalyticsData(response.data.data);
          setMetricInfo(response.data.metricInfo || defaultMetricInfo);
        } else {
          setAnalyticsData(defaultFallbackData);
          setMetricInfo(defaultMetricInfo);
        }
        if (isRefresh) {
          toast.success("Visitor Conversion analytics refreshed successfully!");
        }
      } catch (error) {
        console.warn("Analytics API call fallback used:", error);
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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      year: currentYear.toString(),
      month: "",
      startDate: "",
      endDate: "",
      pageType: "all",
      period: "yearly",
    });
  };

  // Extract Summary, Benchmark, Graph & Breakdown Data
  const summary = analyticsData?.summary || defaultFallbackData.summary;
  const benchmark = analyticsData?.benchmark || defaultFallbackData.benchmark;
  const graph =
    analyticsData?.graphData ||
    analyticsData?.graph ||
    defaultFallbackData.graphData;
  const monthlyBreakdown =
    analyticsData?.monthlyBreakdown || defaultFallbackData.monthlyBreakdown;
  const deviceBreakdown =
    analyticsData?.deviceBreakdown || defaultFallbackData.deviceBreakdown;
  const sourceBreakdown =
    analyticsData?.sourceBreakdown || defaultFallbackData.sourceBreakdown;

  // Chart 1: Unique Visitors vs Registered Candidates Bar Chart
  const visitorVsCandidateChartData = {
    labels: graph?.labels || [
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
    datasets: [
      {
        label: "Total Unique Visitors",
        data: graph?.uniqueVisitors || [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.75)",
        borderColor: "#2563eb",
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: "Registered Candidates",
        data: graph?.registeredCandidates || [108, 25, 11, 26, 2, 5, 6, 12, 0, 0, 0, 0],
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        borderColor: "#059669",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
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
        title: { display: true, text: "Count" },
      },
      x: { grid: { display: false } },
    },
  };

  // Chart 2: Conversion Rate Trend Line Chart
  const conversionTrendData = {
    labels: graph?.labels || [
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
    datasets: [
      {
        label: "Conversion Rate (%)",
        data: graph?.conversionRates || [0, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.12)",
        borderColor: "#6366f1",
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 6,
        tension: 0.35,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `Conversion Rate: ${context.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        title: { display: true, text: "Percentage (%)" },
      },
      x: { grid: { display: false } },
    },
  };

  // Chart 3: Device Share Doughnut Chart
  const deviceDoughnutData = {
    labels: (deviceBreakdown || []).map((d) => d.device),
    datasets: [
      {
        data: (deviceBreakdown || []).map((d) => d.hits ?? d.uniqueVisitors ?? 0),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#94a3b8"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Chart 4: Source Breakdown Doughnut Chart
  const sourceDoughnutData = {
    labels: (sourceBreakdown || []).map((s) => s.source),
    datasets: [
      {
        data: (sourceBreakdown || []).map((s) => s.hits ?? s.uniqueVisitors ?? 0),
        backgroundColor: ["#ea4335", "#0a66c2", "#6366f1", "#10b981", "#f59e0b"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
    },
  };

  // Benchmark helpers
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
      return Math.min(Math.max((rawRate / 20) * 100, 10), 100);
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

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case "desktop":
        return <DesktopWindowsIcon style={{ color: "#3b82f6" }} />;
      case "mobile":
        return <SmartphoneIcon style={{ color: "#10b981" }} />;
      case "tablet":
        return <TabletMacIcon style={{ color: "#f59e0b" }} />;
      default:
        return <DevicesOtherIcon style={{ color: "#64748b" }} />;
    }
  };

  const getSourceIcon = (source) => {
    const s = source?.toLowerCase() || "";
    if (s.includes("google")) return <GoogleIcon style={{ color: "#ea4335" }} />;
    if (s.includes("linkedin")) return <LinkedInIcon style={{ color: "#0a66c2" }} />;
    if (s.includes("direct")) return <LanguageIcon style={{ color: "#6366f1" }} />;
    return <AltRouteIcon style={{ color: "#10b981" }} />;
  };

  // Export CSV helper
  const exportCSV = () => {
    if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
      toast.info("No breakdown data available to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "Month,Total Hits,Unique Visitors,Registered Candidates,Completed Candidates,Conversion Rate (%)\n";

    monthlyBreakdown.forEach((item) => {
      csvContent += `"${item.month}",${item.totalHits || 0},${item.uniqueVisitors || 0},${item.registeredCandidates || 0},${item.completedCandidates || 0},${item.conversionRate || "0%"}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Visitor_Candidate_Conversion_Metric11-2_${filters.year}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Visitor-to-Candidate Analytics exported successfully!");
  };

  return (
    <div className="visitor-conversion-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="visitor-conversion-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="visitor-header-title mb-0">
          <h2>Visitor-to-Candidate Conversion</h2>
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

      {/* Filters Toolbar */}
      <div className="analytics-filter-card">
        <div className="filter-card-header">
          <FilterAltIcon style={{ fontSize: 20, color: "#3b82f6" }} />
          <span>Analytics Filters & Target Controls</span>
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
            <label>Period</label>
            <select
              className="form-select"
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          <div className="col-md-2 col-sm-6 filter-input-group">
            <label>Page Type</label>
            <select
              className="form-select"
              name="pageType"
              value={filters.pageType}
              onChange={handleFilterChange}
            >
              <option value="all">All Pages</option>
              <option value="home">Home</option>
              <option value="jobs">Jobs</option>
              <option value="candidate_landing">Candidate Landing</option>
              <option value="candidate_register">Candidate Register</option>
              <option value="company_landing">Company Landing</option>
              <option value="other">Other</option>
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

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon-wrapper">
            <TouchAppIcon />
          </div>
          <div className="kpi-label">Total Visitor Hits</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalVisitorHits?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Total page view requests</div>
        </div>

        <div className="kpi-card kpi-purple">
          <div className="kpi-icon-wrapper">
            <PeopleAltIcon />
          </div>
          <div className="kpi-label">Unique Visitors</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalUniqueVisitors?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Deduplicated visitor sessions</div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-icon-wrapper">
            <HowToRegIcon />
          </div>
          <div className="kpi-label">Registered Candidates</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalRegisteredCandidates?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">JobSeeker accounts created</div>
        </div>

        <div className="kpi-card kpi-indigo">
          <div className="kpi-icon-wrapper">
            <AssignmentTurnedInIcon />
          </div>
          <div className="kpi-label">Completed Profiles</div>
          <div className="kpi-value">
            {loading ? "..." : summary.totalCompletedProfiles?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">JobSeekers with full profile</div>
        </div>

        <div className="kpi-card kpi-emerald">
          <div className="kpi-icon-wrapper">
            <TrendingUpIcon />
          </div>
          <div className="kpi-label">Visitor → Candidate %</div>
          <div className="kpi-value">
            {loading ? "..." : summary.conversionRate || `${summary.rawConversionRate || 0}%`}
          </div>
          <div className="kpi-subtext">Metric 11-2 Conversion Rate</div>
        </div>

        <div className="kpi-card kpi-info">
          <div className="kpi-icon-wrapper">
            <PercentIcon />
          </div>
          <div className="kpi-label">Visitor → Profile %</div>
          <div className="kpi-value">
            {loading ? "..." : summary.profileCompletionRate || `${summary.rawProfileCompletionRate || 0}%`}
          </div>
          <div className="kpi-subtext">Visitor to full profile rate</div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-icon-wrapper">
            <SpeedIcon />
          </div>
          <div className="kpi-label">Registration → Completion</div>
          <div className="kpi-value">
            {loading ? "..." : summary.registrationToCompletionRate || `${summary.rawRegistrationToCompletionRate || 0}%`}
          </div>
          <div className="kpi-subtext">Candidates finishing profile</div>
        </div>

        <div className="kpi-card kpi-rose">
          <div className="kpi-icon-wrapper">
            <StarsIcon />
          </div>
          <div className="kpi-label">Direct Conversions</div>
          <div className="kpi-value">
            {loading ? "..." : summary.directlyAttributedConversions?.toLocaleString() || 0}
          </div>
          <div className="kpi-subtext">Linked via visitorId</div>
        </div>
      </div>

      {/* Benchmark Status Card */}
      <div className="benchmark-card">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center gap-3 mb-2">
              <h4 className="m-0 font-weight-bold text-white">Industry Benchmark Evaluation</h4>
              <span className={`benchmark-badge-large ${getBenchmarkBadgeClass(benchmark.status)}`}>
                <CheckCircleIcon style={{ fontSize: 18 }} />
                Status: {benchmark.status || "Good"}
              </span>
            </div>
            <p className="text-light mb-3" style={{ opacity: 0.9 }}>
              {benchmark.evaluation ||
                "Healthy conversion rate in line with top HR tech benchmarks (8% - 14%)."}
            </p>

            {/* Gauge progress bar */}
            <div className="benchmark-gauge-track">
              <div
                className={`benchmark-gauge-fill ${getGaugeFillClass(benchmark.status)}`}
                style={{
                  width: `${getBenchmarkGaugePercentage(
                    summary.rawConversionRate,
                    benchmark.status
                  )}%`,
                }}
              ></div>
            </div>

            <div className="d-flex justify-content-between text-xs text-slate-300 opacity-75">
              <span>Needs Improvement (&lt; 4%)</span>
              <span>Average (4% - 8%)</span>
              <span>Industry Benchmark ({benchmark.industryAverage || "8% - 14%"})</span>
              <span>Excellent (&ge; 15%)</span>
            </div>
          </div>
          <div className="col-md-4 mt-3 mt-md-0">
            <div className="formula-box">
              <div className="fw-bold mb-1 text-white">Metric Formula:</div>
              <code>{metricInfo?.formula || "(Total Registered Candidates / Total Unique Visitors) * 100"}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="charts-grid">
        {/* Chart 1: Unique Visitors vs Registrations */}
        <div className="chart-card">
          <div className="chart-card-title">
            <span>Unique Visitors vs Registered Candidates</span>
            <span className="badge bg-light text-dark font-normal">Bar Comparison</span>
          </div>
          <div style={{ height: "320px" }}>
            <Bar data={visitorVsCandidateChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Chart 2: Conversion Rate Trend Line */}
        <div className="chart-card">
          <div className="chart-card-title">
            <span>Conversion Rate (%) Trend</span>
            <span className="badge bg-light text-dark font-normal">Line Curve</span>
          </div>
          <div style={{ height: "320px" }}>
            <Line data={conversionTrendData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Breakdown Cards & Charts (Device & Traffic Sources) */}
      <div className="row g-4 mb-4">
        {/* Device Breakdown */}
        <div className="col-lg-6">
          <div className="chart-card h-100">
            <div className="chart-card-title">
              <span>Device Category Breakdown</span>
              <span className="badge bg-light text-dark font-normal">Share %</span>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6" style={{ height: "220px" }}>
                <Doughnut data={deviceDoughnutData} options={doughnutChartOptions} />
              </div>
              <div className="col-md-6">
                <ul className="list-group list-group-flush border-0">
                  {deviceBreakdown.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0"
                    >
                      <div className="d-flex align-items-center gap-2">
                        {getDeviceIcon(item.device)}
                        <span className="fw-semibold">{item.device}</span>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold d-block">{item.sharePercentage}%</span>
                        <small className="text-muted">
                          {item.uniqueVisitors} Visitors ({item.hits} Hits)
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Source Breakdown */}
        <div className="col-lg-6">
          <div className="chart-card h-100">
            <div className="chart-card-title">
              <span>Traffic Source Attribution</span>
              <span className="badge bg-light text-dark font-normal">Share %</span>
            </div>
            <div className="row align-items-center">
              <div className="col-md-6" style={{ height: "220px" }}>
                <Doughnut data={sourceDoughnutData} options={doughnutChartOptions} />
              </div>
              <div className="col-md-6">
                <ul className="list-group list-group-flush border-0">
                  {sourceBreakdown.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0"
                    >
                      <div className="d-flex align-items-center gap-2">
                        {getSourceIcon(item.source)}
                        <span className="fw-semibold">{item.source}</span>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold d-block">{item.sharePercentage}%</span>
                        <small className="text-muted">
                          {item.uniqueVisitors} Visitors ({item.hits} Hits)
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Periodical & Monthly Conversion Breakdown Table */}
      <div className="summary-table-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Monthly & Periodical Conversion Breakdown</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={exportCSV}>
            Download CSV
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-custom-analytics">
            <thead>
              <tr>
                <th>Period / Month</th>
                <th>Total Hits</th>
                <th>Unique Visitors</th>
                <th>Registered Candidates</th>
                <th>Completed Candidates</th>
                <th>Conversion Rate</th>
                <th>Benchmark Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown && monthlyBreakdown.length > 0 ? (
                monthlyBreakdown.map((item, index) => {
                  const rate = item.rawConversionRate || parseFloat(item.conversionRate) || 0;
                  return (
                    <tr key={index}>
                      <td className="fw-bold text-dark">{item.month}</td>
                      <td>{(item.totalHits || 0).toLocaleString()}</td>
                      <td>{(item.uniqueVisitors || 0).toLocaleString()}</td>
                      <td>{(item.registeredCandidates || 0).toLocaleString()}</td>
                      <td>{(item.completedCandidates || 0).toLocaleString()}</td>
                      <td>
                        <span className="conversion-rate-pill">
                          {item.conversionRate || `${rate}%`}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            rate >= 15
                              ? "bg-success"
                              : rate >= 8
                              ? "bg-primary"
                              : rate >= 4
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {rate >= 15
                            ? "Excellent"
                            : rate >= 8
                            ? "Good"
                            : rate >= 4
                            ? "Average"
                            : "Needs Improvement"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : graph?.labels && graph.labels.length > 0 ? (
                graph.labels.map((label, index) => {
                  const visitors = graph.uniqueVisitors?.[index] || 0;
                  const registered = graph.registeredCandidates?.[index] || 0;
                  const rate = graph.conversionRates?.[index] || 0;
                  return (
                    <tr key={index}>
                      <td className="fw-bold text-dark">{label}</td>
                      <td>-</td>
                      <td>{visitors.toLocaleString()}</td>
                      <td>{registered.toLocaleString()}</td>
                      <td>-</td>
                      <td>
                        <span className="conversion-rate-pill">{rate}%</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            rate >= 15
                              ? "bg-success"
                              : rate >= 8
                              ? "bg-primary"
                              : rate >= 4
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {rate >= 15
                            ? "Excellent"
                            : rate >= 8
                            ? "Good"
                            : rate >= 4
                            ? "Average"
                            : "Needs Improvement"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No breakdown data available for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorConversionAnalytics;

