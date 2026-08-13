import React from 'react';
import { FiLogOut, FiMenu, FiShield, FiHash, FiInfo } from 'react-icons/fi';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import LeaveRoomButton from './common/LeaveRoomButton';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isConnected: boolean;
  serverUrl: string;
  joinedRoom: string;
  handleLeaveRoom: () => void;
  userRole?: string;
  onLogout?: () => void;
  onToggleSidebar: () => void;
}

const iconBtn = 'flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-600 active:scale-95 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-400 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400';

export const Header: React.FC<HeaderProps> = ({
  isConnected, serverUrl, joinedRoom, handleLeaveRoom, userRole, onLogout, onToggleSidebar
}) => {
  const navigate = useNavigate();
  return (
    <header className="z-40 shrink-0 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl dark:border-stone-800/80 dark:bg-ink-deep/80">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle rooms panel"
            className={`${iconBtn} lg:hidden`}
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <Logo size="sm" className="min-w-0" />

          {/* Connection status */}
          <div
            title={isConnected ? `Connected to ${serverUrl}` : 'Disconnected'}
            className={`ml-1 hidden shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium md:flex ${isConnected
              ? 'border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'border-rose-200/80 bg-rose-50/80 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
              }`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {isConnected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
            <span className="max-w-[120px] truncate lg:max-w-[220px]">
              {isConnected ? serverUrl.replace(/^https?:\/\//, '') : 'Disconnected'}
            </span>
          </div>

          {joinedRoom && (
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 xl:flex dark:bg-stone-800/80 dark:text-stone-300">
              <FiHash className="h-3.5 w-3.5 text-emerald-500" />
              <span className="max-w-[160px] truncate">{joinedRoom}</span>
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => navigate('/about')} title="About" aria-label="About this application" className={`${iconBtn} hidden min-[420px]:flex`}>
    <FiInfo className="h-4 w-4" />
</button>

          {userRole === 'admin' && (
    <button type="button" onClick={() => navigate('/admin')} title="Admin panel" aria-label="Open admin panel" className={iconBtn}>
        <FiShield className="h-4 w-4" />
    </button>
)}

          <ThemeToggle />

          {joinedRoom && (
            <LeaveRoomButton handleLeaveRoom={handleLeaveRoom} />
          )}

          {onLogout && (
            <button
              type="button"
              onClick={async () => { await onLogout?.(); navigate('/'); }}
              title="Logout"
              className="flex h-10 items-center gap-2 rounded-xl bg-stone-900 px-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-stone-700 active:scale-95 sm:px-4 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};