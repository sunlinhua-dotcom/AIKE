'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 价值定价器 ──
function PricingGame({ onComplete }: { onComplete: () => void }) {
    const items = [
        { name: '☕ 咖啡豆（原料）', realPrice: 3, hint: '考虑这只是原材料' },
        { name: '☕ 星巴克咖啡', realPrice: 38, hint: '品牌 + 体验 + 环境' },
        { name: '📸 星巴克品牌体验照', realPrice: 0, hint: '社交货币，无法用钱衡量' },
    ];
    const [guesses, setGuesses] = useState<number[]>([10, 20, 10]);
    const [revealed, setRevealed] = useState(false);

    const handleReveal = () => {
        setRevealed(true);
        setTimeout(onComplete, 3000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-4">🎮 价值定价器</h3>
            <p className="text-gray-400 text-sm mb-4">拖动滑块，猜猜每个物品值多少钱？</p>
            {items.map((item, i) => (
                <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{item.name}</span>
                        <span className="text-cyan-400 font-mono">¥{guesses[i]}</span>
                    </div>
                    <input
                        type="range" min={0} max={100} value={guesses[i]}
                        disabled={revealed}
                        onChange={e => {
                            const next = [...guesses];
                            next[i] = parseInt(e.target.value);
                            setGuesses(next);
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    {revealed && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mt-1 text-sm"
                        >
                            <span className={Math.abs(guesses[i] - item.realPrice) < 10 ? 'text-green-400' : 'text-yellow-400'}>
                                {Math.abs(guesses[i] - item.realPrice) < 10 ? '✅ 很接近！' : '❌ 差距不小！'}
                            </span>
                            <span className="text-gray-500">真实价值: ¥{item.realPrice} — {item.hint}</span>
                        </motion.div>
                    )}
                </div>
            ))}
            {!revealed && (
                <button onClick={handleReveal} className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold transition-all">
                    揭晓答案 ✨
                </button>
            )}
        </motion.div>
    );
}

// ── 互动2: 消费者 vs 生产者分类器 ──
function ClassifierGame({ onComplete }: { onComplete: () => void }) {
    const allCards = [
        { text: '🎮 打游戏', answer: 'consumer' },
        { text: '💻 做游戏', answer: 'producer' },
        { text: '📱 刷视频', answer: 'consumer' },
        { text: '🎬 拍视频', answer: 'producer' },
        { text: '👕 买衣服', answer: 'consumer' },
        { text: '✏️ 设计衣服', answer: 'producer' },
    ];
    const [cards, setCards] = useState(allCards.map((c, i) => ({ ...c, id: i, placed: null as null | string })));
    const [dragging, setDragging] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const handleDrop = (zone: 'consumer' | 'producer') => {
        if (dragging === null) return;
        const card = cards[dragging];
        const correct = card.answer === zone;
        if (correct) setScore(s => s + 1);

        const next = [...cards];
        next[dragging] = { ...card, placed: zone };
        setCards(next);
        setDragging(null);

        if (next.every(c => c.placed !== null)) {
            setDone(true);
            setTimeout(onComplete, 2000);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-xl mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 消费者 vs 生产者</h3>
            <p className="text-gray-400 text-sm mb-4">点击卡片，然后选择它属于哪一类</p>

            {/* 未分类卡片 */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[48px]">
                {cards.filter(c => c.placed === null).map(c => (
                    <motion.button key={c.id} layoutId={`card-${c.id}`}
                        onClick={() => setDragging(c.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${dragging === c.id ? 'bg-pink-500 text-white scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {c.text}
                    </motion.button>
                ))}
            </div>

            {/* 两个放置区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => handleDrop('consumer')}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all text-center ${dragging !== null ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20' : 'border-gray-600 bg-transparent'}`}>
                    <div className="text-2xl mb-1">🛒</div>
                    <div className="text-red-400 font-bold text-sm">消费者</div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {cards.filter(c => c.placed === 'consumer').map(c => (
                            <span key={c.id} className={`text-xs px-2 py-1 rounded ${c.answer === 'consumer' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{c.text}</span>
                        ))}
                    </div>
                </button>
                <button onClick={() => handleDrop('producer')}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all text-center ${dragging !== null ? 'border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20' : 'border-gray-600 bg-transparent'}`}>
                    <div className="text-2xl mb-1">🏭</div>
                    <div className="text-cyan-400 font-bold text-sm">生产者</div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {cards.filter(c => c.placed === 'producer').map(c => (
                            <span key={c.id} className={`text-xs px-2 py-1 rounded ${c.answer === 'producer' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{c.text}</span>
                        ))}
                    </div>
                </button>
            </div>

            {done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-green-400 font-bold">
                    🎉 得分: {score}/6！{score >= 5 ? '你太棒了！' : '再接再厉！'}
                </motion.div>
            )}
        </motion.div>
    );
}

// ── 互动3: 睡后收入计算器 ──
function PassiveIncomeGame({ onComplete }: { onComplete: () => void }) {
    const [sales, setSales] = useState(10);
    const price = 29.9;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 睡后收入计算器</h3>
            <p className="text-gray-400 text-sm mb-4">假设你做了一本电子书定价 ¥{price}，拖动滑块模拟销量</p>

            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-4 mb-4">
                <div className="text-center">
                    <div className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        ¥{(sales * price).toFixed(0)}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">被动收入（你睡觉的时候也在赚！）</div>
                </div>
            </div>

            <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>销量</span>
                    <span className="text-cyan-400 font-mono">{sales} 份</span>
                </div>
                <input
                    type="range" min={0} max={10000} step={10} value={sales}
                    onChange={e => setSales(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0</span><span>10,000 份</span>
                </div>
            </div>

            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 你只花了 1 次时间写书，但卖出 {sales} 份。你的时间被「复制」了 {sales} 次。这就是「边际成本趋零」。
            </div>

            {sales > 500 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setTimeout(onComplete, 2000)}
                    className="w-full mt-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold">
                    我理解了！继续 →
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function PricingScene() {
    const [activeGame, setActiveGame] = useState<'pricing' | 'classifier' | 'passive' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const handleComplete = (game: string) => {
        setCompleted(prev => new Set(prev).add(game));
        setActiveGame(null);
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a0a3e] to-[#0a1a2e] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'pricing' && <PricingGame key="pricing" onComplete={() => handleComplete('pricing')} />}
                {activeGame === 'classifier' && <ClassifierGame key="classifier" onComplete={() => handleComplete('classifier')} />}
                {activeGame === 'passive' && <PassiveIncomeGame key="passive" onComplete={() => handleComplete('passive')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                            🏭 生产者转身 · 互动环节
                        </h2>
                        {[
                            { key: 'pricing' as const, icon: '💰', title: '价值定价器', desc: '猜猜不同物品值多少钱？' },
                            { key: 'classifier' as const, icon: '🔄', title: '消费者 vs 生产者', desc: '分辨哪些是消费行为，哪些是生产行为' },
                            { key: 'passive' as const, icon: '😴', title: '睡后收入计算器', desc: '做一次，卖无数次' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-pink-500/30'}`}
                            >
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
