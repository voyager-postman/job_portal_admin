import React from "react";

const AboutContent = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>About Us Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-dashboard.html">
              <i class="fa-solid fa-angles-left"></i>
            </a>
            About Us Page First Section Content Update Here
          </h5>
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
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Description Paragraph</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows="2"
                    placeholder="Write your description here..."
                    required=""
                  ></textarea>
                </div>
              </div>
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
          <h5>About Us Page Second Section Content Update Here</h5>
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
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Number"
                    placeholder="Number"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Short Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    name="short-heading"
                    placeholder="Short Heading"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Short Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="short-description"
                    placeholder="Short Description"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Second Section Img Upload</label>
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
          <h5>About Us Page Third Section Content Update Here</h5>
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
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name"
                    placeholder="User Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name-position"
                    placeholder="User Name Position"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Write Review for the Website</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows="2"
                    placeholder="Write your review here..."
                    required=""
                  ></textarea>
                </div>
                <div className="super-dashboard-star-rating">
                  <h5>Rating *</h5>
                  <span>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-regular fa-star"></i>
                  </span>
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
          <h5>About Us Page Fourth Section Content Update Here</h5>
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
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="section-Img-upload-input">
                  <label>Fourth Section Img Upload</label>
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
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name"
                    placeholder="User Name"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>User Name Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user-name-position"
                    placeholder="User Name Position"
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

export default AboutContent;
