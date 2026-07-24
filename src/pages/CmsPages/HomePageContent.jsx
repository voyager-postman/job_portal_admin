import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, API_IMAGE_URL } from "../../Url/Url";
import FreelancerSectionForm from "./FreelancerSectionForm";

const HomePageContent = () => {
  const [formData, setFormData] = useState({
    shortTitle: "",
    mainTitle: "",
    shortParagraph: "",
    trendingKeywords: [],
    images: [],
  });
  const [secondSection, setSecondSection] = useState({
    mainTitle: "",
    shortParagraph: "",
  });
  const [thirdSection, setThirdSection] = useState({
    mainTitle: "",
    shortParagraph: "",
  });
  const [fourthSection, setFourthSection] = useState({
    mainTitle: "",
    shortParagraph: "",
    limit: 8,
    jobDisplayType: "featured",
  });
  const [fifthSection, setFifthSection] = useState({
    mainTitle: "",
    mainTitleDescription: "",
  });
  const [sixthSection, setSixthSection] = useState({
    mainTitle: "",
    shortParagraph: "",
  });
  const [eighthSection, setEighthSection] = useState({
    mainTitle: "",
    shortParagraph: "",
  });
  const [ninthSection, setNinthSection] = useState({
    mainTitle: "",
    shortParagraph: "",
  });
  const [fifthImages, setFifthImages] = useState([]);
  const [fifthExistingPhotos, setFifthExistingPhotos] = useState([]);
  const [sixthCompanyLogos, setSixthCompanyLogos] = useState([]);
  const [sixthExistingLogos, setSixthExistingLogos] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [images, setImages] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const handleKeywordAdd = (e) => {
    if (e.key === "Enter" && keywordInput.trim() !== "") {
      e.preventDefault();

      setFormData({
        ...formData,
        trendingKeywords: [...formData.trendingKeywords, keywordInput.trim()],
      });

      setKeywordInput("");
    }
  };
  const handleFifthImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setFifthImages((prev) => [...prev, ...newImages]);
  };
  const handleSixthLogoChange = (e) => {
    const files = Array.from(e.target.files);

    const newLogos = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setSixthCompanyLogos((prev) => [...prev, ...newLogos]);
  };
  const handleFileChangeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemove = (id, isExisting = false) => {
    if (isExisting) {
      setExistingPhotos((prev) => prev.filter((img) => img.id !== id));
    } else {
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };
  const removeKeyword = (index) => {
    const updated = formData.trendingKeywords.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      trendingKeywords: updated,
    });
  };
  const handleFifthChange = (e) => {
    setFifthSection({
      ...fifthSection,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    getHomePageContent();
  }, []);

  const getHomePageContent = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePage`);

      const data = res.data?.data;

      if (data?.firstSection) {
        const first = data.firstSection;

        setFormData({
          shortTitle: first.shortTitle || "",
          mainTitle: first.mainTitle || "",
          shortParagraph: first.shortParagraph || "",
          trendingKeywords: first.trendingKeywords || [],
          images: [],
        });

        if (first.firstSectionImages) {
          const formattedImages = first.firstSectionImages.map((img, i) => ({
            id: i,
            preview: `${API_IMAGE_URL}${img}`,
            path: img,
          }));

          setExistingPhotos(formattedImages);
        }
      }

      // ✅ SECOND SECTION DATA
      if (data?.secondSection) {
        setSecondSection({
          mainTitle: data.secondSection.mainTitle || "",
          shortParagraph: data.secondSection.shortParagraph || "",
        });
      }
      // THIRD SECTION
      if (data?.thirdSection) {
        setThirdSection({
          mainTitle: data.thirdSection.mainTitle || "",
          shortParagraph: data.thirdSection.shortParagraph || "",
        });
      }
      // FOURTH SECTION
      if (data?.fourthSection) {
        const jobsConfig = data.fourthSection.jobsConfig || {};
        setFourthSection({
          mainTitle: data.fourthSection.mainTitle || "",
          shortParagraph: data.fourthSection.shortParagraph || "",
          limit: jobsConfig.limit ?? data.fourthSection.limit ?? 8,
          jobDisplayType:
            jobsConfig.jobDisplayType ||
            data.fourthSection.jobDisplayType ||
            "latest",
        });
      }
      if (data?.fifthSection) {
        setFifthSection({
          mainTitle: data.fifthSection.mainTitle || "",
          mainTitleDescription: data.fifthSection.mainTitleDescription || "",
        });

        if (data.fifthSection.images) {
          const formattedImages = data.fifthSection.images.map((img, i) => ({
            id: i,
            preview: `${API_IMAGE_URL}${img}`,
            path: img,
          }));

          setFifthExistingPhotos(formattedImages);
        }
      }
      // SIXTH SECTION
      if (data?.sixthSection) {
        setSixthSection({
          mainTitle: data.sixthSection.mainTitle || "",
          shortParagraph:
            data.sixthSection.shortParagraph ||
            data.sixthSection.mainTitleDescription ||
            "",
        });

        if (data.sixthSection.companyLogos?.length) {
          const formattedLogos = data.sixthSection.companyLogos.map(
            (logo, i) => ({
              id: i,
              preview: `${API_IMAGE_URL}${logo}`,
              path: logo,
            }),
          );

          setSixthExistingLogos(formattedLogos);
        } else {
          setSixthExistingLogos([]);
        }
      }
      if (data?.eighthSection) {
        setEighthSection({
          mainTitle: data.eighthSection.mainTitle || "",
          shortParagraph: data.eighthSection.shortParagraph || "",
        });
      }
      if (data?.ninthSection) {
        setNinthSection({
          mainTitle: data.ninthSection.mainTitle || "",
          shortParagraph: data.ninthSection.shortParagraph || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load content");
    }
  };
  const handleNinthChange = (e) => {
    setNinthSection({
      ...ninthSection,
      [e.target.name]: e.target.value,
    });
  };
  const handleNinthSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}updateNinthSection`, {
        mainTitle: ninthSection.mainTitle,
        shortParagraph: ninthSection.shortParagraph,
      });

      toast.success(res.data.message || "Ninth section updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const handleEighthChange = (e) => {
    setEighthSection({
      ...eighthSection,
      [e.target.name]: e.target.value,
    });
  };
  const handleEighthSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}updateEighthSection`, {
        mainTitle: eighthSection.mainTitle,
        shortParagraph: eighthSection.shortParagraph,
      });

      toast.success(res.data.message || "Eighth section updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const handleSixthChange = (e) => {
    setSixthSection({
      ...sixthSection,
      [e.target.name]: e.target.value,
    });
  };
  const handleSixthSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("mainTitle", sixthSection.mainTitle);
      formData.append("shortParagraph", sixthSection.shortParagraph);

      for (let logo of sixthExistingLogos) {
        const file = await urlToFile(
          `${API_IMAGE_URL}${logo.path}`,
          logo.path.split("/").pop(),
        );

        formData.append("companyLogos", file);
      }

      sixthCompanyLogos.forEach((logo) => {
        if (logo.file) {
          formData.append("companyLogos", logo.file);
        }
      });

      const res = await axios.post(
        `${API_BASE_URL}updateSixthSection`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message || "Sixth section updated");
      setSixthCompanyLogos([]);
      getHomePageContent();
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleFifthSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("mainTitle", fifthSection.mainTitle);
      formData.append(
        "mainTitleDescription",
        fifthSection.mainTitleDescription,
      );

      // Convert existing images to binary
      for (let img of fifthExistingPhotos) {
        const file = await urlToFile(
          `${API_IMAGE_URL}${img.path}`,
          img.path.split("/").pop(),
        );

        formData.append("images", file);
      }

      // Append new uploaded images
      fifthImages.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      await axios.post(`${API_BASE_URL}fifthSectionHome`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Fifth Section Updated");
    } catch (error) {
      toast.error("Update Failed");
    }
  };
  const handleFourthChange = (e) => {
    const { name, value, type } = e.target;
    setFourthSection({
      ...fourthSection,
      [name]: type === "number" ? Number(value) : value,
    });
  };
  const handleFourthSubmit = async (e) => {
    e.preventDefault();

    const limit = Math.max(1, Number(fourthSection.limit) || 8);
    const jobsConfig = {
      jobDisplayType: fourthSection.jobDisplayType,
      limit,
    };

    const payload = {
      jobsConfig,
      jobDisplayType: fourthSection.jobDisplayType,
      limit,
    };

    if (fourthSection.jobDisplayType === "featured") {
      if (!fourthSection.mainTitle.trim()) {
        toast.error("Main title is required for featured jobs");
        return;
      }
      payload.mainTitle = fourthSection.mainTitle.trim();
      payload.shortParagraph = fourthSection.shortParagraph.trim();
    } else if (fourthSection.mainTitle.trim()) {
      payload.mainTitle = fourthSection.mainTitle.trim();
      payload.shortParagraph = fourthSection.shortParagraph.trim();
    }

    try {
      const res = await axios.post(`${API_BASE_URL}fourthSectionHome`, payload);

      toast.success(res.data.message || "Fourth section updated");
      getHomePageContent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };
  const handleThirdChange = (e) => {
    setThirdSection({
      ...thirdSection,
      [e.target.name]: e.target.value,
    });
  };
  const handleThirdSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}thirdSectionHome`, {
        mainTitle: thirdSection.mainTitle,
        shortParagraph: thirdSection.shortParagraph,
      });

      toast.success(res.data.message || "Third section updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const handleRemoveFifthImage = (id, isExisting = false) => {
    if (isExisting) {
      setFifthExistingPhotos((prev) => prev.filter((img) => img.id !== id));
    } else {
      setFifthImages((prev) => prev.filter((img) => img.id !== id));
    }
  };
  const handleRemoveSixthLogo = (id, isExisting = false) => {
    if (isExisting) {
      setSixthExistingLogos((prev) => prev.filter((logo) => logo.id !== id));
    } else {
      setSixthCompanyLogos((prev) => prev.filter((logo) => logo.id !== id));
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSecondChange = (e) => {
    setSecondSection({
      ...secondSection,
      [e.target.name]: e.target.value,
    });
  };
  const handleSecondSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}secondSectionHome`, {
        mainTitle: secondSection.mainTitle,
        shortParagraph: secondSection.shortParagraph,
      });

      toast.success(res.data.message || "Second section updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  const validateForm = () => {
    if (!formData.shortTitle.trim()) {
      toast.error("Short Title is required");
      return false;
    }

    if (!formData.mainTitle.trim()) {
      toast.error("Main Title is required");
      return false;
    }

    if (!formData.shortParagraph.trim()) {
      toast.error("Short Paragraph is required");
      return false;
    }

    if (formData.trendingKeywords.length === 0) {
      toast.error("Trending Keywords are required");
      return false;
    }

    if (formData.images.length === 0 && existingPhotos.length === 0) {
      toast.error("Image is required");
      return false;
    }

    return true;
  };
  const convertUrlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();

      data.append("shortTitle", formData.shortTitle);
      data.append("mainTitle", formData.mainTitle);
      data.append("shortParagraph", formData.shortParagraph);
      data.append("trendingKeywords", formData.trendingKeywords.join(","));

      // Convert existing images to binary
      for (let img of existingPhotos) {
        const file = await convertUrlToFile(
          `${API_IMAGE_URL}${img.path}`,
          img.path.split("/").pop(),
        );
        data.append("images", file);
      }

      // Append new uploaded images
      images.forEach((img) => {
        if (img.file) {
          data.append("images", img.file);
        }
      });

      const res = await axios.post(`${API_BASE_URL}firstSectionHome`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Home Page Content Form</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin/">
              <i className="fa-solid fa-angles-left"></i>
            </Link>
            Home Page First Section Content Update Here
          </h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Short Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortTitle"
                      value={formData.shortTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 mt-3">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={formData.mainTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 mt-3">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={formData.shortParagraph}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 mt-3">
                  <div className="form-group">
                    <label>Trending Keywords</label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type keyword and press Enter"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleKeywordAdd}
                    />

                    <div className="mt-2">
                      {formData.trendingKeywords.map((k, i) => (
                        <span key={i} className="badge bg-primary me-2">
                          {k}
                          <i
                            className="fa fa-times ms-2 py-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => removeKeyword(i)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 mt-4">
                  <div className="form-group">
                    <label>First Section Img Upload</label>

                    <div className="upload-company-info-area d-flex align-items-center gap-3">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="officePhotos"
                        accept="image/*"
                        multiple
                        onChange={handleFileChangeMultiple}
                        style={{ display: "none" }}
                      />

                      {/* File Name */}
                      <div className="upload-company-file-name">
                        <span className="file-name">
                          {images.length > 0
                            ? `${images.length} file(s) selected`
                            : "No file selected"}
                        </span>
                      </div>

                      {/* Upload Button */}
                      <div className="upload-company-file-btn">
                        <label
                          htmlFor="officePhotos"
                          className="custom-upload default-btn btn"
                        >
                          Choose Images
                        </label>
                      </div>
                    </div>

                    {/* Preview Images */}

                    <div className="preview-container mt-3">
                      {/* Existing Images from API */}
                      {existingPhotos.map((img) => (
                        <div key={img.id} className="preview-box">
                          <img
                            crossOrigin="anonymous"
                            src={img.preview}
                            alt="existing"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemove(img.id, true)}
                            className="remove-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* Newly Uploaded Images */}
                      {images.map((img) => (
                        <div key={img.id} className="preview-box">
                          <img
                            crossOrigin="anonymous"
                            src={img.preview}
                            alt="preview"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemove(img.id)}
                            className="remove-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 mt-4 super-dashboard-content-btn-info">
                  <button type="submit" className="super-dashboard-content-btn">
                    {isUploading ? "Uploading..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <div className="super-dashboard-common-heading">
        <h5>Home Page Second Section Content Update Here</h5>
      </div>

      <div className="super-dashboard-cms-content-form">
        <div className="container">
          <form onSubmit={handleSecondSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mainTitle"
                    value={secondSection.mainTitle}
                    onChange={handleSecondChange}
                  />
                </div>
              </div>

              <div className="col-lg-12 mt-3">
                <div className="form-group">
                  <label>Main Title Short Paragraph</label>
                  <input
                    type="text"
                    className="form-control"
                    name="shortParagraph"
                    value={secondSection.shortParagraph}
                    onChange={handleSecondChange}
                  />
                </div>
              </div>

              <div className="col-lg-12 mt-4">
                <div className="super-dashboard-content-btn-info">
                  <button type="submit" className="super-dashboard-content-btn">
                    Update Content
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Third Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleThirdSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={thirdSection.mainTitle}
                      onChange={handleThirdChange}
                      placeholder="Main Title"
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={thirdSection.shortParagraph}
                      onChange={handleThirdChange}
                      placeholder="Main Title Short Paragraph"
                    />
                  </div>
                </div>

                <div className="col-lg-12 mt-4">
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
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Fourth Section — Jobs Display</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleFourthSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Job Display Type</label>
                    <select
                      className="form-select form-control"
                      name="jobDisplayType"
                      value={fourthSection.jobDisplayType}
                      onChange={handleFourthChange}
                    >
                      <option value="featured">Featured Jobs</option>
                      <option value="latest">Latest Jobs</option>
                    </select>
                    <small className="text-muted">
                      Featured uses promoted jobs; latest shows newest published
                      jobs.
                    </small>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Jobs Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      name="limit"
                      min={1}
                      max={50}
                      value={fourthSection.limit}
                      onChange={handleFourthChange}
                      placeholder="8"
                    />
                    <small className="text-muted">
                      Number of jobs to show (e.g. 8 featured, 10 latest).
                    </small>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={fourthSection.mainTitle}
                      onChange={handleFourthChange}
                      placeholder="Find Your Best Jobs"
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      value={fourthSection.shortParagraph}
                      onChange={handleFourthChange}
                      placeholder="Section description"
                    />
                    {fourthSection.jobDisplayType === "featured" && (
                      <small className="text-muted">
                        Required when display type is Featured Jobs.
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-lg-12 mt-4">
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
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Fifth Section Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleFifthSubmit}>
              <div className="row">
                {/* Main Title */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      value={fifthSection.mainTitle}
                      onChange={handleFifthChange}
                      placeholder="Main Title"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Main Title Description Paragraph</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="mainTitleDescription"
                      value={fifthSection.mainTitleDescription}
                      onChange={handleFifthChange}
                      placeholder="Write your description here..."
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-lg-12 mt-3">
                  <label>Upload Images</label>

                  <div className="upload-company-info-area d-flex align-items-center gap-3">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      id="fifthImages"
                      accept="image/*"
                      multiple
                      onChange={handleFifthImageChange}
                      style={{ display: "none" }}
                    />

                    {/* File Name */}
                    <div className="upload-company-file-name">
                      <span className="file-name">
                        {fifthImages.length > 0
                          ? `${fifthImages.length} new image(s)`
                          : fifthExistingPhotos.length > 0
                            ? `${fifthExistingPhotos.length} existing image(s)`
                            : "No file selected"}
                      </span>
                    </div>

                    {/* Upload Button */}
                    <div className="upload-company-file-btn">
                      <label
                        htmlFor="fifthImages"
                        className="custom-upload default-btn btn"
                      >
                        Choose Images
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="preview-container mt-3">
                    {/* Existing Images */}
                    {fifthExistingPhotos.map((img) => (
                      <div key={img.id} className="preview-box">
                        <img
                          crossOrigin="anonymous"
                          src={img.preview}
                          alt="existing"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveFifthImage(img.id, true)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* New Images */}
                    {fifthImages.map((img) => (
                      <div key={img.id} className="preview-box">
                        <img
                          crossOrigin="anonymous"
                          src={img.preview}
                          alt="preview"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveFifthImage(img.id)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-12 mt-4">
                  <div className="super-dashboard-content-btn-info">
                    <button
                      type="submit"
                      className="super-dashboard-content-btn"
                    >
                      Update Content
                    </button>
                  </div>
                </div>
                {/* Submit */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Sixth Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleSixthSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      placeholder="Main Title"
                      value={sixthSection.mainTitle}
                      onChange={handleSixthChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mt-3">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      placeholder="Main Title Short Paragraph"
                      value={sixthSection.shortParagraph}
                      onChange={handleSixthChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 mt-3">
                  <label>Company Logos</label>

                  <div className="upload-company-info-area d-flex align-items-center gap-3">
                    <input
                      type="file"
                      id="sixthCompanyLogos"
                      accept="image/*"
                      multiple
                      onChange={handleSixthLogoChange}
                      style={{ display: "none" }}
                    />

                    <div className="upload-company-file-name">
                      <span className="file-name">
                        {sixthCompanyLogos.length > 0
                          ? `${sixthCompanyLogos.length} new logo(s)`
                          : sixthExistingLogos.length > 0
                            ? `${sixthExistingLogos.length} existing logo(s)`
                            : "No file selected"}
                      </span>
                    </div>

                    <div className="upload-company-file-btn">
                      <label
                        htmlFor="sixthCompanyLogos"
                        className="custom-upload default-btn btn"
                      >
                        Choose Logos
                      </label>
                    </div>
                  </div>

                  <div className="preview-container mt-3">
                    {sixthExistingLogos.map((logo) => (
                      <div key={logo.id} className="preview-box">
                        <img
                          crossOrigin="anonymous"
                          src={logo.preview}
                          alt="existing logo"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSixthLogo(logo.id, true)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {sixthCompanyLogos.map((logo) => (
                      <div key={logo.id} className="preview-box">
                        <img
                          crossOrigin="anonymous"
                          src={logo.preview}
                          alt="new logo"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSixthLogo(logo.id)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-12 mt-4">
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
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Seventh Section — Freelancers</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <FreelancerSectionForm />
          </div>
        </div>
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Eighth Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleEighthSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      placeholder="Main Title"
                      value={eighthSection.mainTitle}
                      onChange={handleEighthChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      placeholder="Main Title Short Paragraph"
                      value={eighthSection.shortParagraph}
                      onChange={handleEighthChange}
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
      </div>
      <div>
        <div className="super-dashboard-common-heading">
          <h5>Home Page Ninth Content Update Here</h5>
        </div>

        <div className="super-dashboard-cms-content-form">
          <div className="container">
            <form onSubmit={handleNinthSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mainTitle"
                      placeholder="Main Title"
                      value={ninthSection.mainTitle}
                      onChange={handleNinthChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Main Title Short Paragraph</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shortParagraph"
                      placeholder="Main Title Short Paragraph"
                      value={ninthSection.shortParagraph}
                      onChange={handleNinthChange}
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
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default HomePageContent;
