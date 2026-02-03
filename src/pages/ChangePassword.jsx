import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";

const ChangePassword = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const oldPassword = formData.oldPassword.trim();
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();

    // 🔐 Frontend validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New Password and Confirm Password do not match");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_BASE_URL}changePassword`,
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Password changed successfully");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container bg-white">
        <div className="row justify-content-center">
          <div className="col-12 my-3 text-center">
            <h4>Change Password</h4>
          </div>

          <div className="col-12 my-2">
            <label className="form-label">Old Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="Old Password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <div className="col-12 my-2">
            <label className="form-label">New Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="col-12 my-2">
            <label className="form-label">Confirm Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="col-12 my-3 d-flex justify-content-center">
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
