import { NextResponse } from 'next/server';
import { getUser } from '@/app/actions/users';
import { verifyPassword, isLegacyPassword, hashPassword } from '@/lib/rbac/password';
import { createToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/rbac/jwt';
import { getEffectivePermissions } from '@/lib/rbac/permissions';
import type { Role, SessionUser } from '@/lib/rbac/types';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        const user = await getUser(email);

        if (!user || user.disabled) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password (supports both legacy plaintext and scrypt hashes)
        const passwordValid = await verifyPassword(password, user.password);
        if (!passwordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Auto-migrate legacy plaintext password to scrypt hash
        if (isLegacyPassword(user.password)) {
            const { migratePasswordHash } = await import('@/app/actions/users');
            await migratePasswordHash(user.id, password);
            console.log(`[AUTH] Migrated password hash for user: ${user.email}`);
        }

        // Build roles array (support both legacy single role and new multi-role)
        const roles: Role[] = user.roles
            ? user.roles
            : (user as any).role
                ? [(user as any).role as Role]
                : ['viewer' as Role];

        // Calculate effective permissions from roles + any per-user overrides
        const permissions = getEffectivePermissions(roles, user.permissions);

        // Build session user
        const sessionUser: SessionUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            roles,
            permissions,
        };

        // Create JWT with permissions embedded
        const token = await createToken(sessionUser);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles,
                permissions,
            },
        }, { status: 200 });

        // Set JWT cookie
        response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

        // Also set legacy cookie for backward compatibility (will be removed later)
        const legacyData = JSON.stringify({ id: user.id, role: roles[0], name: user.name });
        response.cookies.set('admin_session', legacyData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return response;
    } catch (e) {
        console.error('[AUTH] Login error:', e);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
