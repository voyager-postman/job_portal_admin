import React from "react";
import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

function ManageUsers() {
  const [employer, setEmployer] = useState([]);
  const [newEmployer, setNewEmployer] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [newTotalPages, setNewTotalPages] = useState(1);

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  // ------------------------------------------------------
  // FETCH ALL COMPANIES (Pagination working)
  // ------------------------------------------------------
  const fetchEmployerList = async () => {
    try {
      setLoadingAll(true);
      const response = await axios.get(`${API_BASE_URL}admin/companies`, {
        params: { page, limit },
      });

      setEmployer(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAll(false);
    }
  };

  // ------------------------------------------------------
  // FETCH NEW COMPANIES (Pagination working)
  // ------------------------------------------------------
  const fetchNewEmployerList = async () => {
    try {
      setLoadingNew(true);
      const response = await axios.get(`${API_BASE_URL}admin/companies`, {
        params: { status: "new", page: newPage, limit },
      });

      setNewEmployer(response.data.data || []);
      setNewTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingNew(false);
    }
  };

  useEffect(() => {
    fetchEmployerList();
  }, [page, limit]);

  useEffect(() => {
    fetchNewEmployerList();
  }, [newPage, limit]);

  // ------------------------------------------------------
  // COLUMNS FOR ALL COMPANIES (columns1)
  // ------------------------------------------------------
  const handleVerifyChange = async (companyId, newStatus) => {
    try {
      const response = await axios.post(`${API_BASE_URL}admin/verifyCompany`, {
        companyId,
        verifiedByAdmin: newStatus,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchNewEmployerList();
        fetchEmployerList();
      }
      setNewEmployer((prev) =>
        prev.map((item) =>
          item._id === companyId
            ? { ...item, verifiedByAdmin: newStatus }
            : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert UI
      setNewEmployer((prev) =>
        prev.map((item) =>
          item._id === companyId
            ? { ...item, verifiedByAdmin: !newStatus }
            : item,
        ),
      );
    }
  };

  const columns1 = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "profileImage",
      header: "Img",
      cell: ({ row }) => (
        <img
          crossorigin="anonymous"
          src={getImageUrl(row.original.companyId?.logo)}
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
      accessorKey: "name",
      header: "Company Name",
      accessorFn: (row) => (row.companyId.brandName || "").toLowerCase(),
      cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
    },
    {
      accessorKey: "email",
      header: "Email ID",
      accessorFn: (row) => (row.email || "").toLowerCase(),
      cell: ({ row }) => row.original.email || "Not Provided",
    },
    {
      accessorKey: "industry",
      header: "Industry",
      accessorFn: (row) => (row.companyId.industry.name || "").toLowerCase(),
      cell: ({ row }) =>
        row.original?.companyId?.industry?.name || "Not Provided",
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => {
        const isVerified =
          row.original?.verifiedByAdmin === "true" ||
          row.original?.verifiedByAdmin === true;

        return (
          <span
            style={{
              color: isVerified ? "#16a34a" : "#dc2626",
              backgroundColor: isVerified ? "#dcfce7" : "#fee2e2",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            {isVerified ? "Verified" : "Not Verified"}
          </span>
        );
      },
    },
    // 👉 Home Toggle
    {
      accessorKey: "home",
      header: "Home",
      cell: () => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      accessorKey: "enterpriseCanCreateTests",
      header: "Assessment",
      cell: ({ row }) => {
        const companyId = row.original.companyId._id;
        const apiStatus =
          row.original.companyId.enterpriseCanCreateTests === true;

        const handleStatusChange = async (e) => {
          const newStatus = e.target.checked;

          try {
            const response = await axios.put(
              `${API_BASE_URL}admin/company/test-access/${companyId}`,
              { enable: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            if (response.data.success) {
              toast.success(response.data.message);
              fetchEmployerList(); // refresh data
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed");
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={apiStatus}
                onChange={handleStatusChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const companyId = row.original._id;
        const currentStatus = row.original.status;

        const handleStatusChange = async (e) => {
          const newStatus = e.target.checked ? "Active" : "Inactive";

          try {
            const response = await axios.post(
              `${API_BASE_URL}admin/companyStatus`,
              { companyId, status: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            if (response.data.success) {
              toast.success(response.data.message);
              fetchEmployerList();
            } else {
              toast.error(response.data.message);
            }
          } catch (err) {
            toast.error("Something went wrong!");
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={currentStatus === "Active"}
                onChange={handleStatusChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },

    // 👉 Action
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const companyId = row.original._id;
        const handleDelete = () => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await axios.post(
                  `${API_BASE_URL}delete/company`,
                  { companyId },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
                );
                if (response.data.success) {
                  toast.success("Company Deleted Successfully!");
                  fetchEmployerList();
                }
              } catch (err) {
                toast.error("Something went wrong!");
              }
            }
          });
        };
        return (
          <div className="super-admin-action-icons">
            <Link
              to="/admin/complete-company-details"
              state={{
                companyProfileId: row.original?.companyId?._id,
                companyDetails: row.original,
              }}
            >
              <i className="fa-solid fa-eye"></i>
            </Link>
            {/* <Link
              to="/admin/recruiter-list"
              state={{
                companyDataId: row.original?.companyId?._id,
              }}
            >
              <i
                className="fas fa-users-cog"
                style={{ cursor: "pointer", marginLeft: "10px" }}
              ></i>
            </Link>
            <Link
              to="/admin/company-active-job"
              state={{
                companyActiveId: row.original?.companyId?._id,
              }}
            >
              <i
                className="fas fa-upload"
                style={{ cursor: "pointer", marginLeft: "10px" }}
              ></i>
            </Link> */}
            <i
              className="fa-solid fa-trash"
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={handleDelete}
            ></i>
          </div>
        );
      },
    },
  ];

  // ------------------------------------------------------
  // COLUMNS FOR NEW COMPANIES (columns2)
  // ------------------------------------------------------
  const columns2 = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (newPage - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "profileImage",
      header: "Img",
      cell: ({ row }) => (
        <img
          crossorigin="anonymous"
          src={getImageUrl(row.original.companyId?.logo)}
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
      accessorKey: "name",
      header: "Company Name",
      accessorFn: (row) => (row.companyId.brandName || "").toLowerCase(),
      cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
    },
    {
      accessorKey: "email",
      header: "Email",
      accessorFn: (row) => (row.email || "").toLowerCase(),
      cell: ({ row }) => row.original.email || "Not Provided",
    },
    {
      accessorKey: "industry",
      header: "Industry",
      accessorFn: (row) => (row.companyId.industry.name || "").toLowerCase(),
      cell: ({ row }) =>
        row.original?.companyId?.industry?.name || "Not Provided",
    },
    // 👉 Home Toggle
    {
      accessorKey: "home",
      header: "Home",
      cell: () => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original?.verifiedByAdmin}
              onChange={(e) =>
                handleVerifyChange(row.original?._id, e.target.checked)
              }
            />
            <span className="slider round" />
          </label>
        </div>
      ),
    },
    // 👉 Action
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/company-details"
            state={{
              companyProfileId: row.original?.companyId?._id,
            }}
          >
            <i class="fa-solid fa-eye"></i>
          </Link>

          <i
            className="fa-solid fa-trash"
            title="Delete"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    const response = await axios.post(
                      `${API_BASE_URL}delete/company`,
                      { companyId: row.original._id },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      },
                    );
                    if (response.data.success) {
                      toast.success("Company Deleted Successfully!");
                      fetchNewEmployerList();
                    }
                  } catch (err) {
                    toast.error("Something went wrong!");
                  }
                }
              });
            }}
          ></i>
        </div>
      ),
    },
  ];

  // ------------------------------------------------------
  // EXPORT ALL COMPANIES (DYNAMIC PAGINATION)
  // ------------------------------------------------------
  const exportAllCompanies = async (type = "all") => {
    try {
      const params =
        type === "new" ? { status: "new", page: 1, limit } : { page: 1, limit };

      // 1️⃣ First call → get totalPages
      const firstCall = await axios.get(`${API_BASE_URL}admin/companies`, {
        params,
      });

      const totalPagesData = firstCall.data.totalPages || 1;
      let allData = [...firstCall.data.data];

      // 2️⃣ Loop all pages dynamically
      for (let p = 2; p <= totalPagesData; p++) {
        const nextParams =
          type === "new"
            ? { status: "new", page: p, limit }
            : { page: p, limit };

        const response = await axios.get(`${API_BASE_URL}admin/companies`, {
          params: nextParams,
        });

        allData = [...allData, ...response.data.data];
      }

      if (!allData.length) {
        toast.warn("No data found to export!");
        return;
      }

      // 3️⃣ Format for Excel export
      const exportData = allData.map((item, index) => ({
        S_No: index + 1,
        Company_Name: item?.companyId?.brandName || "",
        Email: item?.email || "",
        Industry: item?.companyId?.industry?.name || "",
        Verified: item?.verifiedByAdmin ? "Verified" : "Not Verified",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        type === "new" ? "New Companies" : "All Companies",
      );

      XLSX.writeFile(
        workbook,
        type === "new" ? "new_companies.xlsx" : "all_companies.xlsx",
      );

      toast.success("Export successful!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to export data!");
    }
  };

  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />

      <div className="super-dashboard-breadcrumb-info">
        <h4>Manage Company</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Company List
        </h5>
      </div>

      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-bs-toggle="tab"
              href="#All-Companies"
            >
              All Companies
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#New-Companies">
              New Companies
            </a>
          </li>
        </ul>

        <div className="tab-content">
          {/* TAB 1 - ALL COMPANIES */}
          <div id="All-Companies" className="tab-pane fade show active">
            {loadingAll ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <div className="data-export-btn-info">
                  <button
                    className="data-export-btn"
                    onClick={() => exportAllCompanies("all")}
                  >
                    Export Data
                  </button>
                </div>

                <TableView
                  columns={columns1}
                  data={employer}
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

          {/* TAB 2 - NEW COMPANIES */}
          <div id="New-Companies" className="tab-pane fade">
            {loadingNew ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <div className="data-export-btn-info">
                  <button
                    className="data-export-btn"
                    onClick={() => exportAllCompanies("new")}
                  >
                    Export Data
                  </button>
                </div>

                <TableView
                  columns={columns2}
                  data={newEmployer}
                  limit={limit}
                  setLimit={(val) => {
                    setLimit(val);
                    setNewPage(1);
                  }}
                />

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={newPage === 1}
                    onClick={() => setNewPage(newPage - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(newTotalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm mx-1 ${
                        newPage === i + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setNewPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={newPage === newTotalPages}
                    onClick={() => setNewPage(newPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManageUsers;
