import React from 'react';
import { FiUser, FiHash, FiRefreshCw, FiPlus, FiTrash2, FiX, FiUsers } from 'react-icons/fi';

interface RoomSidebarProps {
  username: string;
  setUsername: (name: string) => void;
  roomInput: string;
  activeUsers: string[];
  handleDeleteRoom: (roomName: string, e: { stopPropagation: () => void }) => void;
  setRoomInput: (room: string) => void;
  rooms: string[];
  joinedRoom: string;
  handleCreateRoom: (e: React.FormEvent) => void;
  handleFetchRooms: () => void;
  handleJoinRoom: (roomName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const card = 'rounded-2xl border border-stone-200/80 bg-white shadow-card dark:border-stone-800/80 dark:bg-ink';
const sectionTitle = 'flex items-center gap-2 text-xs font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400';
const fieldCls = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-ink-soft dark:text-cream-soft dark:placeholder:text-stone-500 dark:focus:border-emerald-500';

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  username, setUsername, roomInput, setRoomInput, handleDeleteRoom,
  activeUsers, rooms, joinedRoom, handleCreateRoom, handleFetchRooms, handleJoinRoom,
  isOpen, onClose
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 animate-fade-in bg-stone-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container: fixed drawer on mobile, static column on desktop */}
      <aside
        aria-label="Profile and rooms"
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col gap-4 overflow-y-auto scrollbar-slim
          border-r border-stone-200 bg-cream-soft p-4 shadow-2xl
          transition-transform duration-300 ease-in-out
          dark:border-stone-800 dark:bg-ink-deep
          lg:static lg:z-auto lg:h-full lg:min-h-0 lg:w-auto lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:bg-transparent
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile drawer header */}
        <div className="flex items-center justify-between lg:hidden">
          <span className="text-sm font-bold tracking-wide text-stone-700 uppercase dark:text-stone-300">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition-colors hover:text-stone-800 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-300 dark:hover:text-white"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Profile */}
        <section className={`${card} p-4 sm:p-5`}>
          <div className={`${sectionTitle} mb-3.5`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FiUser className="h-3.5 w-3.5" />
            </span>
            Your profile
          </div>
          <div className="relative">
            <FiUser className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input
              type="text"
              disabled={!!joinedRoom}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name…"
              aria-label="Display name"
              className={`${fieldCls} pl-10`}
            />
          </div>
          {joinedRoom && (
            <p className="mt-2.5 text-[11px] leading-relaxed text-stone-400 dark:text-stone-500">
              Your display name is locked while you're inside a room.
            </p>
          )}
        </section>

        {/* Rooms */}
        <section className={`${card} flex min-h-0 flex-1 flex-col p-4 sm:p-5`}>
          <div className="mb-3.5 flex items-center justify-between">
            <div className={sectionTitle}>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FiHash className="h-3.5 w-3.5" />
              </span>
              Rooms
            </div>
            <button
              type="button"
              onClick={handleFetchRooms}
              aria-label="Refresh room list"
              title="Refresh rooms"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition-all hover:border-emerald-300 hover:text-emerald-600 active:scale-95 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-400 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
            >
              <FiRefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <form onSubmit={handleCreateRoom} className="mb-4 flex gap-2">
            <input
              type="text"
              disabled={!!joinedRoom}
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Create a room…"
              aria-label="New room name"
              className={`${fieldCls} flex-1`}
            />
            <button
              type="submit"
              disabled={!!joinedRoom || !roomInput.trim()}
              aria-label="Create room"
              title="Create room"
              className="flex w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:disabled:bg-stone-800 dark:disabled:text-stone-600 dark:disabled:shadow-none"
            >
              <FiPlus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>

          <p className="mb-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase dark:text-stone-500">
            Available rooms
          </p>

          <div className="max-h-64 min-h-0 flex-1 space-y-2 overflow-y-auto scrollbar-slim pr-1 lg:max-h-none">
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-400 dark:border-stone-700 dark:text-stone-500">
                No rooms yet. Create the first one above!
              </div>
            ) : (
              rooms.map((room) => (
                <div
                  key={room}
                  className={`group flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm transition-all duration-200 ${joinedRoom === room
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                    : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-stone-700/80 dark:bg-ink-soft/60 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/5'
                    } ${joinedRoom ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => handleJoinRoom(room)}
                    disabled={!!joinedRoom}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 font-semibold text-stone-800 disabled:cursor-not-allowed dark:text-stone-200"
                  >
                    <FiHash className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">{room}</span>
                  </button>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className={`text-[11px] font-bold ${joinedRoom === room ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`}>
                      {joinedRoom === room ? 'Joined' : 'Join'}
                    </span>
                    {!joinedRoom && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Delete room ${room}`}
                        title="Delete room"
                        onClick={(e) => handleDeleteRoom(room, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDeleteRoom(room, e);
                          }
                        }}
                        className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Status feed */}
          <div className="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-stone-400 dark:text-stone-500">
                <FiUsers className="h-3.5 w-3.5" /> Status
              </span>
              <span className={`inline-flex items-center gap-1.5 font-bold ${joinedRoom ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${joinedRoom ? 'animate-pulse bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'}`} />
                {joinedRoom ? `In #${joinedRoom}` : 'Idle'}
              </span>
            </div>
            {activeUsers.length > 0 && (
              <div className="mt-3 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto scrollbar-slim pr-1">
                {activeUsers.map((user, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:border-stone-700/70 dark:bg-stone-800/60 dark:text-stone-300"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {user}{user.trim() === username.trim() && ' (you)'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </aside>
    </>
  );
};