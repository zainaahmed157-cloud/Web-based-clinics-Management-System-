import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

export default function DoctorDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <div
      className={`h-screen flex bg-[var(--background)] transition-all duration-700 ease-in-out overflow-hidden w-full${dark ? ' dark' : ''}`}
      data-theme-dashboard=""
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col h-full overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          dark={dark}
          setDark={setDark}
        />

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto w-full max-w-[1400px] rounded-[20px] p-4 sm:p-5"
            style={{
              background: 'radial-gradient(1200px circle at 0% 0%,rgba(31,111,235,0.05),transparent 50%),radial-gradient(900px circle at 100% 20%,rgba(25,167,181,0.05),transparent 60%)'
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
