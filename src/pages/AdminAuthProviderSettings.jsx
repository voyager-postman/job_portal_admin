import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";
import { getConfigPayload, parseActiveFlag } from "../utils/integrationConfig";
import { toast, ToastContainer } from "react-toastify";

const PROVIDERS = [
  {
    id: "google",
    type: "oauth",
    label: "Google",
    icon: "fa-brands fa-google",
    color: "#db4437",
    getEndpoint: "googleAuthConfig",
    saveEndpoint: "saveGoogleAuthConfig",
    statusEndpoint: "googleAuthConfig/status",
    callbackPlaceholder: "https://yourdomain.com/api/google/callback",
    extraFields: [],
  },
  {
    id: "linkedin",
    type: "oauth",
    label: "LinkedIn",
    icon: "fa-brands fa-linkedin",
    color: "#0a66c2",
    getEndpoint: "linkedinAuthConfig",
    saveEndpoint: "saveLinkedInAuthConfig",
    statusEndpoint: "linkedinAuthConfig/status",
    callbackPlaceholder: "https://yourdomain.com/api/auth/linkedin/callback",
    extraFields: [],
  },
  {
    id: "github",
    type: "oauth",
    label: "GitHub",
    icon: "fa-brands fa-github",
    color: "#24292f",
    getEndpoint: "githubAuthConfig",
    saveEndpoint: "saveGitHubAuthConfig",
    statusEndpoint: "githubAuthConfig/status",
    callbackPlaceholder: "https://yourdomain.com/api/auth/github/callback",
    extraFields: [],
  },
  {
    id: "linkedin-parse",
    type: "parse",
    label: "LinkedIn Parse",
    icon: "fa-brands fa-linkedin",
    color: "#0a66c2",
    getEndpoint: "linkedinParseConfig",
    saveEndpoint: "saveLinkedInParseConfig",
    statusEndpoint: "linkedinParseConfig/status",
    callbackPlaceholder: "https://your-backend.com/api/linkedin/parse/callback",
    extraFields: [],
    requireCallbackOnFirstSave: true,
  },
];

const emptyForm = (extraFields = []) => {
  const form = {
    clientId: "",
    clientSecret: "",
    callbackUrl: "",
    isActive: false,
    environment: "live",
    hasClientSecret: false,
    configured: false,
  };
  extraFields.forEach((f) => {
    form[f.name] = "";
  });
  return form;
};

