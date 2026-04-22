import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";

const AdminCurrencySettings = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    currencyCode: "",
    currencySymbol: "",
  });

  // ===============================
  // Fetch Existing Settings
  // ===============================
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}admin/get-currency-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setFormData({
          currencyCode: res.data.data.currencyCode || "",
          currencySymbol: res.data.data.currencySymbol || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ===============================
  // Handle Change
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}admin/save-currency-settings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Currency Settings Updated Successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Manage Platform Currency
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
                  name="currencyCode"
                  value={formData.currencyCode}
                  onChange={handleChange}
                  placeholder="Ex: MAD / USD / EUR"
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
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleChange}
                  placeholder="Ex: DH / $ / €"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="col-lg-12">
              <div className="form-group">
                <label>Preview</label>
                <div className="form-control bg-light">
                  Example: {formData.currencySymbol}5000{" "}
                  {formData.currencyCode}
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="col-lg-12 col-md-12">
              <div className="super-dashboard-content-btn-info text-center">
                <button
                  type="button"
                  className="super-dashboard-content-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Currency Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminCurrencySettings;