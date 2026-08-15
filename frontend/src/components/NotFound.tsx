import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-emerald-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[#F5F2EB] dark:bg-[#1A1915] border border-emerald-400 dark:border-emerald-600/90 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full animate-pulse">
                        <FiAlertTriangle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
                
                <h1 className="text-7xl font-bold text-emerald-950 dark:text-[#EAE6DF] mb-2 tracking-tight">404</h1>
                <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-400 mb-4">Transmission Lost</h2>
                
                <p className="text-sm text-emerald-800/70 dark:text-stone-400 mb-8 leading-relaxed">
                    The route you are looking for has been lost in the void, or the endpoint no longer exists.
                </p>
                
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center gap-2 w-full bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-[#F5F2EB] font-medium py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/30"
                >
                    <FiHome className="w-5 h-5" />
                    <span>Return to Base</span>
                </button>
            </div>
        </div>
    );
};