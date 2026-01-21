import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import dayjs from "dayjs";
import { ConfigProvider } from "antd";

// Configure dayjs for antd
dayjs.locale("en");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/jobPortal/admin">
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
