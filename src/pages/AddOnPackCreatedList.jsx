import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "antd";

function AddOnPackCreatedList() {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= TABLE COLUMNS ================= */
  // const columns = [
  //   {
  //     header: "S.No",
  //     cell: ({ row }) => row.index + 1,
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "Add On Pack Name",
  //   },
  //   {
  //     header: "Type",
  //     cell: ({ row }) => {
  //       const type = row.original.type;

  //       let badgeClass = "bg-secondary";
  //       let label = "Unknown";

  //       if (type === "BOTH") {
  //         badgeClass = "bg-primary";
  //         label = "Job + Profile Credits";
  //       } else if (type === "JOB") {
  //         badgeClass = "bg-warning text-dark";
  //         label = "Job Posting Credits";
  //       } else if (type === "CV") {
  //         badgeClass = "bg-success";
  //         label = "Profile Viewing Credits";
  //       }

  //       return <span className={`badge ${badgeClass}`}>{label}</span>;
  //     },
  //   },
  //   {
  //     header: "Credits",
  //     cell: ({ row }) => {
  //       const jobCredits = row.original?.jobPostingCredits ?? 0;
  //       const profileCredits = row.original?.profileViewingCredits ?? 0;

  //       return (
  //         <Tooltip
  //           title={`Job Posting Credits: ${jobCredits} | CV Viewing Credits: ${profileCredits}`}
  //           placement="top"
  //           arrow
  //         >
  //           <span style={{ cursor: "pointer", fontWeight: 500 }}>
  //             {jobCredits}p / {profileCredits}v
  //           </span>
  //         </Tooltip>
  //       );
  //     },
  //   },
  //   {
  //     header: "Created Date",
  //     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  //   },
  //   {
  //     header: "Online Pay",
  //     cell: ({ row }) => {
  //       const paymentMode = row.original?.paymentMode;

  //       return (
  //         <span
  //           className={`badge ${
  //             paymentMode === "Online" ? "bg-success" : "bg-secondary"
  //           }`}
  //         >
  //           {paymentMode === "Online" ? "Yes" : "No"}
  //         </span>
  //       );
  //     },
  //   },

  //   {
  //     header: "Status",
  //     cell: ({ row }) => (
  //       <div className="super-admin-toggle-switch">
  //         <label className="switch">
  //           <input
  //             type="checkbox"
  //             checked={row.original.isActive}
  //             onChange={() =>
  //               toggleStatus(row.original._id, row.original.isActive)
  //             }
  //           />
  //           <span className="slider round" />
  //         </label>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: "Actions",
  //     cell: ({ row }) => (
  //       <div className="super-admin-action-icons">
  //         <Link
  //           to="/admin/super-admin-add-on-pack-create-form"
  //           state={{ addOnData: row.original }}
  //         >
  //           <i className="fa-solid fa-pen" />
  //         </Link>

  //         {/* <Link
  //           to="/admin/super-admin-add-on-pack-details"
  //           state={{ addOnData: row.original }}
  //         >
  //           <i className="fa-solid fa-eye" />
  //         </Link> */}

  //         <a
  //           href="#"
  //           onClick={(e) => {
  //             e.preventDefault();
  //             deleteAddOn(row.original._id);
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
      Header: "Add On Pack Name",
      accessor: "name",
    },
    {
      Header: "Type",
      Cell: ({ row }) => {
        const type = row.original.type;

        let badgeClass = "bg-secondary";
        let label = "Unknown";

        if (type === "BOTH") {
          badgeClass = "bg-primary";
          label = "Job + Profile Credits";
        } else if (type === "JOB") {
          badgeClass = "bg-warning text-dark";
          label = "Job Posting Credits";
        } else if (type === "CV") {
          badgeClass = "bg-success";
          label = "Profile Viewing Credits";
        }

        return <span className={`badge ${badgeClass}`}>{label}</span>;
      },
    },
    {
      Header: "Credits",
      Cell: ({ row }) => {
        const jobCredits = row.original?.jobPostingCredits ?? 0;
        const profileCredits = row.original?.profileViewingCredits ?? 0;

        return (
          <Tooltip
            title={`Job Posting Credits: ${jobCredits} | CV Viewing Credits: ${profileCredits}`}
          >
            <span style={{ cursor: "pointer", fontWeight: 500 }}>
              {jobCredits}p / {profileCredits}v
            </span>
          </Tooltip>
        );
      },
    },
    {
      Header: "Created Date",
      Cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      Header: "Online Pay",
      Cell: ({ row }) => {
        const paymentMode = row.original?.paymentMode;

        return (
          <span
            className={`badge ${
              paymentMode === "Online" ? "bg-success" : "bg-secondary"
            }`}
          >
            {paymentMode === "Online" ? "Yes" : "No"}
          </span>
        );
      },
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
            <span className="slider round" />
          </label>
        </div>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/super-admin-add-on-pack-create-form"
            state={{ addOnData: row.original }}
          >
            <i className="fa-solid fa-pen" />
          </Link>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deleteAddOn(row.original._id);
            }}
          >
            <i className="fa-solid fa-trash" />
          </a>
        </div>
      ),
    },
  ];
  /* ================= FETCH ADD-ONS ================= */
  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/getAllAddOns`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAddOns(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load add-on packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddOns();
  }, [page, limit]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/toggleAddOnStatus/${id}`,
        {}, // no body required unless backend expects one
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(
        `Add-on pack ${currentStatus ? "deactivated" : "activated"}`,
      );
      fetchAddOns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update add-on status");
    }
  };

  /* ================= DELETE ================= */
  const deleteAddOn = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This add-on pack will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${API_BASE_URL}/deleteAddOn/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          toast.success("Add-on pack deleted successfully");
          fetchAddOns();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete add-on pack");
        }
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add-On Packages </h4>
        </div>
        <div className="super-dashboard-common-heading d-flex justify-content-between">
          <h5>
            <Link to="/admin/super-admin-pack-creations">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Add-On Package Management
          </h5>
          <Link
            to="/admin/super-admin-add-on-pack-create-form"
            className="default-btn btn btn-primary"
          >
            + Add Add-On Package
          </Link>
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                <TableView columns={columns} data={addOns} />

                {/* PAGINATION */}
               
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AddOnPackCreatedList;
