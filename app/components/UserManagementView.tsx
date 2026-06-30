'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldAlert, CheckCircle, XCircle, Settings, HardDrive, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  providerId: string;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
}

export default function UserManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Toast / Notification status
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Selected User for Quota edit modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newQuotaValue, setNewQuotaValue] = useState<number>(104857600); // 100MB default
  const [customQuotaInput, setCustomQuotaInput] = useState<string>('');
  const [quotaUnit, setQuotaUnit] = useState<'MB' | 'GB'>('MB');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      let activeFilter: boolean | undefined = undefined;
      if (isActiveFilter === 'active') {
        activeFilter = true;
      } else if (isActiveFilter === 'inactive') {
        activeFilter = false;
      }

      const json = await apiService.getAdminUsers(page, size, search, activeFilter);
      
      if (json.status === 'success') {
        setUsers(json.data.content);
        setTotalPages(json.data.totalPages);
        setTotalElements(json.data.totalElements);
      } else {
        setError('Không thể lấy danh sách người dùng.');
      }
    } catch (err: any) {
      setError('Lỗi tải danh sách người dùng: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, isActiveFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Toggle user active status
  const handleToggleStatus = async (uid: string, currentStatus: boolean) => {
    try {
      const json = await apiService.updateUserStatus(uid, !currentStatus);
      
      if (json.status === 'success') {
        showToast('Cập nhật trạng thái người dùng thành công!', 'success');
        // Refresh local items
        setUsers(prev =>
          prev.map(u => (u.uid === uid ? { ...u, isActive: !currentStatus } : u))
        );
      } else {
        showToast(json.message || 'Lỗi cập nhật trạng thái.', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  // Open storage quota limit editor modal
  const openQuotaModal = (user: User) => {
    setSelectedUser(user);
    const limitMB = Math.round(user.storageLimit / (1024 * 1024));
    setNewQuotaValue(user.storageLimit);
    setCustomQuotaInput(limitMB.toString());
    setQuotaUnit('MB');
  };

  const handleQuotaPreset = (bytes: number) => {
    setNewQuotaValue(bytes);
    if (bytes >= 1073741824) {
      setCustomQuotaInput((bytes / 1073741824).toString());
      setQuotaUnit('GB');
    } else {
      setCustomQuotaInput((bytes / (1024 * 1024)).toString());
      setQuotaUnit('MB');
    }
  };

  // Save modified storage quota
  const handleSaveQuota = async () => {
    if (!selectedUser) return;
    
    // Compute final limit in bytes
    let finalBytes = newQuotaValue;
    const customNum = parseFloat(customQuotaInput);
    
    if (!isNaN(customNum) && customNum > 0) {
      const multiplier = quotaUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024;
      finalBytes = Math.round(customNum * multiplier);
    }

    try {
      const json = await apiService.updateUserQuota(selectedUser.uid, finalBytes);
      
      if (json.status === 'success') {
        showToast('Thay đổi hạn mức Quota thành công!', 'success');
        setUsers(prev =>
          prev.map(u => (u.uid === selectedUser.uid ? { ...u, storageLimit: finalBytes } : u))
        );
        setSelectedUser(null);
      } else {
        showToast(json.message || 'Lỗi lưu hạn mức quota.', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans relative">
      {/* Toast alert popup */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Phân quyền, cấu hình trạng thái tài khoản và hạn mức dữ liệu lưu trữ.</p>
        </div>
        
        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters Dashboard Panel */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo DisplayName hoặc Email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:bg-white dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500/80"
          />
        </div>

        {/* Filter State Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 hidden md:inline">Trạng thái:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'active', label: 'Đang hoạt động' },
            { id: 'inactive', label: 'Bị khóa' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setIsActiveFilter(f.id);
                setPage(0);
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0 ${
                isActiveFilter === f.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Paginated Table */}
      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-zinc-800/80 dark:bg-zinc-900">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-zinc-400">{error}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-zinc-400">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-zinc-850 dark:bg-zinc-950/40">
                <tr>
                  <th scope="col" className="px-6 py-4">Tài khoản</th>
                  <th scope="col" className="px-6 py-4">Vai trò</th>
                  <th scope="col" className="px-6 py-4">Đăng nhập</th>
                  <th scope="col" className="px-6 py-4">Băng thông lưu trữ</th>
                  <th scope="col" className="px-6 py-4">Ngày tham gia</th>
                  <th scope="col" className="px-6 py-4">Hoạt động</th>
                  <th scope="col" className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                {users.map(u => {
                  const usagePercent = Math.min((u.storageUsed / u.storageLimit) * 100, 100);
                  return (
                    <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-colors">
                      {/* Avatar & Display info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                            alt={u.displayName}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-zinc-800 bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white leading-tight">{u.displayName}</div>
                            <div className="text-xs text-slate-400 dark:text-zinc-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Login Provider */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                          {u.providerId === 'google.com' ? 'Google Account' : 'Email/Pass'}
                        </span>
                      </td>

                      {/* Storage Progress bar */}
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-900 dark:text-white">{formatBytes(u.storageUsed)}</span>
                            <span className="text-slate-400">của {formatBytes(u.storageLimit)}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                usagePercent > 90 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-violet-600'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(u.uid, u.isActive)}
                          disabled={u.role === 'ADMIN'}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 outline-none ${
                            u.isActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                          } ${u.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              u.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openQuotaModal(u)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <title>Thay đổi hạn mức lưu trữ</title>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-zinc-850 dark:bg-zinc-950/20">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">{users.length}</span> / {totalElements} người dùng
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quota Limit modifier modal overlay */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 text-left animate-slide-in">
            {/* Modal Title */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-zinc-850">
              <HardDrive className="h-5 w-5 text-violet-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Điều chỉnh hạn mức Quota</h3>
                <p className="text-xs text-slate-400">Thay đổi giới hạn bộ nhớ của {selectedUser.displayName}</p>
              </div>
            </div>

            {/* Current Storage Info */}
            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 p-3 border border-slate-100 dark:border-zinc-850 flex items-center justify-between text-xs">
              <span className="text-slate-500">Dung lượng đã sử dụng:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatBytes(selectedUser.storageUsed)}</span>
            </div>

            {/* Presets */}
            <div className="mt-5 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gợi ý kích thước (Presets):</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '100 MB', bytes: 104857600 },
                  { label: '1 GB', bytes: 1073741824 },
                  { label: '5 GB', bytes: 5368709120 },
                  { label: '10 GB', bytes: 10737418240 },
                  { label: '20 GB', bytes: 21474836480 },
                  { label: '50 GB', bytes: 53687091200 }
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => handleQuotaPreset(p.bytes)}
                    className="rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mt-5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hoặc đặt hạn mức tùy chọn:</label>
              <div className="relative mt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="Nhập kích thước..."
                  value={customQuotaInput}
                  onChange={(e) => setCustomQuotaInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:border-violet-500"
                />
                <select
                  value={quotaUnit}
                  onChange={(e) => setQuotaUnit(e.target.value as 'MB' | 'GB')}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveQuota}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 hover:bg-violet-500"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
