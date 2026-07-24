import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { TableView } from "../components/DataTable";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useCallback, useEffect, useState } from "react";

const RecruiterList = () => {
  const location = useLocation();
  const companyDataId = location?.state?.companyDataId;
  const [recruiterList, setRecruiterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecruiters = useCallback(async () => {
    if (!companyDataId) return;

    try {
      setLoading(true);
      const params = {
        companyId: companyDataId,
        page,
        limit,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const response = await axios.post(
        `${API_BASE_URL}admin/recruiterList`,
        {},
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setRecruiterList(response.data.recruiters || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setRecruiterList([]);
    } finally {
      setLoading(false);
    }
  }, [companyDataId, page, limit, debouncedSearch]);

  useEffect(() => {
    setPage(1);
    setSearchQuery("");
    setDebouncedSearch("");
  }, [companyDataId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  const getRecruiterName = (row) =>
    `${row.first_name || ""} ${row.last_name || ""}`.trim();

  const columns = [
    {
      Header: "S.No",
      id: "sno",
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      Header: "Img",
      id: "profileImage",
      Cell: ({ row }) => (
        <img
          crossOrigin="anonymous"
          src={getImageUrl(row.original.logo)}
          alt="candidate"
          width={45}
          height={45}
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
      ),
    },
    {
      Header: "Recruiter Name",
      id: "name",
      accessor: (row) => getRecruiterName(row),
      Cell: ({ row }) => getRecruiterName(row.original) || "Not Provided",
    },
    {
      Header: "Email ID",
      id: "email",
      accessor: (row) => row.email || "",
      Cell: ({ row }) => row.original.email || "Not Provided",
    },
    {
      Header: "Status",
      id: "status",
      accessor: "status",
      Cell: ({ row }) => {
        const status = row.original.status;

        if (status !== "Active" && status !== "Inactive") {
          return status || "-";
        }

        const isActive = status === "Active";

        return (
          <span
            style={{
              color: isActive ? "#16a34a" : "#dc2626",
              backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div>
      <ToastContainer />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Manage Recruiters</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link
              to="/admin/complete-company-details"
              state={{ companyProfileId: companyDataId }}
            >
              <i className="fa-solid fa-angles-left" />
            </Link>
            Recruiters List
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="card-body">
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-5">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search by recruiter name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <small>Show</small>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "80px" }}
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <small>entries</small>
                </div>
              </div>
              {searchQuery && (
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : recruiterList.length === 0 ? (
              <div className="simple-list-empty-state">
                <i className="fa-solid fa-users" />
                <h6>
                  {searchQuery ? "No matching recruiters found" : "No recruiters found"}
                </h6>
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={clearFilters}
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <TableView
                columns={columns}
                data={recruiterList}
                hideControls
              />
            )}

            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-primary mx-1"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn btn-sm mx-1 ${
                      page === index + 1 ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-primary mx-1"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecruiterList;
