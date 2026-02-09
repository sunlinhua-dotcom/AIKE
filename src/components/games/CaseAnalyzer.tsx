'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface CaseAnalyzerProps {
    caseStudy: {
        title: string;
        company: string;
        industry: string;
        problem: string;
        data: { label: string; value: string }[];
        question: string;
        options: { id: string; text: string; isCorrect: boolean; explanation: string }[];
    };
    onComplete?: () => void;
}

export default function CaseAnalyzer({ caseStudy, onComplete }: CaseAnalyzerProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const selectedOption = caseStudy.options.find(o => o.id === selectedId);
    const isCorrect = selectedOption?.isCorrect ?? false;

    const handleSubmit = () => {
        if (!selectedId) return;
        setSubmitted(true);
        if (isCorrect && onComplete) setTimeout(onComplete, 2500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <FileSearch size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {caseStudy.title}
                    </h3>
                </div>
            </div>

            {/* Company Info */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="text-xs text-[var(--accent-gold)] uppercase tracking-wider">{caseStudy.industry}</div>
                    <span className="w-px h-3 bg-white/10" />
                    <div className="text-sm font-semibold text-[var(--text-primary)]">{caseStudy.company}</div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{caseStudy.problem}</p>

                {/* Data Points */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {caseStudy.data.map((d, i) => (
                        <div key={i} className="bg-white/[0.02] rounded-lg p-2 text-center">
                            <div className="text-[10px] text-[var(--text-muted)]">{d.label}</div>
                            <div className="text-sm font-semibold text-[var(--text-primary)]">{d.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Question */}
            <div className="text-sm font-medium text-[var(--text-primary)] mb-4">{caseStudy.question}</div>

            {/* Options */}
            <div className="space-y-2 mb-4">
                {caseStudy.options.map(opt => {
                    const isSelected = selectedId === opt.id;
                    const showCorrectness = submitted && isSelected;

                    return (
                        <motion.div
                            key={opt.id}
                            onClick={() => !submitted && setSelectedId(opt.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all border ${showCorrectness
                                    ? opt.isCorrect
                                        ? 'border-emerald-500/30 bg-emerald-500/10'
                                        : 'border-red-500/30 bg-red-500/10'
                                    : isSelected
                                        ? 'border-[var(--accent-gold)]/30 bg-[var(--accent-gold-dim)]'
                                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]'
                                }`}
                            whileHover={!submitted ? { x: 4 } : {}}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${isSelected ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]' : 'border-[var(--border-hover)]'
                                    }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                </div>
                                <div className="text-sm text-[var(--text-primary)]">{opt.text}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Submit / Result */}
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.button
                        key="submit-btn"
                        onClick={handleSubmit}
                        disabled={!selectedId}
                        className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                            ${selectedId ? 'bg-[var(--accent-gold)] text-black hover:brightness-110' : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'}`}
                        whileTap={{ scale: 0.98 }}
                    >
                        提交分析 <ArrowRight size={16} />
                    </motion.button>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-start gap-3 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
                    >
                        {isCorrect ? <CheckCircle2 size={20} className="text-emerald-500 mt-0.5" /> : <XCircle size={20} className="text-red-500 mt-0.5" />}
                        <div>
                            <div className="font-semibold text-sm mb-1">{isCorrect ? '分析正确' : '需要重新思考'}</div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                {selectedOption?.explanation}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
