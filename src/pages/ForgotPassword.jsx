import React, { useState } from "react";
import image from "../assets/images/logo/connect-work-ma-login.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import OtpInput from "react-otp-input";

export default function AdminForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // email | reset

  // ✅ STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}forgotPassword`, {
        email,
        role: "admin",
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep("reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2: RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    if (!newPassword) {
      return toast.error("New password is required");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}resetPassword`, {
        email,
        otp,
        newPassword,
        role: "admin",
      });

      toast.success(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="login-card">
        <div className="logo-section">
          <img src={image} alt="Connect Work" className="logo" />
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Admin Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="login-btn default-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword}>
            {/* OTP */}
            <h6>Enter 6-digit OTP and new password</h6>
            <div className="otp-container mt-2">
              <OtpInput
                value={otp}
                onChange={(value) => {
                  if (/^\d{0,6}$/.test(value)) setOtp(value);
                }}
                numInputs={6}
                isInputNum
                shouldAutoFocus
                renderSeparator={<span className="otp-gap" />}
                renderInput={(props) => (
                  <input {...props} className="otp-box" />
                )}
              />
            </div>

            {/* New Password */}
            <div className="mt-3">
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button className="login-btn default-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
