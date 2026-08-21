/**
 * RBAC Module - Public API
 * 
 * Re-exports all RBAC utilities for convenient importing:
 *   import { getSession, requirePermission, hasPermission } from '@/lib/rbac';
 */

// Types
export type {
  Role,
  Permission,
  StoredUser,
  SafeUser,
  JWTPayload,
  SessionUser,
} from './types';

export {
  ROLES,
  PERMISSIONS,
  ROLE_LABELS,
  PERMISSION_LABELS,
  PERMISSION_CATEGORIES,
} from './types';

// Permissions
export {
  ROLE_PERMISSIONS,
  getEffectivePermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  hasAnyRole,
  canAssignRole,
  getHighestRoleLevel,
} from './permissions';

// JWT (Edge-compatible)
export {
  createToken,
  verifyToken,
  payloadToSession,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} from './jwt';

// Auth helpers (Server-side only)
export {
  getSession,
  requireAuth,
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  requireRole,
} from './auth';
