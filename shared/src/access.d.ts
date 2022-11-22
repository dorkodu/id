export interface IAccess {
  id: number;
  createdAt: number;
  expiresAt: number;
  userAgent: string;
  ip: string;
  service: string;
}