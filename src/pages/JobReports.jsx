import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import {
  getJobReports,
  updateJobReportStatus,
  dismissJobFlags,
  moderateJobStatus,
} from "../api/adminJobApi";
import { TableView } from "../components/DataTable";
import { useDebounce } from "../hooks/useDebounce";

const defaultCompanyLogo = `${process.env.PUBLIC_URL}/assets/images/companyImg/partner-logo-2.png`;

const REPORT_STATUS_TABS = [
  { value: "all", label: "All Reports", badgeClass: "bg-primary" },
  { value: "Pending", label: "Pending Review", badgeClass: "bg-danger" },
  { value: "Reviewed", label: "Reviewed", badgeClass: "bg-warning text-dark" },
  { value: "Actioned", label: "Actioned", badgeClass: "bg-success" },
  { value: "Dismissed", label: "Dismissed", badgeClass: "bg-secondary" },
];

const REPORT_REASONS = [
  "Scam / Fraud",
  "Inappropriate content",
  "Fake company",
  "Discriminatory",
  "Misleading salary",
  "Expired job",
  "Other",
];

const JobReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);

  // Modal states for report status update
  const [selectedReport, setSelectedReport] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("Actioned");
  const [adminNote, setAdminNote] = useState("");
  const [dismissJobFlagsOption, setDismissJobFlagsOption] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Modal states for moderate job
  const [moderateJob, setModerateJob] = useState(null);
  const [isModerateJobModalOpen, setIsModerateJobModalOpen] = useState(false);
  const [modStatus, setModStatus] = useState("unpublished");
  const [modComment, setModComment] = useState("");
  const [modIsInternal, setModIsInternal] = useState(false);
  const [submittingMod, setSubmittingMod] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, reasonFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getJobReports({
        page,
        limit,
        status: statusFilter,
        reason: reasonFilter,
        search: debouncedSearch,
      });

      if (res?.success !== false) {
        const list = res.reports || res.data || [];
        setReports(Array.isArray(list) ? list : []);
        setTotalPages(res.totalPages || res.pagination?.totalPages || 1);
        setTotal(res.total || res.pagination?.total || (Array.isArray(list) ? list.length : 0));
      } else {
        setReports([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching job reports:", err);
      toast.error(err?.response?.data?.message || "Failed to load job reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, limit, debouncedSearch, statusFilter, reasonFilter]);

  const getCompanyLogo = (logo) => {
    if (!logo || logo === "undefined") return defaultCompanyLogo;
    if (logo.startsWith("http")) return logo;
    return `${API_IMAGE_URL}${logo}`;
  };

  // Open Update Report Status Modal
  const handleOpenUpdateModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status === "Pending" ? "Actioned" : report.status || "Actioned");
    setAdminNote(report.adminNote || "");
    setDismissJobFlagsOption(false);
    setIsUpdateModalOpen(true);
  };

  // Submit Update Report Status
  const handleSaveReportStatus = async (e) => {
    e?.preventDefault();
    if (!selectedReport) return;

    try {
      setSubmittingStatus(true);
      const res = await updateJobReportStatus(selectedReport._id, {
        status: newStatus,
        adminNote: adminNote.trim(),
        dismissJobFlags: dismissJobFlagsOption,
      });

      toast.success(res?.message || `Report updated to ${newStatus}!`);
      setIsUpdateModalOpen(false);
      setSelectedReport(null);
      loadReports();
    } catch (err) {
      console.error("Error updating report status:", err);
      toast.error(err?.response?.data?.message || "Failed to update report status");
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Quick Dismiss Flags on a Job
  const handleDismissJobFlagsDirect = async (jobId, jobTitle) => {
    const { value: note, isConfirmed } = await Swal.fire({
      title: "Dismiss Flags on Job?",
      text: `Clear all moderation flags on "${jobTitle || "this job"}"?`,
      input: "text",
      inputPlaceholder: "Admin note (e.g. Verified by admin)",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Clear Flags",
    });

    if (isConfirmed && jobId) {
      try {
        const res = await dismissJobFlags(jobId, note || "Dismissed by admin");
        toast.success(res?.message || "Job flags dismissed successfully!");
        loadReports();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to dismiss flags");
      }
    }
  };

  // Open Moderate Job Modal from Report
  const handleOpenModerateJob = (job) => {
    if (!job) return;
    setModerateJob(job);
    setModStatus(job.status === "published" ? "unpublished" : job.status || "unpublished");
    setModComment(`Reported for: ${selectedReport?.reason || "Policy violation"}.`);
    setModIsInternal(false);
    setIsModerateJobModalOpen(true);
  };

  // Submit Job Moderation
  const handleSaveJobModeration = async (e) => {
    e?.preventDefault();
    if (!moderateJob) return;

    try {
      setSubmittingMod(true);
      const jobId = moderateJob._id || moderateJob.id;
      const res = await moderateJobStatus(jobId, {
        status: modStatus,
        comment: modComment.trim(),
        isInternal: modIsInternal,
      });

      toast.success(res?.message || `Job status updated to ${modStatus}!`);
      setIsModerateJobModalOpen(false);
      setModerateJob(null);
      loadReports();
    } catch (err) {
      console.error("Error moderating job:", err);
      toast.error(err?.response?.data?.message || "Failed to update job status");
    } finally {
      setSubmittingMod(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setReasonFilter("all");
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        id: "index",
        Cell: ({ row }) => (page - 1) * limit + row.index + 1,
      },
      {
        Header: "Reported Job",
        id: "job",
        Cell: ({ row }) => {
          const report = row.original;
          const job = report.job || report.jobId || {};
          const jobTitle = job.jobTitle || report.jobTitle || "Job ID: " + (report.jobId || "N/A");
          const company = job.company || {};
          const brandName = company.brandName || job.companyName || "N/A";
          const logo = company.logo || job.companyLogo;

          return (
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                {jobTitle}
              </div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <img
                  src={getCompanyLogo(logo)}
                  alt={brandName}
                  width={24}
                  height={24}
                  className="rounded border"
                  style={{ objectFit: "contain", background: "#f8f9fa" }}
                  onError={(e) => {
                    e.currentTarget.src = defaultCompanyLogo;
                  }}
                />
                <span className="text-muted small">{brandName}</span>
                {job.jobNumber && (
                  <span className="badge bg-light text-secondary border">
                    {job.jobNumber}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Reporter",
        id: "reporter",
        Cell: ({ row }) => {
          const report = row.original;
          const email =
            report.email ||
            report.reporterEmail ||
            report.user?.email ||
            report.userId?.email ||
            "Anonymous Guest";
          const name =
            report.user?.name ||
            `${report.user?.first_name || ""} ${report.user?.last_name || ""}`.trim() ||
            "";

          return (
            <div>
              {name && <div className="fw-semibold text-dark small">{name}</div>}
              <div className="text-muted small">
                <i className="fa-solid fa-envelope me-1 text-secondary"></i>
                {email}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Report Reason",
        accessor: "reason",
        Cell: ({ row }) => {
          const reason = row.original.reason || "Other";
          let badgeClass = "bg-danger";
          if (reason === "Expired job") badgeClass = "bg-secondary";
          else if (reason === "Misleading salary") badgeClass = "bg-warning text-dark";
          else if (reason === "Inappropriate content") badgeClass = "bg-dark";

          return (
            <div>
              <span className={`badge ${badgeClass} px-2 py-1`}>{reason}</span>
            </div>
          );
        },
      },
      {
        Header: "Report Details",
        accessor: "details",
        Cell: ({ row }) => {
          const details = row.original.details || row.original.comment || "No extra details provided.";
          return (
            <div
              className="text-muted small text-truncate"
              style={{ maxWidth: "250px" }}
              title={details}
            >
              {details}
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const rawStatus = (row.original.status || "Pending").toString();
          const statusLower = rawStatus.toLowerCase();
          let badgeClass = "bg-danger";
          if (statusLower === "reviewed") badgeClass = "bg-warning text-dark";
          else if (statusLower === "actioned") badgeClass = "bg-success";
          else if (statusLower === "dismissed") badgeClass = "bg-secondary";

          return (
            <div>
              <span className={`badge ${badgeClass} text-uppercase px-2 py-1`}>
                {rawStatus}
              </span>
              {row.original.adminNote && (
                <small
                  className="d-block text-muted fst-italic mt-1"
                  style={{ fontSize: "11px" }}
                  title={row.original.adminNote}
                >
                  Note: {row.original.adminNote}
                </small>
              )}
            </div>
          );
        },
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return "N/A";
          return (
            <small className="text-muted">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </small>
          );
        },
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => {
          const report = row.original;
          const job = report.job || report.jobId;
          const jobId = typeof job === "object" ? job?._id : job;
          const jobTitle = typeof job === "object" ? job?.jobTitle : "Job";

          return (
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {/* Review Report Button */}
              <button
                type="button"
                className="btn btn-sm btn-primary px-2 py-1"
                title="Review & Update Report Status"
                onClick={() => handleOpenUpdateModal(report)}
              >
                <i className="fa-solid fa-pen-to-square me-1"></i> Review
              </button>

              {/* Moderate Job Button */}
              {job && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger px-2 py-1"
                  title="Moderate Reported Job Status"
                  onClick={() => handleOpenModerateJob(typeof job === "object" ? job : { _id: jobId, jobTitle })}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                </button>
              )}

              {/* Clear Flags Button */}
              {jobId && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success px-2 py-1"
                  title="Dismiss All Flags on this Job"
                  onClick={() => handleDismissJobFlagsDirect(jobId, jobTitle)}
                >
                  <i className="fa-solid fa-check"></i>
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [page, limit]
  );

  const hasActiveFilters = Boolean(search || statusFilter !== "all" || reasonFilter !== "all");

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2500} />

      <section className="super-dashboard-content-wrapper">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="super-dashboard-breadcrumb-info">
            <h4 className="mb-0">User Job Reports & Moderation</h4>
          </div>
          <Link
            to="/admin/manage-jobs"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <i className="fa-solid fa-briefcase"></i>
            Manage All Jobs
          </Link>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Job Reports Moderation Center
          </h5>
        </div>

        {/* Status Filter Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {REPORT_STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`btn btn-sm ${
                statusFilter === tab.value
                  ? "btn-primary shadow-sm"
                  : "btn-outline-secondary bg-white"
              }`}
              style={{ borderRadius: "20px", fontWeight: "500" }}
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Toolbar */}
        <div className="super-admin-white-bg p-3 mb-3 rounded border">
          <div className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-lg-5 col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light">
                  <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by job title, reporter email, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Reason Filter Dropdown */}
            <div className="col-lg-4 col-md-4">
              <select
                className="form-select form-select-sm"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="all">All Report Reasons</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <div className="col-lg-3 col-md-2 text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearFilters}
                >
                  <i className="fa-solid fa-arrow-rotate-left me-1"></i> Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-shield-cat fa-3x text-muted mb-3"></i>
              <h5 className="text-secondary">No Reports Found</h5>
              <p className="text-muted small">
                {hasActiveFilters
                  ? "Try adjusting your search query or reason filter."
                  : statusFilter === "all"
                  ? "No job reports found."
                  : `No job reports currently under status "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <TableView
              columns={columns}
              data={reports}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={(val) => {
                setLimit(val);
                setPage(1);
              }}
              totalPages={totalPages}
              total={total}
              hideSearch={true}
            />
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* UPDATE REPORT STATUS MODAL */}
      {/* ========================================================================= */}
      {isUpdateModalOpen && selectedReport && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fs-6 fw-bold">
                  <i className="fa-solid fa-shield-halved text-primary me-2"></i>
                  Review Job Report
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={submittingStatus}
                ></button>
              </div>

              <form onSubmit={handleSaveReportStatus}>
                <div className="modal-body">
                  {/* Summary Card */}
                  <div className="p-3 mb-3 bg-light rounded border small">
                    <div className="mb-1">
                      <strong>Report Reason:</strong>{" "}
                      <span className="badge bg-danger ms-1">{selectedReport.reason}</span>
                    </div>
                    <div className="mb-1">
                      <strong>Reporter:</strong>{" "}
                      {selectedReport.email || selectedReport.reporterEmail || "Guest User"}
                    </div>
                    <div>
                      <strong>Details:</strong>{" "}
                      <span className="text-secondary">
                        {selectedReport.details || selectedReport.comment || "None provided"}
                      </span>
                    </div>
                  </div>

                  {/* Target Status */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Set Report Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                    >
                      <option value="Actioned">Actioned (Resolved & Handled)</option>
                      <option value="Reviewed">Reviewed (In-Progress)</option>
                      <option value="Dismissed">Dismissed (False Report / Legitimate Job)</option>
                      <option value="Pending">Pending (Needs Further Review)</option>
                    </select>
                  </div>

                  {/* Admin Note */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Admin Note / Resolution Summary
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Reviewed with recruiter and verified legitimate, or unpublished job."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Dismiss Flags on Job Checkbox */}
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="dismissJobFlagsOption"
                      checked={dismissJobFlagsOption}
                      onChange={(e) => setDismissJobFlagsOption(e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold small" htmlFor="dismissJobFlagsOption">
                      Also dismiss all moderation flags on this job
                    </label>
                    <div className="form-text text-muted" style={{ fontSize: "11px" }}>
                      Check this if this report was investigated and the job is safe to keep live without warning badges.
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsUpdateModalOpen(false)}
                    disabled={submittingStatus}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-3"
                    disabled={submittingStatus}
                  >
                    {submittingStatus ? "Updating..." : "Save Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK MODERATE JOB MODAL */}
      {/* ========================================================================= */}
      {isModerateJobModalOpen && moderateJob && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fs-6 fw-bold">
                  <i className="fa-solid fa-shield-halved text-danger me-2"></i>
                  Moderate Reported Job: {moderateJob.jobTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModerateJobModalOpen(false)}
                  disabled={submittingMod}
                ></button>
              </div>

              <form onSubmit={handleSaveJobModeration}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Target Job Status</label>
                    <select
                      className="form-select"
                      value={modStatus}
                      onChange={(e) => setModStatus(e.target.value)}
                    >
                      <option value="unpublished">Unpublished (Take Down from Portal)</option>
                      <option value="published">Published (Keep Live)</option>
                      <option value="archived">Archived</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Moderation Feedback / Reason</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={modComment}
                      onChange={(e) => setModComment(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reportModIsInternal"
                      checked={modIsInternal}
                      onChange={(e) => setModIsInternal(e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold small" htmlFor="reportModIsInternal">
                      Private Admin Note Only
                    </label>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsModerateJobModalOpen(false)}
                    disabled={submittingMod}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-sm px-3"
                    disabled={submittingMod}
                  >
                    {submittingMod ? "Updating Job..." : "Apply Job Status"}
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

export default JobReports;
