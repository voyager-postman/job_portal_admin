import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import {
  fetchAdminJobs,
  moderateJobStatus,
  fetchActiveJobTypes,
  fetchCompaniesDropdown,
  dismissJobFlags,
} from "../api/adminJobApi";
import { TableView } from "../components/DataTable";
import { useDebounce } from "../hooks/useDebounce";

const defaultCompanyLogo = `${process.env.PUBLIC_URL}/assets/images/companyImg/partner-logo-2.png`;

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses", badgeClass: "bg-secondary" },
  { value: "published", label: "Published", badgeClass: "bg-success" },
  { value: "unpublished", label: "Unpublished", badgeClass: "bg-danger" },
  { value: "draft", label: "Draft", badgeClass: "bg-warning text-dark" },
  { value: "expired", label: "Expired", badgeClass: "bg-dark" },
  { value: "archived", label: "Archived", badgeClass: "bg-secondary" },
];

const ManageJobs = () => {
  // Data states
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModerateModalOpen, setIsModerateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modStatus, setModStatus] = useState("unpublished");
  const [modComment, setModComment] = useState("");
  const [modIsInternal, setModIsInternal] = useState(false);
  const [submittingMod, setSubmittingMod] = useState(false);

  // Load Job Types & Companies on mount
  useEffect(() => {
    let isMounted = true;
    const loadDropdownData = async () => {
      try {
        const [typesData, compsData] = await Promise.all([
          fetchActiveJobTypes().catch(() => []),
          fetchCompaniesDropdown().catch(() => []),
        ]);
        if (isMounted) {
          setJobTypes(Array.isArray(typesData) ? typesData : []);
          setCompanies(Array.isArray(compsData) ? compsData : []);
        }
      } catch (err) {
        console.error("Error loading filter dropdown data", err);
        if (isMounted) {
          setJobTypes([]);
          setCompanies([]);
        }
      }
    };
    loadDropdownData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, selectedJobType, selectedCompany, flaggedOnly, startDate, endDate]);

  // Load jobs list
  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminJobs({
        page,
        limit,
        status: statusFilter,
        search: debouncedSearch,
        jobType: selectedJobType,
        company_id: selectedCompany,
        flagged: flaggedOnly ? true : undefined,
        startDate,
        endDate,
      });

      if (res?.success !== false) {
        setJobs(res.jobs || res.data || []);
        setTotalPages(res.totalPages || res.pagination?.totalPages || 1);
        setTotal(res.total || res.pagination?.total || (res.jobs ? res.jobs.length : 0));
      } else {
        setJobs([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching admin jobs:", err);
      toast.error(err?.response?.data?.message || "Failed to load jobs list");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, limit, debouncedSearch, statusFilter, selectedJobType, selectedCompany, flaggedOnly, startDate, endDate]);

  // Helper for company logo URL
  const getCompanyLogo = (logo) => {
    if (!logo || logo === "undefined") return defaultCompanyLogo;
    if (logo.startsWith("http")) return logo;
    return `${API_IMAGE_URL}${logo}`;
  };

  // Open moderation modal for a specific job
  const handleOpenModerateModal = (job) => {
    setSelectedJob(job);
    setModStatus(job.status === "published" ? "unpublished" : job.status || "unpublished");
    setModComment(job.moderationComment || "");
    setModIsInternal(Boolean(job.isModerationInternal));
    setIsModerateModalOpen(true);
  };

  // Quick toggle status switch (Publish/Unpublish)
  const handleQuickToggle = async (job, willPublish) => {
    const nextStatus = willPublish ? "published" : "unpublished";

    if (!willPublish) {
      handleOpenModerateModal(job);
      return;
    }

    const result = await Swal.fire({
      title: "Publish this Job?",
      text: `Are you sure you want to publish "${job.jobTitle}"? It will become visible to all candidates.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Publish",
    });

    if (result.isConfirmed) {
      try {
        await moderateJobStatus(job._id, {
          status: "published",
          comment: "",
          isInternal: false,
        });
        toast.success("Job published successfully!");
        loadJobs();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update job status");
      }
    }
  };

  // Quick Dismiss Flags on Job
  const handleDismissFlags = async (job) => {
    const { value: adminNote, isConfirmed } = await Swal.fire({
      title: "Dismiss Job Flags?",
      text: `Are you sure you want to dismiss all moderation flags on "${job.jobTitle}"?`,
      input: "text",
      inputPlaceholder: "Optional admin note (e.g. Job verified as legitimate)",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Dismiss Flags",
    });

    if (isConfirmed) {
      try {
        const res = await dismissJobFlags(job._id, adminNote || "Flags dismissed by admin");
        toast.success(res?.message || "Flags dismissed successfully!");
        loadJobs();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to dismiss flags");
      }
    }
  };

  // Submit moderation form
  const handleSaveModeration = async (e) => {
    e?.preventDefault();
    if (!selectedJob) return;

    try {
      setSubmittingMod(true);
      const res = await moderateJobStatus(selectedJob._id, {
        status: modStatus,
        comment: modComment.trim(),
        isInternal: modIsInternal,
      });

      toast.success(res?.message || `Job status updated to ${modStatus}!`);
      setIsModerateModalOpen(false);
      setSelectedJob(null);
      loadJobs();
    } catch (err) {
      console.error("Moderation error:", err);
      toast.error(err?.response?.data?.message || "Failed to moderate job");
    } finally {
      setSubmittingMod(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSelectedJobType("");
    setSelectedCompany("");
    setFlaggedOnly(false);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        id: "index",
        Cell: ({ row }) => (page - 1) * limit + row.index + 1,
      },
      {
        Header: "Job Title / No.",
        accessor: "jobTitle",
        Cell: ({ row }) => {
          const job = row.original;
          const isFlagged = job.isFlagged || (job.flagCount && job.flagCount > 0);

          return (
            <div>
              <div className="d-flex align-items-center gap-1 flex-wrap">
                <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                  {job.jobTitle || "Untitled Job"}
                </span>

                {/* Flagged Badge */}
                {isFlagged && (
                  <span
                    className="badge bg-danger text-white px-2 py-1 ms-1 d-inline-flex align-items-center gap-1"
                    title={job.flaggedReason || "Flagged for moderation"}
                    style={{ fontSize: "11px" }}
                  >
                    <i className="fa-solid fa-flag"></i> Flagged
                    {job.flagCount ? ` (${job.flagCount})` : ""}
                  </span>
                )}
              </div>

              <div className="d-flex align-items-center gap-2 mt-1">
                {job.jobNumber && (
                  <span className="badge bg-light text-secondary border">
                    <i className="fa-solid fa-hashtag me-1"></i>
                    {job.jobNumber}
                  </span>
                )}
                {job.flaggedReason && (
                  <small className="text-danger-emphasis fst-italic" style={{ fontSize: "11px" }}>
                    {job.flaggedReason}
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Company",
        id: "company",
        Cell: ({ row }) => {
          const job = row.original;
          const company = job.company || {};
          const brandName = company.brandName || job.companyName || "N/A";
          const logo = company.logo || job.companyLogo;

          return (
            <div className="d-flex align-items-center gap-2">
              <img
                src={getCompanyLogo(logo)}
                alt={brandName}
                width={36}
                height={36}
                className="rounded border"
                style={{ objectFit: "contain", background: "#f8f9fa" }}
                onError={(e) => {
                  e.currentTarget.src = defaultCompanyLogo;
                }}
              />
              <div>
                <span className="fw-semibold text-truncate d-block" style={{ maxWidth: "150px" }}>
                  {brandName}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Recruiter",
        id: "recruiter",
        Cell: ({ row }) => {
          const job = row.original;
          const recruiter = job.recruiterInfo || job.recruiterId || {};
          const name =
            recruiter.name ||
            `${recruiter.first_name || ""} ${recruiter.last_name || ""}`.trim() ||
            "Admin / Direct";
          const email = recruiter.email || "";

          return (
            <div>
              <div className="fw-medium text-dark">{name}</div>
              {email && <small className="text-muted d-block">{email}</small>}
            </div>
          );
        },
      },
      {
        Header: "Job Type",
        id: "employmentType",
        Cell: ({ row }) => {
          const job = row.original;
          const typeName = job.employmentType?.name || job.jobType?.name || "Full-Time";
          return (
            <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
              {typeName}
            </span>
          );
        },
      },
      {
        Header: "Applicants",
        accessor: "applicantCount",
        Cell: ({ row }) => {
          const count = row.original.applicantCount ?? row.original.total_applicants ?? 0;
          return (
            <span className="badge rounded-pill bg-light text-dark border px-2 py-1">
              <i className="fa-solid fa-users me-1 text-primary"></i>
              {count}
            </span>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const status = (row.original.status || "published").toLowerCase();
          let badgeClass = "bg-secondary";
          if (status === "published") badgeClass = "bg-success";
          else if (status === "unpublished") badgeClass = "bg-danger";
          else if (status === "draft") badgeClass = "bg-warning text-dark";
          else if (status === "expired") badgeClass = "bg-dark";
          else if (status === "archived") badgeClass = "bg-secondary";

          return (
            <div>
              <span className={`badge ${badgeClass} text-uppercase px-2 py-1`}>
                {status}
              </span>
              {row.original.moderationComment && (
                <div className="mt-1" title={row.original.moderationComment}>
                  <small
                    className={`badge ${
                      row.original.isModerationInternal
                        ? "bg-dark-subtle text-dark"
                        : "bg-warning-subtle text-warning-emphasis"
                    } border`}
                    style={{ fontSize: "10px" }}
                  >
                    <i className="fa-solid fa-comment-dots me-1"></i>
                    {row.original.isModerationInternal ? "Internal Note" : "Recruiter Feedback"}
                  </small>
                </div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Posted Date",
        accessor: "createdAt",
        Cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return "N/A";
          return (
            <small className="text-muted">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </small>
          );
        },
      },
      {
        Header: "Moderation & Actions",
        id: "actions",
        Cell: ({ row }) => {
          const job = row.original;
          const isPublished = job.status === "published";
          const isFlagged = job.isFlagged || (job.flagCount && job.flagCount > 0);

          return (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Quick Publish/Unpublish Toggle */}
              <div className="form-check form-switch mb-0" title="Quick Toggle Publish">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={isPublished}
                  onChange={(e) => handleQuickToggle(job, e.target.checked)}
                />
              </div>

              {/* Moderate Button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-primary px-2 py-1"
                title="Moderate Job Status & Feedback"
                onClick={() => handleOpenModerateModal(job)}
              >
                <i className="fa-solid fa-shield-halved me-1"></i> Moderate
              </button>

              {/* Bulk Download Resumes ZIP Button */}
              {(job.applicantCount > 0 || job.total_applicants > 0) && (
                <a
                  href={`${API_BASE_URL}recruiter/jobs/${job._id}/download-resumes-zip`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-info px-2 py-1"
                  title="Download All Resumes (.ZIP)"
                >
                  <i className="fa-solid fa-file-zipper me-1"></i> ZIP
                </a>
              )}

              {/* Dismiss Flags Button (if flagged) */}
              {isFlagged && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success px-2 py-1"
                  title="Dismiss All Moderation Flags"
                  onClick={() => handleDismissFlags(job)}
                >
                  <i className="fa-solid fa-check me-1"></i> Clear Flags
                </button>
              )}

              {/* Details View Button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1"
                title="View Full Job Details"
                onClick={() => {
                  setSelectedJob(job);
                  setIsDetailsModalOpen(true);
                }}
              >
                <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          );
        },
      },
    ],
    [page, limit]
  );

  const hasActiveFilters = Boolean(
    search ||
      statusFilter !== "all" ||
      selectedJobType ||
      selectedCompany ||
      flaggedOnly ||
      startDate ||
      endDate
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2500} />

      <section className="super-dashboard-content-wrapper">
        {/* Breadcrumb Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <div className="super-dashboard-breadcrumb-info">
            <h4 className="mb-0">Job Moderation & Management</h4>
          </div>
          <Link
            to="/admin/job-reports"
            className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1 shadow-sm"
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            View User Job Reports
          </Link>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Admin Job Moderation & Flags
          </h5>
        </div>

        {/* Top Status Filters Pill Bar + Flagged Toggle */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="d-flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`btn btn-sm ${
                  statusFilter === item.value
                    ? "btn-primary shadow-sm"
                    : "btn-outline-secondary bg-white"
                }`}
                style={{ borderRadius: "20px", fontWeight: "500" }}
                onClick={() => setStatusFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Flagged Filter Toggle */}
          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`btn btn-sm ${
                flaggedOnly
                  ? "btn-danger shadow-sm text-white"
                  : "btn-outline-danger bg-white"
              }`}
              style={{ borderRadius: "20px", fontWeight: "500" }}
              onClick={() => setFlaggedOnly((prev) => !prev)}
            >
              <i className="fa-solid fa-flag me-1"></i>
              {flaggedOnly ? "Showing Flagged Only" : "Show Flagged Jobs"}
            </button>
          </div>
        </div>

        {/* Filter Card */}
        <div className="super-admin-white-bg p-3 mb-3 rounded border">
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-lg-3 col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light">
                  <i className="fa-solid fa-magnifying-glass text-muted"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search title, job #, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Job Type Dropdown */}
            <div className="col-lg-2 col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                {Array.isArray(jobTypes) &&
                  jobTypes.map((type) => (
                    <option key={type._id || type.name} value={type._id}>
                      {type.name || type.jobType || type.title || "Unknown"}
                    </option>
                  ))}
              </select>
            </div>

            {/* Company Dropdown */}
            <div className="col-lg-2 col-md-3">
              <select
                className="form-select form-select-sm"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {Array.isArray(companies) &&
                  companies.map((comp) => {
                    const compId = comp._id || comp.id || comp.companyId?._id;
                    const compName =
                      comp.companyId?.brandName ||
                      comp.companyId?.companyName ||
                      comp.brandName ||
                      comp.company_name ||
                      comp.companyName ||
                      comp.name ||
                      comp.email ||
                      "Company";
                    return (
                      <option key={compId || Math.random()} value={compId}>
                        {compName}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Start Date */}
            <div className="col-lg-2 col-md-3">
              <input
                type="date"
                className="form-control form-control-sm"
                title="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="col-lg-2 col-md-3">
              <input
                type="date"
                className="form-control form-control-sm"
                title="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Clear / Reset Button */}
            {hasActiveFilters && (
              <div className="col-lg-1 col-md-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={handleClearFilters}
                  title="Clear all active filters"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i> Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Jobs Table Container */}
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-briefcase fa-3x text-muted mb-3"></i>
              <h5 className="text-secondary">No Jobs Found</h5>
              <p className="text-muted small">
                {hasActiveFilters
                  ? "Try adjusting your search query, status, or date range filters."
                  : "There are currently no jobs submitted in the portal."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <TableView
              columns={columns}
              data={jobs}
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
      {/* 2. ADMIN MODERATE JOB MODAL (POST /api/company/jobs/:jobId/status) */}
      {/* ========================================================================= */}
      {isModerateModalOpen && selectedJob && (
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
                  Moderate Job: {selectedJob.jobTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModerateModalOpen(false)}
                  disabled={submittingMod}
                ></button>
              </div>

              <form onSubmit={handleSaveModeration}>
                <div className="modal-body">
                  {/* Job Brief Info */}
                  <div className="p-2 mb-3 bg-light rounded border small">
                    <div>
                      <strong>Company:</strong>{" "}
                      {selectedJob.company?.brandName || selectedJob.companyName || "N/A"}
                    </div>
                    {selectedJob.jobNumber && (
                      <div>
                        <strong>Job Number:</strong> {selectedJob.jobNumber}
                      </div>
                    )}
                    <div>
                      <strong>Current Status:</strong>{" "}
                      <span className="badge bg-secondary text-uppercase ms-1">
                        {selectedJob.status}
                      </span>
                      {selectedJob.isFlagged && (
                        <span className="badge bg-danger ms-1">🚩 Flagged</span>
                      )}
                    </div>
                  </div>

                  {/* Target Status Select */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Select Target Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={modStatus}
                      onChange={(e) => setModStatus(e.target.value)}
                      required
                    >
                      <option value="published">Published (Live & Visible)</option>
                      <option value="unpublished">Unpublished (Taken Down / Needs Revision)</option>
                      <option value="archived">Archived</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {/* Moderation Comment / Reason */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Moderation Reason / Comment
                      {modStatus === "unpublished" && (
                        <span className="text-muted fw-normal ms-1 small">
                          (Explain what needs fixing)
                        </span>
                      )}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Please specify the salary range, required experience, or company registration details."
                      value={modComment}
                      onChange={(e) => setModComment(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Internal vs Public Note Toggle */}
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="modIsInternalSwitch"
                      checked={modIsInternal}
                      onChange={(e) => setModIsInternal(e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold small" htmlFor="modIsInternalSwitch">
                      Internal Admin Note Only
                    </label>
                    <div className="form-text text-muted" style={{ fontSize: "11px" }}>
                      {modIsInternal
                        ? "🔒 Private note: Visible to administrators only. Recruiter will NOT see this feedback."
                        : "📢 Public feedback: Sends notification to the recruiter explaining the moderation status."}
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsModerateModalOpen(false)}
                    disabled={submittingMod}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-3"
                    disabled={submittingMod}
                  >
                    {submittingMod ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Saving...
                      </>
                    ) : (
                      "Apply Moderation"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. JOB DETAILS PREVIEW MODAL */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && selectedJob && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fs-6 fw-bold">
                  <i className="fa-solid fa-briefcase text-primary me-2"></i>
                  Job Details: {selectedJob.jobTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsDetailsModalOpen(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="card h-100 border-0 bg-light p-3">
                      <h6 className="fw-bold mb-2">Job Information</h6>
                      <ul className="list-unstyled mb-0 small lh-lg">
                        <li>
                          <strong>Job Number:</strong> {selectedJob.jobNumber || "N/A"}
                        </li>
                        <li>
                          <strong>Title:</strong> {selectedJob.jobTitle}
                        </li>
                        <li>
                          <strong>Employment Type:</strong>{" "}
                          {selectedJob.employmentType?.name || selectedJob.jobType?.name || "N/A"}
                        </li>
                        <li>
                          <strong>Status:</strong>{" "}
                          <span className="badge bg-primary text-uppercase">
                            {selectedJob.status}
                          </span>
                          {selectedJob.isFlagged && (
                            <span className="badge bg-danger ms-1">🚩 Flagged</span>
                          )}
                        </li>
                        <li>
                          <strong>Applicant Count:</strong>{" "}
                          {selectedJob.applicantCount ?? selectedJob.total_applicants ?? 0}
                        </li>
                        <li>
                          <strong>Posted Date:</strong>{" "}
                          {selectedJob.createdAt
                            ? new Date(selectedJob.createdAt).toLocaleString()
                            : "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card h-100 border-0 bg-light p-3">
                      <h6 className="fw-bold mb-2">Company & Recruiter</h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img
                          src={getCompanyLogo(selectedJob.company?.logo || selectedJob.companyLogo)}
                          alt="logo"
                          width={40}
                          height={40}
                          className="rounded border bg-white"
                          style={{ objectFit: "contain" }}
                        />
                        <div>
                          <div className="fw-bold">
                            {selectedJob.company?.brandName || selectedJob.companyName || "N/A"}
                          </div>
                        </div>
                      </div>
                      <ul className="list-unstyled mb-0 small lh-lg">
                        <li>
                          <strong>Recruiter Name:</strong>{" "}
                          {selectedJob.recruiterInfo?.name ||
                            `${selectedJob.recruiterInfo?.first_name || ""} ${
                              selectedJob.recruiterInfo?.last_name || ""
                            }`.trim() ||
                            "N/A"}
                        </li>
                        <li>
                          <strong>Recruiter Email:</strong>{" "}
                          {selectedJob.recruiterInfo?.email || "N/A"}
                        </li>
                        <li>
                          <strong>Recruiter Role:</strong>{" "}
                          {selectedJob.recruiterInfo?.role || "Recruiter"}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Flagged Alert Box */}
                  {(selectedJob.isFlagged || selectedJob.flagCount > 0) && (
                    <div className="col-12">
                      <div className="alert alert-danger mb-0">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <h6 className="fw-bold mb-1">
                              <i className="fa-solid fa-triangle-exclamation me-2"></i>
                              Moderation Alert: This Job is Flagged
                            </h6>
                            <p className="mb-0 small">
                              {selectedJob.flaggedReason ||
                                "This job was flagged due to suspicious content or user reports."}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger bg-white"
                            onClick={() => {
                              setIsDetailsModalOpen(false);
                              handleDismissFlags(selectedJob);
                            }}
                          >
                            <i className="fa-solid fa-check me-1"></i> Clear Flags
                          </button>
                        </div>

                        {/* Detailed Flags List */}
                        {Array.isArray(selectedJob.moderationFlags) &&
                          selectedJob.moderationFlags.length > 0 && (
                            <div className="mt-3 border-top pt-2">
                              <span className="fw-semibold small d-block mb-1">
                                Flagged Reports ({selectedJob.moderationFlags.length}):
                              </span>
                              <div className="d-flex flex-column gap-1">
                                {selectedJob.moderationFlags.map((flag, idx) => (
                                  <div key={idx} className="bg-white p-2 rounded border small">
                                    <span className="badge bg-danger me-2">
                                      {flag.reason || "Flagged"}
                                    </span>
                                    <span>{flag.details || flag.comment || "No details provided"}</span>
                                    {flag.reporterEmail && (
                                      <small className="text-muted d-block mt-1">
                                        Reported by: {flag.reporterEmail}
                                      </small>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {selectedJob.moderationComment && (
                    <div className="col-12">
                      <div
                        className={`alert ${
                          selectedJob.isModerationInternal ? "alert-dark" : "alert-warning"
                        } mb-0`}
                      >
                        <h6 className="fw-bold mb-1">
                          <i className="fa-solid fa-comment-dots me-2"></i>
                          Moderation Comment{" "}
                          {selectedJob.isModerationInternal && "(Internal Admin Note)"}
                        </h6>
                        <p className="mb-0 small">{selectedJob.moderationComment}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light">
                {(selectedJob.applicantCount > 0 || selectedJob.total_applicants > 0) && (
                  <a
                    href={`${API_BASE_URL}recruiter/jobs/${selectedJob._id}/download-resumes-zip`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    <i className="fa-solid fa-file-zipper me-1"></i> Download All Resumes (.ZIP)
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleOpenModerateModal(selectedJob);
                  }}
                >
                  <i className="fa-solid fa-shield-halved me-1"></i> Moderate This Job
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
