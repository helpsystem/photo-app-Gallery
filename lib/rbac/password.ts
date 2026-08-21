/**
 * Password hashing utilities using Node.js built-in crypto module (scrypt).
 * Server-side only — do NOT import in client components or middleware (Edge runtime).
 */

import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

/**
 * Hash a password using scrypt.
 * Returns format: `salt:hash` (both hex-encoded).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const hash = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Verify a password against a stored hash.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  // Support legacy plaintext passwords (migration period)
  if (!storedHash.includes(':')) {
    // Legacy plaintext — compare directly and recommend migration
    console.warn('[SECURITY] Legacy plaintext password detected. Please migrate this user.');
    return password === storedHash;
  }

  const [saltHex, hashHex] = storedHash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const storedKey = Buffer.from(hashHex, 'hex');
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(storedKey, derivedKey);
}

/**
 * Check if a stored hash is legacy (plaintext) format.
 */
export function isLegacyPassword(storedHash: string): boolean {
  return !storedHash.includes(':');
}
