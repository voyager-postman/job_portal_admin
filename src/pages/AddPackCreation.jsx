import { Link } from "react-router-dom";
import { TableView } from "../components/DataTable";

function AddPackCreation() {
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
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Pack Creations Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-pack-creations-list.html">
              <i className="fa-solid fa-angles-left" />
            </a>
            Pack Creations Update Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Pack Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="payment-gateway-name"
                    placeholder="Pack Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Job Posting Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    name="merchant-id"
                    placeholder="Job Posting Credits"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Daily Job Posting Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    name="merchant-id"
                    placeholder="Daily Job Posting Limit"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Profile Viewing Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    name="client-id"
                    placeholder="Profile Viewing Credits"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Daily Profile Viewing Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    name="client-id"
                    placeholder="Daily Profile Viewing Limit"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group label-info">
                  <label>Validity Period</label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    name="client-secret"
                    placeholder="Enter Number"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Month</option>
                    <option value="general">Years</option>
                    <option value="billing">Days</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group label-info">
                  <label>Currency</label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Select Currency</option>
                    <option value="general">USD</option>
                    <option value="billing">EUR</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      placeholder="Enter Amount"
                    />
                  </div>
                </div>
              </div>
              {/*<div class="col-lg-12 col-md-12">
<div class="form-group label-info">
<label>Eligibility</label>
</div>  
     </div>

     <div class="col-lg-12 col-md-12">
<div class="eligibility-select-info-area">
 <div class="form-group">
  <input type="radio" id="WelcomePack" name="payment" value="WelcomePack">
  <label for="WelcomePack">Welcome Pack</label>
 </div>
 <div class="form-group">
  <input type="radio" id="NewCompanies" name="payment" value="NewCompanies">
  <label for="NewCompanies">New Companies Only</label>
 </div> 
 <div class="form-group">
  <input type="radio" id="AllCompanies" name="payment" value="AllCompanies">
  <label for="AllCompanies">All Companies</label>
 </div>  
</div>
     </div> */}
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a
                    href="super-admin-pack-details.html"
                    className="super-dashboard-content-btn"
                  >
                    Save Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddPackCreation;
