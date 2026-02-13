import React from "react";
import { Link } from "react-router-dom";

const PricingPlanManagement = () => {
  return (
    <>
      <section class="super-dashboard-content-wrapper">
        <div class="super-dashboard-breadcrumb-info">
          <h4>Price Plan Management</h4>
        </div>

        <div class="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Price Plan Management List
          </h5>
        </div>
        <div class="super-admin-manage-candidate-list super-admin-white-bg">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Plan Name</th>
                <th>Job Post Credits</th>
                <th>CV Viewing Credits</th>
                <th>Featured Job Credits</th>
                <th>Validity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Initial Base Plan</td>
                <td>50</td>
                <td>100</td>
                <td>20</td>
                <td>6 months</td>
                <td>$99</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Standard Plus</td>
                <td>75</td>
                <td>150</td>
                <td>30</td>
                <td>6 months</td>
                <td>$149</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Elite Premium</td>
                <td>100</td>
                <td>200</td>
                <td>40</td>
                <td>12 months</td>
                <td>$199</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Enterprise Pro</td>
                <td>200</td>
                <td>400</td>
                <td>80</td>
                <td>12 months</td>
                <td>$299</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Startup Basic</td>
                <td>25</td>
                <td>50</td>
                <td>10</td>
                <td>3 months</td>
                <td>$49</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>Professional Recruiter</td>
                <td>150</td>
                <td>300</td>
                <td>60</td>
                <td>12 months</td>
                <td>$259</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>Agency Unlimited</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
                <td>100</td>
                <td>1 year</td>
                <td>$499</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>Freelancer Basic</td>
                <td>10</td>
                <td>20</td>
                <td>5</td>
                <td>1 month</td>
                <td>$19</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>9</td>
                <td>SME Growth Plan</td>
                <td>80</td>
                <td>160</td>
                <td>30</td>
                <td>9 months</td>
                <td>$179</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>Corporate Max</td>
                <td>300</td>
                <td>600</td>
                <td>120</td>
                <td>24 months</td>
                <td>$599</td>
                <td>
                  <div class="super-admin-toggle-switch">
                    <label class="switch">
                      <input type="checkbox" checked="" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="super-admin-action-icons">
                    <a href="#">
                      <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#">
                      <i class="fa-solid fa-trash"></i>
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

export default PricingPlanManagement;
