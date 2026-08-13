import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, type CSSProperties, type ReactNode } from 'react';
import { FiX, FiTrash2, FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export type AlertType = 1 | 2 | 3;

export interface AlertItem {
    id: number;
    title: string;
    message: string;
    type: AlertType;
}

export type AlertContextType = {
    showAlert: (message: string, title?: string, type?: AlertType) => void;
    hideAlert: (id: number) => void;
    clearAll: () => void;
};

const DefaultAlertContext: AlertContextType = {
    showAlert: () => { },
    hideAlert: () => { },
    clearAll: () => { }
};

export const AlertContext = createContext<AlertContextType>(DefaultAlertContext);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const hideAlert = useCallback((id: number) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const clearAll = useCallback(() => setAlerts([]), []);

    const showAlert = useCallback((message: string, title = "Unknown Error...", type: AlertType = 1) => {
        const id = Date.now();
        setAlerts((prev) => [{ id, title, message, type }, ...prev]);
    }, []);

    const contextValue = useMemo(() => ({
        showAlert,
        hideAlert,
        clearAll
    }), [showAlert, hideAlert, clearAll]);

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
            <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex flex-col items-center px-4 sm:px-6">
                <div className="relative min-h-[80px] w-full max-w-sm sm:max-w-md">
                    {alerts.map((alert, index) => (
                        <Alert
                            key={alert.id}
                            alert={alert}
                            index={index}
                            total={alerts.length}
                            onClose={() => hideAlert(alert.id)}
                            onClear={() => clearAll()}
                        />
                    ))}
                </div>
            </div>
        </AlertContext.Provider>
    );
};

interface AlertProps {
    alert: AlertItem;
    onClose: () => void;
    index: number;
    total: number;
    onClear: () => void;
}

const TONES: Record<AlertType | 'default', { icon: React.ElementType; tile: string; bar: string }> = {
    1: { icon: FiAlertCircle, tile: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
    2: { icon: FiCheckCircle, tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
    3: { icon: FiAlertTriangle, tile: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    default: { icon: FiInfo, tile: 'bg-stone-500/10 text-stone-500 dark:text-stone-400', bar: 'bg-stone-400' },
};

const Alert = ({ alert, onClose, index, total, onClear }: AlertProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    /* Stacking behaviour preserved: newest at the bottom, older cards lift & shrink behind it */
    const stackStyle: CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: total - index,
        transform: `translateY(-${index * 12}px) scale(${1 - index * 0.05})`,
        opacity: index > 2 ? 0 : 1,
        transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
    };

    const tone = TONES[alert.type] || TONES.default;
    const Icon = tone.icon;

    return (
        <div style={stackStyle} className="pointer-events-none">
            <div
                role="status"
                className="pointer-events-auto relative w-full max-w-sm animate-rise-in overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 shadow-pop backdrop-blur-xl sm:max-w-md dark:border-stone-700/70 dark:bg-ink-soft/95"
            >
                <div className="flex items-start gap-3 p-4 pr-3">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.tile}`}>
                        <Icon className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-sm leading-tight font-semibold tracking-tight text-stone-900 dark:text-stone-100">{alert.title}</p>
                        <p className="mt-1 text-[13px] leading-snug font-medium text-stone-500 dark:text-stone-400">{alert.message}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Dismiss notification"
                            className="rounded-lg p-1.5 text-stone-400 transition-all duration-200 hover:bg-stone-100 hover:text-stone-600 active:scale-90 dark:hover:bg-white/10 dark:hover:text-stone-200"
                        >
                            <FiX size={17} strokeWidth={2.5} />
                        </button>
                        {total > 2 && (
                            <button
                                type="button"
                                onClick={onClear}
                                aria-label="Clear all notifications"
                                className="rounded-lg p-1.5 text-stone-400 transition-all duration-200 hover:bg-stone-100 hover:text-stone-600 active:scale-90 dark:hover:bg-white/10 dark:hover:text-stone-200"
                            >
                                <FiTrash2 size={15} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="h-[3px] w-full bg-stone-100/80 dark:bg-white/5">
                    <div className={`h-full origin-left animate-toast-progress ${tone.bar}`} />
                </div>
            </div>
        </div>
    );
};