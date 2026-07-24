import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";
import { getConfigPayload, parseActiveFlag } from "../utils/integrationConfig";
import { toast, ToastContainer } from "react-toastify";

const configRequest = async (endpoint) =>
  axios.get(
    `${API_BASE_URL}${endpoint}`,
    await ensureAuthRequestConfig({ skipGlobalLoader: true }),
  );

const SmtpPanel = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [form, setForm] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromName: "",
    fromEmail: "",
    adminEmail: "",
    isActive: false,
    environment: "live",
    hasPassword: false,
    configured: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await configRequest("smtpConfig");
      const data = getConfigPayload(res);

      setForm({
        host: data.host || "",
        port: data.port ?? 587,
        secure: Boolean(data.secure),
        user: data.user || "",
        password: "",
        fromName: data.fromName || "",
        fromEmail: data.fromEmail || "",
        adminEmail: data.adminEmail || "",
        isActive: parseActiveFlag(data.isActive),
        environment: data.environment || "live",
        hasPassword: Boolean(data.hasPassword),
        configured: Boolean(
          data.host || data.user || data.hasPassword,
        ),
      });
    } catch {
      toast.error("Failed to load SMTP config");
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
          : name === "port"
            ? Number(value) || ""
            : value,
    }));
  };

  const handleToggleStatus = async () => {
    const nextActive = !form.isActive;
    try {
      setStatusLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}smtpConfig/status`,
        { isActive: nextActive },
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        setForm((prev) => ({ ...prev, isActive: nextActive }));
        toast.success(`SMTP ${nextActive ? "enabled" : "disabled"}`);
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update SMTP status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.host.trim()) {
      toast.error("SMTP host is required");
      return;
    }
    if (!form.port) {
      toast.error("SMTP port is required");
      return;
    }
    if (!form.user.trim()) {
      toast.error("SMTP user is required");
      return;
    }
    if (!form.fromEmail.trim()) {
      toast.error("From email is required");
      return;
    }

    const isFirstSave = !form.configured && !form.hasPassword;
    if (isFirstSave && !form.password.trim()) {
      toast.error("Password is required for first save");
      return;
    }

    const payload = {
      host: form.host.trim(),
      port: Number(form.port),
      secure: form.secure,
      user: form.user.trim(),
      fromName: form.fromName.trim(),
      fromEmail: form.fromEmail.trim(),
      adminEmail: form.adminEmail.trim(),
      isActive: form.isActive,
      environment: form.environment,
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      setSaveLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}saveSmtpConfig`,
        payload,
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        toast.success("SMTP config saved");
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save SMTP config");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save SMTP config",
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
          <i className="fa-solid fa-envelope me-2" style={{ color: "#2e47cc" }} />
          SMTP (Email)
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
              {form.configured || form.hasPassword ? (
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
                  <strong>Enable SMTP</strong>
                  <p className="text-muted mb-0 small">
                    Transporter reloads when config is saved or toggled.
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
                  <label className="form-label">SMTP Host</label>
                  <input
                    type="text"
                    className="form-control"
                    name="host"
                    value={form.host}
                    onChange={handleChange}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Port</label>
                  <input
                    type="number"
                    className="form-control"
                    name="port"
                    value={form.port}
                    onChange={handleChange}
                    placeholder="587"
                  />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="smtp-secure"
                      name="secure"
                      checked={form.secure}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="smtp-secure">
                      Secure (SSL/TLS)
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">SMTP User</label>
                  <input
                    type="email"
                    className="form-control"
                    name="user"
                    value={form.user}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Password
                    {form.hasPassword && (
                      <span className="text-muted small ms-1">
                        (leave blank to keep existing)
                      </span>
                    )}
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={
                        form.hasPassword ? "••••••••••••••••" : "App password"
                      }
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
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
                          showPassword
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      />
                    </span>
                  </div>
                  {form.hasPassword && (
                    <small className="text-success d-block">
                      <i className="fa-solid fa-check me-1" />
                      Password is stored securely
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">From Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fromName"
                    value={form.fromName}
                    onChange={handleChange}
                    placeholder="ConnectWork.ma"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">From Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="fromEmail"
                    value={form.fromEmail}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="adminEmail"
                    value={form.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@email.com"
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
              </div>

              <div className="alert alert-info mt-3 mb-0 small">
                <i className="fa-solid fa-circle-info me-1" />
                Email from addresses use saved config; display names are
                preserved from templates.
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="super-dashboard-content-btn"
                  disabled={saveLoading || statusLoading}
                >
                  {saveLoading ? "Saving…" : "Save SMTP Config"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const AffindaPanel = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [form, setForm] = useState({
    apiKey: "",
    isActive: false,
    environment: "live",
    hasApiKey: false,
    configured: false,
  });
  const [showKey, setShowKey] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setFetchLoading(true);
      setConfigLoaded(false);
      const res = await configRequest("affindaConfig");
      const data = getConfigPayload(res);

      setForm({
        apiKey: "",
        isActive: parseActiveFlag(data.isActive),
        environment: data.environment || "live",
        hasApiKey: Boolean(data.hasApiKey),
        configured: Boolean(data.hasApiKey),
      });
    } catch {
      toast.error("Failed to load Affinda config");
    } finally {
      setFetchLoading(false);
      setConfigLoaded(true);
    }
  }, []);

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
        `${API_BASE_URL}affindaConfig/status`,
        { isActive: nextActive },
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        setForm((prev) => ({ ...prev, isActive: nextActive }));
        toast.success(`Affinda ${nextActive ? "enabled" : "disabled"}`);
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update Affinda status",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const isFirstSave = !form.configured && !form.hasApiKey;
    if (isFirstSave && !form.apiKey.trim()) {
      toast.error("API key is required for first save");
      return;
    }

    const payload = {
      isActive: form.isActive,
      environment: form.environment,
    };

    if (form.apiKey.trim()) {
      payload.apiKey = form.apiKey.trim();
    }

    try {
      setSaveLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}saveAffindaConfig`,
        payload,
        await ensureAuthRequestConfig(),
      );
      if (res.data?.success !== false) {
        toast.success("Affinda config saved");
        fetchConfig();
      } else {
        toast.error(res.data?.message || "Failed to save Affinda config");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save Affinda config",
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
          <i className="fa-solid fa-file-lines me-2" style={{ color: "#00b894" }} />
          Affinda (Resume Parsing)
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
              {form.configured || form.hasApiKey ? (
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
                  <strong>Enable Affinda</strong>
                  <p className="text-muted mb-0 small">
                    Used in resume parsing and ATS workers.
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
                <div className="col-md-8">
                  <label className="form-label">
                    API Key
                    {form.hasApiKey && (
                      <span className="text-muted small ms-1">
                        (leave blank to keep existing)
                      </span>
                    )}
                  </label>
                  <div className="position-relative">
                    <input
                      type={showKey ? "text" : "password"}
                      className="form-control pe-5"
                      name="apiKey"
                      value={form.apiKey}
                      onChange={handleChange}
                      placeholder={
                        form.hasApiKey
                          ? "••••••••••••••••"
                          : "aff_your_api_key"
                      }
                    />
                    <span
                      onClick={() => setShowKey(!showKey)}
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
                          showKey
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      />
                    </span>
                  </div>
                  {form.hasApiKey && (
                    <small className="text-success d-block">
                      <i className="fa-solid fa-check me-1" />
                      API key is stored securely
                    </small>
                  )}
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
              </div>

              <div className="alert alert-info mt-3 mb-0 small">
                <i className="fa-solid fa-circle-info me-1" />
                First save requires an API key. On update, omit the key to keep
                the existing one.
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="super-dashboard-content-btn"
                  disabled={saveLoading || statusLoading}
                >
                  {saveLoading ? "Saving…" : "Save Affinda Config"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

function AdminServiceSettings() {
  const [openPanel, setOpenPanel] = useState("smtp");

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <section className="super-dashboard-content-wrapper">
        <div className="super-dashboard-breadcrumb-info">
          <h4>Email & Resume Parsing Settings</h4>
        </div>

        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage SMTP & Affinda Configuration
          </h5>
        </div>

        <div className="super-admin-manage-candidate-list super-admin-white-bg p-3">
          <p className="text-muted mb-3">
            Configure email delivery and resume parsing. Secrets are masked in
            API responses (<code>hasPassword</code>, <code>hasApiKey</code>).
          </p>

          <div className="accordion" id="serviceSettingsAccordion">
            <SmtpPanel
              isOpen={openPanel === "smtp"}
              onToggle={() =>
                setOpenPanel((prev) => (prev === "smtp" ? "" : "smtp"))
              }
            />
            <AffindaPanel
              isOpen={openPanel === "affinda"}
              onToggle={() =>
                setOpenPanel((prev) => (prev === "affinda" ? "" : "affinda"))
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminServiceSettings;
