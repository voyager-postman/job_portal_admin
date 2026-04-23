import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { toast, ToastContainer } from "react-toastify";
const AdminCurrencySettings = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    symbol: "",
  });

  // ===============================
  // Fetch Existing Currency
  // API: GET /api/getGlobalCurrency
  // ===============================
  // fetchSettings function update

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getGlobalCurrency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFormData({
          code: res.data.data?.code || "",
          symbol: res.data.data?.symbol || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch currency settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ===============================
  // Handle Input Change
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  // ===============================
  // Save Currency
  // API: POST /api/upsertCurrency
  // ===============================
  const handleSubmit = async () => {
    try {
      // ===============================
      // Validation
      // ===============================
      if (!formData.code.trim()) {
        toast.error("Currency code is required");
        return;
      }

      if (!formData.symbol.trim()) {
        toast.error("Currency symbol is required");
        return;
      }

      if (formData.code.length < 3 || formData.code.length > 5) {
        toast.error("Currency code must be 3 to 5 characters");
        return;
      }

      if (!/^[A-Z]+$/.test(formData.code)) {
        toast.error("Currency code must contain only uppercase letters");
        return;
      }

      if (formData.symbol.length > 5) {
        toast.error("Currency symbol is too long");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_BASE_URL}upsertCurrency`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Currency updated successfully");
        fetchSettings();
      } else {
        toast.error("Failed to update currency");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="super-dashboard-content-wrapper">
        {/* Heading */}
        <div className="super-dashboard-breadcrumb-info">
          <h4>Currency Settings Management</h4>
        </div>

        {/* Title */}
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Global Currency
          </h5>
        </div>

        {/* Form */}
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* Currency Code */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Currency Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Ex: USD / INR / EUR"
                  />
                </div>
              </div>

              {/* Currency Symbol */}
              <div className="col-lg-6 col-md-6">
                <div className="form-group">
                  <label>Currency Symbol</label>
                  <input
                    type="text"
                    className="form-control"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="Ex: $ / ₹ / €"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Preview</label>
                  <div className="form-control bg-light">
                    Example: {formData.symbol}5000 {formData.code}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="col-lg-12">
                <div className="super-dashboard-content-btn-info text-center">
                  <button
                    type="button"
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Currency"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminCurrencySettings;
