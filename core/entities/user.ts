export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  providerId: string;
  storageUsed: number; // bytes
  storageLimit: number; // bytes
  createdAt: string;
  updatedAt: string;
}
