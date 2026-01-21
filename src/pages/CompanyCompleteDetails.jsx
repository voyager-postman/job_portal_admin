import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CompanyCompleteDetails = () => {
  const location = useLocation();
  const companyProfileId = location?.state?.companyProfileId;
  const companyDataId = location?.state?.companyProfileId;
  const companyActiveId = location?.state?.companyProfileId;
  const companyActiveIdSub = location?.state?.companyProfileId;
  const companyDetailsData = location?.state?.companyDetails;
  console.log(companyProfileId);
  console.log(companyDataId);
  console.log(companyDetailsData?.companyId?.logo);
  console.log(companyActiveId);
  console.log(companyDetailsData);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loadingWelcome, setLoadingWelcome] = useState(false);
  const [welcomePack, setWelcomePack] = useState({
    jobPosting: 0,
    profileViewing: 0,
    expiresAt: "",
    resetDailyUsage: true,
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const barCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const lineCanvasRef = useRef(null);
  const lineChartRef = useRef(null);
  const creditCanvasRef = useRef(null);
  const creditChartRef = useRef(null);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    if (!barCanvasRef.current) return;

    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    barChartRef.current = new Chart(barCanvasRef.current, {
      type: "bar",
      data: {
        labels: ["22", "23", "24", "25", "26"],
        datasets: [
          {
            label: "Job Offers",
            data: [65, 95, 125, 155, 85],
            backgroundColor: "#4f86f7",
            borderRadius: 6,
            barThickness: 25, // exact px width
            maxBarThickness: 30, // limit max
            categoryPercentage: 0.6, // spacing between bars
            barPercentage: 0.7, // bar width inside category
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => {
      barChartRef.current?.destroy();
      barChartRef.current = null;
    };
  }, []);

  const chartData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [5, 15, 8, 22, 14, 28, 35],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [120, 180, 150, 220],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [400, 520, 480, 600, 750, 900],
    },
  };

  useEffect(() => {
    if (!lineCanvasRef.current) return;

    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    lineChartRef.current = new Chart(lineCanvasRef.current, {
      type: "line",
      data: {
        labels: chartData[activeTab].labels,
        datasets: [
          {
            data: chartData[activeTab].data,
            borderColor: "#2f80ed",
            backgroundColor: "rgba(47,128,237,0.15)",
            fill: true,
            tension: 0.4,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => {
      lineChartRef.current?.destroy();
      lineChartRef.current = null;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!creditCanvasRef.current) return;

    if (creditChartRef.current) {
      creditChartRef.current.destroy();
    }
    creditChartRef.current = new Chart(creditCanvasRef.current, {
      type: "line",
      data: {
        labels: ["2022 Q2", "2022 Q3", "2022 Q4", "2023 Q1"],
        datasets: [
          {
            label: "Credits Used",
            data: [200, 120, 420, 580],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.25)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      creditChartRef.current?.destroy();
      creditChartRef.current = null;
    };
  }, []);

  const openWelcomePackModal = async () => {
    try {
      const companyId = location?.state?.companyProfileId;
      const res = await axios.get(
        `${API_BASE_URL}credit-status?companyId=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const d = res.data.data;
      setWelcomePack({
        jobPosting: d.totalJobPostingCredits,
        profileViewing: d.totalProfileViewingCredits,
        expiresAt: d.expiresAt ? d.expiresAt.slice(0, 10) : null,
        resetDailyUsage: true,
      });

      setShowWelcomeModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Welcome Pack");
    }
  };

  const submitWelcomePack = async () => {
    try {
      setLoadingWelcome(true);
      const companyId =
        companyProfileId ||
        companyActiveId ||
        companyActiveIdSub ||
        companyDataId;

      await axios.post(
        `${API_BASE_URL}admin/company/${companyId}/welcome-pack`,
        {
          jobPosting: Number(welcomePack.jobPosting),
          profileViewing: Number(welcomePack.profileViewing),
          expiresAt: welcomePack.expiresAt,
          resetDailyUsage: welcomePack.resetDailyUsage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setShowWelcomeModal(false);
      toast.success("Welcome Pack updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Welcome Pack");
    } finally {
      setLoadingWelcome(false);
    }
  };

  const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const cleanImageUrl = (url) => {
    // ✅ If no logo → show default image
    if (!url) return DEFAULT_IMAGE;

    // ✅ If already default image
    if (url === DEFAULT_IMAGE) {
      return url;
    }

    // ✅ If URL wrongly contains "/uploads/https"
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Company Details</h4>
        </div>
        <div className="super-dashboard-detail-info">
          <div className="super-dashboard-common-heading">
            <div className="dashboard-common-heading">
              <h5>
                <img
                  crossOrigin="anonymous"
                  src={cleanImageUrl(companyDetailsData?.companyId?.logo)}
                  alt="logo"
                />
                &nbsp; Complete Company Details
              </h5>
            </div>
            <div className="company-button-info-area">
              {companyDetailsData?.companyId?.welcomePackGranted && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openWelcomePackModal();
                  }}
                >
                  Welcome Pack
                </a>
              )}

              <Link
                to="/admin/company-details"
                state={{
                  companyProfileId: companyProfileId,
                  companyActiveId: companyActiveId,
                }}
              >
                Company Details
              </Link>
              <Link
                to="/admin/recruiter-list"
                state={{
                  companyDataId: companyDataId,
                }}
              >
                View Recruiter Accounts
              </Link>
              <Link
                to="/admin/company-active-job"
                state={{
                  companyActiveId: companyActiveId,
                }}
              >
                View Job Offers
              </Link>
              <Link
                to="/admin/employer-subscription"
                state={{
                  companyActiveId: companyActiveIdSub,
                }}
              >
                View Subscription Plans
              </Link>
            </div>
          </div>
          <div className="company-status-main-area">
            <ul>
              <li>
                Company ID:<strong>123456 </strong>
              </li>
              <li>
                Status:<strong className="color">Active</strong>
              </li>
              <li>
                Subscription Plan:<strong>Premium</strong>
              </li>
              <li>
                Credits Available:<strong>350</strong>
              </li>
            </ul>
          </div>
          <div className="super-dashboard-common-heading">
            <h5>Performance Overview</h5>
          </div>
          <div className="performance-overview-info-area">
            <div className="performance-overview-fillter">
              <div className="date-range">
                <h5>Date Range:</h5>
              </div>
              <div className="calendar-filter-area">
                <a href="#">Today</a>
                <a href="#">Last 7 Days</a>
                <a href="#">Last 30 Days</a>
                <a href="#">This Month</a>
                <span>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    monthsShown={2}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy to dd-mm-yyyy"
                    className="form-control Date_Input"
                  />
                </span>
              </div>
            </div>
            <div className="performance-overview-btn">
              <a href="#">Apply Fillter</a>
              <a href="#">Reset</a>
            </div>
          </div>

          <div className="job-stat-card-area">
            <div className="job-card-box-area">
              <h4>Total Job Offers Created</h4>
              <h5>45</h5>
            </div>
            <div className="job-card-box-area">
              <h4>Active Job Offers</h4>
              <h5>18</h5>
              <span>
                <i className="fa-solid fa-arrow-down" /> 10% vs previous period
              </span>
            </div>
            <div className="job-card-box-area">
              <h4>Total CV Views</h4>
              <h5>1,230</h5>
            </div>
            <div className="job-card-box-area">
              <h4>Credits Consumed</h4>
              <h5>120</h5>
            </div>
            <div className="job-card-box-area">
              <h4>Credits Remaining</h4>
              <h5>120</h5>
            </div>
          </div>
        </div>
        <div className="offer-dwm-cre-chart-area">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="offer-created-over-time">
                <div className="chart-container" style={{ height: "300px" }}>
                  <div className="chart-title">
                    Job Offers Created Over Time
                  </div>
                  <canvas ref={barCanvasRef} />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="job-offer-dwm-time-table">
                <h5>Job Offers Summary</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Recruiter</th>
                      <th>Created Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Marketing Manager</td>
                      <td>John Smith</td>
                      <td>05/12/2022</td>
                      <td>
                        <div className="super-admin-toggle-switch">
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Software Engineer</td>
                      <td>Emily Johnson</td>
                      <td>10/01/2023</td>
                      <td>
                        <div className="super-admin-toggle-switch">
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>UI/UX Designer</td>
                      <td>Michael Brown</td>
                      <td>18/02/2023</td>
                      <td>
                        <div className="super-admin-toggle-switch">
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Project Manager</td>
                      <td>Sarah Wilson</td>
                      <td>25/03/2023</td>
                      <td>
                        <div className="super-admin-toggle-switch">
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>QA Engineer</td>
                      <td>David Lee</td>
                      <td>07/04/2023</td>
                      <td>
                        <div className="super-admin-toggle-switch">
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="offer-dwm-cre-chart-area">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="daily-weekly-monthly-chart-area">
                <div className="chart-container" style={{ height: "320px" }}>
                  <div className="tabs">
                    {["daily", "weekly", "monthly"].map((tab) => (
                      <div
                        key={tab}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </div>
                    ))}
                  </div>

                  <canvas ref={lineCanvasRef} />
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="job-offer-dwm-time-table">
                <h5>Credit Usage History</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Description</th>
                      <th>Credits Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>05/14/2022</td>
                      <td>Job Posting</td>
                      <td>Sales Executive</td>
                      <td>20</td>
                    </tr>
                    <tr>
                      <td>10/01/2023</td>
                      <td>Job Posting</td>
                      <td>Software Engineer</td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>18/02/2023</td>
                      <td>Job Posting</td>
                      <td>UI/UX Designer</td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>25/03/2023</td>
                      <td>Job Posting</td>
                      <td>Project Manager</td>
                      <td>25</td>
                    </tr>
                    <tr>
                      <td>07/04/2023</td>
                      <td>Job Posting</td>
                      <td>QA Engineer</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>12/05/2023</td>
                      <td>Job Posting</td>
                      <td>Business Analyst</td>
                      <td>18</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="offer-dwm-cre-chart-area">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="credit-consumption-over-time">
                <div className="chart-container" style={{ height: "300px" }}>
                  <canvas ref={creditCanvasRef} />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="job-offer-dwm-time-table">
                <h5>Recruiter Activity Overview</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Recruiter Name</th>
                        <th>Jobs Posted</th>
                        <th>CV Views</th>
                        <th>Credits Consumed</th>
                        <th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>John Smith</td>
                        <td>12</td>
                        <td>530</td>
                        <td>85</td>
                        <td>05/15/2022</td>
                      </tr>
                      <tr>
                        <td>Emily Johnson</td>
                        <td>8</td>
                        <td>410</td>
                        <td>60</td>
                        <td>10/01/2023</td>
                      </tr>
                      <tr>
                        <td>Michael Brown</td>
                        <td>5</td>
                        <td>275</td>
                        <td>42</td>
                        <td>18/02/2023</td>
                      </tr>
                      <tr>
                        <td>Sarah Wilson</td>
                        <td>10</td>
                        <td>498</td>
                        <td>78</td>
                        <td>25/03/2023</td>
                      </tr>
                      <tr>
                        <td>David Lee</td>
                        <td>6</td>
                        <td>320</td>
                        <td>50</td>
                        <td>07/04/2023</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showWelcomeModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Welcome Pack</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowWelcomeModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>Job Posting Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    value={welcomePack.jobPosting}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        jobPosting: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Profile Viewing Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    value={welcomePack.profileViewing}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        profileViewing: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Expires At</label>
                  <input
                    type="date"
                    className="form-control"
                    value={welcomePack.expiresAt}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        expiresAt: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={welcomePack.resetDailyUsage}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        resetDailyUsage: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label">Reset Daily Usage</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowWelcomeModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={submitWelcomePack}
                  disabled={loadingWelcome}
                >
                  {loadingWelcome ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCompleteDetails;
