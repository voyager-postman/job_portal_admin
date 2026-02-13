import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

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
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "bannerImage",
      header: "Image",
      cell: ({ row }) => (
        <img
          // crossOrigin="anonymous"
          src={getImageUrl(row.original.bannerImage)}
          alt="candidate"
          width={40}
          height={40}
          style={{ borderRadius: "6px" }}
          onError={(e) => {
            e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      accessorFn: (row) => (row.title || "").toLowerCase(),
      cell: ({ row }) => {
        const text = row.original?.title || "Not Provided";
        return text.length > 20 ? text.slice(0, 20) + "..." : text;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      accessorFn: (row) => (row.content || "").toLowerCase(),
      cell: ({ row }) => {
        const text = row.original?.content || "Not Provided";
        return text.length > 60 ? text.slice(0, 60) + "..." : text;
      },
    },
    {
      accessorKey: "author",
      header: "Author",
      accessorFn: (row) => (row.authorName || "").toLowerCase(),
      cell: ({ row }) => row.original?.authorName || "Not Provided",
    },
    {
      accessorKey: "date",
      header: "Date",
      accessorFn: (row) => (row.publishDate || "").toLowerCase(),
      cell: ({ row }) =>
        new Date(row.original?.publishDate).toLocaleDateString() ||
        "Not Provided",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const id = row.original._id;
        const currentStatus = row.original.isActive;

        const handleStatusChange = async (e) => {
          const newStatus = e.target.checked ? true : false;

          try {
            const response = await axios.post(
              `${API_BASE_URL}toggleBlog/${id}`,
              { isActive: newStatus },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            if (response.data.success) {
              toast.success(response.data.message);
              fetchBlogList();
            } else {
              toast.error("Something went wrong!");
            }
          } catch (error) {
            toast.error(error.response.data.message);
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
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
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
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
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
        <h4>Blog List </h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Blog Management
        </h5>
      </div>
      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="common-fillter-select-area">
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
                  <option value>Select</option>
                  <option value="general">New</option>
                  <option value="billing">Old</option>
                  <option value="billing">Publish</option>
                  <option value="billing">Draft</option>
                  <option value="billing">Pending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mx-2">
              <Link
                to="/admin/add-blog"
                className="super-dashboard-common-add-btn"
              >
                Add Blog
              </Link>
            </div>
            <div>
              <a href="#" className="super-dashboard-common-add-btn">
                Export Data
              </a>
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
