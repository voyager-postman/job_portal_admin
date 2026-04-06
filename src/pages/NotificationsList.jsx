import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url.js";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      setLoadingAll(true);

      const res = await axios.get(
        `${API_BASE_URL}getAllNotificationTemplates`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setNotifications(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit]);

  // ✅ Export Excel
  const exportNotifications = () => {
    if (!notifications.length) {
      toast.warn("No Data Found!");
      return;
    }

    const exportData = notifications.map((item, index) => ({
      S_No: index + 1,
      Title: item.title || "",
      Description: item.description || "",
      Category: item.category || "",
      Type: item.type || "",
      Author: item.author || "",
      Date: item.createdAt || "",
      Status: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Notifications");

    XLSX.writeFile(workbook, "notifications.xlsx");

    toast.success("Export Successful");
  };

  // ✅ Delete
  const deleteNotification = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `${API_BASE_URL}deleteNotification/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          if (res.data.success) {
            toast.success(res.data.message);
            fetchNotifications();
          }
        } catch (error) {
          toast.error("Delete failed");
        }
      }
    });
  };

  // ✅ Table Columns
  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => row.index + 1,
  //   },

  //   {
  //     accessorKey: "title",
  //     header: "Title",
  //     accessorFn: (row) => (row.title || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.title || "Not Provided",
  //   },

  //   {
  //     accessorKey: "description",
  //     header: "Description",
  //     accessorFn: (row) => (row.description || "").toLowerCase(),
  //     cell: ({ row }) => {
  //       const text = row.original?.description || "";
  //       return text.length > 60 ? text.slice(0, 60) + "..." : text;
  //     },
  //   },

  //   {
  //     accessorKey: "category",
  //     header: "Category",
  //     accessorFn: (row) => (row.category || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.category || "Not Provided",
  //   },

  //   {
  //     accessorKey: "date",
  //     header: "Date",
  //     cell: ({ row }) => new Date(row.original?.createdAt).toLocaleDateString(),
  //   },

  //   {
  //     accessorKey: "action",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       const id = row.original._id;

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
  //               await axios.delete(`${API_BASE_URL}deleteNotification/${id}`);

  //               toast.success("Notification deleted");
  //               fetchNotifications();
  //             } catch (error) {
  //               toast.error("Delete failed");
  //             }
  //           }
  //         });
  //       };

  //       return (
  //         <div className="super-admin-action-icons">
  //           <Link to={`/admin/create-notification/${id}`}>
  //             <i className="fa-solid fa-pen"></i>
  //           </Link>

  //           {/* <i
  //             className="fa-solid fa-trash"
  //             style={{ cursor: "pointer", marginLeft: "10px" }}
  //             onClick={handleDelete}
  //           ></i> */}
  //         </div>
  //       );
  //     },
  //   },
  // ];
  const columns = [
    {
      Header: "S.No",
      id: "serial",
      Cell: ({ row }) => row.index + 1,
    },

    {
      Header: "Title",
      accessor: "title",
      Cell: ({ row }) => row.original?.title || "Not Provided",
    },

    {
      Header: "Description",
      accessor: "description",
      Cell: ({ row }) => {
        const text = row.original?.description || "";
        return text.length > 60 ? text.slice(0, 60) + "..." : text;
      },
    },

    {
      Header: "Category",
      accessor: "category",
      Cell: ({ row }) => row.original?.category || "Not Provided",
    },

    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ row }) =>
        row.original?.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "Not Provided",
    },

    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => {
        const id = row.original._id;

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
                await axios.delete(`${API_BASE_URL}deleteNotification/${id}`);

                toast.success("Notification deleted");
                fetchNotifications();
              } catch (error) {
                toast.error("Delete failed");
              }
            }
          });
        };

        return (
          <div className="super-admin-action-icons">
            <Link to={`/admin/create-notification/${id}`}>
              <i className="fa-solid fa-pen"></i>
            </Link>

            {/* delete button if needed */}
            {/* 
          <i
            className="fa-solid fa-trash"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={handleDelete}
          ></i> 
          */}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Notification Template </h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Notification
          </h5>
          {/* <Link
            to="/admin/create-notification"
            className="super-dashboard-common-add-btn"
          >
            Add Notifications
          </Link> */}
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="common-fillter-select-area">
            {/* <div className="fillter-data-box-info">
              <div className="fillter-data-box">
                <div className="form-group">
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
                </div>
              </div>
            </div> */}
            {/* <div className="data-export-btn-info">
              <a href="#" className="data-export-btn">
                Export Data
              </a>
            </div> */}
          </div>
          <div className="table-responsive">
            {loadingAll ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={notifications}
                  limit={limit}
                  setLimit={(val) => {
                    setLimit(val);
                    setPage(1);
                  }}
                />

                {/* Pagination */}
           
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default NotificationsList;
