import React from "react";
import { Link } from "react-router-dom";

const UserWallet = () => {
  return (
    <section className="super-dashboard-content-wrapper">
      <div className="super-dashboard-breadcrumb-info">
        <h4>Manage User Wallet</h4>
      </div>
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin/">
            <i className="fa-solid fa-angles-left" />
          </Link>
          User Wallet
        </h5>
      </div>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <section className="employer-dashboard-info-area">
            <div className="employer-dashboard-common-heading">
              <h2>Global credit balances</h2>
            </div>
          </section>

          <section className="user-wallet-credit-button-info">
            <div className="user-wallet-credit-box-info">
              <div className="user-wallet-credit-button">
                <div className="user-wallet-credit">
                  <h4>
                    Total Job posting credits: <span>10</span>
                  </h4>
                  <h4>
                    Total profile viewing credits: <span>20</span>
                  </h4>
                </div>
                <div className="user-wallet-credit-buy-button">
                  <a
                    href="#"
                    className="credit-buy-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Add credits
                  </a>
                  <a href="#" className="credit-buy-btn">
                    Add Plane
                  </a>
                </div>
              </div>
              <p>Last Updated: 10-Nov-2025</p>
            </div>

            <div className="add-credits-modal-info">
              {/* <!-- Modal --> */}
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add Credits
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Credits Type</label>
                        <select
                          name="cars"
                          className="form-select form-control"
                          aria-label="Default2 select example"
                          id="Industry"
                        >
                          <option value="volvo">Select Credits Type</option>
                          <option value="volvo">Job Post Credits</option>
                          <option value="saab">Profile View Credits</option>
                        </select>
                      </div>
                      <form className="add-credits-input-btn">
                        <div className="form-group">
                          <label>Add Credits</label>
                          <input
                            className="form-control"
                            type="text"
                            id="first-name"
                            name="first_name"
                            placeholder="Add Credits"
                            required
                          />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <a href="#" className="buy-plan-btn">
                        Buy Now
                      </a>
                      <a href="#" className="buy-plan-btn">
                        View Plans
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="user-wallet-credit-limit-info">
            <div className="user-wallet-credit-limit">
              <div className="user-wallet-credit-box">
                <h3>1/2</h3>
                <h4>jobs created today</h4>
                <h4>Max 2 postings/day</h4>
                <p>Daily limits reset automatically at midnight</p>
              </div>
              <div className="user-wallet-credit-box">
                <h3>3/5</h3>
                <h4>profiles vieweds</h4>
                <h4>Max 20 views/day</h4>
                <p>Daily limits reset automatically at midnight</p>
              </div>
              <div className="user-wallet-credit-box">
                <h3>3 Months</h3>
                <h4>Validity Period</h4>
                <h4>From account verification date</h4>
              </div>
            </div>
          </section>

          <section className="user-wallet-transaction-list">
            <div className="employer-dashboard-common-heading">
              <h2>Global credit Transactions Details</h2>
            </div>

            <div className="user-wallet-transaction-tab">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="credit-tab"
                    data-bs-toggle="tab"
                    href="#creditTab"
                    role="tab"
                    aria-controls="creditTab"
                    aria-selected="true"
                  >
                    Credit History
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="debit-tab"
                    data-bs-toggle="tab"
                    href="#debitTab"
                    role="tab"
                    aria-controls="debitTab"
                    aria-selected="false"
                  >
                    Debit History
                  </a>
                </li>
              </ul>
            </div>

            <div className="tab-content user-wallet-transaction-table">
              {/* <!-- Credit Tab --> */}
              <div
                className="tab-pane fade show active"
                id="creditTab"
                role="tabpanel"
                aria-labelledby="credit-tab"
              >
                <table className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Credit</th>
                      <th>Transaction Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>10</td>
                      <td>
                        Total Job posting credits <a href="#">View...</a>
                      </td>
                      <td>30-Oct-2025</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>20</td>
                      <td>
                        Total profile viewing credits <a href="#">View...</a>
                      </td>
                      <td>06-Nov-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <!-- Debit Tab --> */}
              <div
                className="tab-pane fade"
                id="debitTab"
                role="tabpanel"
                aria-labelledby="debit-tab"
              >
                <table className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Debit</th>
                      <th>Transaction Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>2</td>
                      <td>Job Posting Used</td>
                      <td>09-Nov-2025</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>10</td>
                      <td>Profile Views Used</td>
                      <td>10-Nov-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* <!-- End Main Dashboard Content Wrapper Area --> */}
    </section>
  );
};

export default UserWallet;
