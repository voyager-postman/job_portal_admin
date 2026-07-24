import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";
import { getConfigPayload, parseActiveFlag } from "../utils/integrationConfig";
import { toast, ToastContainer } from "react-toastify";

const emptyForm = () => ({
  isActive: true,
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogImage: null,
  enableItemListSchema: true,
  maxJobsInSchema: 20,
  defaultJobsListUrl: "",
});

const extractMediaPath = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.path || value.url || value.image || value.src || "";
  }
  return "";
};

const resolveImageUrl = (value) => {
  const path = extractMediaPath(value);
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${API_IMAGE_URL}${normalized}`;
};

const normalizeKeywords = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
};

const getImageFileName = (value) => {
  if (!value) return "No file selected";
  if (value instanceof File) return value.name;
  if (typeof value === "string") return value.split("/").pop() || "Current Image";
  return "Current Image";
};

const SeoImageUpload = ({ label, inputId, fileName, preview, onChange }) => (
  <div className="col-md-12">
    <div className="section-Img-upload-input">
      <label>{label}</label>
    </div>
    <div className="upload-company-info-area">
      <div className="upload-company-img-preview">
        <img
          crossOrigin="anonymous"
          src={preview}
          className="main-logo"
          alt={`${label} preview`}
        />
      </div>
      <div className="upload-company-input">
        <input
          type="file"
          id={inputId}
          name={inputId}
          accept="image/*"
          onChange={onChange}
        />
      </div>
      <div className="upload-company-file-name">
        <span className="file-name">{fileName}</span>
      </div>
      <div className="upload-company-file-btn">
        <label htmlFor={inputId} className="super-dashboard-custom-upload">
          Choose Img
        </label>
      </div>
    </div>
  </div>
);

function AdminJobsListingSeoSettings() {
  const location = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [ogImagePreview, setOgImagePreview] = useState("");

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await axios.get(
        `${API_BASE_URL}getJobsListingSeoConfig`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true }),
      );
      const data = getConfigPayload(res);
      const metaTags = data.metaTags || {};
      const jsonLd = data.jsonLd || {};
      const ogImageValue = metaTags.ogImage ?? data.ogImage ?? null;

      setForm({
        ...emptyForm(),
        isActive: parseActiveFlag(data.isActive ?? true),
        title: metaTags.title || data.title || "",
        description:
          metaTags.description ||
          metaTags.metaDescription ||
          data.description ||
          data.metaDescription ||
          "",
        keywords: normalizeKeywords(metaTags.keywords ?? data.keywords),
        ogTitle: metaTags.ogTitle || data.ogTitle || "",
        ogDescription:
          metaTags.ogDescription ||
          metaTags.og_description ||
          data.ogDescription ||
          "",
        canonicalUrl: metaTags.canonicalUrl || data.canonicalUrl || "",
        robots: metaTags.robots || data.robots || "index, follow",
        ogImage: extractMediaPath(ogImageValue) || ogImageValue || null,
        enableItemListSchema: parseActiveFlag(
          jsonLd.enableItemListSchema ?? data.enableItemListSchema ?? true,
        ),
        maxJobsInSchema: Number(
          jsonLd.maxJobsInSchema ?? data.maxJobsInSchema ?? 20,
        ),
        defaultJobsListUrl: data.defaultJobsListUrl || "",
      });
      setOgImagePreview(resolveImageUrl(ogImageValue));
    } catch {
      toast.error("Failed to load jobs listing SEO config");
    } finally {
      setFetchLoading(false);
      setConfigLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig, location.key]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "maxJobsInSchema"
            ? Number(value)
            : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, ogImage: file }));
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  const buildFormData = () => {
    const payload = new FormData();
    payload.append("isActive", String(form.isActive));
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("keywords", form.keywords.trim());
    payload.append("ogTitle", form.ogTitle.trim());
    payload.append("ogDescription", form.ogDescription.trim());
    payload.append("canonicalUrl", form.canonicalUrl.trim());
    payload.append("robots", form.robots.trim());
    payload.append("enableItemListSchema", String(form.enableItemListSchema));
    payload.append("maxJobsInSchema", String(form.maxJobsInSchema || 20));

    if (form.ogImage instanceof File) {
      payload.append("ogImage", form.ogImage);
    }

    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Page title is required");
      return;
    }

    if (form.maxJobsInSchema < 1 || form.maxJobsInSchema > 100) {
      toast.error("Max jobs in schema must be between 1 and 100");
      return;
    }

    try {
      setSaveLoading(true);
      const authConfig = await ensureAuthRequestConfig({
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await axios.post(
        `${API_BASE_URL}updateJobsListingSeoConfig`,
        buildFormData(),
        authConfig,
      );

      if (res.data?.success !== false) {
        toast.success("Jobs listing SEO settings saved");
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save SEO settings");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save jobs listing SEO settings",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Jobs Listing SEO</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage /jobs Page Meta Tags &amp; JSON-LD
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg p-3">
          <p className="text-muted mb-3">
            Configure SEO for the public jobs listing page. Active settings are
            served via <code>GET /api/public/jobsListingSeo</code>. ItemList
            JSON-LD entries are auto-generated from published job listings.
          </p>

          {fetchLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div>
                  <strong>Enable Jobs Listing SEO</strong>
                  <p className="text-muted mb-0 small">
                    When disabled, the public API returns inactive SEO config.
                  </p>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isActive"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    {form.isActive ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>

              {configLoaded && (
                <span
                  className={`badge mb-3 ${form.isActive ? "bg-success" : "bg-secondary"}`}
                >
                  {form.isActive ? "SEO Active" : "SEO Inactive"}
                </span>
              )}

              {form.defaultJobsListUrl && (
                <div className="alert alert-secondary small mb-4">
                  <strong>Default jobs list URL:</strong>{" "}
                  <code>{form.defaultJobsListUrl}</code>
                  <div className="text-muted mt-1">
                    Used when canonical URL is left empty.
                  </div>
                </div>
              )}

              <h6 className="border-bottom pb-2 mb-3">Meta Tags</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-12">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Find Jobs | Your Site"
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Browse latest job openings..."
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    placeholder="jobs, careers, hiring"
                  />
                  <small className="text-muted">Comma-separated</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Canonical URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="canonicalUrl"
                    value={form.canonicalUrl}
                    onChange={handleChange}
                    placeholder="https://yoursite.com/jobs"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Robots</label>
                  <input
                    type="text"
                    className="form-control"
                    name="robots"
                    value={form.robots}
                    onChange={handleChange}
                    placeholder="index, follow"
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3">Open Graph</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">OG Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ogTitle"
                    value={form.ogTitle}
                    onChange={handleChange}
                    placeholder="Find Jobs | Your Site"
                  />
                </div>
                <SeoImageUpload
                  label="OG Image"
                  inputId="jobsListingOgImageInput"
                  fileName={getImageFileName(form.ogImage)}
                  preview={ogImagePreview}
                  onChange={handleImageChange}
                />
                <div className="col-md-12">
                  <label className="form-label">OG Description</label>
                  <textarea
                    className="form-control"
                    name="ogDescription"
                    rows={2}
                    value={form.ogDescription}
                    onChange={handleChange}
                    placeholder="Browse latest job openings..."
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3">JSON-LD Schema</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="enableItemListSchema"
                      name="enableItemListSchema"
                      checked={form.enableItemListSchema}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="enableItemListSchema"
                    >
                      Include ItemList schema (auto from jobs)
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Max Jobs in Schema</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxJobsInSchema"
                    min={1}
                    max={100}
                    value={form.maxJobsInSchema}
                    onChange={handleChange}
                  />
                  <small className="text-muted">Default: 20</small>
                </div>
              </div>

              <div className="alert alert-info small">
                <i className="fa-solid fa-circle-info me-1" />
                ItemList JSON-LD is built automatically from published jobs, up
                to the max jobs limit above.
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="super-dashboard-content-btn"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving…" : "Save SEO Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminJobsListingSeoSettings;
