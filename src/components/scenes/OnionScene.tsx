'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 洋葱剥皮器 ──
function OnionPeelerGame({ onComplete }: { onComplete: () => void }) {
    const layers = [
        { text: '电池太贵了！电动车做不了', color: '#f87171', label: '表层假设' },
        { text: '电池为什么贵？因为大家都这么说', color: '#fb923c', label: '从众思维' },
        { text: '电池的原材料是什么？镍、钴、锂、碳', color: '#fbbf24', label: '回到原料' },
        { text: '这些原料在交易所多少钱？', color: '#34d399', label: '查实际数据' },
        { text: '原料成本加起来只要 80 美元/kWh！', color: '#60a5fa', label: '💡 第一性原理' },
    ];
    const [peeled, setPeeled] = useState(0);

    const handlePeel = () => {
        if (peeled < layers.length) {
            setPeeled(p => p + 1);
            if (peeled === layers.length - 1) setTimeout(onComplete, 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 洋葱剥皮器</h3>
            <p className="text-gray-400 text-sm mb-4">一层层剥开假设，找到真相</p>

            <div className="relative flex flex-col items-center mb-4">
                {/* 洋葱层级 */}
                {layers.map((l, i) => (
                    <motion.div key={i}
                        initial={{ scaleX: 1 }}
                        animate={{
                            scaleX: i < peeled ? 0 : 1,
                            opacity: i < peeled ? 0 : i === peeled ? 1 : 0.3,
                            height: i < peeled ? 0 : 'auto',
                        }}
                        className="w-full mb-1 overflow-hidden"
                    >
                        <div className="p-3 rounded-lg text-sm font-bold text-center" style={{ backgroundColor: `${l.color}20`, borderLeft: `4px solid ${l.color}` }}>
                            <div className="text-xs opacity-60 mb-1">{l.label}</div>
                            <div className="text-white">{l.text}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 已剥开的层 */}
            {peeled > 0 && (
                <div className="mb-3 space-y-1">
                    <div className="text-xs text-gray-500">已剥开的思维层：</div>
                    {layers.slice(0, peeled).map((l, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${l.color}10`, color: l.color }}
                        >
                            ✓ {l.label}: {l.text}
                        </motion.div>
                    ))}
                </div>
            )}

            {peeled < layers.length ? (
                <button onClick={handlePeel} className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-bold">
                    🧅 剥开第 {peeled + 1} 层
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 你找到了第一性原理！从原材料成本出发，电池其实可以很便宜。这就是马斯克的思维方式。
                </div>
            )}
        </motion.div>
    );
}

// ── 互动2: 类比 vs 原理 排序 ──
function AnalogyVsPrincipleGame({ onComplete }: { onComplete: () => void }) {
    const items = [
        { text: '别人都说做不了', type: 'analogy', emoji: '🐑' },
        { text: '从未有人这样做过', type: 'analogy', emoji: '🐑' },
        { text: '原材料实际多少钱？', type: 'principle', emoji: '🔬' },
        { text: '物理定律允许这件事吗？', type: 'principle', emoji: '🔬' },
        { text: '专家说这不现实', type: 'analogy', emoji: '🐑' },
        { text: '用户真正需要什么？', type: 'principle', emoji: '🔬' },
    ];
    const [categorized, setCategorized] = useState<Record<number, string>>({});
    const [checked, setChecked] = useState(false);

    const handleCategorize = (i: number, type: string) => {
        setCategorized(prev => ({ ...prev, [i]: type }));
    };

    const handleCheck = () => {
        setChecked(true);
        const correct = items.every((item, i) => categorized[i] === item.type);
        if (correct || Object.keys(categorized).length === items.length) {
            setTimeout(onComplete, 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 类比思维 vs 第一性原理</h3>
            <p className="text-gray-400 text-sm mb-4">每句话属于「类比思维🐑」还是「第一性原理🔬」？</p>

            <div className="space-y-2 mb-4">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 text-sm text-white bg-white/5 px-3 py-2 rounded-lg">{item.text}</div>
                        <div className="flex gap-1">
                            <button onClick={() => handleCategorize(i, 'analogy')} disabled={checked}
                                className={`px-2 py-1 rounded text-xs font-bold transition-all ${categorized[i] === 'analogy' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                                🐑
                            </button>
                            <button onClick={() => handleCategorize(i, 'principle')} disabled={checked}
                                className={`px-2 py-1 rounded text-xs font-bold transition-all ${categorized[i] === 'principle' ? 'bg-cyan-500/30 text-cyan-400' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                                🔬
                            </button>
                        </div>
                        {checked && (
                            <span className="text-sm">{categorized[i] === item.type ? '✅' : '❌'}</span>
                        )}
                    </div>
                ))}
            </div>

            {!checked ? (
                <button onClick={handleCheck} disabled={Object.keys(categorized).length < items.length}
                    className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold disabled:opacity-30">
                    检查答案 📊
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 🐑类比 = "别人都这么做"；🔬第一性 = "事情本身是怎样的"
                </div>
            )}
        </motion.div>
    );
}

// ── 互动3: 五问法排序 ──
function FiveWhysGame({ onComplete }: { onComplete: () => void }) {
    const steps = [
        { question: '为什么食堂排队这么长？', answer: '因为买饭的人很多' },
        { question: '为什么同时来了这么多人？', answer: '因为所有人下课时间一样' },
        { question: '为什么不分时段下课？', answer: '因为课表安排是固定的' },
        { question: '为什么课表不能灵活调整？', answer: '因为从没人提过这个方案' },
        { question: '💡 终极解法', answer: '向学校建议「错峰下课」，分3批下课，排队时间减少2/3！' },
    ];
    const [revealed, setRevealed] = useState(0);

    const handleReveal = () => {
        if (revealed < steps.length) {
            setRevealed(r => r + 1);
            if (revealed === steps.length - 1) setTimeout(onComplete, 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 五问法</h3>
            <p className="text-gray-400 text-sm mb-4">连续追问5个「为什么」，找到根本原因</p>

            <div className="space-y-2 mb-4">
                {steps.map((s, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: i < revealed ? 1 : 0.2, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-lg ${i < revealed ? 'bg-white/5 border border-white/10' : 'bg-black/20 blur-[2px]'}`}
                    >
                        <div className="text-xs text-cyan-400 font-bold">第 {i + 1} 问：{s.question}</div>
                        {i < revealed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className={`text-sm mt-1 ${i === steps.length - 1 ? 'text-green-400 font-bold' : 'text-gray-400'}`}
                            >
                                → {s.answer}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {revealed < steps.length ? (
                <button onClick={handleReveal} className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                    追问第 {revealed + 1} 个「为什么」🔍
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 5 个为什么 → 从「排队太长」到「错峰下课」！这就是第一性原理的力量。
                </div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function OnionScene() {
    const [activeGame, setActiveGame] = useState<'onion' | 'analogy' | 'fivewhy' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#0a1a2e] to-[#1a1a0a] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'onion' && <OnionPeelerGame key="o" onComplete={() => handleComplete('onion')} />}
                {activeGame === 'analogy' && <AnalogyVsPrincipleGame key="a" onComplete={() => handleComplete('analogy')} />}
                {activeGame === 'fivewhy' && <FiveWhysGame key="f" onComplete={() => handleComplete('fivewhy')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">🧅 第一性原理 · 互动环节</h2>
                        {[
                            { key: 'onion' as const, icon: '🧅', title: '洋葱剥皮器', desc: '层层剥开假设找真相' },
                            { key: 'analogy' as const, icon: '⚖️', title: '类比 vs 原理', desc: '分辨两种思维方式' },
                            { key: 'fivewhy' as const, icon: '❓', title: '五问法', desc: '连续追问找到根本原因' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-purple-500/30'}`}>
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
