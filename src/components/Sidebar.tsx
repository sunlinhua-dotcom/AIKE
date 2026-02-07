'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allLessons } from '@/data/lessons';
import { useGameStore } from '@/store/gameStore';

export default function Sidebar() {
    const { currentLesson, lessonsCompleted, producerScore } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // 路由切换时自动关闭抽屉
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // 打开抽屉时禁止 body 滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                    🌌 AI 未来生存课
                </h2>
                <div className="text-xs text-gray-500 mt-1">Next-Gen Engine v3.0</div>
            </div>

            {/* Lessons List */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {allLessons.map((lesson) => {
                    const isActive = lesson.id === currentLesson;
                    const isCompleted = lessonsCompleted.includes(lesson.id);
                    return (
                        <Link key={lesson.id} href={`/lesson/${lesson.id}`} onClick={() => setIsOpen(false)}>
                            <div
                                className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all flex items-center gap-2 active:scale-95
                  ${isActive
                                        ? 'bg-pink-500/20 border border-pink-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                <span className="text-lg">{lesson.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">L{lesson.id}: {lesson.title}</div>
                                </div>
                                {isCompleted && <span className="text-green-400 text-xs">✓</span>}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Score Card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-white/5">
                <div className="text-xs text-pink-400 uppercase tracking-widest mb-1">生产者指数</div>
                <div className="text-3xl font-extrabold text-white">{producerScore}</div>
                <div className="text-xs text-gray-500 mt-1">
                    已完成 {lessonsCompleted.length}/10 课
                </div>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(lessonsCompleted.length / 10) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* 汉堡菜单按钮 — 仅移动端显示 */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-3 left-3 z-[60] md:hidden bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10 hover:border-pink-500/30 transition-all"
                aria-label="打开菜单"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H17M3 10H17M3 15H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            {/* 移动端抽屉遮罩 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* 侧边栏主体 */}
            {/* 桌面端：固定显示；移动端：抽屉滑出 */}
            <aside
                className={`
                    bg-black/30 border-r border-white/10 flex flex-col p-5 overflow-y-auto
                    
                    /* 桌面端：固定侧边栏 */
                    md:relative md:w-[260px] md:flex-shrink-0 md:translate-x-0
                    
                    /* 移动端：抽屉式 */
                    fixed inset-y-0 left-0 w-[280px] z-[80]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto'}
                    md:transition-none
                `}
            >
                {/* 移动端关闭按钮 */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 md:hidden text-gray-400 hover:text-white transition-colors"
                    aria-label="关闭菜单"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                {sidebarContent}
            </aside>
        </>
    );
}
