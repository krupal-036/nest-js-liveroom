import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiRefreshCw, FiZap, FiHash, FiShield } from 'react-icons/fi';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
}

interface TouchedFields {
    username?: boolean;
    email?: boolean;
    password?: boolean;
}

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    const { login, signup } = useAuth();

    const validateField = (fieldName: keyof ValidationErrors, value: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (fieldName === 'username' && !isLogin) {
            if (!value.trim()) return 'Username is required.';
            if (value.trim().length < 3) return 'Username must be at least 3 characters.';
        }

        if (fieldName === 'email') {
            if (!value.trim()) return 'Email address is required.';
            if (!emailRegex.test(value)) return 'Please enter a valid email address.';
        }

        if (fieldName === 'password') {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

            if (!value) {
                return 'Password is required.';
            }
            if (!passwordRegex.test(value)) {
                return 'Password must be at least 8 characters long, contain 1 uppercase letter, and 1 special character.';
            }
        }

        return '';
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        const usernameErr = validateField('username', username);
        const emailErr = validateField('email', email);
        const passwordErr = validateField('password', password);

        if (!isLogin && usernameErr) errors.username = usernameErr;
        if (emailErr) errors.email = emailErr;
        if (passwordErr) errors.password = passwordErr;

        setFieldErrors(errors);

        setTouched({
            username: true,
            email: true,
            password: true
        });

        return Object.keys(errors).length === 0;
    };

    const handleFieldChange = (
        fieldName: keyof ValidationErrors,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);

        if (touched[fieldName] || fieldErrors[fieldName]) {
            const errorMsg = validateField(fieldName, value);
            setFieldErrors(prev => ({
                ...prev,
                [fieldName]: errorMsg ? errorMsg : undefined
            }));
        }
    };

    const handleFieldBlur = (fieldName: keyof ValidationErrors, value: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const errorMsg = validateField(fieldName, value);
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: errorMsg ? errorMsg : undefined
        }));
    };

    const handleReset = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setFieldErrors({});
        setTouched({});
        setShowPassword(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(username, email, password);
                await login(email, password);
            }
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    const inputBase = 'w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:outline-none dark:bg-ink-soft dark:text-cream-soft dark:placeholder:text-stone-500';
    const inputOk = 'border-stone-200 focus:border-emerald-500 dark:border-stone-700 dark:focus:border-emerald-500';
    const inputErr = 'border-rose-400 focus:border-rose-500 dark:border-rose-500/60 dark:focus:border-rose-500';
    const iconCls = 'pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500';

    const renderError = (field: keyof ValidationErrors) =>
        fieldErrors[field] && touched[field] ? (
            <p className="mt-1.5 ml-1 flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-slide-down dark:text-rose-400" role="alert">
                <FiAlertCircle className="h-3 w-3 shrink-0" />
                {fieldErrors[field]}
            </p>
        ) : null;

    return (
        <div className="flex min-h-dvh bg-cream-soft dark:bg-ink-deep">
            <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-ink-deep p-10 lg:flex xl:p-14">
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_20%,black,transparent)]" />
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
                    <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
                </div>

                <Logo size="md" className="relative [&_span:last-child]:text-white" />

                <div className="relative max-w-md">
                    <h2 className="text-3xl leading-tight font-bold tracking-tight text-white xl:text-4xl">
                        Your team's conversations, <span className="text-emerald-400">live</span>.
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {[
                            { icon: FiZap, text: 'Realtime rooms powered by Socket.IO with presence & typing indicators' },
                            { icon: FiHash, text: 'Files, voice memos, reactions and threaded replies — out of the box' },
                            { icon: FiShield, text: 'Admin-grade moderation controls built right in' },
                        ].map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-stone-300">
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative flex items-center gap-2 text-xs font-medium text-stone-500">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    All systems realtime
                </p>
            </aside>

            <main className="relative flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
                    <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200"
    >
        <FiArrowLeft className="h-4 w-4" /> Back to home
    </button>
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 items-center justify-center p-4 pb-10 sm:p-6">
                    <div className="w-full max-w-md animate-rise-in">
                        <div className="mb-8 flex justify-center lg:hidden">
                            <Logo size="md" />
                        </div>

                        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-card sm:p-8 dark:border-stone-800/80 dark:bg-ink">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                                    {isLogin ? 'Welcome back' : 'Create your account'}
                                </h1>
                                <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
                                    {isLogin ? 'Sign in to rejoin your rooms.' : 'Join in seconds — no setup required.'}
                                </p>
                            </div>

                            {error && (
                                <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 animate-slide-down dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300">
                                    <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {!isLogin && (
                                    <div>
                                        <label htmlFor="auth-username" className="mb-1.5 ml-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">Username</label>
                                        <div className="relative">
                                            <FiUser className={iconCls} />
                                            <input
                                                id="auth-username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => handleFieldChange('username', e.target.value.toLowerCase(), setUsername)}
                                                onBlur={(e) => handleFieldBlur('username', e.target.value)}
                                                placeholder="yourname"
                                                autoComplete="username"
                                                className={`${inputBase} ${fieldErrors.username && touched.username ? inputErr : inputOk}`}
                                            />
                                        </div>
                                        {renderError('username')}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="auth-email" className="mb-1.5 ml-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">Email address</label>
                                    <div className="relative">
                                        <FiMail className={iconCls} />
                                        <input
                                            id="auth-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => handleFieldChange('email', e.target.value.toLowerCase(), setEmail)}
                                            onBlur={(e) => handleFieldBlur('email', e.target.value)}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            className={`${inputBase} ${fieldErrors.email && touched.email ? inputErr : inputOk}`}
                                        />
                                    </div>
                                    {renderError('email')}
                                </div>

                                <div>
                                    <label htmlFor="auth-password" className="mb-1.5 ml-1 block text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">Password</label>
                                    <div className="relative">
                                        <FiLock className={iconCls} />
                                        <input
                                            id="auth-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                                            onBlur={(e) => handleFieldBlur('password', e.target.value)}
                                            placeholder="••••••••"
                                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                                            className={`${inputBase} ${fieldErrors.password && touched.password ? inputErr : inputOk}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 transition-colors hover:text-stone-600 dark:hover:text-stone-200"
                                        >
                                            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {renderError('password')}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiRefreshCw className="h-4 w-4 animate-spin" />
                                            {isLogin ? 'Signing in…' : 'Creating account…'}
                                        </>
                                    ) : (
                                        isLogin ? 'Sign in' : 'Create account'
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
                        </div>

                        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-stone-400 dark:text-stone-500">
                            <FiCheck className="h-3.5 w-3.5 text-emerald-500" />
                            Secure cookie-based sessions · Role-aware access
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};