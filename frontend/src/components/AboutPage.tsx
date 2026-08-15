import { FiArrowLeft, FiArrowRight, FiActivity, FiCheck, FiZap, FiHash, FiPaperclip, FiMic, FiSmile, FiShield, FiSliders } from 'react-icons/fi';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';

const CAPABILITIES = [
    { icon: FiZap, title: 'Realtime sync', desc: 'Messages, presence, typing and reactions stream instantly over WebSockets.' },
    { icon: FiHash, title: 'Room system', desc: 'Create, join, leave and delete rooms with realtime room-list updates.' },
    { icon: FiPaperclip, title: 'File sharing', desc: 'Base64-powered attachments with inline previews and a full-screen viewer.' },
    { icon: FiMic, title: 'Voice memos', desc: 'In-browser recording streamed straight into the conversation.' },
    { icon: FiSmile, title: 'Reactions & replies', desc: 'Per-user emoji reactions and quoted reply threading.' },
    { icon: FiShield, title: 'Moderation', desc: 'Role-based admin panel with disable, blacklist and delete controls.' },
    { icon: FiSliders, title: 'Admin dashboard', desc: 'Live user stats, site-wide login/signup toggles and a full registered-users directory.' },
];

const STACK = [
    { name: 'React', role: 'Frontend UI', desc: 'Component-driven interface with hooks-based state management.' },
    { name: 'TypeScript', role: 'Language', desc: 'End-to-end type safety across components, contexts and models.' },
    { name: 'Tailwind CSS v4', role: 'Design system', desc: 'Utility-first styling with a custom CSS-first design-token theme.' },
    { name: 'Socket.IO', role: 'Realtime layer', desc: 'Persistent WebSocket transport for messages, presence and typing.' },
    { name: 'NestJS', role: 'Backend', desc: 'Scalable Node.js server powering auth, users and room gateways.' },
    { name: 'Vite', role: 'Tooling', desc: 'Instant dev server and optimized production builds.' },
];

const ADMIN_STATS = [
    { label: 'Total users', accent: 'text-stone-800 dark:text-stone-100' },
    { label: 'Active', accent: 'text-emerald-500' },
    { label: 'Disabled', accent: 'text-amber-500' },
    { label: 'Blacklisted', accent: 'text-rose-500' },
];

const ADMIN_CAPABILITIES = [
    'Live counters for total, active, disabled and blacklisted accounts',
    'Site-wide toggles to enable or disable public login and new signups',
    'A searchable registered-users directory with role, status and email',
    'Per-user actions to disable, blacklist or permanently delete an account',
    'Protected-account safeguards so primary admins can\u2019t be locked out',
];

