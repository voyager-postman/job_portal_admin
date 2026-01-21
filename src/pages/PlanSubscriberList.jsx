<<<<<<< HEAD
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
=======
import React, { useState } from "react";

const PlanSubscriberList = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    image: null,
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
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
<<<<<<< HEAD
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
=======
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Img</th>
                  <th>Recruiter Name</th>
                  <th>Email ID</th>
                  <th>Contact Number</th>
                  <th>Plan Name</th>
                  <th>Purchase Date</th>
                  <th>Price</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <img
                      src="https://randomuser.me/api/portraits/women/3.jpg"
                      alt="Carol Andrews"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>John Smith</td>
                  <td>john.smith@example.com</td>
                  <td>+1 234 567 8901</td>
                  <td>Initial Base Plan</td>
                  <td>2025-10-01</td>
                  <td>$99</td>
                  <td>6 months</td>
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
                      <a href="super-admin-pack-details.html">
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
                      src="https://randomuser.me/api/portraits/men/4.jpg"
                      alt="David Brown"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Emma Johnson</td>
                  <td>emma.johnson@example.com</td>
                  <td>+1 234 567 8902</td>
                  <td>Standard Plus</td>
                  <td>2025-09-20</td>
                  <td>$149</td>
                  <td>6 months</td>
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
                      <a href="super-admin-pack-details.html">
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
                      src="https://randomuser.me/api/portraits/men/6.jpg"
                      alt="Frank Miller"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Michael Brown</td>
                  <td>michael.brown@example.com</td>
                  <td>+1 234 567 8903</td>
                  <td>Elite Premium</td>
                  <td>2025-08-12</td>
                  <td>$199</td>
                  <td>12 months</td>
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
                      <a href="super-admin-pack-details.html">
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
                      src="https://randomuser.me/api/portraits/men/8.jpg"
                      alt="Henry Wilson"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Sophia Williams</td>
                  <td>sophia.williams@example.com</td>
                  <td>+1 234 567 8904</td>
                  <td>Enterprise Pro</td>
                  <td>2025-07-15</td>
                  <td>$299</td>
                  <td>12 months</td>
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
                      <a href="super-admin-pack-details.html">
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
                      src="https://randomuser.me/api/portraits/women/9.jpg"
                      alt="Ivy Hall"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Olivia Davis</td>
                  <td>olivia.davis@example.com</td>
                  <td>+1 234 567 8905</td>
                  <td>Startup Basic</td>
                  <td>2025-09-01</td>
                  <td>$49</td>
                  <td>3 months</td>
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
                      <a href="super-admin-pack-details.html">
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
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          </div>
        </div>
      </section>
    </>
  );
};

export default PlanSubscriberList;
