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
    dailyJobPostingLimit: "",
    profileViewingCredits: "",
    dailyProfileViewingLimit: "",
    validityValue: "",
    validityUnit: "Month",
    price: "",
    currency: "",
    paymentMode: "",
  });

  /* =========================
     HANDLE INPUT CHANGE
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (addOnData) {
      // 🔥 Derive type from credits
      let derivedType = "";
      if (
        addOnData.jobPostingCredits > 0 &&
        addOnData.profileViewingCredits > 0
      ) {
        derivedType = "BOTH";
      } else if (addOnData.jobPostingCredits > 0) {
        derivedType = "JOB";
      } else if (addOnData.profileViewingCredits > 0) {
        derivedType = "CV";
      }

      setFormData({
        name: addOnData.packName || "",

        type: derivedType,

        jobPostingCredits: addOnData.jobPostingCredits || "",
        dailyJobPostingLimit: addOnData.dailyJobPostingLimit || "",

        profileViewingCredits: addOnData.profileViewingCredits || "",
        dailyProfileViewingLimit: addOnData.dailyProfileViewingLimit || "",

        validityValue: addOnData.validityValue || "",
        validityUnit: addOnData.validityUnit || "Month",

        price: addOnData.amount || "",
        currency: addOnData.currency || "",

        paymentMode: addOnData.paymentMode || "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Common validation
    if (
      !formData.name ||
      !formData.type ||
      !formData.validityValue ||
      !formData.validityUnit ||
      !formData.price ||
      !formData.currency
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    // 🔴 Job Posting validation
    if (
      (formData.type === "JOB" || formData.type === "BOTH") &&
      (!formData.jobPostingCredits || !formData.dailyJobPostingLimit)
    ) {
      toast.error("Job Posting credits and daily limit are required");
      return;
    }

    // 🔴 Profile Viewing validation
    if (
      (formData.type === "CV" || formData.type === "BOTH") &&
      (!formData.profileViewingCredits || !formData.dailyProfileViewingLimit)
    ) {
      toast.error("Profile Viewing credits and daily limit are required");
      return;
    }

    // ✅ Decide API URL (Create vs Update)
    const url = isEditMode
      ? `${API_BASE_URL}pack/${addOnData._id}`
      : `${API_BASE_URL}pack`;

    // ✅ Backend-compatible payload
    const payload = {
      packName: formData.name,

      jobPostingCredits:
        formData.type === "JOB" || formData.type === "BOTH"
          ? Number(formData.jobPostingCredits)
          : 0,

      dailyJobPostingLimit:
        formData.type === "JOB" || formData.type === "BOTH"
          ? Number(formData.dailyJobPostingLimit)
          : 0,

      profileViewingCredits:
        formData.type === "CV" || formData.type === "BOTH"
          ? Number(formData.profileViewingCredits)
          : 0,

      dailyProfileViewingLimit:
        formData.type === "CV" || formData.type === "BOTH"
          ? Number(formData.dailyProfileViewingLimit)
          : 0,

      validityValue: Number(formData.validityValue),
      validityUnit: formData.validityUnit,

      currency: formData.currency,
      amount: Number(formData.price),
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
          : "Subscription Pack created successfully 🎉"
      );

      navigate("/admin/super-admin-pack-creations");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Subscription Pack`
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add On Pack Creation Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-add-on-pack-created-list">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {isEditMode ? "Update Add On Pack" : "Create New Add On Pack"}
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* PACK NAME */}
              <div className="col-lg-6 col-md-12">
                <div className="form-group">
                  <label>Add-On Pack Name</label>
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
                    <option value="Online">Online</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

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
