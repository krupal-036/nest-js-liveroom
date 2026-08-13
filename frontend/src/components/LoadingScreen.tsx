import React from 'react';
import { Logo } from './Logo';

export const LoadingScreen: React.FC = () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-cream-soft dark:bg-ink-deep">
        <div className="animate-scale-in">
            <Logo size="lg" />
        </div>
        <div className="flex items-center gap-1.5" role="status" aria-live="polite">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-emerald-500"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
            <span className="sr-only">Loading…</span>
        </div>
    </div>
);