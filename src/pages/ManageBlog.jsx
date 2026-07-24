import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { ensureAuthRequestConfig } from "../utils/authToken";

function ManageBlog() {
  const [loadingAll, setLoadingAll] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [allBlog, setAllBlog] = useState([]);

  const fetchBlogList = async () => {
    try {
      setLoadingAll(true);
      const response = await axios.get(`${API_BASE_URL}allBlog`, {
        params: { page, limit },
      });

      setAllBlog(response.data?.data || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error While fetching Blog List:-", error);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchBlogList();
  }, [page, limit]);

  const exportAllBlog = async () => {
    try {
      const firstCall = await axios.get(
        `${API_BASE_URL}allBlog?page=1&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const totalPages = firstCall.data.totalPages;
      let allBlog = [...firstCall.data.data];

      //Fetch remaining pages dynamically
      for (let p = 2; p <= totalPages; p++) {
        const res = await axios.get(
          `${API_BASE_URL}allBlog?page=${p}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        allBlog = [...allBlog, ...res.data.data];
      }

      if (!allBlog.length) {
        toast.warn("No Data Found to export!");
        return;
      }

      //prepare Excel
      const exportData = allBlog.map((item, index) => ({
        S_No: index + 1,
        Title: item.title || "",
        Description: item.content || "",
        Author: item.authorName || "",
        Date: item.publishDate || "",
        Status: item.isActive || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Blog");
      XLSX.writeFile(workbook, "all_blog.xlsx");

      toast.success("All Blog exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export all blog data!");
    }
  };

  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) {
      return url;
    }
    return `${API_IMAGE_URL}${url}`;
  };

  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Default local dashboard image
    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    // ✅ Fix wrong stored URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  // const columns = [
  //   {
  //     accessorKey: "id",
  //     header: "S.No",
  //     cell: ({ row }) => (page - 1) * limit + row.index + 1,
  //   },
  //   {
  //     accessorKey: "bannerImage",
  //     header: "Image",
  //     cell: ({ row }) => (
  //       <img
  //         crossOrigin="anonymous"
  //         src={cleanImageUrl(row.original.bannerImage)}
  //         alt="candidate"
  //         width={50}
  //         height={50}
  //         style={{ borderRadius: "6px" }}
  //         onError={(e) => {
  //           e.currentTarget.src =
  //             "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     accessorKey: "title",
  //     header: "Title",
  //     accessorFn: (row) => (row.title || "").toLowerCase(),
  //     cell: ({ row }) => {
  //       const text = row.original?.title || "Not Provided";
  //       return text.length > 20 ? text.slice(0, 20) + "..." : text;
  //     },
  //   },
  //   {
  //     accessorKey: "description",
  //     header: "Description",
  //     accessorFn: (row) => (row.content || "").toLowerCase(),
  //     cell: ({ row }) => {
  //       const text = row.original?.content || "Not Provided";
  //       return text.length > 60 ? text.slice(0, 60) + "..." : text;
  //     },
  //   },
  //   {
  //     accessorKey: "author",
  //     header: "Author",
  //     accessorFn: (row) => (row.authorName || "").toLowerCase(),
  //     cell: ({ row }) => row.original?.authorName || "Not Provided",
  //   },
  //   {
  //     accessorKey: "date",
  //     header: "Date",
  //     accessorFn: (row) => (row.publishDate || "").toLowerCase(),
  //     cell: ({ row }) =>
  //       new Date(row.original?.publishDate).toLocaleDateString() ||
  //       "Not Provided",
  //   },
  //   {
  //     accessorKey: "isActive",
  //     header: "Status",
  //     cell: ({ row }) => {
  //       const id = row.original._id;
  //       const currentStatus = row.original.isActive;

  //       const handleStatusChange = async (e) => {
  //         const newStatus = e.target.checked ? true : false;

  //         try {
  //           const response = await axios.post(
  //             `${API_BASE_URL}toggleBlog/${id}`,
  //             { isActive: newStatus },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               },
  //             },
  //           );
  //           if (response.data.success) {
  //             toast.success(response.data.message);
  //             fetchBlogList();
  //           } else {
  //             toast.error("Something went wrong!");
  //           }
  //         } catch (error) {
  //           toast.error(error.response.data.message);
  //         }
  //       };
  //       return (
  //         <div className="super-admin-toggle-switch">
  //           <label className="switch">
  //             <input
  //               type="checkbox"
  //               checked={currentStatus === true}
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
  //               const response = await axios.delete(
  //                 `${API_BASE_URL}delete/${id}`,
  //                 {
  //                   headers: {
  //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //                   },
  //                 },
  //               );
  //               if (response.data.success) {
  //                 toast.success(response.data.message);
  //                 fetchBlogList();
  //               }
  //             } catch (error) {
  //               console.error(error.response.data.message);
  //             }
  //           }
  //         });
  //       };
  //       return (
  //         <div className="super-admin-action-icons">
  //           <Link to={`/admin/update-blog/${id}`}>
  //             <i className="fa-solid fa-pen"></i>
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
  const columns = [
     {
      Header: "S.No",
      id: "index",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Image",
      accessor: "bannerImage", // ✅ accessor added for search (if needed)
      Cell: ({ row }) => (
        <img
          crossOrigin="anonymous"
          src={cleanImageUrl(row.original.bannerImage)}
          alt="candidate"
          width={50}
          height={50}
          style={{ borderRadius: "6px" }}
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
      ),
    },
    {
      Header: "Title",
      accessor: (row) => row.title || "Not Provided", // ✅ global search works now
      Cell: ({ row }) => {
        const text = row.original?.title || "Not Provided";
        return text.length > 20 ? text.slice(0, 20) + "..." : text;
      },
    },
    {
      Header: "Description",
      accessor: (row) => row.content || "Not Provided", // ✅ global search works
      Cell: ({ row }) => {
        const text = row.original?.content || "Not Provided";
        return text.length > 60 ? text.slice(0, 60) + "..." : text;
      },
    },
    {
      Header: "Author",
      accessor: (row) => row.authorName || "Not Provided", // ✅ searchable
      Cell: ({ row }) => row.original?.authorName || "Not Provided",
    },
    {
      Header: "Date",
      accessor: (row) => row.publishDate || "Not Provided", // ✅ searchable
      Cell: ({ row }) =>
        row.original?.publishDate
          ? new Date(row.original.publishDate).toLocaleDateString()
          : "Not Provided",
    },
    {
      Header: "Status",
      id: "status", // computed, not searchable
      Cell: ({ row }) => {
        const id = row.original._id;
        const currentStatus = row.original.isActive;

        const handleStatusChange = async (e) => {
          const newStatus = e.target.checked;
          try {
            const response = await axios.post(
              `${API_BASE_URL}toggleBlog/${id}`,
              { isActive: newStatus },
              await ensureAuthRequestConfig(),
            );
            if (response.data.success) {
              toast.success(response.data.message);
              fetchBlogList();
            } else {
              toast.error("Something went wrong!");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={currentStatus === true}
                onChange={handleStatusChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },
    {
      Header: "Popular",
      id: "popular",
      Cell: ({ row }) => {
        const id = row.original._id;
        const isPopular = row.original.isPopular === true;

        const handlePopularChange = async (e) => {
          const newPopular = e.target.checked;
          try {
            const response = await axios.post(
              `${API_BASE_URL}setBlogPopular/${id}`,
              { isPopular: newPopular },
              await ensureAuthRequestConfig(),
            );
            if (response.data.success) {
              toast.success(response.data.message);
              fetchBlogList();
            } else {
              toast.error(response.data.message || "Something went wrong!");
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Failed to update popular status",
            );
          }
        };

        return (
          <div className="super-admin-toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={handlePopularChange}
              />
              <span className="slider round"></span>
            </label>
          </div>
        );
      },
    },
    {
      Header: "Action",
      id: "action", // computed, not searchable
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
                const response = await axios.delete(
                  `${API_BASE_URL}delete/${id}`,
                  await ensureAuthRequestConfig(),
                );
                if (response.data.success) {
                  toast.success(response.data.message);
                  fetchBlogList();
                }
              } catch (error) {
                console.error(error.response.data.message);
              }
            }
          });
        };
        return (
          <div className="super-admin-action-icons">
            <Link to={`/admin/update-blog/${id}`}>
              <i className="fa-solid fa-pen"></i>
            </Link>
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
  return (
    <section className="super-dashboard-content-wrapper">
      <ToastContainer />
      <div className="super-dashboard-breadcrumb-info">
        <h4>Blog Posts </h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage Blog Posts
        </h5>
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
          <div className="d-flex justify-content-between">
            <div className="mx-2">
              <Link
                to="/admin/add-blog"
                className="super-dashboard-common-add-btn"
              >
                Create New Post
              </Link>
            </div>
            <div>
              <Link
                to="#"
                className="super-dashboard-common-add-btn"
                onClick={exportAllBlog}
              >
                Export Blogs
              </Link>
            </div>
          </div>
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
                data={allBlog}
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
      </div>
    </section>
  );
}

export default ManageBlog;
