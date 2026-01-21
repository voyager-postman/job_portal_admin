import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function PackCreationList() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const columns = [
    {
=======

function PackCreationList() {
  const columns = [
    {
      accessorKey: "id",
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
<<<<<<< HEAD
      accessorKey: "packName",
      header: "Pack Name",
    },
    {
      header: "Validity",
      cell: ({ row }) =>
        `${row.original.validityValue} ${row.original.validityUnit}`,
    },
    {
      header: "Created Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
=======
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt="Blog"
          width={40}
          height={40}
          style={{ borderRadius: "6px" }}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "link",
      header: "Link",
    },
    {
      accessorKey: "status",
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
<<<<<<< HEAD
            <input
              type="checkbox"
              checked={row.original.isActive}
              onChange={() =>
                toggleStatus(row.original._id, row.original.isActive)
              }
            />
=======
            <input type="checkbox" defaultChecked={row.original.status} />
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
<<<<<<< HEAD
      header: "Actions",
      cell: ({ row }) => (
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
=======
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="super-admin-action-icons">
          <Link to="/admin/blog-form">
            <i className="fa-solid fa-pen"></i>
          </Link>
          <a href="#">
            <i className="fa-solid fa-trash"></i>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
          </a>
        </div>
      ),
    },
  ];
<<<<<<< HEAD
  const fetchPacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/packs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPacks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
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
  // ✅ Dummy Candidates Data
  // 🔁 TOGGLE ACTIVE / INACTIVE
  const toggleStatus = async (packId, currentStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/pack/${packId}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
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
          await axios.delete(`${API_BASE_URL}/pack/${packId}`, {
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

  return (
    <>
    
    <ToastContainer position="top-right" autoClose={3000} />
=======

  // ✅ Dummy Candidates Data
  const data = [
    {
      id: 1,
      image: "https://picsum.photos/80/60?random=1",
      title: "The Internet Is A Job",
      description: "Lorem  sit amet.",
      author: "Andrew ",
      date: "Feb 12, 2024",
      link: "blog-details.html",
      status: true,
    },
    {
      id: 2,
      image: "https://picsum.photos/80/60?random=2",
      title: "Tips For Productive",
      description: "Discover  effective.",
      author: "Sarah ",
      date: "Mar 8, 2024",
      link: "remote-work-tips.html",
      status: true,
    },
    {
      id: 3,
      image: "https://picsum.photos/80/60?random=3",
      title: "How AI Is Changing",
      description: "Artificial  tools.",
      author: "James ",
      date: "Apr 22, 2024",
      link: "ai-marketing.html",
      status: true,
    },
    {
      id: 4,
      image: "https://picsum.photos/80/60?random=4",
      title: "The Future Of Web",
      description: "Explore  trends.",
      author: "Emily ",
      date: "May 15, 2024",
      link: "web-development-future.html",
      status: true,
    },
    {
      id: 5,
      image: "https://picsum.photos/80/60?random=5",
      title: "Why Cybersecurity",
      description: "As digital  evolve.",
      author: "David ",
      date: "Jun 30, 2024",
      link: "cybersecurity-tips.html",
      status: true,
    },
    {
      id: 6,
      image: "https://picsum.photos/80/60?random=6",
      title: "Mastering UI/UX",
      description: "Learn how  user-friendly.",
      author: "Olivia ",
      date: "Jul 14, 2024",
      link: "ui-ux-design.html",
      status: true,
    },
    {
      id: 7,
      image: "https://picsum.photos/80/60?random=7",
      title: "The Rise Of Blockchain",
      description: "Blockchain  is reshaping.",
      author: "Michael ",
      date: "Aug 25, 2024",
      link: "blockchain-business.html",
      status: true,
    },
    {
      id: 8,
      image: "https://picsum.photos/80/60?random=8",
      title: "Effective SEO",
      description: "Optimize  for better.",
      author: "Rachel ",
      date: "Sep 10, 2024",
      link: "seo-strategies.html",
      status: true,
    },
    {
      id: 9,
      image: "https://picsum.photos/80/60?random=9",
      title: "The Power Of Social",
      description: "Build  brand identity.",
      author: "Laura ",
      date: "Oct 5, 2024",
      link: "social-media-branding.html",
      status: true,
    },
    {
      id: 10,
      image: "https://picsum.photos/80/60?random=10",
      title: "How To Build A Career",
      description: "Get practical  starting.",
      author: "Chris ",
      date: "Nov 2, 2024",
      link: "career-in-tech.html",
      status: true,
    },
  ];

  return (
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Pack List </h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
<<<<<<< HEAD
          <Link to="/admin">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Pack Management
        </h5>

=======
          <a href="super-admin-dashboard.html">
            <i className="fa-solid fa-angles-left" />
          </a>
          Pack Management
        </h5>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
        <Link
          to="/admin/super-admin-pack-creations-form"
          className="super-dashboard-common-add-btn"
        >
          Add Pack
        </Link>
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
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <TableView
                columns={columns}
                data={packs}
                limit={limit}
                setLimit={(value) => {
                  setLimit(value);
                  setPage(1);
                }}
              />
              {/* PAGINATION BUTTONS */}
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
                      page === index + 1 ? "btn-primary" : "btn-outline-primary"
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
=======
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Pack Name</th>
                <th>Validity</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Premium Recruitment Pack</td>
                <td>3 Months</td>
                <td>Feb 12, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>

                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              {/* Start of auto-generated rows */}
              <tr>
                <td>2</td>
                <td>Basic Hiring Plan</td>
                <td>1 Month</td>
                <td>Mar 10, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Enterprise Hiring Bundle</td>
                <td>6 Months</td>
                <td>Apr 5, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Startup Growth Pack</td>
                <td>3 Months</td>
                <td>May 15, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Seasonal Recruitment Offer</td>
                <td>2 Months</td>
                <td>Jun 30, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Elite Partner Package</td>
                <td>4 Months</td>
                <td>Jul 12, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>Internship Hiring Pack</td>
                <td>2 Months</td>
                <td>Aug 8, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>Remote Hiring Special</td>
                <td>3 Months</td>
                <td>Sep 10, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>Global Recruitment Pack</td>
                <td>12 Months</td>
                <td>Oct 20, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>Silver Recruiter Pack</td>
                <td>2 Months</td>
                <td>Nov 5, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>11</td>
                <td>Platinum Recruiter Pack</td>
                <td>6 Months</td>
                <td>Dec 1, 2024</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>12</td>
                <td>Job Fair Exclusive</td>
                <td>1 Month</td>
                <td>Jan 10, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>13</td>
                <td>Recruiter Plus</td>
                <td>3 Months</td>
                <td>Feb 12, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>14</td>
                <td>Ultimate Hiring Suite</td>
                <td>12 Months</td>
                <td>Mar 8, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>15</td>
                <td>Digital Recruitment Kit</td>
                <td>4 Months</td>
                <td>Apr 17, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>16</td>
                <td>Freelancer Hiring Pack</td>
                <td>1 Month</td>
                <td>May 10, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>17</td>
                <td>Global Partner Plan</td>
                <td>8 Months</td>
                <td>Jun 25, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>18</td>
                <td>Standard Job Posting</td>
                <td>2 Months</td>
                <td>Jul 20, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>19</td>
                <td>Campus Hiring Special</td>
                <td>3 Months</td>
                <td>Aug 30, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <Link to="/admin/super-admin-pack-details">
                      {" "}
                      <i className="fa-solid fa-eye" />
                    </Link>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>20</td>
                <td>Seasonal Boost Pack</td>
                <td>3 Months</td>
                <td>Sep 15, 2025</td>
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
                    <a href="super-admin-pack-creations-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
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
        </div>
      </div>
    </section>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
  );
}

export default PackCreationList;
