import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
<<<<<<< HEAD
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
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert UI
      setNewEmployer((prev) =>
        prev.map((item) =>
          item._id === companyId
            ? { ...item, verifiedByAdmin: !newStatus }
            : item
        )
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
=======

function ManageUsers() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // auto index
    },
    {
      accessorKey: "image",
      header: "Img",
      cell: ({ row }) => (
        <div className="recruiterImg-info">
          <img
            src={row.original.image}
            alt="user"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
        </div>
      ),
    },
    {
<<<<<<< HEAD
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
              }
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
                  }
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
                companyDetails:row.original
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
=======
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    },
    {
      accessorKey: "email",
      header: "Email",
<<<<<<< HEAD
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
=======
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <div class="super-admin-toggle-switch">
          <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          </label>
        </div>
      ),
    },
    {
<<<<<<< HEAD
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

          <i className="fa-solid fa-trash" title="Delete"></i>
=======
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div
          className="super-admin-action-icons
"
        >
          <Link to="/admin/company-details">
            <i class="fa-solid fa-eye"></i>{" "}
          </Link>{" "}
          <i className="fa-solid fa-trash" title="Delete" />
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
        </div>
      ),
    },
  ];

<<<<<<< HEAD
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
        type === "new" ? "New Companies" : "All Companies"
      );

      XLSX.writeFile(
        workbook,
        type === "new" ? "new_companies.xlsx" : "all_companies.xlsx"
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
=======
  // ✅ Dummy Recruiters Data
  const data = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@example.com",
      position: "HR Manager",
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      first_name: "Sophia",
      last_name: "Brown",
      email: "sophia.brown@example.com",
      position: "Recruiter",
    },
    {
      id: 3,
      image: "https://randomuser.me/api/portraits/men/31.jpg",
      first_name: "Michael",
      last_name: "Lee",
      email: "michael.lee@example.com",
      position: "Team Lead",
    },
    {
      id: 4,
      image: "https://randomuser.me/api/portraits/women/41.jpg",
      first_name: "Emily",
      last_name: "Wilson",
      email: "emily.wilson@example.com",
      position: "HR Assistant",
    },
    {
      id: 5,
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      first_name: "Daniel",
      last_name: "Miller",
      email: "daniel.miller@example.com",
      position: "Software Engineer",
    },
    {
      id: 6,
      image: "https://randomuser.me/api/portraits/women/61.jpg",
      first_name: "Ava",
      last_name: "Johnson",
      email: "ava.johnson@example.com",
      position: "Recruiter",
    },
    {
      id: 7,
      image: "https://randomuser.me/api/portraits/men/71.jpg",
      first_name: "Liam",
      last_name: "Taylor",
      email: "liam.taylor@example.com",
      position: "Designer",
    },
    {
      id: 8,
      image: "https://randomuser.me/api/portraits/women/81.jpg",
      first_name: "Olivia",
      last_name: "Anderson",
      email: "olivia.anderson@example.com",
      position: "Staff Member",
    },
    {
      id: 9,
      image: "https://randomuser.me/api/portraits/men/91.jpg",
      first_name: "James",
      last_name: "Clark",
      email: "james.clark@example.com",
      position: "Recruiter",
    },
    {
      id: 10,
      image: "https://randomuser.me/api/portraits/women/10.jpg",
      first_name: "Isabella",
      last_name: "Lopez",
      email: "isabella.lopez@example.com",
      position: "HR Executive",
    },
  ];

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4> Manage Recruiters</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
           <Link to="/admin/" >
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage Recruiters List
        </h5>
      </div>
      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="common-tab-btn-main">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                data-bs-toggle="tab"
                href="#All-Companies"
                aria-selected="true"
                role="tab"
              >
                All Companies
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                data-bs-toggle="tab"
                href="#New-Companies"
                aria-selected="false"
                tabIndex={-1}
                role="tab"
              >
                New Companies
              </a>
            </li>
          </ul>
          <div className="all-fillter-box-info">
            <div className="fillter-data-box-info">
              <div className="fillter-data-box">
                <div className="form-group">
                  <label>Short By</label>
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Select A Industry</option>
                    <option value="general">Technology</option>
                    <option value="billing">Finance</option>
                    <option value="billing">Healthcare</option>
                    <option value="billing">Manufacturing</option>
                    <option value="billing">Education</option>
                    <option value="billing">Construction</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="fillter-data-box-info">
              <div className="fillter-data-box">
                <div className="form-group">
                  <label>Short By</label>
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Select A Country</option>
                    <option value="general">USA</option>
                    <option value="billing">Canada</option>
                    <option value="billing">Germany</option>
                    <option value="billing">Australia</option>
                    <option value="billing">Singapore</option>
                    <option value="billing">Japan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="data-export-btn-info">
            <a href="#" className="data-export-btn">
              Export Data
            </a>
          </div>
        </div>
        <div className="tab-content-info-area tab-content">
          <div
            id="All-Companies"
            className="tab-pane active show"
            role="tabpanel"
          >
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Img</th>
                    <th>Recruiter Name</th>
                    <th>Email ID</th>
                    <th>Contact Number</th>
                    <th>Create Date</th>
                    <th>Industry</th>
                    <th>Country</th>
                    <th>Home</th>
                    <th>Status</th>
                    <th className="common-action-col-space">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/1.jpg"
                        alt="Alice Johnson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Alice Johnson</td>
                    <td>alice.johnson@example.com</td>
                    <td>+1-555-1001</td>
                    <td>13-09-2024</td>
                    <td>Technology</td>
                    <td>USA</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/2.jpg"
                        alt="Bob Smith"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Bob Smith</td>
                    <td>bob.smith@example.com</td>
                    <td>+1-555-1002</td>
                    <td>14-09-2024</td>
                    <td>Finance</td>
                    <td>Canada</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/3.jpg"
                        alt="Carol Andrews"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Carol Andrews</td>
                    <td>carol.andrews@example.com</td>
                    <td>+1-555-1003</td>
                    <td>15-09-2024</td>
                    <td>Healthcare</td>
                    <td>UK</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="David Brown"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>David Brown</td>
                    <td>david.brown@example.com</td>
                    <td>+1-555-1004</td>
                    <td>16-09-2024</td>
                    <td>Manufacturing</td>
                    <td>Germany</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/5.jpg"
                        alt="Emma Watson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Emma Watson</td>
                    <td>emma.watson@example.com</td>
                    <td>+1-555-1005</td>
                    <td>17-09-2024</td>
                    <td>Education</td>
                    <td>Australia</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/6.jpg"
                        alt="Frank Miller"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Frank Miller</td>
                    <td>frank.miller@example.com</td>
                    <td>+1-555-1006</td>
                    <td>18-09-2024</td>
                    <td>Construction</td>
                    <td>USA</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/7.jpg"
                        alt="Grace Lee"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Grace Lee</td>
                    <td>grace.lee@example.com</td>
                    <td>+1-555-1007</td>
                    <td>19-09-2024</td>
                    <td>Retail</td>
                    <td>Singapore</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/8.jpg"
                        alt="Henry Wilson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Henry Wilson</td>
                    <td>henry.wilson@example.com</td>
                    <td>+1-555-1008</td>
                    <td>20-09-2024</td>
                    <td>Automotive</td>
                    <td>Japan</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/9.jpg"
                        alt="Ivy Hall"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Ivy Hall</td>
                    <td>ivy.hall@example.com</td>
                    <td>+1-555-1009</td>
                    <td>21-09-2024</td>
                    <td>Hospitality</td>
                    <td>France</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/10.jpg"
                        alt="Jack Green"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Jack Green</td>
                    <td>jack.green@example.com</td>
                    <td>+1-555-1010</td>
                    <td>22-09-2024</td>
                    <td>Energy</td>
                    <td>Norway</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/11.jpg"
                        alt="Karen Scott"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Karen Scott</td>
                    <td>karen.scott@example.com</td>
                    <td>+1-555-1011</td>
                    <td>23-09-2024</td>
                    <td>Legal</td>
                    <td>Switzerland</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/12.jpg"
                        alt="Leo White"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Leo White</td>
                    <td>leo.white@example.com</td>
                    <td>+1-555-1012</td>
                    <td>24-09-2024</td>
                    <td>Marketing</td>
                    <td>Netherlands</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/13.jpg"
                        alt="Mia Scott"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Mia Scott</td>
                    <td>mia.scott@example.com</td>
                    <td>+1-555-1013</td>
                    <td>25-09-2024</td>
                    <td>Design</td>
                    <td>Italy</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/14.jpg"
                        alt="Noah Green"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Noah Green</td>
                    <td>noah.green@example.com</td>
                    <td>+1-555-1014</td>
                    <td>26-09-2024</td>
                    <td>Real Estate</td>
                    <td>Spain</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/15.jpg"
                        alt="Olivia Adams"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Olivia Adams</td>
                    <td>olivia.adams@example.com</td>
                    <td>+1-555-1015</td>
                    <td>27-09-2024</td>
                    <td>Hospital</td>
                    <td>India</td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div id="New-Companies" className="tab-pane fade" role="tabpanel">
            <div className="table-responsive">
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Img</th>
                    <th>Recruiter Name</th>
                    <th>Email ID</th>
                    <th>Contact Number</th>
                    <th>Create Date</th>
                    <th>Industry</th>
                    <th>Country</th>
                    <th>Request</th>
                    <th className="common-action-col-space">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/1.jpg"
                        alt="Alice Johnson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Alice Johnson</td>
                    <td>alice.johnson@example.com</td>
                    <td>+1-555-1001</td>
                    <td>13-09-2024</td>
                    <td>Technology</td>
                    <td>USA</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/2.jpg"
                        alt="Bob Smith"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Bob Smith</td>
                    <td>bob.smith@example.com</td>
                    <td>+1-555-1002</td>
                    <td>14-09-2024</td>
                    <td>Finance</td>
                    <td>Canada</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/3.jpg"
                        alt="Carol Andrews"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Carol Andrews</td>
                    <td>carol.andrews@example.com</td>
                    <td>+1-555-1003</td>
                    <td>15-09-2024</td>
                    <td>Healthcare</td>
                    <td>UK</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="David Brown"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>David Brown</td>
                    <td>david.brown@example.com</td>
                    <td>+1-555-1004</td>
                    <td>16-09-2024</td>
                    <td>Manufacturing</td>
                    <td>Germany</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/5.jpg"
                        alt="Emma Watson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Emma Watson</td>
                    <td>emma.watson@example.com</td>
                    <td>+1-555-1005</td>
                    <td>17-09-2024</td>
                    <td>Education</td>
                    <td>Australia</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
                          <i className="fa-solid fa-eye" />
                        </a>
                        <a href="#">
                          <i className="fa-solid fa-trash" />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          </div>
        </div>
      </div>
    </section>
  );
}

export default ManageUsers;
