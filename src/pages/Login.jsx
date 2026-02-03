import React, { useState } from "react";
import image from "../assets/images/logo/connect-work-ma-login.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { API_BASE_URL } from "../Url/Url";
export default function Login() {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
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
      const response = await axios.post(`${API_BASE_URL}/login-admin`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        loginAdmin(response.data.data, response.data.token);
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        // ✅ Handle specific message from backend
        if (response.data.message === "Access denied. Not an admin account") {
          toast.error("Access denied — you do not have admin privileges.");
        } else {
          toast.error(response.data.message || "Invalid credentials!");
        }
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
          />

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
