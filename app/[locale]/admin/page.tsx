import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Settings, Upload, Globe, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { UploadZone } from '@/components/admin/upload-zone';
import CMSEditor from '@/components/admin/cms-editor';
import UserManagement from '@/components/admin/user-management';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Protection: Check for admin session cookie
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie) {
    redirect(`/${locale}/auth/login`);
  }

  const currentUser = JSON.parse(sessionCookie.value);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tighter">RAM <span className="text-cyan-400">ADMIN</span></h1>
          <p className="text-xs text-gray-400 mt-1">Control Center</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-cyan-400">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="#users" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
            <Users className="w-5 h-5" />
            Users & Roles
          </Link>
          <Link href={`/${locale}`} target="_blank" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white mt-auto">
            <Globe className="w-5 h-5" />
            View Live Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Content Control Center</h2>
            <p className="text-gray-400">Manage your digital archive content.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{currentUser.name}</p>
              <p className="text-xs text-gray-500 uppercase">{currentUser.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              {currentUser.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {/* User Management Section */}
          <div id="users">
            <UserManagement currentUser={currentUser} />
          </div>

          {/* CMS Editor Section */}
          <CMSEditor />

          {/* Media Upload Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" /> Upload New Media
            </h3>
            <UploadZone />
          </section>
        </div>
      </main>
    </div>
  );
}