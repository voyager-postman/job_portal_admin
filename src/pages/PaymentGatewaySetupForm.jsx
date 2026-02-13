import React from "react";
import { Link } from "react-router-dom";

const PaymentGatewaySetupForm = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Payment Gateway Setup Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Payment Gateway Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Payment Gateway Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="payment-gateway-name"
                    placeholder="Payment Gateway Name"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Merchant ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="merchant-id"
                    placeholder="Merchant ID"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Client ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="client-id"
                    placeholder="Client ID"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Client Secret</label>
                  <input
                    type="text"
                    className="form-control"
                    name="client-secret"
                    placeholder="Client Secret"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Signing Key ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="signing-key-id"
                    placeholder="Signing Key Id"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Signing Key</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Signing Key"
                    placeholder="Signing Key"
                  />
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

export default PaymentGatewaySetupForm;
