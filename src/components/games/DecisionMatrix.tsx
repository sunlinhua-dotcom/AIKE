'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Target, ArrowRight } from 'lucide-react';

// ─── 标准化后的内部类型 ───
interface NormalizedOption {
    id: string;
    label: string;
    description: string;
    scores: Record<string, number>;
}

// ─── 对外接口：兼容新旧两种格式 ───
interface DecisionMatrixProps {
    title?: string;
    description?: string;
    dimensions?: string[];
    criteria?: string[];
    options?: Array<{
        id?: string;
        label?: string;
        name?: string;
        description?: string;
        scores?: Record<string, number> | number[];
    }>;
    correctId?: string;
    onComplete?: () => void;
    [key: string]: unknown;
}

function normalizeData(props: DecisionMatrixProps): {
    dims: string[];
    opts: NormalizedOption[];
} {
    const dims = props.dimensions ?? props.criteria ?? [];
    const rawOptions = props.options ?? [];
    const opts: NormalizedOption[] = rawOptions.map((o, idx) => {
        const id = o.id ?? `opt-${idx}`;
        const label = o.label ?? o.name ?? `方案 ${idx + 1}`;
        const description = o.description ?? '';

        let scores: Record<string, number> = {};
        if (o.scores) {
            if (Array.isArray(o.scores)) {
                dims.forEach((d, i) => {
                    scores[d] = (o.scores as number[])[i] ?? 0;
                });
            } else {
                scores = o.scores as Record<string, number>;
            }
        }

        return { id, label, description, scores };
    });

    return { dims, opts };
}

export default function DecisionMatrix(props: DecisionMatrixProps) {
    const { title = '决策矩阵', description = '请选择最优方案', onComplete, correctId } = props;
    const { dims, opts } = useMemo(() => normalizeData(props), [props]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    // 防御：如果 dims 或 opts 为空直接渲染占位
    if (!dims.length || !opts.length) {
        return (
            <div className="w-full max-w-3xl mx-auto p-6 text-center text-[var(--text-muted)]">
                <Target size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">决策矩阵加载中...</p>
            </div>
        );
    }

    // 计算总分用于结果判定
    const totalScores = opts.map(opt => ({
        ...opt,
        total: dims.reduce((sum, d) => sum + (opt.scores[d] || 0), 0),
    })).sort((a, b) => b.total - a.total);

    const bestOption = correctId
        ? totalScores.find(o => o.id === correctId) || totalScores[0]
        : totalScores[0];

    const handleSubmit = () => {
        if (!selectedId) return;
        setShowResult(true);
        if (onComplete) setTimeout(onComplete, 2500);
    };

    const isCorrect = selectedId === bestOption.id;

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            {/* 标题区 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>

            {/* 方案卡片 */}
            <div className="space-y-3 mb-6">
                {opts.map(opt => {
                    const isSelected = selectedId === opt.id;
                    const isWinner = showResult && opt.id === bestOption.id;
                    const isLoser = showResult && isSelected && opt.id !== bestOption.id;

                    return (
                        <motion.div
                            key={opt.id}
                            onClick={() => !showResult && setSelectedId(opt.id)}
                            className={`glass rounded-xl p-4 cursor-pointer transition-all border-2 ${isWinner ? 'border-emerald-500/50 bg-emerald-500/10' :
                                    isLoser ? 'border-red-500/30 bg-red-500/5' :
                                        isSelected ? 'border-[var(--accent-gold)]/60 bg-[var(--accent-gold-dim)]' :
                                            'border-transparent hover:border-[var(--border-hover)]'
                                }`}
                            whileHover={!showResult ? { scale: 1.01 } : {}}
                            whileTap={!showResult ? { scale: 0.99 } : {}}
                        >
                            <div className="flex items-start gap-3">
                                {/* 选择圈 */}
                                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isWinner ? 'border-emerald-500 bg-emerald-500' :
                                        isLoser ? 'border-red-500 bg-red-500' :
                                            isSelected ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]' :
                                                'border-[var(--border-hover)]'
                                    }`}>
                                    {(isSelected || isWinner) && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>

                                {/* 内容 */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-[var(--text-primary)] mb-1">{opt.label}</div>
                                    {opt.description && (
                                        <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">{opt.description}</p>
                                    )}

                                    {/* 能力条 */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                        {dims.map(d => (
                                            <div key={d} className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--text-muted)] w-14 flex-shrink-0">{d}</span>
                                                <div className="flex gap-0.5 flex-1">
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1.5 flex-1 rounded-full transition-colors ${i < (opt.scores[d] || 0) ? 'bg-[var(--accent-gold)]' : 'bg-white/8'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 结果标记 */}
                                {showResult && isWinner && (
                                    <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                )}
                                {showResult && isLoser && (
                                    <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* 提交 / 结果 */}
            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.button
                        key="submit"
                        onClick={handleSubmit}
                        disabled={!selectedId}
                        className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedId
                                ? 'bg-[var(--accent-gold)] text-black hover:brightness-110'
                                : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                            }`}
                    >
                        确认选择 <ArrowRight size={16} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${isCorrect
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-amber-500/10 border border-amber-500/20'
                            }`}
                    >
                        <div className="font-semibold text-sm mb-1">
                            {isCorrect ? '✅ 判断正确！' : '🤔 再想想...'}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {isCorrect
                                ? `「${bestOption.label}」正是最佳选择！响应速度和成本效益最高，非常适合用轻量级 AI 处理。`
                                : `最优方案是「${bestOption.label}」。选 AI 模型的核心逻辑：高频简单任务用便宜快速的，低频复杂任务才用贵的。`
                            }
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
