import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";

function ManageFaq() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
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
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <div className="super-admin-action-icons">
          <Link to="/admin/faq-form">
            <i className="fa-solid fa-pen" title="Edit"></i>
          </Link>
          <i className="fa-solid fa-trash" title="Delete"></i>
        </div>
      ),
    },
  ];

  // ✅ Dummy Candidates Data
  const data = [
    {
      id: 1,
      title: "The Internet Is A Job",
      description: "Lorem ipsum dolor sit amet.",
      category: "Job Seeker",
      date: "Feb 12, 2024",
    },
    {
      id: 2,
      title: "Tips For Productive",
      description: "Discover simple yet effective.",
      category: "Employer",
      date: "Mar 8, 2024",
    },
    {
      id: 3,
      title: "How AI Is Changing",
      description: "Artificial Intelligence tools.",
      category: "Job Seeker",
      date: "Apr 22, 2024",
    },
    {
      id: 4,
      title: "The Future Of Web",
      description: "Explore the upcoming trends.",
      category: "Employer",
      date: "May 15, 2024",
    },
    {
      id: 5,
      title: "Why Cybersecurity",
      description: "As digital threats evolve.",
      category: "Job Seeker",
      date: "Jun 30, 2024",
    },
    {
      id: 6,
      title: "Mastering UI/UX",
      description: "Learn how to create user-friendly.",
      category: "Employer",
      date: "Jul 14, 2024",
    },
    {
      id: 7,
      title: "The Rise Of Blockchain",
      description: "Blockchain technology is reshaping.",
      category: "Job Seeker",
      date: "Aug 25, 2024",
    },
    {
      id: 8,
      title: "Effective SEO",
      description: "Optimize your website for better.",
      category: "Employer",
      date: "Sep 10, 2024",
    },
    {
      id: 9,
      title: "The Power Of Social",
      description: "Build a strong brand identity.",
      category: "Job Seeker",
      date: "Oct 5, 2024",
    },
    {
      id: 10,
      title: "How To Build A Career",
      description: "Get practical advice on starting.",
      category: "Employer",
      date: "Nov 2, 2024",
    },
  ];

  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>FAQ List </h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/" >
            <i className="fa-solid fa-angles-left" />
          </Link>
          FAQ Management{" "}
        </h5>

        <Link to="/admin/add-faq" className="super-dashboard-common-add-btn">
          Add FAQ
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
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>The Internet Is A Job</td>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Job Seeker</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Tips For Productive</td>
                <td>Discover simple yet effective.</td>
                <td>Employer</td>
                <td>Mar 8, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>How AI Is Changing</td>
                <td>Artificial Intelligence tools.</td>
                <td>Job Seeker</td>
                <td>Apr 22, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>The Future Of Web</td>
                <td>Explore the upcoming trends.</td>
                <td>Employer</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Why Cybersecurity</td>
                <td>As digital threats evolve.</td>
                <td>Job Seeker</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Mastering UI/UX</td>
                <td>Learn how to create user-friendly.</td>
                <td>Employer</td>
                <td>Jul 14, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>The Rise Of Blockchain</td>
                <td>Blockchain technology is reshaping.</td>
                <td>Job Seeker</td>
                <td>Aug 25, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>Effective SEO</td>
                <td>Optimize your website for better.</td>
                <td>Employer</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>The Power Of Social</td>
                <td>Build a strong brand identity.</td>
                <td>Job Seeker</td>
                <td>Oct 5, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>How To Build A Career</td>
                <td>Get practical advice on starting.</td>
                <td>Employer</td>
                <td>Nov 2, 2024</td>
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
                    <a href="super-admin-faq-content-form.html">
                      <i className="fa-solid fa-pen" />
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
  );
}

export default ManageFaq;
