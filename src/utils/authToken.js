const JWT_PATTERN = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const TOKEN_FIELDS = [
  "token",
  "accessToken",
  "access_token",
  "auth_token",
  "authToken",
  "jwt",
];

export const isJwt = (value) =>
  typeof value === "string" && JWT_PATTERN.test(value.trim());

export const getAuthMode = () => localStorage.getItem("authMode") || "cookie";

export const shouldSendBearerToken = () => {
  if (getAuthMode() !== "token") return false;
  return isJwt(localStorage.getItem("token"));
};

export const persistAuthToken = (token) => {
  if (!isJwt(token)) return null;
  const normalized = token.trim();
  localStorage.setItem("token", normalized);
  localStorage.setItem("authMode", "token");
  return normalized;
};

export const clearStoredToken = () => {
  localStorage.removeItem("token");
  localStorage.setItem("authMode", "cookie");
};

export const getAuthToken = () => {
  if (!shouldSendBearerToken()) return null;
  return localStorage.getItem("token").trim();
};

export const getAuthRequestConfig = (config = {}) => {
  const token = getAuthToken();
  if (!token) {
    return { ...config, withCredentials: true };
  }

  return {
    ...config,
    withCredentials: true,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ensureAuthRequestConfig = async (config = {}) =>
  getAuthRequestConfig(config);

export const isInvalidAuthHeader = (value) => {
  if (!value || typeof value !== "string") return true;
  const normalized = value.trim();
  return (
    normalized === "Bearer" ||
    normalized === "Bearer null" ||
    normalized === "Bearer undefined" ||
    normalized === "null" ||
    normalized === "undefined"
  );
};

export const extractAuthToken = (responseData) => {
  if (!responseData) return null;
  if (isJwt(responseData)) return responseData.trim();

  for (const field of TOKEN_FIELDS) {
    if (isJwt(responseData[field])) return responseData[field].trim();
  }

  const data = responseData.data;
  if (!data || typeof data !== "object") return null;

  for (const field of TOKEN_FIELDS) {
    if (isJwt(data[field])) return data[field].trim();
  }

  return null;
};

export const extractTokenFromHeaders = (headers = {}) => {
  const candidates = [
    headers.authorization,
    headers.Authorization,
    headers["x-auth-token"],
    headers["X-Auth-Token"],
    headers["x-access-token"],
    headers["access-token"],
  ];

  for (const raw of candidates) {
    if (!raw || typeof raw !== "string") continue;
    const token = raw.replace(/^Bearer\s+/i, "").trim();
    if (isJwt(token)) return token;
  }

  return null;
};

export const getAuthorizationHeader = () => {
  const token = getAuthToken();
  if (!token) return null;
  return `Bearer ${token}`;
};

export const clearInvalidAuthHeader = (config) => {
  const headers = config.headers;
  if (!headers) return config;

  const authValue =
    (typeof headers.get === "function" && headers.get("Authorization")) ||
    headers.Authorization ||
    headers.authorization;

  if (isInvalidAuthHeader(authValue) || !shouldSendBearerToken()) {
    if (typeof headers.delete === "function") {
      headers.delete("Authorization");
    } else {
      delete headers.Authorization;
      delete headers.authorization;
    }
  }

  return config;
};

export const setAuthHeader = (config, token = getAuthToken()) => {
  if (!isJwt(token)) return config;

  const value = `Bearer ${token.trim()}`;

  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", value);
  } else {
    config.headers = config.headers || {};
    config.headers.Authorization = value;
  }

  return config;
};

export const hasAdminSession = () => {
  try {
    const admin = localStorage.getItem("admin");
    return Boolean(admin && admin !== "null" && admin !== "undefined");
  } catch {
    return false;
  }
};

export const isAuthenticated = () =>
  Boolean(shouldSendBearerToken() || hasAdminSession());

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("authMode");
};

export const getLoginPath = () => {
  const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  return `${base}/`;
};

export const resolveLoginToken = (responseData, headers = {}) =>
  extractAuthToken(responseData) || extractTokenFromHeaders(headers);

export const isRevokedTokenError = (message = "") => {
  const normalized = String(message).toLowerCase();
  return (
    normalized.includes("revoked") ||
    normalized === "invalid token" ||
    normalized === "token expired"
  );
};
