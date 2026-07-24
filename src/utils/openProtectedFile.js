import { API_BASE_URL } from "../Url/Url";

const FILE_FOLDERS = {
  resume: "resumes",
  coverLetter: "coverLetters",
};

const FILE_OBJECT_KEYS = [
  "filename",
  "fileName",
  "storedName",
  "originalname",
  "originalName",
  "name",
  "url",
  "path",
  "file",
  "key",
  "value",
];

const looksLikeFilename = (value) => {
  if (!value || typeof value !== "string") return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("<") || trimmed.includes("\n")) return false;

  if (/\.[a-z0-9]{2,5}$/i.test(trimmed) || trimmed.includes("/")) {
    return true;
  }

  return /^[\w.-]+$/.test(trimmed) && trimmed.length <= 255;
};

export const extractProtectedFilename = (value) => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!looksLikeFilename(trimmed)) return null;

  if (trimmed.startsWith("http")) {
    try {
      const pathname = new URL(trimmed).pathname;
      const parts = pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || null;
    } catch {
      return null;
    }
  }

  const parts = trimmed.split("/").filter(Boolean);
  return parts[parts.length - 1] || trimmed;
};

export const resolveFileReference = (value) => {
  if (value == null) return null;

  if (typeof value === "string") {
    return extractProtectedFilename(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = resolveFileReference(item);
      if (resolved) return resolved;
    }
    return null;
  }

  if (typeof value === "object") {
    for (const key of FILE_OBJECT_KEYS) {
      if (value[key] != null) {
        const resolved = resolveFileReference(value[key]);
        if (resolved) return resolved;
      }
    }

    for (const nested of Object.values(value)) {
      if (nested != null && typeof nested === "object") {
        const resolved = resolveFileReference(nested);
        if (resolved) return resolved;
      }
    }
  }

  return null;
};

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

const CANDIDATE_FILE_FIELDS = {
  resume: [
    "resumeUrls",
    "resume",
    "resumeFile",
    "resumeUrl",
    "cv",
    "CV",
    "documents.resume",
    "userId.resume",
    "userId.resumeFile",
    "userId.resumeUrl",
    "userId.cv",
  ],
  coverLetter: [
    "coverLetter",
    "coverLetters",
    "coverLetterUrls",
    "coverLetterFile",
    "coverLetterUrl",
    "cover_letter",
    "documents.coverLetter",
    "userId.coverLetter",
    "userId.coverLetterFile",
    "userId.coverLetterUrl",
  ],
};

const CANDIDATE_FILE_ARRAY_FIELDS = {
  resume: ["resumeUrls", "resumes", "resumeList"],
  coverLetter: ["coverLetter", "coverLetters", "coverLetterUrls"],
};

const DOCUMENT_TYPE_ALIASES = {
  resume: ["resume", "cv", "curriculum vitae"],
  coverLetter: ["coverletter", "cover letter", "cover_letter"],
};

const matchesDocumentType = (entry, type) => {
  const aliases = DOCUMENT_TYPE_ALIASES[type] || [type];
  const candidates = [
    entry?.type,
    entry?.name,
    entry?.documentType,
    entry?.label,
    entry?.category,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().replace(/[\s_-]+/g, ""));

  return candidates.some((value) =>
    aliases.some((alias) => value.includes(alias.replace(/[\s_-]+/g, ""))),
  );
};

const sortByUploadedAt = (items) =>
  [...items].sort((a, b) => {
    if (!a.uploadedAt) return 1;
    if (!b.uploadedAt) return -1;
    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  });

export const getCandidateFileList = (candidate, type) => {
  if (!candidate) return [];

  const items = [];
  const seen = new Set();

  const addItem = (entry) => {
    const filename = resolveFileReference(entry);
    if (!filename || seen.has(filename)) return;

    seen.add(filename);
    items.push({
      id: entry?._id || filename,
      filename,
      url: entry?.url || filename,
      uploadedAt: entry?.uploadedAt || null,
    });
  };

  for (const field of CANDIDATE_FILE_ARRAY_FIELDS[type] || []) {
    const collection = candidate[field];
    if (!Array.isArray(collection)) continue;
    collection.forEach(addItem);
  }

  const collections = [candidate.documents, candidate.files, candidate.attachments];
  for (const collection of collections) {
    if (!Array.isArray(collection)) continue;
    collection
      .filter((entry) => matchesDocumentType(entry, type))
      .forEach(addItem);
  }

  if (items.length === 0) {
    for (const field of CANDIDATE_FILE_FIELDS[type] || []) {
      const value = getNestedValue(candidate, field);
      if (Array.isArray(value)) {
        value.forEach(addItem);
        continue;
      }
      const filename = resolveFileReference(value);
      if (filename && !seen.has(filename)) {
        seen.add(filename);
        items.push({
          id: filename,
          filename,
          url: filename,
          uploadedAt: null,
        });
      }
    }
  }

  return sortByUploadedAt(items);
};

export const getCandidateFileReference = (candidate, type) => {
  const files = getCandidateFileList(candidate, type);
  return files[0]?.filename ?? null;
};

const getProtectedFileErrorMessage = async (response) => {
  let serverMessage = "";
  try {
    const data = await response.clone().json();
    serverMessage = data?.message || data?.error || "";
  } catch {
    // response may not be JSON
  }

  if (response.status === 404) {
    return (
      serverMessage ||
      "File not found. It may have been deleted or moved on the server."
    );
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const retryHint = retryAfter
      ? ` Please try again in ${retryAfter} seconds.`
      : " Please wait a few minutes before trying again.";
    return (
      serverMessage ||
      `Download rate limit exceeded (default: 30 downloads per 15 minutes).${retryHint}`
    );
  }

  if (response.status === 401 || response.status === 403) {
    return serverMessage || "Not authorized to view this file.";
  }

  return serverMessage || "Failed to open file.";
};

const triggerFileDownload = (blob, filename) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
};

export const openProtectedFile = async (
  type,
  filenameOrPath,
  token,
  previewWindow = null,
) => {
  const authToken = token || localStorage.getItem("token");

  const filename = resolveFileReference(filenameOrPath);
  if (!filename) {
    throw new Error("Invalid file reference");
  }

  const folder = FILE_FOLDERS[type] || type;
  const fetchProtected = (fileFolder) => {
    const headers = {};
    if (authToken) {
      headers.Authorization = authToken.startsWith("Bearer ")
        ? authToken
        : `Bearer ${authToken}`;
    }

    return fetch(
      `${API_BASE_URL}files/${fileFolder}/${encodeURIComponent(filename)}`,
      {
        credentials: "include",
        headers,
      },
    );
  };

  let response = await fetchProtected(folder);

  // Some cover letters are stored under /resumes/ on disk
  if (
    !response.ok &&
    response.status === 404 &&
    type === "coverLetter" &&
    folder !== FILE_FOLDERS.resume
  ) {
    response = await fetchProtected(FILE_FOLDERS.resume);
  }

  if (!response.ok) {
    previewWindow?.close();
    const message = await getProtectedFileErrorMessage(response);
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const blob = await response.blob();
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  const canUsePreview =
    isPdf && previewWindow && !previewWindow.closed;

  if (canUsePreview) {
    const objectUrl = URL.createObjectURL(blob);
    previewWindow.location.href = objectUrl;
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    return;
  }

  previewWindow?.close();
  triggerFileDownload(blob, filename);
};
