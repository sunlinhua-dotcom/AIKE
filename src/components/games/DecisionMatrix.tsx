'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, BarChart3, ArrowRight } from 'lucide-react';

// ─── 标准化后的内部类型 ───
interface NormalizedOption {
    id: string;
    label: string;
    scores: Record<string, number>;
}

// ─── 对外接口：兼容新旧两种格式 ───
interface DecisionMatrixProps {
    title?: string;
    description?: string;
    // 新格式
    dimensions?: string[];
    // 旧格式
    criteria?: string[];
    // 兼容两种 option 格式
    options?: Array<{
        id?: string;
        label?: string;
        name?: string;
        description?: string;
        scores?: Record<string, number> | number[];
    }>;
    correctId?: string;
    onComplete?: () => void;
    // 额外兼容字段 (忽略)
    weights?: number[];
    [key: string]: unknown;
}

/**
 * 将 gameProps 原始 options 标准化为组件内部使用的格式
 */
function normalizeData(props: DecisionMatrixProps): {
    dims: string[];
    opts: NormalizedOption[];
} {
    const dims = props.dimensions ?? props.criteria ?? [];

    const rawOptions = props.options ?? [];
    const opts: NormalizedOption[] = rawOptions.map((o, idx) => {
        const id = o.id ?? `opt-${idx}`;
        const label = o.label ?? o.name ?? `方案 ${idx + 1}`;

        // scores 可能是 Record<string, number> 或 number[]
        let scores: Record<string, number> = {};
        if (o.scores) {
            if (Array.isArray(o.scores)) {
                // 数组格式 → 映射到 dims
                dims.forEach((d, i) => {
                    scores[d] = (o.scores as number[])[i] ?? 0;
                });
            } else {
                scores = o.scores as Record<string, number>;
            }
        }

        return { id, label, scores };
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
                <BarChart3 size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">决策矩阵加载中...</p>
            </div>
        );
    }

    const totalScores = opts.map(opt => ({
        ...opt,
        total: dims.reduce((sum, d) => sum + (opt.scores[d] || 0), 0),
    })).sort((a, b) => b.total - a.total);

    const bestOption = totalScores[0];

    const handleSubmit = () => {
        if (!selectedId) return;
        setShowResult(true);
        if (onComplete) setTimeout(onComplete, 2000);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>

            {/* Matrix Table */}
            <div className="glass rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border-subtle)]">
                            <th className="text-left p-3 text-[var(--text-muted)] font-normal text-xs uppercase tracking-wider">
                                方案
                            </th>
                            {dims.map(d => (
                                <th key={d} className="p-3 text-center text-[var(--text-muted)] font-normal text-xs uppercase tracking-wider">
                                    {d}
                                </th>
                            ))}
                            <th className="p-3 text-center text-[var(--accent-gold)] font-semibold text-xs uppercase tracking-wider">
                                总分
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {opts.map(opt => {
                            const total = dims.reduce((sum, d) => sum + (opt.scores[d] || 0), 0);
                            const isSelected = selectedId === opt.id;
                            const isBest = showResult && opt.id === bestOption.id;

                            return (
                                <tr
                                    key={opt.id}
                                    onClick={() => !showResult && setSelectedId(opt.id)}
                                    className={`
                                        border-b border-[var(--border-subtle)] cursor-pointer transition-all duration-200
                                        ${isSelected ? 'bg-[var(--accent-gold-dim)]' : 'hover:bg-white/[0.02]'}
                                        ${isBest ? 'bg-emerald-500/10' : ''}
                                    `}
                                >
                                    <td className="p-3 font-medium text-[var(--text-primary)]">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                                                ${isSelected ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]' : 'border-[var(--border-hover)]'}
                                            `}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                            </div>
                                            {opt.label}
                                        </div>
                                    </td>
                                    {dims.map(d => (
                                        <td key={d} className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-0.5">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full transition-colors ${i < (opt.scores[d] || 0)
                                                            ? 'bg-[var(--accent-gold)]'
                                                            : 'bg-white/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                    <td className="p-3 text-center font-bold text-[var(--accent-gold)]">
                                        {total}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Submit / Result */}
            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.button
                        key="submit"
                        onClick={handleSubmit}
                        disabled={!selectedId}
                        className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer
                            ${selectedId
                                ? 'bg-[var(--accent-gold)] text-black hover:brightness-110'
                                : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                            }
                        `}
                    >
                        确认决策 <ArrowRight size={16} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-start gap-3 ${selectedId === bestOption.id
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-amber-500/10 border border-amber-500/20'
                            }`}
                    >
                        {selectedId === bestOption.id ? (
                            <CheckCircle2 size={20} className="text-emerald-500 mt-0.5" />
                        ) : (
                            <XCircle size={20} className="text-amber-500 mt-0.5" />
                        )}
                        <div>
                            <div className="font-semibold text-sm mb-1">
                                {selectedId === bestOption.id ? '决策正确！' : '思考一下...'}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                最优方案是「{bestOption.label}」，总分 {bestOption.total} 分。
                                {correctId && selectedId !== correctId && ' 在商业环境中，数据驱动的决策比直觉更可靠。'}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
