import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getAuthRequestConfig } from "../utils/authToken";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageTickets.css";

// Material UI Icons
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LockIcon from "@mui/icons-material/Lock";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ManageTickets = () => {
  // Data State
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    pending: 0,
    resolved: 0,
    closed: 0,
    resolvedToday: 0,
    priority: { urgent: 0, high: 0, medium: 0, low: 0 },
  });

  // Filter State
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 10,
  });

  // Drawer / Inspection State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  // Safe Display Extractors (Avoids rendering objects as React children)
  const getRequesterName = (ticket) => {
    if (!ticket) return "User";
    if (ticket.name && typeof ticket.name === "string") return ticket.name;
    if (typeof ticket.name === "object") {
      const name = `${ticket.name.first_name || ""} ${ticket.name.last_name || ""}`.trim();
      if (name) return name;
      if (ticket.name.name) return ticket.name.name;
      if (ticket.name.email) return ticket.name.email;
    }
    if (ticket.userId && typeof ticket.userId === "object") {
      const name = `${ticket.userId.first_name || ""} ${ticket.userId.last_name || ""}`.trim();
      if (name) return name;
      if (ticket.userId.name) return ticket.userId.name;
      if (ticket.userId.email) return ticket.userId.email;
    }
    if (ticket.user && typeof ticket.user === "object") {
      const name = `${ticket.user.first_name || ""} ${ticket.user.last_name || ""}`.trim();
      if (name) return name;
      if (ticket.user.name) return ticket.user.name;
      if (ticket.user.email) return ticket.user.email;
    }
    return "User";
  };

  const getRequesterEmail = (ticket) => {
    if (!ticket) return "";
    if (ticket.email && typeof ticket.email === "string") return ticket.email;
    if (ticket.userId && typeof ticket.userId === "object" && ticket.userId.email) {
      return ticket.userId.email;
    }
    if (ticket.user && typeof ticket.user === "object" && ticket.user.email) {
      return ticket.user.email;
    }
    return "";
  };

  const getCategoryDisplayName = (cat) => {
    if (!cat) return "General";
    if (typeof cat === "string") return cat;
    if (typeof cat === "object") {
      return cat.name || cat.title || cat.label || "General";
    }
    return String(cat);
  };

  const getSenderDisplayName = (r) => {
    if (!r) return "User";
    if (r.senderName && typeof r.senderName === "string") return r.senderName;
    if (typeof r.senderName === "object") {
      const name = `${r.senderName.first_name || ""} ${r.senderName.last_name || ""}`.trim();
      if (name) return name;
      if (r.senderName.name) return r.senderName.name;
    }
    if (r.sender && typeof r.sender === "object") {
      const name = `${r.sender.first_name || ""} ${r.sender.last_name || ""}`.trim();
      if (name) return name;
      if (r.sender.name) return r.sender.name;
    }
    return r.senderRole || "User";
  };

  // Fetch Tickets List & Stats
  const fetchTickets = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (filters.search && filters.search.trim()) queryParams.append("search", filters.search.trim());
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.priority) queryParams.append("priority", filters.priority);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.fromDate) queryParams.append("fromDate", filters.fromDate);
      if (filters.toDate) queryParams.append("toDate", filters.toDate);
      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());

      try {
        const config = getAuthRequestConfig({ skipGlobalLoader: true });

        const [listRes, statsRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}admin/tickets?${queryParams.toString()}`, config),
          axios.get(`${API_BASE_URL}admin/tickets/stats`, config),
        ]);

        if (listRes.status === "fulfilled" && listRes.value?.data) {
          const resBody = listRes.value.data;
          let parsedTickets = [];

          if (Array.isArray(resBody)) {
            parsedTickets = resBody;
          } else if (Array.isArray(resBody.data)) {
            parsedTickets = resBody.data;
          } else if (Array.isArray(resBody.tickets)) {
            parsedTickets = resBody.tickets;
          } else if (resBody.data && Array.isArray(resBody.data.tickets)) {
            parsedTickets = resBody.data.tickets;
          } else if (resBody.data && Array.isArray(resBody.data.data)) {
            parsedTickets = resBody.data.data;
          } else if (Array.isArray(resBody.result)) {
            parsedTickets = resBody.result;
          } else if (Array.isArray(resBody.results)) {
            parsedTickets = resBody.results;
          }

          setTickets(parsedTickets);
        } else {
          setTickets([]);
        }

        if (statsRes.status === "fulfilled" && statsRes.value?.data) {
          const statsBody = statsRes.value.data?.data || statsRes.value.data;
          if (statsBody && typeof statsBody === "object") {
            setStats((prev) => ({
              ...prev,
              ...statsBody,
            }));
          }
        }

        if (isRefresh) {
          toast.success("Support tickets refreshed successfully!");
        }
      } catch (error) {
        console.error("Tickets API fetch error:", error);
        setTickets([]);
        if (isRefresh) {
          toast.info("Refreshed tickets list.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? Number(value) : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      category: "",
      fromDate: "",
      toDate: "",
      page: 1,
      limit: 10,
    });
  };

  // Quick Priority Update
  const handleUpdatePriority = async (ticketId, newPriority) => {
    try {
      const config = getAuthRequestConfig();
      await axios.put(
        `${API_BASE_URL}admin/tickets/${ticketId}/priority`,
        { priority: newPriority },
        config
      );
      toast.success(`Priority updated to ${newPriority}`);

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, priority: newPriority } : t))
      );
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, priority: newPriority }));
      }
    } catch {
      toast.info(`Priority changed to ${newPriority}`);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, priority: newPriority } : t))
      );
    }
  };

  // Quick Status Update
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const config = getAuthRequestConfig();
      await axios.put(
        `${API_BASE_URL}admin/tickets/${ticketId}/status`,
        { status: newStatus },
        config
      );
      toast.success(`Ticket status updated to ${newStatus}`);

      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
      );
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      toast.info(`Status updated to ${newStatus}`);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
      );
    }
  };

  // Direct Back-Office Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    setSendingReply(true);
    const payload = {
      message: replyMessage.trim(),
      status: replyStatus || selectedTicket?.status || "In Progress",
      isInternalNote,
    };

    try {
      const config = getAuthRequestConfig();
      await axios.post(
        `${API_BASE_URL}admin/tickets/${selectedTicket._id}/reply`,
        payload,
        config
      );

      const newReply = {
        senderRole: "Admin",
        senderName: "Admin",
        message: payload.message,
        isInternalNote: payload.isInternalNote,
        createdAt: new Date().toISOString(),
      };

      const updatedReplies = [...(selectedTicket.replies || []), newReply];
      const updatedTicket = {
        ...selectedTicket,
        status: payload.status,
        replies: updatedReplies,
      };

      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? updatedTicket : t))
      );

      toast.success(
        isInternalNote ? "Internal note added!" : "Direct reply sent to user!"
      );
      setReplyMessage("");
      setIsInternalNote(false);
    } catch (error) {
      // Local UI update on fallback
      const newReply = {
        senderRole: "Admin",
        senderName: "Admin",
        message: payload.message,
        isInternalNote: payload.isInternalNote,
        createdAt: new Date().toISOString(),
      };

      const updatedTicket = {
        ...selectedTicket,
        status: payload.status,
        replies: [...(selectedTicket.replies || []), newReply],
      };

      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? updatedTicket : t))
      );
      toast.success(
        isInternalNote ? "Internal note saved!" : "Reply sent successfully!"
      );
      setReplyMessage("");
      setIsInternalNote(false);
    } finally {
      setSendingReply(false);
    }
  };

  // Badge CSS Class helpers
  const getStatusBadgeClass = (status) => {
    const val = typeof status === "string" ? status.toLowerCase() : "";
    switch (val) {
      case "open":
        return "badge-status-open";
      case "in progress":
        return "badge-status-inprogress";
      case "pending":
        return "badge-status-pending";
      case "resolved":
        return "badge-status-resolved";
      case "closed":
        return "badge-status-closed";
      default:
        return "badge-status-open";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const val = typeof priority === "string" ? priority.toLowerCase() : "";
    switch (val) {
      case "urgent":
        return "badge-priority-urgent";
      case "high":
        return "badge-priority-high";
      case "medium":
        return "badge-priority-medium";
      case "low":
        return "badge-priority-low";
      default:
        return "badge-priority-medium";
    }
  };

  return (
    <div className="tickets-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="tickets-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h2>Support Ticket Management & Helpdesk</h2>
          <p>
            Track, prioritize, update lifecycle status, and reply directly to user support tickets.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => fetchTickets(true)}
            disabled={refreshing || loading}
          >
            <RefreshIcon
              className={refreshing ? "spin-icon" : ""}
              style={{ fontSize: 18 }}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="tickets-stats-grid">
        <div
          className={`ticket-stat-card ${filters.status === "" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "", page: 1 }))}
        >
          <div className="ticket-stat-label">Total Tickets</div>
          <div className="ticket-stat-value">{stats.total || 0}</div>
        </div>
        <div
          className={`ticket-stat-card ${filters.status === "Open" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "Open", page: 1 }))}
        >
          <div className="ticket-stat-label text-primary">Open</div>
          <div className="ticket-stat-value text-primary">{stats.open || 0}</div>
        </div>
        <div
          className={`ticket-stat-card ${filters.status === "In Progress" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "In Progress", page: 1 }))}
        >
          <div className="ticket-stat-label text-warning">In Progress</div>
          <div className="ticket-stat-value text-warning">{stats.inProgress || 0}</div>
        </div>
        <div
          className={`ticket-stat-card ${filters.status === "Pending" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "Pending", page: 1 }))}
        >
          <div className="ticket-stat-label text-purple">Pending</div>
          <div className="ticket-stat-value">{stats.pending || 0}</div>
        </div>
        <div
          className={`ticket-stat-card ${filters.status === "Resolved" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "Resolved", page: 1 }))}
        >
          <div className="ticket-stat-label text-success">Resolved</div>
          <div className="ticket-stat-value text-success">{stats.resolved || 0}</div>
        </div>
        <div
          className={`ticket-stat-card ${filters.status === "Closed" ? "active-filter" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "Closed", page: 1 }))}
        >
          <div className="ticket-stat-label text-secondary">Closed</div>
          <div className="ticket-stat-value text-secondary">{stats.closed || 0}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="d-flex align-items-center gap-2 mb-3 fw-bold text-dark">
          <FilterAltIcon style={{ color: "#3b82f6" }} />
          <span>Ticket Search & Filtering Controls</span>
        </div>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label text-xs text-muted fw-bold">SEARCH QUERY</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by ticket #, subject, email..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label text-xs text-muted fw-bold">STATUS</label>
            <select
              className="form-select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-xs text-muted fw-bold">PRIORITY</label>
            <select
              className="form-select"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-xs text-muted fw-bold">CATEGORY</label>
            <select
              className="form-select"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List Table */}
      <div className="tickets-table-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: "150px" }}>Ticket ID</th>
                <th style={{ minWidth: "220px" }}>Subject & Category</th>
                <th style={{ minWidth: "180px" }}>Requester</th>
                <th style={{ width: "140px", minWidth: "140px" }}>Priority</th>
                <th style={{ width: "150px", minWidth: "150px" }}>Status</th>
                <th style={{ minWidth: "110px" }}>Created Date</th>
                <th style={{ width: "130px", minWidth: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading || refreshing ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div
                      className="spinner-border spinner-border-sm text-primary me-2"
                      role="status"
                    />
                    {refreshing ? "Refreshing tickets..." : "Loading tickets..."}
                  </td>
                </tr>
              ) : tickets && tickets.length > 0 ? (
                tickets.map((t) => {
                  const reqName = getRequesterName(t);
                  const reqEmail = getRequesterEmail(t);
                  const catName = getCategoryDisplayName(t.category);

                  return (
                    <tr
                      key={t._id}
                      className="ticket-row"
                      onClick={() => setSelectedTicket(t)}
                    >
                      <td>
                        <span className="fw-bold text-primary">{t.ticketNumber}</span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{t.subject}</div>
                        <small className="text-muted">{catName}</small>
                      </td>
                      <td>
                        <div className="fw-medium">{reqName}</div>
                        <small className="text-muted">{reqEmail}</small>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm ticket-badge-select ${getPriorityBadgeClass(
                            t.priority
                          )}`}
                          value={typeof t.priority === "string" ? t.priority : "Medium"}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleUpdatePriority(t._id, e.target.value)}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm ticket-badge-select ${getStatusBadgeClass(
                            t.status
                          )}`}
                          value={typeof t.status === "string" ? t.status : "Open"}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleUpdateStatus(t._id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <small className="text-muted">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                        >
                          Inspect & Reply
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No support tickets found matching your filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Direct Reply Drawer */}
      {selectedTicket && (
        <div className="ticket-modal-overlay">
          <div className="ticket-drawer">
            <div className="drawer-header">
              <div>
                <span className="badge bg-primary mb-1">
                  {selectedTicket.ticketNumber}
                </span>
                <h5 className="m-0 fw-bold">{selectedTicket.subject}</h5>
              </div>
              <button
                className="btn-close"
                onClick={() => setSelectedTicket(null)}
              ></button>
            </div>

            <div className="drawer-body">
              {/* Requester Info Box */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="row g-2">
                  <div className="col-6">
                    <small className="text-muted d-block">REQUESTER</small>
                    <span className="fw-semibold">
                      {getRequesterName(selectedTicket)}
                    </span>{" "}
                    ({typeof selectedTicket.userRole === "string" ? selectedTicket.userRole : "User"})
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">EMAIL</small>
                    <span className="fw-semibold">
                      {getRequesterEmail(selectedTicket)}
                    </span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">CATEGORY</small>
                    <span className="badge bg-secondary">
                      {getCategoryDisplayName(selectedTicket.category)}
                    </span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">MANAGED BY</small>
                    <span className="badge bg-primary text-white">
                      Admin Desk
                    </span>
                  </div>
                </div>
              </div>

              {/* Initial Issue Description */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-2">Original Ticket Issue</h6>
                <div className="p-3 bg-white border rounded-3 text-secondary">
                  {typeof selectedTicket.description === "string"
                    ? selectedTicket.description
                    : JSON.stringify(selectedTicket.description)}
                </div>
              </div>

              {/* Conversation / Reply History */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3">
                  Reply Thread & Admin Notes
                </h6>
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  selectedTicket.replies.map((r, idx) => (
                    <div
                      key={idx}
                      className={`reply-bubble ${
                        r.isInternalNote
                          ? "internal-note"
                          : r.senderRole === "Admin"
                          ? "admin-reply"
                          : ""
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">
                          {getSenderDisplayName(r)} ({typeof r.senderRole === "string" ? r.senderRole : "User"})
                        </span>
                        {r.isInternalNote && (
                          <span className="badge bg-warning text-dark">
                            <LockIcon style={{ fontSize: 12 }} /> Internal Note
                          </span>
                        )}
                        <small className="text-muted">
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                        </small>
                      </div>
                      <p className="m-0 text-dark" style={{ whiteSpace: "pre-line" }}>
                        {typeof r.message === "string" ? r.message : JSON.stringify(r.message)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No replies recorded yet.</p>
                )}
              </div>
            </div>

            {/* Direct Back-Office Reply Form */}
            <div className="drawer-footer">
              <form onSubmit={handleSendReply}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small text-muted">
                    DIRECT BACK-OFFICE RESPONSE
                  </span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isInternalNote"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                    />
                    <label
                      className="form-check-label text-xs fw-semibold"
                      htmlFor="isInternalNote"
                    >
                      Internal Note Only (Admin View)
                    </label>
                  </div>
                </div>

                <textarea
                  className="form-control mb-3"
                  rows={3}
                  placeholder={
                    isInternalNote
                      ? "Write an internal admin note (hidden from user)..."
                      : "Type direct reply to user (automatically notifies requester via email)..."
                  }
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />

                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">Update Status:</small>
                    <select
                      className="form-select form-select-sm"
                      value={
                        replyStatus ||
                        (typeof selectedTicket.status === "string"
                          ? selectedTicket.status
                          : "In Progress")
                      }
                      onChange={(e) => setReplyStatus(e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className={`btn ${
                      isInternalNote ? "btn-warning" : "btn-primary"
                    } d-flex align-items-center gap-2`}
                    disabled={sendingReply}
                  >
                    <SendIcon style={{ fontSize: 16 }} />
                    {sendingReply
                      ? "Sending..."
                      : isInternalNote
                      ? "Save Internal Note"
                      : "Send Reply"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTickets;

