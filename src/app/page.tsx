'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { allLessons } from '@/data/lessons';
import { useGameStore } from '@/store/gameStore';

export default function HomePage() {
  const { lessonsCompleted } = useGameStore();

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {/* BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F2F] via-[#1a1a3e] to-[#0a0a1f]" />

      {/* Content */}
      <div className="relative z-10 px-4 py-6 md:px-12 md:py-10 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="text-4xl md:text-6xl mb-4">🌌</div>
          <h1 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            AI 未来生存课
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto">
            10节课教会你在AI时代的生存法则。<br />
            从消费者到生产者，从被动到主动，从平庸到卓越。
          </p>
        </motion.div>

        {/* Modules */}
        {['模块一 · 时间觉醒', '模块二 · 杠杆锻造', '模块三 · 价值创造'].map((module, mi) => (
          <div key={module} className="mb-8 md:mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: mi * 0.1 }}
              className="text-sm uppercase tracking-widest text-pink-400 mb-4 font-bold"
            >
              {module}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {allLessons
                .filter((l) => l.module === module)
                .map((lesson, i) => {
                  const isCompleted = lessonsCompleted.includes(lesson.id);
                  return (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: mi * 0.1 + i * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`p-5 rounded-xl border cursor-pointer transition-all
                          ${isCompleted
                            ? 'bg-green-500/5 border-green-500/20'
                            : 'bg-white/[0.03] border-white/[0.05] hover:border-pink-500/30 hover:bg-white/[0.05]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{lesson.icon}</span>
                          <div>
                            <div className="font-bold text-white">
                              L{lesson.id}: {lesson.title}
                              {isCompleted && <span className="ml-2 text-green-400 text-xs">✓ 已完成</span>}
                            </div>
                            <div className="text-gray-500 text-sm">{lesson.subtitle}</div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
