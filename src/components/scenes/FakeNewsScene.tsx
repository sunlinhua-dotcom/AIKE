'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 真假新闻鉴定器 ──
function FakeNewsDetector() {
    const news = [
        { text: 'NASA宣布在月球背面发现外星基地', fake: true, reason: '来源不可靠，无官方链接' },
        { text: '研究表明每天运动30分钟有助于提高注意力', fake: false, reason: '可通过学术论文验证' },
        { text: 'AI已经有了自我意识，科学家非常恐惧', fake: true, reason: '标题党，夸大事实' },
        { text: '2024年全球平均气温创历史新高', fake: false, reason: 'WHO等权威机构有数据支持' },
    ];
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, boolean>>({});
    const answered = currentIdx in answers;

    const handleSwipe = (isFake: boolean) => {
        if (answered) return;
        setAnswers(prev => ({ ...prev, [currentIdx]: isFake }));
    };

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🔍 真假新闻鉴定</h3>
            <div className="flex gap-1 mb-3">
                {news.map((_, i) => (
                    <button key={i} onClick={() => setCurrentIdx(i)}
                        className={`flex-1 py-1 rounded text-xs font-bold ${currentIdx === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {i + 1} {i in answers && (answers[i] === news[i].fake ? '✓' : '✗')}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-3">
                <div className="text-white text-sm font-bold mb-2">📰 {news[currentIdx].text}</div>
                {answered && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs mt-2">
                        <span className={answers[currentIdx] === news[currentIdx].fake ? 'text-green-400' : 'text-red-400'}>
                            {answers[currentIdx] === news[currentIdx].fake ? '✅ 判断正确！' : '❌ 判断错误'}
                        </span>
                        <div className="text-gray-500 mt-1">分析: {news[currentIdx].reason}</div>
                    </motion.div>
                )}
            </div>
            {!answered && (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleSwipe(false)} className="py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold text-sm">✅ 真新闻</button>
                    <button onClick={() => handleSwipe(true)} className="py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-bold text-sm">❌ 假新闻</button>
                </div>
            )}
        </>
    );
}

// ── 互动2: 信息茧房模拟器 ──
function FilterBubbleGame() {
    const [shells, setShells] = useState(4);
    const topics = ['科技🔬', '体育⚽', '艺术🎨', '自然🌿'];
    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🧪 信息茧房模拟器</h3>
            <p className="text-gray-400 text-sm mb-4">点击破壳按钮，打破信息泡泡</p>
            <div className="relative h-48 flex items-center justify-center mb-3">
                {Array(shells).fill(0).map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full border-2 border-dashed border-purple-500/30"
                        style={{ width: `${(i + 1) * 60}px`, height: `${(i + 1) * 60}px` }}
                        animate={{ opacity: 0.3 + i * 0.15, scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                ))}
                <div className="text-center z-10">
                    <div className="text-3xl">{shells > 2 ? '😶' : shells > 0 ? '😮' : '🌍'}</div>
                    <div className="text-xs text-gray-400 mt-1">{shells > 0 ? `还有${shells}层茧房` : '茧房已破！看到全世界'}</div>
                </div>
            </div>
            {shells > 0 ? (
                <button onClick={() => setShells(s => s - 1)}
                    className="w-full py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-sm">
                    💥 破壳！接触新领域: {topics[4 - shells]}
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 茧房全部打破！多接触不同领域的信息，才能避免偏见。你看到的不是全世界，只是算法选择给你看的。
                </div>
            )}
        </>
    );
}

// ── 互动3: 批判性三问法 ──
function CriticalThinkingGame() {
    const claim = '一位网红说：每天喝3杯咖啡，一个月就能瘦10斤！';
    const questions = [
        { q: '① 谁说的？', input: '来源', hint: '一个卖咖啡的网红，有利益冲突' },
        { q: '② 证据是什么？', input: '证据', hint: '没有引用任何科学论文或实验数据' },
        { q: '③ 他想让我做什么？', input: '目的', hint: '想让你买他的咖啡产品' },
    ];
    const [revealed, setRevealed] = useState<Set<number>>(new Set());

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🧠 批判性三问法</h3>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-4">
                <div className="text-yellow-400 text-xs font-bold mb-1">🔔 看到这条信息:</div>
                <div className="text-white text-sm">{claim}</div>
            </div>
            <div className="space-y-3">
                {questions.map((q, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-bold">{q.q}</span>
                            {!revealed.has(i) && (
                                <button onClick={() => setRevealed(prev => new Set(prev).add(i))}
                                    className="px-2 py-1 text-xs bg-cyan-500/20 rounded text-cyan-400">揭晓</button>
                            )}
                        </div>
                        {revealed.has(i) && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                className="p-2 bg-white/5 rounded text-xs text-gray-400">💡 {q.hint}</motion.div>
                        )}
                    </div>
                ))}
            </div>
            {revealed.size >= 3 && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎯 三问法揭穿了这条虚假信息。记住：看到任何信息先问这三个问题！
                </div>
            )}
        </>
    );
}

export default function FakeNewsScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'bubble' ? <FilterBubbleGame /> :
                    game === 'critical' ? <CriticalThinkingGame /> :
                        <FakeNewsDetector />}
            </motion.div>
        </div>
    );
}
