import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;

const Sidebar = ({ isSidebarHidden, isSidebarShown }) => {
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const toggleCms = () => setIsCmsOpen((prev) => !prev);
  return (
    <>
      <section className="super-dashboard-side-menu">
        <div
          className={`side-menu-info-area 
          ${isSidebarHidden ? "hide" : ""} 
          ${isSidebarShown ? "show" : ""}`}
        >
          <ul>
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-gauge"></i> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/manage-users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-users"></i> Manage Employees
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/manage-candidates"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-users"></i> Manage Candidates
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/manage-category"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fa-solid fa-layer-group"></i> Manage Category
              </NavLink>
            </li>

            <li className={`dropdown ${isCmsOpen ? "open" : ""}`}>
              <div
                onClick={toggleCms}
                className={`dropdown-toggle ${isCmsOpen ? "active" : ""}`}
              >
                <i className="fa-solid fa-file-lines"></i>
                <span>CMS Pages</span>
                <i
                  className={`fa-solid fa-chevron-${
                    isCmsOpen ? "up" : "down"
                  } dropdown-arrow`}
                ></i>
              </div>

              <ul
                className={`dropdown-menu ${
                  isCmsOpen ? "dropdown-open" : "dropdown-closed"
                }`}
              >
                <li>
                  <NavLink
                    to="/admin/cms/about-us"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/cms/privacy-policy"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Privacy Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/cms/terms"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Terms & Conditions
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
