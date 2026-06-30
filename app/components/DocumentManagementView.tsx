'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Trash2, Eye, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, CheckCircle, XCircle, FileCode } from 'lucide-react';
import { apiService } from '../services/apiService';

interface Document {
  id: string;
  title: string;
  ownerUid: string;
  ownerEmail: string;
  fileSize: number;
  storageUrl: string;
  ocrText: string;
  shareLinksCount: number;
  createdAt: string;
}

export default function DocumentManagementView() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [ownerUid, setOwnerUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected document for OCR preview & Delete confirmation
  const [ocrDoc, setOcrDoc] = useState<Document | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast / Notification status
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const json = await apiService.getAdminDocuments(page, size, search, ownerUid);
      
      if (json.status === 'success') {
        setDocuments(json.data.content);
        setTotalPages(json.data.totalPages);
        setTotalElements(json.data.totalElements);
      } else {
        setError('Không thể lấy danh sách tài liệu.');
      }
    } catch (err: any) {
      setError('Lỗi tải danh sách tài liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, ownerUid]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Execute force deletion of a document
  const handleForceDelete = async () => {
    if (!deleteDoc) return;
    try {
      setDeleteLoading(true);
      const json = await apiService.deleteAdminDocument(deleteDoc.id);

      if (json.status === 'success') {
        showToast('Quản trị viên đã cưỡng chế xóa tài liệu thành công!', 'success');
        setDocuments(prev => prev.filter(d => d.id !== deleteDoc.id));
        setDeleteDoc(null);
      } else {
        showToast(json.message || 'Lỗi khi xóa tài liệu.', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    } finally {
      setDeleteLoading(false);
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
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Quản lý tài liệu</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Duyệt tìm, xem kết quả OCR trích xuất và cưỡng chế xóa tài liệu vi phạm.</p>
        </div>
        
        <button
          onClick={fetchDocuments}
          className="flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:grid-cols-2 md:grid-cols-3">
        {/* Document Title Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề tài liệu..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:bg-white dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500/80"
          />
        </div>

        {/* Owner UID Search Filter */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Lọc theo Owner UID..."
            value={ownerUid}
            onChange={(e) => {
              setOwnerUid(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-violet-500 focus:bg-white dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-violet-500/80"
          />
        </div>
      </div>

      {/* Documents list Table */}
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
                  <th scope="col" className="px-6 py-4">Tài liệu</th>
                  <th scope="col" className="px-6 py-4">Chủ sở hữu</th>
                  <th scope="col" className="px-6 py-4">Dung lượng</th>
                  <th scope="col" className="px-6 py-4">Ngày tải lên</th>
                  <th scope="col" className="px-6 py-4">Chia sẻ</th>
                  <th scope="col" className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                {documents.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition-colors">
                    {/* ID & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white leading-tight">{d.title}</div>
                          <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono tracking-tight mt-0.5">{d.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Owner Email & UID */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-800 dark:text-zinc-300">{d.ownerEmail}</div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-550 font-mono mt-0.5">UID: {d.ownerUid}</div>
                      </div>
                    </td>

                    {/* File Size */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-zinc-350">
                      {formatBytes(d.fileSize)}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(d.createdAt)}
                    </td>

                    {/* Share links count */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                        d.shareLinksCount > 0
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500'
                      }`}>
                        {d.shareLinksCount} Links
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View OCR */}
                        <button
                          onClick={() => setOcrDoc(d)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <title>Xem kết quả OCR trích xuất</title>
                        </button>
                        
                        {/* Force delete */}
                        <button
                          onClick={() => setDeleteDoc(d)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200/40 bg-white text-rose-500 hover:text-white hover:bg-rose-500 dark:border-zinc-850 dark:bg-zinc-950 dark:hover:bg-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <title>Cưỡng chế xóa</title>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {documents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Không tìm thấy tài liệu phù hợp trong hệ thống.
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
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">{documents.length}</span> / {totalElements} tài liệu
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

      {/* OCR Preview dialog */}
      {ocrDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOcrDoc(null)}></div>
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 text-left animate-slide-in flex flex-col max-h-[85vh]">
            {/* Modal Title */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-zinc-850">
              <FileCode className="h-5.5 w-5.5 text-violet-500" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{ocrDoc.title}</h3>
                <p className="text-xs text-slate-400">Kết quả OCR trích xuất văn bản từ OpenCV / ML Kit</p>
              </div>
            </div>

            {/* OCR Content Box */}
            <div className="mt-4 flex-1 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[50vh]">
              <pre className="whitespace-pre-wrap">{ocrDoc.ocrText || '// Không tìm thấy dữ liệu văn bản trích xuất.'}</pre>
            </div>

            {/* Actions Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Size: {formatBytes(ocrDoc.fileSize)}</span>
              <button
                onClick={() => setOcrDoc(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force delete confirmation modal */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setDeleteDoc(null)}></div>
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 text-left animate-slide-in">
            {/* Modal Title */}
            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Cưỡng chế xóa tài liệu?</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn tệp <strong className="text-slate-800 dark:text-slate-100">{deleteDoc.title}</strong> khỏi MongoDB Database đồng thời giải phóng tệp tin vật lý trên S3 File Storage.
              </p>
              <div className="mt-3 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                Dung lượng của user sở hữu sẽ được cập nhật tự động.
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteDoc(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleForceDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {deleteLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