export const AboutPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <div className="min-h-dvh bg-cream-soft text-stone-900 dark:bg-ink-deep dark:text-stone-100">
            {/* Top bar */}
            <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-cream-soft/80 backdrop-blur-xl dark:border-stone-800/60 dark:bg-ink-deep/80">
                <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() => navigate(user ? '/chat' : '/')}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">{user ? 'Back to chat' : 'Back to home'}</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                    <div className="flex min-w-0 flex-1 justify-center">
                        <Logo size="sm" />
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
                {/* Page hero */}
                <section className="relative py-14 text-center sm:py-20">
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
                        <div className="absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                    </div>
                    <div className="relative animate-rise-in">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <FiActivity className="h-3.5 w-3.5" /> About the project
                        </span>
                        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                            About NestJS <span className="text-emerald-600 dark:text-emerald-400">Live Room</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-500 sm:text-lg dark:text-stone-400">
                            A lightweight realtime chat workspace focused on speed, clarity and a delightful user experience.
                        </p>
                    </div>
                </section>

                {/* Overview */}
                <section className="grid gap-10 border-t border-stone-200/60 py-14 lg:grid-cols-2 lg:items-center dark:border-stone-800/60" aria-labelledby="overview-heading">
                    <div>
                        <h2 id="overview-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">What it is</h2>
                        <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
                            NestJS Live Room is a realtime chat workspace built around one simple idea: conversations should
                            feel instant, focused and effortless. Create a room, share the name, and everyone inside can
                            exchange messages, files, voice memos and reactions with zero latency.
                        </p>
                        <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
                            Beneath the minimal interface sits a production-grade architecture — a NestJS backend handling
                            authentication and room orchestration, Socket.IO powering the realtime transport, and a
                            React + Tailwind CSS frontend tuned for every screen size.
                        </p>
                        <ul className="mt-6 space-y-3">
                            {[
                                'Realtime messaging with typing indicators and presence',
                                'Rooms you can create, join and retire in one click',
                                'Built-in moderation tools for administrators',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Architecture card */}
                    <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card dark:border-stone-800/80 dark:bg-ink">
                        <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase dark:text-stone-500">
                            <FiActivity className="h-3.5 w-3.5 text-emerald-500" /> Live architecture
                        </div>
                        <ol className="space-y-2.5 font-mono text-[13px]">
                            <li className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" /> React client · context state
                            </li>
                            <li aria-hidden className="pl-6 text-stone-300 dark:text-stone-600">↕ WebSocket (Socket.IO)</li>
                            <li className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" /> NestJS gateway · rooms & presence
                            </li>
                            <li aria-hidden className="pl-6 text-stone-300 dark:text-stone-600">↕ REST · cookie sessions</li>
                            <li className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" /> Auth & user management API
                            </li>
                        </ol>
                    </div>
                </section>

                {/* Capabilities */}
                <section className="border-t border-stone-200/60 py-14 dark:border-stone-800/60" aria-labelledby="capabilities-heading">
                    <h2 id="capabilities-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Key capabilities</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-3.5 rounded-2xl border border-stone-200/80 bg-white p-5 transition-colors hover:border-emerald-300/70 dark:border-stone-800/80 dark:bg-ink dark:hover:border-emerald-500/30">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Icon className="h-4.5 w-4.5" />
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold">{title}</h3>
                                    <p className="mt-1 text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Admin Control Panel */}
                <section className="border-t border-stone-200/60 py-14 dark:border-stone-800/60" aria-labelledby="admin-heading">
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <FiShield className="h-4.5 w-4.5" />
                        </span>
                        <h2 id="admin-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Control Panel</h2>
                    </div>
                    <p className="mt-4 max-w-3xl leading-relaxed text-stone-600 dark:text-stone-400">
                        A dedicated, role-protected dashboard gives administrators full visibility and control over user
                        accounts, workspace access, and moderation — separate from the everyday chat experience.
                    </p>

                    {/* Stat strip */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {ADMIN_STATS.map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-stone-200/80 bg-white p-5 dark:border-stone-800/80 dark:bg-ink">
                                <p className="text-[11px] font-bold tracking-wider text-stone-400 uppercase dark:text-stone-500">{stat.label}</p>
                                <p className={`mt-2 text-2xl font-extrabold ${stat.accent}`}>—</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
                        <ul className="space-y-3">
                            {ADMIN_CAPABILITIES.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={3} />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card dark:border-stone-800/80 dark:bg-ink">
                            <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-wider text-stone-400 uppercase dark:text-stone-500">
                                <FiSliders className="h-3.5 w-3.5 text-emerald-500" /> Site settings
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
                                    <div>
                                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">User Login</p>
                                        <p className="text-[12px] text-stone-500 dark:text-stone-400">Toggle public login access</p>
                                    </div>
                                    <span className="h-6 w-11 rounded-full bg-stone-300 dark:bg-stone-700" aria-hidden />
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/50">
                                    <div>
                                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">User Signup</p>
                                        <p className="text-[12px] text-stone-500 dark:text-stone-400">Toggle new user registration</p>
                                    </div>
                                    <span className="h-6 w-11 rounded-full bg-stone-300 dark:bg-stone-700" aria-hidden />
                                </div>
                            </div>
                            <p className="mt-4 text-[12px] leading-relaxed text-stone-500 dark:text-stone-400">
                                Protected accounts (such as the primary admin) are shown as read-only in the users table,
                                so moderation actions can never lock the workspace owner out by accident.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Tech stack */}
                <section className="border-t border-stone-200/60 py-14 dark:border-stone-800/60" aria-labelledby="stack-heading">
                    <h2 id="stack-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Built with a modern stack</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {STACK.map((tech) => (
                            <div key={tech.name} className="rounded-2xl border border-stone-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card dark:border-stone-800/80 dark:bg-ink">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-base font-bold">{tech.name}</h3>
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                        {tech.role}
                                    </span>
                                </div>
                                <p className="mt-2 text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Closing note */}
                <section className="border-t border-stone-200/60 py-14 dark:border-stone-800/60">
                    <div className="rounded-3xl border border-stone-200/80 bg-white p-8 text-center shadow-card sm:p-10 dark:border-stone-800/80 dark:bg-ink">
                        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">The project in one paragraph</h2>
                        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base dark:text-stone-400">
                            This project demonstrates a complete realtime product: cookie-based authentication, role-based
                            access control, WebSocket event orchestration, file streaming with inline previews, an
                            administrator control panel for user and access management, and a fully theme-aware interface
                            — all wrapped in a fast, accessible UI that works beautifully from phones to large displays.
                        </p>
                        {!user && (
                            <button type="button" onClick={() => navigate('/auth')}
                                className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:bg-emerald-500 active:scale-95">
                                Try it live <FiArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};