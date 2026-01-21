import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

import { TableView } from "../components/DataTable";
import { Link } from "react-router-dom";
const PlanSubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const getImageUrl = (url) => {
    if (!url || url === "undefined") {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };
  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { header: "S.No", cell: ({ row }) => row.index + 1 },
    {
      header: "Img",
      cell: ({ row }) => (
        <img
          crossorigin="anonymous"
          src={getImageUrl(row.original.image)}
          alt={row.original.recruiterName}
          className="img-thumbnail"
          style={{ width: "40px", height: "40px" }}
        />
      ),
    },
    { accessorKey: "recruiterName", header: "Recruiter Name" },
    { accessorKey: "email", header: "Email ID" },
    {
      header: "Contact Number",
      cell: ({ row }) =>
        `${row.original.phone?.countryCode || ""} ${
          row.original.phone?.number || ""
        }`,
    },
    { accessorKey: "planName", header: "Plan Name" },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) =>
        new Date(row.original.purchaseDate).toLocaleDateString(),
    },
    {
      header: "Price",
      cell: ({ row }) => `${row.original.currency} ${row.original.price}`,
    },
    { accessorKey: "validity", header: "Validity" },
    {
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={row.original.status}
              onChange={() =>
                toggleStatus(row.original._id, row.original.status)
              }
            />
            <span className="slider round" />
          </label>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="super-admin-action-icons">
          <Link
            to="/admin/plan-subscriber-details"
            state={{ subscriberData: row.original }}
          >
            <i className="fa-solid fa-eye" />
          </Link>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deleteSubscriber(row.original._id);
            }}
          >
            <i className="fa-solid fa-trash" />
          </a>
        </div>
      ),
    },
  ];

  /* ================= FETCH SUBSCRIBERS ================= */
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/getPlanSubscribers?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSubscribers(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load plan subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [page, limit]);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/toggleSubscriberStatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(
        `Subscriber ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      fetchSubscribers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscriber status");
    }
  };

  /* ================= DELETE ================= */
  const deleteSubscriber = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This subscriber will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${API_BASE_URL}/deleteSubscriber/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          toast.success("Subscriber deleted successfully");
          fetchSubscribers();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete subscriber");
        }
      }
    });
  };
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Plan Subscriber List</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-dashboard.html">
              <i className="fa-solid fa-angles-left" />
            </a>
            Plan Subscriber Management
          </h5>
          {/* <a href="super-admin-price-plan-form.html" class="super-dashboard-common-add-btn">Add Price Plan</a> */}
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
                    <option value="general">Initial Base Plan</option>
                    <option value="billing">Standard Plus</option>
                    <option value="billing">Elite Premium</option>
                    <option value="billing">Enterprise Pro</option>
                    <option value="billing">Startup Basic</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="data-export-btn-info">
              <a href="#" className="data-export-btn">
                Export Data
              </a>
            </div>
          </div>
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={subscribers}
                  limit={limit}
                  setLimit={(value) => {
                    setLimit(value);
                    setPage(1);
                  }}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  loading={loading}
                />

                {/* PAGINATION */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${
                        page === index + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
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
    </>
  );
};

export default PlanSubscriberList;
