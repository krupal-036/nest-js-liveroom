import { FiLogOut } from 'react-icons/fi'

export type LeaveRoomButtonProps = {
    handleLeaveRoom: () => void;
    isHeader?: boolean;
}

const LeaveRoomButton = ({ handleLeaveRoom, isHeader = true }: LeaveRoomButtonProps) => {
    return (
        <button
            type="button"
            onClick={() => handleLeaveRoom()}
            title="Leave Room"
            aria-label="Leave Room"
            className={isHeader
                ? `hidden h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-100 active:scale-95 sm:flex dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20`
                : "sm:hidden flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-100 active:scale-95 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            }
        >
            <FiLogOut className={isHeader ? "h-4 w-4" : "h-3.5 w-3.5"} />
            {isHeader ? "Leave room" : <span className="hidden md:inline">Leave room</span>}
        </button>
    )
}

export default LeaveRoomButton