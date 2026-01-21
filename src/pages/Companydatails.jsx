<<<<<<< HEAD
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Companydatails = () => {
  const location = useLocation();
  const companyProfileId = location?.state?.companyProfileId;
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);

  console.log("Received Company Id:", companyProfileId);
  useEffect(() => {
    console.log("useEffect Triggered:", companyProfileId);

    if (companyProfileId) {
      fetchCompanyDetails(companyProfileId);
    }
  }, [companyProfileId]);

  const fetchCompanyDetails = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}GetCompanyById/${id}`);

      console.log("API Response:", res.data?.company);
      setCompany(res.data?.company);
    } catch (error) {
      console.error("Error While Fetching Company Details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url || url === "undefined" || url === null) {
      return "assets/images/company/company-img-1.jpg"; 
    }
    // Fix broken: /uploads/https...
    if (url.includes("uploads/https")) {
      const cleanUrl = url.substring(url.indexOf("https"));
      return cleanUrl;
    }
    // Full external URL
    if (url.startsWith("http")) {
      return url;
    }
    // Local stored file
    return `${API_IMAGE_URL}${url}`;
  };

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const decodedHtml = decodeHtml(decodeHtml(company?.aboutCompany || ""));
  const decodedHtml1 = decodeHtml1(decodeHtml1(company?.careerDetail || ""));
  function decodeHtml1(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="main-dashboard-content d-flex flex-column">
          <div className="super-dashboard-breadcrumb-info">
            <h4>Company Details</h4>
          </div>
          <div className="super-dashboard-common-heading">
            <h5>
              <Link to="/admin/complete-company-details" state={{ companyProfileId }}>
                <i className="fa-solid fa-angles-left" />
              </Link>
              Manage Company Details
            </h5>
          </div>
          <div className="super-admin-company-detail-info-area">
            <div className="super-admin-company-img-short-detail">
              <div className="super-admin-company-img">
                <img
                  crossorigin="anonymous"
                  src={getImageUrl(company?.coverPhoto)}
                  alt="Image"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              </div>
              <div className="super-admin-company-short-detail">
                <div className="super-admin-company-logo">
                  <img
                    crossorigin="anonymous"
                    src={getImageUrl(company?.logo)}
                    alt="Image"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                </div>
                <div className="super-admin-company-about-short-info">
                  <h4>{company?.brandName || "Not Provided"}</h4>
                  <ul>
                    <li>
                      <i className="fa-solid fa-user" />
                      {company?.numberOfEmployees || "Not Provided"}
                    </li>
                    <li>
                      <i className="fa-solid fa-globe" />
                      Services
                    </li>
                    <li>
=======
const Companydatails = () => {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Company</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Company Details</h5>
        </div>
        <div className="super-admin-company-detail-info-area">
          <div className="super-admin-company-img-short-detail">
            <div className="super-admin-company-img">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/companyImg/companyImg.jpg`}
                alt="Image"
              />
            </div>
            <div className="super-admin-company-short-detail">
              <div className="super-admin-company-logo">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/companyImg/partnerLogo.png`}
                  alt="Image"
                />
              </div>
              <div className="super-admin-company-about-short-info">
                <h4>Hauts De Seine Department</h4>
                <ul>
                  <li>
                    <i className="fa-solid fa-user" />
                    1000 - 2000
                  </li>
                  <li>
                    <i className="fa-solid fa-globe" />
                    Services
                  </li>
                  <li>
                    <a
                      href="https://itdevelopmentservices.com/jobPortal/"
                      target="_blank"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                      Visit the company website
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="super-admin-company-detail-tab-info">
            {/* Nav tabs */}
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#menu1"
                  aria-selected="true"
                  role="tab"
                >
                  About the company{" "}
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#menu2"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Current openings
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#menu3"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Office photos
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#menu4"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Office videos
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#menu5"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Career Details
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#menu6"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Links
                </a>
              </li>
            </ul>
          </div>
          <div className="super-admin-company-detail-tab-description">
            {/* Tab panes */}
            <div className="tab-content">
              <div id="menu1" className="tab-pane active" role="tabpanel">
                <h5>Company Information</h5>
                <div className="super-admin-company-profile-detail-info">
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-building-columns" />
                      Company Name
                    </h4>
                    <p>Hauts De Seine Department</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-gear" />
                      Industry
                    </h4>
                    <p>Automobile Industry</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-user" />
                      Number of Employees
                    </h4>
                    <p>100</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-phone" />
                      Phone number
                    </h4>
                    <p>+1 212-213-6050</p>
                  </div>
                </div>
                <div className="super-admin-company-profile-detail-info">
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-address-card" />
                      Street Address
                    </h4>
                    <p>205 North Michigan Avenue</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-city" />
                      City
                    </h4>
                    <p>Chicago</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-map-location-dot" />
                      State
                    </h4>
                    <p>Illinois</p>
                  </div>
                  <div className="super-admin-company-profile-detail-box">
                    <h4>
                      <i className="fa-solid fa-globe" />
                      Country
                    </h4>
                    <p>USA</p>
                  </div>
                </div>
                <div className="super-admin-company-profile-description">
                  <p>
                    Moody’s Corporation, often referred to as Moody’s, is an
                    American business and financial services company. It is the
                    holding company for Moody’s Investors Service (MIS), an
                    American credit rating agency, and Moody’s Analytics (MA),
                    an American provider of financial analysis software and
                    services.
                  </p>
                  <p>
                    Moody’s was founded by John Moody in 1909 to produce manuals
                    of statistics related to stocks and bonds and bond ratings.
                    Moody’s was acquired by Dun &amp; Bradstreet in 1962. In
                    2000, Dun &amp; Bradstreet spun off Moody’s Corporation as a
                    separate company that was listed on the NYSE under MCO. In
                    2007, Moody’s Corporation was split into two operating
                    divisions, Moody’s Investors Service, the rating agency, and
                    Moody’s Analytics, with all of its other products.
                  </p>
                </div>
              </div>
              <div id="menu2" className="tab-pane fade" role="tabpanel">
                <h5>Current openings</h5>
                <div className="super-admin-company-detail-card">
                  <div className="super-admin-job-company-name-logo">
                    <div className="super-admin-job-company-logo">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/companyImg/icon-1.png`}
                        alt="Image"
                      />
                    </div>
                    <div className="super-admin-job-company-name">
                      <h4>CodeHive</h4>
                    </div>
                  </div>
                  <div className="super-admin-job-detail-area">
                    <h4>Software Engineer (Backend)</h4>
                    <p>
                      We are looking for a senior React developer to join our
                      product engineering team We are looking for a senior React
                      developer to join our product engineering team We are
                      looking for a senior React developer to join our product
                      engineering team We are looking for a senior React
                      developer to join our product engineering team
                    </p>
                    <ul>
                      <li>
                        <i className="fa-regular fa-calendar" /> 4 days ago
                      </li>
                      <li>
                        <i className="fa-regular fa-file" /> Information
                        Technology Management{" "}
                      </li>
                      <li>
                        <i className="fa-regular fa-user" />
                        Part-time
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot" /> N/A
                      </li>
                      <li>
                        <i className="fa-solid fa-users" /> Available: 1{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="super-admin-company-detail-card">
                  <div className="super-admin-job-company-name-logo">
                    <div className="super-admin-job-company-logo">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/companyImg/icon-1.png`}
                        alt="Image"
                      />
                    </div>
                    <div className="super-admin-job-company-name">
                      <h4>CodeHive</h4>
                    </div>
                  </div>
                  <div className="super-admin-job-detail-area">
                    <h4>Software Engineer (Backend)</h4>
                    <p>
                      We are looking for a senior React developer to join our
                      product engineering team We are looking for a senior React
                      developer to join our product engineering team We are
                      looking for a senior React developer to join our product
                      engineering team We are looking for a senior React
                      developer to join our product engineering team
                    </p>
                    <ul>
                      <li>
                        <i className="fa-regular fa-calendar" /> 4 days ago
                      </li>
                      <li>
                        <i className="fa-regular fa-file" /> Information
                        Technology Management{" "}
                      </li>
                      <li>
                        <i className="fa-regular fa-user" />
                        Part-time
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot" /> N/A
                      </li>
                      <li>
                        <i className="fa-solid fa-users" /> Available: 1{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="super-admin-company-detail-card">
                  <div className="super-admin-job-company-name-logo">
                    <div className="super-admin-job-company-logo">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/companyImg/icon-1.png`}
                        alt="Image"
                      />
                    </div>
                    <div className="super-admin-job-company-name">
                      <h4>CodeHive</h4>
                    </div>
                  </div>
                  <div className="super-admin-job-detail-area">
                    <h4>Software Engineer (Backend)</h4>
                    <p>
                      We are looking for a senior React developer to join our
                      product engineering team We are looking for a senior React
                      developer to join our product engineering team We are
                      looking for a senior React developer to join our product
                      engineering team We are looking for a senior React
                      developer to join our product engineering team
                    </p>
                    <ul>
                      <li>
                        <i className="fa-regular fa-calendar" /> 4 days ago
                      </li>
                      <li>
                        <i className="fa-regular fa-file" /> Information
                        Technology Management{" "}
                      </li>
                      <li>
                        <i className="fa-regular fa-user" />
                        Part-time
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot" /> N/A
                      </li>
                      <li>
                        <i className="fa-solid fa-users" /> Available: 1{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="super-admin-company-detail-card">
                  <div className="super-admin-job-company-name-logo">
                    <div className="super-admin-job-company-logo">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/companyImg/icon-1.png`}
                        alt="Image"
                      />
                    </div>
                    <div className="super-admin-job-company-name">
                      <h4>CodeHive</h4>
                    </div>
                  </div>
                  <div className="super-admin-job-detail-area">
                    <h4>Software Engineer (Backend)</h4>
                    <p>
                      We are looking for a senior React developer to join our
                      product engineering team We are looking for a senior React
                      developer to join our product engineering team We are
                      looking for a senior React developer to join our product
                      engineering team We are looking for a senior React
                      developer to join our product engineering team
                    </p>
                    <ul>
                      <li>
                        <i className="fa-regular fa-calendar" /> 4 days ago
                      </li>
                      <li>
                        <i className="fa-regular fa-file" /> Information
                        Technology Management{" "}
                      </li>
                      <li>
                        <i className="fa-regular fa-user" />
                        Part-time
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot" /> N/A
                      </li>
                      <li>
                        <i className="fa-solid fa-users" /> Available: 1{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="menu3" className="tab-pane fade" role="tabpanel">
                <div className="super-admin-company-detail-third-tab">
                  <h5>Office Photos</h5>
                  <div className="row">
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-photos-box">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-1.jpg`}
                          alt="Company"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-photos-box">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-2.jpg`}
                          alt="Company"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-photos-box">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-3.jpg`}
                          alt="Company"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-photos-box">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-4.jpg`}
                          alt="Company"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="menu4" className="tab-pane fade" role="tabpanel">
                <div className="super-admin-company-detail-fourth-tab">
                  <h5>Office Videos</h5>
                  <div className="row">
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-video-box">
                        <video width="100%" height={150} controls>
                          <source
                            src={`${process.env.PUBLIC_URL}/assets/video/camera.mp4`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-video-box">
                        <video width="100%" height={150} controls>
                          <source
                            src={`${process.env.PUBLIC_URL}/assets/video/camera.mp4`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-video-box">
                        <video width="100%" height={150} controls>
                          <source
                            src={`${process.env.PUBLIC_URL}/assets/video/camera.mp4`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="super-admin-company-office-video-box">
                        <video width="100%" height={150} controls>
                          <source
                            src={`${process.env.PUBLIC_URL}/assets/video/camera.mp4`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="menu5" className="tab-pane fade" role="tabpanel">
                <div className="super-admin-company-detail-fifth-tab">
                  <h5>Career Details</h5>
                  <p>
                    Respect for people, our priority at ID2, also includes
                    respect for the environment; it's a strong conviction and
                    our corporate culture. We feel strongly about the importance
                    of adopting eco-responsible behavior, particularly with
                    ID2's growth, which is leading to an increase in our energy
                    consumption.
                  </p>
                  <p>
                    Since 2008, we have been a member of the Global Compact
                    France. This pact aligns our operations and strategies with
                    ten universally accepted principles relating to human
                    rights, labor standards, the environment, and the fight
                    against corruption. These principles align with ID2's
                    values, particularly those related to working conditions and
                    the environment.
                  </p>
                  <p>
                    To measure our progress, we use ECOVADIS, an expert in
                    Corporate Social Responsibility. To date, ID2's commitment
                    to CSR is qualified as Platinum with a rating of 78/100,
                    which places us in the top 5% of suppliers evaluated
                  </p>
                </div>
              </div>
              <div id="menu6" className="tab-pane fade" role="tabpanel">
                <div className="super-admin-company-detail-sixth-tab">
                  <h5>Links</h5>
                  <div className="super-admin-company-detail-official-website">
                    <h4>
                      <i className="fa-solid fa-globe" /> Company offical
                      website
                    </h4>
                    <h5>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
                      <a
                        href="https://itdevelopmentservices.com/jobPortal/"
                        target="_blank"
                      >
<<<<<<< HEAD
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                        Visit the company website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="super-admin-company-detail-tab-info">
              {/* Nav tabs */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#menu1"
                    aria-selected="true"
                    role="tab"
                  >
                    About the company{" "}
                  </a>
                </li>
                {/* <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#menu2"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab"
                  >
                    Current openings
                  </a>
                </li> */}
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#menu3"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab"
                  >
                    Office photos
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#menu4"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab"
                  >
                    Office videos
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#menu5"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab"
                  >
                    Career Details
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#menu6"
                    aria-selected="false"
                    tabIndex={-1}
                    role="tab"
                  >
                    Links
                  </a>
                </li>
              </ul>
            </div>
            <div className="super-admin-company-detail-tab-description">
              {/* Tab panes */}
              <div className="tab-content">
                <div id="menu1" className="tab-pane active" role="tabpanel">
                  <h5>Company Information</h5>
                  <div className="super-admin-company-profile-detail-info">
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-building-columns" />
                        Company Name
                      </h4>
                      <p>{company?.brandName || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-gear" />
                        Industry
                      </h4>
                      <p>{company?.industry || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-user" />
                        Number of Employees
                      </h4>
                      <p> {company?.numberOfEmployees || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-phone" />
                        Phone number
                      </h4>
                      <p>
                        {" "}
                        {company?.phone?.countryCode && company?.phone?.number
                          ? `${company.phone.countryCode} - ${company.phone.number}`
                          : "Not Provided"}
                      </p>
                    </div>
                  </div>
                  <div className="super-admin-company-profile-detail-info">
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-address-card" />
                        Street Address
                      </h4>
                      <p> {company?.companyAddress || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-city" />
                        City
                      </h4>
                      <p>{company?.city || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-map-location-dot" />
                        State
                      </h4>
                      <p>{company?.region || "Not Provided"}</p>
                    </div>
                    <div className="super-admin-company-profile-detail-box">
                      <h4>
                        <i className="fa-solid fa-globe" />
                        Country
                      </h4>
                      <p>{company?.Country || "Not Provided"}</p>
                    </div>
                  </div>
                  <div className="super-admin-company-profile-description">
                    <div
                      className="company-profile-description"
                      dangerouslySetInnerHTML={{ __html: decodedHtml }}
                    />
                  </div>
                </div>
                <div id="menu2" className="tab-pane fade" role="tabpanel">
                  <h5>Current openings</h5>
                  {/* <div className="super-admin-company-detail-card">
                    <div className="super-admin-job-company-name-logo">
                      <div className="super-admin-job-company-logo">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/companyImg/icon-1.png`}
                          alt="Image"
                        />
                      </div>
                      <div className="super-admin-job-company-name">
                        <h4>CodeHive</h4>
                      </div>
                    </div>
                    <div className="super-admin-job-detail-area">
                      <h4>Software Engineer (Backend)</h4>
                      <p>
                        We are looking for a senior React developer to join our
                        product engineering team We are looking for a senior
                        React developer to join our product engineering team We
                        are looking for a senior React developer to join our
                        product engineering team We are looking for a senior
                        React developer to join our product engineering team
                      </p>
                      <ul>
                        <li>
                          <i className="fa-regular fa-calendar" /> 4 days ago
                        </li>
                        <li>
                          <i className="fa-regular fa-file" /> Information
                          Technology Management{" "}
                        </li>
                        <li>
                          <i className="fa-regular fa-user" />
                          Part-time
                        </li>
                        <li>
                          <i className="fa-solid fa-location-dot" /> N/A
                        </li>
                        <li>
                          <i className="fa-solid fa-users" /> Available: 1{" "}
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
                <div id="menu3" className="tab-pane fade" role="tabpanel">
                  <div className="super-admin-company-detail-third-tab">
                    <h5>Office Photos</h5>
                    <div className="row">
                      {company?.photos?.map((photo) => (
                        <div className="col-lg-3 col-md-4" key={photo._id}>
                          <div className="super-admin-company-office-photos-box">
                            <img
                              crossorigin="anonymous"
                              src={getImageUrl(photo.url)}
                              alt="Company"
                            />
                          </div>
                        </div>
                      ))}
                      {/* <div className="col-lg-3 col-md-4">
                        <div className="super-admin-company-office-photos-box">
                          <img
                            src={`${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-4.jpg`}
                            alt="Company"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div id="menu4" className="tab-pane fade" role="tabpanel">
                  <div className="super-admin-company-detail-fourth-tab">
                    <h5>Office Videos</h5>
                    <div className="row">
                      {company?.videos?.map((video) => (
                        <div className="col-lg-3 col-md-4" key={video._id}>
                          <div className="super-admin-company-office-photos-box">
                            <img
                              crossorigin="anonymous"
                              src={getImageUrl(video.url)}
                              alt="Company"
                            />
                          </div>
                        </div>
                      ))}
                      {/* <div className="col-lg-3 col-md-4">
                        <div className="super-admin-company-office-video-box">
                          <video width="100%" height={150} controls>
                            <source
                              src={`${process.env.PUBLIC_URL}/assets/video/camera.mp4`}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div id="menu5" className="tab-pane fade" role="tabpanel">
                  <div className="super-admin-company-detail-fifth-tab">
                    <h5>Career Details</h5>
                    <div
                      className="career-detail-display"
                      dangerouslySetInnerHTML={{ __html: decodedHtml1 }}
                    />
                  </div>
                </div>
                <div id="menu6" className="tab-pane fade" role="tabpanel">
                  <div className="super-admin-company-detail-sixth-tab">
                    <h5>Links</h5>
                    <div className="super-admin-company-detail-official-website">
                      <h4>
                        <i className="fa-solid fa-globe" /> Company offical
                        website
                      </h4>
                      <h5>
                        <a
                          href={company?.links?.officialWebsite}
                          target="_blank"
                        >
                          {company?.brandName || "Not Provided"}
                        </a>
                      </h5>
                    </div>
                    <div className="super-admin-company-detail-social-link">
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-linkedin" /> Linkedin
                        </h4>
                        <a
                          href={company?.links?.linkedin || "Not Provided"}
                          target="_blank"
                          style={{
                            wordBreak: "break-all",
                          }}
                        >
                          {company?.links?.linkedin || "Not Provided"}
                        </a>
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-facebook-f" /> facebook
                        </h4>
                        <a
                          href={company?.links?.facebook || "Not Provided"}
                          target="_blank"
                          style={{
                            wordBreak: "break-all",
                          }}
                        >
                          {company?.links?.facebook || "Not Provided"}
                        </a>
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-instagram" /> Instagram
                        </h4>
                        <a
                          href={company?.links?.instagram || "Not Provided"}
                          target="_blank"
                          style={{
                            wordBreak: "break-all",
                          }}
                        >
                          {company?.links?.instagram || "Not Provided"}
                        </a>
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-x-twitter" /> Twitter
                        </h4>
                        <a
                          href={company?.links?.twitter || "Not Provided"}
                          target="_blank"
                          style={{
                            wordBreak: "break-all",
                          }}
                        >
                          {company?.links?.twitter || "Not Provided"}
                        </a>
                      </div>
=======
                        Hauts De Seine Department
                      </a>
                    </h5>
                  </div>
                  <div className="super-admin-company-detail-social-link">
                    <div className="super-admin-company-detail-social-box">
                      <h4>
                        <i className="fa-brands fa-linkedin" /> Linkedin
                      </h4>
                      <a href="https://in.linkedin.com/" target="_blank">
                        https://in.linkedin.com/
                      </a>
                    </div>
                    <div className="super-admin-company-detail-social-box">
                      <h4>
                        <i className="fa-brands fa-facebook-f" /> facebook
                      </h4>
                      <a href="https://www.facebook.com/" target="_blank">
                        https://www.facebook.com/
                      </a>
                    </div>
                    <div className="super-admin-company-detail-social-box">
                      <h4>
                        <i className="fa-brands fa-instagram" /> Instagram
                      </h4>
                      <a href="https://www.instagram.com/" target="_blank">
                        https://www.instagram.com/
                      </a>
                    </div>
                    <div className="super-admin-company-detail-social-box">
                      <h4>
                        <i className="fa-brands fa-x-twitter" /> Twitter
                      </h4>
                      <a href="https://x.com/" target="_blank">
                        https://x.com/
                      </a>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      )}
=======
      </div>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    </>
  );
};

<<<<<<< HEAD
export default Companydatails;
=======
export default Companydatails;
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
