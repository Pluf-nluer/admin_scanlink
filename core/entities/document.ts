export interface Document {
  id: string;
  title: string;
  ownerUid: string;
  ownerEmail: string;
  fileSize: number; // bytes
  storageUrl: string;
  ocrText: string;
  shareLinksCount: number;
  createdAt: string;
}
