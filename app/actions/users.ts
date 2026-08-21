'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/rbac/password';
import { getEffectivePermissions, canAssignRole } from '@/lib/rbac/permissions';
import { requireAuth, requirePermission, getSession } from '@/lib/rbac/auth';
import type { StoredUser, SafeUser, Role, Permission } from '@/lib/rbac/types';

const usersPath = path.join(process.cwd(), 'data', 'users.json');

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function readUsers(): Promise<StoredUser[]> {
    try {
        const data = await fs.readFile(usersPath, 'utf8');
        const users = JSON.parse(data);
        // Normalize legacy users (single role → roles array)
        return users.map((u: any) => ({
            ...u,
            roles: u.roles || (u.role ? [u.role] : ['viewer']),
            permissions: u.permissions || [],
            createdAt: u.createdAt || new Date().toISOString(),
            updatedAt: u.updatedAt || new Date().toISOString(),
        }));
    } catch (error) {
        return [];
    }
}

async function writeUsers(users: StoredUser[]) {
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

/**
 * Convert a stored user to a safe user (no password, with effective permissions).
 */
function toSafeUser(user: StoredUser): SafeUser {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions: getEffectivePermissions(user.roles, user.permissions),
        disabled: user.disabled,
    };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a user by email (internal use for login — returns full stored user).
 * No auth guard because this is called during the login flow.
 */
export async function getUser(email: string): Promise<StoredUser | undefined> {
    const users = await readUsers();
    return users.find((u) => u.email === email);
}

/**
 * Get all users (safe, no passwords). Requires 'users.view' permission.
 */
export async function getAllUsers(): Promise<SafeUser[]> {
    await requirePermission('users.view');
    const users = await readUsers();
    return users.map(toSafeUser);
}

/**
 * Get all users without auth check (for admin page server component).
 * Only returns safe user data (no passwords).
 */
export async function getAllUsersSafe(): Promise<SafeUser[]> {
    const session = await getSession();
    if (!session) return [];
    const users = await readUsers();
    return users.map(toSafeUser);
}

/**
 * Create a new user. Requires 'users.manage' permission (unless it's the first user).
 */
export async function createUser(userData: any): Promise<SafeUser> {
    const users = await readUsers();

    // Allow first user creation without auth (bootstrap)
    if (users.length > 0) {
        await requirePermission('users.manage');
    }

    if (users.find((u) => u.email === userData.email)) {
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser: StoredUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        roles: userData.roles || ['viewer'], // Default: viewer (not editor)
        permissions: [],
        disabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);
    return toSafeUser(newUser);
}

/**
 * Update user roles. Requires 'roles.assign' permission.
 * Enforces role hierarchy (can't assign roles higher than your own).
 */
export async function updateUserRoles(userId: string, newRoles: Role[]): Promise<SafeUser> {
    const session = await requirePermission('roles.assign');

    // Validate roles
    if (!newRoles || newRoles.length === 0) {
        throw new Error('User must have at least one role');
    }

    // Check hierarchy — can't assign roles at or above your own level
    for (const role of newRoles) {
        if (!canAssignRole(session.roles, role)) {
            throw new Error(`Cannot assign role '${role}' — insufficient privilege level`);
        }
    }

    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) throw new Error('User not found');

    // Prevent self-demotion
    if (userId === session.id) {
        throw new Error('Cannot modify your own roles');
    }

    users[index].roles = newRoles;
    users[index].updatedAt = new Date().toISOString();
    await writeUsers(users);
    return toSafeUser(users[index]);
}

/**
 * Update user's extra permissions (beyond role defaults).
 * Requires 'roles.assign' permission.
 */
export async function updateUserPermissions(
    userId: string,
    extraPermissions: Permission[]
): Promise<SafeUser> {
    await requirePermission('roles.assign');

    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) throw new Error('User not found');

    users[index].permissions = extraPermissions;
    users[index].updatedAt = new Date().toISOString();
    await writeUsers(users);
    return toSafeUser(users[index]);
}

/**
 * Change password. Users can change their own password.
 * Admins with 'users.manage' can change any user's password.
 */
export async function changePassword(userId: string, newPass: string): Promise<boolean> {
    const session = await requireAuth();

    // Users can change their own password, admins can change anyone's
    if (userId !== session.id) {
        if (!session.permissions.includes('users.manage')) {
            throw new Error('FORBIDDEN: Cannot change other users\' passwords');
        }
    }

    if (!newPass || newPass.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }

    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) throw new Error('User not found');

    users[index].password = await hashPassword(newPass);
    users[index].updatedAt = new Date().toISOString();
    await writeUsers(users);
    return true;
}

/**
 * Disable/enable a user account. Requires 'users.manage' permission.
 */
export async function toggleUserDisabled(userId: string): Promise<SafeUser> {
    const session = await requirePermission('users.manage');

    if (userId === session.id) {
        throw new Error('Cannot disable your own account');
    }

    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) throw new Error('User not found');

    users[index].disabled = !users[index].disabled;
    users[index].updatedAt = new Date().toISOString();
    await writeUsers(users);
    return toSafeUser(users[index]);
}

/**
 * Migrate a user's password from plaintext to scrypt hash.
 * Called internally during login when legacy password is detected.
 */
export async function migratePasswordHash(userId: string, plainPassword: string): Promise<void> {
    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) return;

    users[index].password = await hashPassword(plainPassword);
    users[index].updatedAt = new Date().toISOString();

    // Also migrate single role → roles array if needed
    if (!users[index].roles && (users[index] as any).role) {
        users[index].roles = [(users[index] as any).role as Role];
    }

    await writeUsers(users);
}

// ─── Legacy compatibility ─────────────────────────────────────────────────────

/**
 * @deprecated Use updateUserRoles instead.
 * Kept for backward compatibility. Maps single role to roles array.
 */
export async function updateUserRole(userId: string, newRole: string): Promise<SafeUser> {
    return updateUserRoles(userId, [newRole as Role]);
}
