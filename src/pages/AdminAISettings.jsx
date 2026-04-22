import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";

const AdminAISettings = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    provider: "openai",
    apiKey: "",
    model: "gpt-4o-mini",
    userPrompt: "",
    isActive: true,
  });

  // ===============================
  // Fetch Existing Settings
  // ===============================
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}admin/get-ai-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFormData({
          provider: res.data.data.provider || "openai",
          apiKey: res.data.data.apiKey || "",
          model: res.data.data.model || "gpt-4o-mini",
          userPrompt: res.data.data.userPrompt || "",
          isActive: res.data.data.isActive ?? true,
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
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        `${API_BASE_URL}admin/save-ai-settings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("AI Settings Updated Successfully");
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
        <h4>AI Settings Management</h4>
      </div>

      {/* Title */}
      <div className="super-dashboard-common-heading">
        <h5>
          <Link to="/admin">
            <i className="fa-solid fa-angles-left" />
          </Link>
          Manage AI API & Prompt
        </h5>
      </div>

      {/* Form */}
      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <div className="row">
            {/* Provider */}
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>AI Provider</label>
                <select
                  className="form-select form-control"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Claude</option>
                </select>
              </div>
            </div>

            {/* Model */}
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>Model Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Enter Model Name"
                />
              </div>
            </div>

            {/* API Key */}
            <div className="col-lg-12">
              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  className="form-control"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  placeholder="Enter Secret API Key"
                />
              </div>
            </div>

            {/* Prompt */}
            <div className="col-lg-12">
              <div className="form-group">
                <label>Long Description Prompt</label>
                <textarea
                  rows="8"
                  className="form-control"
                  name="userPrompt"
                  value={formData.userPrompt}
                  onChange={handleChange}
                  placeholder="Write prompt used for job long description generation..."
                />
              </div>
            </div>

            {/* Active */}
            <div className="col-lg-6 col-md-6">
              <div className="form-group d-flex align-items-center justify-content-between">
                <label className="mb-0">Enable AI Generator</label>

                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
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
                  {loading ? "Saving..." : "Save AI Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminAISettings;