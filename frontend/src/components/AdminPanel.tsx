import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { API_URL } from '../utils/getApiURL';
import { FiShield, FiTrash2, FiCheckCircle, FiArrowLeft, FiUsers, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { FaBan } from 'react-icons/fa';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    isDisabled: boolean;
    isBlacklisted: boolean;
}

const rowGrid = 'md:grid-cols-[minmax(0,1.5fr)_110px_130px_minmax(0,1fr)_auto]';

export const AdminPanel = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}users`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = async (id: string, endPoint: string, action: string, value: any) => {
        try {
            const payload: Record<string, any> = {};
            if (action === 'isDisabled') payload.isDisabled = Boolean(value);
            if (action === 'isBlacklisted') payload.isBlacklisted = Boolean(value);

            const res = await fetch(`${API_URL}users/${id}/${endPoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Request failed');

            await fetchUsers();
            const verb = action === 'isDisabled'
                ? (value ? 'disabled' : 'enabled')
                : (value ? 'blacklisted' : 'removed from the blacklist');
            showAlert(`The user was successfully ${verb}.`, 'Update applied', 2);
        } catch (e) {
            showAlert('The action could not be completed. Please try again.', 'Action failed', 1);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setIsDeleting(true);
        try {
            await fetch(`${API_URL}users/${pendingDelete.id}`, { method: 'DELETE', credentials: 'include' });
            await fetchUsers();
            showAlert(`@${pendingDelete.username} was permanently deleted.`, 'User deleted', 2);
        } catch (e) {
            showAlert('Failed to delete the user. Please try again.', 'Delete failed', 1);
        } finally {
            setIsDeleting(false);
            setPendingDelete(null);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-cream-soft p-6 dark:bg-ink-deep">
                <div className="w-full max-w-sm animate-scale-in rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-card dark:border-rose-500/25 dark:bg-ink">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                        <FiShield className="h-6 w-6" />
                    </span>
                    <h1 className="mt-4 text-lg font-bold text-stone-900 dark:text-stone-100">Access denied</h1>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                        You need administrator privileges to view this page.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/chat')}
                        className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
                    >
                        Back to chat
                    </button>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Total users', value: users.length, tone: 'text-stone-900 dark:text-stone-100' },
        { label: 'Active', value: users.filter(u => !u.isDisabled && !u.isBlacklisted).length, tone: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Disabled', value: users.filter(u => u.isDisabled && !u.isBlacklisted).length, tone: 'text-amber-600 dark:text-amber-400' },
        { label: 'Blacklisted', value: users.filter(u => u.isBlacklisted).length, tone: 'text-rose-600 dark:text-rose-400' },
    ];

    const StatusBadge = ({ u }: { u: User }) => {
        if (u.isBlacklisted) {
            return <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/25">Blacklisted</span>;
        }
        if (u.isDisabled) {
            return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/25">Disabled</span>;
        }
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
        </span>;
    };

    return (
        <div className="min-h-dvh bg-cream-soft dark:bg-ink-deep">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
                {/* Top bar */}
                <div className="mb-8 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/chat')}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200"
                    >
                        <FiArrowLeft className="h-4 w-4" /> Back to chat
                    </button>
                    <ThemeToggle />
                </div>

                {/* Heading */}
                <div className="mb-8 flex items-start gap-4 animate-rise-in">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FiShield className="h-6 w-6" />
                    </span>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">Admin Control Panel</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Manage user accounts, access and moderation for the workspace.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-card dark:border-stone-800/80 dark:bg-ink">
                            <p className="text-[11px] font-bold tracking-wider text-stone-400 uppercase dark:text-stone-500">{s.label}</p>
                            <p className={`mt-1 text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Users table */}
                <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card dark:border-stone-800/80 dark:bg-ink animate-rise-in" style={{ animationDelay: '80ms' }}>
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 dark:border-stone-800">
                        <h2 className="flex items-center gap-2 text-sm font-bold text-stone-800 dark:text-stone-200">
                            <FiUsers className="h-4 w-4 text-emerald-500" /> Registered users
                        </h2>
                        <button
                            type="button"
                            onClick={fetchUsers}
                            aria-label="Refresh user list"
                            title="Refresh"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-95 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-400 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                        >
                            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-stone-100 dark:divide-stone-800/80">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-4">
                                    <div className="h-9 w-9 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                                        <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
                                    </div>
                                    <div className="h-8 w-28 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800/60" />
                                </div>
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <p className="px-5 py-12 text-center text-sm text-stone-400 dark:text-stone-500">No users found.</p>
                    ) : (
                        <>
                            {/* Column headers (desktop) */}
                            <div className={`hidden border-b border-stone-100 bg-stone-50/60 px-5 py-3 text-[11px] font-bold tracking-wider text-stone-400 uppercase md:grid md:items-center md:gap-4 ${rowGrid} dark:border-stone-800 dark:bg-stone-900/30 dark:text-stone-500`}>
                                <span>User</span>
                                <span>Role</span>
                                <span>Status</span>
                                <span>Email</span>
                                <span className="text-right">Actions</span>
                            </div>

                            <ul className="divide-y divide-stone-100 dark:divide-stone-800/80">
                                {users.map((u) => (
                                    <li key={u.id} className={`grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-stone-50/60 md:grid md:items-center md:gap-4 dark:hover:bg-stone-900/20 ${rowGrid}`}>
                                        {/* User */}
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-xs font-bold text-white uppercase">
                                                {u.username.charAt(0)}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{u.username}</p>
                                                <p className="truncate text-xs text-stone-400 md:hidden dark:text-stone-500">{u.email}</p>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${u.role === 'admin'
                                                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div><StatusBadge u={u} /></div>

                                        {/* Email (desktop) */}
                                        <p className="hidden min-w-0 truncate text-sm text-stone-500 md:block dark:text-stone-400">{u.email}</p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 md:justify-end">
                                            {u.role === 'admin' ? (
                                                <span className="text-xs font-medium text-stone-400 italic dark:text-stone-500">
                                                    Protected account — no actions available
                                                </span>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(u.id, 'disable', 'isDisabled', !u.isDisabled)}
                                                        aria-label={u.isDisabled ? `Enable ${u.username}` : `Disable ${u.username}`}
                                                        title={u.isDisabled ? 'Enable user' : 'Disable user'}
                                                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95 ${u.isDisabled
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                                                            : 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20'
                                                            }`}
                                                    >
                                                        {u.isDisabled ? <FiCheckCircle className="h-4 w-4" /> : <FaBan className="h-4 w-4" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAction(u.id, 'blacklist', 'isBlacklisted', !u.isBlacklisted)}
                                                        aria-label={u.isBlacklisted ? `Remove ${u.username} from blacklist` : `Blacklist ${u.username}`}
                                                        title={u.isBlacklisted ? 'Remove from blacklist' : 'Blacklist user'}
                                                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95 ${u.isBlacklisted
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
                                                            : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
                                                            }`}
                                                    >
                                                        <FiShield className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDelete(u)}
                                                        aria-label={`Delete ${u.username}`}
                                                        title="Delete user"
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:bg-rose-100 active:scale-95 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal (replaces window.confirm) */}
            {pendingDelete && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
                    <div
                        className="absolute inset-0 animate-fade-in bg-stone-950/60 backdrop-blur-sm"
                        onClick={() => !isDeleting && setPendingDelete(null)}
                    />
                    <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-stone-200 bg-white p-6 shadow-pop dark:border-stone-800 dark:bg-ink">
                        <div className="flex items-start gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <FiAlertTriangle className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                                <h3 id="delete-dialog-title" className="text-base font-bold text-stone-900 dark:text-stone-100">
                                    Delete this user permanently?
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                                    <span className="font-semibold text-stone-700 dark:text-stone-200">@{pendingDelete.username}</span> will
                                    be permanently removed. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setPendingDelete(null)}
                                disabled={isDeleting}
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 transition-all hover:bg-stone-50 active:scale-95 disabled:opacity-50 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-300 dark:hover:bg-stone-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-500 active:scale-95 disabled:opacity-60"
                            >
                                {isDeleting ? (
                                    <><FiRefreshCw className="h-4 w-4 animate-spin" /> Deleting…</>
                                ) : (
                                    <><FiTrash2 className="h-4 w-4" /> Delete user</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};