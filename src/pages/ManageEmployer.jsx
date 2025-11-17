import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";

function ManageUsers() {
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
        <div className="recruiterImg-info">
          <img
            src={row.original.image}
            alt="user"
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
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <div class="super-admin-toggle-switch">
          <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div
          className="super-admin-action-icons
"
        >
          <Link to="/admin/company-details">
            <i class="fa-solid fa-eye"></i>{" "}
          </Link>{" "}
          <i className="fa-solid fa-trash" title="Delete" />
        </div>
      ),
    },
  ];

  // ✅ Dummy Recruiters Data
  const data = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@example.com",
      position: "HR Manager",
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      first_name: "Sophia",
      last_name: "Brown",
      email: "sophia.brown@example.com",
      position: "Recruiter",
    },
    {
      id: 3,
      image: "https://randomuser.me/api/portraits/men/31.jpg",
      first_name: "Michael",
      last_name: "Lee",
      email: "michael.lee@example.com",
      position: "Team Lead",
    },
    {
      id: 4,
      image: "https://randomuser.me/api/portraits/women/41.jpg",
      first_name: "Emily",
      last_name: "Wilson",
      email: "emily.wilson@example.com",
      position: "HR Assistant",
    },
    {
      id: 5,
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      first_name: "Daniel",
      last_name: "Miller",
      email: "daniel.miller@example.com",
      position: "Software Engineer",
    },
    {
      id: 6,
      image: "https://randomuser.me/api/portraits/women/61.jpg",
      first_name: "Ava",
      last_name: "Johnson",
      email: "ava.johnson@example.com",
      position: "Recruiter",
    },
    {
      id: 7,
      image: "https://randomuser.me/api/portraits/men/71.jpg",
      first_name: "Liam",
      last_name: "Taylor",
      email: "liam.taylor@example.com",
      position: "Designer",
    },
    {
      id: 8,
      image: "https://randomuser.me/api/portraits/women/81.jpg",
      first_name: "Olivia",
      last_name: "Anderson",
      email: "olivia.anderson@example.com",
      position: "Staff Member",
    },
    {
      id: 9,
      image: "https://randomuser.me/api/portraits/men/91.jpg",
      first_name: "James",
      last_name: "Clark",
      email: "james.clark@example.com",
      position: "Recruiter",
    },
    {
      id: 10,
      image: "https://randomuser.me/api/portraits/women/10.jpg",
      first_name: "Isabella",
      last_name: "Lopez",
      email: "isabella.lopez@example.com",
      position: "HR Executive",
    },
  ];

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4> Manage Recruiters</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
           <Link to="/admin/" >
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage Recruiters List
        </h5>
      </div>
      <div className="super-admin-manage-candidate-list super-admin-white-bg">
        <div className="common-tab-btn-main">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                data-bs-toggle="tab"
                href="#All-Companies"
                aria-selected="true"
                role="tab"
              >
                All Companies
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                data-bs-toggle="tab"
                href="#New-Companies"
                aria-selected="false"
                tabIndex={-1}
                role="tab"
              >
                New Companies
              </a>
            </li>
          </ul>
          <div className="all-fillter-box-info">
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
                    <option value>Select A Industry</option>
                    <option value="general">Technology</option>
                    <option value="billing">Finance</option>
                    <option value="billing">Healthcare</option>
                    <option value="billing">Manufacturing</option>
                    <option value="billing">Education</option>
                    <option value="billing">Construction</option>
                  </select>
                </div>
              </div>
            </div>
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
          </div>
          <div className="data-export-btn-info">
            <a href="#" className="data-export-btn">
              Export Data
            </a>
          </div>
        </div>
        <div className="tab-content-info-area tab-content">
          <div
            id="All-Companies"
            className="tab-pane active show"
            role="tabpanel"
          >
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Img</th>
                    <th>Recruiter Name</th>
                    <th>Email ID</th>
                    <th>Contact Number</th>
                    <th>Create Date</th>
                    <th>Industry</th>
                    <th>Country</th>
                    <th>Home</th>
                    <th>Status</th>
                    <th className="common-action-col-space">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/1.jpg"
                        alt="Alice Johnson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Alice Johnson</td>
                    <td>alice.johnson@example.com</td>
                    <td>+1-555-1001</td>
                    <td>13-09-2024</td>
                    <td>Technology</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/2.jpg"
                        alt="Bob Smith"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Bob Smith</td>
                    <td>bob.smith@example.com</td>
                    <td>+1-555-1002</td>
                    <td>14-09-2024</td>
                    <td>Finance</td>
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
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/3.jpg"
                        alt="Carol Andrews"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Carol Andrews</td>
                    <td>carol.andrews@example.com</td>
                    <td>+1-555-1003</td>
                    <td>15-09-2024</td>
                    <td>Healthcare</td>
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
                          <input type="checkbox" defaultChecked />
                          <span className="slider round" />
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="David Brown"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>David Brown</td>
                    <td>david.brown@example.com</td>
                    <td>+1-555-1004</td>
                    <td>16-09-2024</td>
                    <td>Manufacturing</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/5.jpg"
                        alt="Emma Watson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Emma Watson</td>
                    <td>emma.watson@example.com</td>
                    <td>+1-555-1005</td>
                    <td>17-09-2024</td>
                    <td>Education</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/6.jpg"
                        alt="Frank Miller"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Frank Miller</td>
                    <td>frank.miller@example.com</td>
                    <td>+1-555-1006</td>
                    <td>18-09-2024</td>
                    <td>Construction</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/7.jpg"
                        alt="Grace Lee"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Grace Lee</td>
                    <td>grace.lee@example.com</td>
                    <td>+1-555-1007</td>
                    <td>19-09-2024</td>
                    <td>Retail</td>
                    <td>Singapore</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/8.jpg"
                        alt="Henry Wilson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Henry Wilson</td>
                    <td>henry.wilson@example.com</td>
                    <td>+1-555-1008</td>
                    <td>20-09-2024</td>
                    <td>Automotive</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/9.jpg"
                        alt="Ivy Hall"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Ivy Hall</td>
                    <td>ivy.hall@example.com</td>
                    <td>+1-555-1009</td>
                    <td>21-09-2024</td>
                    <td>Hospitality</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/10.jpg"
                        alt="Jack Green"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Jack Green</td>
                    <td>jack.green@example.com</td>
                    <td>+1-555-1010</td>
                    <td>22-09-2024</td>
                    <td>Energy</td>
                    <td>Norway</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/11.jpg"
                        alt="Karen Scott"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Karen Scott</td>
                    <td>karen.scott@example.com</td>
                    <td>+1-555-1011</td>
                    <td>23-09-2024</td>
                    <td>Legal</td>
                    <td>Switzerland</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/12.jpg"
                        alt="Leo White"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Leo White</td>
                    <td>leo.white@example.com</td>
                    <td>+1-555-1012</td>
                    <td>24-09-2024</td>
                    <td>Marketing</td>
                    <td>Netherlands</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/13.jpg"
                        alt="Mia Scott"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Mia Scott</td>
                    <td>mia.scott@example.com</td>
                    <td>+1-555-1013</td>
                    <td>25-09-2024</td>
                    <td>Design</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/14.jpg"
                        alt="Noah Green"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Noah Green</td>
                    <td>noah.green@example.com</td>
                    <td>+1-555-1014</td>
                    <td>26-09-2024</td>
                    <td>Real Estate</td>
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
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/15.jpg"
                        alt="Olivia Adams"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Olivia Adams</td>
                    <td>olivia.adams@example.com</td>
                    <td>+1-555-1015</td>
                    <td>27-09-2024</td>
                    <td>Hospital</td>
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
                        <a href="super-admin-company-details.html">
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
          <div id="New-Companies" className="tab-pane fade" role="tabpanel">
            <div className="table-responsive">
              <table className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Img</th>
                    <th>Recruiter Name</th>
                    <th>Email ID</th>
                    <th>Contact Number</th>
                    <th>Create Date</th>
                    <th>Industry</th>
                    <th>Country</th>
                    <th>Request</th>
                    <th className="common-action-col-space">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src="https://randomuser.me/api/portraits/women/1.jpg"
                        alt="Alice Johnson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Alice Johnson</td>
                    <td>alice.johnson@example.com</td>
                    <td>+1-555-1001</td>
                    <td>13-09-2024</td>
                    <td>Technology</td>
                    <td>USA</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/2.jpg"
                        alt="Bob Smith"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Bob Smith</td>
                    <td>bob.smith@example.com</td>
                    <td>+1-555-1002</td>
                    <td>14-09-2024</td>
                    <td>Finance</td>
                    <td>Canada</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/3.jpg"
                        alt="Carol Andrews"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Carol Andrews</td>
                    <td>carol.andrews@example.com</td>
                    <td>+1-555-1003</td>
                    <td>15-09-2024</td>
                    <td>Healthcare</td>
                    <td>UK</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="David Brown"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>David Brown</td>
                    <td>david.brown@example.com</td>
                    <td>+1-555-1004</td>
                    <td>16-09-2024</td>
                    <td>Manufacturing</td>
                    <td>Germany</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
                        src="https://randomuser.me/api/portraits/women/5.jpg"
                        alt="Emma Watson"
                        className="img-thumbnail"
                      />
                    </td>
                    <td>Emma Watson</td>
                    <td>emma.watson@example.com</td>
                    <td>+1-555-1005</td>
                    <td>17-09-2024</td>
                    <td>Education</td>
                    <td>Australia</td>
                    <td className="accept-reject-select">
                      <select
                        className="form-select form-control"
                        id="category"
                        name="category"
                        required
                      >
                        <option value>Request</option>
                        <option value>Accept</option>
                        <option value>Reject</option>
                      </select>
                    </td>
                    <td>
                      <div className="super-admin-action-icons">
                        <a href="super-admin-company-details.html">
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
        </div>
      </div>
    </section>
  );
}

export default ManageUsers;
