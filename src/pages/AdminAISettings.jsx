import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { toast, ToastContainer } from "react-toastify";
const AdminAISettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  // Add State
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    openaiApiKey: "",
    jobDescriptionPrompt: "",
  });

  // ===================================
  // Fetch Existing OpenAI Config
  // GET /api/upsertOpenAIConfig
  // ===================================
  const fetchSettings = async () => {
    try {
      setFetchLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getOpenAIConfig`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFormData({
          openaiApiKey: res.data.data.openaiApiKey || "",
          jobDescriptionPrompt: res.data.data.jobDescriptionPrompt || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load OpenAI settings");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ===================================
  // Handle Change
  // ===================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================
  // Save / Update Config
  // POST /api/upsertOpenAIConfig
  // ===================================
  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true);

  //     const token = localStorage.getItem("token");

  //     const res = await axios.post(
  //       `${API_BASE_URL}upsertOpenAIConfig`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data.success) {
  //       toast.success("OpenAI Config Saved Successfully");
  //     } else {
  //       toast.error("Failed to save config");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ===================================
  // Save / Update Config
  // POST /api/upsertOpenAIConfig
  // ===================================
  const handleSubmit = async () => {
    try {
      // ===============================
      // Validation
      // ===============================
      if (!formData.openaiApiKey.trim()) {
        toast.error("OpenAI API Key is required");
        return;
      }

      if (!formData.openaiApiKey.startsWith("sk-")) {
        toast.error("Invalid OpenAI API Key format");
        return;
      }

      if (formData.openaiApiKey.length < 20) {
        toast.error("OpenAI API Key is too short");
        return;
      }

      if (!formData.jobDescriptionPrompt.trim()) {
        toast.error("Job Description Prompt is required");
        return;
      }

      if (formData.jobDescriptionPrompt.trim().length < 20) {
        toast.error("Prompt must be at least 20 characters");
        return;
      }

      if (formData.jobDescriptionPrompt.trim().length > 5000) {
        toast.error("Prompt is too long");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}upsertOpenAIConfig`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("OpenAI Config Saved Successfully");
      } else {
        toast.error("Failed to save config");
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
          <h4>OpenAI Settings Management</h4>
        </div>

        {/* Title */}
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage OpenAI API Key & Prompt
          </h5>
        </div>

        {/* Form */}
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <div className="row">
              {/* API Key */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>OpenAI API Key</label>

                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      name="openaiApiKey"
                      value={formData.openaiApiKey}
                      onChange={handleChange}
                      placeholder="Enter OpenAI Secret Key"
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      <i
                        className={
                          showPassword
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Prompt */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Job Description Prompt</label>
                  <textarea
                    rows="8"
                    className="form-control"
                    name="jobDescriptionPrompt"
                    value={formData.jobDescriptionPrompt}
                    onChange={handleChange}
                    placeholder="Write custom prompt for job description generation..."
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="col-lg-12">
                <div className="super-dashboard-content-btn-info text-center">
                  <button
                    type="button"
                    className="super-dashboard-content-btn"
                    onClick={handleSubmit}
                    disabled={loading || fetchLoading}
                  >
                    {loading
                      ? "Saving..."
                      : fetchLoading
                        ? "Loading..."
                        : "Save OpenAI Settings"}
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

export default AdminAISettings;
