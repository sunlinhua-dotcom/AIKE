'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Check, ArrowRight } from 'lucide-react';

// ─── 维度标签中文映射 ───
const DIM_LABELS: Record<string, string> = {
    quality: '质量', speed: '速度', cost: '性价比', ease: '易用性',
    price: '价格', eco: '生态', logic: '推理', creativity: '创造',
};

interface ModelOption {
    id?: string;
    name: string;
    provider?: string;
    cost?: string;
    speed?: number;
    quality?: number;
    bestFor?: string;
    description?: string;
    scores?: Record<string, number>;
}

interface ModelComparatorProps {
    title?: string;
    description?: string;
    models?: ModelOption[];
    task?: string;
    dimensions?: string[];
    dimensionLabels?: Record<string, string>;
    correctIds?: string[];
    onComplete?: () => void;
    [key: string]: unknown;
}

export default function ModelComparator({
    title, description, models = [], task, dimensions, dimensionLabels, correctIds, onComplete
}: ModelComparatorProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showResult, setShowResult] = useState(false);

    // 自动推断维度（从第一个模型的 scores 对象的 keys）
    const dims = useMemo(() => {
        if (dimensions && dimensions.length > 0) return dimensions;
        const firstWithScores = models.find(m => m.scores && Object.keys(m.scores).length > 0);
        return firstWithScores ? Object.keys(firstWithScores.scores!) : [];
    }, [dimensions, models]);

    // 维度标签
    const labels = useMemo(() => ({
        ...DIM_LABELS,
        ...dimensionLabels,
    }), [dimensionLabels]);

    const getKey = (m: ModelOption, i: number) => m.id || m.name || `m-${i}`;

    const getScore = (m: ModelOption, dim: string): number => {
        if (m.scores && dim in m.scores) return m.scores[dim];
        if (dim === 'speed' && m.speed != null) return m.speed;
        if (dim === 'quality' && m.quality != null) return m.quality;
        return 0;
    };

    // 计算最大分数（用于归一化，如果数据在 1-10 范围则按 10 来）
    const maxScore = useMemo(() => {
        let max = 5;
        models.forEach(m => {
            dims.forEach(d => {
                const s = getScore(m, d);
                if (s > max) max = s;
            });
        });
        return max <= 5 ? 5 : 10;
    }, [models, dims]);

    const toggleModel = (key: string) => {
        if (showResult) return;
        setSelected(prev => {
            const ns = new Set(prev);
            ns.has(key) ? ns.delete(key) : ns.add(key);
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
                {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
                {task && <div className="mt-2 text-xs text-[var(--accent-gold)]">任务：{task}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {models.map((m, i) => {
                    const key = getKey(m, i);
                    const isSelected = selected.has(key);
                    return (
                        <motion.div
                            key={key}
                            onClick={() => toggleModel(key)}
                            className={`glass rounded-xl p-4 cursor-pointer transition-all border-2 ${isSelected
                                    ? 'border-[var(--accent-teal)]/60 bg-[var(--accent-teal-dim)]'
                                    : 'border-transparent hover:border-[var(--border-hover)]'
                                }`}
                            whileHover={{ y: -2 }}
                        >
                            {/* 头部 */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="text-sm font-semibold text-[var(--text-primary)]">{m.name}</div>
                                    {m.provider && <div className="text-[10px] text-[var(--text-muted)]">{m.provider}</div>}
                                </div>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                                        ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]'
                                        : 'border-[var(--border-hover)]'
                                    }`}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                </div>
                            </div>

                            {/* 能力条：动态显示所有维度 */}
                            <div className="space-y-2 mb-3">
                                {dims.map(d => {
                                    const score = getScore(m, d);
                                    const barCount = maxScore <= 5 ? 5 : 10;
                                    return (
                                        <div key={d} className="flex items-center gap-2">
                                            <span className="text-[10px] text-[var(--text-muted)] w-12 flex-shrink-0">
                                                {labels[d] || d}
                                            </span>
                                            <div className="flex gap-0.5 flex-1">
                                                {Array.from({ length: barCount }, (_, j) => (
                                                    <div
                                                        key={j}
                                                        className="h-1.5 flex-1 rounded-full transition-colors"
                                                        style={{
                                                            background: j < score
                                                                ? 'var(--accent-gold)'
                                                                : 'rgba(255,255,255,0.06)',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-[var(--text-muted)] w-4 text-right">
                                                {score}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 底部描述 */}
                            {m.description && (
                                <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    {m.description}
                                </div>
                            )}
                            {m.bestFor && (
                                <div className="text-xs text-[var(--accent-teal)] mt-1">{m.bestFor}</div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {!showResult ? (
                <motion.button
                    onClick={handleSubmit}
                    disabled={selected.size === 0}
                    className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${selected.size > 0
                            ? 'bg-[var(--accent-teal)] text-white hover:brightness-110'
                            : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                        }`}
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
                    <div className="font-semibold text-sm mb-1">{isCorrect ? '✅ 完美组合！' : '💡 值得思考'}</div>
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
