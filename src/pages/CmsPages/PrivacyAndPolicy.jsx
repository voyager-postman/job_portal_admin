import React from "react";
import { Link } from "react-router-dom";

const PrivacyAndPolicy = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Privacy Policy Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            {" "}
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Privacy Policy Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Privacy Policy Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="privacy-policy"
                    placeholder="Privacy Policy"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-16">
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
                <div className="form-group">
                  <label>Privacy Policy Content</label>
                  <textarea
                    id="review"
                    className="form-control"
                    rows="7"
                    placeholder="Write your privacy policy content here..."
                    required=""
                  ></textarea>
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

export default PrivacyAndPolicy;
