import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";
import { getConfigPayload, parseActiveFlag } from "../utils/integrationConfig";
import { toast, ToastContainer } from "react-toastify";

const INTEGRATIONS = [
  {
    id: "gtm",
    label: "Google Tag Manager",
    icon: "fa-solid fa-tags",
    color: "#4285f4",
    getEndpoint: "googleTagManagerConfig",
    saveEndpoint: "saveGoogleTagManagerConfig",
    statusEndpoint: "googleTagManagerConfig/status",
    primaryField: {
      name: "containerId",
      label: "Container ID",
      placeholder: "GTM-XXXXXXX",
      colClass: "col-md-8",
    },
    description: "Injected on the public site via GTM script when active.",
    saveLabel: "Save GTM Config",
    isConfigured: (data) =>
      Boolean(data.configured ?? data.containerId),
    buildForm: (data) => ({
      containerId: data.containerId || "",
      isActive: parseActiveFlag(data.isActive),
      environment: data.environment || "live",
      configured: Boolean(data.configured ?? data.containerId),
    }),
    validate: (form) => {
      if (!form.containerId.trim()) {
        return "Container ID is required";
      }
      return null;
    },
    buildPayload: (form) => ({
      containerId: form.containerId.trim(),
      isActive: form.isActive,
      environment: form.environment,
    }),
  },
  {
    id: "ga",
    label: "Google Analytics (GA4)",
    icon: "fa-solid fa-chart-line",
    color: "#e37400",
    getEndpoint: "googleAnalyticsConfig",
    saveEndpoint: "saveGoogleAnalyticsConfig",
    statusEndpoint: "googleAnalyticsConfig/status",
    primaryField: {
      name: "measurementId",
      label: "Measurement ID",
      placeholder: "G-XXXXXXXXXX",
      colClass: "col-md-8",
    },
    description: "GA4 tag injected on the public site when active.",
    saveLabel: "Save Google Analytics Config",
    isConfigured: (data) =>
      Boolean(data.configured ?? data.measurementId),
    buildForm: (data) => ({
      measurementId: data.measurementId || "",
      isActive: parseActiveFlag(data.isActive),
      environment: data.environment || "live",
      configured: Boolean(data.configured ?? data.measurementId),
    }),
    validate: (form) => {
      if (!form.measurementId.trim()) {
        return "Measurement ID is required";
      }
      return null;
    },
    buildPayload: (form) => ({
      measurementId: form.measurementId.trim(),
      isActive: form.isActive,
      environment: form.environment,
    }),
  },
  {
    id: "gsc",
    label: "Google Search Console",
    icon: "fa-solid fa-magnifying-glass",
    color: "#34a853",
    getEndpoint: "googleSearchConsoleConfig",
    saveEndpoint: "saveGoogleSearchConsoleConfig",
    statusEndpoint: "googleSearchConsoleConfig/status",
    primaryField: {
      name: "verificationCode",
      label: "Verification Code",
      placeholder: "Meta tag content value",
      colClass: "col-md-8",
    },
    extraFields: [
      {
        name: "siteUrl",
        label: "Site URL",
        placeholder: "https://example.com",
        colClass: "col-md-8",
        optional: true,
      },
    ],
    description:
      "Verification meta tag injected on the public site when active.",
    saveLabel: "Save Search Console Config",
    isConfigured: (data) =>
      Boolean(data.configured ?? data.verificationCode),
    buildForm: (data) => ({
      verificationCode: data.verificationCode || "",
      siteUrl: data.siteUrl || "",
      isActive: parseActiveFlag(data.isActive),
      environment: data.environment || "live",
      configured: Boolean(data.configured ?? data.verificationCode),
    }),
    validate: (form) => {
      if (!form.verificationCode.trim()) {
        return "Verification code is required";
      }
      return null;
    },
    buildPayload: (form) => {
      const payload = {
        verificationCode: form.verificationCode.trim(),
        isActive: form.isActive,
        environment: form.environment,
      };
      if (form.siteUrl?.trim()) {
        payload.siteUrl = form.siteUrl.trim();
      }
      return payload;
    },
  },
];

