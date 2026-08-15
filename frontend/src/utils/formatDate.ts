export const getDateKey = (timestamp?: string): string => {
    const date = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(date.getTime())) return new Date().toDateString();
    return date.toDateString();
};

export const getDateLabel = (timestamp?: string): string => {
    const date = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(date.getTime())) return 'Today';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (msgDay.getTime() === today.getTime()) return 'Today';
    if (msgDay.getTime() === yesterday.getTime()) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    });
};

export const formatTime = (timestamp?: string): string => {
    const date = timestamp ? new Date(timestamp) : new Date();
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};
