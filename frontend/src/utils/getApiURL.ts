const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const API_URL_ENV = import.meta.env.VITE_API_URL;
const LOCAL_URL = import.meta.env.VITE_LOCAL_URL;

const hostname =
    typeof window !== 'undefined' ? window.location.hostname : '';

const isLocalUser =
    hostname === 'localhost' ||
    hostname === '127.0.0.1';

const isVercel =
    hostname.endsWith('.vercel.app');

const isRender =
    hostname.endsWith('.onrender.com');

export const API_URL = isLocalUser
    ? LOCAL_URL
    : isVercel || isRender
        ? API_URL_ENV
        : SERVER_URL;