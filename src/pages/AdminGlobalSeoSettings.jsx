import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { getAuthRequestConfig } from "../utils/authToken";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminGlobalSeoSettings.css";

// Material UI Icons
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const AdminGlobalSeoSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    siteName: "TopCareer Portal",
    siteUrl: "https://topcareer.example.com",
    titleTemplate: "%s | TopCareer Portal - Find Your Dream Career",
    defaultTitle: "TopCareer Portal - Find Top Tech, Remote & Full-time Jobs",
    defaultDescription:
      "Discover thousands of curated job vacancies from top hiring companies worldwide. Apply directly with one click.",
    defaultKeywords: "jobs, careers, hiring, recruitment, employment, remote jobs",
    defaultOgImage: null,
    defaultOgImageUrl: "",
    defaultRobots: "index, follow",
    canonicalBaseUrl: "https://topcareer.example.com",

    // Search Engine Verifications
    googleSiteVerification: "google-site-verification-token-12345",
    bingSiteVerification: "bing-site-verification-token",
    yandexVerification: "",

    // Analytics & Trackers
    googleAnalyticsId: "G-TEST123456",
    googleTagManagerId: "GTM-XXXXXXX",
    metaPixelId: "1234567890",
    customHeadTags: "",

    // Robots.txt Settings
    robotsTxt: {
      customContent: "",
      allowPaths: ["/", "/jobs", "/about", "/contact", "/blogs"],
      disallowPaths: ["/api/", "/admin/", "/recruiter/", "/uploads/resumes/"],
    },

    // Sitemap Settings
    sitemap: {
      includeJobs: true,
      includeBlogs: true,
      includeCompanies: true,
      includeStaticPages: true,
      jobChangeFreq: "daily",
      jobPriority: 0.8,
      staticPagesChangeFreq: "weekly",
      staticPagesPriority: 0.9,
    },
  });

  // Path inputs for Robots.txt pill editors
  const [newAllowPath, setNewAllowPath] = useState("");
  const [newDisallowPath, setNewDisallowPath] = useState("");
  const [ogImagePreview, setOgImagePreview] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Global SEO Configuration
  const fetchGlobalSeoConfig = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setLoading(true);
    const primaryUrl = `${API_BASE_URL}admin/seo/global`;
    const secondaryUrl = `${API_BASE_URL}getGlobalSeoConfig`;

    try {
      const config = getAuthRequestConfig({ skipGlobalLoader: true });
      let response;

      try {
        response = await axios.get(primaryUrl, config);
      } catch (err) {
        if (err.response?.status === 404) {
          response = await axios.get(secondaryUrl, config);
        } else {
          throw err;
        }
      }

      if (response.data && response.data.success && response.data.data) {
        const d = response.data.data;
        const keywordsStr = Array.isArray(d.defaultKeywords)
          ? d.defaultKeywords.join(", ")
          : d.defaultKeywords || "";

        setForm((prev) => ({
          ...prev,
          siteName: d.siteName || prev.siteName,
          siteUrl: d.siteUrl || prev.siteUrl,
          titleTemplate: d.titleTemplate || prev.titleTemplate,
          defaultTitle: d.defaultTitle || prev.defaultTitle,
          defaultDescription: d.defaultDescription || prev.defaultDescription,
          defaultKeywords: keywordsStr || prev.defaultKeywords,
          defaultOgImageUrl: d.defaultOgImage || prev.defaultOgImageUrl,
          defaultRobots: d.defaultRobots || prev.defaultRobots,
          canonicalBaseUrl: d.canonicalBaseUrl || prev.canonicalBaseUrl,

          googleSiteVerification:
            d.googleSiteVerification ||
            d.verificationTags?.google ||
            prev.googleSiteVerification,
          bingSiteVerification:
            d.bingSiteVerification ||
            d.verificationTags?.bing ||
            prev.bingSiteVerification,
          yandexVerification:
            d.yandexVerification ||
            d.verificationTags?.yandex ||
            prev.yandexVerification,

          googleAnalyticsId:
            d.googleAnalyticsId ||
            d.analytics?.googleAnalyticsId ||
            prev.googleAnalyticsId,
          googleTagManagerId:
            d.googleTagManagerId ||
            d.analytics?.googleTagManagerId ||
            prev.googleTagManagerId,
          metaPixelId:
            d.metaPixelId || d.analytics?.metaPixelId || prev.metaPixelId,
          customHeadTags: d.customHeadTags || prev.customHeadTags,

          robotsTxt: {
            customContent: d.robotsTxt?.customContent || "",
            allowPaths:
              d.robotsTxt?.allowPaths || prev.robotsTxt.allowPaths,
            disallowPaths:
              d.robotsTxt?.disallowPaths || prev.robotsTxt.disallowPaths,
          },

          sitemap: {
            includeJobs:
              d.sitemap?.includeJobs !== undefined
                ? d.sitemap.includeJobs
                : true,
            includeBlogs:
              d.sitemap?.includeBlogs !== undefined
                ? d.sitemap.includeBlogs
                : true,
            includeCompanies:
              d.sitemap?.includeCompanies !== undefined
                ? d.sitemap.includeCompanies
                : true,
            includeStaticPages:
              d.sitemap?.includeStaticPages !== undefined
                ? d.sitemap.includeStaticPages
                : true,
            jobChangeFreq: d.sitemap?.jobChangeFreq || "daily",
            jobPriority: d.sitemap?.jobPriority || 0.8,
            staticPagesChangeFreq:
              d.sitemap?.staticPagesChangeFreq || "weekly",
            staticPagesPriority: d.sitemap?.staticPagesPriority || 0.9,
          },
        }));

        if (d.defaultOgImage) {
          const imgUrl = /^https?:\/\//i.test(d.defaultOgImage)
            ? d.defaultOgImage
            : `${API_IMAGE_URL}${d.defaultOgImage.replace(/^\//, "")}`;
          setOgImagePreview(imgUrl);
        }

        if (isRefresh) {
          toast.success("Global SEO settings refreshed successfully!");
        }
      }
    } catch (error) {
      console.warn("Global SEO API call fallback used:", error);
      if (isRefresh) {
        toast.info("Refreshed with latest available data.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalSeoConfig();
  }, [fetchGlobalSeoConfig]);

  // Handle generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested object input change
  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Image Upload Handler
  const handleOgImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, defaultOgImage: file }));
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  // Robots.txt Path List Handlers
  const handleAddAllowPath = () => {
    if (newAllowPath.trim()) {
      const formatted = newAllowPath.trim().startsWith("/")
        ? newAllowPath.trim()
        : `/${newAllowPath.trim()}`;
      setForm((prev) => ({
        ...prev,
        robotsTxt: {
          ...prev.robotsTxt,
          allowPaths: [...prev.robotsTxt.allowPaths, formatted],
        },
      }));
      setNewAllowPath("");
    }
  };

  const handleRemoveAllowPath = (index) => {
    setForm((prev) => ({
      ...prev,
      robotsTxt: {
        ...prev.robotsTxt,
        allowPaths: prev.robotsTxt.allowPaths.filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddDisallowPath = () => {
    if (newDisallowPath.trim()) {
      const formatted = newDisallowPath.trim().startsWith("/")
        ? newDisallowPath.trim()
        : `/${newDisallowPath.trim()}`;
      setForm((prev) => ({
        ...prev,
        robotsTxt: {
          ...prev.robotsTxt,
          disallowPaths: [...prev.robotsTxt.disallowPaths, formatted],
        },
      }));
      setNewDisallowPath("");
    }
  };

  const handleRemoveDisallowPath = (index) => {
    setForm((prev) => ({
      ...prev,
      robotsTxt: {
        ...prev.robotsTxt,
        disallowPaths: prev.robotsTxt.disallowPaths.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  // Save Settings Payload Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const primaryUrl = `${API_BASE_URL}admin/seo/global`;
    const secondaryUrl = `${API_BASE_URL}updateGlobalSeoConfig`;

    try {
      const keywordsArray = form.defaultKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      let payload;
      let headers = {};

      if (form.defaultOgImage instanceof File) {
        // Multipart Form Data for File Upload
        payload = new FormData();
        payload.append("siteName", form.siteName);
        payload.append("siteUrl", form.siteUrl);
        payload.append("titleTemplate", form.titleTemplate);
        payload.append("defaultTitle", form.defaultTitle);
        payload.append("defaultDescription", form.defaultDescription);
        payload.append("defaultKeywords", JSON.stringify(keywordsArray));
        payload.append("defaultRobots", form.defaultRobots);
        payload.append("canonicalBaseUrl", form.canonicalBaseUrl);
        payload.append("googleSiteVerification", form.googleSiteVerification);
        payload.append("bingSiteVerification", form.bingSiteVerification);
        payload.append("yandexVerification", form.yandexVerification);
        payload.append("googleAnalyticsId", form.googleAnalyticsId);
        payload.append("googleTagManagerId", form.googleTagManagerId);
        payload.append("metaPixelId", form.metaPixelId);
        payload.append("customHeadTags", form.customHeadTags);
        payload.append("robotsTxt", JSON.stringify(form.robotsTxt));
        payload.append("sitemap", JSON.stringify(form.sitemap));
        payload.append("defaultOgImage", form.defaultOgImage);

        headers = { "Content-Type": "multipart/form-data" };
      } else {
        // JSON Payload
        payload = {
          siteName: form.siteName,
          siteUrl: form.siteUrl,
          titleTemplate: form.titleTemplate,
          defaultTitle: form.defaultTitle,
          defaultDescription: form.defaultDescription,
          defaultKeywords: keywordsArray,
          defaultOgImage: form.defaultOgImageUrl,
          defaultRobots: form.defaultRobots,
          canonicalBaseUrl: form.canonicalBaseUrl,
          googleSiteVerification: form.googleSiteVerification,
          bingSiteVerification: form.bingSiteVerification,
          yandexVerification: form.yandexVerification,
          googleAnalyticsId: form.googleAnalyticsId,
          googleTagManagerId: form.googleTagManagerId,
          metaPixelId: form.metaPixelId,
          customHeadTags: form.customHeadTags,
          robotsTxt: form.robotsTxt,
          sitemap: form.sitemap,
        };
        headers = { "Content-Type": "application/json" };
      }

      const config = getAuthRequestConfig({ headers });
      let response;

      try {
        response = await axios.post(primaryUrl, payload, config);
      } catch (err) {
        if (err.response?.status === 404) {
          response = await axios.post(secondaryUrl, payload, config);
        } else {
          throw err;
        }
      }

      if (response.data && response.data.success) {
        toast.success("Global SEO configuration saved successfully!");
        fetchGlobalSeoConfig();
      } else {
        toast.success(
          response.data?.message || "Global SEO settings updated!"
        );
      }
    } catch (error) {
      console.warn("Error saving SEO config:", error);
      toast.error(
        error.response?.data?.message || "Failed to update Global SEO settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-seo-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page Header */}
      <div className="admin-seo-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h2>Global SEO & Meta Configuration</h2>
          <p>
            Manage site-wide meta tags, Search Console verification, Analytics IDs, Robots.txt, and Dynamic XML Sitemap.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => fetchGlobalSeoConfig(true)}
            disabled={refreshing || loading}
          >
            <RefreshIcon
              className={refreshing ? "spin-icon" : ""}
              style={{ fontSize: 18 }}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="btn btn-save-seo d-flex align-items-center gap-2"
            onClick={handleSubmit}
            disabled={saving || loading}
          >
            <SaveIcon style={{ fontSize: 18 }} />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom-0">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === "general" ? "active" : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <LanguageIcon style={{ fontSize: 18 }} /> General & Meta
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === "verification" ? "active" : ""
            }`}
            onClick={() => setActiveTab("verification")}
          >
            <SearchIcon style={{ fontSize: 18 }} /> Search Engine Verification
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === "analytics" ? "active" : ""
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <AnalyticsIcon style={{ fontSize: 18 }} /> Analytics & Trackers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === "robots" ? "active" : ""
            }`}
            onClick={() => setActiveTab("robots")}
          >
            <SmartToyIcon style={{ fontSize: 18 }} /> Robots.txt Editor
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 ${
              activeTab === "sitemap" ? "active" : ""
            }`}
            onClick={() => setActiveTab("sitemap")}
          >
            <AltRouteIcon style={{ fontSize: 18 }} /> Dynamic XML Sitemap
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading SEO Settings...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* TAB 1: General & Meta Settings */}
          {activeTab === "general" && (
            <div className="seo-card">
              <div className="seo-card-title">
                <span>Site Info & Fallback Meta Tags</span>
                <span className="badge bg-primary">Global Scope</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6 seo-form-group">
                  <label>Website Brand Name (`siteName`)</label>
                  <input
                    type="text"
                    name="siteName"
                    value={form.siteName}
                    onChange={handleChange}
                    placeholder="TopCareer Portal"
                    required
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Production Domain URL (`siteUrl`)</label>
                  <input
                    type="url"
                    name="siteUrl"
                    value={form.siteUrl}
                    onChange={handleChange}
                    placeholder="https://topcareer.example.com"
                    required
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Title Template (`titleTemplate`)</label>
                  <input
                    type="text"
                    name="titleTemplate"
                    value={form.titleTemplate}
                    onChange={handleChange}
                    placeholder="%s | TopCareer Portal"
                  />
                  <small className="text-muted">
                    Use `%s` as the placeholder for dynamic page titles.
                  </small>
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Canonical Base URL (`canonicalBaseUrl`)</label>
                  <input
                    type="url"
                    name="canonicalBaseUrl"
                    value={form.canonicalBaseUrl}
                    onChange={handleChange}
                    placeholder="https://topcareer.example.com"
                  />
                </div>
                <div className="col-md-12 seo-form-group">
                  <label>Default Page Title (`defaultTitle`)</label>
                  <input
                    type="text"
                    name="defaultTitle"
                    value={form.defaultTitle}
                    onChange={handleChange}
                    placeholder="TopCareer Portal - Find Top Tech & Remote Jobs"
                  />
                </div>
                <div className="col-md-12 seo-form-group">
                  <label>Default Meta Description (`defaultDescription`)</label>
                  <textarea
                    rows={3}
                    name="defaultDescription"
                    value={form.defaultDescription}
                    onChange={handleChange}
                    placeholder="Discover thousands of curated job vacancies..."
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Default Keywords (`defaultKeywords`)</label>
                  <input
                    type="text"
                    name="defaultKeywords"
                    value={form.defaultKeywords}
                    onChange={handleChange}
                    placeholder="jobs, careers, hiring, remote jobs"
                  />
                  <small className="text-muted">Comma-separated list</small>
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Default Robots Directives (`defaultRobots`)</label>
                  <input
                    type="text"
                    name="defaultRobots"
                    value={form.defaultRobots}
                    onChange={handleChange}
                    placeholder="index, follow"
                  />
                </div>

                {/* OG Image */}
                <div className="col-md-12 seo-form-group mt-2">
                  <label>Default Social OpenGraph Banner (`defaultOgImage`)</label>
                  <div className="d-flex align-items-center gap-3">
                    {ogImagePreview && (
                      <div className="border rounded p-1 bg-light">
                        <img
                          src={ogImagePreview}
                          alt="Default OG Preview"
                          style={{
                            height: "60px",
                            maxWidth: "120px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleOgImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Search Engine Verification */}
          {activeTab === "verification" && (
            <div className="seo-card">
              <div className="seo-card-title">
                <span>Webmaster & Search Console Verification Tokens</span>
              </div>
              <div className="row g-3">
                <div className="col-md-12 seo-form-group">
                  <label>Google Search Console Verification (`googleSiteVerification`)</label>
                  <input
                    type="text"
                    name="googleSiteVerification"
                    value={form.googleSiteVerification}
                    onChange={handleChange}
                    placeholder="google-site-verification-token-12345"
                  />
                  <small className="text-muted">
                    Injects <code>&lt;meta name="google-site-verification" content="..." /&gt;</code> into <code>&lt;head&gt;</code>
                  </small>
                </div>
                <div className="col-md-12 seo-form-group">
                  <label>Bing Webmaster Validation Code (`bingSiteVerification`)</label>
                  <input
                    type="text"
                    name="bingSiteVerification"
                    value={form.bingSiteVerification}
                    onChange={handleChange}
                    placeholder="bing-site-verification-token"
                  />
                  <small className="text-muted">
                    Injects <code>&lt;meta name="msvalidate.01" content="..." /&gt;</code> into <code>&lt;head&gt;</code>
                  </small>
                </div>
                <div className="col-md-12 seo-form-group">
                  <label>Yandex Webmaster Code (`yandexVerification`)</label>
                  <input
                    type="text"
                    name="yandexVerification"
                    value={form.yandexVerification}
                    onChange={handleChange}
                    placeholder="yandex-verification-token"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Analytics & Trackers */}
          {activeTab === "analytics" && (
            <div className="seo-card">
              <div className="seo-card-title">
                <span>Analytics Measurement & Pixel IDs</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6 seo-form-group">
                  <label>Google Analytics 4 Measurement ID (`googleAnalyticsId`)</label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={form.googleAnalyticsId}
                    onChange={handleChange}
                    placeholder="G-TEST123456"
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Google Tag Manager Container ID (`googleTagManagerId`)</label>
                  <input
                    type="text"
                    name="googleTagManagerId"
                    value={form.googleTagManagerId}
                    onChange={handleChange}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Meta / Facebook Pixel ID (`metaPixelId`)</label>
                  <input
                    type="text"
                    name="metaPixelId"
                    value={form.metaPixelId}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                </div>
                <div className="col-md-12 seo-form-group">
                  <label>Custom Header Scripts / Tags (`customHeadTags`)</label>
                  <textarea
                    rows={4}
                    name="customHeadTags"
                    value={form.customHeadTags}
                    onChange={handleChange}
                    placeholder="<!-- Custom meta or script tags -->"
                    style={{ fontFamily: "monospace", fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Robots.txt Editor */}
          {activeTab === "robots" && (
            <div className="seo-card">
              <div className="seo-card-title">
                <span>Crawler Directives & Robots.txt Config</span>
                <a
                  href={`${form.siteUrl.replace(/\/$/, "")}/robots.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-link-badge"
                >
                  View Live robots.txt <OpenInNewIcon style={{ fontSize: 16 }} />
                </a>
              </div>

              {/* Allow Paths */}
              <div className="mb-4">
                <label className="fw-semibold text-success mb-2 d-block">
                  Allowed Crawler Paths (`allowPaths`)
                </label>
                <div className="d-flex flex-wrap align-items-center mb-2">
                  {form.robotsTxt.allowPaths.map((path, idx) => (
                    <span key={idx} className="path-pill text-success">
                      Allow: {path}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllowPath(idx)}
                      >
                        <CloseIcon style={{ fontSize: 14 }} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="input-group style-input-group style-sm max-w-md">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. /jobs"
                    value={newAllowPath}
                    onChange={(e) => setNewAllowPath(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-success d-flex align-items-center gap-1"
                    type="button"
                    onClick={handleAddAllowPath}
                  >
                    <AddIcon style={{ fontSize: 16 }} /> Add Path
                  </button>
                </div>
              </div>

              {/* Disallow Paths */}
              <div className="mb-4 border-top pt-3">
                <label className="fw-semibold text-danger mb-2 d-block">
                  Disallowed Crawler Paths (`disallowPaths`)
                </label>
                <div className="d-flex flex-wrap align-items-center mb-2">
                  {form.robotsTxt.disallowPaths.map((path, idx) => (
                    <span key={idx} className="path-pill text-danger">
                      Disallow: {path}
                      <button
                        type="button"
                        onClick={() => handleRemoveDisallowPath(idx)}
                      >
                        <CloseIcon style={{ fontSize: 14 }} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="input-group style-input-group style-sm max-w-md">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. /admin/"
                    value={newDisallowPath}
                    onChange={(e) => setNewDisallowPath(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-danger d-flex align-items-center gap-1"
                    type="button"
                    onClick={handleAddDisallowPath}
                  >
                    <AddIcon style={{ fontSize: 16 }} /> Disallow Path
                  </button>
                </div>
              </div>

              {/* Custom Content */}
              <div className="border-top pt-3 seo-form-group">
                <label>Custom Raw Robots.txt Rules (`customContent`)</label>
                <textarea
                  rows={4}
                  value={form.robotsTxt.customContent}
                  onChange={(e) =>
                    handleNestedChange("robotsTxt", "customContent", e.target.value)
                  }
                  placeholder="User-agent: BadBot&#10;Disallow: /"
                  style={{ fontFamily: "monospace", fontSize: "13px" }}
                />
              </div>
            </div>
          )}

          {/* TAB 5: Dynamic XML Sitemap */}
          {activeTab === "sitemap" && (
            <div className="seo-card">
              <div className="seo-card-title">
                <span>Dynamic XML Sitemap Generator Configuration</span>
                <a
                  href={`${form.siteUrl.replace(/\/$/, "")}/sitemap.xml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-link-badge"
                >
                  View Live sitemap.xml <OpenInNewIcon style={{ fontSize: 16 }} />
                </a>
              </div>

              {/* Toggles */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="form-check form-switch card p-3 h-100">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="includeJobs"
                      checked={form.sitemap.includeJobs}
                      onChange={(e) =>
                        handleNestedChange(
                          "sitemap",
                          "includeJobs",
                          e.target.checked
                        )
                      }
                    />
                    <label className="form-check-label fw-bold" htmlFor="includeJobs">
                      Include Job Postings
                    </label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check form-switch card p-3 h-100">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="includeBlogs"
                      checked={form.sitemap.includeBlogs}
                      onChange={(e) =>
                        handleNestedChange(
                          "sitemap",
                          "includeBlogs",
                          e.target.checked
                        )
                      }
                    />
                    <label className="form-check-label fw-bold" htmlFor="includeBlogs">
                      Include Blogs
                    </label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check form-switch card p-3 h-100">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="includeCompanies"
                      checked={form.sitemap.includeCompanies}
                      onChange={(e) =>
                        handleNestedChange(
                          "sitemap",
                          "includeCompanies",
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="includeCompanies"
                    >
                      Include Companies
                    </label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check form-switch card p-3 h-100">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="includeStaticPages"
                      checked={form.sitemap.includeStaticPages}
                      onChange={(e) =>
                        handleNestedChange(
                          "sitemap",
                          "includeStaticPages",
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="includeStaticPages"
                    >
                      Include Static Pages
                    </label>
                  </div>
                </div>
              </div>

              {/* Frequencies & Priorities */}
              <div className="row g-3">
                <div className="col-md-6 seo-form-group">
                  <label>Jobs Change Frequency (`jobChangeFreq`)</label>
                  <select
                    value={form.sitemap.jobChangeFreq}
                    onChange={(e) =>
                      handleNestedChange(
                        "sitemap",
                        "jobChangeFreq",
                        e.target.value
                      )
                    }
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                  </select>
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Jobs Priority (`jobPriority` - 0.0 to 1.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="1.0"
                    value={form.sitemap.jobPriority}
                    onChange={(e) =>
                      handleNestedChange(
                        "sitemap",
                        "jobPriority",
                        parseFloat(e.target.value) || 0.8
                      )
                    }
                  />
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Static Pages Change Frequency (`staticPagesChangeFreq`)</label>
                  <select
                    value={form.sitemap.staticPagesChangeFreq}
                    onChange={(e) =>
                      handleNestedChange(
                        "sitemap",
                        "staticPagesChangeFreq",
                        e.target.value
                      )
                    }
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                  </select>
                </div>
                <div className="col-md-6 seo-form-group">
                  <label>Static Pages Priority (`staticPagesPriority` - 0.0 to 1.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="1.0"
                    value={form.sitemap.staticPagesPriority}
                    onChange={(e) =>
                      handleNestedChange(
                        "sitemap",
                        "staticPagesPriority",
                        parseFloat(e.target.value) || 0.9
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button Bar */}
          <div className="d-flex justify-content-end mb-4">
            <button
              type="submit"
              className="btn btn-save-seo d-flex align-items-center gap-2"
              disabled={saving}
            >
              <SaveIcon style={{ fontSize: 18 }} />
              {saving ? "Saving Configuration..." : "Save Global SEO Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminGlobalSeoSettings;
