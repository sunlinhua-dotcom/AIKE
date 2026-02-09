'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizChallengeProps {
    title?: string;
    description?: string;
    questions?: Question[];
    onComplete?: () => void;
    [key: string]: unknown;
}

export default function QuizChallenge({
    title = '随堂测验',
    description = '检验你的理解',
    questions = [],
    onComplete,
}: QuizChallengeProps) {
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);

    if (!questions.length) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 text-center text-[var(--text-muted)]">
                <HelpCircle size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">测验加载中...</p>
            </div>
        );
    }

    const q = questions[currentQ];
    const isCorrect = selectedIdx === q?.correctIndex;
    const total = questions.length;

    const handleSelect = (idx: number) => {
        if (answered) return;
        setSelectedIdx(idx);
    };

    const handleConfirm = () => {
        if (selectedIdx === null) return;
        if (!answered) {
            setAnswered(true);
            if (isCorrect) setCorrectCount(prev => prev + 1);
            return;
        }
        // 已答题，进入下一题或结束
        if (currentQ < total - 1) {
            setCurrentQ(prev => prev + 1);
            setSelectedIdx(null);
            setAnswered(false);
        } else {
            setFinished(true);
            if (onComplete) setTimeout(onComplete, 2000);
        }
    };

    if (finished) {
        const score = Math.round((correctCount / total) * 100);
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl mx-auto p-6"
            >
                <div className="glass rounded-xl p-8 text-center">
                    <Trophy size={40} className="mx-auto mb-4 text-[var(--accent-gold)]" />
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        测验完成
                    </h3>
                    <div className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
                        {correctCount}/{total}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {score >= 80 ? '🎉 太棒了！你掌握得很好。' :
                            score >= 60 ? '👍 不错，还有进步空间。' :
                                '📚 建议回顾本课内容后再试一次。'}
                    </p>
                    {/* 进度条 */}
                    <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-full"
                        />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            {/* 头部 */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <HelpCircle size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>

            {/* 进度指示器 */}
            <div className="flex items-center gap-1.5 mb-5">
                {questions.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < currentQ ? 'bg-[var(--accent-gold)]' :
                                i === currentQ ? 'bg-[var(--accent-gold)]/50' :
                                    'bg-white/10'
                            }`}
                    />
                ))}
                <span className="text-xs text-[var(--text-muted)] ml-2">{currentQ + 1}/{total}</span>
            </div>

            {/* 题目 */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                >
                    <div className="glass rounded-xl p-5 mb-4">
                        <p className="text-base font-medium text-[var(--text-primary)] leading-relaxed">
                            {q.question}
                        </p>
                    </div>

                    {/* 选项 */}
                    <div className="space-y-2 mb-4">
                        {q.options.map((opt, idx) => {
                            const isThis = selectedIdx === idx;
                            const isRight = answered && idx === q.correctIndex;
                            const isWrong = answered && isThis && !isCorrect;

                            return (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    whileTap={!answered ? { scale: 0.98 } : {}}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${isRight
                                            ? 'border-emerald-500/40 bg-emerald-500/10'
                                            : isWrong
                                                ? 'border-red-500/40 bg-red-500/10'
                                                : isThis
                                                    ? 'border-[var(--accent-gold)]/40 bg-[var(--accent-gold-dim)]'
                                                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]'
                                        } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isRight ? 'border-emerald-500 bg-emerald-500 text-black' :
                                            isWrong ? 'border-red-500 bg-red-500 text-white' :
                                                isThis ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] text-black' :
                                                    'border-[var(--border-hover)] text-[var(--text-muted)]'
                                        }`}>
                                        {isRight ? <CheckCircle2 size={14} /> :
                                            isWrong ? <XCircle size={14} /> :
                                                String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-sm text-[var(--text-primary)]">{opt}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* 解析 */}
                    <AnimatePresence>
                        {answered && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 rounded-xl mb-4 ${isCorrect
                                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                                        : 'bg-amber-500/10 border border-amber-500/20'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    {isCorrect ? (
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <XCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div>
                                        <div className="text-xs font-semibold mb-1">
                                            {isCorrect ? '✅ 回答正确！' : '❌ 回答错误'}
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                            {q.explanation}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>

            {/* 按钮 */}
            <motion.button
                onClick={handleConfirm}
                disabled={selectedIdx === null}
                className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedIdx !== null
                        ? 'bg-[var(--accent-gold)] text-black hover:brightness-110'
                        : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                    }`}
            >
                {!answered ? '确认答案' : currentQ < total - 1 ? '下一题' : '查看结果'}
                <ArrowRight size={16} />
            </motion.button>
        </div>
    );
}
