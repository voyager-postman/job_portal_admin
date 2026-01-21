import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";

function PackDetails() {
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
        <h4>Plan Details</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <a href="super-admin-pack-creations-list.html">
            <i className="fa-solid fa-angles-left" />
          </a>
          Plan Name: Initial Base Plan
        </h5>
        <a
          href="super-admin-pack-creations-form.html"
          className="super-dashboard-common-add-btn"
        >
          Add Pack
        </a>
      </div>
      <div className="super-admin-white-bg">
        <div className="plan-detail-info-area">
          <div className="plan-heading-info-area">
            <h4>Initial Base Plan</h4>
            <h5>$50</h5>
          </div>
          <div className="plan-detail-table">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Job Post Credit</td>
                  <td>10 Credits</td>
                </tr>
                <tr>
                  <td>Daily Job Posting Limit</td>
                  <td>3 Job Post Per Day</td>
                </tr>
                <tr>
                  <td>CV Viewing Credit</td>
                  <td>20 Credits</td>
                </tr>
                <tr>
                  <td>Daily Profile Viewing Limit</td>
                  <td>5 Profile View Per Day</td>
                </tr>
                <tr>
                  <td>Validity</td>
                  <td>3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="plan-detail-info-area">
          <div className="plan-heading-info-area">
            <h4>Premium Recruitment Plan</h4>
            <h5>$60</h5>
          </div>
          <div className="plan-detail-table">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Job Post Credit</td>
                  <td>10 Credits</td>
                </tr>
                <tr>
                  <td>Daily Job Posting Limit</td>
                  <td>3 Job Post Per Day</td>
                </tr>
                <tr>
                  <td>CV Viewing Credit</td>
                  <td>20 Credits</td>
                </tr>
                <tr>
                  <td>Daily Profile Viewing Limit</td>
                  <td>5 Profile View Per Day</td>
                </tr>
                <tr>
                  <td>Validity</td>
                  <td>3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PackDetails;
