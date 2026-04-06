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
    companyProfileHighlightEnabled: false,
    addMoreFeature: false, // ✅ NEW
  });

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
        addMoreFeature: addOnData.featuredJobsAvailable || false,
        maxActiveFeaturedJobs:
          addOnData.maxActiveFeaturedJobs === -1
            ? ""
            : addOnData.maxActiveFeaturedJobs,

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

      return {
        ...prev,
        featuredJobLocations: exists
          ? prev.featuredJobLocations.filter((loc) => loc !== location)
          : [...prev.featuredJobLocations, location],
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
    if (formData.maxFeaturedJobs && Number(formData.maxFeaturedJobs) < -1) {
      toast.error("Max Featured Jobs must be -1 or greater");
      return;
    }

    if (
      formData.featuredJobDurationDays &&
      Number(formData.featuredJobDurationDays) <= 0
    ) {
      toast.error("Featured Job Duration must be greater than 0");
      return;
    }

    if (
      formData.maxActiveFeaturedJobs &&
      Number(formData.maxActiveFeaturedJobs) < -1
    ) {
      toast.error("Max Active Featured Jobs must be -1 or greater");
      return;
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

    // ---------------- FEATURED LOCATION ----------------
    if (
      formData.maxFeaturedJobs > 0 &&
      (!formData.featuredJobLocations ||
        formData.featuredJobLocations.length === 0)
    ) {
      toast.error("Please select at least one Featured Job location");
      return;
    }
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
      featuredJobsAvailable: formData.addMoreFeature,

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
      maxFeaturedJobs: Number(formData.maxFeaturedJobs) || 0,
      featuredJobDurationDays: Number(formData.featuredJobDurationDays) || 0,
      maxActiveFeaturedJobs: Number(formData.maxActiveFeaturedJobs) || 0,

      featuredJobLocations: formData.featuredJobLocations,
      companyProfileHighlightEnabled: formData.companyProfileHighlightEnabled,

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

      navigate("/admin/super-admin-pack-creations");
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
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group d-flex align-items-center justify-content-between">
                      <label className="mb-0">
                        Add More Featured{" "}
                        <span>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.addMoreFeature}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                addMoreFeature: e.target.checked,
                              }))
                            }
                          />
                        </span>
                      </label>
                    </div>
                  </div>{" "}
                  {formData.addMoreFeature && (
                    <>
                      <div className="col-lg-12  mt-3">
                        <hr />
                        <h5>Featured Jobs Configuration</h5>
                      </div>
                      {/* Max Featured Jobs */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Max Featured Jobs</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.maxFeaturedJobs}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                maxFeaturedJobs: e.target.value,
                              })
                            }
                            placeholder="Enter max featured jobs (-1 for unlimited)"
                          />
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Featured Job Duration (Days)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.featuredJobDurationDays}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                featuredJobDurationDays: e.target.value,
                              })
                            }
                            placeholder="Enter duration in days"
                          />
                        </div>
                      </div>
                      {/* Max Active Featured Jobs */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Max Active Featured Jobs</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.maxActiveFeaturedJobs}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                maxActiveFeaturedJobs: e.target.value,
                              })
                            }
                            placeholder="Enter active limit (-1 for unlimited)"
                          />
                        </div>
                      </div>
                      {/* Locations */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Featured Job Locations</label>

                          {["Homepage", "SearchResults", "Highlighted"].map(
                            (loc) => (
                              <div key={loc} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={formData.featuredJobLocations?.includes(
                                    loc,
                                  )}
                                  onChange={() => handleLocationChange(loc)}
                                />
                                <label className="form-check-label ms-2">
                                  {loc}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      {/* Company Highlight Toggle */}
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
                                setFormData({
                                  ...formData,
                                  companyProfileHighlightEnabled:
                                    e.target.checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>{" "}
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
                     <option value="MAD">MAD</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* PRICE */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Price</label>
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
