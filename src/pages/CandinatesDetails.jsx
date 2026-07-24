import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useLocation, Link } from "react-router-dom";
import {
  getCandidateFileList,
  openProtectedFile,
} from "../utils/openProtectedFile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatLabel = (value, fallback = "Not Provided") => {
  if (value == null || value === "") return fallback;
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => formatLabel(item, ""))
      .filter(Boolean)
      .join(", ");
    return joined || fallback;
  }
  if (typeof value === "object") {
    const extracted =
      value.name ?? value.title ?? value.label ?? value.jobTitle ?? value.value;
    return extracted != null ? formatLabel(extracted, fallback) : fallback;
  }
  const str = String(value).trim();
  if (!str) return fallback;
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};

const formatMonthYear = (value, fallback = "Not Provided") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
};

const CandinatesDetails = () => {
  const location = useLocation();
  const candidateProfileId = location?.state?.candidateProfileId;
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [openingFile, setOpeningFile] = useState(null);

  const resumeFiles = getCandidateFileList(candidate, "resume");
  const coverLetterFiles = getCandidateFileList(candidate, "coverLetter");

  const formatUploadedAt = (value) => {
    if (!value) return null;
    return new Date(value).toLocaleString();
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    return "fa-file-lines";
  };

  const handleViewFile = async (type, file) => {
    if (!file?.filename) return;

    // Only pre-open a tab for PDFs (view in browser). Docx downloads directly.
    const isPdf = file.filename.toLowerCase().endsWith(".pdf");
    const previewWindow = isPdf
      ? window.open("about:blank", "_blank", "noopener,noreferrer")
      : null;
    const openingKey = `${type}:${file.id}`;

    try {
      setOpeningFile(openingKey);
      await openProtectedFile(type, file.filename, null, previewWindow);
    } catch (err) {
      previewWindow?.close();
      if (err.status === 429) {
        toast.warn(err.message, { autoClose: 6000 });
      } else if (err.status === 404) {
        toast.error(err.message, { autoClose: 5000 });
      } else {
        toast.error(err.message || "Failed to open file");
      }
    } finally {
      setOpeningFile(null);
    }
  };

  const renderFileList = (files, type, emptyLabel) => {
    if (!files.length) {
      return <p className="mb-0">{emptyLabel}</p>;
    }

    return (
      <ul className="list-unstyled mb-0">
        {files.map((file, index) => {
          const openingKey = `${type}:${file.id}`;
          const isOpening = openingFile === openingKey;

          return (
            <li
              key={file.id}
              className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2 border-bottom"
            >
              <div>
                <strong>
                  {type === "resume" ? "Resume" : "Cover Letter"} {index + 1}
                </strong>
                <br />
                <small className="text-muted">{file.filename}</small>
                {file.uploadedAt && (
                  <>
                    <br />
                    <small className="text-muted">
                      Uploaded: {formatUploadedAt(file.uploadedAt)}
                    </small>
                  </>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={isOpening}
                onClick={() => handleViewFile(type, file)}
              >
                {isOpening ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                    />
                    Opening...
                  </>
                ) : (
                  <>
                    <i className={`fa-solid ${getFileIcon(file.filename)} me-1`} />
                    {file.filename?.toLowerCase().endsWith(".pdf")
                      ? "View"
                      : "Download"}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    if (candidateProfileId) {
      fetchCandidateDetails(candidateProfileId);
    }
  }, [candidateProfileId]);

  const fetchCandidateDetails = async (id) => {
    try {
      setLoading(true);
      // GET request
      // No headers
      const res = await axios.post(`${API_BASE_URL}admin/jobseekers/${id}`);

      setCandidate(res.data?.data?.[0]);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    // Case 1: No image or invalid value
    if (!url || url === "undefined" || url === null) {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    // Case 2: Corrupted URL (contains "/uploads/https")
    if (url.includes("uploads/https")) {
      const httpsPart = url.substring(url.indexOf("https"));
      return httpsPart;
    }

    // Case 3: Absolute external URL (http or https)
    if (url.startsWith("http")) {
      return url;
    }

    // Case 4: Normal local image path
    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="main-dashboard-content d-flex flex-column">
          <div className="super-dashboard-breadcrumb-info">
            <h4>Candidate Profile</h4>
          </div>
          <div className="super-dashboard-common-heading">
            <h5>
              <Link to="/admin/manage-candidates">
                <i className="fa-solid fa-angles-left" />
              </Link>
              Manage Candidate Details
            </h5>
          </div>
          <div className="super-admin-candidate-profile-detail candidate-details-page">
            <div className="super-admin-candidate-img-short-detail">
              <div className="super-admin-candidate-img">
                <img
                  crossOrigin="anonymous"
                  src={getImageUrl(candidate?.userId?.profileImage)}
                  alt="Candidate"
                />
              </div>
              <div className="super-admin-candidate-short-detail">
                <h3>
                  <strong>Name:</strong>
                  {formatLabel(candidate?.userId?.first_name)}{" "}
                  {formatLabel(candidate?.userId?.last_name, "")}
                </h3>
                <h3>
                  <strong>Position:</strong>{" "}
                  {formatLabel(candidate?.aboutRole?.jobTitle)}{" "}
                </h3>
                <h3>
                  <strong>Email:</strong>{" "}
                  {candidate?.userId?.email || "Not Provided"}
                </h3>
                <h3>
                  <strong>Contact:</strong>{" "}
                  {candidate?.userId?.phone || "Not Provided"}
                </h3>
                <h3>
                  <strong>Address:</strong>{" "}
                  {formatLabel(candidate?.userId?.city)}{" "}
                </h3>
              </div>
            </div>
            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Professional Summary</h4>
              <p className="candidate-detail-text">
                {candidate?.professionalSummary || "Not Provided"}
              </p>
            </div>
            {/* <div className="super-admin-candidate-profile-summary">
              <h4>Career Goals</h4>
              <ul>
                <li>
                  <h5>Desired Job Title</h5>
                  <p>
                    {candidate?.career_goals?.DesiredJobTitle?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                </li>
                <li>
                  <h5>Desired Employment Type</h5>
                  <p>
                    {candidate?.career_goals?.DesiredEmploymentType?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                </li>
                <li>
                  <h5>Desired Occupation Type</h5>
                  <p>
                    {candidate?.career_goals?.DesiredOccupationType?.toLowerCase().replace(
                      /^\w/,
                      (c) => c.toUpperCase()
                    ) || "Not Provided"}{" "}
                  </p>
                </li>
              </ul>
            </div> */}
            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Career Goals</h4>
              <ul className="candidate-info-grid">
                <li>
                  <h5>Desired Job Title</h5>
                  <p>
                    {Array.isArray(candidate?.career_goals?.DesiredJobTitle)
                      ? candidate.career_goals.DesiredJobTitle.join(", ")
                      : candidate?.career_goals?.DesiredJobTitle ||
                        "Not Provided"}
                  </p>
                </li>

                <li>
                  <h5>Desired Employment Type</h5>
                  <p>
                    {Array.isArray(
                      candidate?.career_goals?.DesiredEmploymentType,
                    )
                      ? candidate.career_goals.DesiredEmploymentType.join(", ")
                      : candidate?.career_goals?.DesiredEmploymentType ||
                        "Not Provided"}
                  </p>
                </li>

                <li>
                  <h5>Desired Occupation Type</h5>
                  <p>
                    {Array.isArray(
                      candidate?.career_goals?.DesiredOccupationType,
                    )
                      ? candidate.career_goals.DesiredOccupationType.join(", ")
                      : candidate?.career_goals?.DesiredOccupationType ||
                        "Not Provided"}
                  </p>
                </li>
              </ul>
            </div>
            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>About your role</h4>
              <ul className="candidate-info-grid">
                <li>
                  <h5>Job title</h5>
                  <p>{formatLabel(candidate?.aboutRole?.jobTitle)}</p>
                </li>
                <li>
                  <h5>Years of experience</h5>
                  <p>
                    {candidate?.aboutRole?.yearOfExperience != null
                      ? `${candidate.aboutRole.yearOfExperience} Years`
                      : "Not Provided"}
                  </p>
                </li>
                <li>
                  <h5>Job category</h5>
                  <p>{formatLabel(candidate?.aboutRole?.jobCategory)}</p>
                </li>
              </ul>
            </div>
            {/*    <div class="super-admin-candidate-profile-summary">
   <h4>Career Goals</h4> 
   <ul>
    <li>
     <h5>Desired Job Title</h5>
     <p>Website Designer</p>  
    </li>
    <li>
     <h5>Desired Employment Type</h5>
     <p>Permanent contract</p>  
    </li>
    <li>
     <h5>Desired Occupation Type</h5>
     <p>Full-time</p>  
    </li>
   </ul>
   </div> */}
            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Work Experience</h4>

              {candidate?.workHistory && candidate.workHistory.length > 0 ? (
                <div className="candidate-experience-list">
                  {candidate.workHistory.map((work) => {
                    const formattedStart = formatMonthYear(work.startDate);
                    const formattedEnd = work.currentlyWorkingHere
                      ? "Until now"
                      : formatMonthYear(work.endDate);

                    return (
                      <div key={work._id} className="candidate-experience-card">
                        <div className="candidate-experience-header">
                          <div>
                            <h5>{formatLabel(work.jobTitle)}</h5>
                            <p>{formattedStart} - {formattedEnd}</p>
                          </div>

                          {!work.keep_employer_anonymous && (
                            <div>
                              <h5>
                                {work.companyName || "Company Not Provided"}
                              </h5>
                              <p>
                                {work.workLocation || "Location not specified"}
                                {" | "}
                                {work.EmploymentType ||
                                  "Employment type not specified"}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="candidate-description-block">
                          <h5>Description</h5>
                          <p className="candidate-detail-text">
                            {work.Description || "Not Provided"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="candidate-empty-text">No work experience available</p>
              )}
            </div>

            {/* Salary Section (Dynamic) */}
            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Position Salary (Gross)</h4>

              {candidate?.workHistory?.length > 0 ? (
                <ul className="candidate-info-grid candidate-salary-grid">
                  {candidate.workHistory.map((work, idx) => (
                    <li key={idx}>
                      <h5>{formatLabel(work?.jobTitle, `Position ${idx + 1}`)}</h5>
                      <p>
                        <strong>Salary:</strong>{" "}
                        {work?.currentSalary?.amount
                          ? `${work.currentSalary.amount} ${
                              work.currentSalary.currency || ""
                            }`
                          : "Not Provided"}
                      </p>
                      <p>
                        <strong>Payroll Frequency:</strong>{" "}
                        {work?.currentSalary?.payrollFrequency ||
                          "Not Provided"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="candidate-empty-text">No work history available</p>
              )}
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Education</h4>

              {candidate?.education && candidate.education.length > 0 ? (
                candidate.education.map((edu, index) => {
                  const startDate = edu.startDate
                    ? new Date(edu.startDate)
                    : null;
                  const endDateObj =
                    edu.currentlyStudyingHere || !edu.endDate
                      ? null
                      : new Date(edu.endDate);

                  const formattedDegree = formatLabel(edu.degree);
                  const formattedUniversity = formatLabel(edu.University);

                  return (
                    <div key={edu._id} className="education-item">
                      <ul className="candidate-info-grid">
                        <li>
                          <h5>Degree</h5>
                          <p>{formattedDegree}</p>
                        </li>

                        <li>
                          <h5>University</h5>
                          <p>{formattedUniversity}</p>
                        </li>

                        <li>
                          <h5>Start Date</h5>
                          <p>
                            {startDate
                              ? startDate.toLocaleString("default", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Not Provided"}
                          </p>
                        </li>

                        <li>
                          <h5>End Date</h5>
                          <p>
                            {edu.currentlyStudyingHere
                              ? "Until now"
                              : endDateObj
                                ? `${endDateObj.toLocaleString("default", {
                                    month: "short",
                                  })} ${endDateObj.getFullYear()}`
                                : "Not Provided"}
                          </p>
                        </li>
                      </ul>

                      {/* Divider only between items, not after the last */}
                      {index !== candidate.education.length - 1 && (
                        <div className="candidate-profile-divider-line" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No education information available</p>
              )}
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Skills &amp; Technologies</h4>

              <div className="super-admin-candidate-profile-tags">
                <ul>
                  {candidate?.skills && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))
                  ) : (
                    <li>No skills listed</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Languages</h4>

              <ul className="candidate-info-grid">
                {candidate?.languages && candidate.languages.length > 0 ? (
                  candidate.languages.map((lang) => (
                    <li key={lang._id}>
                      <h5>{lang.language || "Not Provided"}</h5>
                      <p>{lang.proficiency || "Proficiency not specified"}</p>
                    </li>
                  ))
                ) : (
                  <li>No languages listed</li>
                )}
              </ul>
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Resumes / CVs</h4>
              {renderFileList(resumeFiles, "resume", "No resumes uploaded")}
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Cover Letters</h4>
              {renderFileList(
                coverLetterFiles,
                "coverLetter",
                "No cover letters uploaded",
              )}
            </div>

            <div className="super-admin-candidate-profile-summary candidate-summary-card">
              <h4>Certificates</h4>

              <ul className="candidate-info-grid">
                {candidate?.certificates &&
                candidate.certificates.length > 0 ? (
                  candidate.certificates.map((cert) => {
                    const formattedTitle = formatLabel(cert.title);

                    const issueYear = cert.issueDate
                      ? new Date(cert.issueDate).getFullYear()
                      : "Year not available";

                    return (
                      <li key={cert._id}>
                        <h5>{formattedTitle}</h5>
                        <p>Issue Date: {issueYear}</p>
                      </li>
                    );
                  })
                ) : (
                  <li>No certificates available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandinatesDetails;
