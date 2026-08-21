import { redirect } from 'next/navigation';
import { Settings, Upload, Globe, LayoutDashboard, Users, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { UploadZone } from '@/components/admin/upload-zone';
import CMSEditor from '@/components/admin/cms-editor';
import UserManagement from '@/components/admin/user-management';
import { getSession } from '@/lib/rbac/auth';
import { hasPermission, hasAnyPermission } from '@/lib/rbac/permissions';
import { ROLE_LABELS } from '@/lib/rbac/types';
import type { Permission } from '@/lib/rbac/types';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Get session from JWT (with fallback to legacy cookie)
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  // Build current user object for client components
  const currentUser = {
    id: session.id,
    name: session.name,
    email: session.email,
    roles: session.roles,
    permissions: session.permissions,
    // Legacy compat
    role: session.roles[0] || 'viewer',
  };

  // Permission helpers for section visibility
  const canManageUsers = hasAnyPermission(session.permissions, ['users.manage', 'users.view', 'roles.assign']);
  const canEditContent = hasPermission(session.permissions, 'content.edit' as Permission);
  const canUploadMedia = hasPermission(session.permissions, 'media.upload' as Permission);
  const canViewSettings = hasPermission(session.permissions, 'settings.view' as Permission);

  // Role display
  const roleLabels = session.roles
    .map((r) => ROLE_LABELS[r]?.en || r)
    .join(', ');

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">MyChurch <span className="text-cyan-400">ADMIN</span></h1>
          <p className="text-xs text-gray-400 mt-1">Broadcast Console Pro</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-cyan-400">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          {canManageUsers && (
            <Link href="#users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
              <Users className="w-5 h-5" />
              Users & Roles
            </Link>
          )}

          {canViewSettings && (
            <Link href="#settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          )}

          <Link href={`/${locale}`} target="_blank" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white mt-auto">
            <Globe className="w-5 h-5" />
            View Live Site
          </Link>
        </nav>

        {/* Roles badge */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{roleLabels}</span>
          </div>
          <p className="text-[10px] text-gray-600 break-all">{session.permissions.length} permissions active</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Content Control Center</h2>
            <p className="text-gray-400">Manage your broadcast system.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{currentUser.name}</p>
              <p className="text-xs text-gray-500 uppercase">{roleLabels}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              {currentUser.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {/* User Management Section — only for users with user management permissions */}
          {canManageUsers && (
            <div id="users">
              <UserManagement currentUser={currentUser} />
            </div>
          )}

          {/* CMS Editor Section — only for content editors */}
          {canEditContent && <CMSEditor />}

          {/* Media Upload Section — only for media uploaders */}
          {canUploadMedia && (
            <section className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" /> Upload New Media
              </h3>
              <UploadZone />
            </section>
          )}

          {/* No permissions message */}
          {!canManageUsers && !canEditContent && !canUploadMedia && (
            <div className="text-center py-20 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2">Limited Access</h3>
              <p>Your current role does not have access to any admin tools. Contact an administrator.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}