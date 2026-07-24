import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";

const DEFAULT_POPULAR_LIMIT = 5;
const MAX_POPULAR_LIMIT = 20;

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(true);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularListLoading, setPopularListLoading] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [popularPosts, setPopularPosts] = useState([]);
  const [popularLimit, setPopularLimit] = useState(5);
  const [popularCount, setPopularCount] = useState(0);
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

  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Default local dashboard image
    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    // ✅ Fix wrong stored URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  const applyBlogDetails = (responseData, blogData) => {
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
      bannerImage: blogData.bannerImage || null,
    });
    setIsPopular(
      blogData.isPopular === true || blogData.is_popular === true,
    );
    setPopularPosts(responseData?.popularPosts || []);
    setPopularLimit(responseData?.popularLimit ?? 5);
    setPopularCount(
      responseData?.popularCount ?? responseData?.popularPosts?.length ?? 0,
    );

    if (blogData.bannerImage) {
      setImagePreview(cleanImageUrl(blogData.bannerImage));
    }
  };

  const fetchBlogData = async (
    requestedPopularLimit = popularLimit,
    { refreshPopularOnly = false } = {},
  ) => {
    if (refreshPopularOnly) {
      setPopularListLoading(true);
    } else {
      setFetchingBlog(true);
    }

    const safePopularLimit = Math.min(
      Math.max(Number(requestedPopularLimit) || DEFAULT_POPULAR_LIMIT, 1),
      MAX_POPULAR_LIMIT,
    );

    try {
      let blogData = null;
      let responseData = null;

      try {
        const response = await axios.get(
          `${API_BASE_URL}getBlog/${id}`,
          await ensureAuthRequestConfig({
            skipGlobalLoader: true,
            params: { popularLimit: safePopularLimit },
          }),
        );

        if (response.data.success) {
          responseData = response.data;
          const rawData = response.data.data;
          if (Array.isArray(rawData) && rawData.length > 0) {
            blogData = rawData[0];
          } else if (rawData && !Array.isArray(rawData)) {
            blogData = rawData;
          }
        }
      } catch (singleFetchError) {
        console.warn(
          "Blog details fetch failed, trying fallback...",
          singleFetchError,
        );
      }

      if (!blogData) {
        try {
          const allDocsResponse = await axios.get(`${API_BASE_URL}allBlog`, {
            params: { limit: 1000 },
          });

          if (allDocsResponse.data?.data) {
            blogData = allDocsResponse.data.data.find(
              (b) => String(b._id) === String(id),
            );
          }
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
        }
      }

      if (blogData) {
        applyBlogDetails(responseData, blogData);
      } else {
        toast.error(
          "Could not load blog details. Please check the connection.",
        );
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      toast.error("Failed to fetch blog data");
    } finally {
      if (refreshPopularOnly) {
        setPopularListLoading(false);
      } else {
        setFetchingBlog(false);
      }
    }
  };

  // Fetch blog data on component mount
  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id]);

  const handlePopularToggle = async (e) => {
    const newPopular = e.target.checked;
    setPopularLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}setBlogPopular/${id}`,
        { isPopular: newPopular },
        await ensureAuthRequestConfig(),
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchBlogData();
      } else {
        toast.error(response.data.message || "Failed to update popular status");
        setIsPopular(!newPopular);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update popular status",
      );
      setIsPopular(!newPopular);
    } finally {
      setPopularLoading(false);
    }
  };

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
      if (formData.bannerImage && formData.bannerImage instanceof File) {
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
        await ensureAuthRequestConfig({
          headers: { "Content-Type": "multipart/form-data" },
        }),
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
      <ToastContainer position="top-right" autoClose={2500} />
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
            {fetchingBlog ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-8">
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
                        crossOrigin="anonymous"
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
                        placeholder="Select image"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="upload-company-file-name">
                      <span className="file-name" id="fileName">
                        {formData.bannerImage
                          ? formData.bannerImage instanceof File
                            ? formData.bannerImage.name
                            : typeof formData.bannerImage === "string"
                              ? formData.bannerImage.split("/").pop()
                              : "Current Image"
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

                <div className="col-lg-4">
                  <div className="super-admin-white-bg p-3 rounded border mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Popular Post</h6>
                      <span className="badge bg-primary">
                        {popularCount}/{popularLimit}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Popular posts to load (max {MAX_POPULAR_LIMIT})
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={popularLimit}
                        onChange={(e) => {
                          const nextLimit = Number(e.target.value);
                          setPopularLimit(nextLimit);
                          fetchBlogData(nextLimit, { refreshPopularOnly: true });
                        }}
                        disabled={popularListLoading}
                      >
                        {[5, 10, 15, 20].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-muted small mb-3">
                      Mark this blog as popular to show it in the popular posts
                      section on the public site.
                    </p>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <strong>Mark as Popular</strong>
                      <div className="super-admin-toggle-switch">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={isPopular}
                            onChange={handlePopularToggle}
                            disabled={popularLoading}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="super-admin-white-bg p-3 rounded border">
                    <h6 className="mb-3">Current Popular Posts</h6>
                    {popularListLoading ? (
                      <div className="d-flex justify-content-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" />
                      </div>
                    ) : popularPosts.length === 0 ? (
                      <p className="text-muted small mb-0">
                        No popular posts yet.
                      </p>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {popularPosts.map((post) => (
                          <div
                            key={post._id}
                            className="d-flex gap-2 align-items-start border-bottom pb-3"
                          >
                            <img
                              crossOrigin="anonymous"
                              src={cleanImageUrl(post.bannerImage)}
                              alt={post.title}
                              width={48}
                              height={48}
                              style={{
                                borderRadius: "6px",
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                              }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-semibold small">
                                {post.title || "Untitled"}
                                {String(post._id) === String(id) && (
                                  <span className="badge bg-success ms-2">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-muted small">
                                {post.authorName || "Unknown author"}
                              </div>
                              <div className="text-muted small">
                                {post.publishDate
                                  ? new Date(
                                      post.publishDate,
                                    ).toLocaleDateString()
                                  : "—"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateBlog;
