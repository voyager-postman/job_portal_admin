import axios from "axios";
import {
  clearInvalidAuthHeader,
  clearAuthSession,
  clearStoredToken,
  getAuthToken,
  getLoginPath,
  hasAdminSession,
  isRevokedTokenError,
  setAuthHeader,
} from "./utils/authToken";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "./utils/loadingService";

// Backend sets HttpOnly auth_token cookie on login — sent when withCredentials is true.
axios.defaults.withCredentials = true;

const PUBLIC_ENDPOINTS = ["/login-admin", "login-admin", "forgotPassword", "resetPassword"];

const isPublicRequest = (url = "") =>
  PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const shouldForceLogout = (message = "") => {
  if (isRevokedTokenError(message) && hasAdminSession()) {
    return false;
  }
  if (message === "Invalid token") return true;
  return !hasAdminSession() && !getAuthToken();
};

const redirectToLogin = () => {
  const loginPath = getLoginPath();
  const currentPath = window.location.pathname;
  if (currentPath === loginPath || currentPath.endsWith("/jobPortal/admin/")) {
    return;
  }
  window.location.assign(loginPath);
};

const shouldShowLoader = (config = {}) => !config.skipGlobalLoader;

axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    if (shouldShowLoader(config)) {
      showGlobalLoader();
    }

    if (isPublicRequest(config.url)) {
      return config;
    }

    clearInvalidAuthHeader(config);

    const token = getAuthToken();
    if (token) {
      setAuthHeader(config, token);
    }

    return config;
  },
  (error) => {
    if (shouldShowLoader(error.config)) {
      hideGlobalLoader();
    }
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    if (shouldShowLoader(response.config)) {
      hideGlobalLoader();
    }
    return response;
  },
  async (error) => {
    if (shouldShowLoader(error.config)) {
      hideGlobalLoader();
    }

    const config = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || "";

    if (
      status === 401 &&
      config &&
      !isPublicRequest(config.url) &&
      isRevokedTokenError(message) &&
      !config._retryWithoutBearer
    ) {
      clearStoredToken();
      config._retryWithoutBearer = true;
      clearInvalidAuthHeader(config);
      config.skipGlobalLoader = true;
      return axios(config);
    }

    if (status === 401 && !isPublicRequest(config?.url)) {
      if (shouldForceLogout(message)) {
        clearAuthSession();
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
