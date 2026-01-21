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

function ManageCandidates() {
  const [jobSeeker, setJobSeeker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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
      accessorKey: "sno",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "profileImage",
      header: "Img",
      cell: ({ row }) => (
        <img
          src={getImageUrl(row.original.profileImage)}
          width={45}
          height={45}
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
      accessorKey: "name",
      header: "Candidates Name",
      accessorFn: (row) =>
        `${row.first_name || ""} ${row.last_name || ""}`.toLowerCase(),
      cell: ({ row }) => (
        <>
          {row.original.first_name || "Not Provided"}{" "}
          {row.original.last_name || ""}
        </>
      ),
    },
    {
      accessorKey: "email",
      header: "Email ID",
      accessorFn: (row) => (row.email || "").toLowerCase(),
      cell: ({ row }) => row.original.email || "Not Provided",
    },
    {
      accessorKey: "phone",
      header: "Contact Number",
      accessorFn: (row) => (row.phone || "").toLowerCase(),
      cell: ({ row }) => row.original.phone || "Not Provided",
    },
    {
      accessorKey: "country",
      header: "Country",
      accessorFn: (row) => (row.Nationality || "").toLowerCase(),
      cell: ({ row }) => row.original.Nationality || "Not Provided",
    },
    {
      accessorKey: "home",
      header: "Home",
      cell: () => (
        <div className="super-admin-toggle-switch">
          {" "}
          <label className="switch">
            {" "}
            <input type="checkbox" defaultChecked />{" "}
            <span className="slider round"></span>{" "}
          </label>{" "}
        </div>
      ),
=======

function ManageCandidates() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // auto index
    },
    {
      accessorKey: "image",
      header: "Img",
      cell: ({ row }) => (
        <div className="candidateImg-info">
          <img
            src={row.original.image}
            alt="candidate"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
        </div>
      ),
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "job_title",
      header: "Job Title",
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => `${row.original.experience} Years`,
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    },
    {
      accessorKey: "status",
      header: "Status",
<<<<<<< HEAD
      cell: ({ row }) => {
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
              }
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
=======
      cell: () => (
        <div class="super-admin-toggle-switch">
          <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
          </label>
        </div>
      ),
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    },
    {
      accessorKey: "action",
      header: "Action",
<<<<<<< HEAD
      cell: ({ row }) => {
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
                  { candidateId }, // <-- Correct parameter
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (response.data.success) {
                  toast.success("Candidate deleted successfully!");
                  fetchCandidates();
                } else {
                  toast.error(
                    response.data.message || "Failed to delete candidate."
                  );
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
            >
              <i className="fa-solid fa-eye"></i>
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

  // Fetch Data with page + limit
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}admin/jobseekers?page=${page}&limit=${limit}`
      );
      setJobSeeker(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, limit]);

  // Export Excel
  const exportAllCandidates = async () => {
    try {
      // 1️⃣ First call → get pagination info
      const firstCall = await axios.get(
        `${API_BASE_URL}admin/jobseekers?page=1&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const totalPages = firstCall.data.totalPages;
      let allCandidates = [...firstCall.data.data];

      // 2️⃣ Fetch remaining pages dynamically
      for (let p = 2; p <= totalPages; p++) {
        const res = await axios.get(
          `${API_BASE_URL}admin/jobseekers?page=${p}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        allCandidates = [...allCandidates, ...res.data.data];
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
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Candidates");
      XLSX.writeFile(workbook, "all_candidates.xlsx");

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
          <h4>Manage Candidate</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Candidate List
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="common-fillter-select-area">
            <div className="data-export-btn-info">
              <button className="data-export-btn" onClick={exportAllCandidates}>
                Export Data
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <>
                <TableView
                  columns={columns}
                  data={jobSeeker}
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
=======
      cell: () => (
        <div
          className="super-admin-action-icons
"
        >
          <Link to="/admin/candidate-details">
            <i class="fa-solid fa-eye"></i>{" "}
          </Link>{" "}
          <i className="fa-solid fa-trash" title="Delete" />{" "}
        </div>
      ),
    },
  ];

  // ✅ Dummy Candidates Data
  const data = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      first_name: "Rahul",
      last_name: "Sharma",
      email: "rahul.sharma@example.com",
      job_title: "Software Engineer",
      experience: 3,
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      first_name: "Priya",
      last_name: "Patel",
      email: "priya.patel@example.com",
      job_title: "UI/UX Designer",
      experience: 2,
    },
    {
      id: 3,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      first_name: "Amit",
      last_name: "Verma",
      email: "amit.verma@example.com",
      job_title: "Backend Developer",
      experience: 4,
    },
    {
      id: 4,
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      first_name: "Sneha",
      last_name: "Rao",
      email: "sneha.rao@example.com",
      job_title: "HR Executive",
      experience: 5,
    },
    {
      id: 5,
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      first_name: "Vikram",
      last_name: "Kumar",
      email: "vikram.kumar@example.com",
      job_title: "Data Analyst",
      experience: 3,
    },
    {
      id: 6,
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      first_name: "Nisha",
      last_name: "Thakur",
      email: "nisha.thakur@example.com",
      job_title: "QA Engineer",
      experience: 2,
    },
    {
      id: 7,
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      first_name: "Rohit",
      last_name: "Agarwal",
      email: "rohit.agarwal@example.com",
      job_title: "Full Stack Developer",
      experience: 5,
    },
    {
      id: 8,
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      first_name: "Meera",
      last_name: "Joshi",
      email: "meera.joshi@example.com",
      job_title: "Content Writer",
      experience: 1,
    },
    {
      id: 9,
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      first_name: "Arjun",
      last_name: "Mehta",
      email: "arjun.mehta@example.com",
      job_title: "DevOps Engineer",
      experience: 4,
    },
    {
      id: 10,
      image: "https://randomuser.me/api/portraits/women/10.jpg",
      first_name: "Kavya",
      last_name: "Desai",
      email: "kavya.desai@example.com",
      job_title: "Project Coordinator",
      experience: 3,
    },
    {
      id: 11,
      image: "https://randomuser.me/api/portraits/women/11.jpg",
      first_name: "Kavya3",
      last_name: "Desai6",
      email: "kavya.desai6@example.com",
      job_title: "Project Coordinator",
      experience: 4,
    },
  ];

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Manage Candidate</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/" >
            <i className="fa-solid fa-angles-left" />
          </Link>
          Candidate List
        </h5>
      </div>
      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="common-fillter-select-area">
          <div className="fillter-data-box-info">
            <div className="fillter-data-box">
              <div className="form-group">
                <label>Short By Country </label>
                <select
                  className="form-select form-control"
                  id="category"
                  name="category"
                  required
                >
                  <option value>Select A Country</option>
                  <option value="general">USA</option>
                  <option value="billing">Canada</option>
                  <option value="billing">Germany</option>
                  <option value="billing">Australia</option>
                  <option value="billing">Singapore</option>
                  <option value="billing">Japan</option>
                </select>
              </div>
            </div>
          </div>
          <div className="fillter-data-box-info">
            <div className="fillter-data-box">
              <div className="form-group">
                <label>Short By Skills</label>
                <select
                  className="form-select form-control"
                  id="category"
                  name="category"
                  required
                >
                  <option value>Select A Skills</option>
                  <option value="general">Nod.js</option>
                  <option value="billing">React.js</option>
                  <option value="billing">HTML5</option>
                  <option value="billing">CSS3</option>
                  <option value="billing">QA</option>
                  <option value="billing">Web Developer</option>
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
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Img</th>
                <th>Candidates Name</th>
                <th>Email ID</th>
                <th>Contact Number</th>
                <th>Create Date</th>
                <th>Country</th>
                <th>Home</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=1"
                    alt="Alice Johnson"
                    className="img-thumbnail"
                  />
                </td>
                <td>Alice Johnson</td>
                <td>alice.johnson@example.com</td>
                <td>+1 202 555 0143</td>
                <td>13-09-2024</td>
                <td>USA</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
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
                    src="https://i.pravatar.cc/50?img=2"
                    alt="Bob Smith"
                    className="img-thumbnail"
                  />
                </td>
                <td>Bob Smith</td>
                <td>bob.smith@example.com</td>
                <td>+44 20 7946 0829</td>
                <td>14-09-2024</td>
                <td>UK</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-candidate-profile-details.html">
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
                    src="https://i.pravatar.cc/50?img=3"
                    alt="Carol Andrews"
                    className="img-thumbnail"
                  />
                </td>
                <td>Carol Andrews</td>
                <td>carol.andrews@example.com</td>
                <td>+61 2 9374 4000</td>
                <td>15-09-2024</td>
                <td>Australia</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
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
                    src="https://i.pravatar.cc/50?img=4"
                    alt="David Brown"
                    className="img-thumbnail"
                  />
                </td>
                <td>David Brown</td>
                <td>david.brown@example.com</td>
                <td>+1 416 555 0189</td>
                <td>16-09-2024</td>
                <td>Canada</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-candidate-profile-details.html">
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
                    src="https://i.pravatar.cc/50?img=5"
                    alt="Emma Watson"
                    className="img-thumbnail"
                  />
                </td>
                <td>Emma Watson</td>
                <td>emma.watson@example.com</td>
                <td>+33 1 42 68 53 00</td>
                <td>17-09-2024</td>
                <td>France</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=6"
                    alt="Frank Miller"
                    className="img-thumbnail"
                  />
                </td>
                <td>Frank Miller</td>
                <td>frank.miller@example.com</td>
                <td>+49 30 901820</td>
                <td>18-09-2024</td>
                <td>Germany</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=7"
                    alt="Grace Lee"
                    className="img-thumbnail"
                  />
                </td>
                <td>Grace Lee</td>
                <td>grace.lee@example.com</td>
                <td>+82 2-312-3456</td>
                <td>19-09-2024</td>
                <td>South Korea</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=8"
                    alt="Henry Wilson"
                    className="img-thumbnail"
                  />
                </td>
                <td>Henry Wilson</td>
                <td>henry.wilson@example.com</td>
                <td>+81 3-1234-5678</td>
                <td>20-09-2024</td>
                <td>Japan</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=9"
                    alt="Ivy Hall"
                    className="img-thumbnail"
                  />
                </td>
                <td>Ivy Hall</td>
                <td>ivy.hall@example.com</td>
                <td>+91 98765 43210</td>
                <td>21-09-2024</td>
                <td>India</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=10"
                    alt="Jack Green"
                    className="img-thumbnail"
                  />
                </td>
                <td>Jack Green</td>
                <td>jack.green@example.com</td>
                <td>+39 06 6988 1234</td>
                <td>22-09-2024</td>
                <td>Italy</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>11</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=11"
                    alt="Karen Scott"
                    className="img-thumbnail"
                  />
                </td>
                <td>Karen Scott</td>
                <td>karen.scott@example.com</td>
                <td>+34 91 123 4567</td>
                <td>23-09-2024</td>
                <td>Spain</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>12</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=12"
                    alt="Leo White"
                    className="img-thumbnail"
                  />
                </td>
                <td>Leo White</td>
                <td>leo.white@example.com</td>
                <td>+7 495 555 1234</td>
                <td>24-09-2024</td>
                <td>Russia</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>13</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=13"
                    alt="Mia Scott"
                    className="img-thumbnail"
                  />
                </td>
                <td>Mia Scott</td>
                <td>mia.scott@example.com</td>
                <td>+55 11 91234 5678</td>
                <td>24-09-2024</td>
                <td>Brazil</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>14</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=14"
                    alt="Noah Green"
                    className="img-thumbnail"
                  />
                </td>
                <td>Noah Green</td>
                <td>noah.green@example.com</td>
                <td>+27 21 555 7890</td>
                <td>24-09-2024</td>
                <td>South Africa</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
                      <i className="fa-solid fa-eye" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>15</td>
                <td>
                  <img
                    src="https://i.pravatar.cc/50?img=15"
                    alt="Olivia Adams"
                    className="img-thumbnail"
                  />
                </td>
                <td>Olivia Adams</td>
                <td>olivia.adams@example.com</td>
                <td>+971 50 123 4567</td>
                <td>24-09-2024</td>
                <td>UAE</td>
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
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
                    <a href="super-admin-candidate-profile-details.html">
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

export default ManageCandidates;
