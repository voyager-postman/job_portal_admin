import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Header from "../Header/Header";
import Sidebar from "../SideBar/Sidebar";
import DashboardContent from "../dashboard/DashboardContent";

const Dashboard = () => {
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
      {/* <Header handleToggle={handleToggle} /> */}
      {/* <Sidebar
        isSidebarHidden={isSidebarHidden}
        isSidebarShown={isSidebarShown}
      /> */}
      <DashboardContent isSidebarHidden={isSidebarHidden} />
    </div>
  );
};

export default Dashboard;
