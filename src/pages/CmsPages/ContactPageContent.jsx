import React from "react";

const ContactPageContent = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Contact Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>Contact Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Email ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email-id"
                    placeholder="Enter your email here"
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
                    placeholder="Enter your phone number here"
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
                    placeholder="Enter your our location here"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Map Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="map-location"
                    placeholder="Enter your map location url"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Message Main Title</label>
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
                  <label>Message Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="main-title-short-paragraph"
                    placeholder="Main Title Short Paragraph"
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

export default ContactPageContent;