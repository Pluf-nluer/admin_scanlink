'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  HardDrive,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';

interface StatsData {
  totalUsers: number;
  totalDocuments: number;
  totalStorageUsedBytes: number;
  activeUsers30Days: number;
  storageLimitMaxBytes: number;
}

interface ChartItem {
  date: string;
  count: number;
}

interface ChartsData {
  registrationChart: ChartItem[];
  uploadChart: ChartItem[];
  providerDistribution: Record<string, number>;
}

interface TopUser {
  uid: string;
  displayName: string;
  email: string;
  photoUrl: string;
  role: string;
  storageUsed: number;
  storageLimit: number;
}

export default function DashboardView() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [charts, setCharts] = useState<ChartsData | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all stats & charts data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const statsJson = await apiService.getAdminStats();
      const chartsJson = await apiService.getAdminCharts(30);
      const usersJson = await apiService.getAdminUsers(0, 100);

      if (statsJson.status === 'success' && chartsJson.status === 'success') {
        setStats(statsJson.data);
        setCharts(chartsJson.data);
        
        // Compute top storage users
        if (usersJson.status === 'success' && usersJson.data.content) {
          const sortedUsers = [...usersJson.data.content]
            .sort((a, b) => b.storageUsed - a.storageUsed)
            .slice(0, 5);
          setTopUsers(sortedUsers);
        }
      } else {
        setError('Không thể nạp dữ liệu thống kê từ API.');
      }
    } catch (err: any) {
      setError('Đã xảy ra lỗi kết nối API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Đang tải số liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-rose-500">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
        <h3 className="mt-4 font-bold text-lg">Lỗi tải dữ liệu</h3>
        <p className="mt-2 text-sm text-rose-400/90">{error}</p>
        <button
          onClick={fetchData}
          className="mt-6 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Pure dynamic SVG Line chart generation (Registrations)
  const renderLineChart = () => {
    if (!charts || !charts.registrationChart || charts.registrationChart.length === 0) return null;
    const data = charts.registrationChart;
    const width = 600;
    const height = 220;
    const padding = 30;
    
    const maxVal = Math.max(...data.map(d => d.count), 1);
    
    // Compute SVG points
    const points = data.map((d, i) => {
      const x = padding + (i * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (d.count / (maxVal * 1.2)) * (height - padding * 2);
      return { x, y, val: d.count, date: d.date };
    });

    const pathData = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-zinc-800/40" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-slate-100 dark:text-zinc-800/40" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-zinc-800/80" />

          {/* Area under the line */}
          <path d={areaData} fill="url(#lineGlow)" />

          {/* Line Path */}
          <path d={pathData} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_8px_rgba(139,92,246,0.3)]" />

          {/* Points */}
          {points.map((p, i) => {
            // Show only some points to avoid crowding
            if (i % 3 !== 0 && i !== points.length - 1) return null;
            return (
              <g key={i} className="group/dot cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                <circle cx={p.x} cy={p.y} r="10" fill="#8b5cf6" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                <title>{`${p.date}: ${p.val} tài khoản`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Pure dynamic SVG Bar chart generation (Uploads)
  const renderBarChart = () => {
    if (!charts || !charts.uploadChart || charts.uploadChart.length === 0) return null;
    const data = charts.uploadChart;
    const width = 600;
    const height = 220;
    const padding = 30;
    const maxVal = Math.max(...data.map(d => d.count), 1);
    
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.7;
    const gap = (chartWidth / data.length) * 0.3;

    return (
      <div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-zinc-800/40" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-slate-100 dark:text-zinc-800/40" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-zinc-800/80" />

          {/* Bar items */}
          {data.map((d, i) => {
            const barHeight = (d.count / (maxVal * 1.15)) * chartHeight;
            const x = padding + i * (barWidth + gap);
            const y = height - padding - barHeight;

            return (
              <g key={i} className="group/bar cursor-pointer">
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  className="fill-indigo-500 group-hover/bar:fill-indigo-400 transition-all"
                />
                <title>{`${d.date}: ${d.count} file`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Donut chart helper
  const googleCount = charts?.providerDistribution['google.com'] || 0;
  const emailCount = charts?.providerDistribution['password'] || 0;
  const totalProv = googleCount + emailCount || 1;
  const googlePct = Math.round((googleCount / totalProv) * 100);
  const emailPct = 100 - googlePct;

  // SVG Circumference calculation for donut
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const googleDash = (googleCount / totalProv) * circ;
  const emailDash = circ - googleDash;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Tổng quan hệ thống</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400">Giám sát các chỉ số cốt lõi và băng thông sử dụng thời gian thực.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Users</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers.toLocaleString()}</h3>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.4% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Total Docs</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalDocuments.toLocaleString()}</h3>
            <div className="mt-2 flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 font-medium">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>Cập nhật 1 phút trước</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Storage Used</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
              <HardDrive className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats ? formatBytes(stats.totalStorageUsedBytes) : '0 GB'}
            </h3>
            <div className="mt-2 text-xs text-slate-400 dark:text-zinc-500">
              Trên tổng dung lượng {stats ? formatBytes(stats.storageLimitMaxBytes) : '500 GB'}
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Active Users (30d)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.activeUsers30Days}</h3>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 font-medium">
              <span>Hoạt động tích cực trên Cloud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Registration Line Chart Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tài khoản đăng ký mới</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Số lượng người đăng ký mới hàng ngày (30 ngày qua)</p>
            </div>
          </div>
          <div className="mt-6">
            {renderLineChart()}
          </div>
        </div>

        {/* Auth Provider Distribution Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="border-b border-slate-100 pb-4 dark:border-zinc-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tỉ lệ đăng ký User mới</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Phân bố phương thức xác thực</p>
          </div>
          
          <div className="mt-8 flex flex-col items-center justify-center">
            {/* Donut Chart */}
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeDasharray={`${googleDash} ${circ}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${emailDash} ${circ}`}
                  strokeDashoffset={-googleDash}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{totalProv}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Người dùng</span>
              </div>
            </div>

            {/* Legends */}
            <div className="mt-8 w-full space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Google OAuth</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{googlePct}% ({googleCount})</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Email & Password</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{emailPct}% ({emailCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Stats Bar Chart & Top Storage Users */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload documents daily bar chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tài liệu tải lên hệ thống</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Tần suất upload file PDF/Ảnh (30 ngày qua)</p>
            </div>
          </div>
          <div className="mt-6">
            {renderBarChart()}
          </div>
        </div>

        {/* Top 5 Storage Users List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="border-b border-slate-100 pb-4 dark:border-zinc-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Top 5 dung lượng lưu trữ</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Người dùng tiêu thụ tài nguyên nhiều nhất</p>
          </div>

          <div className="mt-6 space-y-4">
            {topUsers.map((u, i) => {
              const usagePercent = Math.min((u.storageUsed / u.storageLimit) * 100, 100);
              return (
                <div key={u.uid} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-600 dark:text-zinc-300">
                        {i + 1}
                      </div>
                      <span className="font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[120px]">
                        {u.displayName}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-zinc-400 font-medium">
                      {formatBytes(u.storageUsed)} / {formatBytes(u.storageLimit)}
                    </span>
                  </div>

                  {/* Quota limit progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usagePercent > 85
                          ? 'bg-rose-500'
                          : usagePercent > 50
                          ? 'bg-amber-500'
                          : 'bg-violet-600'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            
            {topUsers.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-8">Chưa có dữ liệu lưu trữ.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
