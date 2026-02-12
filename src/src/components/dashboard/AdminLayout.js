import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../SideBar/Sidebar";
import { Outlet } from "react-router-dom";
import "./dashboard.css";

const AdminLayout = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isSidebarShown, setIsSidebarShown] = useState(false);

  // Auto adjust sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarHidden(false);
      } else {
        setIsSidebarShown(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarShown((prev) => !prev);
    } else {
      setIsSidebarHidden((prev) => !prev);
    }
  };

  return (
    <div>
      <Header handleToggle={handleToggle} />
      <Sidebar
        isSidebarHidden={isSidebarHidden}
        isSidebarShown={isSidebarShown}
      />
      {/* Render child pages here */}
      <div
        style={{ marginLeft: isSidebarHidden ? "0" : "280px", padding: "20px" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
