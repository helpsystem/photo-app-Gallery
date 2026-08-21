/**
 * Role → Permission mapping
 * 
 * Each role has a set of default permissions.
 * A user with multiple roles gets the UNION of all permissions.
 * super_admin gets ALL permissions automatically.
 */

import { Role, Permission, PERMISSIONS } from './types';

// ─── Role → Permission Matrix ─────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: [...PERMISSIONS], // ALL permissions

  admin: [
    'users.manage', 'users.view', 'roles.assign',
    'content.edit', 'content.view',
    'media.upload', 'media.delete', 'media.view',
    'music.manage', 'music.view',
    'files.manage', 'files.view',
    'settings.view', 'settings.edit',
    'broadcast.control', 'broadcast.view',
    'slides.manage', 'slides.view',
    'bible.manage', 'bible.view',
    'ai.transcription', 'ai.search',
    'invoice.manage', 'invoice.view',
  ],

  manager: [
    'users.view',
    'content.edit', 'content.view',
    'media.upload', 'media.view',
    'music.manage', 'music.view',
    'files.manage', 'files.view',
    'settings.view',
    'broadcast.control', 'broadcast.view',
    'slides.manage', 'slides.view',
    'bible.manage', 'bible.view',
    'ai.transcription', 'ai.search',
    'invoice.view',
  ],

  worship_leader: [
    'content.view',
    'media.view',
    'music.manage', 'music.view',
    'files.view',
    'broadcast.control', 'broadcast.view',
    'slides.manage', 'slides.view',
    'bible.manage', 'bible.view',
    'ai.transcription',
  ],

  editor: [
    'content.edit', 'content.view',
    'media.upload', 'media.view',
    'music.view',
    'files.view',
    'broadcast.view',
    'slides.view',
    'bible.view',
  ],

  viewer: [
    'content.view',
    'media.view',
    'music.view',
    'files.view',
    'broadcast.view',
    'slides.view',
    'bible.view',
  ],
};

// ─── Permission Utilities ─────────────────────────────────────────────────────

/**
 * Get the effective permission set for a user with given roles + optional overrides.
 * Returns a deduplicated array of permissions.
 */
export function getEffectivePermissions(
  roles: Role[],
  extraPermissions?: Permission[]
): Permission[] {
  const permSet = new Set<Permission>();

  // Union of all role permissions
  for (const role of roles) {
    const rolePerms = ROLE_PERMISSIONS[role];
    if (rolePerms) {
      for (const p of rolePerms) {
        permSet.add(p);
      }
    }
  }

  // Add any per-user extra permissions
  if (extraPermissions) {
    for (const p of extraPermissions) {
      permSet.add(p);
    }
  }

  return Array.from(permSet);
}

/**
 * Check if a permission set includes a specific permission.
 */
export function hasPermission(
  userPermissions: Permission[],
  required: Permission
): boolean {
  return userPermissions.includes(required);
}

/**
 * Check if a permission set includes ALL of the required permissions.
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.every((p) => userPermissions.includes(p));
}

/**
 * Check if a permission set includes ANY of the required permissions.
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  required: Permission[]
): boolean {
  return required.some((p) => userPermissions.includes(p));
}

/**
 * Check if a user has a specific role.
 */
export function hasRole(userRoles: Role[], required: Role): boolean {
  return userRoles.includes(required);
}

/**
 * Check if a user has any of the specified roles.
 */
export function hasAnyRole(userRoles: Role[], required: Role[]): boolean {
  return required.some((r) => userRoles.includes(r));
}

/**
 * Check if a role can manage (assign/modify) another role.
 * Prevents privilege escalation: you can only assign roles below your highest role.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  admin: 80,
  manager: 60,
  worship_leader: 40,
  editor: 20,
  viewer: 10,
};

export function canAssignRole(assignerRoles: Role[], targetRole: Role): boolean {
  const assignerLevel = Math.max(...assignerRoles.map((r) => ROLE_HIERARCHY[r] ?? 0));
  const targetLevel = ROLE_HIERARCHY[targetRole] ?? 0;
  return assignerLevel > targetLevel;
}

/**
 * Get the highest role level from a set of roles.
 */
export function getHighestRoleLevel(roles: Role[]): number {
  return Math.max(...roles.map((r) => ROLE_HIERARCHY[r] ?? 0));
}
