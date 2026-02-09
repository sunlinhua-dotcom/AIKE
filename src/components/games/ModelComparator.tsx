'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Check, ArrowRight } from 'lucide-react';

interface ModelOption {
    id: string;
    name: string;
    provider: string;
    cost: string;        // e.g. "$0.002/1k tokens"
    speed: number;       // 1-5
    quality: number;     // 1-5
    bestFor: string;
}

interface ModelComparatorProps {
    title: string;
    description: string;
    models: ModelOption[];
    task: string;  // "为客服场景选择最优模型组合"
    correctIds?: string[];
    onComplete?: () => void;
}

export default function ModelComparator({ title, description, models, task, correctIds, onComplete }: ModelComparatorProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showResult, setShowResult] = useState(false);

    const toggleModel = (id: string) => {
        if (showResult) return;
        setSelected(prev => {
            const ns = new Set(prev);
            ns.has(id) ? ns.delete(id) : ns.add(id);
            return ns;
        });
    };

    const handleSubmit = () => {
        setShowResult(true);
        if (onComplete) setTimeout(onComplete, 2500);
    };

    const isCorrect = correctIds && correctIds.length > 0 &&
        correctIds.every(id => selected.has(id)) && selected.size === correctIds.length;

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Layers size={20} className="text-[var(--accent-teal)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                <div className="mt-2 text-xs text-[var(--accent-gold)]">任务：{task}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {models.map(m => {
                    const isSelected = selected.has(m.id);
                    return (
                        <motion.div
                            key={m.id}
                            onClick={() => toggleModel(m.id)}
                            className={`glass rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-[var(--accent-teal)] bg-[var(--accent-teal-dim)]' : 'glass-hover'
                                }`}
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">{m.name}</div>
                                    <div className="text-[10px] text-[var(--text-muted)]">{m.provider}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected
                                        ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]'
                                        : 'border-[var(--border-hover)]'
                                    }`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                </div>
                            </div>

                            <div className="space-y-1.5 mb-3">
                                <MetricBar label="速度" value={m.speed} color="var(--accent-teal)" />
                                <MetricBar label="质量" value={m.quality} color="var(--accent-gold)" />
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--text-muted)]">成本: {m.cost}</span>
                                <span className="text-[var(--accent-teal)]">{m.bestFor}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {!showResult ? (
                <motion.button
                    onClick={handleSubmit}
                    disabled={selected.size === 0}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${selected.size > 0
                            ? 'bg-[var(--accent-teal)] text-white hover:brightness-110'
                            : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'}`}
                    whileTap={{ scale: 0.98 }}
                >
                    确认组合 <ArrowRight size={16} />
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}
                >
                    <div className="font-semibold text-sm mb-1">{isCorrect ? '完美组合！' : '值得思考'}</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                        {isCorrect
                            ? '你选择了最优的模型组合，在成本和性能之间取得了最佳平衡。'
                            : '不同场景需要不同的模型。高频低复杂度用 Flash，低频高质量用 Pro。关键是"混合部署"策略。'}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-muted)] w-8">{label}</span>
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="w-5 h-1.5 rounded-full" style={{ background: i < value ? color : 'rgba(255,255,255,0.06)' }} />
                ))}
            </div>
        </div>
    );
}
