'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import type { LessonMeta } from '@/data/lessonIndex';
import {
    ArrowRight, Sparkles, CheckCircle2,
    Brain, Swords, Target, Building2, GraduationCap,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
    Brain, Swords, Target, Building2, GraduationCap,
};

interface ModuleGroup {
    name: string;
    desc: string;
    icon: string;
    range: number[];
    accent: string;
    index: number;
    lessons: LessonMeta[];
}

export default function HomeClient({ modules }: { modules: ModuleGroup[] }) {
    const { lessonsCompleted } = useGameStore();

    return (
        <div className="relative w-full h-full overflow-y-auto">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-gold)]/[0.03] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-teal)]/[0.03] blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 px-6 py-12 md:px-16 lg:px-24 md:py-20 max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="mb-24"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={16} className="text-[var(--accent-gold)]" />
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                            Vibe Coding Executive Course
                        </span>
                    </div>

                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        <span className="text-[var(--text-primary)]">AI</span>{' '}
                        <span className="bg-gradient-to-r from-[var(--accent-gold)] to-[#EAB308] bg-clip-text text-transparent">
                            超级个体
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8">
                        20 节实战课程，教你用 AI 替代百万团队。
                        <br />
                        <span className="text-[var(--text-muted)]">
                            从认知破局到组织升级，一个人就是一支军队。
                        </span>
                    </p>

                    <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                        <span>20 课时</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span>5 大模块</span>
                        <span className="w-px h-4 bg-white/10" />
                        <span>7 种商务互动</span>
                    </div>
                </motion.div>

                {/* Module Grid */}
                <div className="space-y-12">
                    {modules.map((mod) => {
                        const ModIcon = ICON_MAP[mod.icon] || Brain;
                        return (
                            <motion.section
                                key={mod.index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + mod.index * 0.1, duration: 0.6 }}
                            >
                                {/* Module Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: `${mod.accent}20` }}
                                    >
                                        <ModIcon size={16} style={{ color: mod.accent }} />
                                    </div>
                                    <div>
                                        <h2
                                            className="text-sm font-semibold text-[var(--text-primary)]"
                                            style={{ fontFamily: 'var(--font-heading)' }}
                                        >
                                            M{mod.index + 1} · {mod.name}
                                        </h2>
                                        <p className="text-xs text-[var(--text-muted)]">{mod.desc}</p>
                                    </div>
                                </div>

                                {/* Lesson Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {mod.lessons.map((lesson) => {
                                        const isCompleted = lessonsCompleted.includes(lesson.id);
                                        return (
                                            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                                                <motion.div
                                                    className="glass glass-hover rounded-xl p-4 cursor-pointer group relative overflow-hidden"
                                                    whileHover={{ y: -2 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div
                                                        className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        style={{ background: `linear-gradient(90deg, transparent, ${mod.accent}, transparent)` }}
                                                    />
                                                    <div className="flex items-start justify-between mb-3">
                                                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                                                            L{lesson.id}
                                                        </span>
                                                        {isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
                                                    </div>
                                                    <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-white transition-colors mb-1">
                                                        {lesson.title}
                                                    </h3>
                                                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                                                        {lesson.subtitle}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-1 text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors">
                                                        <span>进入课程</span>
                                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-32 border-t border-[var(--border-subtle)] pt-8 text-center text-[var(--text-muted)] text-xs tracking-wider">
                    <p>© 2026 Antigravity · AI SUPER INDIVIDUAL</p>
                </div>
            </div>
        </div>
    );
}
