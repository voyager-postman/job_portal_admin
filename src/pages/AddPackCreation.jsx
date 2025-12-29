import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
function AddPackCreation() {
  const { state } = useLocation();
  const packData = state?.packData;
  console.log(packData); // full row.original object
  const navigate = useNavigate();
  const isEditMode = Boolean(packData?._id);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    packName: "",
    jobPostingCredits: "",
    dailyJobPostingLimit: "",
    profileViewingCredits: "",
    dailyProfileViewingLimit: "",
    validityValue: "",
    validityUnit: "Month",
    currency: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (packData) {
      setFormData({
        packName: packData.packName || "",
        jobPostingCredits: packData.jobPostingCredits || "",
        dailyJobPostingLimit: packData.dailyJobPostingLimit || "",
        profileViewingCredits: packData.profileViewingCredits || "",
        dailyProfileViewingLimit: packData.dailyProfileViewingLimit || "",
        validityValue: packData.validityValue || "",
        validityUnit: packData.validityUnit || "Month",
        currency: packData.currency || "",
        amount: packData.amount || "",
      });
    }
  }, [packData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        packName: formData.packName,
        jobPostingCredits: Number(formData.jobPostingCredits),
        dailyJobPostingLimit: Number(formData.dailyJobPostingLimit),
        profileViewingCredits: Number(formData.profileViewingCredits),
        dailyProfileViewingLimit: Number(formData.dailyProfileViewingLimit),
        validityValue: Number(formData.validityValue),
        validityUnit: formData.validityUnit,
        currency: formData.currency,
        amount: Number(formData.amount),
      };

      if (isEditMode) {
        // 🔄 UPDATE
        await axios.post(`${API_BASE_URL}pack/${packData._id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Subscription pack updated successfully");
      } else {
        // ➕ CREATE
        await axios.post(`${API_BASE_URL}pack`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Subscription pack created successfully");
      }

      navigate("/admin/super-admin-pack-creations");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message || "Failed to save subscription pack";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Pack Creations Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5 className="d-flex align-items-center gap-2">
            <Link to="/admin/super-admin-pack-creations">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {isEditMode ? "Update Pack Details" : "Create Pack Details"}
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Pack Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="packName"
                    placeholder="Pack Name"
                    value={formData.packName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Job Posting Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jobPostingCredits"
                    placeholder="Job Posting Credits"
                    value={formData.jobPostingCredits}
                    onChange={handleChange}
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
                    placeholder="Daily Job Posting Limit"
                    value={formData.dailyJobPostingLimit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Profile Viewing Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    name="profileViewingCredits"
                    placeholder="Profile Viewing Credits"
                    value={formData.profileViewingCredits}
                    onChange={handleChange}
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
                    placeholder="Daily Profile Viewing Limit"
                    value={formData.dailyProfileViewingLimit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group label-info">
                  <label>Validity Period</label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    name="validityValue"
                    placeholder="Enter Number"
                    value={formData.validityValue}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <select
                    className="form-select form-control"
                    name="validityUnit"
                    value={formData.validityUnit}
                    onChange={handleChange}
                  >
                    <option value="Month">Month</option>
                    <option value="Year">Year</option>
                    <option value="Day">Day</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group label-info">
                  <label>Currency</label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <select
                    className="form-select form-control"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      placeholder="Enter Amount"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="super-dashboard-content-btn-info">
                  <button
                    type="button"
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isEditMode
                      ? "Update Details"
                      : "Save Details"}
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
