/**
 * Server-side auth helpers for server components and server actions.
 * 
 * Usage in server components:
 *   const session = await getSession();
 *   if (!session) redirect('/auth/login');
 * 
 * Usage in server actions:
 *   await requirePermission('content.edit');
 *   // ... do the action
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, verifyToken, payloadToSession } from './jwt';
import { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } from './permissions';
import type { SessionUser, Permission, Role } from './types';

// ─── Session Retrieval ────────────────────────────────────────────────────────

/**
 * Get the current session user from JWT cookie.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token?.value) {
    // Fallback: check legacy cookie for backward compatibility
    const legacyCookie = cookieStore.get('admin_session');
    if (legacyCookie?.value) {
      try {
        const legacy = JSON.parse(legacyCookie.value);
        return {
          id: legacy.id,
          email: legacy.email || '',
          name: legacy.name,
          roles: [legacy.role || 'viewer'],
          permissions: [], // Legacy sessions have no permission data
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  const payload = await verifyToken(token.value);
  if (!payload) return null;

  return payloadToSession(payload);
}

// ─── Authorization Guards ─────────────────────────────────────────────────────

/**
 * Require authentication. Throws/redirects if not logged in.
 * For use in server actions.
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED: Authentication required');
  }
  return session;
}

/**
 * Require a specific permission. Throws if not authorized.
 * For use in server actions.
 */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const session = await requireAuth();
  if (!hasPermission(session.permissions, permission)) {
    throw new Error(`FORBIDDEN: Missing permission '${permission}'`);
  }
  return session;
}

/**
 * Require ALL of the specified permissions. Throws if not authorized.
 */
export async function requireAllPermissions(permissions: Permission[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!hasAllPermissions(session.permissions, permissions)) {
    throw new Error(`FORBIDDEN: Missing required permissions`);
  }
  return session;
}

/**
 * Require ANY of the specified permissions. Throws if not authorized.
 */
export async function requireAnyPermission(permissions: Permission[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!hasAnyPermission(session.permissions, permissions)) {
    throw new Error(`FORBIDDEN: Missing required permissions`);
  }
  return session;
}

/**
 * Require a specific role. Throws if not authorized.
 */
export async function requireRole(role: Role): Promise<SessionUser> {
  const session = await requireAuth();
  if (!hasRole(session.roles, role)) {
    throw new Error(`FORBIDDEN: Missing role '${role}'`);
  }
  return session;
}
