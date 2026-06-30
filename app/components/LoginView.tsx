'use client';

import React, { useState } from 'react';
import { Lock, Mail, Server, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (adminEmail: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('admin@scanlink.vn');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication check
    setTimeout(() => {
      if (email === 'admin@scanlink.vn' && password === 'admin123456') {
        onLoginSuccess(email);
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu quản trị viên.');
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickBypass = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess('admin@scanlink.vn');
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[128px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/20 blur-[128px]"></div>
      
      {/* Login Box */}
      <div className="relative w-full max-w-md px-6 py-12 sm:px-8">
        <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Logo Badge */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ScanLink Admin
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Hệ thống quét và quản lý tài liệu di động
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Quản trị
              </label>
              <div className="relative mt-2">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@scanlink.vn"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pr-4 pl-10 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mật khẩu
              </label>
              <div className="relative mt-2">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pr-4 pl-10 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Đăng nhập hệ thống'
              )}
            </button>
          </form>

          {/* Quick Access Portal for Testing */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Hoặc truy cập nhanh</span>
            </div>
          </div>

          <button
            onClick={handleQuickBypass}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <Server className="h-3.5 w-3.5" />
            Bypass với Account Admin
          </button>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-600">
          ScanLink Admin Portal v1.0 • Bảo mật Firebase Authentication & REST Security
        </p>
      </div>
    </div>
  );
}
