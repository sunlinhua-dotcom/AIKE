'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Send, Star, RotateCcw, CheckCircle2 } from 'lucide-react';

interface PromptExample {
    label: string;
    bad: string;
    good: string;
    explanation: string;
}

interface PromptWorkshopProps {
    scenario: {
        title: string;
        role: string;           // "你是王总，食品加工厂老板"
        businessTask: string;   // "你需要 AI 帮你..."
        hints: string[];
        examples: PromptExample[];
        scoringCriteria: string[];
    };
    onComplete?: () => void;
}

export default function PromptWorkshop({ scenario, onComplete }: PromptWorkshopProps) {
    const [userPrompt, setUserPrompt] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [showExample, setShowExample] = useState(false);

    const evaluatePrompt = useCallback((prompt: string) => {
        let s = 0;
        const fb: string[] = [];

        // 评分逻辑：基于关键词检测
        if (prompt.length > 50) { s += 20; fb.push('✓ 足够详细的描述'); }
        else { fb.push('✗ 描述太简短，缺乏细节'); }

        if (/角色|你是|作为|担任/.test(prompt)) { s += 20; fb.push('✓ 指定了 AI 角色'); }
        else { fb.push('✗ 未指定 AI 角色'); }

        if (/格式|表格|列表|步骤|json/i.test(prompt)) { s += 20; fb.push('✓ 指定了输出格式'); }
        else { fb.push('✗ 未指定输出格式'); }

        if (/背景|场景|上下文|目前|现在/.test(prompt)) { s += 20; fb.push('✓ 提供了业务背景'); }
        else { fb.push('✗ 缺少业务背景信息'); }

        if (/不要|避免|限制|要求|必须/.test(prompt)) { s += 20; fb.push('✓ 设定了约束条件'); }
        else { fb.push('✗ 未设定约束条件'); }

        return { score: s, feedback: fb };
    }, []);

    const handleSubmit = useCallback(() => {
        if (!userPrompt.trim()) return;
        const result = evaluatePrompt(userPrompt);
        setScore(result.score);
        setFeedback(result.feedback);
        setSubmitted(true);
        if (result.score >= 60 && onComplete) {
            setTimeout(onComplete, 3000);
        }
    }, [userPrompt, evaluatePrompt, onComplete]);

    const handleReset = () => {
        setUserPrompt('');
        setSubmitted(false);
        setScore(0);
        setFeedback([]);
        setShowExample(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <PenTool size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                        {scenario.title}
                    </h3>
                </div>
            </div>

            {/* Business Context Card */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="text-xs text-[var(--accent-gold)] uppercase tracking-wider mb-2">商业场景</div>
                <p className="text-sm text-[var(--text-primary)] mb-2">{scenario.role}</p>
                <p className="text-sm text-[var(--text-secondary)]">{scenario.businessTask}</p>
            </div>

            {/* Hints */}
            <div className="flex flex-wrap gap-2 mb-4">
                {scenario.hints.map((hint, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {hint}
                    </span>
                ))}
            </div>

            {/* Prompt Input */}
            <div className="relative mb-4">
                <textarea
                    value={userPrompt}
                    onChange={e => setUserPrompt(e.target.value)}
                    disabled={submitted}
                    placeholder="在这里写你的 Prompt..."
                    className="w-full h-32 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]
                        text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:outline-none focus:border-[var(--accent-gold)]/30 transition-colors resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-[var(--text-muted)]">
                    {userPrompt.length} 字
                </div>
            </div>

            {/* Action Buttons */}
            {!submitted ? (
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!userPrompt.trim()}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                            ${userPrompt.trim()
                                ? 'bg-[var(--accent-gold)] text-black hover:brightness-110'
                                : 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'}
                        `}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Send size={16} /> 提交评分
                    </motion.button>
                    <button
                        onClick={() => setShowExample(!showExample)}
                        className="px-4 py-3 rounded-xl glass glass-hover text-sm text-[var(--text-secondary)] cursor-pointer transition-all"
                    >
                        {showExample ? '隐藏' : '看示例'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Score */}
                    <div className="glass rounded-xl p-5 text-center">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">提示词评分</div>
                        <div className={`text-4xl font-bold ${score >= 80 ? 'text-emerald-400' :
                                score >= 60 ? 'text-[var(--accent-gold)]' :
                                    'text-red-400'
                            }`} style={{ fontFamily: 'var(--font-heading)' }}>
                            {score}
                        </div>
                        <div className="flex justify-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} className={i <= score / 20 ? 'text-[var(--accent-gold)] fill-[var(--accent-gold)]' : 'text-white/10'} />
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="glass rounded-xl p-4 space-y-2">
                        {feedback.map((fb, i) => (
                            <div key={i} className={`text-sm flex items-center gap-2 ${fb.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {fb.startsWith('✓')
                                    ? <CheckCircle2 size={14} />
                                    : <span className="w-3.5 h-3.5 rounded-full border border-red-400 flex items-center justify-center text-[10px]">✗</span>
                                }
                                {fb.slice(2)}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleReset}
                        className="w-full py-3 rounded-xl glass glass-hover text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RotateCcw size={14} /> 重新尝试
                    </button>
                </div>
            )}

            {/* Example Panel */}
            <AnimatePresence>
                {showExample && scenario.examples.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3 overflow-hidden"
                    >
                        {scenario.examples.map((ex, i) => (
                            <div key={i} className="glass rounded-xl p-4">
                                <div className="text-xs font-semibold text-[var(--text-primary)] mb-3">{ex.label}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                        <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">差的 Prompt</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{ex.bad}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">好的 Prompt</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{ex.good}</div>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-[var(--text-muted)]">{ex.explanation}</div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