const MarketingPanel = ({ integration, isOpen, onToggle }) => {
  const location = useLocation();
  const [form, setForm] = useState(() => integration.buildForm({}));
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await axios.get(
        `${API_BASE_URL}${integration.getEndpoint}`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true }),
      );
      const data = getConfigPayload(res);
      setForm(integration.buildForm(data));
    } catch {
      toast.error(`Failed to load ${integration.label} config`);
    } finally {
      setFetchLoading(false);
      setConfigLoaded(true);
    }
  }, [integration]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig, location.key]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = async () => {
    const nextActive = !form.isActive;
    try {
      setStatusLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}${integration.statusEndpoint}`,
        { isActive: nextActive },
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        setForm((prev) => ({ ...prev, isActive: nextActive }));
        toast.success(
          `${integration.label} ${nextActive ? "enabled" : "disabled"}`,
        );
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to update ${integration.label} status`,
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationError = integration.validate(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSaveLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}${integration.saveEndpoint}`,
        integration.buildPayload(form),
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        toast.success(`${integration.label} config saved`);
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save config");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to save ${integration.label} config`,
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          type="button"
          className={`accordion-button ${isOpen ? "" : "collapsed"}`}
          onClick={onToggle}
        >
          <i
            className={`${integration.icon} me-2`}
            style={{ color: integration.color }}
          />
          {integration.label}
          {!configLoaded ? (
            <span className="badge bg-light text-dark border ms-3">
              Loading…
            </span>
          ) : (
            <>
              <span
                className={`badge ms-3 ${form.isActive ? "bg-success" : "bg-secondary"}`}
              >
                {form.isActive ? "Active" : "Inactive"}
              </span>
              {form.configured ? (
                <span className="badge bg-primary ms-2">Configured</span>
              ) : (
                <span className="badge bg-warning text-dark ms-2">
                  Not Configured
                </span>
              )}
            </>
          )}
        </button>
      </h2>
      <div className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}>
        <div className="accordion-body">
          {fetchLoading ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div>
                  <strong>Enable {integration.label}</strong>
                  <p className="text-muted mb-0 small">
                    {integration.description}
                  </p>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${form.isActive ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={handleToggleStatus}
                  disabled={statusLoading}
                >
                  {statusLoading
                    ? "Updating…"
                    : form.isActive
                      ? "Enabled"
                      : "Disabled"}
                </button>
              </div>

              <div className="row g-3">
                <div className={integration.primaryField.colClass}>
                  <label className="form-label">
                    {integration.primaryField.label}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name={integration.primaryField.name}
                    value={form[integration.primaryField.name]}
                    onChange={handleChange}
                    placeholder={integration.primaryField.placeholder}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Environment</label>
                  <select
                    className="form-select"
                    name="environment"
                    value={form.environment}
                    onChange={handleChange}
                  >
                    <option value="live">Live</option>
                    <option value="test">Test</option>
                  </select>
                </div>

                {(integration.extraFields || []).map((field) => (
                  <div className={field.colClass} key={field.name}>
                    <label className="form-label">
                      {field.label}
                      {field.optional && (
                        <span className="text-muted small ms-1">(optional)</span>
                      )}
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="alert alert-info mt-3 mb-0 small">
                <i className="fa-solid fa-circle-info me-1" />
                Active values are exposed to the public site via{" "}
                <code>/api/public/googleMarketingConfig</code>.
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="super-dashboard-content-btn"
                  disabled={saveLoading || statusLoading}
                >
                  {saveLoading ? "Saving…" : integration.saveLabel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

function AdminGoogleMarketingSettings() {
  const [openPanel, setOpenPanel] = useState("gtm");

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Google Marketing Settings</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage GTM, GA4 & Search Console
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg p-3">
          <p className="text-muted mb-3">
            Configure Google Tag Manager, Google Analytics (GA4), and Search
            Console verification. Active values are exposed to the public site
            via <code>GET /api/public/googleMarketingConfig</code>.
          </p>

          <div className="accordion" id="googleMarketingAccordion">
            {INTEGRATIONS.map((integration) => (
              <MarketingPanel
                key={integration.id}
                integration={integration}
                isOpen={openPanel === integration.id}
                onToggle={() =>
                  setOpenPanel((prev) =>
                    prev === integration.id ? "" : integration.id,
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminGoogleMarketingSettings;
