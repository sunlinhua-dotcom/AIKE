'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 洋葱剥皮器 ──
function OnionPeelerGame() {
    const layers = [
        { text: '电池太贵了', color: 'border-red-500/30', emoji: '🧅' },
        { text: '为什么贵？制造成本高', color: 'border-orange-500/30', emoji: '🧅' },
        { text: '为什么制造成本高？用了贵的工艺', color: 'border-yellow-500/30', emoji: '🧅' },
        { text: '为什么用贵工艺？因为大家都这么做', color: 'border-green-500/30', emoji: '🧅' },
        { text: '💎 核心：原材料其实很便宜！换个方式就能降低成本', color: 'border-cyan-500/30', emoji: '💎' },
    ];
    const [peeled, setPeeled] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🧅 洋葱剥皮器</h3>
            <p className="text-gray-400 text-sm mb-4">一层一层剥，找到最核心的真相</p>
            <div className="space-y-2 mb-4">
                {layers.slice(0, peeled + 1).map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-xl border ${l.color} ${i === peeled ? 'bg-white/10' : 'bg-white/5'}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{l.emoji}</span>
                            <div>
                                <div className="text-xs text-gray-400">第{i + 1}层</div>
                                <div className="text-white text-sm">{l.text}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {peeled < layers.length - 1 ? (
                <button onClick={() => setPeeled(p => p + 1)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    🧅 继续剥！（{peeled + 1}/{layers.length}）
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 找到核心了！第一性原理就是剥掉所有假设，回到最基本的事实。
                </div>
            )}
        </>
    );
}

// ── 互动2: 类比 vs 原理排序 ──
function AnalogyVsPrincipleGame() {
    const items = [
        { text: '\"电池一直很贵，所以以后也会很贵\"', type: 'analogy', label: '类比思维' },
        { text: '\"大家都说不可能，所以一定不可能\"', type: 'analogy', label: '类比思维' },
        { text: '\"原材料成本只要1/10，是制造方法的问题\"', type: 'principle', label: '第一性原理' },
        { text: '\"别人都用这个方法，我也用\"', type: 'analogy', label: '类比思维' },
        { text: '\"回到物理定律本身，看什么是可能的\"', type: 'principle', label: '第一性原理' },
    ];
    const [categorized, setCategorized] = useState<Record<number, string>>({});

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">⚖️ 类比 vs 原理</h3>
            <p className="text-gray-400 text-sm mb-4">判断每句话是「类比思维」还是「第一性原理」</p>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white text-sm mb-2">{item.text}</div>
                        {categorized[i] ? (
                            <span className={`text-xs px-2 py-1 rounded ${categorized[i] === item.type ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {categorized[i] === item.type ? `✅ ${item.label}` : `❌ 应该是 ${item.label}`}
                            </span>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setCategorized(prev => ({ ...prev, [i]: 'analogy' }))}
                                    className="px-2 py-1 text-xs bg-orange-500/20 rounded text-orange-400">类比</button>
                                <button onClick={() => setCategorized(prev => ({ ...prev, [i]: 'principle' }))}
                                    className="px-2 py-1 text-xs bg-cyan-500/20 rounded text-cyan-400">原理</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {Object.keys(categorized).length === items.length && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🧠 类比思维跟着别人走，第一性原理从零开始想。两种都有用，但遇到难题时，试试第一性原理！
                </div>
            )}
        </>
    );
}

// ── 互动3: 五问法 ──
function FiveWhysGame() {
    const chain = [
        { q: '学校食堂排队太长？', a: '因为只有2个窗口' },
        { q: '为什么只有2个窗口？', a: '因为空间有限' },
        { q: '为什么空间有限？', a: '因为食堂设计时没考虑高峰期' },
        { q: '那怎么解决？', a: '💡 错峰用餐！不需要更多窗口，只需要分散高峰' },
    ];
    const [revealed, setRevealed] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">❓ 五问法</h3>
            <p className="text-gray-400 text-sm mb-4">连续追问，找到问题的根源</p>
            <div className="space-y-2 mb-4">
                {chain.slice(0, revealed + 1).map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 text-sm font-bold mb-1">🤔 {c.q}</div>
                        {i < revealed && <div className="p-2 bg-white/5 rounded-lg text-white text-sm ml-4">→ {c.a}</div>}
                    </motion.div>
                ))}
            </div>
            {revealed < chain.length - 1 ? (
                <button onClick={() => setRevealed(r => r + 1)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    为什么？继续追问 🔍
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-xs text-green-400 border border-green-500/20">
                    🎯 通过连续追问，我们不需要花钱改造食堂，只需要错峰用餐就能解决问题！这就是第一性原理的力量。
                </div>
            )}
        </>
    );
}

export default function OnionScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'analogy' ? <AnalogyVsPrincipleGame /> :
                    game === 'whys' ? <FiveWhysGame /> :
                        <OnionPeelerGame />}
            </motion.div>
        </div>
    );
}
