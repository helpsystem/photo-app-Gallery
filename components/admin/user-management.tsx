'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Key, Loader2, UserCog, Sparkles, Ban, Check, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { getAllUsersSafe, updateUserRoles, updateUserPermissions, changePassword, toggleUserDisabled } from '@/app/actions/users';
import { toast } from 'sonner';
import {
    ROLES,
    ROLE_LABELS,
    PERMISSION_CATEGORIES,
    PERMISSION_LABELS,
} from '@/lib/rbac/types';
import type { Role, Permission, SafeUser } from '@/lib/rbac/types';

interface CurrentUser {
    id: string;
    name: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
    role?: string; // legacy
}

export default function UserManagement({ currentUser }: { currentUser: CurrentUser }) {
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [passwordForm, setPasswordForm] = useState({ new: '' });
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [savingRoles, setSavingRoles] = useState<string | null>(null);

    const canManageUsers = currentUser.permissions.includes('users.manage');
    const canAssignRoles = currentUser.permissions.includes('roles.assign');
    const canViewUsers = currentUser.permissions.includes('users.view');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsersSafe();
            setUsers(data);
        } catch (e) {
            toast.error('Failed to load users');
        }
        setLoading(false);
    };

    const handleRolesChange = async (userId: string, roles: Role[]) => {
        setSavingRoles(userId);
        try {
            await updateUserRoles(userId, roles);
            toast.success('User roles updated');
            loadUsers();
        } catch (e: any) {
            toast.error(e?.message || 'Failed to update roles');
        }
        setSavingRoles(null);
    };

    const handleToggleRole = (user: SafeUser, role: Role) => {
        const currentRoles = user.roles || [];
        let newRoles: Role[];

        if (currentRoles.includes(role)) {
            // Remove role (but keep at least one)
            newRoles = currentRoles.filter((r) => r !== role);
            if (newRoles.length === 0) {
                toast.error('User must have at least one role');
                return;
            }
        } else {
            // Add role
            newRoles = [...currentRoles, role];
        }

        handleRolesChange(user.id, newRoles);
    };

    const handleToggleDisabled = async (userId: string) => {
        try {
            await toggleUserDisabled(userId);
            toast.success('User status updated');
            loadUsers();
        } catch (e: any) {
            toast.error(e?.message || 'Failed to update user');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        try {
            await changePassword(currentUser.id, passwordForm.new);
            toast.success('Password changed successfully');
            setPasswordForm({ new: '' });
        } catch (e: any) {
            toast.error(e?.message || 'Failed to change password');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="ml-2 text-gray-400">Loading Users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Change Password Section */}
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-cyan-400">
                    <Key className="w-5 h-5" /> Change My Password
                </h3>
                <form onSubmit={handlePasswordChange} className="flex gap-4 items-end">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">New Password (min 8 chars)</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ new: e.target.value })}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                            placeholder="Enter new password"
                            minLength={8}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors">
                        Update
                    </button>
                </form>
            </section>

            {/* My Permissions Overview */}
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-emerald-400">
                    <Shield className="w-5 h-5" /> My Permissions
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {currentUser.roles.map((role) => (
                        <span key={role} className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {ROLE_LABELS[role]?.en || role}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                    {currentUser.permissions.map((perm) => (
                        <span key={perm} className="text-xs text-gray-400 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" />
                            {PERMISSION_LABELS[perm]?.en || perm}
                        </span>
                    ))}
                </div>
            </section>

            {/* User Management Table (for users with users.view permission) */}
            {canViewUsers && (
                <section className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-400">
                        <UserCog className="w-5 h-5" /> User Management
                    </h3>

                    <div className="space-y-4">
                        {users.map((user) => (
                            <div key={user.id} className="border border-white/10 rounded-xl overflow-hidden">
                                {/* User Header Row */}
                                <div
                                    className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${
                                        expandedUser === user.id ? 'bg-white/10' : 'hover:bg-white/5'
                                    } ${user.disabled ? 'opacity-50' : ''}`}
                                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                            user.disabled
                                                ? 'bg-red-900/50 text-red-400'
                                                : 'bg-gradient-to-br from-gray-700 to-gray-900 text-white'
                                        }`}>
                                            {user.disabled ? <Ban className="w-4 h-4" /> : user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Role badges */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        role === 'super_admin' ? 'bg-red-500/20 text-red-400' :
                                                        role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                        role === 'manager' ? 'bg-cyan-500/20 text-cyan-400' :
                                                        role === 'worship_leader' ? 'bg-amber-500/20 text-amber-400' :
                                                        role === 'editor' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                    }`}
                                                >
                                                    {ROLE_LABELS[role]?.en || role}
                                                </span>
                                            ))}
                                        </div>

                                        {expandedUser === user.id
                                            ? <ChevronUp className="w-4 h-4 text-gray-500" />
                                            : <ChevronDown className="w-4 h-4 text-gray-500" />
                                        }
                                    </div>
                                </div>

                                {/* Expanded Panel: Roles & Permissions */}
                                {expandedUser === user.id && (
                                    <div className="px-5 py-4 border-t border-white/10 bg-black/30 space-y-6">
                                        {/* Role Assignment */}
                                        {canAssignRoles && user.id !== currentUser.id && (
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> Assign Roles (Multi-select)
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {ROLES.map((role) => {
                                                        const isActive = user.roles.includes(role);
                                                        const isSaving = savingRoles === user.id;
                                                        return (
                                                            <button
                                                                key={role}
                                                                onClick={() => handleToggleRole(user, role)}
                                                                disabled={isSaving}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all border ${
                                                                    isActive
                                                                        ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300'
                                                                        : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                                                } ${isSaving ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                                            >
                                                                {isActive && <Check className="w-3 h-3 inline mr-1" />}
                                                                {ROLE_LABELS[role]?.en || role}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Effective Permissions Display */}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                                <Lock className="w-4 h-4" /> Effective Permissions ({user.permissions.length})
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                                {Object.entries(PERMISSION_CATEGORIES).map(([catKey, cat]) => (
                                                    <div key={catKey} className="mb-3">
                                                        <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-1">{cat.label.en}</p>
                                                        {cat.permissions.map((perm) => {
                                                            const has = user.permissions.includes(perm);
                                                            return (
                                                                <p key={perm} className={`text-xs flex items-center gap-1 ${has ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                                    {has ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 inline-block">−</span>}
                                                                    {PERMISSION_LABELS[perm]?.en || perm}
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Disable/Enable User */}
                                        {canManageUsers && user.id !== currentUser.id && (
                                            <div className="pt-3 border-t border-white/10">
                                                <button
                                                    onClick={() => handleToggleDisabled(user.id)}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                                        user.disabled
                                                            ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                                                            : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                                    }`}
                                                >
                                                    {user.disabled ? 'Enable Account' : 'Disable Account'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
