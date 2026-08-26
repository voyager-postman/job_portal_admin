import React from "react";
import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useDebounce } from "../hooks/useDebounce";
import AdminChangePasswordModal from "../components/AdminChangePasswordModal";

function ManageUsers() {
  const [employer, setEmployer] = useState([]);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newEmployer, setNewEmployer] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [newPage, setNewPage] = useState(1);
  const [newTotalPages, setNewTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search.trim(), 400);
  const debouncedNewSearch = useDebounce(newSearch.trim(), 400);
  const defaultCompanyLogo = `${process.env.PUBLIC_URL}/assets/images/companyImg/partner-logo-2.png`;

  const getTotalPages = (responseData) =>
    responseData?.pagination?.totalPages || responseData?.totalPages || 1;

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return defaultCompanyLogo;
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  // ------------------------------------------------------
  // FETCH ALL COMPANIES (Pagination + Date Range working)
  // ------------------------------------------------------
  const fetchEmployerList = async () => {
    try {
      setLoadingAll(true);
      const params = {
        page,
        limit,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      };

      const response = await axios.get(`${API_BASE_URL}admin/companies`, {
        params,
      });

      setEmployer(response.data.data || []);
      setTotalPages(getTotalPages(response.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAll(false);
    }
  };

  // ------------------------------------------------------
  // FETCH NEW COMPANIES (Pagination + Date Range working)
  // ------------------------------------------------------
  const fetchNewEmployerList = async () => {
    try {
      setLoadingNew(true);
      const params = {
        status: "new",
        page: newPage,
        limit,
        ...(debouncedNewSearch ? { search: debouncedNewSearch } : {}),
        ...(newStartDate ? { startDate: newStartDate } : {}),
        ...(newEndDate ? { endDate: newEndDate } : {}),
      };

      const response = await axios.get(`${API_BASE_URL}admin/companies`, {
        params,
      });

      setNewEmployer(response.data.data || []);
      setNewTotalPages(getTotalPages(response.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingNew(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchEmployerList();
  }, [page, limit, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    setNewPage(1);
  }, [debouncedNewSearch, newStartDate, newEndDate]);

  useEffect(() => {
    fetchNewEmployerList();
  }, [newPage, limit, debouncedNewSearch, newStartDate, newEndDate]);

  const handleClearAllFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleClearNewFilters = () => {
    setNewSearch("");
    setNewStartDate("");
    setNewEndDate("");
    setNewPage(1);
  };

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
      id: "id",
      Header: "S.No",
      Cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      id: "profileImage",
      Header: "Img",
      Cell: ({ row }) => (
        <img
          crossOrigin="anonymous"
          src={getImageUrl(row.original?.companyId?.logo)}
          alt="candidate"
          width={30}
          height={30}
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultCompanyLogo;
          }}
        />
      ),
    },
    {
      id: "name",
      Header: "Company Name",
      accessor: (row) => (row?.companyId?.brandName || "").toLowerCase(),
      Cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
    },
    {
      id: "email",
      Header: "Email ID",
      accessor: (row) => (row?.email || "").toLowerCase(),
      Cell: ({ row }) => row.original?.email || "Not Provided",
    },
    {
      id: "industry",
      Header: "Industry",
      accessor: (row) => (row?.industry?.name || "").toLowerCase(),
      Cell: ({ row }) => row.original?.industry?.name || "Not Provided",
    },
    {
      id: "verified",
      Header: "Verified",
      Cell: ({ row }) => {
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

    {
      id: "home",
      Header: "Home",
      Cell: ({ row }) => {
        const companyId = row.original?.companyId?._id;

        const highlightEnabled =
          row.original?.companyId?.companyProfileHighlightEnabled === true;

        const handleHighlightToggle = async (e) => {
          const newStatus = e.target.checked;

          try {
            const response = await axios.post(
              `${API_BASE_URL}company-profile/highlight`,
              { companyId, highlightEnabled: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );

            if (response.data.success) {
              toast.success(response.data.message || "Highlight updated");
              fetchEmployerList();
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Failed to update highlight",
            );
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={highlightEnabled}
                onChange={handleHighlightToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },

    {
      id: "enterpriseCanCreateTests",
      Header: "Assessment",
      Cell: ({ row }) => {
        const companyId = row.original?.companyId?._id || row.original?._id;
        const apiStatus =
          row.original?.companyId?.enterpriseCanCreateTests === true;

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
              fetchEmployerList();
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
                checked={Boolean(apiStatus)}
                onChange={handleStatusChange}
                disabled={!companyId}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },

    {
      id: "notifications",
      Header: "Notifications",
      Cell: ({ row }) => {
        const companyId = row.original?.companyId?._id;

        const currentStatus =
          row.original?.companyId?.notificationsEnabled ?? false;

        const handleNotificationToggle = async (e) => {
          const newStatus = e.target.checked;

          try {
            const response = await axios.post(
              `${API_BASE_URL}admin/company/${companyId}/notification-toggle`,
              { notificationsEnabled: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            if (response.data.success) {
              toast.success(response.data.message || "Notification updated!");
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
                checked={currentStatus}
                onChange={handleNotificationToggle}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },

    {
      id: "status",
      Header: "Status",
      Cell: ({ row }) => {
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

    {
      id: "action",
      Header: "Action",
      Cell: ({ row }) => {
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
                  name: row.original?.companyId?.brandName || "Company",
                  email: row.original.email,
                  role: "Employer / Recruiter",
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
  const columns2 = [
    {
      id: "id",
      Header: "S.No",
      Cell: ({ row }) => (newPage - 1) * limit + row.index + 1,
    },
    {
      id: "profileImage",
      Header: "Img",
      Cell: ({ row }) => (
        <img
          crossOrigin="anonymous"
          src={getImageUrl(row.original?.companyId?.logo)}
          alt="candidate"
          width={30}
          height={30}
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultCompanyLogo;
          }}
        />
      ),
    },
    {
      id: "name",
      Header: "Company Name",
      accessor: (row) => (row?.companyId?.brandName || "").toLowerCase(),
      Cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
    },
    {
      id: "email",
      Header: "Email",
      accessor: (row) => (row?.email || "").toLowerCase(),
      Cell: ({ row }) => row.original?.email || "Not Provided",
    },
    {
      id: "industry",
      Header: "Industry",
      accessor: (row) => (row?.industry?.name || "").toLowerCase(),
      Cell: ({ row }) =>
        row.original?.industry?.name || "Not Provided",
    },
    {
      id: "verified",
      Header: "Verified",
      Cell: ({ row }) => (
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
    {
      id: "action",
      Header: "Action",
      Cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/company-details"
            state={{
              companyProfileId: row.original?.companyId?._id,
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
                name: row.original?.companyId?.brandName || "Company",
                email: row.original.email,
                role: "Employer / Recruiter",
              })
            }
          ></i>

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
  // const columns1 = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "profileImage",
  //     header: "Img",
  //     cell: ({ row }) => (
  //       <img
  //         crossorigin="anonymous"
  //         src={getImageUrl(row.original.companyId?.logo)}
  //         alt="candidate"
  //         width={45}
  //         height={45}
  //         style={{ borderRadius: "50%" }}
  //         onError={(e) => {
  //           e.currentTarget.src =
  //             "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Company Name",
  //     accessorFn: (row) => (row.companyId.brandName || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email ID",
  //     accessorFn: (row) => (row.email || "").toLowerCase(),
  //     cell: ({ row }) => row.original.email || "Not Provided",
  //   },
  //   {
  //     accessorKey: "industry",
  //     header: "Industry",
  //     accessorFn: (row) => (row.industry.name || "").toLowerCase(),
  //     cell: ({ row }) =>
  //       row.original?.industry?.name || "Not Provided",
  //   },
  //   {
  //     accessorKey: "verified",
  //     header: "Verified",
  //     cell: ({ row }) => {
  //       const isVerified =
  //         row.original?.verifiedByAdmin === "true" ||
  //         row.original?.verifiedByAdmin === true;

  //       return (
  //         <span
  //           style={{
  //             color: isVerified ? "#16a34a" : "#dc2626",
  //             backgroundColor: isVerified ? "#dcfce7" : "#fee2e2",
  //             padding: "4px 10px",
  //             borderRadius: "6px",
  //             fontSize: "13px",
  //             fontWeight: "600",
  //             display: "inline-block",
  //           }}
  //         >
  //           {isVerified ? "Verified" : "Not Verified"}
  //         </span>
  //       );
  //     },
  //   },

  //   {
  //     accessorKey: "home",
  //     header: "Home",
  //     cell: ({ row }) => {
  //       const companyId = row.original?.companyId?._id;

  //       const highlightEnabled =
  //         row.original?.companyId?.companyProfileHighlightEnabled === true;

  //       const handleHighlightToggle = async (e) => {
  //         const newStatus = e.target.checked;

  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}company-profile/highlight`,
  //             {
  //               companyId,
  //               highlightEnabled: newStatus,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );

  //           if (response.data.success) {
  //             toast.success(response.data.message || "Highlight updated");
  //             fetchEmployerList();
  //           } else {
  //             toast.error(response.data.message);
  //           }
  //         } catch (error) {
  //           toast.error(
  //             error?.response?.data?.message || "Failed to update highlight",
  //           );
  //         }
  //       };

  //       return (
  //         <div className="super-admin-toggle-switch">
  //           <label className="switch">
  //             <input
  //               type="checkbox"
  //               checked={highlightEnabled}
  //               onChange={handleHighlightToggle}
  //             />
  //             <span className="slider round"></span>
  //           </label>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "enterpriseCanCreateTests",
  //     header: "Assessment",
  //     cell: ({ row }) => {
  //       const companyId = row.original.companyId._id;
  //       const apiStatus =
  //         row.original.companyId.enterpriseCanCreateTests == true;

  //       const handleStatusChange = async (e) => {
  //         const newStatus = e.target.checked;

  //         try {
  //           const response = await axios.put(
  //             `${API_BASE_URL}admin/company/test-access/${companyId}`,
  //             { enable: newStatus },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );

  //           if (response.data.success) {
  //             toast.success(response.data.message);
  //             fetchEmployerList(); // refresh data
  //           } else {
  //             toast.error(response.data.message);
  //           }
  //         } catch (error) {
  //           toast.error(error?.response?.data?.message || "Update failed");
  //         }
  //       };

  //       return (
  //         <div className="super-admin-toggle-switch">
  //           <label className="switch">
  //             <input
  //               type="checkbox"
  //               checked={apiStatus}
  //               onChange={handleStatusChange}
  //             />
  //             <span className="slider round"></span>
  //           </label>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "notifications",
  //     header: "Notifications",
  //     cell: ({ row }) => {
  //       const companyId = row.original?.companyId?._id;

  //       const currentStatus =
  //         row.original?.companyId?.notificationsEnabled ?? false;
  //       const handleNotificationToggle = async (e) => {
  //         const newStatus = e.target.checked;

  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}admin/company/${companyId}/notification-toggle`,
  //             { notificationsEnabled: newStatus },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );
  //           if (response.data.success) {
  //             toast.success(response.data.message || "Notification updated!");
  //             fetchEmployerList(); // refresh data
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
  //               checked={currentStatus}
  //               onChange={handleNotificationToggle}
  //             />
  //             <span className="slider round"></span>
  //           </label>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => {
  //       const companyId = row.original._id;
  //       const currentStatus = row.original.status;

  //       const handleStatusChange = async (e) => {
  //         const newStatus = e.target.checked ? "Active" : "Inactive";

  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}admin/companyStatus`,
  //             { companyId, status: newStatus },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );

  //           if (response.data.success) {
  //             toast.success(response.data.message);
  //             fetchEmployerList();
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

  //   // 👉 Action
  //   {
  //     accessorKey: "action",
  //     header: "Action",
  //     cell: ({ row }) => {
  //       const companyId = row.original._id;
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
  //                 `${API_BASE_URL}delete/company`,
  //                 { companyId },
  //                 {
  //                   headers: {
  //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                   },
  //                 },
  //               );
  //               if (response.data.success) {
  //                 toast.success("Company Deleted Successfully!");
  //                 fetchEmployerList();
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
  //             to="/admin/complete-company-details"
  //             state={{
  //               companyProfileId: row.original?.companyId?._id,
  //               companyDetails: row.original,
  //             }}
  //           >
  //             <i className="fa-solid fa-eye"></i>
  //           </Link>
  //           {/* <Link
  //             to="/admin/recruiter-list"
  //             state={{
  //               companyDataId: row.original?.companyId?._id,
  //             }}
  //           >
  //             <i
  //               className="fas fa-users-cog"
  //               style={{ cursor: "pointer", marginLeft: "10px" }}
  //             ></i>
  //           </Link>
  //           <Link
  //             to="/admin/company-active-job"
  //             state={{
  //               companyActiveId: row.original?.companyId?._id,
  //             }}
  //           >
  //             <i
  //               className="fas fa-upload"
  //               style={{ cursor: "pointer", marginLeft: "10px" }}
  //             ></i>
  //           </Link> */}
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

  // ------------------------------------------------------
  // COLUMNS FOR NEW COMPANIES (columns2)
  // ------------------------------------------------------
  // const columns2 = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (newPage - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "profileImage",
  //     header: "Img",
  //     cell: ({ row }) => (
  //       <img
  //         crossorigin="anonymous"
  //         src={getImageUrl(row.original.companyId?.logo)}
  //         alt="candidate"
  //         width={45}
  //         height={45}
  //         style={{ borderRadius: "50%" }}
  //         onError={(e) => {
  //           e.currentTarget.src =
  //             "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Company Name",
  //     accessorFn: (row) => (row.companyId.brandName || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.companyId?.brandName || "Not Provided",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //     accessorFn: (row) => (row.email || "").toLowerCase(),
  //     cell: ({ row }) => row.original.email || "Not Provided",
  //   },
  //   {
  //     accessorKey: "industry",
  //     header: "Industry",
  //     accessorFn: (row) => (row.companyId.industry.name || "").toLowerCase(),
  //     cell: ({ row }) =>
  //       row.original?.companyId?.industry?.name || "Not Provided",
  //   },
  //   // 👉 Home Toggle
  //   // {
  //   //   accessorKey: "home",
  //   //   header: "Home",
  //   //   cell: () => (
  //   //     <div className="super-admin-toggle-switch">
  //   //       <label className="switch">
  //   //         <input type="checkbox" defaultChecked />
  //   //         <span className="slider round"></span>
  //   //       </label>
  //   //     </div>
  //   //   ),
  //   // },
  //   {
  //     accessorKey: "verified",
  //     header: "Verified",
  //     cell: ({ row }) => (
  //       <div className="super-admin-toggle-switch">
  //         <label className="switch">
  //           <input
  //             type="checkbox"
  //             checked={row.original?.verifiedByAdmin}
  //             onChange={(e) =>
  //               handleVerifyChange(row.original?._id, e.target.checked)
  //             }
  //           />
  //           <span className="slider round" />
  //         </label>
  //       </div>
  //     ),
  //   },
  //   // 👉 Action
  //   {
  //     accessorKey: "action",
  //     header: "Action",
  //     cell: ({ row }) => (
  //       <div className="super-admin-action-icons">
  //         <Link
  //           to="/admin/company-details"
  //           state={{
  //             companyProfileId: row.original?.companyId?._id,
  //           }}
  //         >
  //           <i class="fa-solid fa-eye"></i>
  //         </Link>

  //         <i
  //           className="fa-solid fa-trash"
  //           title="Delete"
  //           style={{ cursor: "pointer", marginLeft: "10px" }}
  //           onClick={() => {
  //             Swal.fire({
  //               title: "Are you sure?",
  //               text: "You won't be able to revert this!",
  //               icon: "warning",
  //               showCancelButton: true,
  //               confirmButtonColor: "#3085d6",
  //               cancelButtonColor: "#d33",
  //               confirmButtonText: "Yes, delete it!",
  //             }).then(async (result) => {
  //               if (result.isConfirmed) {
  //                 try {
  //                   const response = await axios.post(
  //                     `${API_BASE_URL}delete/company`,
  //                     { companyId: row.original._id },
  //                     {
  //                       headers: {
  //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                       },
  //                     },
  //                   );
  //                   if (response.data.success) {
  //                     toast.success("Company Deleted Successfully!");
  //                     fetchNewEmployerList();
  //                   }
  //                 } catch (err) {
  //                   toast.error("Something went wrong!");
  //                 }
  //               }
  //             });
  //           }}
  //         ></i>
  //       </div>
  //     ),
  //   },
  // ];

  // ------------------------------------------------------
  // EXPORT ALL COMPANIES (DYNAMIC PAGINATION + DATE FILTERS)
  // ------------------------------------------------------
  const exportAllCompanies = async (type = "all") => {
    try {
      const baseParams =
        type === "new"
          ? {
              status: "new",
              limit,
              ...(debouncedNewSearch ? { search: debouncedNewSearch } : {}),
              ...(newStartDate ? { startDate: newStartDate } : {}),
              ...(newEndDate ? { endDate: newEndDate } : {}),
            }
          : {
              limit,
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              ...(startDate ? { startDate } : {}),
              ...(endDate ? { endDate } : {}),
            };

      // 1️⃣ First call → get totalPages
      const firstCall = await axios.get(`${API_BASE_URL}admin/companies`, {
        params: { ...baseParams, page: 1 },
      });

      const totalPagesData = firstCall.data.totalPages || 1;
      let allData = [...(firstCall.data.data || [])];

      // 2️⃣ Loop all pages dynamically
      for (let p = 2; p <= totalPagesData; p++) {
        const response = await axios.get(`${API_BASE_URL}admin/companies`, {
          params: { ...baseParams, page: p },
        });

        allData = [...allData, ...(response.data.data || [])];
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
        Registered_At: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        type === "new" ? "New Companies" : "All Companies",
      );

      const dateSuffix = type === "new"
        ? `${newStartDate || "all"}_to_${newEndDate || "now"}`
        : `${startDate || "all"}_to_${endDate || "now"}`;

      XLSX.writeFile(
        workbook,
        type === "new" ? `new_companies_${dateSuffix}.xlsx` : `all_companies_${dateSuffix}.xlsx`,
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
        <h4>Company Management</h4>
      </div>

      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Companies
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
              New Registrations
            </a>
          </li>
        </ul>

        <div className="tab-content">
          {/* TAB 1 - ALL COMPANIES */}
          <div id="All-Companies" className="tab-pane fade show active">
            <div className="Recruiter-analytics-table2">
              {/* All Companies Date-Range Filter Toolbar */}
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
                    onClick={handleClearAllFilters}
                    title="Reset date filters"
                  >
                    <i className="fa-solid fa-arrow-rotate-left"></i> Reset Filters
                  </button>
                )}

                <div className="admin-filter-actions">
                  <button
                    className="data-export-btn"
                    onClick={() => exportAllCompanies("all")}
                  >
                    <i className="fa-solid fa-file-excel me-1"></i> Export Data
                  </button>
                </div>
              </div>

              {loadingAll && (
                <div className="d-flex justify-content-center py-2">
                  <div className="spinner-border spinner-border-sm text-primary"></div>
                </div>
              )}

              <TableView
                columns={columns1}
                data={employer}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={(val) => {
                  setLimit(val);
                  setPage(1);
                }}
                totalPages={totalPages}
                globalFilter={search}
                setGlobalFilter={(val) => {
                  setSearch(val || "");
                }}
              />
            </div>
          </div>

          {/* TAB 2 - NEW COMPANIES */}
          <div id="New-Companies" className="tab-pane fade">
            {/* New Companies Date-Range Filter Toolbar */}
            <div className="admin-filter-toolbar">
              <div className="admin-filter-item">
                <label>Start Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                />
              </div>

              <div className="admin-filter-item">
                <label>End Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                />
              </div>

              {(newStartDate || newEndDate || newSearch) && (
                <button
                  className="btn-filter-clear"
                  onClick={handleClearNewFilters}
                  title="Reset all filters"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i> Reset Filters
                </button>
              )}

              <div className="admin-filter-actions">
                <button
                  className="data-export-btn"
                  onClick={() => exportAllCompanies("new")}
                >
                  <i className="fa-solid fa-file-excel me-1"></i> Export Data
                </button>
              </div>
            </div>

            {loadingNew && (
              <div className="d-flex justify-content-center py-2">
                <div className="spinner-border spinner-border-sm text-primary"></div>
              </div>
            )}

            <TableView
              columns={columns2}
              data={newEmployer}
              page={newPage}
              setPage={setNewPage}
              limit={limit}
              setLimit={(val) => {
                setLimit(val);
                setNewPage(1);
              }}
              totalPages={newTotalPages}
              globalFilter={newSearch}
              setGlobalFilter={(val) => {
                setNewSearch(val || "");
              }}
            />
          </div>
        </div>
      </div>

      <AdminChangePasswordModal
        isOpen={Boolean(passwordModalUser)}
        user={passwordModalUser}
        onClose={() => setPasswordModalUser(null)}
      />
    </section>
  );
}

export default ManageUsers;

