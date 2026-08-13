import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { box: 'h-9 w-9 rounded-xl', icon: 'h-4 w-4', text: 'text-base' },
    md: { box: 'h-11 w-11 rounded-xl', icon: 'h-5 w-5', text: 'text-lg' },
    lg: { box: 'h-12 w-12 rounded-2xl', icon: 'h-6 w-6', text: 'text-xl' },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
    const s = sizeMap[size];
    return (
        <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
            <span className={`${s.box} flex shrink-0 items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25`}>
                <FiMessageSquare className={s.icon} strokeWidth={2.5} />
            </span>
            {showText && (
                <span className={`${s.text} truncate font-bold tracking-tight text-stone-900 dark:text-stone-100`}>
                    NestJS <span className="text-emerald-600 dark:text-emerald-400">Live Room</span>
                </span>
            )}
        </div>
    );
};