import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url.js";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Companydatails = () => {
  const location = useLocation();
  const companyProfileId = location?.state?.companyProfileId;
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const careerDetailRef = useRef(null);
  const defaultCoverImage = `${process.env.PUBLIC_URL}/assets/images/companyImg/company-img-1.jpg`;
  const defaultLogoImage = `${process.env.PUBLIC_URL}/assets/images/companyImg/partner-logo-2.png`;

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

  const getImageUrl = (url, fallback = defaultCoverImage) => {
    if (!url || url === "undefined" || url === null) {
      return fallback;
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

  const getVideoUrl = (url) => {
    if (!url || url === "undefined" || url === null) return "";
    if (url.startsWith("http")) return url;
    return `${API_IMAGE_URL}${url}`;
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace("www.", "");

      if (host === "youtube.com" || host === "m.youtube.com") {
        const videoId = parsedUrl.pathname.startsWith("/shorts/")
          ? parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0]
          : parsedUrl.searchParams.get("v");

        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      if (host === "youtu.be") {
        const videoId = parsedUrl.pathname.replace("/", "").split("/")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
    } catch (error) {
      return "";
    }

    return "";
  };

  const isVideoFile = (url) => /\.(mp4|webm|ogg)$/i.test(url?.split("?")[0] || "");

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const normalizeRichTextImageUrl = (src) => {
    if (!src || src === "undefined" || src === null) return "";
    if (src.includes("uploads/https")) return src.substring(src.indexOf("https"));
    if (src.startsWith("http")) return src;
    if (src.startsWith("/job_portal/uploads/")) return `https://sisccltd.com${src}`;
    if (src.startsWith("uploads/")) {
      return `${API_IMAGE_URL.replace(/uploads\/?$/, "")}${src}`;
    }
    return getImageUrl(src);
  };

  const prepareRichTextHtml = (html) => {
    const decoded = decodeHtml(decodeHtml(html || ""));
    const wrapper = document.createElement("div");
    wrapper.innerHTML = decoded;

    wrapper.querySelectorAll("img").forEach((img) => {
      img.src = normalizeRichTextImageUrl(img.getAttribute("src"));
      img.alt = img.getAttribute("alt") || "Company";
      img.loading = "lazy";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";
    });

    return wrapper.innerHTML;
  };

  const hasRichTextContent = (html) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html || "";
    const hasText = wrapper.textContent.trim().length > 0;
    const hasMedia = wrapper.querySelector("img, video, iframe");
    return hasText || Boolean(hasMedia);
  };

  const decodedHtml = prepareRichTextHtml(company?.aboutCompany);
  const decodedHtml1 = prepareRichTextHtml(company?.careerDetail);
  const hasAboutContent = hasRichTextContent(decodedHtml);
  const hasCareerContent = hasRichTextContent(decodedHtml1);

  const EmptyState = ({ message }) => (
    <div className="company-detail-empty-state">
      <i className="fa-regular fa-file-lines" />
      <p>{message}</p>
    </div>
  );

  const renderLink = (label, value) =>
    value ? (
      <a href={value} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>
        {value}
      </a>
    ) : (
      <span className="text-muted">Not Provided</span>
    );

  useEffect(() => {
    const container = careerDetailRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll("img"));
    const cleanup = images.map((img) => {
      const handleError = () => {
        img.style.display = "none";
      };

      img.addEventListener("error", handleError);
      return () => img.removeEventListener("error", handleError);
    });

    return () => cleanup.forEach((removeListener) => removeListener());
  }, [decodedHtml1]);

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
                  crossOrigin="anonymous"
                  src={getImageUrl(company?.coverPhoto)}
                  alt="Image"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultCoverImage;
                  }}
                />
              </div>
              <div className="super-admin-company-short-detail">
                <div className="super-admin-company-logo">
                  <img
                    crossOrigin="anonymous"
                    src={getImageUrl(company?.logo, defaultLogoImage)}
                    alt="Image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultLogoImage;
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
                    {hasAboutContent ? (
                      <div
                        className="company-profile-description"
                        dangerouslySetInnerHTML={{ __html: decodedHtml }}
                      />
                    ) : (
                      <EmptyState message="No company description available." />
                    )}
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
                      {company?.photos?.length ? (
                        company.photos.map((photo) => (
                          <div className="col-lg-3 col-md-4" key={photo._id}>
                            <div className="super-admin-company-office-photos-box">
                              <img
                                crossOrigin="anonymous"
                                src={getImageUrl(photo.url)}
                                alt="Company"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <EmptyState message="No office photos available." />
                        </div>
                      )}
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
                      {company?.videos?.length ? (
                        company.videos.map((video) => {
                          const videoUrl = getVideoUrl(video.url);
                          const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl);

                          return (
                            <div className="col-lg-3 col-md-4" key={video._id}>
                              <div className="super-admin-company-office-video-box">
                                {youtubeEmbedUrl ? (
                                  <iframe
                                    width="100%"
                                    height={150}
                                    src={youtubeEmbedUrl}
                                    title="Company office video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                ) : isVideoFile(videoUrl) ? (
                                  <video width="100%" height={150} controls>
                                    <source src={videoUrl} />
                                  </video>
                                ) : (
                                  <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Open video
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-12">
                          <EmptyState message="No office videos available." />
                        </div>
                      )}
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
                    {hasCareerContent ? (
                      <div
                        ref={careerDetailRef}
                        className="career-detail-display"
                        dangerouslySetInnerHTML={{ __html: decodedHtml1 }}
                      />
                    ) : (
                      <EmptyState message="No career details available." />
                    )}
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
                        {company?.links?.officialWebsite ? (
                          <a
                            href={company.links.officialWebsite}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {company?.brandName || company.links.officialWebsite}
                          </a>
                        ) : (
                          <span className="text-muted">Not Provided</span>
                        )}
                      </h5>
                    </div>
                    <div className="super-admin-company-detail-social-link">
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-linkedin" /> Linkedin
                        </h4>
                        {renderLink("Linkedin", company?.links?.linkedin)}
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-facebook-f" /> facebook
                        </h4>
                        {renderLink("facebook", company?.links?.facebook)}
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-instagram" /> Instagram
                        </h4>
                        {renderLink("Instagram", company?.links?.instagram)}
                      </div>
                      <div className="super-admin-company-detail-social-box">
                        <h4>
                          <i className="fa-brands fa-x-twitter" /> Twitter
                        </h4>
                        {renderLink("Twitter", company?.links?.twitter)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Companydatails;