const ProviderPanel = ({ provider, isOpen, onToggle }) => {
  const location = useLocation();
  const [form, setForm] = useState(() => emptyForm(provider.extraFields));
  const [showSecret, setShowSecret] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await axios.get(
        `${API_BASE_URL}${provider.getEndpoint}`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true }),
      );
      const data = getConfigPayload(res);

      setForm({
        clientId: data.clientId || "",
        clientSecret: "",
        callbackUrl: data.callbackUrl || "",
        isActive: parseActiveFlag(data.isActive),
        environment: data.environment || "live",
        hasClientSecret: Boolean(data.hasClientSecret),
        configured: Boolean(data.clientId || data.hasClientSecret),
        ...provider.extraFields.reduce((acc, f) => {
          acc[f.name] = data[f.name] || "";
          return acc;
        }, {}),
      });
    } catch {
      toast.error(`Failed to load ${provider.label} config`);
    } finally {
      setFetchLoading(false);
      setConfigLoaded(true);
    }
  }, [provider]);

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

  const handleToggleStatus = async () => {
    const nextActive = !form.isActive;
    try {
      setStatusLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}${provider.statusEndpoint}`,
        { isActive: nextActive },
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        setForm((prev) => ({ ...prev, isActive: nextActive }));
        toast.success(
          `${provider.label} ${provider.type === "parse" ? "config" : "login"} ${
            nextActive ? "enabled" : "disabled"
          }`,
        );
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to update ${provider.label} status`,
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.clientId.trim()) {
      toast.error("Client ID is required");
      return;
    }

    const isFirstSave = !form.configured && !form.hasClientSecret;
    if (isFirstSave && !form.clientSecret.trim()) {
      toast.error("Client Secret is required for first save");
      return;
    }

    if (
      isFirstSave &&
      provider.requireCallbackOnFirstSave &&
      !form.callbackUrl.trim()
    ) {
      toast.error("Callback URL is required for first save");
      return;
    }

    const payload = {
      clientId: form.clientId.trim(),
      callbackUrl: form.callbackUrl.trim(),
      isActive: form.isActive,
      environment: form.environment,
    };

    if (form.clientSecret.trim()) {
      payload.clientSecret = form.clientSecret.trim();
    }

    provider.extraFields.forEach((f) => {
      if (form[f.name]?.trim()) {
        payload[f.name] = form[f.name].trim();
      }
    });

    try {
      setSaveLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}${provider.saveEndpoint}`,
        payload,
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        toast.success(`${provider.label} config saved`);
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save config");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to save ${provider.label} config`,
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
            className={`${provider.icon} me-2`}
            style={{ color: provider.color }}
          />
          {provider.label} {provider.type === "parse" ? "Config" : "OAuth"}
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
              {form.configured || form.hasClientSecret ? (
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
      <div
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
      >
        <div className="accordion-body">
          {fetchLoading ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div>
                  <strong>
                    Enable {provider.label}{" "}
                    {provider.type === "parse" ? "Config" : "Login"}
                  </strong>
                  <p className="text-muted mb-0 small">
                    {provider.type === "parse"
                      ? "When disabled, parse endpoints reject this provider config."
                      : "When disabled, login returns 503 for this provider."}
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
                <div className="col-md-6">
                  <label className="form-label">Client ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="clientId"
                    value={form.clientId}
                    onChange={handleChange}
                    placeholder={`Your ${provider.label} client ID`}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Client Secret
                    {form.hasClientSecret && (
                      <span className="text-muted small ms-1">
                        (leave blank to keep existing)
                      </span>
                    )}
                  </label>
                  <div className="position-relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      className="form-control pe-5"
                      name="clientSecret"
                      value={form.clientSecret}
                      onChange={handleChange}
                      placeholder={
                        form.hasClientSecret
                          ? "••••••••••••••••"
                          : "Your client secret"
                      }
                    />
                    <span
                      onClick={() => setShowSecret(!showSecret)}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#666",
                      }}
                    >
                      <i
                        className={
                          showSecret
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      />
                    </span>
                  </div>
                  {form.hasClientSecret && (
                    <small className="text-success">
                      <i className="fa-solid fa-check me-1" />
                      Secret is stored securely
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Callback URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="callbackUrl"
                    value={form.callbackUrl}
                    onChange={handleChange}
                    placeholder={provider.callbackPlaceholder}
                  />
                </div>

                <div className="col-md-6">
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

                {provider.extraFields.map((field) => (
                  <div className="col-md-12" key={field.name}>
                    <label className="form-label">{field.label}</label>
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

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="super-dashboard-content-btn"
                  disabled={saveLoading || statusLoading}
                >
                  {saveLoading ? "Saving…" : `Save ${provider.label} Config`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

function AdminAuthProviderSettings() {
  const [openProvider, setOpenProvider] = useState("google");

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Auth & Integration Provider Settings</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Social Login and LinkedIn Parse Configuration
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg p-3">
          <p className="text-muted mb-3">
            Configure OAuth credentials for social login. Secrets are never
            returned from the API — only <code>hasClientSecret</code> is shown.
            LinkedIn Parse is configured separately from LinkedIn Login.
          </p>

          <div className="accordion" id="oauthProvidersAccordion">
            {PROVIDERS.map((provider) => (
              <ProviderPanel
                key={provider.id}
                provider={provider}
                isOpen={openProvider === provider.id}
                onToggle={() =>
                  setOpenProvider((prev) =>
                    prev === provider.id ? "" : provider.id,
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

export default AdminAuthProviderSettings;
