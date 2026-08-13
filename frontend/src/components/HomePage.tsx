import React from 'react';
import { FiZap, FiHash, FiPaperclip, FiMic, FiSmile, FiShield, FiArrowRight, FiCheck, FiSend, FiLock } from 'react-icons/fi';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';


const FEATURES = [
    { icon: FiZap, title: 'Realtime by default', desc: 'Messages, typing indicators and presence sync instantly over persistent WebSocket connections.' },
    { icon: FiHash, title: 'Focused rooms', desc: 'Spin up a room for any topic in one click — create, join and clean up with zero friction.' },
    { icon: FiPaperclip, title: 'Files & media', desc: 'Share images, documents and PDFs up to 25 MB with inline previews and one-tap downloads.' },
    { icon: FiMic, title: 'Voice memos', desc: 'Record and send audio notes directly from the composer — no external tools required.' },
    { icon: FiSmile, title: 'Reactions & replies', desc: 'Keep conversations lively and threaded with emoji reactions and contextual quote replies.' },
    { icon: FiShield, title: 'Admin controls', desc: 'Moderate with confidence: disable, blacklist or remove users from a dedicated control panel.' },
];

const MockMessage: React.FC<{ name?: string; initial?: string; text: string; own?: boolean; gradient?: string }> = ({ name, initial, text, own = false, gradient = '' }) => (
    <div className={`flex items-end gap-2.5 ${own ? 'flex-row-reverse' : ''}`}>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${gradient}`}>
            {initial}
        </span>
        <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${own
            ? 'rounded-br-md bg-emerald-600 text-white'
            : 'rounded-bl-md border border-stone-100 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-300'
            }`}
        >
            {!own && <p className="mb-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{name}</p>}
            {text}
        </div>
    </div>
);

export const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const entryPath = user ? '/chat' : '/auth';
    return (
        <div className="min-h-dvh bg-cream-soft text-stone-900 dark:bg-ink-deep dark:text-stone-100">
            {/* Navigation */}
            <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-cream-soft/80 backdrop-blur-xl dark:border-stone-800/60 dark:bg-ink-deep/80">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Logo size="sm" />
                    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
                        <button
                            type="button"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 sm:block dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200"
                        >
                            Features
                        </button>
                        <Link to="/about" className="rounded-xl px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-200/50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200">
        About
    </Link>
                        <ThemeToggle className="ml-1" />
                        <button type="button" onClick={() => navigate(entryPath)} className="ml-1 h-10 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-500 active:scale-95">
        {user ? 'Open chat' : 'Sign in'}
    </button>
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
                        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-500/10" />
                    </div>

                    <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-24 lg:pb-28">
                        {/* Copy */}
                        <div className="max-w-2xl">
                            <span className="inline-flex animate-rise-in items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <FiZap className="h-3.5 w-3.5" />
                                Realtime rooms · Socket.IO + NestJS
                            </span>

                            <h1 className="mt-5 animate-rise-in text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '60ms' }}>
                                Conversations that move at{' '}
                                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-300">
                                    the speed of thought
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl animate-rise-in text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-400" style={{ animationDelay: '120ms' }}>
                                NestJS Live Room is a fast, focused chat workspace — create a room, invite your people,
                                and start sharing messages, files and voice memos in milliseconds. No noise. No clutter.
                            </p>

                            <div className="mt-8 flex animate-rise-in flex-wrap items-center gap-3" style={{ animationDelay: '180ms' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(entryPath)}  
                                    className="flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95"
                                >
                                    Get started free <FiArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/about')} 
                                    className="flex h-12 items-center rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-700 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-700 active:scale-95 dark:border-stone-700 dark:bg-ink-soft dark:text-stone-200 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400"
                                >
                                    Learn more
                                </button>
                            </div>

                            <ul className="mt-8 flex animate-rise-in flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-stone-500 dark:text-stone-400" style={{ animationDelay: '240ms' }}>
                                {['Free forever', 'No setup required', 'Works on any device'].map((item) => (
                                    <li key={item} className="flex items-center gap-1.5">
                                        <FiCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative mx-auto w-full max-w-md animate-rise-in lg:max-w-none" style={{ animationDelay: '200ms' }}>
                            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-2xl" />

                            <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-pop dark:border-stone-800 dark:bg-ink">
                                <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 dark:border-stone-800">
                                    <div className="flex items-center gap-2 text-sm font-bold text-stone-800 dark:text-stone-200">
                                        <FiHash className="h-4 w-4 text-emerald-500" /> design-team
                                    </div>
                                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> 3 online
                                    </span>
                                </div>

                                <div className="space-y-4 px-4 py-5">
                                    <MockMessage name="Ava" initial="A" gradient="bg-gradient-to-tr from-violet-500 to-fuchsia-500" text="The new dashboard mockups just landed 🎨" />
                                    <MockMessage own initial="Y" gradient="bg-gradient-to-tr from-emerald-600 to-emerald-400" text="Ship the dark mode first — it looks stunning." />
                                    <MockMessage name="Marco" initial="M" gradient="bg-gradient-to-tr from-amber-500 to-orange-500" text="Agreed. Voice notes for feedback would be 👌" />
                                    <div className="flex items-center gap-2 pl-10 text-xs text-stone-400 dark:text-stone-500">
                                        <span className="flex items-center gap-1">
                                            {[0, 150, 300].map((d) => (
                                                <span key={d} className="h-1.5 w-1.5 animate-typing-dot rounded-full bg-emerald-500" style={{ animationDelay: `${d}ms` }} />
                                            ))}
                                        </span>
                                        Marco is typing…
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 p-3 dark:border-stone-800">
                                    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-500">
                                        Type a message…
                                        <FiSend className="ml-auto h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-10 -left-4 hidden animate-float items-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-card sm:flex dark:border-stone-700/80 dark:bg-ink-soft dark:text-stone-200">
                                <FiLock className="h-3.5 w-3.5 text-emerald-500" /> Secure sessions
                            </div>
                            <div className="absolute -right-3 bottom-16 hidden animate-float-delayed items-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-card sm:flex dark:border-stone-700/80 dark:bg-ink-soft dark:text-stone-200">
                                <FiMic className="h-3.5 w-3.5 text-emerald-500" /> Voice memos
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="border-t border-stone-200/60 bg-white py-20 dark:border-stone-800/60 dark:bg-ink/40" aria-labelledby="features-heading">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 id="features-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Everything a modern team chat needs
                            </h2>
                            <p className="mt-3 text-stone-500 dark:text-stone-400">
                                Purpose-built features, zero bloat — each one engineered for speed and clarity.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map(({ icon: Icon, title, desc }) => (
                                <article
                                    key={title}
                                    className="group rounded-2xl border border-stone-200/80 bg-cream-soft/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/70 hover:shadow-card dark:border-stone-800 dark:bg-ink-soft/40 dark:hover:border-emerald-500/30"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-base font-bold">{title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-14 text-center shadow-pop sm:px-12">
                            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
                            <h2 className="relative text-3xl font-bold text-white sm:text-4xl">Ready to jump in?</h2>
                            <p className="relative mx-auto mt-3 max-w-xl text-emerald-50/90">
                                Create your account and open your first room in under a minute.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate(entryPath)}
                                className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-emerald-800 shadow-lg transition-all duration-200 hover:bg-emerald-50 active:scale-95"
                            >
                                Get started — it's free <FiArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};