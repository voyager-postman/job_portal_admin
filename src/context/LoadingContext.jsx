import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import GlobalLoader from "../components/Loader/GlobalLoader";
import {
  registerLoadingCallbacks,
  resetGlobalLoader,
} from "../utils/loadingService";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    registerLoadingCallbacks(
      () => setLoading(true),
      () => setLoading(false),
    );

    return () => {
      resetGlobalLoader();
      registerLoadingCallbacks(() => {}, () => {});
    };
  }, []);

  const showLoading = useCallback((loaderMessage = "Loading...") => {
    setMessage(loaderMessage);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      <GlobalLoader visible={loading} message={message} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
