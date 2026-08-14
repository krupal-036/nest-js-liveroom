import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

const linkCls =
    'rounded text-xs font-semibold text-stone-500 transition-colors hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400';

export const Footer: React.FC = () => {
    const { user } = useAuth();

    return (
        <footer className="border-t border-stone-200/60 py-8 dark:border-stone-800/60">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                <Link
                    to="/"
                    aria-label="NestJS Live Room — home"
                    className="rounded-xl"
                >
                    <Logo size="sm" />
                </Link>

                <p className="text-center text-xs text-stone-400 dark:text-stone-500">
                    © 2026 NestJS Live Room · Built with React, Socket.IO & Tailwind CSS v4
                </p>

                <nav
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
                    aria-label="Footer"
                >
                    <Link to="/about" className={linkCls}>
                        About
                    </Link>

                    {user ? (
                        <Link to="/chat" className={linkCls}>
                            Open chat
                        </Link>
                    ) : (
                        <Link to="/auth" className={linkCls}>
                            Sign in
                        </Link>
                    )}

                    <a
                        href="https://krupal.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkCls}
                    >
                        Portfolio
                    </a>

                    <a
                        href="https://github.com/krupal-036/nest-js-liveroom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkCls}
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </footer>
    );
};