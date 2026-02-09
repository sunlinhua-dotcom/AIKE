'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, Star } from 'lucide-react';

interface Choice {
    id: string;
    label: string;
    consequence: string;
    score: number;
}

interface ScenarioSimulatorProps {
    title?: string;
    scenario?: string;
    choices?: Choice[];
    onComplete?: () => void;
    [key: string]: unknown;
}

export default function ScenarioSimulator({
    title = '情境模拟',
    scenario = '',
    choices = [],
    onComplete,
}: ScenarioSimulatorProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    if (!choices.length) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 text-center text-[var(--text-muted)]">
                <Compass size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">情境加载中...</p>
            </div>
        );
    }

    const bestChoice = [...choices].sort((a, b) => b.score - a.score)[0];
    const isBest = selectedId === bestChoice.id;

    const handleReveal = () => {
        if (!selectedId) return;
        setRevealed(true);
        if (onComplete) setTimeout(onComplete, 2500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            {/* 头部 */}
            <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                    <Compass size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </h3>
                </div>
            </div>

            {/* 情境描述 */}
            <div className="glass rounded-xl p-5 mb-5 border-l-2 border-[var(--accent-gold)]">
                <div className="text-xs text-[var(--accent-gold)] font-semibold tracking-wider uppercase mb-2">
                    📋 当前情境
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {scenario}
                </p>
            </div>

            {/* 选择项 */}
            <div className="space-y-2 mb-5">
                {choices.map((c) => {
                    const isThis = selectedId === c.id;
                    const isBestChoice = revealed && c.id === bestChoice.id;
                    const isWrongPick = revealed && isThis && !isBest;

                    return (
                        <motion.button
                            key={c.id}
                            onClick={() => !revealed && setSelectedId(c.id)}
                            whileTap={!revealed ? { scale: 0.98 } : {}}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${isBestChoice
                                ? 'border-emerald-500/40 bg-emerald-500/10'
                                : isWrongPick
                                    ? 'border-amber-500/40 bg-amber-500/10'
                                    : isThis
                                        ? 'border-[var(--accent-gold)]/40 bg-[var(--accent-gold-dim)]'
                                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]'
                                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isBestChoice ? 'border-emerald-500 bg-emerald-500' :
                                    isThis ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]' :
                                        'border-[var(--border-hover)]'
                                    }`}>
                                    {isBestChoice ? <Star size={12} className="text-black" /> :
                                        isThis ? <div className="w-1.5 h-1.5 rounded-full bg-black" /> : null}
                                </span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-[var(--text-primary)]">
                                        {c.label}
                                    </div>
                                    {/* 后果展示 */}
                                    <AnimatePresence>
                                        {revealed && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-2"
                                            >
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    {/* 星级评分 */}
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < c.score
                                                                ? 'text-[var(--accent-gold)] fill-[var(--accent-gold)]'
                                                                : 'text-white/10'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                                    {c.consequence}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* 结果总结 */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-4 flex items-start gap-3 ${isBest
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-amber-500/10 border border-amber-500/20'
                            }`}
                    >
                        {isBest ? (
                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            <div className="text-sm font-semibold mb-1">
                                {isBest ? '🎯 最优选择！' : '💡 可以更好'}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                最佳策略是「{bestChoice.label}」。{bestChoice.consequence}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 按钮 */}
            {!revealed && (
                <motion.button
                    onClick={handleReveal}
                    disabled={!selectedId}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedId
                        ? 'bg-[var(--accent-gold)] text-black hover:brightness-110'
                        : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                        }`}
                >
                    确认决策 <ArrowRight size={16} />
                </motion.button>
            )}
        </div>
    );
}
