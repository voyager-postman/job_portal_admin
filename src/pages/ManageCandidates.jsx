import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useDebounce } from "../hooks/useDebounce";
import AdminChangePasswordModal from "../components/AdminChangePasswordModal";

function ManageCandidates() {
  const [jobSeeker, setJobSeeker] = useState([]);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const getTotalPages = (responseData) =>
    responseData?.pagination?.totalPages || responseData?.totalPages || 1;

  const getTotal = (responseData) =>
    responseData?.pagination?.total || responseData?.total || 0;

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) {
      return url;
    }
    return `${API_IMAGE_URL}${url}`;
  };
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
          src={getImageUrl(row.original.profileImage)}
          width={30}
          height={30}
          style={{ borderRadius: "50%" }}
          alt="candidate"
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
      ),
    },

    {
      Header: "Candidates Name",
      accessor: (row) =>
        `${row.first_name || ""} ${row.last_name || ""}`.toLowerCase(),
      id: "name",
      Cell: ({ row }) => (
        <>
          {row.original.first_name || "Not Provided"}{" "}
          {row.original.last_name || ""}
        </>
      ),
    },

    {
      Header: "Email ID",
      accessor: "email",
      Cell: ({ row }) => row.original.email || "Not Provided",
    },

    {
      Header: "Contact Number",
      accessor: "phone",
      Cell: ({ row }) => row.original.phone || "Not Provided",
    },

    {
      Header: "Country",
      accessor: "Nationality",
      Cell: ({ row }) => row.original.Nationality || "Not Provided",
    },

    {
      Header: "Home",
      id: "home",
      Cell: () => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },

    {
      Header: "Status",
      id: "status",
      Cell: ({ row }) => {
        const userId = row.original._id;
        const currentStatus = row.original.status;

        const handleStatusChange = async (e) => {
          const newStatus = e.target.checked ? "Active" : "Inactive";

          try {
            const response = await axios.post(
              `${API_BASE_URL}admin/jobSeekerStatus`,
              { userId, status: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            if (response.data.success) {
              toast.success(response.data.message);
              fetchCandidates();
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

    {
      Header: "Action",
      id: "action",
      Cell: ({ row }) => {
        const candidateId = row.original._id;

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
                  `${API_BASE_URL}delete/candidate`,
                  { candidateId },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
                );

                if (response.data.success) {
                  toast.success("Candidate deleted successfully!");
                  fetchCandidates();
                } else {
                  toast.error(response.data.message);
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
              to="/admin/candidate-details"
              state={{
                candidateProfileId: row.original.candidateProfile?.userId,
              }}
              title="View Details"
            >
              <i className="fa-solid fa-eye"></i>
            </Link>

            <i
              className="fa-solid fa-key"
              title="Change Password"
              style={{
                cursor: "pointer",
                marginLeft: "8px",
                marginRight: "8px",
                color: "#2563eb",
              }}
              onClick={() =>
                setPasswordModalUser({
                  _id: row.original._id,
                  name:
                    `${row.original.first_name || ""} ${
                      row.original.last_name || ""
                    }`.trim() || "Candidate",
                  email: row.original.email,
                  role: "Candidate",
                })
              }
            ></i>

            <i
              className="fa-solid fa-trash"
              title="Delete"
              style={{ cursor: "pointer" }}
              onClick={handleDelete}
            ></i>
          </div>
        );
      },
    },
  ];
  // const columns = [
  //   {
  //     accessorKey: "sno",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "profileImage",
  //     header: "Img",
  //     cell: ({ row }) => (
  //       <img
  //         src={getImageUrl(row.original.profileImage)}
  //         width={45}
  //         height={45}
  //         style={{ borderRadius: "50%" }}
  //         alt="candidate"
  //         onError={(e) => {
  //           e.currentTarget.src =
  //             "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Candidates Name",
  //     accessorFn: (row) =>
  //       `${row.first_name || ""} ${row.last_name || ""}`.toLowerCase(),
  //     cell: ({ row }) => (
  //       <>
  //         {row.original.first_name || "Not Provided"}{" "}
  //         {row.original.last_name || ""}
  //       </>
  //     ),
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email ID",
  //     accessorFn: (row) => (row.email || "").toLowerCase(),
  //     cell: ({ row }) => row.original.email || "Not Provided",
  //   },
  //   {
  //     accessorKey: "phone",
  //     header: "Contact Number",
  //     accessorFn: (row) => (row.phone || "").toLowerCase(),
  //     cell: ({ row }) => row.original.phone || "Not Provided",
  //   },
  //   {
  //     accessorKey: "country",
  //     header: "Country",
  //     accessorFn: (row) => (row.Nationality || "").toLowerCase(),
  //     cell: ({ row }) => row.original.Nationality || "Not Provided",
  //   },
  //   {
  //     accessorKey: "home",
  //     header: "Home",
  //     cell: () => (
  //       <div className="super-admin-toggle-switch">
  //         {" "}
  //         <label className="switch">
  //           {" "}
  //           <input type="checkbox" defaultChecked />{" "}
  //           <span className="slider round"></span>{" "}
  //         </label>{" "}
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => {
  //       const userId = row.original._id;
  //       const currentStatus = row.original.status;

  //       const handleStatusChange = async (e) => {
  //         const newStatus = e.target.checked ? "Active" : "Inactive";

  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}admin/jobSeekerStatus`,
  //             { userId, status: newStatus },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );

  //           if (response.data.success) {
  //             toast.success(response.data.message);
  //             fetchCandidates();
  //           } else {
  //             toast.error(response.data.message);
  //           }
  //         } catch (err) {
  //           toast.error("Something went wrong!");
  //         }
  //       };

  //       return (
  //         <div className="super-admin-toggle-switch">
  //           <label className="switch">
  //             <input
  //               type="checkbox"
  //               checked={currentStatus === "Active"}
  //               onChange={handleStatusChange}
  //             />
  //             <span className="slider round"></span>
  //           </label>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "action",
  //     header: "Action",
  //     cell: ({ row }) => {
  //       const candidateId = row.original._id;
  //       const handleDelete = () => {
  //         Swal.fire({
  //           title: "Are you sure?",
  //           text: "You won't be able to revert this!",
  //           icon: "warning",
  //           showCancelButton: true,
  //           confirmButtonColor: "#3085d6",
  //           cancelButtonColor: "#d33",
  //           confirmButtonText: "Yes, delete it!",
  //         }).then(async (result) => {
  //           if (result.isConfirmed) {
  //             try {
  //               const response = await axios.post(
  //                 `${API_BASE_URL}delete/candidate`,
  //                 { candidateId }, // <-- Correct parameter
  //                 {
  //                   headers: {
  //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                   },
  //                 },
  //               );

  //               if (response.data.success) {
  //                 toast.success("Candidate deleted successfully!");
  //                 fetchCandidates();
  //               } else {
  //                 toast.error(
  //                   response.data.message || "Failed to delete candidate.",
  //                 );
  //               }
  //             } catch (err) {
  //               toast.error("Something went wrong!");
  //             }
  //           }
  //         });
  //       };

  //       return (
  //         <div className="super-admin-action-icons">
  //           <Link
  //             to="/admin/candidate-details"
  //             state={{
  //               candidateProfileId: row.original.candidateProfile?.userId,
  //             }}
  //           >
  //             <i className="fa-solid fa-eye"></i>
  //           </Link>
  //           <i
  //             className="fa-solid fa-trash"
  //             style={{ cursor: "pointer", marginLeft: "10px" }}
  //             onClick={handleDelete}
  //           ></i>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  // Fetch Data with page + limit + date range
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      const response = await axios.get(`${API_BASE_URL}admin/jobseekers`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobSeeker(response.data.data || []);
      setTotalPages(getTotalPages(response.data));
      setTotal(getTotal(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchCandidates();
  }, [page, limit, debouncedSearch, startDate, endDate]);

  const handleClearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Export Excel
  const exportAllCandidates = async () => {
    try {
      const baseParams = {
        limit,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      // 1️⃣ First call → get pagination info
      const firstCall = await axios.get(
        `${API_BASE_URL}admin/jobseekers`,
        {
          params: { ...baseParams, page: 1 },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const totalPages = firstCall.data.totalPages || 1;
      let allCandidates = [...(firstCall.data.data || [])];

      // 2️⃣ Fetch remaining pages dynamically
      for (let p = 2; p <= totalPages; p++) {
        const res = await axios.get(
          `${API_BASE_URL}admin/jobseekers`,
          {
            params: { ...baseParams, page: p },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        allCandidates = [...allCandidates, ...(res.data.data || [])];
      }

      if (!allCandidates.length) {
        toast.warn("No data found to export!");
        return;
      }

      // 3️⃣ Prepare Excel
      const exportData = allCandidates.map((item, index) => ({
        S_No: index + 1,
        First_Name: item.first_name || "",
        Last_Name: item.last_name || "",
        Email: item.email || "",
        Phone: item.phone || "",
        Country: item.Nationality || "",
        Status: item.status || "",
        Registered_At: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Candidates");
      XLSX.writeFile(workbook, `all_candidates_${startDate || "all"}_to_${endDate || "now"}.xlsx`);

      toast.success("All candidates exported successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to export all data!");
    }
  };
  return (
    <>
      <ToastContainer />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Candidate Management</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Candidates
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          {/* Admin Date-Range Filter Toolbar */}
          <div className="admin-filter-toolbar">
            <div className="admin-filter-item">
              <label>Start Date:</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="admin-filter-item">
              <label>End Date:</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {(startDate || endDate || search) && (
              <button
                className="btn-filter-clear"
                onClick={handleClearFilters}
                title="Reset date filters"
              >
                <i className="fa-solid fa-arrow-rotate-left"></i> Reset Filters
              </button>
            )}

            <div className="admin-filter-actions">
              <button className="data-export-btn" onClick={exportAllCandidates}>
                <i className="fa-solid fa-file-excel me-1"></i> Export Data
              </button>
            </div>
          </div>

          <div className="table-responsive-data-table">
            {loading && (
              <div className="d-flex justify-content-center py-2">
                <div className="spinner-border spinner-border-sm text-primary"></div>
              </div>
            )}
            <TableView
              columns={columns}
              data={jobSeeker}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={(val) => {
                setLimit(val);
                setPage(1);
              }}
              totalPages={totalPages}
              total={total}
              globalFilter={search}
              setGlobalFilter={(val) => {
                setSearch(val || "");
              }}
            />
          </div>
        </div>

        <AdminChangePasswordModal
          isOpen={Boolean(passwordModalUser)}
          user={passwordModalUser}
          onClose={() => setPasswordModalUser(null)}
        />
      </section>
    </>
  );
}

export default ManageCandidates;
