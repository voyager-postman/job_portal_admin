import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Tooltip } from "antd";

function PackCreationList() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalPaymentEnabled, setGlobalPaymentEnabled] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  // const columns = [
  //   {
  //     header: "S.No",
  //     id: "index",
  //     accessor: (_row, i) => <>{i + 1}</>,
  //   },
  //   {
  //     accessor: "packName",
  //      Header: "Pack Name",
  //   },
  //   {
  //      Header: "Type",
  //      accessor: ({ row }) => {
  //       const isCustom = row.original.isCustom;

  //       if (isCustom) {
  //         return (
  //           <span className="badge bg-dark">PRO / Custom (Enterprise)</span>
  //         );
  //       }

  //       return <span className="badge bg-primary">Standard / Premium</span>;
  //     },
  //   },
  //   {
  //      Header: "Price",
  //      accessor: ({ row }) => `${row.original.currency} ${row.original.amount}`,
  //   },
  //   {
  //      Header: "Credits",
  //      accessor: ({ row }) => {
  //       const jobCredits = row.original.jobPostingCredits ?? 0;
  //       const profileCredits = row.original.profileViewingCredits ?? 0;

  //       return (
  //         <Tooltip
  //           title={`Job Posting Credits: ${jobCredits} | CV Viewing Credits: ${profileCredits}`}
  //         >
  //           <span style={{ cursor: "pointer" }}>
  //             {jobCredits}p / {profileCredits}v
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },
  //   {
  //      Header: "Daily Limits",
  //      accessor: ({ row }) => {
  //       const jobLimit = row.original?.dailyJobPostingLimit ?? 0;
  //       const profileLimit = row.original?.dailyProfileViewingLimit ?? 0;

  //       return (
  //         <Tooltip
  //           title={`Daily Job Posting Limit: ${jobLimit} | Daily CV Viewing Limit: ${profileLimit}`}
  //           placement="top"
  //           arrow
  //         >
  //           <span style={{ cursor: "pointer", fontWeight: 500 }}>
  //             {jobLimit}p / {profileLimit}v
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },

  //   {
  //      Header: "Validity",
  //     cell: ({ row }) =>
  //       `${row.original.validityValue}${row.original.validityUnit.charAt(0).toLowerCase()}`,
  //   },
  //   {
  //      Header: "Online Pay",
  //      accessor: ({ row }) => (
  //       <span
  //         className={`badge ${
  //           row.original.isOnlinePaymentEnabled ? "bg-success" : "bg-secondary"
  //         }`}
  //       >
  //         {row.original.isOnlinePaymentEnabled ? "Yes" : "No"}
  //       </span>
  //     ),
  //   },

  //   {
  //      Header: "Status",
  //      accessor: ({ row }) => (
  //       <div className="super-admin-toggle-switch">
  //         <label className="switch">
  //           <input
  //             type="checkbox"
  //             checked={row.original.isActive}
  //             onChange={() =>
  //               toggleStatus(row.original._id, row.original.isActive)
  //             }
  //           />
  //           <span className="slider round"></span>
  //         </label>
  //       </div>
  //     ),
  //   },
  //   {
  //      Header: "Online Payment",
  //      accessor: ({ row }) => (
  //       <div className="form-check form-switch">
  //         <input
  //           type="checkbox"
  //           className="form-check-input"
  //           checked={row.original.isOnlinePaymentEnabled}
  //           disabled={!globalPaymentEnabled || row.original.isCustom}
  //           onChange={() =>
  //             togglePackSettings(row.original._id, {
  //               isOnlinePaymentEnabled: !row.original.isOnlinePaymentEnabled,
  //               autoApproval: row.original.autoApproval,
  //             })
  //           }
  //         />
  //       </div>
  //     ),
  //   },
  //   {
  //      Header: "Auto Approval",
  //      accessor: ({ row }) => (
  //       <div className="form-check form-switch">
  //         <input
  //           type="checkbox"
  //           className="form-check-input"
  //           checked={row.original.autoApproval}
  //           disabled={
  //             !row.original.isOnlinePaymentEnabled || row.original.isCustom
  //           }
  //           onChange={() =>
  //             togglePackSettings(row.original._id, {
  //               isOnlinePaymentEnabled: row.original.isOnlinePaymentEnabled,
  //               autoApproval: !row.original.autoApproval,
  //             })
  //           }
  //         />
  //       </div>
  //     ),
  //   },

  //   {
  //      Header: "Actions",
  //      accessor: ({ row }) => (
  //       <div className="super-admin-action-icons">
  //         <Link
  //           to="/admin/super-admin-pack-creations-form"
  //           state={{ packData: row.original }}
  //         >
  //           <i className="fa-solid fa-pen" />
  //         </Link>
  //         <a
  //           href="#"
  //           onClick={(e) => {
  //             e.preventDefault();
  //             deletePack(row.original._id);
  //           }}
  //         >
  //           <i className="fa-solid fa-trash" />
  //         </a>
  //       </div>
  //     ),
  //   },
  // ];
  const columns = [
    {
      Header: "S.No",
      id: "index",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Pack Name",
      accessor: "packName",
    },
    {
      Header: "Type",
      Cell: ({ row }) => {
        const isCustom = row.original.isCustom;

        if (isCustom) {
          return (
            <span className="badge bg-dark">PRO / Custom (Enterprise)</span>
          );
        }

        return <span className="badge bg-primary">Standard / Premium</span>;
      },
    },
    {
      Header: "Price",
      Cell: ({ row }) => `${row.original.currency} ${row.original.amount}`,
    },
    {
      Header: "Credits",
      Cell: ({ row }) => {
        const jobCredits = row.original.jobPostingCredits ?? 0;
        const profileCredits = row.original.profileViewingCredits ?? 0;

        return (
          <Tooltip
            title={`Job Posting Credits: ${jobCredits} | CV Viewing Credits: ${profileCredits}`}
          >
            <span style={{ cursor: "pointer" }}>
              {jobCredits}p / {profileCredits}v
            </span>
          </Tooltip>
        );
      },
    },
    {
      Header: "Daily Limits",
      Cell: ({ row }) => {
        const jobLimit = row.original?.dailyJobPostingLimit ?? 0;
        const profileLimit = row.original?.dailyProfileViewingLimit ?? 0;

        return (
          <Tooltip
            title={`Daily Job Posting Limit: ${jobLimit} | Daily CV Viewing Limit: ${profileLimit}`}
            placement="top"
          >
            <span style={{ cursor: "pointer", fontWeight: 500 }}>
              {jobLimit}p / {profileLimit}v
            </span>
          </Tooltip>
        );
      },
    },
    {
      Header: "Validity",
      Cell: ({ row }) =>
        `${row.original.validityValue}${row.original.validityUnit
          ?.charAt(0)
          ?.toLowerCase()}`,
    },
    {
      Header: "Online Pay",
      Cell: ({ row }) => (
        <span
          className={`badge ${
            row.original.isOnlinePaymentEnabled ? "bg-success" : "bg-secondary"
          }`}
        >
          {row.original.isOnlinePaymentEnabled ? "Yes" : "No"}
        </span>
      ),
    },
    {
      Header: "Status",
      Cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.isActive}
              onChange={() =>
                toggleStatus(row.original._id, row.original.isActive)
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      Header: "Online Payment",
      Cell: ({ row }) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={row.original.isOnlinePaymentEnabled}
            disabled={!globalPaymentEnabled || row.original.isCustom}
            onChange={() =>
              togglePackSettings(row.original._id, {
                isOnlinePaymentEnabled: !row.original.isOnlinePaymentEnabled,
                autoApproval: row.original.autoApproval,
              })
            }
          />
        </div>
      ),
    },
    {
      Header: "Auto Approval",
      Cell: ({ row }) => (
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={row.original.autoApproval}
            disabled={
              !row.original.isOnlinePaymentEnabled || row.original.isCustom
            }
            onChange={() =>
              togglePackSettings(row.original._id, {
                isOnlinePaymentEnabled: row.original.isOnlinePaymentEnabled,
                autoApproval: !row.original.autoApproval,
              })
            }
          />
        </div>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/super-admin-pack-creations-form"
            state={{ packData: row.original }}
          >
            <i className="fa-solid fa-pen" />
          </Link>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deletePack(row.original._id);
            }}
          >
            <i className="fa-solid fa-trash" />
          </a>
        </div>
      ),
    },
  ];
  const fetchPacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}packs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPacks(res.data.data || []);

      setGlobalPaymentEnabled(res.data.onlinePaymentsActive);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pack list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, [page, limit]);
  const toggleGlobalPayments = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}toggleGlobalPayments`,
        { status: !globalPaymentEnabled },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // ✅ Set state from backend response (recommended)
      setGlobalPaymentEnabled(res.data.onlinePaymentsActive);
      fetchPacks();
      // ✅ Show dynamic message from backend
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update global payment setting",
      );
    }
  };
  const toggleStatus = async (packId, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}pack/${packId}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Pack status updated");
      fetchPacks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // 🗑 DELETE PACK WITH SWEET ALERT
  const deletePack = (packId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This pack will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}pack/${packId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          toast.success("Pack deleted successfully");
          fetchPacks();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete pack");
        }
      }
    });
  };
  const togglePackSettings = async (packId, updatedValues) => {
    try {
      await axios.post(
        `${API_BASE_URL}togglePackSettings/${packId}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Pack settings updated");
      fetchPacks();
    } catch (error) {
      toast.error("Failed to update pack settings");
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Subscription Packages</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Packages
          </h5>

          <Link
            to="/admin/super-admin-pack-creations-form"
            className="default-btn btn btn-primary"
          >
            + Create Package
          </Link>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="common-fillter-select-area">
            <div className="fillter-data-box-info">
              <div className="fillter-data-box">
                {/* <div className="form-group">
                  <label>Short By</label>
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Select</option>
                    <option value="general">New</option>
                    <option value="billing">Old</option>
                    <option value="billing">Publish</option>
                    <option value="billing">Draft</option>
                    <option value="billing">Pending</option>
                  </select>
                </div> */}
              </div>
            </div>
            <div className="data-export-btn-info">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h6>Global Online Payments: </h6>
                <div className="form-check form-switch ms-1 ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={globalPaymentEnabled}
                    onChange={toggleGlobalPayments}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <TableView columns={columns} data={packs} />
                {/* PAGINATION BUTTONS */}
             
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default PackCreationList;
