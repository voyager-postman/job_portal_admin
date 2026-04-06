import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FooterPageContent = () => {
  const [footerData, setFooterData] = useState({
    shortDescription: "",
    facebook: "",
    twitter: "",
    instagram: "",
    bannerImage: null,
  });

  const [imagePreview, setImagePreview] = useState(
    `${process.env.PUBLIC_URL}/assets/images/Icon/dummy-img.png`,
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    getHomePageData();
  }, []);

  const getHomePageData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePage`);
      const footer = res.data.data.footerSection;

      setFooterData({
        shortDescription: footer?.shortDescription || "",
        facebook: footer?.socialLinks?.facebook || "",
        twitter: footer?.socialLinks?.twitter || "",
        instagram: footer?.socialLinks?.instagram || "",
      });

      if (footer?.image) {
        setImagePreview(`${API_IMAGE_URL}${footer.image}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      setFooterData({
        ...footerData,
        [name]: file,
      });

      setImagePreview(URL.createObjectURL(file));
    } else {
      setFooterData({
        ...footerData,
        [name]: value,
      });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("shortDescription", footerData.shortDescription);
      formData.append("facebook", footerData.facebook);
      formData.append("twitter", footerData.twitter);
      formData.append("instagram", footerData.instagram);

      if (footerData.bannerImage) {
        formData.append("image", footerData.bannerImage);
      }

      const res = await axios.post(
        `${API_BASE_URL}updateFooterSection`,
        formData,
      );

      toast.success(res.data.message || "Footer updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Footer Section Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left" />
            </Link>
            First Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="section-Img-upload-input">
                    <label>Footer Logo Image</label>
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
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="upload-company-file-name">
                      <span className="file-name" id="fileName">
                        {footerData.bannerImage
                          ? footerData.bannerImage.name
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
                    <label>First Section Short Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortDescription"
                      placeholder="First Section Short Description"
                      value={footerData.shortDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <label>Facebook Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="facebook"
                      placeholder="https://facebook.com"
                      value={footerData.facebook}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <label>Twitter Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="twitter"
                      placeholder="https://twitter.com"
                      value={footerData.twitter}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-4">
                  <div className="form-group">
                    <label>Instagram Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="instagram"
                      placeholder="https://instagram.com"
                      value={footerData.instagram}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="super-dashboard-content-btn-info">
                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                    >
                      Update Content
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

export default FooterPageContent;
