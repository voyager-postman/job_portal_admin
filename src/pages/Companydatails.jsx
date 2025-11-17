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
                      <a
                        href="https://itdevelopmentservices.com/jobPortal/"
                        target="_blank"
                      >
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Companydatails;
