export type Role = 'admin' | 'editor' | 'viewer';

export interface ScreenPermission {
  path: string;         // e.g. '/dashboard'
  label: string;        // e.g. 'Dashboard'
  allowedRoles: Role[]; // e.g. ['admin', 'editor']
}