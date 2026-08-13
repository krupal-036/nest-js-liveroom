const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const LOCAL_URL = import.meta.env.VITE_LOCAL_URL;
const isLocalUser =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_URL = isLocalUser ? LOCAL_URL : SERVER_URL;
