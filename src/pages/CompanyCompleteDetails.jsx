import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CompanyCompleteDetails = () => {
  const location = useLocation();
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const companyProfileId = location?.state?.companyProfileId;
  const companyDataId = location?.state?.companyProfileId;
  const companyActiveId = location?.state?.companyProfileId;
  const companyActiveIdSub = location?.state?.companyProfileId;
  const companyDetailsData = location?.state?.companyDetails;

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loadingWelcome, setLoadingWelcome] = useState(false);
  const [welcomePack, setWelcomePack] = useState({
    jobPosting: 0,
    profileViewing: 0,
    dailyJobLimit: 2,
    dailyProfileLimit: 20,
    expiresAt: "",
  });
  const [creditStatus, setCreditStatus] = useState({
    totalJobCredits: 0,
    totalProfileCredits: 0,
    dailyJobLimit: 0,
    dailyProfileLimit: 0,
    jobsUsedToday: 0,
    profilesViewedToday: 0,
    expiresAt: null,
  });
  const [managePack, setManagePack] = useState({
    companyPackId: "",
    addJobCredits: 0,
    addProfileCredits: 0,
    removeJobCredits: 0,
    removeProfileCredits: 0,
    extendDays: 0,
    cancelExpiry: false,
    dailyJobPostingLimit: 0,
    dailyProfileViewingLimit: 0,
  });

  useEffect(() => {
    if (companyProfileId) {
      fetchCreditStatus();
      getCompanyDashboard();
    }
  }, [companyProfileId]);
  const fetchCreditStatus = async () => {
    try {
      if (!companyProfileId) return;

      const res = await axios.get(
        `${API_BASE_URL}credit-status?companyId=${companyProfileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = res.data.data;

      setCreditStatus({
        totalJobCredits: data?.welcomePack?.totalJobCredits ?? 0,
        totalProfileCredits: data?.welcomePack?.totalProfileCredits ?? 0,
        dailyJobLimit: data?.welcomePack?.dailyJobLimit ?? 0,
        dailyProfileLimit: data?.welcomePack?.dailyProfileLimit ?? 0,
        jobsUsedToday: data?.jobsUsedToday ?? 0,
        profilesViewedToday: data?.profilesViewedToday ?? 0,
        expiresAt: data?.welcomePack?.expiresAt ?? null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load credit status");
    }
  };
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const barCanvasRef = useRef(null);
  const barChartRef = useRef(null);
  const lineCanvasRef = useRef(null);
  const lineChartRef = useRef(null);
  const creditCanvasRef = useRef(null);
  const creditChartRef = useRef(null);
  const [activeTab, setActiveTab] = useState("daily");

  // useEffect(() => {
  //   if (!barCanvasRef.current) return;

  //   if (barChartRef.current) {
  //     barChartRef.current.destroy();
  //   }

  //   barChartRef.current = new Chart(barCanvasRef.current, {
  //     type: "bar",
  //     data: {
  //       labels: ["22", "23", "24", "25", "26"],
  //       datasets: [
  //         {
  //           label: "Job Offers",
  //           data: [65, 95, 125, 155, 85],
  //           backgroundColor: "#4f86f7",
  //           borderRadius: 6,
  //           barThickness: 25, // exact px width
  //           maxBarThickness: 30, // limit max
  //           categoryPercentage: 0.6, // spacing between bars
  //           barPercentage: 0.7, // bar width inside category
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: { y: { beginAtZero: true } },
  //     },
  //   });

  //   return () => {
  //     barChartRef.current?.destroy();
  //     barChartRef.current = null;
  //   };
  // }, []);
  useEffect(() => {
    if (!barCanvasRef.current || !dashboardData) return;

    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    const labels = dashboardData.jobGraphData?.map((item) => item.x);
    const values = dashboardData.jobGraphData?.map((item) => item.y);

    barChartRef.current = new Chart(barCanvasRef.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Job Offers",
            data: values,
            backgroundColor: "#4f86f7",
            borderRadius: 6,
            barThickness: 25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: dashboardData?.graphMeta?.max || 10,
          },
        },
      },
    });

    return () => {
      barChartRef.current?.destroy();
    };
  }, [dashboardData]);
  const chartData = dashboardData?.creditGraphs || {};
  // const chartData = {
  //   daily: {
  //     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //     data: [5, 15, 8, 22, 14, 28, 35],
  //   },
  //   weekly: {
  //     labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  //     data: [120, 180, 150, 220],
  //   },
  //   monthly: {
  //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //     data: [400, 520, 480, 600, 750, 900],
  //   },
  // };
  const closeModal = () => {
    setSelectedSubscriber(null);
    setCreditAmount("");
  };
  useEffect(() => {
    if (!lineCanvasRef.current || !chartData[activeTab]) return;

    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    const labels = chartData[activeTab].map((item) => item.x);
    const values = chartData[activeTab].map((item) => item.y);

    lineChartRef.current = new Chart(lineCanvasRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
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
    };
  }, [activeTab, dashboardData]);
  // useEffect(() => {
  //   if (!lineCanvasRef.current) return;

  //   if (lineChartRef.current) {
  //     lineChartRef.current.destroy();
  //   }

  //   lineChartRef.current = new Chart(lineCanvasRef.current, {
  //     type: "line",
  //     data: {
  //       labels: chartData[activeTab].labels,
  //       datasets: [
  //         {
  //           data: chartData[activeTab].data,
  //           borderColor: "#2f80ed",
  //           backgroundColor: "rgba(47,128,237,0.15)",
  //           fill: true,
  //           tension: 0.4,
  //           pointRadius: 5,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       plugins: { legend: { display: false } },
  //       scales: { y: { beginAtZero: true } },
  //     },
  //   });

  //   return () => {
  //     lineChartRef.current?.destroy();
  //     lineChartRef.current = null;
  //   };
  // }, [activeTab]);
  const openManageModal = async () => {
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

      const pack = res.data.data.purchasedPack;

      if (!pack) {
        toast.error("No purchased pack found");
        return;
      }

      setManagePack({
        companyPackId: pack.companyPackId,
        addJobCredits: 0,
        addProfileCredits: 0,
        removeJobCredits: 0,
        removeProfileCredits: 0,
        extendDays: 0,
        cancelExpiry: false,
        dailyJobPostingLimit: pack.dailyJobLimit,
        dailyProfileViewingLimit: pack.dailyProfileLimit,
      });

      setSelectedSubscriber(pack); // to open modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscription");
    }
  };
  const updateSubscription = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}updateCompanyPackAdmin/${managePack.companyPackId}`,
        managePack,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Subscription updated successfully");

      setSelectedSubscriber(null);
      fetchCreditStatus();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscription");
    }
  };
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

      const d = res.data.data.welcomePack;

      setWelcomePack({
        jobPosting: d?.totalJobCredits ?? 0,
        profileViewing: d?.totalProfileCredits ?? 0,
        dailyJobLimit: d?.dailyJobLimit ?? 2,
        dailyProfileLimit: d?.dailyProfileLimit ?? 20,
        expiresAt: d?.expiresAt ? d.expiresAt.slice(0, 10) : "",
        resetDailyUsage: true,
      });

      setShowWelcomeModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Welcome Pack");
    }
  };
  const validateWelcomePack = () => {
    const {
      jobPosting,
      profileViewing,
      dailyJobLimit,
      dailyProfileLimit,
      expiresAt,
    } = welcomePack;

    // Convert to numbers
    const jobCredits = Number(jobPosting);
    const profileCredits = Number(profileViewing);
    const dailyJob = Number(dailyJobLimit);
    const dailyProfile = Number(dailyProfileLimit);

    if (jobCredits < 0 || profileCredits < 0) {
      toast.error("Credits cannot be negative");
      return false;
    }

    if (dailyJob <= 0 || dailyProfile <= 0) {
      toast.error("Daily limits must be greater than 0");
      return false;
    }

    if (jobCredits === 0 && profileCredits === 0) {
      toast.error("At least one credit must be greater than 0");
      return false;
    }

    if (expiresAt) {
      const selectedDate = new Date(expiresAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Expiry date cannot be in the past");
        return false;
      }
    }

    return true;
  };
  const submitWelcomePack = async () => {
    if (!validateWelcomePack()) return;

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
          dailyJobLimit: Number(welcomePack.dailyJobLimit),
          dailyProfileLimit: Number(welcomePack.dailyProfileLimit),
          expiresAt: welcomePack.expiresAt || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Welcome Pack updated successfully");
      setShowWelcomeModal(false);
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
  const getCompanyDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API_BASE_URL}getCompanyDashboard`, {
        params: { companyId: companyProfileId }, // ✅ query parameter
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDashboardData(data?.data || {});
    } catch (error) {
      console.error("Error fetching company dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Company Details</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-recruiter">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Company Details
          </h5>
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
                &nbsp; Company Details
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
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openManageModal(companyDetailsData);
                }}
              >
                Subscription
              </a>
              <Link
                to="/admin/company-details"
                state={{
                  companyProfileId: companyProfileId,
                  companyActiveId: companyActiveId,
                }}
              >
                Company Profile
              </Link>
              <Link
                to="/admin/recruiter-list"
                state={{
                  companyDataId: companyDataId,
                }}
              >
                Recruiters
              </Link>
              <Link
                to="/admin/company-active-job"
                state={{
                  companyActiveId: companyActiveId,
                }}
              >
                Job Posts
              </Link>
              <Link
                to="/admin/employer-subscription"
                state={{
                  companyActiveId: companyActiveIdSub,
                }}
              >
                Subscription Plans
              </Link>
              <Link
                to="/admin/company-purchase-history"
                state={{
                  companyActiveId: companyProfileId,
                }}
              >
                Purchase History
              </Link>
              <Link
                to="/admin/all-invoice-list"
                state={{
                  companyActiveId: companyProfileId,
                }}
              >
                Invoice
              </Link>
            </div>
          </div>
          {/* <div className="company-status-main-area">
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
          </div> */}
          <div className="company-status-main-area">
            <ul>
              <li>
                Company Name:
                <strong> {dashboardData?.brandName}</strong>
              </li>

              <li>
                Status:
                <strong className="color">
                  {dashboardData?.status || "N/A"}
                </strong>
              </li>

              <li>
                Subscription Plan:
                <strong>
                  {" "}
                  {dashboardData?.subscriptionPlan || "No Plan"}{" "}
                </strong>
              </li>
            </ul>
          </div>
          <div className="super-dashboard-common-heading">
            <h5>Performance Overview</h5>
          </div>
          {/* <div className="performance-overview-info-area">
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
          </div> */}

          <div className="job-stat-card-area">
            <div className="job-card-box-area">
              <h4> Global Posting Credits</h4>
              <h5>{dashboardData?.creditsAvailable?.globalJobCredits ?? 0}</h5>
            </div>
            <div className="job-card-box-area">
              <h4> Global Viewing Credits</h4>
              <h5>
                {dashboardData?.creditsAvailable?.globalProfileCredits ?? 0}
              </h5>
            </div>

            <div className="job-card-box-area">
              <h4> Daily Job Usage</h4>
              <h5> {dashboardData?.dailyUsage?.job ?? "0/0"}</h5>
            </div>
            <div className="job-card-box-area">
              <h4> Daily Profile Usage</h4>
              <h5>{dashboardData?.dailyUsage?.profile ?? "0/0"}</h5>
            </div>
            <div className="job-card-box-area">
              <h4> Credit Expiry</h4>
              <h5>
                {dashboardData?.creditExpiry
                  ? new Date(dashboardData.creditExpiry).toLocaleDateString()
                  : "No Expiry"}
              </h5>
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
                      <th>S.No</th>
                      <th>Job Title</th>
                      <th>Recruiter</th>
                      <th>Created Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboardData?.jobSummary?.length > 0 ? (
                      dashboardData.jobSummary.map((job, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{job.jobTitle}</td>
                          <td>{job.recruiter || "-"}</td>
                          <td>
                            {new Date(job.createdDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                job.status === "published"
                                  ? "bg-success"
                                  : job.status === "draft"
                                    ? "bg-warning"
                                    : "bg-secondary"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Jobs Found
                        </td>
                      </tr>
                    )}
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
                      <th>S.No</th>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Description</th>
                      <th>Credits Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.creditUsageHistory?.length > 0 ? (
                      dashboardData.creditUsageHistory.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                          <td>{item.activity}</td>
                          <td>{item.description}</td>
                          <td>{item.creditsUsed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No Credit Usage Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="offer-dwm-cre-chart-area">
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
        </div> */}
      </section>

      {showWelcomeModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Welcome Pack Settings</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowWelcomeModal(false)}
                />
              </div>

              <div className="modal-body">
                {/* Total Job Credits */}
                <div className="mb-3">
                  <label>Total Job Posting Credits</label>
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

                {/* Total Profile Credits */}
                <div className="mb-3">
                  <label>Total Profile Viewing Credits</label>
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

                {/* Daily Job Limit */}
                <div className="mb-3">
                  <label>Daily Job Posting Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={welcomePack.dailyJobLimit}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        dailyJobLimit: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Daily Profile Limit */}
                <div className="mb-3">
                  <label>Daily Profile Viewing Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={welcomePack.dailyProfileLimit}
                    onChange={(e) =>
                      setWelcomePack({
                        ...welcomePack,
                        dailyProfileLimit: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Expiry Date */}
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
                  {loadingWelcome ? "Updating..." : "Update Welcome Pack"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedSubscriber && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                {/* HEADER */}

                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Manage Subscription</h5>

                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedSubscriber(null)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* ADD CREDITS */}
                  <div className="mb-4 p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Email:</strong> {selectedSubscriber?.email}
                        </p>

                        <p>
                          <strong>Plan:</strong> {selectedSubscriber?.packName}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {selectedSubscriber?.active ? "Active" : "Inactive"}
                        </p>

                        <p>
                          <strong>Payment Mode:</strong>{" "}
                          {selectedSubscriber?.paymentMode}
                        </p>
                        <p>
                          <strong>Daily Job Limit:</strong>{" "}
                          {selectedSubscriber?.dailyJobLimit}
                        </p>
                      </div>

                      <div className="col-md-6">
                        <p>
                          <strong>Job Credits:</strong>{" "}
                          {selectedSubscriber?.jobCreditsRemaining}
                        </p>

                        <p>
                          <strong>Profile Credits:</strong>{" "}
                          {selectedSubscriber?.profileCreditsRemaining}
                        </p>

                        <p>
                          <strong>Expires At:</strong>{" "}
                          {selectedSubscriber?.expiresAt
                            ? new Date(
                                selectedSubscriber.expiresAt,
                              ).toLocaleDateString()
                            : "No Expiry"}
                        </p>

                        <p>
                          <strong>Days Left:</strong>{" "}
                          {selectedSubscriber?.daysLeft ?? 0}
                        </p>
                        <p>
                          <strong>Daily Profile Limit:</strong>{" "}
                          {selectedSubscriber?.dailyProfileLimit}
                        </p>
                      </div>
                    </div>

                    {/* Daily Limits */}
                  </div>
                  <div className="card mb-4 shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-primary mb-3">Add Credits</h6>

                      <div className="row">
                        <div className="col-md-6">
                          <label>Job Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.addJobCredits}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                addJobCredits: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Profile Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.addProfileCredits}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                addProfileCredits: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REMOVE CREDITS */}

                  <div className="card mb-4 shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-danger mb-3">Remove Credits</h6>

                      <div className="row">
                        <div className="col-md-6">
                          <label>Remove Job Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.removeJobCredits}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                removeJobCredits: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Remove Profile Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.removeProfileCredits}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                removeProfileCredits: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXTEND PLAN */}

                  <div className="card mb-4 shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-primary mb-3">Extend Subscription</h6>

                      <label>Extend Days</label>

                      <input
                        type="number"
                        className="form-control"
                        value={managePack.extendDays}
                        onChange={(e) =>
                          setManagePack({
                            ...managePack,
                            extendDays: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* CANCEL EXPIRY */}

                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={managePack.cancelExpiry}
                      onChange={(e) =>
                        setManagePack({
                          ...managePack,
                          cancelExpiry: e.target.checked,
                        })
                      }
                    />

                    <label className="form-check-label">
                      Cancel Expiry (Make Unlimited)
                    </label>
                  </div>

                  {/* DAILY LIMITS */}

                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-primary mb-3">Daily Limits</h6>

                      <div className="row">
                        <div className="col-md-6">
                          <label>Daily Job Posting Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.dailyJobPostingLimit}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                dailyJobPostingLimit: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Daily Profile Viewing Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            value={managePack.dailyProfileViewingLimit}
                            onChange={(e) =>
                              setManagePack({
                                ...managePack,
                                dailyProfileViewingLimit: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedSubscriber(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={updateSubscription}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default CompanyCompleteDetails;
