import React from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";

const Header = ({ handleToggle }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // clears EVERYTHING
    navigate("/"); // redirect to home or login
  };

=======
import { Link } from "react-router-dom";

const Header = ({ handleToggle }) => {
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
  return (
    <section className="super-dashboard-header-info-area">
      <header className="super-dashboard-header-detail">
        <div className="super-dashboard-logo-info">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/logo/connect-work-ma-login.png`}
            alt="logo"
          />

          {/* Toggle button beside logo */}
          <div className="sidebar-toggle-btn">
            <i
              className="fa-solid fa-bars"
              id="sidebarToggle"
              onClick={handleToggle}
            ></i>
          </div>
        </div>

        <div className="super-dashboard-user-img-name-info dropdown">
          <div
            className="super-dashboard-user-img-name dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`}
              alt="sauserImg"
            />
            <span>Super Admin</span>
          </div>
          <div className="dropdown-menu-list dropdown-menu">
            <ul>
              <li>
                <Link to="my_profile">
                  <i className="fa-solid fa-user"></i> My Profile
                </Link>
              </li>
              <li>
                <Link to="change-password">
                  <i className="fa-solid fa-unlock"></i> Change Password
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <button
                  onClick={handleLogout}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fa-solid fa-power-off"></i> Logout
                </button>
=======
                <Link to="/">
                  <i className="fa-solid fa-power-off"></i> Logout
                </Link>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
              </li>
            </ul>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
