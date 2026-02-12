import React, { useState, useRef, useEffect, useContext } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

const MyProfile = () => {
  const token = localStorage.getItem("token");
  const { admin, updateAdmin } = useContext(AuthContext);
  console.log(updateAdmin);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({}); // For validation errors

  const [profileImage, setProfileImage] = useState(
    `${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`,
  );
  const [profileFile, setProfileFile] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getAdminProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const data = res.data.data;

          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
          });

          // ✅ store ONLY relative path
          setProfileImage(data.profileImage || "");

          updateAdmin({
            ...data,
            profileImage: data.profileImage || "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  // Handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setProfileFile(file);
    setProfileImage(previewUrl); // preview ONLY on profile page
  };

  const handleImageClick = () => fileInputRef.current.click();

  // 🔹 Validation function
  const validate = () => {
    const tempErrors = {};
    if (!formData.first_name.trim())
      tempErrors.first_name = "First Name is required";
    if (!formData.last_name.trim())
      tempErrors.last_name = "Last Name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
    else if (!/^\d{10,15}$/.test(formData.phone))
      tempErrors.phone = "Phone must be 10-15 digits";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // return true if no errors
  };

  // Submit profile update
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the validation errors!");
      return;
    }

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (profileFile) data.append("profile", profileFile);

      const res = await axios.post(`${API_BASE_URL}/updateAdminProfile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Profile updated successfully");

      if (res.data.data) {
        const updated = res.data.data;

        setFormData({
          first_name: updated.first_name,
          last_name: updated.last_name,
          email: updated.email,
          phone: updated.phone,
        });

        // ✅ store ONLY relative path
        setProfileImage(updated.profileImage || "");

        updateAdmin({
          ...admin,
          ...updated,
          profileImage: updated.profileImage || "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container bg-white">
        <div className="row justify-content-center">
          <div className="col-12 text-center position-relative my-2">
            <img
              src={
                profileImage
                  ? profileImage.startsWith("blob:")
                    ? profileImage // ✅ local preview
                    : `${API_IMAGE_URL}/${profileImage}` // ✅ server image
                  : `${process.env.PUBLIC_URL}/assets/images/userImg/candidate1.jpg`
              }
              crossOrigin="anonymous"
              alt="Profile"
              onClick={handleImageClick}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "2px solid #1E95D5",
                cursor: "pointer",
                objectFit: "cover",
              }}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
            <div
              onClick={handleImageClick}
              style={{
                position: "absolute",
                bottom: "15px",
                right: "calc(50% - 75px)",
                background: "#1E95D5",
                color: "#fff",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-pencil"></i>
            </div>
          </div>

          <div className="col-12 ">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.first_name && (
              <div className="invalid-feedback">{errors.first_name}</div>
            )}
          </div>

          <div className="col-12 my-2">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.last_name && (
              <div className="invalid-feedback">{errors.last_name}</div>
            )}
          </div>

          <div className="col-12 my-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="col-12 my-2">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="col-12 my-3 text-center">
            <Button variant="contained" onClick={handleSubmit}>
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
