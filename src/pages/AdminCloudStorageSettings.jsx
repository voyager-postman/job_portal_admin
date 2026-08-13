import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { ensureAuthRequestConfig } from "../utils/authToken";
import { getConfigPayload, parseActiveFlag } from "../utils/integrationConfig";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const DEFAULT_FOLDERS = ["photos", "resumes", "coverLetters", "chat"];

const normalizePrivateKey = (key) => {
  if (!key || typeof key !== "string") return key;
  let formatted = key.trim();
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, "\n").trim();
};

const AdminCloudStorageSettings = () => {
  const location = useLocation();

  // Active accordion section
  const [openSection, setOpenSection] = useState("azure");

  // Global Config Fetch State
  const [configLoading, setConfigLoading] = useState(false);
  const [switchingProvider, setSwitchingProvider] = useState(false);

  // Storage Config State
  const [storageData, setStorageData] = useState({
    activeProvider: "local",
    source: "database",
    autoDeleteLocalAfterUpload: false,
    azure: {
      accountName: "",
      containerName: "",
      customDomain: "",
      isActive: false,
      hasAccountKey: false,
      hasConnectionString: false,
    },
    gcs: {
      projectId: "",
      clientEmail: "",
      bucketName: "",
      customDomain: "",
      isActive: false,
      hasPrivateKey: false,
      hasKeyFileJson: false,
    },
    local: {
      basePath: "",
      baseUrl: "",
      isActive: true,
    },
  });

  // Azure Form State
  const [azureForm, setAzureForm] = useState({
    accountName: "",
    accountKey: "",
    containerName: "",
    customDomain: "",
    isActive: true,
  });
  const [showAzureKey, setShowAzureKey] = useState(false);
  const [azureSaving, setAzureSaving] = useState(false);
  const [azureTesting, setAzureTesting] = useState(false);
  const [azureTestResult, setAzureTestResult] = useState(null);

  // GCS Form State
  const [gcsAuthMode, setGcsAuthMode] = useState("fields"); // 'fields' | 'json'
  const [gcsForm, setGcsForm] = useState({
    projectId: "",
    clientEmail: "",
    privateKey: "",
    bucketName: "",
    customDomain: "",
    keyFileJson: "",
    isActive: true,
  });
  const [showGcsKey, setShowGcsKey] = useState(false);
  const [gcsSaving, setGcsSaving] = useState(false);
  const [gcsTesting, setGcsTesting] = useState(false);
  const [gcsTestResult, setGcsTestResult] = useState(null);

  // Local Storage Test State
  const [localTesting, setLocalTesting] = useState(false);
  const [localTestResult, setLocalTestResult] = useState(null);

  // Migration Tool State
  const [migrationForm, setMigrationForm] = useState({
    provider: "azure",
    dryRun: false,
    deleteLocalAfterMigration: false,
    folders: [...DEFAULT_FOLDERS],
  });
  const [customFolderInput, setCustomFolderInput] = useState("");
  const [migrating, setMigrating] = useState(false);

  // Migration Status State
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const pollingRef = useRef(null);

  // =========================================================================
  // 1. Fetch Storage Configuration (GET /api/storageConfig)
  // =========================================================================
  const fetchStorageConfig = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setConfigLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}storageConfig`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true })
      );

      const data = getConfigPayload(res);
      if (data) {
        setStorageData({
          activeProvider: data.activeProvider || "local",
          source: data.source || "database",
          autoDeleteLocalAfterUpload: Boolean(data.autoDeleteLocalAfterUpload),
          azure: {
            accountName: data.azure?.accountName || "",
            containerName: data.azure?.containerName || "",
            customDomain: data.azure?.customDomain || "",
            isActive: parseActiveFlag(data.azure?.isActive),
            hasAccountKey: Boolean(data.azure?.hasAccountKey),
            hasConnectionString: Boolean(data.azure?.hasConnectionString),
          },
          gcs: {
            projectId: data.gcs?.projectId || "",
            clientEmail: data.gcs?.clientEmail || "",
            bucketName: data.gcs?.bucketName || "",
            customDomain: data.gcs?.customDomain || "",
            isActive: parseActiveFlag(data.gcs?.isActive),
            hasPrivateKey: Boolean(data.gcs?.hasPrivateKey),
            hasKeyFileJson: Boolean(data.gcs?.hasKeyFileJson),
          },
          local: {
            basePath: data.local?.basePath || "",
            baseUrl: data.local?.baseUrl || "",
            isActive: parseActiveFlag(data.local?.isActive),
          },
        });

        // Pre-fill Azure form
        setAzureForm((prev) => ({
          accountName: data.azure?.accountName || prev.accountName || "",
          accountKey: "",
          containerName: data.azure?.containerName || prev.containerName || "",
          customDomain: data.azure?.customDomain || prev.customDomain || "",
          isActive:
            data.azure?.isActive !== undefined
              ? parseActiveFlag(data.azure?.isActive)
              : prev.isActive,
        }));

        // Pre-fill GCS form
        setGcsForm((prev) => ({
          projectId: data.gcs?.projectId || prev.projectId || "",
          clientEmail: data.gcs?.clientEmail || prev.clientEmail || "",
          privateKey: "",
          bucketName: data.gcs?.bucketName || prev.bucketName || "",
          customDomain: data.gcs?.customDomain || prev.customDomain || "",
          keyFileJson: "",
          isActive:
            data.gcs?.isActive !== undefined
              ? parseActiveFlag(data.gcs?.isActive)
              : prev.isActive,
        }));

        // Default migration provider
        if (data.activeProvider === "gcs" || data.activeProvider === "azure") {
          setMigrationForm((prev) => ({ ...prev, provider: data.activeProvider }));
        }
      }
    } catch (err) {
      console.error("Error fetching storage config:", err);
      if (!isSilent) {
        toast.error("Failed to load cloud storage configuration");
      }
    } finally {
      if (!isSilent) setConfigLoading(false);
    }
  }, []);

  // =========================================================================
  // 7. Get Migration Status (GET /api/storageConfig/migrationStatus)
  // =========================================================================
  const fetchMigrationStatus = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setStatusLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}storageConfig/migrationStatus`,
        await ensureAuthRequestConfig({ skipGlobalLoader: true })
      );
      const data = getConfigPayload(res);
      setMigrationStatus(data);
      return data;
    } catch (err) {
      console.error("Error fetching migration status:", err);
    } finally {
      if (!isSilent) setStatusLoading(false);
    }
  }, []);

  // Poll migration status when active
  useEffect(() => {
    fetchStorageConfig();
    fetchMigrationStatus();
  }, [fetchStorageConfig, fetchMigrationStatus, location.key]);

  useEffect(() => {
    const isRunning =
      migrationStatus?.status === "running" ||
      migrationStatus?.status === "in_progress" ||
      migrationStatus?.inProgress === true ||
      migrating;

    if (isRunning) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(async () => {
          const status = await fetchMigrationStatus(true);
          if (
            status &&
            status.status !== "running" &&
            status.status !== "in_progress" &&
            !status.inProgress
          ) {
            setMigrating(false);
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            toast.info("Cloud migration finished!");
            fetchStorageConfig(true);
          }
        }, 3000);
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [migrationStatus, migrating, fetchMigrationStatus, fetchStorageConfig]);

  // =========================================================================
  // 4. Switch Active Storage Provider (POST /api/storageConfig/selectProvider)
  // =========================================================================
  const handleSelectProvider = async (provider) => {
    if (storageData.activeProvider === provider) {
      toast.info(`${provider.toUpperCase()} is already the active provider.`);
      return;
    }

    const providerNames = {
      local: "Local Server Storage",
      azure: "Azure Blob Storage",
      gcs: "Google Cloud Storage (GCS)",
    };

    const confirm = await Swal.fire({
      title: "Switch Active Storage Provider?",
      text: `Are you sure you want to make ${providerNames[provider]} the active upload provider? New uploads will be routed here.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2e47cc",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Switch Provider",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSwitchingProvider(true);
      const res = await axios.post(
        `${API_BASE_URL}storageConfig/selectProvider`,
        { activeProvider: provider },
        await ensureAuthRequestConfig()
      );

      if (res.data?.success !== false) {
        toast.success(`Active storage provider switched to ${providerNames[provider]}`);
        setStorageData((prev) => ({ ...prev, activeProvider: provider }));
        fetchStorageConfig(true);
      } else {
        toast.error(res.data?.message || "Failed to switch active provider");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to switch active provider");
    } finally {
      setSwitchingProvider(false);
    }
  };

  // =========================================================================
  // 5. Test Storage Connection (POST /api/storageConfig/test)
  // =========================================================================
  const handleTestConnection = async (provider) => {
    let payload = { provider };

    if (provider === "azure") {
      setAzureTesting(true);
      setAzureTestResult(null);

      const credentials = {
        accountName: azureForm.accountName.trim(),
        containerName: azureForm.containerName.trim(),
      };
      if (azureForm.accountKey.trim()) {
        credentials.accountKey = azureForm.accountKey.trim();
      }
      if (azureForm.customDomain.trim()) {
        credentials.customDomain = azureForm.customDomain.trim();
      }
      payload.credentials = credentials;
    } else if (provider === "gcs") {
      setGcsTesting(true);
      setGcsTestResult(null);

      const credentials = {
        bucketName: gcsForm.bucketName.trim(),
      };
      if (gcsForm.projectId.trim()) {
        credentials.projectId = gcsForm.projectId.trim();
      }
      if (gcsForm.clientEmail.trim()) {
        credentials.clientEmail = gcsForm.clientEmail.trim();
      }
      if (gcsForm.privateKey.trim()) {
        credentials.privateKey = normalizePrivateKey(gcsForm.privateKey);
      }
      if (gcsForm.keyFileJson.trim()) {
        try {
          credentials.keyFileJson = JSON.parse(gcsForm.keyFileJson.trim());
        } catch {
          credentials.keyFileJson = gcsForm.keyFileJson.trim();
        }
      }
      if (gcsForm.customDomain.trim()) {
        credentials.customDomain = gcsForm.customDomain.trim();
      }
      payload.credentials = credentials;
    } else if (provider === "local") {
      setLocalTesting(true);
      setLocalTestResult(null);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}storageConfig/test`,
        payload,
        await ensureAuthRequestConfig()
      );

      const resultData = {
        success: res.data?.success !== false,
        message: res.data?.message || "Connection test successful!",
        details: res.data?.data || null,
        timestamp: new Date().toLocaleTimeString(),
      };

      if (provider === "azure") {
        setAzureTestResult(resultData);
      } else if (provider === "gcs") {
        setGcsTestResult(resultData);
      } else if (provider === "local") {
        setLocalTestResult(resultData);
      }

      if (res.data?.success !== false) {
        toast.success(`${provider.toUpperCase()} connection test successful!`);
      } else {
        toast.error(res.data?.message || `${provider.toUpperCase()} connection test failed`);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `${provider.toUpperCase()} connection test failed`;
      const resultData = {
        success: false,
        message: errorMsg,
        details: err.response?.data || null,
        timestamp: new Date().toLocaleTimeString(),
      };

      if (provider === "azure") {
        setAzureTestResult(resultData);
      } else if (provider === "gcs") {
        setGcsTestResult(resultData);
      } else if (provider === "local") {
        setLocalTestResult(resultData);
      }

      toast.error(errorMsg);
    } finally {
      if (provider === "azure") setAzureTesting(false);
      if (provider === "gcs") setGcsTesting(false);
      if (provider === "local") setLocalTesting(false);
    }
  };

  // =========================================================================
  // 2. Save Azure Blob Storage (POST /api/storageConfig/azure)
  // =========================================================================
  const handleSaveAzure = async (e) => {
    e.preventDefault();

    if (!azureForm.accountName.trim()) {
      toast.error("Azure Storage Account Name is required");
      return;
    }
    if (!azureForm.containerName.trim()) {
      toast.error("Azure Container Name is required");
      return;
    }

    const isFirstSave = !storageData.azure?.hasAccountKey && !storageData.azure?.hasConnectionString;
    if (isFirstSave && !azureForm.accountKey.trim()) {
      toast.error("Azure Storage Account Key is required for initial setup");
      return;
    }

    const payload = {
      accountName: azureForm.accountName.trim(),
      containerName: azureForm.containerName.trim(),
      customDomain: azureForm.customDomain.trim(),
      isActive: azureForm.isActive,
    };

    if (azureForm.accountKey.trim()) {
      payload.accountKey = azureForm.accountKey.trim();
    }

    try {
      setAzureSaving(true);
      const res = await axios.post(
        `${API_BASE_URL}storageConfig/azure`,
        payload,
        await ensureAuthRequestConfig()
      );

      if (res.data?.success !== false) {
        toast.success("Azure Blob Storage configuration saved successfully");
        setAzureForm((prev) => ({ ...prev, accountKey: "" }));
        fetchStorageConfig(true);
      } else {
        toast.error(res.data?.message || "Failed to save Azure configuration");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save Azure configuration");
    } finally {
      setAzureSaving(false);
    }
  };

  // =========================================================================
  // 3. Save Google Cloud Storage (POST /api/storageConfig/gcs)
  // =========================================================================
  const handleSaveGcs = async (e) => {
    e.preventDefault();

    if (!gcsForm.bucketName.trim()) {
      toast.error("GCS Bucket Name is required");
      return;
    }

    const isFirstSave = !storageData.gcs?.hasPrivateKey && !storageData.gcs?.hasKeyFileJson;

    if (gcsAuthMode === "json") {
      if (isFirstSave && !gcsForm.keyFileJson.trim()) {
        toast.error("Service Account JSON is required");
        return;
      }
    } else {
      if (!gcsForm.projectId.trim()) {
        toast.error("Google Cloud Project ID is required");
        return;
      }
      if (!gcsForm.clientEmail.trim()) {
        toast.error("Service Account Client Email is required");
        return;
      }
      if (isFirstSave && !gcsForm.privateKey.trim()) {
        toast.error("Service Account Private Key is required for initial setup");
        return;
      }
    }

    const payload = {
      bucketName: gcsForm.bucketName.trim(),
      customDomain: gcsForm.customDomain.trim(),
      isActive: gcsForm.isActive,
    };

    if (gcsForm.projectId.trim()) payload.projectId = gcsForm.projectId.trim();
    if (gcsForm.clientEmail.trim()) payload.clientEmail = gcsForm.clientEmail.trim();
    if (gcsForm.privateKey.trim()) payload.privateKey = normalizePrivateKey(gcsForm.privateKey);
    if (gcsForm.keyFileJson.trim()) {
      try {
        payload.keyFileJson = JSON.parse(gcsForm.keyFileJson.trim());
      } catch {
        payload.keyFileJson = gcsForm.keyFileJson.trim();
      }
    }

    try {
      setGcsSaving(true);
      const res = await axios.post(
        `${API_BASE_URL}storageConfig/gcs`,
        payload,
        await ensureAuthRequestConfig()
      );

      if (res.data?.success !== false) {
        toast.success("Google Cloud Storage configuration saved successfully");
        setGcsForm((prev) => ({ ...prev, privateKey: "", keyFileJson: "" }));
        fetchStorageConfig(true);
      } else {
        toast.error(res.data?.message || "Failed to save GCS configuration");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save GCS configuration");
    } finally {
      setGcsSaving(false);
    }
  };

  // Helper for parsing uploaded GCS Service Account JSON file
  const handleGcsJsonFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);

        setGcsForm((prev) => ({
          ...prev,
          keyFileJson: text,
          projectId: parsed.project_id || prev.projectId,
          clientEmail: parsed.client_email || prev.clientEmail,
          privateKey: parsed.private_key || prev.privateKey,
        }));
        toast.success("Service account JSON file parsed successfully!");
      } catch {
        toast.error("Invalid JSON file format. Please upload a valid service account JSON.");
      }
    };
    reader.readAsText(file);
  };

  // =========================================================================
  // 6. Trigger Cloud Migration (POST /api/storageConfig/migrate)
  // =========================================================================
  const toggleFolderSelection = (folder) => {
    setMigrationForm((prev) => {
      const exists = prev.folders.includes(folder);
      const updated = exists
        ? prev.folders.filter((f) => f !== folder)
        : [...prev.folders, folder];
      return { ...prev, folders: updated };
    });
  };

  const selectAllFolders = () => {
    setMigrationForm((prev) => ({ ...prev, folders: [...DEFAULT_FOLDERS] }));
  };

  const deselectAllFolders = () => {
    setMigrationForm((prev) => ({ ...prev, folders: [] }));
  };

  const handleAddCustomFolder = (e) => {
    e.preventDefault();
    const folder = customFolderInput.trim();
    if (!folder) return;
    if (migrationForm.folders.includes(folder)) {
      toast.info(`Folder "${folder}" is already in the list`);
      return;
    }
    setMigrationForm((prev) => ({ ...prev, folders: [...prev.folders, folder] }));
    setCustomFolderInput("");
  };

  const handleTriggerMigration = async (e) => {
    e.preventDefault();

    if (migrationForm.folders.length === 0) {
      toast.error("Please select at least one folder to migrate");
      return;
    }

    const targetProviderName =
      migrationForm.provider === "azure"
        ? "Azure Blob Storage"
        : "Google Cloud Storage (GCS)";

    const isTargetConfigured =
      migrationForm.provider === "azure"
        ? storageData.azure?.hasAccountKey || storageData.azure?.accountName
        : storageData.gcs?.hasPrivateKey || storageData.gcs?.hasKeyFileJson || storageData.gcs?.bucketName;

    if (!isTargetConfigured) {
      const proceed = await Swal.fire({
        title: "Provider Not Configured?",
        text: `Target provider ${targetProviderName} does not appear to have credentials saved. Do you still want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Proceed Anyway",
      });
      if (!proceed.isConfirmed) return;
    }

    const warningText = migrationForm.dryRun
      ? `Simulate migration of [${migrationForm.folders.join(", ")}] to ${targetProviderName}. No files will be moved or deleted.`
      : `Migrate folders [${migrationForm.folders.join(", ")}] from local server to ${targetProviderName}.${
          migrationForm.deleteLocalAfterMigration
            ? " WARNING: Local copies will be DELETED after upload."
            : ""
        }`;

    const confirm = await Swal.fire({
      title: migrationForm.dryRun ? "Start Migration Dry Run?" : "Start Cloud Migration?",
      text: warningText,
      icon: migrationForm.deleteLocalAfterMigration ? "warning" : "info",
      showCancelButton: true,
      confirmButtonColor: "#2e47cc",
      cancelButtonColor: "#6c757d",
      confirmButtonText: migrationForm.dryRun ? "Start Dry Run" : "Start Live Migration",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      provider: migrationForm.provider,
      dryRun: migrationForm.dryRun,
      deleteLocalAfterMigration: migrationForm.deleteLocalAfterMigration,
      folders: migrationForm.folders,
    };

    try {
      setMigrating(true);
      const res = await axios.post(
        `${API_BASE_URL}storageConfig/migrate`,
        payload,
        await ensureAuthRequestConfig()
      );

      if (res.data?.success !== false) {
        toast.success(
          res.data?.message || "Migration job initiated successfully!"
        );
        fetchMigrationStatus();
      } else {
        toast.error(res.data?.message || "Failed to trigger migration");
        setMigrating(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger cloud migration");
      setMigrating(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <section className="super-dashboard-content-wrapper">
        {/* Breadcrumb Header */}
        <div className="super-dashboard-breadcrumb-info d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h4>Cloud Storage & Migration Management</h4>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            onClick={() => {
              fetchStorageConfig();
              fetchMigrationStatus();
              toast.info("Refreshed storage status");
            }}
            disabled={configLoading}
          >
            <i className={`fa-solid fa-arrows-rotate ${configLoading ? "fa-spin" : ""}`} />
            Refresh Status
          </button>
        </div>

        {/* Subtitle / Navigation link */}
        <div className="super-dashboard-common-heading">
          <h5>
            <Link to="/admin">
              <i className="fa-solid fa-angles-left" />
            </Link>
            Manage Azure Blob, Google Cloud Storage (GCS), Local Storage & Cloud File Migration
          </h5>
        </div>

        {/* Main Content Area */}
        <div className="super-admin-manage-candidate-list super-admin-white-bg p-4 rounded shadow-sm">
          {/* Top Notice */}
          <div className="alert alert-primary d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-cloud fs-4 text-primary" />
              <div>
                <strong>Active Upload Destination: </strong>
                <span className="badge bg-primary fs-6 text-uppercase ms-1 px-3 py-1">
                  {storageData.activeProvider === "azure" && "Azure Blob Storage"}
                  {storageData.activeProvider === "gcs" && "Google Cloud Storage"}
                  {storageData.activeProvider === "local" && "Local Server Storage"}
                </span>
                <span className="text-muted ms-2 small">
                  (Source: <code>{storageData.source}</code>)
                </span>
              </div>
            </div>
            {storageData.autoDeleteLocalAfterUpload && (
              <span className="badge bg-warning text-dark">
                <i className="fa-solid fa-trash-can me-1" />
                Auto-Delete Local Files Enabled
              </span>
            )}
          </div>

          {/* ========================================================================= */}
          {/* Provider Overview Cards (Quick Active Switcher) */}
          {/* ========================================================================= */}
          <div className="row g-3 mb-4">
            {/* Local Storage Card */}
            <div className="col-lg-4 col-md-6">
              <div
                className={`card h-100 border-2 transition-all ${
                  storageData.activeProvider === "local"
                    ? "border-primary bg-light shadow-sm"
                    : "border-secondary-subtle"
                }`}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-solid fa-server fs-4 text-secondary" />
                      <h6 className="card-title mb-0 fw-bold">Local Storage</h6>
                    </div>
                    {storageData.activeProvider === "local" ? (
                      <span className="badge bg-success">
                        <i className="fa-solid fa-check me-1" /> Active
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Standby</span>
                    )}
                  </div>
                  <p className="card-text text-muted small flex-grow-1">
                    Stores photos, resumes, and uploads directly onto the local web server filesystem.
                  </p>
                  <div className="bg-white p-2 rounded border mb-3 small text-truncate">
                    <div>
                      <strong>Path: </strong>
                      <code>{storageData.local.basePath || "/uploads"}</code>
                    </div>
                    <div>
                      <strong>Status: </strong>
                      <span className="text-success">Available</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${
                        storageData.activeProvider === "local"
                          ? "btn-outline-success disabled"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleSelectProvider("local")}
                      disabled={switchingProvider || storageData.activeProvider === "local"}
                    >
                      {storageData.activeProvider === "local" ? "Active Provider" : "Set as Active"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      title="Test Local Storage"
                      onClick={() => handleTestConnection("local")}
                      disabled={localTesting}
                    >
                      {localTesting ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-vial" />
                      )}
                    </button>
                  </div>
                  {localTestResult && (
                    <div
                      className={`mt-2 p-1 text-center small rounded ${
                        localTestResult.success
                          ? "bg-success-subtle text-success border border-success"
                          : "bg-danger-subtle text-danger border border-danger"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          localTestResult.success ? "fa-circle-check" : "fa-circle-xmark"
                        } me-1`}
                      />
                      {localTestResult.message} ({localTestResult.timestamp})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Azure Blob Storage Card */}
            <div className="col-lg-4 col-md-6">
              <div
                className={`card h-100 border-2 transition-all ${
                  storageData.activeProvider === "azure"
                    ? "border-primary bg-light shadow-sm"
                    : "border-secondary-subtle"
                }`}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-brands fa-microsoft fs-4" style={{ color: "#0078d4" }} />
                      <h6 className="card-title mb-0 fw-bold">Azure Blob Storage</h6>
                    </div>
                    {storageData.activeProvider === "azure" ? (
                      <span className="badge bg-success">
                        <i className="fa-solid fa-check me-1" /> Active
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </div>
                  <p className="card-text text-muted small flex-grow-1">
                    Scalable Microsoft cloud object storage with CDN and high availability.
                  </p>
                  <div className="bg-white p-2 rounded border mb-3 small text-truncate">
                    <div>
                      <strong>Account: </strong>
                      <span>{storageData.azure.accountName || "Not configured"}</span>
                    </div>
                    <div>
                      <strong>Container: </strong>
                      <span>{storageData.azure.containerName || "Not configured"}</span>
                    </div>
                    <div>
                      <strong>Keys: </strong>
                      {storageData.azure.hasAccountKey ? (
                        <span className="badge bg-info-subtle text-info border">
                          <i className="fa-solid fa-shield-halved me-1" />
                          Key Configured
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border">Missing Key</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${
                        storageData.activeProvider === "azure"
                          ? "btn-outline-success disabled"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleSelectProvider("azure")}
                      disabled={switchingProvider || storageData.activeProvider === "azure"}
                    >
                      {storageData.activeProvider === "azure" ? "Active Provider" : "Set as Active"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      title="Test Azure Connection"
                      onClick={() => handleTestConnection("azure")}
                      disabled={azureTesting}
                    >
                      {azureTesting ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-vial" />
                      )}
                    </button>
                  </div>
                  {azureTestResult && (
                    <div
                      className={`mt-2 p-1 text-center small rounded ${
                        azureTestResult.success
                          ? "bg-success-subtle text-success border border-success"
                          : "bg-danger-subtle text-danger border border-danger"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          azureTestResult.success ? "fa-circle-check" : "fa-circle-xmark"
                        } me-1`}
                      />
                      {azureTestResult.message} ({azureTestResult.timestamp})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Google Cloud Storage Card */}
            <div className="col-lg-4 col-md-6">
              <div
                className={`card h-100 border-2 transition-all ${
                  storageData.activeProvider === "gcs"
                    ? "border-primary bg-light shadow-sm"
                    : "border-secondary-subtle"
                }`}
              >
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fa-brands fa-google fs-4" style={{ color: "#4285f4" }} />
                      <h6 className="card-title mb-0 fw-bold">Google Cloud Storage</h6>
                    </div>
                    {storageData.activeProvider === "gcs" ? (
                      <span className="badge bg-success">
                        <i className="fa-solid fa-check me-1" /> Active
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </div>
                  <p className="card-text text-muted small flex-grow-1">
                    Google Cloud bucket storage with high durability and global CDN edge support.
                  </p>
                  <div className="bg-white p-2 rounded border mb-3 small text-truncate">
                    <div>
                      <strong>Project: </strong>
                      <span>{storageData.gcs.projectId || "Not configured"}</span>
                    </div>
                    <div>
                      <strong>Bucket: </strong>
                      <span>{storageData.gcs.bucketName || "Not configured"}</span>
                    </div>
                    <div>
                      <strong>Credentials: </strong>
                      {storageData.gcs.hasPrivateKey || storageData.gcs.hasKeyFileJson ? (
                        <span className="badge bg-info-subtle text-info border">
                          <i className="fa-solid fa-shield-halved me-1" />
                          Credentials Saved
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning border">Missing Credentials</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 ${
                        storageData.activeProvider === "gcs"
                          ? "btn-outline-success disabled"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleSelectProvider("gcs")}
                      disabled={switchingProvider || storageData.activeProvider === "gcs"}
                    >
                      {storageData.activeProvider === "gcs" ? "Active Provider" : "Set as Active"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      title="Test GCS Connection"
                      onClick={() => handleTestConnection("gcs")}
                      disabled={gcsTesting}
                    >
                      {gcsTesting ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-vial" />
                      )}
                    </button>
                  </div>
                  {gcsTestResult && (
                    <div
                      className={`mt-2 p-1 text-center small rounded ${
                        gcsTestResult.success
                          ? "bg-success-subtle text-success border border-success"
                          : "bg-danger-subtle text-danger border border-danger"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          gcsTestResult.success ? "fa-circle-check" : "fa-circle-xmark"
                        } me-1`}
                      />
                      {gcsTestResult.message} ({gcsTestResult.timestamp})
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Accordion Panels for Configuration & Migration */}
          {/* ========================================================================= */}
          <div className="accordion" id="storageAccordion">
            {/* ========================================================================= */}
            {/* Panel 1: Azure Blob Storage Configuration */}
            {/* ========================================================================= */}
            <div className="accordion-item mb-3 border rounded shadow-sm overflow-hidden">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className={`accordion-button ${openSection === "azure" ? "" : "collapsed"}`}
                  onClick={() => setOpenSection((prev) => (prev === "azure" ? "" : "azure"))}
                >
                  <i className="fa-brands fa-microsoft me-2" style={{ color: "#0078d4" }} />
                  <span className="fw-semibold">Azure Blob Storage Configuration</span>
                  <span
                    className={`badge ms-3 ${
                      storageData.azure.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {storageData.azure.isActive ? "Enabled" : "Disabled"}
                  </span>
                  {storageData.azure.hasAccountKey ? (
                    <span className="badge bg-primary ms-2">Key Saved</span>
                  ) : (
                    <span className="badge bg-warning text-dark ms-2">Key Missing</span>
                  )}
                  {storageData.activeProvider === "azure" && (
                    <span className="badge bg-info text-dark ms-2">Current Active Provider</span>
                  )}
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === "azure" ? "show" : ""}`}>
                <div className="accordion-body bg-white p-4">
                  <form onSubmit={handleSaveAzure}>
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded border">
                      <div>
                        <strong>Enable Azure Blob Storage Provider</strong>
                        <p className="text-muted mb-0 small">
                          When active and selected, files uploaded by candidates, recruiters, and admins will be pushed to Azure Blob Storage.
                        </p>
                      </div>
                      <div className="form-check form-switch fs-5">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="azureIsActive"
                          checked={azureForm.isActive}
                          onChange={(e) =>
                            setAzureForm((prev) => ({ ...prev, isActive: e.target.checked }))
                          }
                        />
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* Account Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Azure Storage Account Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. jobportalstorage"
                          value={azureForm.accountName}
                          onChange={(e) =>
                            setAzureForm((prev) => ({ ...prev, accountName: e.target.value }))
                          }
                          required
                        />
                      </div>

                      {/* Container Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Container Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. job-portal"
                          value={azureForm.containerName}
                          onChange={(e) =>
                            setAzureForm((prev) => ({ ...prev, containerName: e.target.value }))
                          }
                          required
                        />
                      </div>

                      {/* Account Key */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Account Key{" "}
                          {storageData.azure.hasAccountKey && (
                            <span className="text-muted fw-normal small">
                              (leave blank to keep existing key)
                            </span>
                          )}
                        </label>
                        <div className="position-relative">
                          <input
                            type={showAzureKey ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder={
                              storageData.azure.hasAccountKey
                                ? "••••••••••••••••••••••••••••••••"
                                : "Enter Azure Storage Account Key"
                            }
                            value={azureForm.accountKey}
                            onChange={(e) =>
                              setAzureForm((prev) => ({ ...prev, accountKey: e.target.value }))
                            }
                          />
                          <span
                            onClick={() => setShowAzureKey(!showAzureKey)}
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
                                showAzureKey ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                              }
                            />
                          </span>
                        </div>
                        {storageData.azure.hasAccountKey && (
                          <small className="text-success d-block mt-1">
                            <i className="fa-solid fa-check me-1" />
                            Account Key is securely encrypted on the server.
                          </small>
                        )}
                      </div>

                      {/* Custom Domain / CDN URL */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Custom Domain / CDN Endpoint (Optional)
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="e.g. https://cdn.example.com"
                          value={azureForm.customDomain}
                          onChange={(e) =>
                            setAzureForm((prev) => ({ ...prev, customDomain: e.target.value }))
                          }
                        />
                        <small className="text-muted">
                          If provided, public file links will use this custom CDN domain instead of <code>blob.core.windows.net</code>.
                        </small>
                      </div>
                    </div>

                    {/* Azure Test Result Box */}
                    {azureTestResult && (
                      <div
                        className={`alert mt-4 mb-0 ${
                          azureTestResult.success ? "alert-success" : "alert-danger"
                        }`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i
                            className={`fa-solid ${
                              azureTestResult.success
                                ? "fa-circle-check text-success"
                                : "fa-circle-exclamation text-danger"
                            } fs-5`}
                          />
                          <div>
                            <strong>
                              {azureTestResult.success
                                ? "Connection Successful"
                                : "Connection Failed"}
                              :{" "}
                            </strong>
                            {azureTestResult.message}
                            <span className="text-muted ms-2 small">
                              ({azureTestResult.timestamp})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Azure Action Buttons */}
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={() => handleTestConnection("azure")}
                        disabled={azureTesting || azureSaving}
                      >
                        {azureTesting ? (
                          <i className="fa-solid fa-spinner fa-spin" />
                        ) : (
                          <i className="fa-solid fa-vial" />
                        )}
                        Test Azure Connection
                      </button>
                      <button
                        type="submit"
                        className="super-dashboard-content-btn"
                        disabled={azureSaving || azureTesting}
                      >
                        {azureSaving ? "Saving..." : "Save Azure Configuration"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* Panel 2: Google Cloud Storage (GCS) Configuration */}
            {/* ========================================================================= */}
            <div className="accordion-item mb-3 border rounded shadow-sm overflow-hidden">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className={`accordion-button ${openSection === "gcs" ? "" : "collapsed"}`}
                  onClick={() => setOpenSection((prev) => (prev === "gcs" ? "" : "gcs"))}
                >
                  <i className="fa-brands fa-google me-2" style={{ color: "#4285f4" }} />
                  <span className="fw-semibold">Google Cloud Storage (GCS) Configuration</span>
                  <span
                    className={`badge ms-3 ${
                      storageData.gcs.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {storageData.gcs.isActive ? "Enabled" : "Disabled"}
                  </span>
                  {storageData.gcs.hasPrivateKey || storageData.gcs.hasKeyFileJson ? (
                    <span className="badge bg-primary ms-2">Credentials Saved</span>
                  ) : (
                    <span className="badge bg-warning text-dark ms-2">Credentials Missing</span>
                  )}
                  {storageData.activeProvider === "gcs" && (
                    <span className="badge bg-info text-dark ms-2">Current Active Provider</span>
                  )}
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === "gcs" ? "show" : ""}`}>
                <div className="accordion-body bg-white p-4">
                  <form onSubmit={handleSaveGcs}>
                    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded border">
                      <div>
                        <strong>Enable Google Cloud Storage Provider</strong>
                        <p className="text-muted mb-0 small">
                          When active and selected, files will be securely streamed to your Google Cloud Storage bucket.
                        </p>
                      </div>
                      <div className="form-check form-switch fs-5">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="gcsIsActive"
                          checked={gcsForm.isActive}
                          onChange={(e) =>
                            setGcsForm((prev) => ({ ...prev, isActive: e.target.checked }))
                          }
                        />
                      </div>
                    </div>

                    {/* Mode Selector: Individual Fields vs JSON Upload */}
                    <div className="mb-4">
                      <label className="form-label fw-bold d-block">Credential Input Method:</label>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            gcsAuthMode === "fields" ? "btn-primary" : "btn-outline-primary"
                          }`}
                          onClick={() => setGcsAuthMode("fields")}
                        >
                          <i className="fa-solid fa-list me-1" />
                          Individual Service Account Fields
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            gcsAuthMode === "json" ? "btn-primary" : "btn-outline-primary"
                          }`}
                          onClick={() => setGcsAuthMode("json")}
                        >
                          <i className="fa-solid fa-file-code me-1" />
                          Service Account JSON File / Key
                        </button>
                      </div>
                    </div>

                    <div className="row g-3">
                      {/* Bucket Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          GCS Bucket Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. job-portal-uploads"
                          value={gcsForm.bucketName}
                          onChange={(e) =>
                            setGcsForm((prev) => ({ ...prev, bucketName: e.target.value }))
                          }
                          required
                        />
                      </div>

                      {/* Custom Domain */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          Custom Domain / CDN Endpoint (Optional)
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="e.g. https://storage.example.com"
                          value={gcsForm.customDomain}
                          onChange={(e) =>
                            setGcsForm((prev) => ({ ...prev, customDomain: e.target.value }))
                          }
                        />
                      </div>

                      {gcsAuthMode === "fields" ? (
                        <>
                          {/* Project ID */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              GCP Project ID <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. job-portal-prod"
                              value={gcsForm.projectId}
                              onChange={(e) =>
                                setGcsForm((prev) => ({ ...prev, projectId: e.target.value }))
                              }
                            />
                          </div>

                          {/* Client Email */}
                          <div className="col-md-6">
                            <label className="form-label fw-bold">
                              Service Account Client Email <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="e.g. sa@job-portal-prod.iam.gserviceaccount.com"
                              value={gcsForm.clientEmail}
                              onChange={(e) =>
                                setGcsForm((prev) => ({ ...prev, clientEmail: e.target.value }))
                              }
                            />
                          </div>

                          {/* Private Key */}
                          <div className="col-md-12">
                            <label className="form-label fw-bold">
                              Private Key (PEM format){" "}
                              {storageData.gcs.hasPrivateKey && (
                                <span className="text-muted fw-normal small">
                                  (leave blank to retain existing key)
                                </span>
                              )}
                            </label>
                            <div className="position-relative">
                              <textarea
                                rows="4"
                                className="form-control font-monospace small"
                                placeholder={
                                  storageData.gcs.hasPrivateKey
                                    ? "-----BEGIN PRIVATE KEY-----\n••••••••••••••••••••••••••••••••••••••••\n-----END PRIVATE KEY-----"
                                    : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...\n-----END PRIVATE KEY-----"
                                }
                                value={gcsForm.privateKey}
                                onChange={(e) =>
                                  setGcsForm((prev) => ({ ...prev, privateKey: e.target.value }))
                                }
                              />
                            </div>
                            {storageData.gcs.hasPrivateKey && (
                              <small className="text-success d-block mt-1">
                                <i className="fa-solid fa-check me-1" />
                                Private Key is stored securely on the server.
                              </small>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* JSON File Upload & Raw JSON */}
                          <div className="col-md-12">
                            <label className="form-label fw-bold">Upload Service Account JSON</label>
                            <input
                              type="file"
                              accept=".json"
                              className="form-control mb-2"
                              onChange={handleGcsJsonFileUpload}
                            />
                            <label className="form-label fw-bold">Or Paste Full Service Account JSON Content</label>
                            <textarea
                              rows="6"
                              className="form-control font-monospace small"
                              placeholder={
                                storageData.gcs.hasKeyFileJson
                                  ? '{\n  "type": "service_account",\n  "project_id": "••••••••",\n  ... (stored securely)\n}'
                                  : '{\n  "type": "service_account",\n  "project_id": "your-project-id",\n  "private_key_id": "...",\n  "private_key": "-----BEGIN PRIVATE KEY-----\\n...",\n  "client_email": "...",\n  "client_id": "..."\n}'
                              }
                              value={gcsForm.keyFileJson}
                              onChange={(e) =>
                                setGcsForm((prev) => ({ ...prev, keyFileJson: e.target.value }))
                              }
                            />
                            {storageData.gcs.hasKeyFileJson && (
                              <small className="text-success d-block mt-1">
                                <i className="fa-solid fa-check me-1" />
                                Service Account JSON credentials stored securely.
                              </small>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* GCS Test Result Box */}
                    {gcsTestResult && (
                      <div
                        className={`alert mt-4 mb-0 ${
                          gcsTestResult.success ? "alert-success" : "alert-danger"
                        }`}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i
                            className={`fa-solid ${
                              gcsTestResult.success
                                ? "fa-circle-check text-success"
                                : "fa-circle-exclamation text-danger"
                            } fs-5`}
                          />
                          <div>
                            <strong>
                              {gcsTestResult.success
                                ? "Connection Successful"
                                : "Connection Failed"}
                              :{" "}
                            </strong>
                            {gcsTestResult.message}
                            <span className="text-muted ms-2 small">
                              ({gcsTestResult.timestamp})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GCS Action Buttons */}
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={() => handleTestConnection("gcs")}
                        disabled={gcsTesting || gcsSaving}
                      >
                        {gcsTesting ? (
                          <i className="fa-solid fa-spinner fa-spin" />
                        ) : (
                          <i className="fa-solid fa-vial" />
                        )}
                        Test GCS Connection
                      </button>
                      <button
                        type="submit"
                        className="super-dashboard-content-btn"
                        disabled={gcsSaving || gcsTesting}
                      >
                        {gcsSaving ? "Saving..." : "Save GCS Configuration"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* Panel 3: Cloud File Migration Tool & Status */}
            {/* ========================================================================= */}
            <div className="accordion-item mb-3 border rounded shadow-sm overflow-hidden">
              <h2 className="accordion-header">
                <button
                  type="button"
                  className={`accordion-button ${openSection === "migration" ? "" : "collapsed"}`}
                  onClick={() => setOpenSection((prev) => (prev === "migration" ? "" : "migration"))}
                >
                  <i className="fa-solid fa-arrow-right-arrow-left me-2 text-primary" />
                  <span className="fw-semibold">Cloud Migration & Bulk Sync Tool</span>
                  {migrationStatus?.status === "running" || migrationStatus?.inProgress ? (
                    <span className="badge bg-warning text-dark ms-3">
                      <i className="fa-solid fa-spinner fa-spin me-1" />
                      Migration In Progress
                    </span>
                  ) : migrationStatus?.status === "completed" ? (
                    <span className="badge bg-success ms-3">Last Migration: Completed</span>
                  ) : (
                    <span className="badge bg-light text-dark border ms-3">Ready</span>
                  )}
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${openSection === "migration" ? "show" : ""}`}>
                <div className="accordion-body bg-white p-4">
                  <p className="text-muted mb-4">
                    Easily migrate legacy files stored on your local server filesystem into Azure Blob Storage or Google Cloud Storage.
                  </p>

                  <form onSubmit={handleTriggerMigration}>
                    <div className="row g-4">
                      {/* Step 1: Target Provider */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">1. Target Cloud Provider</label>
                        <select
                          className="form-select"
                          value={migrationForm.provider}
                          onChange={(e) =>
                            setMigrationForm((prev) => ({ ...prev, provider: e.target.value }))
                          }
                          disabled={migrating}
                        >
                          <option value="azure">Azure Blob Storage</option>
                          <option value="gcs">Google Cloud Storage (GCS)</option>
                        </select>
                        <small className="text-muted">
                          Files will be copied from the local server uploads folder to this provider.
                        </small>
                      </div>

                      {/* Step 2: Options */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold">2. Migration Safety Options</label>
                        <div className="form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="dryRunCheck"
                            checked={migrationForm.dryRun}
                            onChange={(e) =>
                              setMigrationForm((prev) => ({ ...prev, dryRun: e.target.checked }))
                            }
                            disabled={migrating}
                          />
                          <label className="form-check-label" htmlFor="dryRunCheck">
                            <strong>Dry Run Mode</strong> (Simulate migration without transferring or modifying files)
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="deleteLocalCheck"
                            checked={migrationForm.deleteLocalAfterMigration}
                            onChange={(e) =>
                              setMigrationForm((prev) => ({
                                ...prev,
                                deleteLocalAfterMigration: e.target.checked,
                              }))
                            }
                            disabled={migrating || migrationForm.dryRun}
                          />
                          <label className="form-check-label text-danger" htmlFor="deleteLocalCheck">
                            <strong>Delete local files after successful upload</strong> (Free up server disk space)
                          </label>
                        </div>
                      </div>

                      {/* Step 3: Folders to Migrate */}
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-bold mb-0">3. Select Upload Folders to Migrate</label>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={selectAllFolders}
                              disabled={migrating}
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={deselectAllFolders}
                              disabled={migrating}
                            >
                              Deselect All
                            </button>
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded border">
                          {DEFAULT_FOLDERS.map((folder) => {
                            const isChecked = migrationForm.folders.includes(folder);
                            return (
                              <div
                                key={folder}
                                className={`form-check p-2 px-3 rounded border cursor-pointer ${
                                  isChecked ? "bg-primary-subtle border-primary text-primary" : "bg-white"
                                }`}
                                onClick={() => !migrating && toggleFolderSelection(folder)}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2"
                                  id={`folder-${folder}`}
                                  checked={isChecked}
                                  onChange={() => {}}
                                  disabled={migrating}
                                />
                                <label
                                  className="form-check-label fw-semibold"
                                  htmlFor={`folder-${folder}`}
                                  style={{ cursor: "pointer" }}
                                >
                                  {folder}/
                                </label>
                              </div>
                            );
                          })}

                          {/* Extra custom folders added by user */}
                          {migrationForm.folders
                            .filter((f) => !DEFAULT_FOLDERS.includes(f))
                            .map((customFolder) => (
                              <div
                                key={customFolder}
                                className="badge bg-secondary d-flex align-items-center gap-2 p-2 px-3 fs-6"
                              >
                                <span>{customFolder}/</span>
                                <i
                                  className="fa-solid fa-xmark cursor-pointer"
                                  onClick={() => toggleFolderSelection(customFolder)}
                                  title="Remove folder"
                                />
                              </div>
                            ))}
                        </div>

                        {/* Add custom folder input */}
                        <div className="input-group mt-2" style={{ maxWidth: "400px" }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Add custom folder name..."
                            value={customFolderInput}
                            onChange={(e) => setCustomFolderInput(e.target.value)}
                            disabled={migrating}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleAddCustomFolder}
                            disabled={migrating || !customFolderInput.trim()}
                          >
                            <i className="fa-solid fa-plus me-1" />
                            Add Folder
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Trigger Migration Button */}
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button
                        type="submit"
                        className="super-dashboard-content-btn d-flex align-items-center gap-2"
                        disabled={migrating || migrationForm.folders.length === 0}
                      >
                        {migrating ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin" />
                            Starting Migration...
                          </>
                        ) : migrationForm.dryRun ? (
                          <>
                            <i className="fa-solid fa-play" />
                            Run Dry-Run Simulation
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-cloud-arrow-up" />
                            Trigger Cloud Migration
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* ========================================================================= */}
                  {/* Real-time Migration Progress Monitor */}
                  {/* ========================================================================= */}
                  <div className="mt-5 pt-4 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">
                        <i className="fa-solid fa-chart-line me-2 text-primary" />
                        Migration Progress & Status
                      </h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                        onClick={() => fetchMigrationStatus()}
                        disabled={statusLoading}
                      >
                        <i className={`fa-solid fa-arrows-rotate ${statusLoading ? "fa-spin" : ""}`} />
                        Refresh Progress
                      </button>
                    </div>

                    {migrationStatus ? (
                      <div className="card border-0 bg-light p-3 rounded">
                        {/* Progress Header Metrics */}
                        <div className="row g-3 text-center mb-3">
                          <div className="col-sm-3 col-6">
                            <div className="bg-white p-2 rounded border">
                              <small className="text-muted d-block">Status</small>
                              <span
                                className={`badge ${
                                  migrationStatus.status === "completed"
                                    ? "bg-success"
                                    : migrationStatus.status === "running" || migrationStatus.inProgress
                                    ? "bg-warning text-dark"
                                    : migrationStatus.status === "failed"
                                    ? "bg-danger"
                                    : "bg-secondary"
                                } text-uppercase`}
                              >
                                {migrationStatus.status || (migrationStatus.inProgress ? "Running" : "Idle")}
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-3 col-6">
                            <div className="bg-white p-2 rounded border">
                              <small className="text-muted d-block">Total Files</small>
                              <strong className="fs-6">
                                {migrationStatus.totalFiles ?? migrationStatus.total ?? 0}
                              </strong>
                            </div>
                          </div>

                          <div className="col-sm-3 col-6">
                            <div className="bg-white p-2 rounded border">
                              <small className="text-muted d-block">Migrated</small>
                              <strong className="fs-6 text-success">
                                {migrationStatus.migratedFiles ?? migrationStatus.migrated ?? migrationStatus.successCount ?? 0}
                              </strong>
                            </div>
                          </div>

                          <div className="col-sm-3 col-6">
                            <div className="bg-white p-2 rounded border">
                              <small className="text-muted d-block">Failed / Skipped</small>
                              <strong className="fs-6 text-danger">
                                {migrationStatus.failedFiles ?? migrationStatus.failed ?? 0} /{" "}
                                <span className="text-secondary">
                                  {migrationStatus.skippedFiles ?? migrationStatus.skipped ?? 0}
                                </span>
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {(() => {
                          const total = migrationStatus.totalFiles || migrationStatus.total || 0;
                          const migrated =
                            migrationStatus.migratedFiles ||
                            migrationStatus.migrated ||
                            migrationStatus.successCount ||
                            0;
                          const percent =
                            migrationStatus.progressPercent !== undefined
                              ? migrationStatus.progressPercent
                              : total > 0
                              ? Math.min(100, Math.round((migrated / total) * 100))
                              : migrationStatus.status === "completed"
                              ? 100
                              : 0;

                          return (
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1 small">
                                <span>Overall Progress</span>
                                <span className="fw-bold">{percent}%</span>
                              </div>
                              <div className="progress" style={{ height: "12px" }}>
                                <div
                                  className={`progress-bar progress-bar-striped ${
                                    migrationStatus.status === "running" || migrationStatus.inProgress
                                      ? "progress-bar-animated bg-primary"
                                      : "bg-success"
                                  }`}
                                  role="progressbar"
                                  style={{ width: `${percent}%` }}
                                  aria-valuenow={percent}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                />
                              </div>
                            </div>
                          );
                        })()}

                        {/* Details / Logs Box */}
                        {migrationStatus.currentFile && (
                          <div className="small text-muted mb-2 text-truncate">
                            <i className="fa-solid fa-file-arrow-up me-1 text-primary" />
                            <strong>Current File: </strong>
                            <code>{migrationStatus.currentFile}</code>
                          </div>
                        )}

                        {migrationStatus.logs && migrationStatus.logs.length > 0 && (
                          <div className="mt-2">
                            <label className="form-label small fw-bold mb-1">Migration Log Console</label>
                            <div
                              className="bg-dark text-light p-2 rounded font-monospace small"
                              style={{ maxHeight: "150px", overflowY: "auto", fontSize: "12px" }}
                            >
                              {migrationStatus.logs.map((log, idx) => (
                                <div key={idx} className="text-break">
                                  {typeof log === "object" ? JSON.stringify(log) : log}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-light rounded text-muted">
                        <i className="fa-solid fa-database fs-3 mb-2 d-block" />
                        No migration has been executed yet or status is not initialized.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminCloudStorageSettings;
