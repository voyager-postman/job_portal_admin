import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
<<<<<<< HEAD
import "antd/dist/reset.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import dayjs from "dayjs";
import { ConfigProvider } from "antd";

// Configure dayjs for antd
dayjs.locale("en");
=======
import App from "./App";
import { BrowserRouter } from "react-router-dom";
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/jobPortal/admin">
<<<<<<< HEAD
      <ConfigProvider>
        <App />
      </ConfigProvider>
=======
      <App />
>>>>>>> d73511ce1449d187265f08e2d9bf191ee25d479a
    </BrowserRouter>
  </React.StrictMode>
);
