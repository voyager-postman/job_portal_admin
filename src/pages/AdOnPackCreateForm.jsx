import { Link, useNavigate } from "react-router-dom";
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
  const isEditMode = Boolean(addOnData?._id);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    jobPostingCredits: "",
    profileViewingCredits: "",
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

        jobPostingCredits: addOnData.jobPostingCredits || "",
        dailyJobPostingLimit: addOnData.dailyJobPostingLimit || "",
        profileViewingCredits: addOnData.profileViewingCredits || "",
        dailyProfileViewingLimit: addOnData.dailyProfileViewingLimit || "",

        price: addOnData.price || "",
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
      !formData.price ||
      !formData.currency ||
      !formData.paymentMode
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    const url = isEditMode
      ? `${API_BASE_URL}updateAddOn/${addOnData._id}`
      : `${API_BASE_URL}createAddOn`;

    try {
      await axios.post(
        url,
        {
          name: formData.name,
          type: formData.type,

          jobPostingCredits:
            formData.type === "JOB" || formData.type === "BOTH"
              ? Number(formData.jobPostingCredits)
              : 0,

          profileViewingCredits:
            formData.type === "CV" || formData.type === "BOTH"
              ? Number(formData.profileViewingCredits)
              : 0,

          validityValue: Number(formData.validityValue),
          validityUnit: formData.validityUnit,
          price: Number(formData.price),

          // keep these if backend allows
          currency: formData.currency,
          paymentMode: formData.paymentMode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(
        isEditMode
          ? "Add-On Pack updated successfully ✅"
          : "Add-On Pack created successfully 🎉",
      );

      navigate("/admin/super-admin-add-on-pack-created-list");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Add-On Pack`,
      );
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Add-On Package</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/super-admin-add-on-pack-created-list">
              <i className="fa-solid fa-angles-left" />
            </Link>
            {isEditMode ? "Update Add-On Package" : "Create Add-On Package"}
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
                </>
              )}

              {/* CURRENCY */}
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

                    {/* Dynamic Currency from Admin */}
                    <option value={globalCurrency.code}>
                      {globalCurrency.code} ({globalCurrency.symbol})
                    </option>
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

export default AdOnPackCreateForm;
