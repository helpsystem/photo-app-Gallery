/**
 * RBAC Type Definitions for MyChurch Broadcast Console Pro
 * 
 * Supports multi-role users with fine-grained permissions.
 * Permissions are the UNION of all assigned roles.
 */

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = [
  'super_admin',
  'admin',
  'manager',
  'worship_leader',
  'editor',
  'viewer',
] as const;

export type Role = typeof ROLES[number];

// ─── Permissions ──────────────────────────────────────────────────────────────
export const PERMISSIONS = [
  // User management
  'users.manage',
  'users.view',
  'roles.assign',

  // Content / CMS
  'content.edit',
  'content.view',

  // Media / Gallery
  'media.upload',
  'media.delete',
  'media.view',

  // Music / Worship
  'music.manage',
  'music.view',

  // File management
  'files.manage',
  'files.view',

  // Settings
  'settings.view',
  'settings.edit',

  // Broadcast / Live
  'broadcast.control',
  'broadcast.view',

  // Slides & Bible
  'slides.manage',
  'slides.view',
  'bible.manage',
  'bible.view',

  // AI features
  'ai.transcription',
  'ai.search',

  // Invoice (Shebaco)
  'invoice.manage',
  'invoice.view',
] as const;

export type Permission = typeof PERMISSIONS[number];

// ─── User Types ───────────────────────────────────────────────────────────────

/** Stored in data/users.json */
export interface StoredUser {
  id: string;
  email: string;
  password: string;         // scrypt hash
  name: string;
  roles: Role[];            // multi-role support
  permissions?: Permission[]; // optional per-user overrides (extra permissions beyond roles)
  disabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Safe user object (no password) - sent to client */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];  // effective permissions (roles + overrides combined)
  disabled?: boolean;
}

/** JWT payload embedded in token */
export interface JWTPayload {
  sub: string;               // user id
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];  // full effective permissions for fast checking
  iat: number;
  exp: number;
}

/** Session data available in server components & middleware */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
}

// ─── Role display labels (bilingual) ─────────────────────────────────────────
export const ROLE_LABELS: Record<Role, { en: string; fa: string }> = {
  super_admin:    { en: 'Super Admin',    fa: 'مدیر ارشد' },
  admin:          { en: 'Admin',          fa: 'مدیر' },
  manager:        { en: 'Manager',        fa: 'سرپرست' },
  worship_leader: { en: 'Worship Leader', fa: 'رهبر پرستش' },
  editor:         { en: 'Editor',         fa: 'ویرایشگر' },
  viewer:         { en: 'Viewer',         fa: 'بیننده' },
};

// ─── Permission display labels (bilingual) ───────────────────────────────────
export const PERMISSION_LABELS: Record<Permission, { en: string; fa: string }> = {
  'users.manage':       { en: 'Manage Users',          fa: 'مدیریت کاربران' },
  'users.view':         { en: 'View Users',            fa: 'مشاهده کاربران' },
  'roles.assign':       { en: 'Assign Roles',          fa: 'تخصیص نقش‌ها' },
  'content.edit':       { en: 'Edit Content',          fa: 'ویرایش محتوا' },
  'content.view':       { en: 'View Content',          fa: 'مشاهده محتوا' },
  'media.upload':       { en: 'Upload Media',          fa: 'آپلود رسانه' },
  'media.delete':       { en: 'Delete Media',          fa: 'حذف رسانه' },
  'media.view':         { en: 'View Media',            fa: 'مشاهده رسانه' },
  'music.manage':       { en: 'Manage Music',          fa: 'مدیریت موسیقی' },
  'music.view':         { en: 'View Music',            fa: 'مشاهده موسیقی' },
  'files.manage':       { en: 'Manage Files',          fa: 'مدیریت فایل‌ها' },
  'files.view':         { en: 'View Files',            fa: 'مشاهده فایل‌ها' },
  'settings.view':      { en: 'View Settings',         fa: 'مشاهده تنظیمات' },
  'settings.edit':      { en: 'Edit Settings',         fa: 'ویرایش تنظیمات' },
  'broadcast.control':  { en: 'Control Broadcast',     fa: 'کنترل پخش زنده' },
  'broadcast.view':     { en: 'View Broadcast',        fa: 'مشاهده پخش زنده' },
  'slides.manage':      { en: 'Manage Slides',         fa: 'مدیریت اسلایدها' },
  'slides.view':        { en: 'View Slides',           fa: 'مشاهده اسلایدها' },
  'bible.manage':       { en: 'Manage Bible Display',  fa: 'مدیریت نمایش کتاب‌مقدس' },
  'bible.view':         { en: 'View Bible',            fa: 'مشاهده کتاب‌مقدس' },
  'ai.transcription':   { en: 'AI Transcription',      fa: 'رونویسی هوش مصنوعی' },
  'ai.search':          { en: 'AI Search',             fa: 'جستجوی هوشمند' },
  'invoice.manage':     { en: 'Manage Invoices',       fa: 'مدیریت فاکتورها' },
  'invoice.view':       { en: 'View Invoices',         fa: 'مشاهده فاکتورها' },
};

// ─── Permission categories (for UI grouping) ─────────────────────────────────
export const PERMISSION_CATEGORIES: Record<string, { label: { en: string; fa: string }; permissions: Permission[] }> = {
  users: {
    label: { en: 'Users & Roles', fa: 'کاربران و نقش‌ها' },
    permissions: ['users.manage', 'users.view', 'roles.assign'],
  },
  content: {
    label: { en: 'Content', fa: 'محتوا' },
    permissions: ['content.edit', 'content.view'],
  },
  media: {
    label: { en: 'Media', fa: 'رسانه' },
    permissions: ['media.upload', 'media.delete', 'media.view'],
  },
  music: {
    label: { en: 'Music', fa: 'موسیقی' },
    permissions: ['music.manage', 'music.view'],
  },
  files: {
    label: { en: 'Files', fa: 'فایل‌ها' },
    permissions: ['files.manage', 'files.view'],
  },
  settings: {
    label: { en: 'Settings', fa: 'تنظیمات' },
    permissions: ['settings.view', 'settings.edit'],
  },
  broadcast: {
    label: { en: 'Broadcast', fa: 'پخش زنده' },
    permissions: ['broadcast.control', 'broadcast.view'],
  },
  slides: {
    label: { en: 'Slides & Bible', fa: 'اسلایدها و کتاب‌مقدس' },
    permissions: ['slides.manage', 'slides.view', 'bible.manage', 'bible.view'],
  },
  ai: {
    label: { en: 'AI Features', fa: 'هوش مصنوعی' },
    permissions: ['ai.transcription', 'ai.search'],
  },
  invoice: {
    label: { en: 'Invoice', fa: 'فاکتور' },
    permissions: ['invoice.manage', 'invoice.view'],
  },
};
