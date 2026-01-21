import React from "react";

const PricePlanForm = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Price Plan Setup Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>Price Plan Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Plan Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="plan-name"
                    placeholder="Plan Name"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Plan Price</label>
                  <input
                    type="text"
                    className="form-control"
                    name="plan-price"
                    placeholder="Plan Price"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Job Post Credit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="job-post-credit"
                    placeholder="Job Post Credit"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>CV Viewing Credit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cv-viewing-credit"
                    placeholder="CV Viewing Credit"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Featured Job Credit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="featured-job-credit"
                    placeholder="Featured Job Credit"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Plan Validation</label>
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required=""
                  >
                    <option value="">Select Plan Validation</option>
                    <option value="">1 Month</option>
                    <option value="general">2 Month</option>
                    <option value="billing">3 Month</option>
                    <option value="">4 Month</option>
                    <option value="general">5 Month</option>
                    <option value="billing">6 Month</option>
                    <option value="">7 Month</option>
                    <option value="general">8 Month</option>
                    <option value="billing">9 Month</option>
                    <option value="">10 Month</option>
                    <option value="general">11 Month</option>
                    <option value="billing">12 Month</option>
                  </select>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <a href="#" className="super-dashboard-content-btn">
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
};

export default PricePlanForm;
