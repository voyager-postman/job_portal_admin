import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotificationGovernance() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    enabled: true,
    thresholds: [],
    channels: [],
    frequencyHours: 24,
  });

  const [thresholdInput, setThresholdInput] = useState("");

  // =============================
  // GET GOVERNANCE
  // =============================
  const fetchGovernance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}admin/notification-governance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        const data = res.data.data;

        setFormData({
          enabled: data.enabled ?? true,
          thresholds: data.thresholds ?? [],
          channels: data.channels ?? [],
          frequencyHours: data.frequencyHours ?? 24,
        });

        setThresholdInput((data.thresholds || []).join(","));
      }
    } catch (error) {
      toast.error("Failed to load governance settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernance();
  }, []);

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // =============================
  // CHANNEL CHANGE
  // =============================
  const handleChannelChange = (channel) => {
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter((c) => c !== channel),
      });
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel],
      });
    }
  };

  // =============================
  // THRESHOLD CHANGE
  // =============================
  const handleThresholdChange = (e) => {
    const value = e.target.value;

    setThresholdInput(value);

    const values = value
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));

    setFormData({
      ...formData,
      thresholds: values,
    });
  };

  // =============================
  // VALIDATION
  // =============================
  const validateForm = () => {
    if (formData.thresholds.length === 0) {
      toast.error("Please enter at least one threshold");
      return false;
    }

    const invalidThreshold = formData.thresholds.some((t) => t < 0 || t > 100);

    if (invalidThreshold) {
      toast.error("Threshold values must be between 0 and 100");
      return false;
    }

    if (formData.channels.length === 0) {
      toast.error("Please select at least one notification channel");
      return false;
    }

    if (formData.frequencyHours <= 0) {
      toast.error("Frequency must be greater than 0 hours");
      return false;
    }

    return true;
  };

  // =============================
  // UPDATE GOVERNANCE
  // =============================
  const updateGovernance = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}admin/notification-governance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Notification governance updated successfully");

        fetchGovernance();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <>
      <ToastContainer />

      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Notification Governance</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Governance Settings
          </h5>
        </div>

        <div className="super-admin-white-bg p-4">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <form onSubmit={updateGovernance}>
              {/* ENABLE */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Enable Notification System
                </label>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleChange}
                  />

                  <label className="form-check-label">
                    Enable Notifications
                  </label>
                </div>
              </div>

              {/* THRESHOLDS */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Credit Thresholds (%)
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: 20,10,0"
                  value={thresholdInput}
                  onChange={handleThresholdChange}
                />

                <small className="text-muted">
                  Enter percentage values separated by comma
                </small>
              </div>

              {/* CHANNELS */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Notification Channels
                </label>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.channels.includes("email")}
                    onChange={() => handleChannelChange("email")}
                  />

                  <label className="form-check-label">Email</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.channels.includes("in-app")}
                    onChange={() => handleChannelChange("in-app")}
                  />

                  <label className="form-check-label">
                    In-App Notification
                  </label>
                </div>
              </div>

              {/* FREQUENCY */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Reminder Frequency (Hours)
                </label>

                <input
                  type="number"
                  name="frequencyHours"
                  className="form-control"
                  value={formData.frequencyHours}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <button type="submit" className="super-dashboard-content-btn">
                Update Governance
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export default NotificationGovernance;
