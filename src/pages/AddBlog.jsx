import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
  );
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    publishDate: "",
    content: "",
    bannerImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });

    // Handle image preview
    if (type === "file" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("authorName", formData.authorName);
      formDataToSend.append("publishDate", formData.publishDate);
      formDataToSend.append("content", formData.content);
      if (formData.bannerImage) {
        formDataToSend.append("bannerImage", formData.bannerImage);
      }

      const response = await axios.post(
        `${API_BASE_URL}createBlog`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Blog Created Successfully!");
        // Reset form after successful submission
        setFormData({
          title: "",
          authorName: "",
          publishDate: "",
          content: "",
          bannerImage: null,
        });
        setImagePreview(
          `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
        );
        // Navigate to blog list after short delay
        setTimeout(() => {
          navigate("/admin/manage-blog");
        }, 1500);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error While Creating the blog:", error);
      toast.error(
        error.response?.data?.message || "Error While Creating the blog",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Blog Page Content Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-blog">
              <i className="fa-solid fa-angles-left"></i>
            </Link>
            Blog Section Content Add Here
          </h5>
        </div>
        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Article Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Article Title"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Author Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleChange}
                      placeholder="Author Name"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Publish Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                      placeholder="Publish Date"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="section-Img-upload-input">
                    <label>Banner Image</label>
                  </div>
                  <div className="upload-company-info-area">
                    <div className="upload-company-img-preview">
                      <img
                        src={imagePreview}
                        crossOrigin="anonymous"
                        className="main-logo"
                        id="preview"
                        alt="Image Preview"
                      />
                    </div>
                    <div className="upload-company-input">
                      <input
                        type="file"
                        id="imageInput"
                        name="bannerImage"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="upload-company-file-name">
                      <span className="file-name" id="fileName">
                        {formData.bannerImage
                          ? formData.bannerImage.name
                          : "No file selected"}
                      </span>
                    </div>
                    <div className="upload-company-file-btn">
                      <label
                        htmlFor="imageInput"
                        className="super-dashboard-custom-upload"
                      >
                        Choose Img
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Article Content</label>
                    <textarea
                      id="review"
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={10}
                      placeholder="Write your article content here..."
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="super-dashboard-content-btn-info">
                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Blog"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddBlog;
