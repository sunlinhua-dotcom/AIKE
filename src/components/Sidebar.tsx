'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allLessons } from '@/data/lessons';
import { useGameStore } from '@/store/gameStore';
import {
    Menu, X, CheckCircle2, Zap,
    TrendingDown, Users, Terminal, ShieldAlert,
    Wrench, Code2, Blocks, Cable,
    BarChart3, FileText, BrainCircuit, Rocket,
    Building2, Wallet, FolderKanban, Network,
    GraduationCap, Trophy,
} from 'lucide-react';

// Lucide 图标映射（替代 emoji）
const LESSON_ICONS: Record<number, React.ReactNode> = {
    1: <TrendingDown size={18} />,
    2: <Users size={18} />,
    3: <Terminal size={18} />,
    4: <ShieldAlert size={18} />,
    5: <Wrench size={18} />,
    6: <Code2 size={18} />,
    7: <Blocks size={18} />,
    8: <Cable size={18} />,
    9: <BarChart3 size={18} />,
    10: <FileText size={18} />,
    11: <BrainCircuit size={18} />,
    12: <Rocket size={18} />,
    13: <Building2 size={18} />,
    14: <Wallet size={18} />,
    15: <FolderKanban size={18} />,
    16: <Network size={18} />,
    17: <GraduationCap size={18} />,
    18: <Trophy size={18} />,
    19: <GraduationCap size={18} />,
    20: <Trophy size={18} />,
};

// 模块分组
const MODULES = [
    { name: '认知破局', range: [1, 4] },
    { name: '武器锻造', range: [5, 8] },
    { name: '实战部署', range: [9, 12] },
    { name: '组织升级', range: [13, 18] },
    { name: '毕业演练', range: [19, 20] },
];

export default function Sidebar() {
    const { currentLesson, lessonsCompleted, producerScore } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => { setIsOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const totalLessons = allLessons.length;
    const completionPct = totalLessons > 0 ? (lessonsCompleted.length / totalLessons) * 100 : 0;

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="mb-6">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    <span className="text-[var(--accent-gold)]">AI</span>{' '}
                    <span className="text-[var(--text-primary)]">超级个体</span>
                </h2>
                <div className="text-xs text-[var(--text-muted)] mt-1 tracking-wider">
                    VIBE CODING EXECUTIVE
                </div>
            </div>

            {/* Module Groups */}
            <nav className="flex-1 overflow-y-auto space-y-4">
                {MODULES.map((mod, mi) => {
                    const moduleLessons = allLessons.filter(
                        l => l.id >= mod.range[0] && l.id <= mod.range[1]
                    );
                    return (
                        <div key={mi}>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2 px-2">
                                M{mi + 1} · {mod.name}
                            </div>
                            <div className="space-y-0.5">
                                {moduleLessons.map((lesson) => {
                                    const isActive = lesson.id === currentLesson;
                                    const isCompleted = lessonsCompleted.includes(lesson.id);
                                    return (
                                        <Link key={lesson.id} href={`/lesson/${lesson.id}`} onClick={() => setIsOpen(false)}>
                                            <div
                                                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-all flex items-center gap-2.5 active:scale-[0.97]
                                                    ${isActive
                                                        ? 'bg-[var(--accent-gold-dim)] border border-[var(--accent-gold)]/30 text-white'
                                                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.04]'
                                                    }`}
                                            >
                                                <span className={`flex-shrink-0 ${isActive ? 'text-[var(--accent-gold)]' : ''}`}>
                                                    {LESSON_ICONS[lesson.id] || <Zap size={18} />}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-[13px]">
                                                        L{lesson.id}: {lesson.title}
                                                    </div>
                                                </div>
                                                {isCompleted && (
                                                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Score Card */}
            <div className="mt-4 p-4 rounded-xl glass">
                <div className="text-[10px] text-[var(--accent-gold)] uppercase tracking-[0.2em] mb-1">
                    战力指数
                </div>
                <div className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {producerScore}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                    已完成 {lessonsCompleted.length}/{totalLessons} 课
                </div>
                <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-teal))' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Hamburger Button (Mobile) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-3 left-3 z-[60] md:hidden glass rounded-lg p-2 cursor-pointer hover:bg-white/[0.06] transition-all"
                aria-label="打开菜单"
            >
                <Menu size={20} className="text-[var(--text-secondary)]" />
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Body */}
            <aside
                className={`
                    bg-[var(--bg-surface)]/80 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col p-5 overflow-y-auto
                    md:relative md:w-[260px] md:flex-shrink-0 md:translate-x-0
                    fixed inset-y-0 left-0 w-[280px] z-[80]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto'}
                    md:transition-none
                `}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 md:hidden text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                    aria-label="关闭菜单"
                >
                    <X size={20} />
                </button>
                {sidebarContent}
            </aside>
        </>
    );
}
