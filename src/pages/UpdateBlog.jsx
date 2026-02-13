import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(true);
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

  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      setFetchingBlog(true);
      try {
        let blogData = null;

        // Attempt 1: Fetch single blog by ID
        console.log("Fetch blog attempt 1: ID", id);
        try {
          const response = await axios.get(`${API_BASE_URL}blog/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.data.success) {
            console.log("Single fetch success:", response.data);
            const rawData = response.data.data;
            if (Array.isArray(rawData) && rawData.length > 0) {
              blogData = rawData[0];
            } else if (rawData && !Array.isArray(rawData)) {
              blogData = rawData;
            }
          }
        } catch (singleFetchError) {
          console.warn(
            "Single blog fetch failed, trying fallback...",
            singleFetchError,
          );
        }

        // Attempt 2: Fallback to fetching all blogs if single fetch failed or returned no data
        if (!blogData) {
          console.log("Using fallback: fetching all blogs to find ID:", id);
          try {
            const allDocsResponse = await axios.get(`${API_BASE_URL}allBlog`, {
              params: { limit: 1000 },
            });

            if (allDocsResponse.data?.data) {
              const allBlogs = allDocsResponse.data.data;
              // Ensure type safety during comparison (ids can be strings or numbers)
              blogData = allBlogs.find((b) => String(b._id) === String(id));
            }
          } catch (fallbackError) {
            console.error("Fallback fetch also failed:", fallbackError);
          }
        }

        if (blogData) {
          console.log("Blog Data Found & Loading:", blogData);
          let formattedDate = "";
          if (blogData.publishDate) {
            const dateObj = new Date(blogData.publishDate);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split("T")[0];
            }
          }

          setFormData({
            title: blogData.title || "",
            authorName: blogData.authorName || "",
            publishDate: formattedDate,
            content: blogData.content || "",
            bannerImage: null,
          });

          // Set image preview to existing banner image
          if (blogData.bannerImage) {
            if (blogData.bannerImage.startsWith("http")) {
              setImagePreview(blogData.bannerImage);
            } else {
              setImagePreview(`${API_IMAGE_URL}${blogData.bannerImage}`);
            }
          }
        } else {
          console.error(
            "Could not find blog details via single fetch or fallback.",
          );
          toast.error(
            "Could not load blog details. Please check the connection.",
          );
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast.error("Failed to fetch blog data");
      } finally {
        setFetchingBlog(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id]);

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
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("authorName", formData.authorName);
      formDataToSend.append("publishDate", formData.publishDate);
      formDataToSend.append("content", formData.content);
      if (formData.bannerImage) {
        formDataToSend.append("bannerImage", formData.bannerImage);
      }

      // Log form data for debugging
      console.log("Submitting update for Blog ID:", id);
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const response = await axios.put(
        `${API_BASE_URL}updateBlog/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/manage-blog");
      }
    } catch (error) {
      console.error("Error While Updating the blog:", error);
      toast.error(
        error.response?.data?.message || "Error While Updating the Blog",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Update Blog Page Content Form</h4>
        </div>
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/manage-blog">
              <i className="fa-solid fa-angles-left"></i>
            </Link>
            Blog Section Content Update Here
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
                      {loading ? "Updating..." : "Update Blog"}
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

export default UpdateBlog;
