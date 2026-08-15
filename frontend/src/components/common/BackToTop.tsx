import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-[#F5F2EB] rounded-full shadow-xl border border-emerald-400 dark:border-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in"
            aria-label="Back to top"
            title="Back to top"
        >
            <FiArrowUp className="w-5 h-5" />
        </button>
    );
};