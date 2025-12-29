import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { TableView } from "../components/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";

const CompanyActiveJob = () => {
  const location = useLocation();
  const companyActiveId = location?.state?.companyActiveId;
  const [publishJob, setPublishJob] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  console.log("Recieved Active company  Id:", companyActiveId);
  useEffect(() => {
    console.log("useEffect Triggered:", companyActiveId);
    if (companyActiveId) {
      fetchCandidates(companyActiveId);
    }
  }, [companyActiveId, page, limit]);

  // Fetch Recruiter Data
  const fetchCandidates = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}admin/jobs?company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("API Response:", response.data.jobs);
      setPublishJob(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      accessorFn: (row) => (row.jobTitle || "").toLowerCase(),
      cell: ({ row }) => row.original.jobTitle || "Not Provided",
    },
    {
      accessorKey: "jobCategory",
      header: "Job Category",
      accessorFn: (row) => (row?.jobCategory?.name || "").toLowerCase(),
      cell: ({ row }) => row.original?.jobCategory?.name || "Not Provided",
    },
    {
      accessorKey: "employmentType",
      header: "Employment Type",
      accessorFn: (row) => (row?.employmentType?.name || "").toLowerCase(),
      cell: ({ row }) => row.original?.employmentType?.name || "Not Provided",
    },
    {
      accessorKey: "remote",
      header: "Remote Type",
      accessorFn: (row) => (row.remote || "").toLowerCase(),
      cell: ({ row }) => row.original.remote || "Not Provided",
    },
    {
      accessorKey: "applicantCount",
      header: "Applicant Count",
      accessorFn: (row) => String(row?.jobTitle ?? "").toLowerCase(),
      cell: ({ row }) => row.original.applicantCount || "Not Provided",
    },
    {
      accessorKey: "minSalary",
      header: "Min Salary",
      accessorFn: (row) =>
        String(row?.privatJobDetails?.minSalary ?? "").toLowerCase(),
      cell: ({ row }) =>
        row.original?.privatJobDetails?.minSalary || "Not Provided",
    },
    {
      accessorKey: "maxSalary",
      header: "Max Salary",
      accessorFn: (row) =>
        String(row?.privatJobDetails?.maxSalary ?? "").toLowerCase(),
      cell: ({ row }) =>
        row.original?.privatJobDetails?.maxSalary || "Not Provided",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const job = row.original;
        const isPublished = job.status === "published";

        return (
          <div className="d-flex align-items-center gap-2">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => toggleJobStatus(job._id, e.target.checked)}
              />
            </div>

            <span
              className={`fw-semibold ${
                isPublished ? "text-danger" : "text-success"
              }`}
            >
              {isPublished ? "Stop" : "Publish"}
            </span>
          </div>
        );
      },
    },
  ];
  const toggleJobStatus = async (jobId, checked) => {
    try {
      const status = checked ? "published" : "unpublished";

      await axios.post(
        `${API_BASE_URL}company/jobs/${jobId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchCandidates(companyActiveId);
    } catch (error) {
      console.error("Failed to update job status", error);
    }
  };

  return (
    <div>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Active Jobs</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-recruiter">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Active Jobs List
          </h5>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <TableView
                columns={columns}
                data={publishJob}
                limit={limit}
                setLimit={(val) => {
                  setLimit(val);
                  setPage(1);
                }}
              />

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-sm btn-primary mx-1"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm mx-1 ${
                      page === i + 1 ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="btn btn-sm btn-primary mx-1"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyActiveJob;
