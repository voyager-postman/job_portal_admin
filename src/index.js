import React from "react";
import ReactDOM from "react-dom/client";
import "./setupAxios";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <LoadingProvider>
      <BrowserRouter basename="/jobPortal/admin">
        <App />
      </BrowserRouter>
    </LoadingProvider>
  </AuthProvider>,
);
