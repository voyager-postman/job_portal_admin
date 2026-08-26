import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";

const AdminChangePasswordModal = ({ isOpen, onClose, user }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    const userId = user._id;
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}admin/change-password`,
        {
          userId: userId,
          newPassword: trimmedPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success !== false) {
        toast.success(response.data.message || "Password changed successfully!");
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to change password. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const displayName =
    user.name ||
    user.brandName ||
    user.companyId?.brandName ||
    (user.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "") ||
    "User";

  const displayEmail = user.email || "No Email Provided";

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 1060,
      }}
      tabIndex="-1"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "480px" }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "none",
          }}
        >
          {/* Modal Header */}
          <div
            className="modal-header"
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontSize: "16px",
                }}
              >
                <i className="fa-solid fa-key"></i>
              </div>
              <h5 className="modal-title m-0" style={{ fontWeight: "600", fontSize: "17px" }}>
                Change Password
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: "20px 24px" }}>
              {/* User summary badge/card */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  {displayName}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  <i className="fa-regular fa-envelope me-1"></i> {displayEmail}
                </div>
                {user._id && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      marginTop: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    ID: {user._id}
                  </div>
                )}
              </div>

              {/* New Password Input */}
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}
                >
                  New Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    style={{ fontSize: "14px", padding: "10px 12px" }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex="-1"
                    style={{ borderColor: "#ced4da" }}
                  >
                    <i
                      className={`fa-solid ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                <small className="text-muted" style={{ fontSize: "11px" }}>
                  Must be at least 6 characters long
                </small>
              </div>

              {/* Confirm Password Input */}
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}
                >
                  Confirm New Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    style={{ fontSize: "14px", padding: "10px 12px" }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                    style={{ borderColor: "#ced4da" }}
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="modal-footer"
              style={{
                borderTop: "1px solid #f0f0f0",
                padding: "14px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
                disabled={loading}
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  fontSize: "14px",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  fontWeight: "500",
                  backgroundColor: "#2563eb",
                  borderColor: "#2563eb",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePasswordModal;
