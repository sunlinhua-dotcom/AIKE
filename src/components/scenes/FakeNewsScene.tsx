'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 真假新闻鉴定器 ──
function FakeNewsDetector({ onComplete }: { onComplete: () => void }) {
    const news = [
        { text: '科学家发现：每天吃10个苹果可以治疗癌症', fake: true, reason: '没有权威来源，夸大了食物的药用效果。这是典型的健康谣言。' },
        { text: '2024年全球AI产业市场规模突破5000亿美元', fake: false, reason: '来自多家权威市场研究机构的公开数据，有可靠来源。' },
        { text: '震惊！90后小伙月入100万的秘密竟然是...', fake: true, reason: '标题党，用"震惊"吸引点击。没有具体来源，目的是诱导你点击广告。' },
        { text: 'NASA确认2024年12月将有一颗小行星飞越地球', fake: false, reason: '来源为NASA官方，有明确时间和数据支持。' },
        { text: '转发这条消息给10个人，你的运气会变好', fake: true, reason: '无任何科学依据，利用人的迷信心理传播。' },
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [userChoice, setUserChoice] = useState<boolean | null>(null);

    const handleSwipe = (isFake: boolean) => {
        const correct = isFake === news[current].fake;
        setUserChoice(isFake);
        setAnswered(true);
        if (correct) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (current < news.length - 1) {
            setCurrent(c => c + 1);
            setAnswered(false);
            setUserChoice(null);
        } else {
            onComplete();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 真假新闻鉴定器（{current + 1}/{news.length}）</h3>
            <div className="text-xs text-gray-500 mb-3">准确率: {current > 0 ? Math.round(score / current * 100) : 0}%</div>

            <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4"
            >
                <div className="text-white text-base font-bold leading-relaxed">📰 {news[current].text}</div>
            </motion.div>

            {!answered ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={() => handleSwipe(true)}
                        className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all">
                        ← 假新闻 🚫
                    </button>
                    <button onClick={() => handleSwipe(false)}
                        className="py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold hover:bg-green-500/20 transition-all">
                        真新闻 ✅ →
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className={`p-3 rounded-lg mb-3 ${userChoice === news[current].fake ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {userChoice === news[current].fake ? '✅ 判断正确！' : '❌ 判断错误！'}
                        <span className="ml-2">{news[current].fake ? '（这确实是假新闻）' : '（这是真实信息）'}</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400 mb-3">
                        💡 {news[current].reason}
                    </div>
                    <button onClick={handleNext} className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                        {current < news.length - 1 ? '下一条 →' : `鉴定完成！准确率 ${Math.round(score / news.length * 100)}%`}
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}

// ── 互动2: 信息茧房模拟器 ──
function FilterBubbleGame({ onComplete }: { onComplete: () => void }) {
    const [shells, setShells] = useState(3);

    const breakShell = () => {
        if (shells > 0) setShells(s => s - 1);
        if (shells === 1) setTimeout(onComplete, 2000);
    };

    const sizes = [150, 220, 300, 400]; // 从小到大
    const sizeIndex = 3 - shells;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 信息茧房模拟器</h3>
            <p className="text-gray-400 text-sm mb-4">点击「破壳」打破你的信息茧房</p>

            <div className="relative h-64 flex items-center justify-center mb-4">
                {/* 背景世界 */}
                <div className="absolute inset-0 grid grid-cols-5 gap-1 p-2 opacity-30">
                    {['🌍', '📚', '🔬', '🎨', '🏔️', '🎵', '🌌', '⚽', '🧬', '🚀', '🎭', '📊', '🌊', '🏛️', '🌿', '🎪', '💡', '🔭', '🧮', '🎯'].map((e, i) => (
                        <div key={i} className="text-center text-lg">{e}</div>
                    ))}
                </div>

                {/* 茧房圆圈 */}
                <motion.div
                    className="relative rounded-full border-2 border-dashed border-purple-500/50 flex items-center justify-center bg-purple-500/5"
                    animate={{ width: sizes[sizeIndex], height: sizes[sizeIndex] }}
                    transition={{ duration: 0.8, type: 'spring' }}
                >
                    <div className="text-center">
                        <div className="text-3xl mb-1">🧒</div>
                        <div className="text-xs text-gray-400">
                            {shells === 3 ? '你的\"世界\"' : shells === 2 ? '稍大一点了' : shells === 1 ? '快了！' : '真实的世界！'}
                        </div>
                    </div>
                </motion.div>
            </div>

            {shells > 0 ? (
                <button onClick={breakShell}
                    className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-bold">
                    💥 破壳！（剩余 {shells} 层）
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 茧房已打破！保持开放的心态，主动接触不同的信息源！
                </div>
            )}
        </motion.div>
    );
}

// ── 互动3: 批判性三问法 ──
function CriticalThinkingGame({ onComplete }: { onComplete: () => void }) {
    const suspiciousArticle = '某知名营养师声称：每天喝3杯特制能量果汁可以提高智商30%，已有上万人受益。限时优惠只要998元/月。';
    const [answers, setAnswers] = useState(['', '', '']);
    const [graded, setGraded] = useState(false);

    const idealAnswers = [
        '「某知名营养师」是谁？有没有医学资质？无法验证。',
        '没有引用任何科学研究或数据来源，「上万人」无具体统计。',
        '目的是让你花998元买产品。这是商业推销，不是科普。',
    ];

    const handleGrade = () => {
        setGraded(true);
        const filled = answers.filter(a => a.trim().length > 5).length;
        if (filled >= 2) setTimeout(onComplete, 3000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 批判性三问法</h3>

            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                <div className="text-xs text-yellow-400 mb-1">📰 可疑信息：</div>
                <div className="text-white text-sm font-bold">{suspiciousArticle}</div>
            </div>

            {['① 谁说的？（来源可靠吗？）', '② 证据是什么？（有数据支持吗？）', '③ 他想让我做什么？（背后目的？）'].map((q, i) => (
                <div key={i} className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">{q}</div>
                    <input type="text" value={answers[i]} maxLength={100}
                        onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }}
                        disabled={graded}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50 placeholder:text-gray-600"
                        placeholder="你的分析..."
                    />
                    {graded && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-cyan-400 mt-1">
                            参考答案: {idealAnswers[i]}
                        </motion.div>
                    )}
                </div>
            ))}

            {!graded && (
                <button onClick={handleGrade} disabled={answers.every(a => a.trim().length === 0)}
                    className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold disabled:opacity-30">
                    提交分析 📊
                </button>
            )}

            {graded && (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold mt-3">
                    🛡️ 你的信息免疫力正在增强！养成「三问」习惯，假信息就骗不了你。
                </div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function FakeNewsScene() {
    const [activeGame, setActiveGame] = useState<'detector' | 'bubble' | 'critical' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a0a1e] to-[#0a1a2e] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'detector' && <FakeNewsDetector key="d" onComplete={() => handleComplete('detector')} />}
                {activeGame === 'bubble' && <FilterBubbleGame key="b" onComplete={() => handleComplete('bubble')} />}
                {activeGame === 'critical' && <CriticalThinkingGame key="c" onComplete={() => handleComplete('critical')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2">🛡️ 信息免疫力 · 互动环节</h2>
                        {[
                            { key: 'detector' as const, icon: '📰', title: '真假新闻鉴定', desc: '5条新闻，你能分辨真假吗？' },
                            { key: 'bubble' as const, icon: '🫧', title: '信息茧房模拟', desc: '打破包围你的信息气泡' },
                            { key: 'critical' as const, icon: '🔍', title: '批判性三问法', desc: '用三个问题拆穿可疑信息' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-green-500/30'}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{g.icon}</span>
                                    <div>
                                        <div className="font-bold text-white">{g.title} {completed.has(g.key) && <span className="text-green-400 text-sm">✓</span>}</div>
                                        <div className="text-gray-500 text-sm">{g.desc}</div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
