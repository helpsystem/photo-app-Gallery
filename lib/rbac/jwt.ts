/**
 * JWT utilities using `jose` library.
 * Works in both Edge runtime (middleware) and Node.js runtime (server actions).
 * 
 * Permissions are embedded in the JWT for fast authorization without DB lookups.
 */

import { SignJWT, jwtVerify, type JWTPayload as JosePayload } from 'jose';
import type { SessionUser, Role, Permission, JWTPayload } from './types';

// ─── Configuration ────────────────────────────────────────────────────────────

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'mychurch-broadcast-secret-change-in-production-2026';
const JWT_ISSUER = 'mychurch-broadcast';
const JWT_AUDIENCE = 'mychurch-app';
const JWT_EXPIRY = '24h'; // Token expiry time

// Encode secret for jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET_KEY);
}

// ─── Token Creation ───────────────────────────────────────────────────────────

/**
 * Create a signed JWT with user data and permissions embedded.
 */
export async function createToken(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    permissions: user.permissions,
  } as unknown as JosePayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecretKey());

  return token;
}

// ─── Token Verification ──────────────────────────────────────────────────────

/**
 * Verify and decode a JWT. Returns null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      roles: payload.roles as Role[],
      permissions: payload.permissions as Permission[],
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    // Token expired, invalid signature, etc.
    return null;
  }
}

/**
 * Extract SessionUser from a verified JWT payload.
 */
export function payloadToSession(payload: JWTPayload): SessionUser {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}

// ─── Cookie Configuration ─────────────────────────────────────────────────────

export const AUTH_COOKIE_NAME = 'mychurch_token';

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24, // 24 hours (matches JWT expiry)
  path: '/',
};
