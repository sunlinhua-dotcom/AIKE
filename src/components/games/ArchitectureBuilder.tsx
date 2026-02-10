'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Blocks, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface ArchBlock {
    id: string;
    label: string;
    layer?: number;
    description: string;
}

interface ArchitectureBuilderProps {
    title: string;
    description?: string;
    instruction?: string;
    blocks?: ArchBlock[];
    layers?: ArchBlock[];  // 兼容 lessons 数据格式
    correctOrder?: string[];
    layerNames?: string[];
    onComplete?: () => void;
}

export default function ArchitectureBuilder({
    title, description, instruction, blocks: blocksProp, layers, correctOrder = [], layerNames: layerNamesProp, onComplete
}: ArchitectureBuilderProps) {
    // 兼容两种数据格式：blocks 或 layers
    const blocks = blocksProp || layers || [];
    const layerNames = layerNamesProp || blocks.map(b => b.label);

    const [placed, setPlaced] = useState<(string | null)[]>(Array(layerNames.length).fill(null));
    const [available, setAvailable] = useState<string[]>(blocks.map(b => b.id));
    const [showResult, setShowResult] = useState(false);

    const placeBlock = useCallback((blockId: string) => {
        const firstEmpty = placed.findIndex(p => p === null);
        if (firstEmpty === -1) return;

        setPlaced(prev => {
            const np = [...prev];
            np[firstEmpty] = blockId;
            return np;
        });
        setAvailable(prev => prev.filter(id => id !== blockId));
    }, [placed]);

    const removeBlock = useCallback((layerIdx: number) => {
        if (showResult) return;
        const blockId = placed[layerIdx];
        if (!blockId) return;

        setPlaced(prev => {
            const np = [...prev];
            np[layerIdx] = null;
            return np;
        });
        setAvailable(prev => [...prev, blockId]);
    }, [placed, showResult]);

    const handleSubmit = () => {
        if (placed.some(p => p === null)) return;
        setShowResult(true);
        const isCorrect = placed.every((id, i) => id === correctOrder[i]);
        if (isCorrect && onComplete) setTimeout(onComplete, 2500);
    };

    const handleReset = () => {
        setPlaced(Array(layerNames.length).fill(null));
        setAvailable(blocks.map(b => b.id));
        setShowResult(false);
    };

    const isAllPlaced = placed.every(p => p !== null);

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Blocks size={20} className="text-[var(--accent-teal)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>

            {/* Architecture Stack */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">架构层级（从上到下）</div>
                <div className="space-y-2">
                    {layerNames.map((name, i) => {
                        const blockId = placed[i];
                        const block = blocks.find(b => b.id === blockId);
                        const isCorrect = showResult && blockId === correctOrder[i];
                        const isWrong = showResult && blockId !== correctOrder[i];

                        return (
                            <motion.div
                                key={i}
                                onClick={() => removeBlock(i)}
                                className={`p-3 rounded-lg border transition-all min-h-[48px] flex items-center justify-between ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/10' :
                                    isWrong ? 'border-red-500/30 bg-red-500/10' :
                                        block ? 'border-[var(--accent-teal)]/30 bg-[var(--accent-teal-dim)] cursor-pointer' :
                                            'border-dashed border-[var(--border-hover)] bg-white/[0.01]'
                                    }`}
                                layout
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider w-12">
                                        L{i + 1}
                                    </span>
                                    {block ? (
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{block.label}</span>
                                    ) : (
                                        <span className="text-xs text-[var(--text-muted)]">点击下方积木块放置 → {name}</span>
                                    )}
                                </div>
                                {showResult && (
                                    isCorrect
                                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                                        : isWrong
                                            ? <span className="text-xs text-red-400">应为: {blocks.find(b => b.id === correctOrder[i])?.label}</span>
                                            : null
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Available Blocks */}
            {available.length > 0 && (
                <div className="mb-4">
                    <div className="text-xs text-[var(--text-muted)] mb-2">可用积木块（点击放置）</div>
                    <div className="flex flex-wrap gap-2">
                        {available.map(id => {
                            const block = blocks.find(b => b.id === id)!;
                            return (
                                <motion.button
                                    key={id}
                                    onClick={() => placeBlock(id)}
                                    className="px-3 py-2 rounded-lg glass glass-hover text-sm text-[var(--text-primary)] cursor-pointer"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {block.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            {!showResult ? (
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!isAllPlaced}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                            ${isAllPlaced ? 'bg-[var(--accent-teal)] text-white hover:brightness-110' : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'}`}
                        whileTap={{ scale: 0.98 }}
                    >
                        确认架构 <ArrowRight size={16} />
                    </motion.button>
                    <button onClick={handleReset} className="px-4 py-3 rounded-xl glass glass-hover text-sm text-[var(--text-secondary)] cursor-pointer">
                        <RotateCcw size={16} />
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className={`p-4 rounded-xl ${placed.every((id, i) => id === correctOrder[i])
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-amber-500/10 border border-amber-500/20'
                        }`}>
                        <div className="font-semibold text-sm mb-1">
                            {placed.every((id, i) => id === correctOrder[i]) ? '架构正确！' : '需要调整'}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            五层架构从上到下：需求层 → UI 层 → API 层 → Skills 层 → MCP 层。理解层级关系是搭建 AI 系统的第一步。
                        </div>
                    </div>
                    <button onClick={handleReset} className="w-full py-3 rounded-xl glass glass-hover text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2 cursor-pointer">
                        <RotateCcw size={14} /> 重新搭建
                    </button>
                </motion.div>
            )}
        </div>
    );
}
