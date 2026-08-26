import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../Url/Url";
import { getAuthToken, getAuthRequestConfig } from "../utils/authToken";
import { useDebounce } from "../hooks/useDebounce";
import "./AuditLogs.css";

// Common category definitions
const CATEGORIES = [
  { value: "USER_MANAGEMENT", label: "User Management", icon: "fa-solid fa-users", colorClass: "badge-cat-user" },
  { value: "JOB_MANAGEMENT", label: "Job Management", icon: "fa-solid fa-briefcase", colorClass: "badge-cat-job" },
  { value: "SECURITY", label: "Security", icon: "fa-solid fa-shield-halved", colorClass: "badge-cat-security" },
  { value: "AUTH", label: "Authentication", icon: "fa-solid fa-key", colorClass: "badge-cat-auth" },
  { value: "BILLING", label: "Billing & Plans", icon: "fa-solid fa-receipt", colorClass: "badge-cat-billing" },
  { value: "SETTINGS", label: "Settings", icon: "fa-solid fa-gear", colorClass: "badge-cat-settings" },
];

// Common action codes for quick selection
const COMMON_ACTIONS = [
  { value: "USER_BLOCKED", label: "USER_BLOCKED" },
  { value: "USER_UNBLOCKED", label: "USER_UNBLOCKED" },
  { value: "USER_DELETED", label: "USER_DELETED" },
  { value: "USER_REGISTERED", label: "USER_REGISTERED" },
  { value: "JOB_DELETED", label: "JOB_DELETED" },
  { value: "JOB_CREATED", label: "JOB_CREATED" },
  { value: "JOB_UPDATED", label: "JOB_UPDATED" },
  { value: "JOB_APPROVED", label: "JOB_APPROVED" },
  { value: "JOB_REJECTED", label: "JOB_REJECTED" },
  { value: "COMPANY_VERIFIED", label: "COMPANY_VERIFIED" },
  { value: "COMPANY_REJECTED", label: "COMPANY_REJECTED" },
  { value: "LOGIN_SUCCESS", label: "LOGIN_SUCCESS" },
  { value: "LOGIN_FAILED", label: "LOGIN_FAILED" },
  { value: "PASSWORD_RESET", label: "PASSWORD_RESET" },
  { value: "SETTINGS_UPDATED", label: "SETTINGS_UPDATED" },
  { value: "ADMIN_ACTION", label: "ADMIN_ACTION" },
];

