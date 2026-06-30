'use client';

import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UserManagementView from './components/UserManagementView';
import DocumentManagementView from './components/DocumentManagementView';

export default function Home() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'documents'>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize theme and login state from localStorage
  useEffect(() => {
    // 1. Đọc dữ liệu từ localStorage và xử lý DOM trước (Đồng bộ)
    const savedTheme = localStorage.getItem('scanlink_admin_theme');
    const isDark = savedTheme !== 'light'; // Mặc định là dark nếu không phải 'light'
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedEmail = localStorage.getItem('scanlink_admin_email');
    const savedToken = localStorage.getItem('scanlink_admin_token');

    // 2. Gom TẤT CẢ các hàm thay đổi state vào requestAnimationFrame (Bất đồng bộ)
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setDarkMode(isDark);
      if (savedEmail && savedToken) {
        setAdminEmail(savedEmail);
        setAdminToken(savedToken);
      }
    });

    // 3. Hàm clean-up chuẩn cú pháp TypeScript
    return () => {
      cancelAnimationFrame(id);
    };
  }, []);
  // Sync theme changes with DOM
  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    if (val) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('scanlink_admin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('scanlink_admin_theme', 'light');
    }
  };

  const handleLoginSuccess = (email: string, token: string) => {
    setAdminEmail(email);
    setAdminToken(token);
    localStorage.setItem('scanlink_admin_email', email);
    localStorage.setItem('scanlink_admin_token', token);
  };

  const handleLogout = () => {
    setAdminEmail(null);
    setAdminToken(null);
    localStorage.removeItem('scanlink_admin_email');
    localStorage.removeItem('scanlink_admin_token');
    localStorage.removeItem('scanlink_users'); // Reset mock db storage state
    localStorage.removeItem('scanlink_docs');
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated as Admin, show login screen
  if (!adminEmail || !adminToken) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Render view corresponding to active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return <UserManagementView />;
      case 'documents':
        return <DocumentManagementView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 transition-colors duration-200 dark:bg-black dark:text-zinc-300 md:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 overflow-y-auto max-h-screen">
        <div className="mx-auto max-w-6xl">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
