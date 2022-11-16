export interface ISession {
  id: number;
  createdAt: number;
  expiresAt: number;
  userAgent: string;
  ip: string;
}