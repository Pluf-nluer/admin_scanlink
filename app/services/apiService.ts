// API Service for ScanLink - Handles all REST API requests to the backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper to get admin authorization headers
function getAdminHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('scanlink_admin_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// Helper to make JSON requests
async function jsonRequest(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

export const apiService = {
  // === ADMIN PORTAL API METHODS ===

  // GET /api/v1/admin/dashboard/stats
  async getAdminStats() {
    return jsonRequest('/api/v1/admin/dashboard/stats', {
      headers: getAdminHeaders(),
    });
  },

  // GET /api/v1/admin/dashboard/charts
  async getAdminCharts(days = 30) {
    return jsonRequest(`/api/v1/admin/dashboard/charts?days=${days}`, {
      headers: getAdminHeaders(),
    });
  },

  // GET /api/v1/admin/users
  async getAdminUsers(page = 0, size = 10, search = '', isActive?: boolean) {
    let url = `/api/v1/admin/users?page=${page}&size=${size}&search=${encodeURIComponent(search)}`;
    if (isActive !== undefined) {
      url += `&isActive=${isActive}`;
    }
    return jsonRequest(url, {
      headers: getAdminHeaders(),
    });
  },

  // PUT /api/v1/admin/users/[uid]/status
  async updateUserStatus(uid: string, isActive: boolean) {
    return jsonRequest(`/api/v1/admin/users/${uid}/status`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ isActive }),
    });
  },

  // PUT /api/v1/admin/users/[uid]/quota
  async updateUserQuota(uid: string, storageLimitBytes: number) {
    return jsonRequest(`/api/v1/admin/users/${uid}/quota`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify({ storageLimitBytes }),
    });
  },

  // GET /api/v1/admin/documents
  async getAdminDocuments(page = 0, size = 20, search = '', ownerUid = '') {
    const url = `/api/v1/admin/documents?page=${page}&size=${size}&search=${encodeURIComponent(search)}&ownerUid=${encodeURIComponent(ownerUid)}`;
    return jsonRequest(url, {
      headers: getAdminHeaders(),
    });
  },

  // DELETE /api/v1/admin/documents/[id]
  async deleteAdminDocument(id: string) {
    return jsonRequest(`/api/v1/admin/documents/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
  },

  // === CLIENT PORTAL API METHODS (SDD v1.5) ===

  // POST /api/v1/auth/register [INT-API-001] [INT-API-010]
  async registerUser(firebaseIdToken: string) {
    return jsonRequest('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  },

  // POST /api/v1/auth/login [INT-API-002]
  async loginUser(firebaseIdToken: string) {
    return jsonRequest('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  },

  // POST /api/v1/documents [INT-API-003] - Upload document (uses multipart/form-data)
  async uploadDocument(firebaseIdToken: string, file: File, title: string, extractedText?: string) {
    const url = `${BASE_URL}/api/v1/documents`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (extractedText) {
      formData.append('extractedText', extractedText);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
        // Note: Content-Type header must NOT be set manually for FormData so boundary is added
      },
      body: formData,
    });

    return response.json();
  },

  // GET /api/v1/documents [INT-API-004] - List personal documents
  async getUserDocuments(firebaseIdToken: string, page = 0, size = 20, search = '') {
    const path = `/api/v1/documents?page=${page}&size=${size}&search=${encodeURIComponent(search)}`;
    return jsonRequest(path, {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  },

  // GET /api/v1/documents/[id] [INT-API-005] - Query document detail
  async getDocumentDetail(firebaseIdToken: string, id: string) {
    return jsonRequest(`/api/v1/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  },

  // DELETE /api/v1/documents/[id] [INT-API-006] - Delete document
  async deleteDocument(firebaseIdToken: string, id: string) {
    return jsonRequest(`/api/v1/documents/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  },

  // POST /api/v1/shares/public [INT-API-007] - Create public shared link
  async createPublicShare(firebaseIdToken: string, documentId: string, password?: string, expireInDays?: number) {
    return jsonRequest('/api/v1/shares/public', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
      body: JSON.stringify({ documentId, password, expireInDays }),
    });
  },

  // POST /api/v1/shares/private [INT-API-008] - Private account sharing
  async assignPrivatePermission(firebaseIdToken: string, documentId: string, shareToEmail: string, role: 'VIEWER' | 'EDITOR') {
    return jsonRequest('/api/v1/shares/private', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
      body: JSON.stringify({ documentId, shareToEmail, role }),
    });
  },

  // GET /api/v1/shares/public/[hash_token] [INT-API-009] - Access public share
  async accessPublicShare(hashToken: string, password?: string) {
    let path = `/api/v1/shares/public/${hashToken}`;
    if (password) {
      path += `?password=${encodeURIComponent(password)}`;
    }
    return jsonRequest(path);
  },
};
