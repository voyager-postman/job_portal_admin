import React from "react";
import { Link } from "react-router-dom";

const JobSeekerFAQ = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>FAQ Section Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            {" "}
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            FAQ Content Update Here
          </h5>
        </div>

        <div className="responsive-content">
          <div className="super-dashboard-cms-content-form">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      className="form-control"
                      name="question"
                      placeholder="Enter your Question here"
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Select Category</label>
                    <select
                      className="form-select form-control"
                      id="category"
                      name="category"
                      required=""
                    >
                      <option value="">Select A Category</option>
                      <option value="general">Job Seeker</option>
                      <option value="billing">Employer</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Write Your Answer</label>
                    <textarea
                      id="review"
                      className="form-control"
                      rows="5"
                      placeholder="Write your answer here..."
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
        </div>
      </section>
    </>
  );
};

export default JobSeekerFAQ;
