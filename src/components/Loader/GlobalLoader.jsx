import React from "react";
import "./loader.css";

const GlobalLoader = ({ visible, message = "Loading..." }) => {
  if (!visible) return null;

  return (
    <div className="global-loader-overlay" role="status" aria-live="polite">
      <div className="global-loader-box">
        <div className="global-loader-spinner" aria-hidden="true" />
        <p className="global-loader-text">{message}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
