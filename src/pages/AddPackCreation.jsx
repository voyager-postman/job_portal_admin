import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function AddPackCreation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const addOnData = state?.packData;
  console.log(addOnData);
  const isEditMode = Boolean(addOnData?._id);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    jobPostingCredits: "",
    jobPostingUnlimited: false, // NEW
    dailyJobPostingLimit: "",
    weeklyJobPostingLimit: "", // NEW
    monthlyJobPostingLimit: "", // NEW
    profileViewingCredits: "",
    profileViewingUnlimited: false, // NEW
    dailyProfileViewingLimit: "",
    weeklyProfileViewingLimit: "", // NEW
    monthlyProfileViewingLimit: "", // NEW
    validityValue: "",
    validityUnit: "",
    price: "",
    currency: "",
    paymentMode: "",
    isOnlinePaymentEnabled: false,
    autoApproval: false,
    isCustom: false,
    maxFeaturedJobs: "",
    featuredJobDurationDays: "",
    featuredJobLocations: [],
    maxActiveFeaturedJobs: "",
    searchBoostScore: "",
    companyProfileHighlightEnabled: false,
    featuredJobsAvailable: false,
  });

  const FEATURED_LOCATION_OPTIONS = [
    {
      value: "Homepage",
      label: "Homepage",
      description: "Job appears on the homepage featured section",
    },
    {
      value: "SearchResults",
      label: "Search Results",
      description: "Higher rank on /jobs search (uses boost score)",
    },
    {
      value: "Highlighted",
      label: "Highlighted",
      description: "Highlighted badge in job listings",
    },
  ];

  const showFeaturedJobsConfig =
    formData.type === "JOB" || formData.type === "BOTH";
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  const fetchGlobalCurrency = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getGlobalCurrency`);

      if (res.data.success) {
        const currencyCode = res.data.data?.code || "MAD";
        const currencySymbol = res.data.data?.symbol || "DH";

        setGlobalCurrency({
          code: currencyCode,
          symbol: currencySymbol,
        });

        // ✅ update this page formData
        setFormData((prev) => ({
          ...prev,
          currency: prev.currency || currencyCode,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGlobalCurrency();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(addOnData);
  useEffect(() => {
    if (addOnData) {
      let derivedType = "";

      if (
        addOnData.jobPostingCredits !== 0 &&
        addOnData.profileViewingCredits !== 0
      ) {
        derivedType = "BOTH";
      } else if (addOnData.jobPostingCredits !== 0) {
        derivedType = "JOB";
      } else if (addOnData.profileViewingCredits !== 0) {
        derivedType = "CV";
      }

      setFormData({
        name: addOnData.packName || "",
        type: derivedType,

        // ✅ JOB
        jobPostingCredits:
          addOnData.jobPostingCredits === -1 ? "" : addOnData.jobPostingCredits,
        jobPostingUnlimited: addOnData.jobPostingCredits === -1,

        dailyJobPostingLimit:
          addOnData.dailyJobPostingLimit === -1
            ? ""
            : addOnData.dailyJobPostingLimit,
        weeklyJobPostingLimit:
          addOnData.weeklyJobPostingLimit === -1
            ? ""
            : addOnData.weeklyJobPostingLimit,
        monthlyJobPostingLimit:
          addOnData.monthlyJobPostingLimit === -1
            ? ""
            : addOnData.monthlyJobPostingLimit,

        // ✅ CV
        profileViewingCredits:
          addOnData.profileViewingCredits === -1
            ? ""
            : addOnData.profileViewingCredits,
        profileViewingUnlimited: addOnData.profileViewingCredits === -1,

        dailyProfileViewingLimit:
          addOnData.dailyProfileViewingLimit === -1
            ? ""
            : addOnData.dailyProfileViewingLimit,
        weeklyProfileViewingLimit:
          addOnData.weeklyProfileViewingLimit === -1
            ? ""
            : addOnData.weeklyProfileViewingLimit,
        monthlyProfileViewingLimit:
          addOnData.monthlyProfileViewingLimit === -1
            ? ""
            : addOnData.monthlyProfileViewingLimit,

        // 🔥 FEATURED JOBS (THIS WAS MISSING)
        maxFeaturedJobs:
          addOnData.maxFeaturedJobs === -1 ? "" : addOnData.maxFeaturedJobs,

        featuredJobDurationDays: addOnData.featuredJobDurationDays || "",

        featuredJobLocations: addOnData.featuredJobLocations || [],
        featuredJobsAvailable: addOnData.featuredJobsAvailable || false,
        maxActiveFeaturedJobs:
          addOnData.maxActiveFeaturedJobs === -1
            ? ""
            : addOnData.maxActiveFeaturedJobs,
        searchBoostScore: addOnData.searchBoostScore
          ? String(addOnData.searchBoostScore)
          : "",

        companyProfileHighlightEnabled:
          addOnData.companyProfileHighlightEnabled || false,

        // ✅ PRICING
        validityValue: addOnData.validityValue || "",
        validityUnit: addOnData.validityUnit || "Month",

        price: addOnData.amount || "",
        currency: addOnData.currency || "",

        paymentMode: addOnData.paymentMode || "",
        isOnlinePaymentEnabled: addOnData.isOnlinePaymentEnabled || false,
        autoApproval: addOnData.autoApproval || false,

        isCustom: addOnData.isCustom || false,
      });
    }
  }, [addOnData]);

  useEffect(() => {
    if (formData.type === "JOB") {
      setFormData((prev) => ({
        ...prev,
        profileViewingCredits: "",
        dailyProfileViewingLimit: "",
      }));
    }

    if (formData.type === "CV") {
      setFormData((prev) => ({
        ...prev,
        jobPostingCredits: "",
        dailyJobPostingLimit: "",
      }));
    }
  }, [formData.type]);
  const handleLocationChange = (location) => {
    setFormData((prev) => {
      const exists = prev.featuredJobLocations.includes(location);
      const featuredJobLocations = exists
        ? prev.featuredJobLocations.filter((loc) => loc !== location)
        : [...prev.featuredJobLocations, location];

      return {
        ...prev,
        featuredJobLocations,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PACK NAME
    if (!formData.name.trim()) {
      toast.error("Pack name is required");
      return;
    }

    // TYPE
    if (!formData.type) {
      toast.error("Please select pack credit type");
      return;
    }

    // ---------------- JOB VALIDATION ----------------
    // ---------------- JOB VALIDATION ----------------
    if (formData.type === "JOB" || formData.type === "BOTH") {
      if (!formData.jobPostingUnlimited) {
        if (
          !formData.jobPostingCredits ||
          Number(formData.jobPostingCredits) <= 0
        ) {
          toast.error("Job Posting Credits must be greater than 0");
          return;
        }

        if (
          !formData.dailyJobPostingLimit ||
          Number(formData.dailyJobPostingLimit) <= 0
        ) {
          toast.error("Daily Job Posting Limit must be greater than 0");
          return;
        }
        if (
          formData.isCustom &&
          (formData.weeklyJobPostingLimit === "" ||
            Number(formData.weeklyJobPostingLimit) < 0)
        ) {
          toast.error("Weekly Job Posting Limit must be 0 or greater");
          return;
        }

        if (
          formData.isCustom &&
          (formData.monthlyJobPostingLimit === "" ||
            Number(formData.monthlyJobPostingLimit) < 0)
        ) {
          toast.error("Monthly Job Posting Limit must be 0 or greater");
          return;
        }
      }
    }

    // ---------------- CV VALIDATION ----------------
    if (formData.type === "CV" || formData.type === "BOTH") {
      if (!formData.profileViewingUnlimited) {
        if (
          !formData.profileViewingCredits ||
          Number(formData.profileViewingCredits) <= 0
        ) {
          toast.error("Profile Viewing Credits must be greater than 0");
          return;
        }

        if (
          !formData.dailyProfileViewingLimit ||
          Number(formData.dailyProfileViewingLimit) <= 0
        ) {
          toast.error("Daily Profile Viewing Limit must be greater than 0");
          return;
        }

        if (
          formData.isCustom &&
          (formData.weeklyProfileViewingLimit === "" ||
            Number(formData.weeklyProfileViewingLimit) < 0)
        ) {
          toast.error("Weekly Profile Viewing Limit must be 0 or greater");
          return;
        }

        if (
          formData.isCustom &&
          (formData.monthlyProfileViewingLimit === "" ||
            Number(formData.monthlyProfileViewingLimit) < 0)
        ) {
          toast.error("Monthly Profile Viewing Limit must be 0 or greater");
          return;
        }
      }
    }
    // ---------------- FEATURED JOB VALIDATION ----------------
    if (formData.featuredJobsAvailable) {
      if (
        !formData.maxFeaturedJobs ||
        Number(formData.maxFeaturedJobs) <= 0
      ) {
        toast.error(
          "Max Featured Jobs (lifetime cap) must be greater than 0",
        );
        return;
      }

      if (
        !formData.maxActiveFeaturedJobs ||
        Number(formData.maxActiveFeaturedJobs) <= 0
      ) {
        toast.error(
          "Max Active Featured Jobs (simultaneous cap) must be greater than 0",
        );
        return;
      }

      if (
        Number(formData.maxActiveFeaturedJobs) >
        Number(formData.maxFeaturedJobs)
      ) {
        toast.error(
          "Max Active Featured Jobs cannot exceed Max Featured Jobs (lifetime cap)",
        );
        return;
      }

      if (
        !formData.featuredJobDurationDays ||
        Number(formData.featuredJobDurationDays) <= 0
      ) {
        toast.error("Featured Job Duration must be greater than 0");
        return;
      }

      if (
        !formData.featuredJobLocations ||
        formData.featuredJobLocations.length === 0
      ) {
        toast.error("Please select at least one Featured Job location");
        return;
      }

      if (
        formData.featuredJobLocations.includes("SearchResults") &&
        (!formData.searchBoostScore ||
          ![1, 2, 3].includes(Number(formData.searchBoostScore)))
      ) {
        toast.error(
          "Search Boost Score (x1, x2, or x3) is required when Search Results is enabled",
        );
        return;
      }
    }

    // ---------------- VALIDITY VALIDATION ----------------
    if (!formData.isCustom) {
      if (!formData.validityValue || Number(formData.validityValue) <= 0) {
        toast.error("Validity value must be greater than 0");
        return;
      }
    }
    if (!formData.validityUnit) {
      toast.error("Please select validity unit");
      return;
    }
    if (!formData.paymentMode) {
      toast.error("Please select payment mode");
      return;
    }
    if (!formData.currency) {
      toast.error("Please select currency");
      return;
    }
    // ---------------- PRICE VALIDATION ----------------

    // ---------------- PRICE VALIDATION ----------------
    if (formData.paymentMode === "online") {
      if (!formData.price || Number(formData.price) <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }
    }

    // ---------------- PAYMENT MODE ----------------

    if (!formData.validityValue) {
      toast.error("Validity value is required");
      return;
    }

    if (!formData.currency) {
      toast.error("Currency is required");
      return;
    }
    // ✅ Decide API URL (Create vs Update)
    const url = isEditMode
      ? `${API_BASE_URL}pack/${addOnData._id}`
      : `${API_BASE_URL}pack`;

    const payload = {
      packName: formData.name,
      isCustom: formData.isCustom,
      featuredJobsAvailable: formData.featuredJobsAvailable,

      // ✅ JOB
      jobPostingCredits: formData.jobPostingUnlimited
        ? -1
        : Number(formData.jobPostingCredits),

      dailyJobPostingLimit: formData.jobPostingUnlimited
        ? -1
        : Number(formData.dailyJobPostingLimit),

      weeklyJobPostingLimit: formData.jobPostingUnlimited
        ? -1
        : Number(formData.weeklyJobPostingLimit) || 0,

      monthlyJobPostingLimit: formData.jobPostingUnlimited
        ? -1
        : Number(formData.monthlyJobPostingLimit) || 0,

      // ✅ CV
      profileViewingCredits: formData.profileViewingUnlimited
        ? -1
        : Number(formData.profileViewingCredits),

      dailyProfileViewingLimit: formData.profileViewingUnlimited
        ? -1
        : Number(formData.dailyProfileViewingLimit),

      weeklyProfileViewingLimit: formData.profileViewingUnlimited
        ? -1
        : Number(formData.weeklyProfileViewingLimit) || 0,

      monthlyProfileViewingLimit: formData.profileViewingUnlimited
        ? -1
        : Number(formData.monthlyProfileViewingLimit) || 0,

      // FEATURED
      maxFeaturedJobs: formData.featuredJobsAvailable
        ? Number(formData.maxFeaturedJobs)
        : 0,
      featuredJobDurationDays: formData.featuredJobsAvailable
        ? Number(formData.featuredJobDurationDays)
        : 0,
      maxActiveFeaturedJobs: formData.featuredJobsAvailable
        ? Number(formData.maxActiveFeaturedJobs)
        : 0,
      featuredJobLocations: formData.featuredJobsAvailable
        ? formData.featuredJobLocations
        : [],
      searchBoostScore: formData.featuredJobsAvailable
        ? Number(formData.searchBoostScore) || 1
        : 1,
      companyProfileHighlightEnabled: formData.featuredJobsAvailable
        ? formData.companyProfileHighlightEnabled
        : false,

      // VALIDITY
      validityValue: formData.validityValue
        ? Number(formData.validityValue)
        : 0,

      validityUnit: formData.validityUnit || "Month",

      currency: formData.currency || "USD",
      amount: formData.price ? Number(formData.price) : 0,
      paymentMode: formData.paymentMode,

      isOnlinePaymentEnabled: formData.isCustom
        ? false
        : formData.isOnlinePaymentEnabled,

      autoApproval: formData.isCustom ? false : formData.autoApproval,
    };
    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        isEditMode
          ? "Subscription Pack updated successfully ✅"
          : "Subscription Pack created successfully 🎉",
      );

      setTimeout(() => {
        navigate("/admin/super-admin-pack-creations");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Subscription Pack`,
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Package Management</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-pack-creations">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {isEditMode ? "Update Package" : "Create New Package"}
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* PACK NAME */}
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label> Pack Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Pack Name"
                  />
                </div>
              </div>

              {/* TYPE */}
              {/* PACK CATEGORY */}
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Pack Category</label>
                  <select
                    className="form-select form-control"
                    value={formData.isCustom ? "CUSTOM" : "NORMAL"}
                    onChange={(e) => {
                      const isCustomSelected = e.target.value === "CUSTOM";

                      setFormData((prev) => ({
                        ...prev,
                        isCustom: isCustomSelected,
                        paymentMode: isCustomSelected ? "manual" : "",
                        isOnlinePaymentEnabled: false,
                        currency: prev.currency || "USD",
                        autoApproval: false,
                        price: isCustomSelected ? "" : prev.price,
                        validityValue: isCustomSelected
                          ? ""
                          : prev.validityValue,
                      }));
                    }}
                  >
                    <option value="NORMAL">Standard / Premium</option>
                    <option value="CUSTOM">PRO / Custom (Enterprise)</option>
                  </select>
                </div>
              </div>

              {formData.isCustom ? (
                <>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Select Type Of Credits</label>
                      <select
                        className="form-select form-control"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        <option value="JOB">Job Posting Credits</option>
                        <option value="CV">Profile Viewing Credits</option>
                        <option value="BOTH">Job + Profile Credits</option>
                      </select>
                    </div>
                  </div>
                  {(formData.type === "JOB" || formData.type === "BOTH") && (
                    <>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Job Posting Credits</label>

                          <input
                            type="number"
                            className="form-control"
                            name="jobPostingCredits"
                            value={
                              formData.jobPostingUnlimited
                                ? ""
                                : formData.jobPostingCredits
                            }
                            disabled={formData.jobPostingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Job Posting Credits"
                          />

                          <div className="form-check mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={formData.jobPostingUnlimited}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jobPostingUnlimited: e.target.checked,
                                  jobPostingCredits: e.target.checked ? -1 : "",
                                }))
                              }
                            />
                            <label className="form-check-label ms-2">
                              Unlimited
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Daily Job Posting Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="dailyJobPostingLimit"
                            value={formData.dailyJobPostingLimit}
                            disabled={formData.jobPostingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Daily Job Posting Limit"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Weekly Job Posting Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="weeklyJobPostingLimit"
                            value={formData.weeklyJobPostingLimit}
                            disabled={formData.jobPostingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Weekly Limit"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Monthly Job Posting Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="monthlyJobPostingLimit"
                            value={formData.monthlyJobPostingLimit}
                            disabled={formData.jobPostingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Monthly Limit"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.type === "CV" || formData.type === "BOTH") && (
                    <>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Profile Viewing Credits</label>

                          <input
                            type="number"
                            className="form-control"
                            name="profileViewingCredits"
                            value={
                              formData.profileViewingUnlimited
                                ? ""
                                : formData.profileViewingCredits
                            }
                            disabled={formData.profileViewingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Profile Viewing Credits"
                          />

                          <div className="form-check mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={formData.profileViewingUnlimited}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  profileViewingUnlimited: e.target.checked,
                                  profileViewingCredits: e.target.checked
                                    ? -1
                                    : "",
                                }))
                              }
                            />
                            <label className="form-check-label ms-2">
                              Unlimited
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Daily Profile Viewing Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="dailyProfileViewingLimit"
                            value={formData.dailyProfileViewingLimit}
                            disabled={formData.profileViewingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Daily Profile Viewing Limit"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Weekly Profile Viewing Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="weeklyProfileViewingLimit"
                            value={formData.weeklyProfileViewingLimit}
                            disabled={formData.profileViewingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Weekly Limit"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Monthly Profile Viewing Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="monthlyProfileViewingLimit"
                            value={formData.monthlyProfileViewingLimit}
                            disabled={formData.profileViewingUnlimited}
                            onChange={handleChange}
                            placeholder="Enter Monthly Limit"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>Select Type Of Credits</label>
                      <select
                        className="form-select form-control"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        <option value="JOB">Job Posting Credits</option>
                        <option value="CV">Profile Viewing Credits</option>
                        <option value="BOTH">Job + Profile Credits</option>
                      </select>
                    </div>
                  </div>

                  {(formData.type === "JOB" || formData.type === "BOTH") && (
                    <>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Job Posting Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            name="jobPostingCredits"
                            value={formData.jobPostingCredits}
                            onChange={handleChange}
                            placeholder="Enter Job Posting Credits"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Daily Job Posting Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="dailyJobPostingLimit"
                            value={formData.dailyJobPostingLimit}
                            onChange={handleChange}
                            placeholder="Enter Daily Job Posting Limit"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.type === "CV" || formData.type === "BOTH") && (
                    <>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Profile Viewing Credits</label>
                          <input
                            type="number"
                            className="form-control"
                            name="profileViewingCredits"
                            value={formData.profileViewingCredits}
                            onChange={handleChange}
                            placeholder="Enter Profile Viewing Credits"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Daily Profile Viewing Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="dailyProfileViewingLimit"
                            value={formData.dailyProfileViewingLimit}
                            onChange={handleChange}
                            placeholder="Enter Daily Profile Viewing Limit"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {showFeaturedJobsConfig && (
                <>
                  <div className="col-lg-12 mt-3">
                    <hr />
                    <h5>Featured Jobs Configuration</h5>
                    <p className="text-muted small mb-0">
                      Control where featured jobs appear and how many a company
                      can feature at once. Homepage only shows jobs when
                      &quot;Homepage&quot; is selected. Search boost applies
                      only when &quot;Search Results&quot; is selected.
                    </p>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <div className="form-group d-flex align-items-center justify-content-between">
                      <label className="mb-0">Enable Featured Jobs</label>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.featuredJobsAvailable}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              featuredJobsAvailable: e.target.checked,
                              ...(e.target.checked
                                ? {}
                                : {
                                    maxFeaturedJobs: "",
                                    maxActiveFeaturedJobs: "",
                                    featuredJobDurationDays: "",
                                    featuredJobLocations: [],
                                    searchBoostScore: "",
                                    companyProfileHighlightEnabled: false,
                                  }),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {formData.featuredJobsAvailable && (
                    <>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            Max Featured Jobs{" "}
                            <small className="text-muted">(lifetime cap)</small>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="maxFeaturedJobs"
                            value={formData.maxFeaturedJobs}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 20 — total times company can feature jobs"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            Max Active Featured Jobs{" "}
                            <small className="text-muted">
                              (simultaneous cap)
                            </small>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="maxActiveFeaturedJobs"
                            value={formData.maxActiveFeaturedJobs}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 2 — max featured jobs active at once"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Featured Job Duration (Days)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="featuredJobDurationDays"
                            value={formData.featuredJobDurationDays}
                            onChange={handleChange}
                            min="1"
                            placeholder="e.g. 30 — days each placement stays active"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Featured Job Locations</label>
                          {FEATURED_LOCATION_OPTIONS.map(
                            ({ value, label, description }) => (
                              <div key={value} className="form-check mb-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`featured-loc-${value}`}
                                  checked={formData.featuredJobLocations?.includes(
                                    value,
                                  )}
                                  onChange={() => handleLocationChange(value)}
                                />
                                <label
                                  className="form-check-label ms-2"
                                  htmlFor={`featured-loc-${value}`}
                                >
                                  <strong>{label}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {description}
                                  </small>
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Search Boost Score</label>
                          <select
                            className="form-select form-control"
                            name="searchBoostScore"
                            value={formData.searchBoostScore}
                            onChange={handleChange}
                          >
                            <option value="">Select boost level</option>
                            <option value="1">x1 — Standard priority</option>
                            <option value="2">x2 — Higher priority</option>
                            <option value="3">x3 — Highest priority</option>
                          </select>
                          <small className="text-muted">
                            Applied on /jobs search when Search Results is
                            enabled
                          </small>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="form-group d-flex align-items-center justify-content-between">
                          <label className="mb-0">
                            Company Profile Highlight
                          </label>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={formData.companyProfileHighlightEnabled}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  companyProfileHighlightEnabled:
                                    e.target.checked,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* VALIDITY VALUE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Validity Value</label>
                  <input
                    type="number"
                    className="form-control"
                    name="validityValue"
                    value={formData.validityValue}
                    onChange={handleChange}
                    placeholder="Enter Validity Number"
                  />
                </div>
              </div>

              {/* VALIDITY UNIT */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Validity Unit</label>
                  <select
                    className="form-select form-control"
                    name="validityUnit"
                    value={formData.validityUnit}
                    onChange={handleChange}
                  >
                    <option value="">Select Unit</option>
                    <option value="Day">Days</option>
                    <option value="Month">Months</option>
                    <option value="Year">Years</option>
                  </select>
                </div>
              </div>

              {/* CURRENCY */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    className="form-select form-control"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    <option value={globalCurrency.code}>
                      {globalCurrency.code} ({globalCurrency.symbol})
                    </option>
                  </select>
                </div>
              </div>

              {/* PRICE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Price ({globalCurrency.code})</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                  />
                </div>
              </div>

              {/* PAYMENT MODE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Payment Mode</label>
                  <select
                    className="form-select form-control"
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="online">Online</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
              {formData.paymentMode === "online" && (
                <div className="col-lg-6 col-md-6">
                  <div className="form-group d-flex align-items-center justify-content-between">
                    <label className="mb-0">Enable Online Payment</label>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.isOnlinePaymentEnabled}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isOnlinePaymentEnabled: e.target.checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData.isOnlinePaymentEnabled && (
                <div className="col-lg-6 col-md-6">
                  <div className="form-group d-flex align-items-center justify-content-between">
                    <label className="mb-0">
                      Auto Approve & Instant Credits
                    </label>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.autoApproval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            autoApproval: e.target.checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* BUTTON */}
              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info text-center">
                  <button
                    type="button"
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update Details" : "Save Details"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AddPackCreation;
