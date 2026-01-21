<<<<<<< HEAD
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useLocation, Link } from "react-router-dom";

const CandinatesDetails = () => {
  const location = useLocation();
  const candidateProfileId = location?.state?.candidateProfileId;
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);

  console.log("Received ID:", candidateProfileId);
  useEffect(() => {
    console.log("useEffect triggered:", candidateProfileId);

    if (candidateProfileId) {
      fetchCandidateDetails(candidateProfileId);
    }
  }, [candidateProfileId]);

  const fetchCandidateDetails = async (id) => {
    try {
      setLoading(true);
      // ✔ GET request
      // ✔ No headers
      const res = await axios.post(`${API_BASE_URL}admin/jobseekers/${id}`);

      console.log("API Response:", res.data?.data?.[0]);
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
          <div className="super-admin-candidate-profile-detail">
            <div className="super-admin-candidate-img-short-detail">
              <div className="super-admin-candidate-img">
                <img
                  crossorigin="anonymous"
                  src={getImageUrl(candidate?.userId?.profileImage)}
                  alt="Candidate"
                />
              </div>
              <div className="super-admin-candidate-short-detail">
                <h3>
                  <strong>Name:</strong>
                  {candidate?.userId?.first_name
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()) ||
                    "Not Provided"}{" "}
                  {candidate?.userId?.last_name
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </h3>
                <h3>
                  <strong>Position:</strong>{" "}
                  {candidate?.aboutRole?.jobTitle
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()) ||
                    "Not Provided"}{" "}
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
                  {candidate?.userId?.city
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()) ||
                    "Not Provided"}{" "}
                </h3>
              </div>
            </div>
            <div className="super-admin-candidate-profile-summary">
              <h4>Professional Summary</h4>
              <p>{candidate?.professionalSummary}</p>
            </div>
            <div className="super-admin-candidate-profile-summary">
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
            </div>
            <div className="super-admin-candidate-profile-summary">
              <h4>About your role</h4>
              <ul>
                <li>
                  <h5>Job title</h5>
                  <p>
                    {candidate?.aboutRole?.jobTitle
                      ?.toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) ||
                      "Not Provided"}{" "}
                  </p>
                </li>
                <li>
                  <h5>Years of experience</h5>
                  <p>{candidate?.aboutRole?.yearOfExperience} Years</p>
                </li>
                <li>
                  <h5>Job category</h5>
                  <p>
                    {candidate?.aboutRole?.jobCategory
                      ?.toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase()) ||
                      "Not Provided"}{" "}
                  </p>
                </li>
              </ul>
            </div>
            {/*    <div class="super-admin-candidate-profile-summary">
=======
const CandinatesDetails = () => {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Candidate Profile</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>Candidate Profile Details</h5>
        </div>
        <div className="super-admin-candidate-profile-detail">
          <div className="super-admin-candidate-img-short-detail">
            <div className="super-admin-candidate-img">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`}
                alt="Candidate"
              />
            </div>
            <div className="super-admin-candidate-short-detail">
              <h3>
                <strong>Name:</strong> Andy Smith
              </h3>
              <h3>
                <strong>Position:</strong>Website Desginer
              </h3>
              <h3>
                <strong>Email:</strong> andysmith@gmail.com
              </h3>
              <h3>
                <strong>Contact:</strong> +567 908 234 875
              </h3>
              <h3>
                <strong>Address:</strong> New York, USA
              </h3>
            </div>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Professional Summary</h4>
            <p>
              A talented professional with an academic background in IT and
              proven commercial development experience as C++ developer since
              1999. Has a sound knowledge of the software development life
              cycle. Was involved in more than 140 software development
              outsourcing projects.
            </p>
            <p>
              Programming Languages: C/C++, .NET C++, Python, Bash, Shell, PERL,
              Python, Angular, React, Node.js, Vue.js, Gatsby, Regular
              expressions Active-script.
            </p>
          </div>
          <div className="super-admin-candidate-profile-summary">
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
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>About your role</h4>
            <ul>
              <li>
                <h5>Job title</h5>
                <p>Website Designer</p>
              </li>
              <li>
                <h5>Years of experience</h5>
                <p>3 Years</p>
              </li>
              <li>
                <h5>Job category</h5>
                <p>Software Engineering / Web Development</p>
              </li>
            </ul>
          </div>
          {/*    <div class="super-admin-candidate-profile-summary">
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
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
<<<<<<< HEAD
            <div className="super-admin-candidate-profile-summary">
              <h4>Work Experience</h4>

              {candidate?.workHistory && candidate.workHistory.length > 0 ? (
                candidate.workHistory.map((work) => {
                  const startDate = new Date(work.startDate);
                  const endDate = work.currentlyWorkingHere
                    ? "Until now"
                    : new Date(work.endDate);

                  // Format date
                  const formattedStart = `${startDate.toLocaleString(
                    "default",
                    {
                      month: "short",
                    }
                  )} ${startDate.getFullYear()}`;

                  const formattedEnd = work.currentlyWorkingHere
                    ? "Until now"
                    : `${endDate.toLocaleString("default", {
                        month: "short",
                      })} ${endDate.getFullYear()}`;

                  return (
                    <div key={work._id} className="work-history-block">
                      <ul>
                        {/* Job Title */}
                        <li>
                          <h5>
                            {work.jobTitle
                              ?.toLowerCase()
                              .replace(/^\w/, (c) => c.toUpperCase()) ||
                              "Not Provided"}
                          </h5>

                          {/* Duration */}
                          <p>
                            {formattedStart} - {formattedEnd}
                          </p>
                        </li>

                        {/* Company + Location + Type (Only if NOT anonymous) */}
                        {!work.keep_employer_anonymous && (
                          <li>
                            <h5>
                              {work.companyName || "Company Not Provided"}
                            </h5>
                            <p>
                              {work.workLocation || "Location not specified"},{" "}
                              {work.EmploymentType ||
                                "Employment type not specified"}
                            </p>
                          </li>
                        )}

                        <li />
                      </ul>

                      {/* Description */}
                      {work.Description && (
                        <>
                          <h5>Description</h5>
                          <p>{work.Description}</p>
                        </>
                      )}

                      {/* Salary Section */}
                      {/* {work.currentSalary && (
                      <>
                        <h5>Position Salary (Gross)</h5>

                        <p>
                          <strong>Salary:</strong> {work.currentSalary.amount}{" "}
                          {work.currentSalary.currency}
                        </p>

                        <p>
                          <strong>Payroll Frequency:</strong>{" "}
                          {work.currentSalary.payrollFrequency}
                        </p>
                      </>
                    )} */}
                    </div>
                  );
                })
              ) : (
                <p>No work experience available</p>
              )}
            </div>

            {/* 🟢 Salary Section (Dynamic) */}
            <div className="super-admin-candidate-profile-summary">
              <h4>Position Salary (Gross)</h4>

              {candidate?.workHistory?.length > 0 ? (
                candidate.workHistory.map((work, idx) => (
                  <ul
                    key={idx}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <li>
                      <h5>Salary</h5>
                      <p>
                        {work?.currentSalary?.amount}{" "}
                        {work?.currentSalary?.currency}
                      </p>
                    </li>

                    <li>
                      <h5>Payroll Frequency</h5>
                      <p>{work?.currentSalary?.payrollFrequency}</p>
                    </li>
                  </ul>
                ))
              ) : (
                <p>No work history available</p>
              )}
            </div>

            <div className="super-admin-candidate-profile-summary">
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

                  const formattedDegree = edu.degree
                    ? edu.degree
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase())
                    : "Not Provided";

                  const formattedUniversity = edu.University
                    ? edu.University.toLowerCase().replace(/^\w/, (c) =>
                        c.toUpperCase()
                      )
                    : "Not Provided";

                  return (
                    <div key={edu._id} className="education-item">
                      <ul>
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

            <div className="super-admin-candidate-profile-summary">
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

            <div className="super-admin-candidate-profile-summary">
              <h4>Languages</h4>

              <ul>
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

            <div className="super-admin-candidate-profile-summary">
              <h4>Certificates</h4>

              <ul>
                {candidate?.certificates &&
                candidate.certificates.length > 0 ? (
                  candidate.certificates.map((cert) => {
                    const formattedTitle = cert.title
                      ? cert.title
                          .toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())
                      : "Not Provided";

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
=======
          <div className="super-admin-candidate-profile-summary">
            <h4>Work Experience</h4>
            <ul>
              <li>
                <h5>Website Designer</h5>
                <p>Feb 2020 - Until now</p>
              </li>
              <li>
                <h5>Agriculture PVT LTD</h5>
                <p>United States, TN, Cordova, Frence</p>
              </li>
              <li />
            </ul>
            <h5>Description</h5>
            <p>
              We are a dynamic agricultural products, farming, and service
              company committed to meeting the diverse needs of farmers,
              wholesale markets, traders, exportersWe are a dynamic agricultural
              products, farming, and service company committed to meeting the
              diverse needs of farmers, wholesale markets, traders, exportersWe
              are a dynamic agricultural products, farming, and service company
              committed to meeting the diverse needs of farmers, wholesale
              markets, traders, exporters
            </p>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Position Salary(Gross)</h4>
            <ul>
              <li>
                <h5>Salary</h5>
                <p>2000 $</p>
              </li>
              <li>
                <h5>Payroll frequency</h5>
                <p>Monthly</p>
              </li>
              <li />
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Education</h4>
            <ul>
              <li>
                <h5>Degree</h5>
                <p>B.Tech</p>
              </li>
              <li>
                <h5>University</h5>
                <p>IGNU</p>
              </li>
              <li>
                <h5>Start Date</h5>
                <p>05 / 2020</p>
              </li>
              <li>
                <h5>End Date</h5>
                <p>Until now</p>
              </li>
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Skills &amp; Technologies</h4>
            <div className="super-admin-candidate-profile-tags">
              <ul>
                <li>PHP</li>
                <li>PYTHON</li>
                <li>ANDROID</li>
                <li>SEO</li>
                <li>DIGITAL MARKETING</li>
                <li>WEBSITE DESIGN</li>
              </ul>
            </div>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Languages</h4>
            <ul>
              <li>
                <h5>French</h5>
                <p>Native / Bilingual (C2)</p>
              </li>
              <li>
                <h5>English</h5>
                <p>Basic (A1 / A2)</p>
              </li>
              <li />
            </ul>
          </div>
          <div className="super-admin-candidate-profile-summary">
            <h4>Certificates</h4>
            <ul>
              <li>
                <h5>B.Tech</h5>
                <p>Issue Date: 2025</p>
              </li>
              <li>
                <h5>BCA</h5>
                <p>Issue Date: 2021</p>
              </li>
              <li />
            </ul>
          </div>
        </div>
      </div>
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    </>
  );
};

export default CandinatesDetails;
