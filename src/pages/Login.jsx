import React, { useState, useEffect } from "react";
import image from "../assets/images/logo/connect-work-ma-login.png";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { API_BASE_URL } from "../Url/Url";
import { encryptPassword } from "../utils/passwordEncryption";
import {
  hasAdminSession,
  resolveLoginToken,
} from "../utils/authToken";

export default function Login() {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (hasAdminSession()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warn("Please enter both email and password!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}login-admin`,
        {
          email: formData.email,
          password: await encryptPassword(formData.password),
        },
        { withCredentials: true, skipGlobalLoader: true },
      );

      if (response.data.success) {
        const token = resolveLoginToken(response.data, response.headers);

        loginAdmin(response.data.data, token || null);
        toast.success("Login successful!");
        navigate("/admin", { replace: true });
      } else if (response.data.message === "Access denied. Not an admin account") {
        toast.error("Access denied — you do not have admin privileges.");
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <div className="login-card">
        {/* Logo */}
        <div className="logo-section">
          <img src={image} alt="Smart Start Logo" className="logo" />
        </div>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <div className="form-group eye-icon-postion">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowPassword((prev) => !prev)} // ✅
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#f2662c"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn default-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {/* Forgot Password */}
        <Link to="/forgot-password">
          <p className="forgot-password">Forgot password?</p>
        </Link>
      </div>
    </div>
  );
}
