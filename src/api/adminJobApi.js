import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

/**
 * 1. Fetch Admin Jobs List with Filters & Pagination
 * Supports search, status, jobType, recruiterId, company_id, flagged, date range
 */
export const fetchAdminJobs = async ({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
  jobType = "",
  recruiterId = "",
  company_id = "",
  flagged = undefined,
  startDate = "",
  endDate = "",
} = {}) => {
  const params = {
    page,
    limit,
    ...(status && status !== "all" ? { status } : {}),
    ...(search ? { search: search.trim() } : {}),
    ...(jobType ? { jobType } : {}),
    ...(recruiterId ? { recruiterId } : {}),
    ...(company_id ? { company_id } : {}),
    ...(flagged !== undefined && flagged !== "" && flagged !== null ? { flagged } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };

  const res = await axios.get(`${API_BASE_URL}admin/jobs`, {
    ...getAuthHeaders(),
    params,
  });
  return res.data;
};

export const getAdminJobs = fetchAdminJobs;

/**
 * 2. Admin Moderate Job (Publish, Unpublish, Archive, Expire with reason / internal note)
 */
export const moderateJobStatus = async (jobId, { status, comment = "", isInternal = false }) => {
  const payload = {
    status,
    ...(comment ? { comment } : {}),
    isInternal: Boolean(isInternal),
  };

  const res = await axios.post(
    `${API_BASE_URL}company/jobs/${jobId}/status`,
    payload,
    getAuthHeaders()
  );
  return res.data;
};

export const updateJobStatus = moderateJobStatus;

/**
 * 3. Fetch User Job Reports List
 * Supports status ('Pending', 'Reviewed', 'Dismissed', 'Actioned'), jobId, reason, search, page, limit
 */
export const getJobReports = async ({
  page = 1,
  limit = 10,
  status = "all",
  reason = "",
  jobId = "",
  search = "",
} = {}) => {
  const params = {
    page,
    limit,
    ...(status && status !== "all" ? { status } : {}),
    ...(reason && reason !== "all" ? { reason } : {}),
    ...(jobId ? { jobId } : {}),
    ...(search ? { search: search.trim() } : {}),
  };

  const res = await axios.get(`${API_BASE_URL}admin/job-reports`, {
    ...getAuthHeaders(),
    params,
  });
  return res.data;
};

export const fetchJobReports = getJobReports;

/**
 * 4. Update Report Status (Reviewed / Dismissed / Actioned / Pending)
 */
export const updateJobReportStatus = async (
  reportId,
  { status = "Actioned", adminNote = "", dismissJobFlags = false } = {}
) => {
  const payload = {
    status,
    ...(adminNote ? { adminNote } : {}),
    dismissJobFlags: Boolean(dismissJobFlags),
  };

  const res = await axios.post(
    `${API_BASE_URL}admin/job-reports/${reportId}/status`,
    payload,
    getAuthHeaders()
  );
  return res.data;
};

/**
 * 5. Dismiss All Moderation Flags on a Job (Quick Action)
 */
export const dismissJobFlags = async (jobId, adminNote = "") => {
  const payload = {
    ...(adminNote ? { adminNote } : {}),
  };

  const res = await axios.post(
    `${API_BASE_URL}admin/jobs/${jobId}/dismiss-flags`,
    payload,
    getAuthHeaders()
  );
  return res.data;
};

/**
 * 6. Fetch Master Job Types (Employment Types) for filter dropdowns
 */
export const fetchActiveJobTypes = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}getActiveJobTypeList`, getAuthHeaders());
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    if (Array.isArray(res.data?.jobTypes)) return res.data.jobTypes;
    if (Array.isArray(res.data?.jobTypeList)) return res.data.jobTypeList;
    return [];
  } catch (err) {
    console.error("Error fetching job types:", err);
    try {
      const fallbackRes = await axios.get(`${API_BASE_URL}getJobTypeList`, getAuthHeaders());
      if (Array.isArray(fallbackRes.data)) return fallbackRes.data;
      if (Array.isArray(fallbackRes.data?.data)) return fallbackRes.data.data;
      if (Array.isArray(fallbackRes.data?.jobTypes)) return fallbackRes.data.jobTypes;
      return [];
    } catch {
      return [];
    }
  }
};

/**
 * 7. Fetch Companies for filter dropdowns (Fetches all companies without limit truncation)
 */
export const fetchCompaniesDropdown = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}admin/companies?limit=1000&all=true`, getAuthHeaders());
    let list = [];
    if (Array.isArray(res.data)) list = res.data;
    else if (Array.isArray(res.data?.data)) list = res.data.data;
    else if (Array.isArray(res.data?.companies)) list = res.data.companies;

    const totalPages = res.data?.totalPages || 1;
    if (totalPages > 1) {
      const pagePromises = [];
      for (let p = 2; p <= totalPages; p++) {
        pagePromises.push(
          axios.get(`${API_BASE_URL}admin/companies?limit=100&page=${p}`, getAuthHeaders()).catch(() => null)
        );
      }
      const pageResponses = await Promise.all(pagePromises);
      pageResponses.forEach((r) => {
        if (r?.data) {
          const pageData = r.data.data || r.data.companies || (Array.isArray(r.data) ? r.data : []);
          if (Array.isArray(pageData)) {
            list = [...list, ...pageData];
          }
        }
      });
    }

    return list;
  } catch (err) {
    console.error("Error fetching companies for filter:", err);
    return [];
  }
};

/**
 * 8. Bulk Resume ZIP Download URL
 */
export const getDownloadResumesZipUrl = (jobId) => {
  return `${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip`;
};

/**
 * 9. Download Job Resumes as ZIP file
 */
export const downloadJobResumesZip = async (
  jobId,
  { status = "", applicationIds = [], includeCoverLetters = false } = {}
) => {
  try {
    const params = {
      ...(status ? { status } : {}),
      ...(includeCoverLetters ? { includeCoverLetters: true } : {}),
    };
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const response = await axios.post(
      `${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip`,
      { applicationIds, includeCoverLetters },
      {
        params,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Resumes_${jobId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (err) {
    console.error("Error downloading resumes ZIP:", err);
    // Fallback: direct window open
    window.open(`${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip`, "_blank");
    return { success: true };
  }
};