const AuditLogs = () => {
  // Data state
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    userManagement: 0,
    jobManagement: 0,
    security: 0,
    auth: 0,
    billing: 0,
  });

  // Query Parameters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [action, setAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportingCsv, setExportingCsv] = useState(false);

  // Pagination stats
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal inspection state
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  // Debounced search input
  const debouncedSearch = useDebounce(search.trim(), 400);

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, action, limit, sortBy, sortOrder, startDate, endDate]);

  // Helper for auth headers (reads token directly from localStorage)
  const getHeaders = () => {
    const token = localStorage.getItem("token") || getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Format Date Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return { formatted: "—", relative: "" };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { formatted: String(dateStr), relative: "" };

      const formatted = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      // Calculate relative time
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      let relative = "";
      if (diffSec < 60) relative = "Just now";
      else if (diffMin < 60) relative = `${diffMin}m ago`;
      else if (diffHour < 24) relative = `${diffHour}h ago`;
      else if (diffDay < 7) relative = `${diffDay}d ago`;
      else relative = date.toLocaleDateString();

      return { formatted, relative };
    } catch {
      return { formatted: String(dateStr), relative: "" };
    }
  };

  // Helper to get Category Badge class
  const getCategoryBadgeClass = (cat) => {
    const upper = String(cat || "").toUpperCase();
    if (upper.includes("USER")) return "badge-cat-user";
    if (upper.includes("JOB")) return "badge-cat-job";
    if (upper.includes("SECURITY")) return "badge-cat-security";
    if (upper.includes("AUTH")) return "badge-cat-auth";
    if (upper.includes("BILLING") || upper.includes("PAYMENT") || upper.includes("INVOICE")) return "badge-cat-billing";
    if (upper.includes("SETTING") || upper.includes("CONFIG")) return "badge-cat-settings";
    return "badge-cat-default";
  };

  // Helper to get Action Badge class
  const getActionBadgeClass = (act) => {
    const upper = String(act || "").toUpperCase();
    if (upper.includes("DELETED") || upper.includes("BLOCKED") || upper.includes("REJECTED") || upper.includes("FAILED") || upper.includes("BANNED")) {
      return "badge-action-danger";
    }
    if (upper.includes("WARN") || upper.includes("SUSPICIOUS") || upper.includes("EXPIRED") || upper.includes("RESET")) {
      return "badge-action-warning";
    }
    if (upper.includes("CREATED") || upper.includes("VERIFIED") || upper.includes("SUCCESS") || upper.includes("APPROVED") || upper.includes("UNBLOCKED")) {
      return "badge-action-success";
    }
    return "badge-action-info";
  };

  // Helper to extract actor/user details
  const getActorInfo = (log) => {
    const actorObj = log.user || log.performedBy || log.actor || log.admin || {};

    // Check direct log fields from API schema (actorEmail, actorRole, actorId, actorName)
    const email = log.actorEmail || actorObj.email || log.userEmail || log.email || "";
    const role = log.actorRole || actorObj.role || log.userRole || log.role || "Admin";
    const id = log.actorId || actorObj._id || actorObj.id || log.userId || "";

    let name =
      log.actorName ||
      actorObj.name ||
      `${actorObj.first_name || ""} ${actorObj.last_name || ""}`.trim() ||
      actorObj.username ||
      log.userName ||
      "";

    // If name is null/empty, derive a clean name from email username or role
    if (!name || name === "null" || name === "undefined") {
      if (email) {
        const emailUser = email.split("@")[0];
        name = emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
      } else if (role && role !== "User") {
        name = role;
      } else {
        name = "System";
      }
    }

    const initials =
      name
        .split(/[\s._@-]+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AD";

    return { name, email, role, id, initials };
  };

  // Helper to extract clean target info
  const formatTarget = (log) => {
    const type = log.resourceType || log.targetType || log.entity || "";

    // Check targetUser
    if (log.targetUser && (log.targetUser.name || log.targetUser.email || log.targetUser.userId)) {
      const userVal = log.targetUser.name || log.targetUser.email || log.targetUser.userId;
      return {
        type: type || "User",
        value: String(userVal).trim(),
      };
    }

    // Check targetCompany
    if (log.targetCompany && (log.targetCompany.companyName || log.targetCompany.companyId)) {
      const compVal = log.targetCompany.companyName || log.targetCompany.companyId;
      return {
        type: type || "Company",
        value: String(compVal).trim(),
      };
    }

    let rawTarget = log.resourceId || log.targetName || log.targetId || log.entityId || "";
    if (typeof rawTarget === "object" && rawTarget !== null) {
      rawTarget = rawTarget.name || rawTarget.email || rawTarget.title || rawTarget._id || JSON.stringify(rawTarget);
    }

    const strTarget = String(rawTarget || "").trim();
    if (!type && !strTarget) return null;

    return {
      type: String(type || "Target"),
      value: strTarget,
    };
  };

  // Fetch overall category statistics independently so stat cards reflect true totals
  const fetchOverallStats = useCallback(async () => {
    try {
      const headers = getHeaders();

      // 1. Try dedicated stats endpoint if backend has it
      const statsRes = await axios
        .get(`${API_BASE_URL}admin/audit-logs/stats`, { headers })
        .catch(() => null);

      if (statsRes?.data) {
        const d = statsRes.data.data || statsRes.data;
        setStats((prev) => ({
          ...prev,
          total: d.total ?? d.totalLogs ?? prev.total,
          userManagement: d.userManagement ?? d.USER_MANAGEMENT ?? d.user ?? prev.userManagement,
          jobManagement: d.jobManagement ?? d.JOB_MANAGEMENT ?? d.job ?? prev.jobManagement,
          security: d.security ?? d.SECURITY ?? prev.security,
          auth: d.auth ?? d.AUTH ?? d.authentication ?? prev.auth,
        }));
        return;
      }

      // 2. Query total counts per main category in parallel with limit=1
      const [totalRes, userRes, jobRes, secRes, authRes, billingRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { limit: 1 } }),
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { category: "USER_MANAGEMENT", limit: 1 } }),
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { category: "JOB_MANAGEMENT", limit: 1 } }),
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { category: "SECURITY", limit: 1 } }),
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { category: "AUTH", limit: 1 } }),
        axios.get(`${API_BASE_URL}admin/audit-logs`, { headers, params: { category: "BILLING", limit: 1 } }),
      ]);

      const extractTotal = (res) => {
        if (res.status !== "fulfilled" || !res.value?.data) return 0;
        const d = res.value.data;
        if (typeof d.total === "number") return d.total;
        if (typeof d.totalLogs === "number") return d.totalLogs;
        if (typeof d.count === "number") return d.count;
        if (typeof d.totalRecords === "number") return d.totalRecords;
        if (typeof d.totalCount === "number") return d.totalCount;
        if (d.pagination) {
          if (typeof d.pagination.total === "number") return d.pagination.total;
          if (typeof d.pagination.totalLogs === "number") return d.pagination.totalLogs;
          if (typeof d.pagination.totalRecords === "number") return d.pagination.totalRecords;
          if (typeof d.pagination.count === "number") return d.pagination.count;
        }
        if (d.data) {
          if (typeof d.data.total === "number") return d.data.total;
          if (typeof d.data.totalLogs === "number") return d.data.totalLogs;
          if (typeof d.data.count === "number") return d.data.count;
          if (typeof d.data.totalRecords === "number") return d.data.totalRecords;
          if (typeof d.data.totalCount === "number") return d.data.totalCount;
          if (Array.isArray(d.data.logs)) return d.data.total ?? d.data.totalLogs ?? d.data.logs.length;
          if (Array.isArray(d.data)) return d.data.length;
        }
        if (Array.isArray(d.logs)) return d.total ?? d.totalLogs ?? d.logs.length;
        if (Array.isArray(d)) return d.length;
        return 0;
      };

      const totalVal = extractTotal(totalRes);
      const userVal = extractTotal(userRes);
      const jobVal = extractTotal(jobRes);
      const secVal = extractTotal(secRes);
      const authVal = extractTotal(authRes);
      const billingVal = extractTotal(billingRes);

      setStats((prev) => ({
        total: totalVal || prev.total,
        userManagement: userVal,
        jobManagement: jobVal,
        security: secVal,
        auth: authVal,
        billing: billingVal,
      }));
    } catch (err) {
      console.warn("Could not load overall audit stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Audit Logs from backend
  const fetchAuditLogs = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (action) params.action = action;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const headers = getHeaders();

      const response = await axios.get(`${API_BASE_URL}admin/audit-logs`, {
        headers,
        params,
      });

      const resData = response.data;

      // Handle varied API response formats safely
      let logsArray = [];
      let total = 0;
      let pages = 1;

      if (Array.isArray(resData)) {
        logsArray = resData;
        total = resData.length;
        pages = Math.ceil(total / limit) || 1;
      } else if (resData?.data) {
        if (Array.isArray(resData.data)) {
          logsArray = resData.data;
        } else if (Array.isArray(resData.data.logs)) {
          logsArray = resData.data.logs;
        } else if (Array.isArray(resData.data.auditLogs)) {
          logsArray = resData.data.auditLogs;
        }

        total =
          resData.pagination?.total ??
          resData.pagination?.totalLogs ??
          resData.total ??
          resData.data?.total ??
          resData.totalLogs ??
          logsArray.length;

        pages =
          resData.pagination?.totalPages ??
          resData.totalPages ??
          resData.data?.totalPages ??
          (Math.ceil(total / limit) || 1);
      } else if (Array.isArray(resData?.logs)) {
        logsArray = resData.logs;
        total = resData.pagination?.total ?? resData.total ?? logsArray.length;
        pages = resData.pagination?.totalPages ?? resData.totalPages ?? (Math.ceil(total / limit) || 1);
      }

      setLogs(logsArray);
      setTotalPages(Math.max(1, pages));
      setTotalRecords(total);

      // Check if backend returned overall stats in payload
      const apiStats = resData?.stats || resData?.summary || resData?.categoryCounts || resData?.data?.stats;
      if (apiStats) {
        setStats((prev) => ({
          ...prev,
          total: apiStats.total ?? prev.total,
          userManagement: apiStats.userManagement ?? apiStats.USER_MANAGEMENT ?? apiStats.user ?? prev.userManagement,
          jobManagement: apiStats.jobManagement ?? apiStats.JOB_MANAGEMENT ?? apiStats.job ?? prev.jobManagement,
          security: apiStats.security ?? apiStats.SECURITY ?? prev.security,
          auth: apiStats.auth ?? apiStats.AUTH ?? apiStats.authentication ?? prev.auth,
          billing: apiStats.billing ?? apiStats.BILLING ?? prev.billing,
        }));
      } else {
        // Sync stats based on the exact count returned for this filter
        if (category === "USER_MANAGEMENT" && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, userManagement: total }));
        } else if (category === "JOB_MANAGEMENT" && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, jobManagement: total }));
        } else if (category === "SECURITY" && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, security: total }));
        } else if (category === "AUTH" && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, auth: total }));
        } else if (category === "BILLING" && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, billing: total }));
        } else if (!category && !debouncedSearch && !action && !startDate && !endDate) {
          setStats((prev) => ({ ...prev, total: total || prev.total }));
        }
      }

      if (isManualRefresh) {
        toast.success("Audit logs refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error(error.response?.data?.message || "Failed to load audit logs");
      setLogs([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, sortBy, sortOrder, debouncedSearch, category, action, startDate, endDate]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  useEffect(() => {
    fetchOverallStats();
  }, [fetchOverallStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setAction("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Direct CSV Export via Backend API endpoint (/api/admin/audit-logs/export)
  const handleExportServerCsv = async () => {
    try {
      setExportingCsv(true);
      const params = {
        format: "csv",
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      const response = await axios.get(`${API_BASE_URL}admin/audit-logs/export`, {
        params,
        headers: getHeaders(),
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `audit_logs_export_${startDate || "all"}_to_${endDate || "now"}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Audit logs CSV downloaded successfully");
    } catch (err) {
      console.error("CSV Export error:", err);
      toast.error(err?.response?.data?.message || "Failed to export audit logs CSV");
    } finally {
      setExportingCsv(false);
    }
  };

  // Export to Excel (Client-side from current dataset)
  const handleExportExcel = () => {
    if (!logs.length) {
      toast.warn("No audit log records available to export!");
      return;
    }

    try {
      const exportData = logs.map((item, index) => {
        const actor = getActorInfo(item);
        const dateInfo = formatDate(item.createdAt || item.timestamp);
        return {
          "S.No": (page - 1) * limit + index + 1,
          "Log ID": item._id || item.id || "—",
          "Timestamp": dateInfo.formatted,
          "Category": item.category || "—",
          "Action Code": item.action || "—",
          "Description": item.description || item.message || item.details || "—",
          "Performed By": actor.name,
          "User Email": actor.email,
          "User Role": actor.role,
          "IP Address": item.ipAddress || item.ip || item.clientIp || "—",
          "Target Type": item.targetType || item.entity || "—",
          "Target ID": item.targetId || item.entityId || "—",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Audit_Logs");
      XLSX.writeFile(workbook, `audit_logs_${startDate || "all"}_to_${endDate || "now"}.xlsx`);
      toast.success("Audit logs exported to Excel successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export Excel file");
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = (data) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      toast.success("Log payload copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Pagination helper
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    return { items, start, end };
  };

  const { items: visiblePageNumbers, start: pageStart, end: pageEnd } = getPaginationItems();

  return (
    <section className="super-dashboard-content-wrapper audit-logs-container">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />

      {/* Header & Breadcrumb */}
      <div className="super-dashboard-breadcrumb-info">
        <h4>Log Data</h4>
      </div>

      <div className="super-dashboard-common-heading d-flex justify-content-between align-items-center mb-3">
        <h5>
          <Link to="/admin">
            <i className="fa-solid fa-angles-left me-2" />
          </Link>
          Audit Logs & System Activity
        </h5>
        <div className="audit-header-actions">
          <button
            className="btn btn-outline-primary btn-icon-label"
            onClick={() => {
              fetchAuditLogs(true);
              fetchOverallStats();
            }}
            disabled={loading || refreshing}
          >
            <i className={`fa-solid fa-arrows-rotate ${refreshing ? "fa-spin" : ""}`} />
            Refresh
          </button>
          <button
            className="btn btn-primary btn-icon-label"
            onClick={handleExportServerCsv}
            disabled={exportingCsv}
            title="Download CSV from /api/admin/audit-logs/export"
          >
            <i className={`fa-solid fa-file-csv ${exportingCsv ? "fa-spin" : ""}`} />
            {exportingCsv ? "Exporting CSV..." : "Export CSV (API)"}
          </button>
          <button
            className="btn btn-success btn-icon-label"
            onClick={handleExportExcel}
            disabled={loading || logs.length === 0}
          >
            <i className="fa-solid fa-file-excel" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="audit-stats-grid">
        <div
          className={`audit-stat-card ${category === "" ? "active-filter" : ""}`}
          onClick={() => setCategory("")}
        >
          <div className="audit-stat-content">
            <h6>Total Logs</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.total || totalRecords || 0)}
            </p>
          </div>
          <div className="audit-stat-icon all">
            <i className="fa-solid fa-list-check" />
          </div>
        </div>

        <div
          className={`audit-stat-card ${category === "USER_MANAGEMENT" ? "active-filter" : ""}`}
          onClick={() => setCategory(category === "USER_MANAGEMENT" ? "" : "USER_MANAGEMENT")}
        >
          <div className="audit-stat-content">
            <h6>User Activity</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.userManagement ?? 0)}
            </p>
          </div>
          <div className="audit-stat-icon user">
            <i className="fa-solid fa-users" />
          </div>
        </div>

        <div
          className={`audit-stat-card ${category === "JOB_MANAGEMENT" ? "active-filter" : ""}`}
          onClick={() => setCategory(category === "JOB_MANAGEMENT" ? "" : "JOB_MANAGEMENT")}
        >
          <div className="audit-stat-content">
            <h6>Job Operations</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.jobManagement ?? 0)}
            </p>
          </div>
          <div className="audit-stat-icon job">
            <i className="fa-solid fa-briefcase" />
          </div>
        </div>

        <div
          className={`audit-stat-card ${category === "SECURITY" ? "active-filter" : ""}`}
          onClick={() => setCategory(category === "SECURITY" ? "" : "SECURITY")}
        >
          <div className="audit-stat-content">
            <h6>Security Events</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.security ?? 0)}
            </p>
          </div>
          <div className="audit-stat-icon security">
            <i className="fa-solid fa-shield-halved" />
          </div>
        </div>

        <div
          className={`audit-stat-card ${category === "AUTH" ? "active-filter" : ""}`}
          onClick={() => setCategory(category === "AUTH" ? "" : "AUTH")}
        >
          <div className="audit-stat-content">
            <h6>Auth / Logins</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.auth ?? 0)}
            </p>
          </div>
          <div className="audit-stat-icon auth">
            <i className="fa-solid fa-key" />
          </div>
        </div>

        <div
          className={`audit-stat-card ${category === "BILLING" ? "active-filter" : ""}`}
          onClick={() => setCategory(category === "BILLING" ? "" : "BILLING")}
        >
          <div className="audit-stat-content">
            <h6>Billing & Plans</h6>
            <p className="stat-value">
              {statsLoading ? <span className="stat-shimmer" /> : (stats.billing ?? 0)}
            </p>
          </div>
          <div className="audit-stat-icon billing">
            <i className="fa-solid fa-receipt" />
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filters Bar */}
      <div className="audit-filter-card">
        <div className="filter-grid">
          {/* Search Box */}
          <div className="filter-group" style={{ gridColumn: "span 2" }}>
            <label>Search Query</label>
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                className="form-control"
                placeholder="Search by email, name, description, IP, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>

          {/* Start Date Filter */}
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date Filter */}
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="filter-group">
            <label>Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Code Dropdown */}
          <div className="filter-group">
            <label>Action Code</label>
            <select
              className="form-select"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="">All Action Codes</option>
              {COMMON_ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Field */}
          <div className="filter-group">
            <label>Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Timestamp</option>
              <option value="category">Category</option>
              <option value="action">Action Code</option>
              <option value="performedBy">User / Actor</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-group">
            <label>Sort Order</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First (Desc)</option>
              <option value="asc">Oldest First (Asc)</option>
            </select>
          </div>

          {/* Page Limit */}
          <div className="filter-group">
            <label>Per Page</label>
            <select
              className="form-select"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10 records</option>
              <option value={20}>20 records (Default)</option>
              <option value={50}>50 records</option>
              <option value={100}>100 records</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="filter-group">
            <label>&nbsp;</label>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 btn-icon-label justify-content-center"
              onClick={handleResetFilters}
            >
              <i className="fa-solid fa-filter-circle-xmark" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="audit-table-card">
        <div className="audit-table-header-info">
          <div className="table-records-count">
            Showing <strong>{logs.length}</strong> of <strong>{totalRecords}</strong> total log entries
            {category && (
              <span className="ms-2 badge bg-primary">
                Category: {category}
              </span>
            )}
            {action && (
              <span className="ms-2 badge bg-dark">
                Action: {action}
              </span>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: "12px" }}>Page {page} of {totalPages}</span>
          </div>
        </div>

        <div className="audit-table-responsive">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mb-0">Fetching audit logs from server...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="audit-empty-state">
              <i className="fa-solid fa-folder-open" />
              <h5>No Audit Logs Found</h5>
              <p>There are no audit log entries matching your current filters and search query.</p>
              <button
                className="btn btn-primary btn-sm btn-icon-label"
                onClick={handleResetFilters}
              >
                <i className="fa-solid fa-arrows-rotate" />
                Clear Filters
              </button>
            </div>
          ) : (
            <table className="audit-custom-table">
              <colgroup>
                <col style={{ width: "45px" }} />
                <col style={{ width: "155px" }} />
                <col style={{ width: "135px" }} />
                <col style={{ width: "185px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "170px" }} />
                <col style={{ width: "125px" }} />
                <col style={{ width: "80px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>#</th>
                  <th>Timestamp</th>
                  <th>Category</th>
                  <th>Action Code</th>
                  <th>Description</th>
                  <th>Performed By</th>
                  <th>IP Address</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => {
                  const actor = getActorInfo(log);
                  const dateInfo = formatDate(log.createdAt || log.timestamp);
                  const categoryClass = getCategoryBadgeClass(log.category);
                  const actionClass = getActionBadgeClass(log.action);
                  const description =
                    typeof log.description === "string"
                      ? log.description
                      : log.message || log.details || "—";
                  const ip = log.ipAddress || log.ip || log.clientIp || "—";
                  const targetInfo = formatTarget(log);

                  return (
                    <tr key={log._id || log.id || index}>
                      {/* S.No */}
                      <td style={{ textAlign: "center" }}>
                        <span className="text-muted fw-bold" style={{ fontSize: "12px" }}>
                          {(page - 1) * limit + index + 1}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td>
                        <div className="audit-time-cell">
                          <span className="audit-time-primary" title={dateInfo.formatted}>
                            {dateInfo.formatted}
                          </span>
                          {dateInfo.relative && (
                            <span className="audit-time-relative">{dateInfo.relative}</span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className={`badge-category ${categoryClass}`} title={log.category}>
                          {log.category || "GENERAL"}
                        </span>
                      </td>

                      {/* Action Code */}
                      <td>
                        <span className={`badge-action-code ${actionClass}`} title={log.action}>
                          {log.action || "UNKNOWN_ACTION"}
                        </span>
                      </td>

                      {/* Description & Target */}
                      <td>
                        <div className="audit-desc-wrapper">
                          <div className="audit-desc-text" title={description}>
                            {description}
                          </div>
                          {targetInfo && (
                            <div
                              className="audit-target-container"
                              title={`${targetInfo.type}: ${targetInfo.value}`}
                            >
                              <span className="audit-target-badge">
                                <span className="target-type-label">{targetInfo.type}:</span>
                                <span className="target-val-text">{targetInfo.value}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Performed By */}
                      <td>
                        <div className="audit-user-cell" title={`${actor.name} (${actor.email || actor.role})`}>
                          <div className="audit-user-avatar">
                            {actor.initials}
                          </div>
                          <div className="audit-user-info">
                            <span className="audit-user-name">{actor.name}</span>
                            {actor.email && (
                              <span className="audit-user-email">{actor.email}</span>
                            )}
                            <span className="audit-user-role">{actor.role}</span>
                          </div>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td>
                        <span className="audit-ip-badge" title={ip}>
                          {ip}
                        </span>
                      </td>

                      {/* Details button */}
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="btn-view-audit"
                          onClick={() => setSelectedLog(log)}
                          title="View complete log details"
                        >
                          <i className="fa-solid fa-eye" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {!loading && logs.length > 0 && (
          <div className="audit-pagination-bar">
            <div className="table-records-count">
              Showing <strong>{(page - 1) * limit + 1}</strong> to{" "}
              <strong>{Math.min(page * limit, totalRecords)}</strong> of{" "}
              <strong>{totalRecords}</strong> entries
            </div>

            <div className="audit-page-buttons">
              <button
                className="audit-page-btn"
                onClick={() => setPage(1)}
                disabled={page === 1}
                title="First Page"
              >
                <i className="fa-solid fa-angles-left" />
              </button>

              <button
                className="audit-page-btn"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                title="Previous Page"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>

              {pageStart > 1 && (
                <span className="px-1 text-muted">...</span>
              )}

              {visiblePageNumbers.map((p) => (
                <button
                  key={p}
                  className={`audit-page-btn ${page === p ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

              {pageEnd < totalPages && (
                <span className="px-1 text-muted">...</span>
              )}

              <button
                className="audit-page-btn"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                title="Next Page"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>

              <button
                className="audit-page-btn"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                title="Last Page"
              >
                <i className="fa-solid fa-angles-right" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Inspection Modal */}
      {selectedLog && (
        <div
          className="audit-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null);
          }}
        >
          <div className="audit-modal-container">
            <div className="audit-modal-header">
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-file-lines text-primary fs-5" />
                <h5 className="mb-0 fw-bold">Audit Log Record Details</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedLog(null)}
              />
            </div>

            <div className="audit-modal-body">
              {/* Top Overview Cards */}
              <div className="audit-detail-grid">
                <div className="audit-detail-item">
                  <div className="detail-label">Log ID</div>
                  <div className="detail-value">{selectedLog._id || selectedLog.id || "—"}</div>
                </div>

                <div className="audit-detail-item">
                  <div className="detail-label">Timestamp</div>
                  <div className="detail-value">
                    {formatDate(selectedLog.createdAt || selectedLog.timestamp).formatted}
                  </div>
                </div>

                <div className="audit-detail-item">
                  <div className="detail-label">Category</div>
                  <div className="detail-value">
                    <span className={`badge-category ${getCategoryBadgeClass(selectedLog.category)}`}>
                      {selectedLog.category || "GENERAL"}
                    </span>
                  </div>
                </div>

                <div className="audit-detail-item">
                  <div className="detail-label">Action Code</div>
                  <div className="detail-value">
                    <span className={`badge-action-code ${getActionBadgeClass(selectedLog.action)}`}>
                      {selectedLog.action || "UNKNOWN"}
                    </span>
                  </div>
                </div>

                <div className="audit-detail-item">
                  <div className="detail-label">Performed By (Actor)</div>
                  <div className="detail-value">
                    {getActorInfo(selectedLog).name} ({getActorInfo(selectedLog).role})
                    {getActorInfo(selectedLog).email && (
                      <div className="text-muted" style={{ fontSize: "11px" }}>
                        {getActorInfo(selectedLog).email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="audit-detail-item">
                  <div className="detail-label">IP Address & Network</div>
                  <div className="detail-value">
                    {selectedLog.ipAddress || selectedLog.ip || selectedLog.clientIp || "—"}
                  </div>
                </div>

                {(selectedLog.targetType || selectedLog.entity || selectedLog.targetId || selectedLog.entityId) && (
                  <div className="audit-detail-item" style={{ gridColumn: "span 2" }}>
                    <div className="detail-label">Target Entity</div>
                    <div className="detail-value">
                      Type: <strong>{selectedLog.targetType || selectedLog.entity || "—"}</strong> | ID:{" "}
                      <code>{selectedLog.targetId || selectedLog.entityId || "—"}</code>
                      {selectedLog.targetName && <span> ({selectedLog.targetName})</span>}
                    </div>
                  </div>
                )}

                <div className="audit-detail-item" style={{ gridColumn: "span 2" }}>
                  <div className="detail-label">Description / Activity Message</div>
                  <div className="detail-value fw-semibold text-dark">
                    {selectedLog.description || selectedLog.message || selectedLog.details || "—"}
                  </div>
                </div>

                {selectedLog.userAgent && (
                  <div className="audit-detail-item" style={{ gridColumn: "span 2" }}>
                    <div className="detail-label">User Agent / Client</div>
                    <div className="detail-value text-muted" style={{ fontSize: "12px" }}>
                      {selectedLog.userAgent}
                    </div>
                  </div>
                )}
              </div>

              {/* Complete JSON Payload */}
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold" style={{ fontSize: "13px", color: "#334155" }}>
                    <i className="fa-solid fa-code me-1 text-primary" />
                    Full Payload & Metadata (JSON)
                  </span>
                </div>
                <div className="json-viewer-box">
                  <button
                    type="button"
                    className="copy-json-btn"
                    onClick={() => handleCopyJson(selectedLog)}
                  >
                    <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"} me-1`} />
                    {copied ? "Copied!" : "Copy JSON"}
                  </button>
                  <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="audit-modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuditLogs;
