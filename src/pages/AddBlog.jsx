import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddBlog = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recruiter Data:", formData);
  };
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Blog Page Content Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i class="fa-solid fa-angles-left"></i>
            </Link>
            Blog Section Content Update Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Article Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="article-title"
                    placeholder="Article Title"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Author Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Author Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Publish Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="publish-date"
                    placeholder="Publish Date"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Banner Image</label>
                </div>
                <div className="upload-company-info-area">
                  <div className="upload-company-img-preview">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`}
                      className="main-logo"
                      id="preview"
                      alt="Image Preview"
                    />
                  </div>
                  <div className="upload-company-input">
                    {/* Hidden input */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>
                  <div className="upload-company-file-name">
                    {/* Display file name */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>
                  <div className="upload-company-file-btn">
                    {/* Label acting as custom button */}
                    <label
                      htmlFor="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Article Content</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows={4}
                    placeholder="Write your article content here..."
                    required
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a
                    href="super-admin-blog-list.html"
                    className="super-dashboard-content-btn"
                  >
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddBlog;
