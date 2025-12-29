import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
function AdOnPackCreateForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const addOnData = state?.addOnData;
  console.log(addOnData);
  const isEditMode = Boolean(addOnData?._id);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    credits: "",
    dailyLimit: "",
    validityValue: "",
    validityUnit: "",
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
      setFormData({
        name: addOnData.name || "",
        type: addOnData.type || "",
        credits:
          addOnData.type === "JOB"
            ? addOnData.jobPostingCredits
            : addOnData.type === "PROFILE"
            ? addOnData.profileViewingCredits
            : addOnData.jobPostingCredits + addOnData.profileViewingCredits,
        dailyLimit:
          addOnData.type === "JOB"
            ? addOnData.dailyJobPostingLimit
            : addOnData.type === "PROFILE"
            ? addOnData.dailyProfileViewingLimit
            : addOnData.dailyJobPostingLimit +
              addOnData.dailyProfileViewingLimit,
        validityValue: addOnData.validityValue || "",
        validityUnit: addOnData.validityUnit || "Month",
        price: addOnData.price || "",
        currency: addOnData.currency || "",
        paymentMode: addOnData.paymentMode || "",
      });
    }
  }, [addOnData]);
  /* =========================
     FETCH DATA FOR UPDATE
  ========================== */

  /* =========================
     SUBMIT FORM
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔔 Frontend validation
    if (
      !formData.name ||
      !formData.type ||
      !formData.credits ||
      !formData.dailyLimit ||
      !formData.validityValue ||
      !formData.validityUnit ||
      !formData.price ||
      !formData.currency ||
      !formData.paymentMode
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}createAddOn`,
        {
          name: formData.name,
          type: formData.type,
          credits: Number(formData.credits),
          dailyLimit: Number(formData.dailyLimit),
          validityValue: Number(formData.validityValue),
          validityUnit: formData.validityUnit,
          price: Number(formData.price),
          currency: formData.currency,
          paymentMode: formData.paymentMode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Add-On Pack created successfully 🎉");
      navigate("/admin/super-admin-add-on-pack-created-list");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create Add-On Pack"
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
                    <option value="PROFILE">Profile Viewing Credits</option>
                    <option value="BOTH">Job + Profile Credits</option>
                  </select>
                </div>
              </div>

              {/* CREDITS */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="number"
                    className="form-control"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    placeholder="Enter Credits"
                  />
                </div>
              </div>

              {/* DAILY LIMIT */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Daily Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    name="dailyLimit"
                    value={formData.dailyLimit}
                    onChange={handleChange}
                    placeholder="Enter Daily Limit"
                  />
                </div>
              </div>

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
                    <option value="Offline">Offline</option>
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

export default AdOnPackCreateForm;
