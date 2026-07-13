

import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import DashboardThemeProvider from "../../providers/DashboardThemeProvider";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
      <DashboardThemeProvider>
        <div className="min-h-screen flex bg-(--background)" data-theme-dashboard dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out">
          
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 sm:p-6">
            <Outlet />
          </main>

        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      </DashboardThemeProvider>
  );
}