import React from "react";
import { Link } from "react-router-dom";

const FooterPageContent = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Footer Section Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            {" "}
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            First Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>First Section Img Upload</label>
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
                    {/* <!-- Hidden input --> */}
                    <input type="file" id="imageInput" accept="image/*" />
                  </div>

                  <div className="upload-company-file-name">
                    {/* <!-- Display file name --> */}
                    <span className="file-name" id="fileName">
                      No file selected
                    </span>
                  </div>

                  <div className="upload-company-file-btn">
                    {/* <!-- Label acting as custom button --> */}
                    <label
                      for="imageInput"
                      className="super-dashboard-custom-upload"
                    >
                      Choose Img
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>First Section Short Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="first-section-short-description"
                    placeholder="First Section Short Description"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <label>Facebook Link</label>
                  <input
                    type="url"
                    id="website"
                    className="form-control"
                    name="website"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <label>Twitter Link</label>
                  <input
                    type="url"
                    id="website"
                    className="form-control"
                    name="website"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4">
                <div className="form-group">
                  <label>Instagram Link</label>
                  <input
                    type="url"
                    id="website"
                    className="form-control"
                    name="website"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>Second Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>Third Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-name"
                    placeholder="Menu Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Menu Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="menu-link"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
                    Update Content
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>Four Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title"
                    placeholder="Main Title"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email-id"
                    placeholder="Email ID"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone-number"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Our Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="our-location"
                    placeholder="Our Location"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
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

export default FooterPageContent;
