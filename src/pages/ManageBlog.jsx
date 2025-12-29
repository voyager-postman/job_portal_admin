import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";

function ManageBlog() {
  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
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
      header: "Status",
      cell: ({ row }) => (
        <div className="super-admin-toggle-switch">
          <label className="switch">
            <input type="checkbox" defaultChecked={row.original.status} />
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
          <Link to="/admin/blog-form">
            <i className="fa-solid fa-pen"></i>
          </Link>
          <a href="#">
            <i className="fa-solid fa-trash"></i>
          </a>
        </div>
      ),
    },
  ];

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
    <section className="super-dashboard-content-wrapper">
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
        <Link to="/admin/add-blog" className="super-dashboard-common-add-btn">
          Add BLOG
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
          <table className="table table-bordered column-size-info">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Author</th>
                <th>Date</th>
                <th>Link</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=1"
                    alt="Blog Image"
                  />
                </td>
                <td>The Internet Is A Job </td>
                <td>Lorem ipsum dolor sit amet.</td>
                <td>Andrew Lawson</td>
                <td>Feb 12, 2024</td>
                <td>blog-details.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=2"
                    alt="Blog Image"
                  />
                </td>
                <td> Tips For Productive</td>
                <td>Discover simple yet effective.</td>
                <td>Sarah Mitchell</td>
                <td>Mar 8, 2024</td>
                <td>remote-work-tips.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=3"
                    alt="Blog Image"
                  />
                </td>
                <td>How AI Is Changing</td>
                <td>Artificial Intelligence tools.</td>
                <td>James Carter</td>
                <td>Apr 22, 2024</td>
                <td>ai-marketing.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=4"
                    alt="Blog Image"
                  />
                </td>
                <td>The Future Of Web</td>
                <td>Explore the upcoming trends.</td>
                <td>Emily Brown</td>
                <td>May 15, 2024</td>
                <td>web-development-future.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=5"
                    alt="Blog Image"
                  />
                </td>
                <td>Why Cybersecurity</td>
                <td>As digital threats evolve.</td>
                <td>David Johnson</td>
                <td>Jun 30, 2024</td>
                <td>cybersecurity-tips.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=6"
                    alt="Blog Image"
                  />
                </td>
                <td>Mastering UI/UX</td>
                <td>Learn how to create user-friendly.</td>
                <td>Olivia White</td>
                <td>Jul 14, 2024</td>
                <td>ui-ux-design.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=7"
                    alt="Blog Image"
                  />
                </td>
                <td>The Rise Of Blockchain</td>
                <td>Blockchain technology is reshaping.</td>
                <td>Michael Scott</td>
                <td>Aug 25, 2024</td>
                <td>blockchain-business.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=8"
                    alt="Blog Image"
                  />
                </td>
                <td>Effective SEO</td>
                <td>Optimize your website for better.</td>
                <td>Rachel Adams</td>
                <td>Sep 10, 2024</td>
                <td>seo-strategies.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=9"
                    alt="Blog Image"
                  />
                </td>
                <td>The Power Of Social</td>
                <td>Build a strong brand identity.</td>
                <td>Laura Green</td>
                <td>Oct 5, 2024</td>
                <td>social-media-branding.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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
                <td>
                  <img
                    src="https://picsum.photos/80/60?random=10"
                    alt="Blog Image"
                  />
                </td>
                <td>How To Build A Career</td>
                <td>Get practical advice on starting.</td>
                <td>Chris Evans</td>
                <td>Nov 2, 2024</td>
                <td>career-in-tech.html</td>
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
                    <a href="super-admin-blog-content-form.html">
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

export default ManageBlog;
