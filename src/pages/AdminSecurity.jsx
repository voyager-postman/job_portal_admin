import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const DEFAULT_THRESHOLDS = {
  generalMaxPer15Min: 100,
  searchBurstPer10Sec: 20,
  searchSustainedPer15Min: 30,
  loginMaxPer15Min: 5,
  passwordResetMaxPerHour: 3,
  authMaxPer15Min: 50,
  resumeDownloadPer15Min: 30,
  candidateListPerHour: 60,
  publicIpMaxPerHour: 80,
  alertAfterViolations: 5,
  banAfterViolations: 10,
  suspendAfterViolations: 15,
  banWindowSec: 300,
  banDurationSec: 1800,
};

const RATE_LIMIT_THRESHOLD_FIELDS = [
  { key: "generalMaxPer15Min", label: "General max per 15 min" },
  { key: "searchBurstPer10Sec", label: "Search burst per 10 sec" },
  { key: "searchSustainedPer15Min", label: "Search sustained per 15 min" },
  { key: "loginMaxPer15Min", label: "Login max per 15 min" },
  { key: "passwordResetMaxPerHour", label: "Password reset max per hour" },
  { key: "authMaxPer15Min", label: "Auth / register max per 15 min" },
  { key: "resumeDownloadPer15Min", label: "Resume download max per 15 min" },
  { key: "candidateListPerHour", label: "Candidate list per hour" },
  { key: "publicIpMaxPerHour", label: "Public IP max per hour" },
];

const VIOLATION_THRESHOLD_FIELDS = [
  { key: "alertAfterViolations", label: "Alert after violations" },
  { key: "banAfterViolations", label: "Ban after violations" },
  { key: "suspendAfterViolations", label: "Suspend after violations" },
  { key: "banWindowSec", label: "Ban window (seconds)" },
  { key: "banDurationSec", label: "Ban duration (seconds)" },
];

const EVENT_TYPES = [
  "RATE_LIMIT",
  "IP_BANNED",
  "USER_RATE_LIMIT",
  "SUSPICIOUS_PATTERN",
  "ADMIN_ACTION",
];

