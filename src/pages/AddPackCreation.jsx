<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function AddPackCreation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const addOnData = state?.packData;
  console.log(addOnData);
  const isEditMode = Boolean(addOnData?._id);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    jobPostingCredits: "",
    dailyJobPostingLimit: "",
    profileViewingCredits: "",
    dailyProfileViewingLimit: "",
    validityValue: "",
    validityUnit: "Month",
    price: "",
    currency: "",
    paymentMode: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (addOnData) {
      // 🔥 Derive type from credits
      let derivedType = "";
      if (
        addOnData.jobPostingCredits > 0 &&
        addOnData.profileViewingCredits > 0
      ) {
        derivedType = "BOTH";
      } else if (addOnData.jobPostingCredits > 0) {
        derivedType = "JOB";
      } else if (addOnData.profileViewingCredits > 0) {
        derivedType = "CV";
      }

      setFormData({
        name: addOnData.packName || "",

        type: derivedType,

        jobPostingCredits: addOnData.jobPostingCredits || "",
        dailyJobPostingLimit: addOnData.dailyJobPostingLimit || "",

        profileViewingCredits: addOnData.profileViewingCredits || "",
        dailyProfileViewingLimit: addOnData.dailyProfileViewingLimit || "",

        validityValue: addOnData.validityValue || "",
        validityUnit: addOnData.validityUnit || "Month",

        price: addOnData.amount || "",
        currency: addOnData.currency || "",

        paymentMode: addOnData.paymentMode || "",
      });
    }
  }, [addOnData]);

  useEffect(() => {
    if (formData.type === "JOB") {
      setFormData((prev) => ({
        ...prev,
        profileViewingCredits: "",
        dailyProfileViewingLimit: "",
      }));
    }

    if (formData.type === "CV") {
      setFormData((prev) => ({
        ...prev,
        jobPostingCredits: "",
        dailyJobPostingLimit: "",
      }));
    }
  }, [formData.type]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.validityValue ||
      !formData.validityUnit ||
      !formData.price ||
      !formData.currency
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    if (
      (formData.type === "JOB" || formData.type === "BOTH") &&
      (!formData.jobPostingCredits || !formData.dailyJobPostingLimit)
    ) {
      toast.error("Job Posting credits and daily limit are required");
      return;
    }

    if (
      (formData.type === "CV" || formData.type === "BOTH") &&
      (!formData.profileViewingCredits || !formData.dailyProfileViewingLimit)
    ) {
      toast.error("Profile Viewing credits and daily limit are required");
      return;
    }

    // ✅ Decide API URL (Create vs Update)
    const url = isEditMode
      ? `${API_BASE_URL}pack/${addOnData._id}`
      : `${API_BASE_URL}pack`;

    // ✅ Backend-compatible payload
    const payload = {
      packName: formData.name,

      jobPostingCredits:
        formData.type === "JOB" || formData.type === "BOTH"
          ? Number(formData.jobPostingCredits)
          : 0,

      dailyJobPostingLimit:
        formData.type === "JOB" || formData.type === "BOTH"
          ? Number(formData.dailyJobPostingLimit)
          : 0,

      profileViewingCredits:
        formData.type === "CV" || formData.type === "BOTH"
          ? Number(formData.profileViewingCredits)
          : 0,

      dailyProfileViewingLimit:
        formData.type === "CV" || formData.type === "BOTH"
          ? Number(formData.dailyProfileViewingLimit)
          : 0,

      validityValue: Number(formData.validityValue),
      validityUnit: formData.validityUnit,

      currency: formData.currency,
      amount: Number(formData.price),
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        isEditMode
          ? "Subscription Pack updated successfully ✅"
          : "Subscription Pack created successfully 🎉"
      );

      navigate("/admin/super-admin-pack-creations");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Subscription Pack`
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add On Pack Creation Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-add-on-pack-created-list">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {isEditMode ? "Update Add On Pack" : "Create New Add On Pack"}
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* PACK NAME */}
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Add-On Pack Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Pack Name"
                  />
                </div>
              </div>

              {/* TYPE */}
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Select Type Of Credits</label>
                  <select
                    className="form-select form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="JOB">Job Posting Credits</option>
                    <option value="CV">Profile Viewing Credits</option>
                    <option value="BOTH">Job + Profile Credits</option>
                  </select>
                </div>
              </div>

              {(formData.type === "JOB" || formData.type === "BOTH") && (
                <>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Job Posting Credits</label>
                      <input
                        type="number"
                        className="form-control"
                        name="jobPostingCredits"
                        value={formData.jobPostingCredits}
                        onChange={handleChange}
                        placeholder="Enter Job Posting Credits"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Daily Job Posting Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="dailyJobPostingLimit"
                        value={formData.dailyJobPostingLimit}
                        onChange={handleChange}
                        placeholder="Enter Daily Job Posting Limit"
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.type === "CV" || formData.type === "BOTH") && (
                <>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Profile Viewing Credits</label>
                      <input
                        type="number"
                        className="form-control"
                        name="profileViewingCredits"
                        value={formData.profileViewingCredits}
                        onChange={handleChange}
                        placeholder="Enter Profile Viewing Credits"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Daily Profile Viewing Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="dailyProfileViewingLimit"
                        value={formData.dailyProfileViewingLimit}
                        onChange={handleChange}
                        placeholder="Enter Daily Profile Viewing Limit"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* VALIDITY VALUE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Validity Value</label>
                  <input
                    type="number"
                    className="form-control"
                    name="validityValue"
                    value={formData.validityValue}
                    onChange={handleChange}
                    placeholder="Enter Validity Number"
                  />
                </div>
              </div>

              {/* VALIDITY UNIT */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Validity Unit</label>
                  <select
                    className="form-select form-control"
                    name="validityUnit"
                    value={formData.validityUnit}
                    onChange={handleChange}
                  >
                    <option value="">Select Unit</option>
                    <option value="Day">Days</option>
                    <option value="Month">Months</option>
                    <option value="Year">Years</option>
                  </select>
                </div>
              </div>

              {/* CURRENCY */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    className="form-select form-control"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* PRICE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                  />
                </div>
              </div>

              {/* PAYMENT MODE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Payment Mode</label>
                  <select
                    className="form-select form-control"
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Online">Online</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              {/* BUTTON */}
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info text-center">
                  <button
                    type="button"
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update Details" : "Save Details"}
                  </button>
=======
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
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
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
