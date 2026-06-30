'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Sun,
  Moon,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'users' | 'documents';
  setActiveTab: (tab: 'dashboard' | 'users' | 'documents') => void;
  adminEmail: string;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  adminEmail,
  onLogout,
  darkMode,
  setDarkMode,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Tổng quan hệ thống',
      icon: LayoutDashboard,
      desc: 'KPIs, Biểu đồ thống kê'
    },
    {
      id: 'users' as const,
      label: 'Quản lý người dùng',
      icon: Users,
      desc: 'Quota, Trạng thái hoạt động'
    },
    {
      id: 'documents' as const,
      label: 'Quản lý tài liệu',
      icon: FileText,
      desc: 'Chi tiết OCR, Cưỡng chế xóa'
    }
  ];

  const handleTabClick = (tabId: 'dashboard' | 'users' | 'documents') => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 px-4 py-6 text-white dark:bg-zinc-950 border-r border-slate-800 dark:border-zinc-800/80">
      <div>
        {/* Header Logo */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
            <ShieldAlert className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              ScanLink
            </span>
            <span className="ml-1 rounded bg-violet-600/30 px-1 py-0.5 text-[9px] font-medium tracking-wide text-violet-300 uppercase">
              Admin
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 scale-[1.01]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <div>
                  <div className="text-sm font-semibold leading-tight">{item.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-violet-200' : 'text-slate-500 group-hover:text-slate-400'}`}>{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & User Card */}
      <div className="space-y-4">
        {/* Dark/Light mode toggle widget */}
        <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-1 border border-slate-800/40">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              !darkMode
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              darkMode
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
          </button>
        </div>

        {/* Administrator Profile Card */}
        <div className="border-t border-slate-850 pt-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-950/30 p-2.5 border border-slate-800/30">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 font-bold text-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-200">System Admin</p>
              <p className="truncate text-[10px] text-slate-500">{adminEmail}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/30 py-2.5 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white dark:border-zinc-800/80 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-violet-500" />
          <span className="font-bold tracking-tight">ScanLink Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-white"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar drawer for desktop */}
      <div className="hidden w-64 shrink-0 md:block">
        {sidebarContent}
      </div>

      {/* Mobile drawer backdrop and overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative z-50 w-64 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
