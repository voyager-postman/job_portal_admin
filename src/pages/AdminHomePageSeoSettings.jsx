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
  ogImageDescription: "",
  organizationLogo: null,
  organizationLogoDescription: "",
  enableWebsiteSchema: true,
  enableOrganizationSchema: true,
  enableJobPostingSchema: true,
  website: {
    name: "",
    url: "",
    description: "",
    searchUrl: "",
  },
  organization: {
    name: "",
    url: "",
    description: "",
    email: "",
    phone: "",
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "",
    },
    sameAs: "",
  },
});

const extractMediaPath = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value.path || value.url || value.image || value.src || "";
  }
  return "";
};

const extractMediaDescription = (value) => {
  if (value && typeof value === "object") {
    return value.description || value.alt || value.caption || "";
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

const normalizeSameAs = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
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

function AdminHomePageSeoSettings() {
  const location = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [ogImagePreview, setOgImagePreview] = useState("");
  const [orgLogoPreview, setOrgLogoPreview] = useState("");
  const [openSchemaPanel, setOpenSchemaPanel] = useState("website");

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await axios.get(
        `${API_BASE_URL}getHomePageSeoConfig`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true }),
      );
      const data = getConfigPayload(res);
      const metaTags = data.metaTags || {};
      const jsonLd = data.jsonLd || {};
      const website = jsonLd.website || data.website || {};
      const organization = jsonLd.organization || data.organization || {};
      const address = organization.address || {};
      const ogImageValue = metaTags.ogImage ?? data.ogImage ?? null;
      const organizationLogoValue =
        organization.logo ?? data.organizationLogo ?? null;

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
        ogImageDescription:
          extractMediaDescription(ogImageValue) ||
          metaTags.ogImageDescription ||
          data.ogImageDescription ||
          "",
        organizationLogo:
          extractMediaPath(organizationLogoValue) ||
          organizationLogoValue ||
          null,
        organizationLogoDescription:
          extractMediaDescription(organizationLogoValue) ||
          organization.logoDescription ||
          data.organizationLogoDescription ||
          "",
        enableWebsiteSchema: parseActiveFlag(
          jsonLd.enableWebsiteSchema ?? data.enableWebsiteSchema ?? true,
        ),
        enableOrganizationSchema: parseActiveFlag(
          jsonLd.enableOrganizationSchema ??
            data.enableOrganizationSchema ??
            true,
        ),
        enableJobPostingSchema: parseActiveFlag(
          jsonLd.enableJobPostingSchema ?? data.enableJobPostingSchema ?? true,
        ),
        website: {
          name: website.name || "",
          url: website.url || "",
          description: website.description || data.websiteDescription || "",
          searchUrl: website.searchUrl || "",
        },
        organization: {
          name: organization.name || "",
          url: organization.url || "",
          description:
            organization.description || data.organizationDescription || "",
          email: organization.email || "",
          phone: organization.phone || "",
          address: {
            streetAddress: address.streetAddress || "",
            addressLocality: address.addressLocality || "",
            addressRegion: address.addressRegion || "",
            postalCode: address.postalCode || "",
            addressCountry: address.addressCountry || "",
          },
          sameAs: normalizeSameAs(organization.sameAs),
        },
      });
      setOgImagePreview(resolveImageUrl(ogImageValue));
      setOrgLogoPreview(resolveImageUrl(organizationLogoValue));
    } catch {
      toast.error("Failed to load home page SEO config");
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        address: {
          ...prev.organization.address,
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (field, previewSetter) => (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, [field]: file }));
      previewSetter(URL.createObjectURL(file));
    }
  };

  const buildFormData = () => {
    const keywords = form.keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const metaTags = {
      title: form.title.trim(),
      description: form.description.trim(),
      keywords,
      ogTitle: form.ogTitle.trim(),
      ogDescription: form.ogDescription.trim(),
      canonicalUrl: form.canonicalUrl.trim(),
      robots: form.robots.trim(),
    };

    const jsonLd = {
      enableWebsiteSchema: form.enableWebsiteSchema,
      enableOrganizationSchema: form.enableOrganizationSchema,
      enableJobPostingSchema: form.enableJobPostingSchema,
      website: {
        name: form.website.name.trim(),
        url: form.website.url.trim(),
        description: form.website.description.trim(),
        searchUrl: form.website.searchUrl.trim(),
      },
      organization: {
        name: form.organization.name.trim(),
        url: form.organization.url.trim(),
        description: form.organization.description.trim(),
        email: form.organization.email.trim(),
        phone: form.organization.phone.trim(),
        address: {
          streetAddress: form.organization.address.streetAddress.trim(),
          addressLocality: form.organization.address.addressLocality.trim(),
          addressRegion: form.organization.address.addressRegion.trim(),
          postalCode: form.organization.address.postalCode.trim(),
          addressCountry: form.organization.address.addressCountry.trim(),
        },
        sameAs: form.organization.sameAs
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
      },
    };

    const payload = new FormData();
    payload.append("isActive", String(form.isActive));
    payload.append("metaTags", JSON.stringify(metaTags));
    payload.append("jsonLd", JSON.stringify(jsonLd));

    // Flat fields kept for backward compatibility with the API
    payload.append("title", metaTags.title);
    payload.append("description", metaTags.description);
    payload.append("keywords", form.keywords.trim());
    payload.append("ogTitle", metaTags.ogTitle);
    payload.append("ogDescription", metaTags.ogDescription);
    payload.append("canonicalUrl", metaTags.canonicalUrl);
    payload.append("robots", metaTags.robots);
    payload.append("enableWebsiteSchema", String(jsonLd.enableWebsiteSchema));
    payload.append(
      "enableOrganizationSchema",
      String(jsonLd.enableOrganizationSchema),
    );
    payload.append(
      "enableJobPostingSchema",
      String(jsonLd.enableJobPostingSchema),
    );
    payload.append("website", JSON.stringify(jsonLd.website));
    payload.append("organization", JSON.stringify(jsonLd.organization));

    if (form.ogImageDescription.trim()) {
      payload.append("ogImageDescription", form.ogImageDescription.trim());
    }
    if (form.organizationLogoDescription.trim()) {
      payload.append(
        "organizationLogoDescription",
        form.organizationLogoDescription.trim(),
      );
    }

    if (form.ogImage instanceof File) {
      payload.append("ogImage", form.ogImage);
    }
    if (form.organizationLogo instanceof File) {
      payload.append("organizationLogo", form.organizationLogo);
    }

    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Page title is required");
      return;
    }

    try {
      setSaveLoading(true);
      const authConfig = await ensureAuthRequestConfig({
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await axios.post(
        `${API_BASE_URL}updateHomePageSeoConfig`,
        buildFormData(),
        authConfig,
      );

      if (res.data?.success !== false) {
        toast.success("Home page SEO settings saved");
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save SEO settings");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save home page SEO settings",
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
          <h4>Home Page SEO</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Meta Tags &amp; JSON-LD
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg p-3">
          <p className="text-muted mb-3">
            Configure home page meta tags and structured data (JSON-LD). Active
            settings are served to the public site via{" "}
            <code>GET /api/public/homePageSeo</code>. JobPosting schema entries
            are auto-generated from published jobs with home page visibility
            enabled.
          </p>

          {fetchLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div>
                  <strong>Enable Home Page SEO</strong>
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
                    placeholder="ConnectWork - Find Jobs in Morocco"
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
                    placeholder="Discover top jobs and freelancers..."
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
                    placeholder="jobs, careers, morocco, freelance"
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
                    placeholder="https://sisccltd.com/job_portal/"
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
                    placeholder="ConnectWork Jobs"
                  />
                </div>
                <SeoImageUpload
                  label="OG Image"
                  inputId="ogImageInput"
                  fileName={getImageFileName(form.ogImage)}
                  preview={ogImagePreview}
                  onChange={handleImageChange("ogImage", setOgImagePreview)}
                />
                <div className="col-md-12">
                  <label className="form-label">OG Image Description</label>
                  <textarea
                    className="form-control"
                    name="ogImageDescription"
                    rows={2}
                    value={form.ogImageDescription}
                    onChange={handleChange}
                    placeholder="Alt text or caption for the OG image"
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">OG Description</label>
                  <textarea
                    className="form-control"
                    name="ogDescription"
                    rows={2}
                    value={form.ogDescription}
                    onChange={handleChange}
                    placeholder="Best job portal in Morocco"
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3">JSON-LD Schema</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="enableWebsiteSchema"
                      name="enableWebsiteSchema"
                      checked={form.enableWebsiteSchema}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="enableWebsiteSchema"
                    >
                      WebSite schema
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="enableOrganizationSchema"
                      name="enableOrganizationSchema"
                      checked={form.enableOrganizationSchema}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="enableOrganizationSchema"
                    >
                      Organization schema
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="enableJobPostingSchema"
                      name="enableJobPostingSchema"
                      checked={form.enableJobPostingSchema}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="enableJobPostingSchema"
                    >
                      JobPosting schema (auto from jobs)
                    </label>
                  </div>
                </div>
              </div>

              <div className="accordion mb-4" id="seoSchemaAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button ${openSchemaPanel === "website" ? "" : "collapsed"}`}
                      onClick={() =>
                        setOpenSchemaPanel((prev) =>
                          prev === "website" ? "" : "website",
                        )
                      }
                    >
                      WebSite Schema
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${openSchemaPanel === "website" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.website.name}
                            onChange={(e) =>
                              handleNestedChange(
                                "website",
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={form.website.url}
                            onChange={(e) =>
                              handleNestedChange("website", "url", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={form.website.description}
                            onChange={(e) =>
                              handleNestedChange(
                                "website",
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Job portal description for WebSite schema"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Search URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={form.website.searchUrl}
                            onChange={(e) =>
                              handleNestedChange(
                                "website",
                                "searchUrl",
                                e.target.value,
                              )
                            }
                            placeholder="https://example.com/jobs?keyword={search_term_string}"
                          />
                          <small className="text-muted">
                            Use <code>{"{search_term_string}"}</code> as the
                            search placeholder.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button ${openSchemaPanel === "organization" ? "" : "collapsed"}`}
                      onClick={() =>
                        setOpenSchemaPanel((prev) =>
                          prev === "organization" ? "" : "organization",
                        )
                      }
                    >
                      Organization Schema
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${openSchemaPanel === "organization" ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.name}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={form.organization.url}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "url",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={form.organization.description}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Organization description for JSON-LD"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={form.organization.email}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "email",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.phone}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "phone",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <SeoImageUpload
                          label="Organization Logo"
                          inputId="organizationLogoInput"
                          fileName={getImageFileName(form.organizationLogo)}
                          preview={orgLogoPreview}
                          onChange={handleImageChange(
                            "organizationLogo",
                            setOrgLogoPreview,
                          )}
                        />
                        <div className="col-md-12">
                          <label className="form-label">
                            Organization Logo Description
                          </label>
                          <textarea
                            className="form-control"
                            name="organizationLogoDescription"
                            rows={2}
                            value={form.organizationLogoDescription}
                            onChange={handleChange}
                            placeholder="Alt text or caption for the organization logo"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Street Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.address.streetAddress}
                            onChange={(e) =>
                              handleAddressChange(
                                "streetAddress",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">City / Locality</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.address.addressLocality}
                            onChange={(e) =>
                              handleAddressChange(
                                "addressLocality",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Region / State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.address.addressRegion}
                            onChange={(e) =>
                              handleAddressChange(
                                "addressRegion",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.address.postalCode}
                            onChange={(e) =>
                              handleAddressChange("postalCode", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Country Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.address.addressCountry}
                            onChange={(e) =>
                              handleAddressChange(
                                "addressCountry",
                                e.target.value,
                              )
                            }
                            placeholder="MA"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Same As (social URLs)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={form.organization.sameAs}
                            onChange={(e) =>
                              handleNestedChange(
                                "organization",
                                "sameAs",
                                e.target.value,
                              )
                            }
                            placeholder="https://facebook.com/...,https://linkedin.com/..."
                          />
                          <small className="text-muted">Comma-separated URLs</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info small">
                <i className="fa-solid fa-circle-info me-1" />
                JobPosting JSON-LD is built automatically from jobs that are
                published, active, and have <strong>home page visibility</strong>{" "}
                enabled.
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

export default AdminHomePageSeoSettings;
