'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Key, Loader2, UserCog, Sparkles } from 'lucide-react';
import { getAllUsers, updateUserRole, changePassword } from '@/app/actions/users';
import { toast } from 'sonner';

export default function UserManagement({ currentUser }: { currentUser: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [passwordForm, setPasswordForm] = useState({ old: '', new: '' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            toast.success('User role updated');
            loadUsers();
        } catch (e) {
            toast.error('Failed to update role');
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // In a real app check old password, here we just allow it for the demo/admin override
            await changePassword(currentUser.id, passwordForm.new);
            toast.success('Password changed successfully');
            setPasswordForm({ old: '', new: '' });
        } catch (e) {
            toast.error('Failed to change password');
        }
    }

    if (loading) return <div>Loading Users...</div>;

    return (
        <div className="space-y-8">
            {/* Change Password Section */}
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-cyan-400">
                    <Key className="w-5 h-5" /> Change My Password
                </h3>
                <form onSubmit={handlePasswordChange} className="flex gap-4 items-end">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors">
                        Update
                    </button>
                </form>
            </section>

            {/* User Management Table (Only for Admins) */}
            {currentUser.role === 'admin' && (
                <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-400">
                        <UserCog className="w-5 h-5" /> User Management
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold">
                                                {user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 font-mono text-sm">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                user.role === 'manager' ? 'bg-cyan-500/20 text-cyan-400' :
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <select
                                                className="bg-black/50 border border-white/10 text-xs rounded px-2 py-1 text-gray-300"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.id === currentUser.id} // Prevents admin from demoting themselves by accident here
                                            >
                                                <option value="user">User</option>
                                                <option value="editor">Editor</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
