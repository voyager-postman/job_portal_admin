import React from "react";
import { Link } from "react-router-dom";

const PaymentGatewayManagement = () => {
  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Payment Gateway Management</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-dashboard.html">
              <i className="fa-solid fa-angles-left" />
            </a>
            Payment Gateway Management List
          </h5>
          <Link
            to="/admin/add-gateway-setup"
           className="default-btn btn btn-primary"
          >
            {" "}
           + Add Payment Gateway
          </Link>
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="table-column-status-sno">S.No.</th>
                <th>Img</th>
                <th>Payment Gateway Name</th>
                {/* <th>Charge</th> */}
                <th className="table-column-status-size">Status</th>
                <th className="table-column-status-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    width={20}
                  />
                </td>
                <td>PayPal</td>
                {/* <td>2.9%</td> */}
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-payment-gateway-setup-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <img
                    src="https://stripe.com/img/v3/home/twitter.png"
                    alt="Stripe"
                    width={20}
                  />
                </td>
                <td>Stripe</td>
                {/* <td>2.7%</td> */}
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-payment-gateway-setup-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    width={20}
                  />
                </td>
                <td>PayPal</td>
                {/* <td>2.9%</td> */}
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-payment-gateway-setup-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <img
                    src="https://stripe.com/img/v3/home/twitter.png"
                    alt="Stripe"
                    width={20}
                  />
                </td>
                <td>Stripe</td>
                {/* <td>2.7%</td> */}
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-payment-gateway-setup-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    width={20}
                  />
                </td>
                <td>PayPal</td>
                {/* <td>2.9%</td> */}
                <td>
                  <div className="super-admin-toggle-switch">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round" />
                    </label>
                  </div>
                </td>
                <td>
                  <div className="super-admin-action-icons">
                    <a href="super-admin-payment-gateway-setup-form.html">
                      <i className="fa-solid fa-pen" />
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-trash" />
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default PaymentGatewayManagement;
