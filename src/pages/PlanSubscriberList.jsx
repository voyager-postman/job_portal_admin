import React, { useState } from "react";

const PlanSubscriberList = () => {
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

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Plan Subscriber List</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <a href="super-admin-dashboard.html">
              <i className="fa-solid fa-angles-left" />
            </a>
            Plan Subscriber Management
          </h5>
          {/* <a href="super-admin-price-plan-form.html" class="super-dashboard-common-add-btn">Add Price Plan</a> */}
        </div>
        <div className="super-admin-manage-candidate-list super-admin-white-bg">
          <div className="common-fillter-select-area">
            <div className="fillter-data-box-info">
              <div className="fillter-data-box">
                <div className="form-group">
                  <label>Short By</label>
                  <select
                    className="form-select form-control"
                    id="category"
                    name="category"
                    required
                  >
                    <option value>Select</option>
                    <option value="general">Initial Base Plan</option>
                    <option value="billing">Standard Plus</option>
                    <option value="billing">Elite Premium</option>
                    <option value="billing">Enterprise Pro</option>
                    <option value="billing">Startup Basic</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="data-export-btn-info">
              <a href="#" className="data-export-btn">
                Export Data
              </a>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Img</th>
                  <th>Recruiter Name</th>
                  <th>Email ID</th>
                  <th>Contact Number</th>
                  <th>Plan Name</th>
                  <th>Purchase Date</th>
                  <th>Price</th>
                  <th>Validity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <img
                      src="https://randomuser.me/api/portraits/women/3.jpg"
                      alt="Carol Andrews"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>John Smith</td>
                  <td>john.smith@example.com</td>
                  <td>+1 234 567 8901</td>
                  <td>Initial Base Plan</td>
                  <td>2025-10-01</td>
                  <td>$99</td>
                  <td>6 months</td>
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
                      <a href="super-admin-pack-details.html">
                        <i className="fa-solid fa-eye" />
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
                      src="https://randomuser.me/api/portraits/men/4.jpg"
                      alt="David Brown"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Emma Johnson</td>
                  <td>emma.johnson@example.com</td>
                  <td>+1 234 567 8902</td>
                  <td>Standard Plus</td>
                  <td>2025-09-20</td>
                  <td>$149</td>
                  <td>6 months</td>
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
                      <a href="super-admin-pack-details.html">
                        <i className="fa-solid fa-eye" />
                      </a>
                      <a href="#">
                        <i className="fa-solid fa-trash" />
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <img
                      src="https://randomuser.me/api/portraits/men/6.jpg"
                      alt="Frank Miller"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Michael Brown</td>
                  <td>michael.brown@example.com</td>
                  <td>+1 234 567 8903</td>
                  <td>Elite Premium</td>
                  <td>2025-08-12</td>
                  <td>$199</td>
                  <td>12 months</td>
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
                      <a href="super-admin-pack-details.html">
                        <i className="fa-solid fa-eye" />
                      </a>
                      <a href="#">
                        <i className="fa-solid fa-trash" />
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <img
                      src="https://randomuser.me/api/portraits/men/8.jpg"
                      alt="Henry Wilson"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Sophia Williams</td>
                  <td>sophia.williams@example.com</td>
                  <td>+1 234 567 8904</td>
                  <td>Enterprise Pro</td>
                  <td>2025-07-15</td>
                  <td>$299</td>
                  <td>12 months</td>
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
                      <a href="super-admin-pack-details.html">
                        <i className="fa-solid fa-eye" />
                      </a>
                      <a href="#">
                        <i className="fa-solid fa-trash" />
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    <img
                      src="https://randomuser.me/api/portraits/women/9.jpg"
                      alt="Ivy Hall"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>Olivia Davis</td>
                  <td>olivia.davis@example.com</td>
                  <td>+1 234 567 8905</td>
                  <td>Startup Basic</td>
                  <td>2025-09-01</td>
                  <td>$49</td>
                  <td>3 months</td>
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
                      <a href="super-admin-pack-details.html">
                        <i className="fa-solid fa-eye" />
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
        </div>
      </section>
    </>
  );
};

export default PlanSubscriberList;
