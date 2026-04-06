import React, { useState, useEffect, useContext } from "react";
import "./mainlayout.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { API_IMAGE_URL } from "../../Url/Url";
import { Outlet } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { SiGoogleanalytics } from "react-icons/si";
import { LuEqualApproximately } from "react-icons/lu";
import CodeIcon from "@mui/icons-material/Code";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CategoryIcon from "@mui/icons-material/Category";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CastleIcon from "@mui/icons-material/Castle";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BusinessIcon from "@mui/icons-material/Business";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import InfoIcon from "@mui/icons-material/Info";
import SecurityIcon from "@mui/icons-material/Security";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { AiOutlineRead, AiOutlineQuestionCircle } from "react-icons/ai";
import QuizIcon from "@mui/icons-material/Quiz";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const { admin, logout } = useContext(AuthContext);

  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const signoutData = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Detect active key based on route
  const getActiveKey = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "";
    return path.replace("/admin/", "");
  };
  const categoryKeys = [
    "tech-stack",
    "job-type",
    "salary-range",
    "industry-sector",
    "company",
    "seniority-level",
  ];

  // ✅ Update selected and open submenu based on current route
  useEffect(() => {
    const key = getActiveKey();
    setSelectedKey(key);

    const cmsKeys = [
      "home-page-content",
      "employer-home-page-content",
      "employer_faq",
      "jobSeeker_faq",
      "about-page-content",
      "article-page-content",
      "contact-page-content",
      "footer-page-content",
      "term-condition-content",
      "privacy-policy-content",
    ];

    const managementKeys = [
      "manage-recruiter",
      "manage-candidates",
      "contact-messages",
      "notification-template",
      "notification-governance",
    ];

    const contentKeys = ["manage-blog"];

    const packageKeys = [
      "super-admin-pack-creations",
      "super-admin-add-on-pack-created-list",
    ];

    const billingKeys = ["invoice-list"];

    const paymentKeys = ["payment-gateway-management"];

    const skillsKey = [
      "manage-skill-categories",
      "manage-question-bank",
      "assessment-list",
    ];

    if (managementKeys.includes(key)) {
      setOpenKeys(["management"]);
    } else if (contentKeys.includes(key)) {
      setOpenKeys(["content"]);
    } else if (categoryKeys.includes(key)) {
      setOpenKeys(["manage-category"]);
    } else if (cmsKeys.includes(key)) {
      setOpenKeys(["content", "CMS-Pages-1"]);
    } else if (packageKeys.includes(key)) {
      setOpenKeys(["billing", "manage-packages"]);
    } else if (billingKeys.includes(key)) {
      setOpenKeys(["billing"]);
    } else if (paymentKeys.includes(key)) {
      setOpenKeys(["billing", "payment-gateway"]);
    } else if (skillsKey.includes(key)) {
      setOpenKeys(["assessment"]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  // ✅ Allow only one submenu open at a time
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const menuStyle = {
    background: "#fff",
  };

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <h2 className="text-white fs-5 text-center py-3 mb-0">
              <span className="sm-logo">
                {" "}
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/logo/connect-work-ma-login.png`}
                  className="festabash-l0go mb-3"
                  style={{ width: "35px", height: "35px" }}
                  alt="logo"
                />
              </span>
              <span
                className="lg-logo "
                style={{ color: "#2e47cc", width: "150px", height: "70px" }}
              >
                {" "}
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/logo/connect-work-ma-login.png`}
                  className="festabash-l0go mb-3"
                  style={{ width: "50%" }}
                  alt="logo"
                />
              </span>
            </h2>
          </div>
          <Menu
            mode="inline"
            style={menuStyle}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            selectedKeys={[selectedKey]}
            onClick={({ key }) => {
              if (key === "signout") {
                localStorage.clear();
                navigate("/");
              } else {
                setSelectedKey(key);
                navigate(`/admin/${key}`);
              }
            }}
          >
            <Menu.Item key="" icon={<AiOutlineDashboard className="fs-6" />}>
              Dashboard
            </Menu.Item>

            {/* MANAGEMENT */}
            <Menu.SubMenu
              key="management"
              icon={<SiGoogleanalytics />}
              title="Management"
            >
              <Menu.Item key="manage-recruiter" icon={<SiGoogleanalytics />}>
                Company
              </Menu.Item>

              <Menu.Item key="manage-candidates" icon={<AiOutlineUser />}>
                Candidates
              </Menu.Item>
              <Menu.Item key="contact-messages" icon={<ContactMailIcon />}>
                Contact Messages
              </Menu.Item>

              <Menu.Item key="notification-template" icon={<AiOutlineRead />}>
                Notifications Template
              </Menu.Item>
              <Menu.Item key="notification-governance" icon={<SecurityIcon />}>
                Notification Governance
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="manage-category"
              icon={<WorkOutlineIcon className="fs-6" />}
              title="Manage Category"
            >
              <Menu.Item key="tech-stack" icon={<CodeIcon className="fs-6" />}>
                Tech Stack
              </Menu.Item>

              <Menu.Item
                key="job-type"
                icon={<CategoryIcon className="fs-6" />}
              >
                Job Type
              </Menu.Item>

              <Menu.Item
                key="salary-range"
                icon={<MonetizationOnIcon className="fs-6" />}
              >
                Salary Range
              </Menu.Item>

              <Menu.Item
                key="industry-sector"
                icon={<ApartmentIcon className="fs-6" />}
              >
                Industry Sector
              </Menu.Item>

              <Menu.Item
                key="seniority-level"
                icon={<TrendingUpIcon className="fs-6" />}
              >
                Seniority Level
              </Menu.Item>
            </Menu.SubMenu>
            {/* CONTENT */}
            <Menu.SubMenu key="content" icon={<CastleIcon />} title="Content">
              <Menu.Item key="manage-blog" icon={<AiOutlineRead />}>
                Blog
              </Menu.Item>

              {/* <Menu.Item key="manage-faq" icon={<AiOutlineQuestionCircle />}>
                FAQ
              </Menu.Item> */}

              {/* KEEP YOUR CMS EXACTLY SAME */}
              <Menu.SubMenu
                key="CMS-Pages-1"
                icon={<CastleIcon />}
                title="CMS Pages"
              >
                <Menu.Item key="home-page-content" icon={<ContactMailIcon />}>
                  Home Page
                </Menu.Item>
                <Menu.Item
                  key="employer-home-page-content"
                  icon={<BusinessIcon />}
                >
                  Employer Home Page
                </Menu.Item>

                <Menu.Item key="employer_faq" icon={<HelpOutlineIcon />}>
                  Employer FAQ
                </Menu.Item>

                <Menu.Item key="jobSeeker_faq" icon={<QuestionAnswerIcon />}>
                  Job Seeker FAQ
                </Menu.Item>

                <Menu.Item key="about-page-content" icon={<InfoIcon />}>
                  About Page
                </Menu.Item>

                {/* <Menu.Item
                  key="article-page-content"
                  icon={<ImportContactsIcon />}
                >
                  Article Page
                </Menu.Item> */}

                <Menu.Item
                  key="contact-page-content"
                  icon={<ContactPhoneIcon />}
                >
                  Contact Page
                </Menu.Item>

                <Menu.Item
                  key="footer-page-content"
                  icon={<ContactSupportIcon />}
                >
                  Footer Content
                </Menu.Item>

                <Menu.Item
                  key="term-condition-content"
                  icon={<AddModeratorIcon />}
                >
                  Term And Conditions
                </Menu.Item>

                <Menu.Item key="privacy-policy-content" icon={<SecurityIcon />}>
                  Privacy And Policy
                </Menu.Item>
              </Menu.SubMenu>
            </Menu.SubMenu>
            <Menu.Item
              key="super-admin-plan-subscriber-list"
              icon={<AiOutlineRead className="fs-6" />}
            >
              Manage Subscriptions
            </Menu.Item>
            <Menu.Item key="credit-management" icon={<AccountBalanceIcon />}>
              Manage Credits
            </Menu.Item>
            <Menu.SubMenu
              key="manage-packages"
              icon={<AiOutlineRead />}
              title="Manage Packages"
            >
              <Menu.Item
                key="super-admin-pack-creations"
                icon={<ContactMailIcon />}
              >
                Subscription Packages
              </Menu.Item>

              <Menu.Item
                key="super-admin-add-on-pack-created-list"
                icon={<HelpOutlineIcon />}
              >
                Add-on Packages
              </Menu.Item>
            </Menu.SubMenu>
            {/* BILLING */}
            <Menu.SubMenu
              key="billing"
              icon={<AttachMoneyIcon />}
              title="Billing"
            >
              {/* ADD THIS */}

              <Menu.Item key="invoice-list" icon={<AiOutlineRead />}>
                Invoice
              </Menu.Item>
            </Menu.SubMenu>

            {/* ASSESSMENT */}
            <Menu.SubMenu
              key="assessment"
              icon={<QuizIcon />}
              title="Assessment"
            >
              <Menu.Item key="manage-skill-categories" icon={<CategoryIcon />}>
                Skill Categories
              </Menu.Item>

              <Menu.Item
                key="manage-question-bank"
                icon={<QuestionAnswerIcon />}
              >
                Question Bank
              </Menu.Item>

              <Menu.Item key="assessment-list" icon={<QuestionAnswerIcon />}>
                Assessments
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="d-flex justify-content-between ps-1 pe-5"
            style={{
              backgroundColor: "#fff",
              padding: 0,
              alignItems: "center",
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              },
            )}
            <div className="d-flex gap-2 align-items-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                {" "}
              </div>
              <div className="user-language-details">
                <div className="d-flex gap-3 align-items-center dropdown">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        admin?.profileImage
                          ? `${API_IMAGE_URL}/${admin.profileImage}`
                          : `${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`
                      }
                      crossorigin="anonymous"
                      alt="User"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                      }}
                    />

                    <span>
                      {admin
                        ? `${admin.first_name || ""} ${admin.last_name || ""}`
                        : "Super Admin"}
                    </span>
                  </div>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <NavLink
                        to="/admin/my_profile"
                        className="dropdown-item py-1 mb-1"
                        style={{ height: "auto", lineHeight: "20px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedKey("my_profile");
                          navigate("/admin/my_profile");
                        }}
                      >
                        My Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/change-password"
                        className="dropdown-item py-1 mb-1"
                        style={{ height: "auto", lineHeight: "20px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedKey("change-password");
                          navigate("/admin/change-password");
                        }}
                      >
                        Change Password
                      </NavLink>
                    </li>
                    <li>
                      <button
                        className="dropdown-item py-1 mb-1"
                        style={{ height: "auto", lineHeight: "20px" }}
                        onClick={signoutData}
                      >
                        Logout
                      </button>
                    </li>
                  </div>
                </div>
                <div className="header-language-toggle">
                  <select className="form-select">
                    <option value="en">Eng</option>
                    <option value="fr">Fr</option>
                  </select>
                </div>
              </div>
            </div>
          </Header>
          <div className="main_section">
            <Content
              style={{
                // padding: "30px",
                background: theme.useToken().colorBgContainer,
              }}
            >
              <Outlet />
            </Content>
            <footer className="py-4 bg-white">
              <p className="text-center mb-0">
                Copyright © 2026 Connect Work.ma | All right reserved.
              </p>
            </footer>
          </div>
        </Layout>
      </Layout>
    </>
  );
};
export default MainLayout;