const SEVERITIES = ["low", "medium", "high", "critical"];
const ALERT_STATUSES = ["open", "dismissed", "resolved"];
const USER_ROLES = ["JobSeeker", "Recruiter", "Company"];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const formatTtl = (seconds) => {
  if (!seconds && seconds !== 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs ? `${mins}m ${secs}s` : `${mins}m`;
};

const formatWindow = (limit) => {
  if (!limit) return "—";
  if (limit.windowLabel) return limit.windowLabel;
  if (limit.windowMinutes != null) {
    return limit.windowMinutes === 1 ? "1 min" : `${limit.windowMinutes} min`;
  }
  if (limit.windowMin != null) {
    return limit.windowMin === 1 ? "1 min" : `${limit.windowMin} min`;
  }
  if (limit.windowSec != null) {
    return limit.windowSec === 1 ? "1 sec" : `${limit.windowSec} sec`;
  }
  if (limit.windowMs != null) {
    const mins = Math.round(limit.windowMs / 60000);
    return mins === 1 ? "1 min" : `${mins} min`;
  }
  return "—";
};

const formatRateLimit = (limit, defaultWindowMinutes) => {
  if (limit == null) return "—";

  if (typeof limit === "number") {
    return defaultWindowMinutes
      ? `${limit} / ${defaultWindowMinutes} min`
      : String(limit);
  }

  const max = limit.max ?? limit.limit ?? limit.count;
  if (max == null) return "—";
  const window = formatWindow(limit);
  return window !== "—" ? `${max} / ${window}` : String(max);
};

const SeverityBadge = ({ severity }) => {
  const map = {
    critical: "bg-danger",
    high: "bg-warning text-dark",
    medium: "bg-info text-dark",
    low: "bg-secondary",
  };
  return (
    <span className={`badge ${map[severity] || "bg-secondary"}`}>
      {severity || "—"}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    open: "bg-danger",
    dismissed: "bg-secondary",
    resolved: "bg-success",
  };
  return (
    <span className={`badge ${map[status] || "bg-secondary"}`}>
      {status || "—"}
    </span>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible =
    totalPages <= 7
      ? pages
      : pages.filter(
          (p) =>
            p === 1 || p === totalPages || Math.abs(p - page) <= 1,
        );

  return (
    <div className="d-flex justify-content-center mt-3 flex-wrap gap-1">
      <button
        className="btn btn-sm btn-primary"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p}>
            {showEllipsis && (
              <span className="btn btn-sm btn-link disabled px-1">…</span>
            )}
            <button
              className={`btn btn-sm ${
                page === p ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        className="btn btn-sm btn-primary"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

function AdminSecurity() {
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [governanceLoading, setGovernanceLoading] = useState(false);
  const [governanceSaving, setGovernanceSaving] = useState(false);
  const [governance, setGovernance] = useState({
    enabled: true,
    autoSuspendOnCritical: false,
    protectAdminAccess: false,
    whitelistedIps: [],
    thresholds: { ...DEFAULT_THRESHOLDS },
    monitoredEndpoints: [],
  });
  const [endpointsInput, setEndpointsInput] = useState("");
  const [whitelistedIpsInput, setWhitelistedIpsInput] = useState("");

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsPage, setAlertsPage] = useState(1);
  const [alertsLimit, setAlertsLimit] = useState(20);
  const [alertsTotalPages, setAlertsTotalPages] = useState(1);
  const [alertsTotal, setAlertsTotal] = useState(0);
  const [alertFilters, setAlertFilters] = useState({
    status: "",
    severity: "",
    eventType: "",
    role: "",
    search: "",
  });

  const [abusiveUsers, setAbusiveUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(20);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersFilters, setUsersFilters] = useState({ role: "", search: "" });

  const [abusiveIps, setAbusiveIps] = useState([]);
  const [ipsLoading, setIpsLoading] = useState(false);
  const [ipsPage, setIpsPage] = useState(1);
  const [ipsLimit, setIpsLimit] = useState(20);
  const [ipsTotalPages, setIpsTotalPages] = useState(1);
  const [ipSearch, setIpSearch] = useState("");

  const [bannedIps, setBannedIps] = useState([]);
  const [bannedLoading, setBannedLoading] = useState(false);

  const [userDetail, setUserDetail] = useState(null);
  const [userRoutesLoading, setUserRoutesLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [rateLimits, setRateLimits] = useState(null);
  const [rateLimitsLoading, setRateLimitsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get(`${API_BASE_URL}admin/security/stats`);
      setStats(res.data?.data ?? res.data);
    } catch {
      toast.error("Failed to load security stats");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchGovernance = async () => {
    try {
      setGovernanceLoading(true);
      const res = await axios.get(`${API_BASE_URL}admin/security/governance`);
      const data = res.data?.data ?? res.data;
      setGovernance({
        enabled: data.enabled ?? true,
        autoSuspendOnCritical: data.autoSuspendOnCritical ?? false,
        protectAdminAccess: data.protectAdminAccess ?? false,
        whitelistedIps: data.whitelistedIps ?? [],
        thresholds: { ...DEFAULT_THRESHOLDS, ...data.thresholds },
        monitoredEndpoints: data.monitoredEndpoints ?? [],
      });
      setEndpointsInput((data.monitoredEndpoints ?? []).join("\n"));
      setWhitelistedIpsInput((data.whitelistedIps ?? []).join("\n"));
    } catch {
      toast.error("Failed to load security settings");
    } finally {
      setGovernanceLoading(false);
    }
  };

  const fetchAlerts = useCallback(async () => {
    try {
      setAlertsLoading(true);
      const params = { page: alertsPage, limit: alertsLimit };
      if (alertFilters.status) params.status = alertFilters.status;
      if (alertFilters.severity) params.severity = alertFilters.severity;
      if (alertFilters.eventType) params.eventType = alertFilters.eventType;
      if (alertFilters.role) params.role = alertFilters.role;
      if (alertFilters.search) params.search = alertFilters.search;

      const res = await axios.get(`${API_BASE_URL}admin/security/alerts`, {
        params,
      });
      setAlerts(res.data?.data ?? []);
      setAlertsTotalPages(res.data?.totalPages ?? 1);
      setAlertsTotal(res.data?.total ?? 0);
    } catch {
      toast.error("Failed to load alerts");
    } finally {
      setAlertsLoading(false);
    }
  }, [alertsPage, alertsLimit, alertFilters]);

  const fetchAbusiveUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const params = { page: usersPage, limit: usersLimit };
      if (usersFilters.role) params.role = usersFilters.role;
      if (usersFilters.search) params.search = usersFilters.search;

      const res = await axios.get(
        `${API_BASE_URL}admin/security/abusive-users`,
        { params },
      );
      setAbusiveUsers(res.data?.data ?? []);
      setUsersTotalPages(res.data?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load suspicious users");
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, usersLimit, usersFilters]);

  const fetchAbusiveIps = useCallback(async () => {
    try {
      setIpsLoading(true);
      const params = { page: ipsPage, limit: ipsLimit };
      if (ipSearch) params.search = ipSearch;

      const res = await axios.get(`${API_BASE_URL}admin/security/abusive-ips`, {
        params,
      });
      setAbusiveIps(res.data?.data ?? []);
      setIpsTotalPages(res.data?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load abusive IPs");
    } finally {
      setIpsLoading(false);
    }
  }, [ipsPage, ipsLimit, ipSearch]);

  const fetchRateLimits = async () => {
    try {
      setRateLimitsLoading(true);
      const res = await axios.get(`${API_BASE_URL}admin/security/rate-limits`);
      setRateLimits(res.data?.data ?? res.data);
    } catch {
      toast.error("Failed to load rate limit configuration");
      setRateLimits(null);
    } finally {
      setRateLimitsLoading(false);
    }
  };

  const fetchBannedIps = async () => {
    try {
      setBannedLoading(true);
      const res = await axios.get(`${API_BASE_URL}admin/security/banned-ips`);
      setBannedIps(res.data?.data ?? []);
    } catch {
      toast.error("Failed to load banned IPs");
    } finally {
      setBannedLoading(false);
    }
  };

  const fetchUserRoutes = async (userId) => {
    try {
      setUserRoutesLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}admin/security/users/${userId}/routes`,
      );
      setUserDetail(res.data?.data ?? res.data);
    } catch {
      toast.error("Failed to load user route details");
      setUserDetail(null);
    } finally {
      setUserRoutesLoading(false);
    }
  };

  const performAction = async (body, successMsg) => {
    try {
      setActionLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}admin/security/action`,
        body,
      );
      if (res.data?.success !== false) {
        toast.success(successMsg || res.data?.message || "Action completed");
        return true;
      }
      toast.error(res.data?.message || "Action failed");
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const confirmAction = async (title, text, body, successMsg) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2e47cc",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, proceed",
    });
    if (!result.isConfirmed) return;
    const ok = await performAction(body, successMsg);
    if (ok) refreshCurrentTab();
    return ok;
  };

  const refreshCurrentTab = () => {
    if (activeTab === "overview") fetchStats();
    else if (activeTab === "alerts") fetchAlerts();
    else if (activeTab === "users") fetchAbusiveUsers();
    else if (activeTab === "public-ips") fetchAbusiveIps();
    else if (activeTab === "banned-ips") fetchBannedIps();
    else if (activeTab === "settings") fetchGovernance();
    else if (activeTab === "rate-limits") fetchRateLimits();
    if (activeTab !== "overview") fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "overview") return;
    if (activeTab === "alerts") fetchAlerts();
    else if (activeTab === "users") fetchAbusiveUsers();
    else if (activeTab === "public-ips") fetchAbusiveIps();
    else if (activeTab === "banned-ips") fetchBannedIps();
    else if (activeTab === "settings") fetchGovernance();
    else if (activeTab === "rate-limits") fetchRateLimits();
  }, [activeTab, fetchAlerts, fetchAbusiveUsers, fetchAbusiveIps]);

  const handleGovernanceChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setGovernance((prev) => ({ ...prev, [name]: checked }));
    } else {
      setGovernance((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThresholdChange = (e) => {
    const { name, value } = e.target;
    setGovernance((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [name]: Number(value),
      },
    }));
  };

  const handleEndpointsChange = (e) => {
    const value = e.target.value;
    setEndpointsInput(value);
    const endpoints = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setGovernance((prev) => ({ ...prev, monitoredEndpoints: endpoints }));
  };

  const handleWhitelistedIpsChange = (e) => {
    const value = e.target.value;
    setWhitelistedIpsInput(value);
    const ips = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setGovernance((prev) => ({ ...prev, whitelistedIps: ips }));
  };

  const buildGovernancePayload = () => {
    const thresholds = RATE_LIMIT_THRESHOLD_FIELDS.reduce(
      (acc, { key }) => {
        acc[key] = Number(governance.thresholds[key] ?? DEFAULT_THRESHOLDS[key]);
        return acc;
      },
      {},
    );

    VIOLATION_THRESHOLD_FIELDS.forEach(({ key }) => {
      thresholds[key] = Number(
        governance.thresholds[key] ?? DEFAULT_THRESHOLDS[key],
      );
    });

    return {
      ...governance,
      thresholds,
    };
  };

  const saveGovernance = async (e) => {
    e.preventDefault();
    try {
      setGovernanceSaving(true);
      const res = await axios.post(
        `${API_BASE_URL}admin/security/governance`,
        buildGovernancePayload(),
      );
      if (res.data?.success !== false) {
        toast.success("Security settings saved");
        fetchGovernance();
      } else {
        toast.error(res.data?.message || "Save failed");
      }
    } catch {
      toast.error("Failed to save security settings");
    } finally {
      setGovernanceSaving(false);
    }
  };

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setUserDetail(null);
    fetchUserRoutes(user.userId);
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
    setUserDetail(null);
  };

  const statCards = [
    {
      label: "Open Alerts",
      value: stats?.openAlerts ?? 0,
      icon: "fa-bell",
      color: "#e74c3c",
    },
    {
      label: "Critical Alerts",
      value: stats?.criticalAlerts ?? 0,
      icon: "fa-triangle-exclamation",
      color: "#c0392b",
    },
    {
      label: "Rate Limits (24h)",
      value: stats?.rateLimits24h ?? 0,
      icon: "fa-gauge-high",
      color: "#f39c12",
    },
    {
      label: "IP Bans (24h)",
      value: stats?.ipBans24h ?? 0,
      icon: "fa-ban",
      color: "#8e44ad",
    },
    {
      label: "Flagged Users",
      value: stats?.flaggedUsers ?? 0,
      icon: "fa-user-shield",
      color: "#2980b9",
    },
    {
      label: "Flagged Public IPs",
      value: stats?.flaggedPublicIps ?? 0,
      icon: "fa-globe",
      color: "#16a085",
    },
    {
      label: "Auto Suspended (24h)",
      value: stats?.autoSuspended24h ?? 0,
      icon: "fa-user-slash",
      color: "#d35400",
    },
  ];

  const effectiveLimits = rateLimits?.effectiveLimits ?? {};
  const hourlyLimits = rateLimits?.securityHourlyLimits ?? {};
  const envOverrides = rateLimits?.envOverrides ?? {};

  const rateLimitCards = [
    {
      label: "Resume Download",
      value: formatRateLimit(
        effectiveLimits.resumeDownload ??
          rateLimits?.resumeDownloadPer15Min,
        15,
      ),
      icon: "fa-file-pdf",
      color: "#e74c3c",
      description: "Protected resume & cover letter downloads",
    },
    {
      label: "Search (Burst)",
      value: formatRateLimit(effectiveLimits.searchBurst),
      icon: "fa-magnifying-glass",
      color: "#3498db",
      description: "Short-window search requests",
    },
    {
      label: "Search (Sustained)",
      value: formatRateLimit(effectiveLimits.searchSustained),
      icon: "fa-magnifying-glass-chart",
      color: "#2980b9",
      description: "Sustained search requests",
    },
    {
      label: "Login",
      value: formatRateLimit(effectiveLimits.login),
      icon: "fa-right-to-bracket",
      color: "#9b59b6",
      description: "Login & Google auth attempts",
    },
    {
      label: "Password Reset",
      value: formatRateLimit(effectiveLimits.passwordReset),
      icon: "fa-key",
      color: "#8e44ad",
      description: "Forgot / reset password requests",
    },
    {
      label: "Registration / Auth",
      value: formatRateLimit(effectiveLimits.auth),
      icon: "fa-user-plus",
      color: "#6c5ce7",
      description: "Register & verification email",
    },
    {
      label: "General API",
      value: formatRateLimit(effectiveLimits.general),
      icon: "fa-gauge-high",
      color: "#f39c12",
      description: "Default API rate limit",
    },
    {
      label: "Candidate List (Hourly)",
      value: formatRateLimit({
        max: hourlyLimits.candidateListPerHour,
        windowLabel: "1 hour",
      }),
      icon: "fa-users",
      color: "#16a085",
      description: "Security-monitored candidate list",
    },
    {
      label: "Public IP (Hourly)",
      value: formatRateLimit({
        max: hourlyLimits.publicIpMaxPerHour,
        windowLabel: "1 hour",
      }),
      icon: "fa-globe",
      color: "#1abc9c",
      description: "Public IP abuse threshold",
    },
  ];

  const activeEnvOverrides = Object.entries(envOverrides).filter(
    ([, value]) => value != null && value !== "",
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rate-limits", label: "Rate Limits" },
    { id: "alerts", label: "Alerts" },
    { id: "users", label: "Suspicious Users" },
    { id: "public-ips", label: "Public IP Abuse" },
    { id: "banned-ips", label: "Banned IPs" },
    { id: "settings", label: "Threshold Settings" },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />

      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Admin Security</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Security & Abuse Monitoring
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <ul className="nav nav-tabs flex-wrap">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  type="button"
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="tab-content p-3">
            {activeTab === "overview" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Security Dashboard</h6>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={fetchStats}
                    disabled={statsLoading}
                  >
                    <i className="fa-solid fa-rotate me-1" />
                    Refresh
                  </button>
                </div>
                {statsLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="super-dashboard-detail-info">
                    <div className="row g-3">
                      {statCards.map((card) => (
                        <div
                          className="col-lg-3 col-md-4 col-sm-6"
                          key={card.label}
                        >
                          <div className="super-dashboard-dashboard-box">
                            <div
                              className="super-dashboard-icon-box"
                              style={{ backgroundColor: card.color }}
                            >
                              <i className={`fa-solid ${card.icon}`} />
                            </div>
                            <div className="super-dashboard-box-detail">
                              <h5>{card.label}</h5>
                              <p>{card.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "rate-limits" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-1">Active Rate Limit Configuration</h6>
                    <small className="text-muted">
                      Server-side limits from environment — read-only
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={fetchRateLimits}
                    disabled={rateLimitsLoading}
                  >
                    <i className="fa-solid fa-rotate me-1" />
                    Refresh
                  </button>
                </div>

                {rateLimitsLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : rateLimits ? (
                  <>
                    <div className="super-dashboard-detail-info">
                      <div className="row g-3">
                        {rateLimitCards.map((card) => (
                          <div
                            className="col-lg-4 col-md-6"
                            key={card.label}
                          >
                            <div className="super-dashboard-dashboard-box">
                              <div
                                className="super-dashboard-icon-box"
                                style={{ backgroundColor: card.color }}
                              >
                                <i className={`fa-solid ${card.icon}`} />
                              </div>
                              <div className="super-dashboard-box-detail">
                                <h5>{card.label}</h5>
                                <p className="mb-0 fw-semibold">{card.value}</p>
                                <small className="text-muted">
                                  {card.description}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeEnvOverrides.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-2">Environment Overrides</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered mb-0">
                            <thead>
                              <tr>
                                <th>Variable</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeEnvOverrides.map(([key, value]) => (
                                <tr key={key}>
                                  <td>
                                    <code>{key}</code>
                                  </td>
                                  <td>{String(value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted text-center py-4">
                    Rate limit configuration unavailable.
                  </p>
                )}
              </div>
            )}

            {activeTab === "alerts" && (
              <div>
                <div className="row g-2 mb-3">
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={alertFilters.status}
                      onChange={(e) => {
                        setAlertFilters((f) => ({
                          ...f,
                          status: e.target.value,
                        }));
                        setAlertsPage(1);
                      }}
                    >
                      <option value="">All Status</option>
                      {ALERT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={alertFilters.severity}
                      onChange={(e) => {
                        setAlertFilters((f) => ({
                          ...f,
                          severity: e.target.value,
                        }));
                        setAlertsPage(1);
                      }}
                    >
                      <option value="">All Severity</option>
                      {SEVERITIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={alertFilters.eventType}
                      onChange={(e) => {
                        setAlertFilters((f) => ({
                          ...f,
                          eventType: e.target.value,
                        }));
                        setAlertsPage(1);
                      }}
                    >
                      <option value="">All Event Types</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={alertFilters.role}
                      onChange={(e) => {
                        setAlertFilters((f) => ({ ...f, role: e.target.value }));
                        setAlertsPage(1);
                      }}
                    >
                      <option value="">All Roles</option>
                      {USER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search email, name, IP, route..."
                      value={alertFilters.search}
                      onChange={(e) =>
                        setAlertFilters((f) => ({
                          ...f,
                          search: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setAlertsPage(1);
                          fetchAlerts();
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-sm btn-primary w-100"
                      onClick={() => {
                        setAlertsPage(1);
                        fetchAlerts();
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>

                <small className="text-muted d-block mb-2">
                  Total: {alertsTotal} alert(s)
                </small>

                {alertsLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Severity</th>
                          <th>Status</th>
                          <th>Endpoint</th>
                          <th>User / IP</th>
                          <th>Violations</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              No alerts found
                            </td>
                          </tr>
                        ) : (
                          alerts.map((alert) => (
                            <tr key={alert._id}>
                              <td>
                                <small>{alert.eventType}</small>
                                <br />
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {alert.message?.slice(0, 60)}
                                  {alert.message?.length > 60 ? "…" : ""}
                                </span>
                              </td>
                              <td>
                                <SeverityBadge severity={alert.severity} />
                              </td>
                              <td>
                                <StatusBadge status={alert.status} />
                              </td>
                              <td>
                                <code>{alert.endpoint || "—"}</code>
                              </td>
                              <td>
                                {alert.userEmail && (
                                  <div>
                                    {alert.userEmail}
                                    <br />
                                    <small className="text-muted">
                                      {alert.userRole}
                                    </small>
                                  </div>
                                )}
                                {alert.ip && (
                                  <small className="text-muted d-block">
                                    {alert.ip}
                                  </small>
                                )}
                              </td>
                              <td>{alert.violationCount ?? "—"}</td>
                              <td>
                                <small>{formatDate(alert.createdAt)}</small>
                              </td>
                              <td>
                                <div className="d-flex flex-wrap gap-1">
                                  {alert.status === "open" && (
                                    <>
                                      <button
                                        className="btn btn-xs btn-outline-secondary btn-sm"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          confirmAction(
                                            "Dismiss alert?",
                                            "Mark this alert as dismissed.",
                                            {
                                              action: "dismiss",
                                              alertId: alert._id,
                                            },
                                            "Alert dismissed",
                                          )
                                        }
                                      >
                                        Dismiss
                                      </button>
                                      <button
                                        className="btn btn-xs btn-outline-success btn-sm"
                                        disabled={actionLoading}
                                        onClick={() =>
                                          confirmAction(
                                            "Resolve alert?",
                                            "Mark this alert as resolved.",
                                            {
                                              action: "resolve",
                                              alertId: alert._id,
                                            },
                                            "Alert resolved",
                                          )
                                        }
                                      >
                                        Resolve
                                      </button>
                                    </>
                                  )}
                                  {alert.ip && (
                                    <button
                                      className="btn btn-xs btn-outline-danger btn-sm"
                                      disabled={actionLoading}
                                      onClick={() =>
                                        confirmAction(
                                          "Ban IP?",
                                          `Ban ${alert.ip} on all APIs.`,
                                          { action: "ban_ip", ip: alert.ip },
                                          "IP banned",
                                        )
                                      }
                                    >
                                      Ban IP
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="d-flex align-items-center gap-2 mt-2">
                  <small>Show</small>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                    value={alertsLimit}
                    onChange={(e) => {
                      setAlertsLimit(Number(e.target.value));
                      setAlertsPage(1);
                    }}
                  >
                    {[10, 20, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <small>per page</small>
                </div>
                <Pagination
                  page={alertsPage}
                  totalPages={alertsTotalPages}
                  onPageChange={setAlertsPage}
                />
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className="row g-2 mb-3">
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-sm"
                      value={usersFilters.role}
                      onChange={(e) => {
                        setUsersFilters((f) => ({
                          ...f,
                          role: e.target.value,
                        }));
                        setUsersPage(1);
                      }}
                    >
                      <option value="">All Roles</option>
                      {USER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search by email or name..."
                      value={usersFilters.search}
                      onChange={(e) =>
                        setUsersFilters((f) => ({
                          ...f,
                          search: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setUsersPage(1);
                          fetchAbusiveUsers();
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setUsersPage(1);
                        fetchAbusiveUsers();
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Events</th>
                          <th>Open</th>
                          <th>Last IP</th>
                          <th>Severity</th>
                          <th>Last Seen</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {abusiveUsers.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              No suspicious users found
                            </td>
                          </tr>
                        ) : (
                          abusiveUsers.map((item) => (
                            <tr key={item.userId}>
                              <td>
                                <strong>
                                  {item.user?.first_name} {item.user?.last_name}
                                </strong>
                                <br />
                                <small>{item.userEmail || item.user?.email}</small>
                                <br />
                                <small className="text-muted">
                                  Status: {item.user?.status ?? "—"}
                                </small>
                              </td>
                              <td>{item.userRole}</td>
                              <td>{item.totalEvents}</td>
                              <td>{item.openEvents}</td>
                              <td>
                                <code>{item.lastIp || "—"}</code>
                              </td>
                              <td>
                                <SeverityBadge severity={item.highestSeverity} />
                              </td>
                              <td>
                                <small>{formatDate(item.lastSeenAt)}</small>
                              </td>
                              <td>
                                <div className="d-flex flex-wrap gap-1">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => openUserDetail(item)}
                                  >
                                    Details
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-warning"
                                    disabled={actionLoading}
                                    onClick={() =>
                                      confirmAction(
                                        "Suspend user?",
                                        `Suspend ${item.userEmail || "this user"}?`,
                                        {
                                          action: "suspend_user",
                                          userId: item.userId,
                                          ip: item.lastIp,
                                        },
                                        "User suspended",
                                      )
                                    }
                                  >
                                    Suspend
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={actionLoading}
                                    onClick={() =>
                                      confirmAction(
                                        "Block user?",
                                        `Block ${item.userEmail || "this user"} and ban their IP?`,
                                        {
                                          action: "block_user",
                                          userId: item.userId,
                                          ip: item.lastIp,
                                        },
                                        "User blocked",
                                      )
                                    }
                                  >
                                    Block
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    disabled={actionLoading}
                                    onClick={() =>
                                      confirmAction(
                                        "Unsuspend user?",
                                        `Reactivate ${item.userEmail || "this user"}?`,
                                        {
                                          action: "unsuspend_user",
                                          userId: item.userId,
                                        },
                                        "User unsuspended",
                                      )
                                    }
                                  >
                                    Unsuspend
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                <Pagination
                  page={usersPage}
                  totalPages={usersTotalPages}
                  onPageChange={setUsersPage}
                />
              </div>
            )}

            {activeTab === "public-ips" && (
              <div>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search by IP address..."
                      value={ipSearch}
                      onChange={(e) => setIpSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIpsPage(1);
                          fetchAbusiveIps();
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setIpsPage(1);
                        fetchAbusiveIps();
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                {ipsLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>IP Address</th>
                          <th>Total Events</th>
                          <th>Open Events</th>
                          <th>Exploited Routes</th>
                          <th>Banned</th>
                          <th>Ban TTL</th>
                          <th>Severity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {abusiveIps.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              No abusive IPs found
                            </td>
                          </tr>
                        ) : (
                          abusiveIps.map((item) => (
                            <tr key={item.ip}>
                              <td>
                                <code>{item.ip}</code>
                              </td>
                              <td>{item.totalEvents}</td>
                              <td>{item.openEvents}</td>
                              <td>
                                {(item.exploitedRoutes || []).map((r) => (
                                  <span
                                    key={r}
                                    className="badge bg-light text-dark me-1 mb-1"
                                  >
                                    {r}
                                  </span>
                                ))}
                              </td>
                              <td>
                                {item.currentlyBanned ? (
                                  <span className="badge bg-danger">Yes</span>
                                ) : (
                                  <span className="badge bg-success">No</span>
                                )}
                              </td>
                              <td>{formatTtl(item.banTtl)}</td>
                              <td>
                                <SeverityBadge severity={item.highestSeverity} />
                              </td>
                              <td>
                                {item.currentlyBanned ? (
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    disabled={actionLoading}
                                    onClick={() =>
                                      confirmAction(
                                        "Unban IP?",
                                        `Remove ban for ${item.ip}?`,
                                        { action: "unban_ip", ip: item.ip },
                                        "IP unbanned",
                                      )
                                    }
                                  >
                                    Unban
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={actionLoading}
                                    onClick={() =>
                                      confirmAction(
                                        "Ban IP?",
                                        `Ban ${item.ip} on all APIs?`,
                                        { action: "ban_ip", ip: item.ip },
                                        "IP banned",
                                      )
                                    }
                                  >
                                    Ban IP
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                <Pagination
                  page={ipsPage}
                  totalPages={ipsTotalPages}
                  onPageChange={setIpsPage}
                />
              </div>
            )}

            {activeTab === "banned-ips" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Currently Banned IPs</h6>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={fetchBannedIps}
                    disabled={bannedLoading}
                  >
                    Refresh
                  </button>
                </div>

                {bannedLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>IP Address</th>
                          <th>Status</th>
                          <th>TTL Remaining</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bannedIps.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-4">
                              No banned IPs
                            </td>
                          </tr>
                        ) : (
                          bannedIps.map((item) => (
                            <tr key={item.ip}>
                              <td>
                                <code>{item.ip}</code>
                              </td>
                              <td>
                                {item.banned ? (
                                  <span className="badge bg-danger">Banned</span>
                                ) : (
                                  <span className="badge bg-secondary">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td>{formatTtl(item.ttl)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  disabled={actionLoading || !item.banned}
                                  onClick={() =>
                                    confirmAction(
                                      "Unban IP?",
                                      `Remove ban for ${item.ip}?`,
                                      { action: "unban_ip", ip: item.ip },
                                      "IP unbanned",
                                    )
                                  }
                                >
                                  Unban
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                {governanceLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : (
                  <form onSubmit={saveGovernance}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <h6 className="fw-bold mb-3">General</h6>
                        <div className="form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="enabled"
                            name="enabled"
                            checked={governance.enabled}
                            onChange={handleGovernanceChange}
                          />
                          <label className="form-check-label" htmlFor="enabled">
                            Enable security monitoring
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="autoSuspendOnCritical"
                            name="autoSuspendOnCritical"
                            checked={governance.autoSuspendOnCritical}
                            onChange={handleGovernanceChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="autoSuspendOnCritical"
                          >
                            Auto-suspend on critical violations
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="protectAdminAccess"
                            name="protectAdminAccess"
                            checked={governance.protectAdminAccess}
                            onChange={handleGovernanceChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="protectAdminAccess"
                          >
                            Protect admin access (IP whitelist only)
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <h6 className="fw-bold mb-3">Whitelisted IPs</h6>
                        <textarea
                          className="form-control"
                          rows={6}
                          placeholder="One IP per line&#10;203.0.113.5&#10;198.51.100.10"
                          value={whitelistedIpsInput}
                          onChange={handleWhitelistedIpsChange}
                          disabled={!governance.protectAdminAccess}
                        />
                        <small className="text-muted">
                          Allowed public IPs for admin login when protection is
                          enabled
                        </small>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 mb-4">
                        <h6 className="fw-bold mb-3">Monitored Endpoints</h6>
                        <textarea
                          className="form-control"
                          rows={6}
                          placeholder="One endpoint per line&#10;/getCandidateList&#10;/getAllJob"
                          value={endpointsInput}
                          onChange={handleEndpointsChange}
                        />
                        <small className="text-muted">
                          API routes to monitor for abuse
                        </small>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">Rate Limit Thresholds</h6>
                    <div className="row g-3 mb-4">
                      {RATE_LIMIT_THRESHOLD_FIELDS.map(({ key, label }) => (
                        <div className="col-md-4" key={key}>
                          <label className="form-label">{label}</label>
                          <input
                            type="number"
                            className="form-control"
                            name={key}
                            min={0}
                            value={governance.thresholds[key]}
                            onChange={handleThresholdChange}
                          />
                        </div>
                      ))}
                    </div>

                    <h6 className="fw-bold mb-3">Violation Actions</h6>
                    <div className="row g-3 mb-4">
                      {VIOLATION_THRESHOLD_FIELDS.map(({ key, label }) => (
                        <div className="col-md-4" key={key}>
                          <label className="form-label">{label}</label>
                          <input
                            type="number"
                            className="form-control"
                            name={key}
                            min={0}
                            value={governance.thresholds[key]}
                            onChange={handleThresholdChange}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                      disabled={governanceSaving}
                    >
                      {governanceSaving ? "Saving…" : "Save Settings"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedUser && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Route Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeUserDetail}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3 p-3 bg-light rounded">
                  <strong>
                    {selectedUser.user?.first_name}{" "}
                    {selectedUser.user?.last_name}
                  </strong>
                  <br />
                  {selectedUser.userEmail || selectedUser.user?.email}
                  <br />
                  <small>
                    Role: {selectedUser.userRole} | Status:{" "}
                    {selectedUser.user?.status ?? "—"} | Last IP:{" "}
                    <code>{selectedUser.lastIp || "—"}</code>
                  </small>
                </div>

                {userRoutesLoading ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" />
                  </div>
                ) : userDetail ? (
                  <>
                    <p className="mb-2">
                      <strong>Total events:</strong> {userDetail.totalEvents}
                    </p>

                    <h6>Exploited Routes</h6>
                    <div className="table-responsive mb-3">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Endpoint</th>
                            <th>Hits</th>
                            <th>Event Types</th>
                            <th>Last Seen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(userDetail.exploitedRoutes || []).length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center">
                                No routes recorded
                              </td>
                            </tr>
                          ) : (
                            userDetail.exploitedRoutes.map((route) => (
                              <tr key={route.endpoint}>
                                <td>
                                  <code>{route.endpoint}</code>
                                </td>
                                <td>{route.hitCount}</td>
                                <td>
                                  {(route.eventTypes || []).map((t) => (
                                    <span
                                      key={t}
                                      className="badge bg-secondary me-1"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </td>
                                <td>
                                  <small>{formatDate(route.lastSeenAt)}</small>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <h6>Recent Events</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Endpoint</th>
                            <th>IP</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(userDetail.recentEvents || []).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center">
                                No recent events
                              </td>
                            </tr>
                          ) : (
                            userDetail.recentEvents.map((ev) => (
                              <tr key={ev._id || `${ev.endpoint}-${ev.createdAt}`}>
                                <td>{ev.eventType}</td>
                                <td>
                                  <SeverityBadge severity={ev.severity} />
                                </td>
                                <td>
                                  <code>{ev.endpoint}</code>
                                </td>
                                <td>{ev.ip || "—"}</td>
                                <td>
                                  <small>{formatDate(ev.createdAt)}</small>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-muted">Could not load route details.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-warning"
                  disabled={actionLoading}
                  onClick={async () => {
                    const ok = await confirmAction(
                      "Suspend user?",
                      "Suspend this user account?",
                      {
                        action: "suspend_user",
                        userId: selectedUser.userId,
                        ip: selectedUser.lastIp,
                      },
                      "User suspended",
                    );
                    if (ok) {
                      fetchUserRoutes(selectedUser.userId);
                    }
                  }}
                >
                  Suspend
                </button>
                <button
                  className="btn btn-outline-danger"
                  disabled={actionLoading}
                  onClick={async () => {
                    const ok = await confirmAction(
                      "Block user?",
                      "Block this user and ban their IP?",
                      {
                        action: "block_user",
                        userId: selectedUser.userId,
                        ip: selectedUser.lastIp,
                      },
                      "User blocked",
                    );
                    if (ok) closeUserDetail();
                  }}
                >
                  Block
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={closeUserDetail}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSecurity;
