'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 价值定价器 ──
function PricingGame() {
    const items = [
        { name: '☕ 咖啡豆（原料）', realPrice: 3, hint: '考虑这只是原材料' },
        { name: '☕ 星巴克咖啡', realPrice: 38, hint: '品牌 + 体验 + 环境' },
        { name: '📸 品牌体验照', realPrice: 0, hint: '社交货币，无法定价' },
    ];
    const [guesses, setGuesses] = useState<number[]>([10, 20, 10]);
    const [revealed, setRevealed] = useState(false);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-4">🎮 价值定价器</h3>
            <p className="text-gray-400 text-sm mb-4">拖动滑块，猜猜每个物品值多少钱？</p>
            {items.map((item, i) => (
                <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{item.name}</span>
                        <span className="text-cyan-400 font-mono">¥{guesses[i]}</span>
                    </div>
                    <input type="range" min={0} max={100} value={guesses[i]} disabled={revealed}
                        onChange={e => { const n = [...guesses]; n[i] = parseInt(e.target.value); setGuesses(n); }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                    {revealed && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mt-1 text-xs">
                            <span className={Math.abs(guesses[i] - item.realPrice) < 10 ? 'text-green-400' : 'text-yellow-400'}>
                                {Math.abs(guesses[i] - item.realPrice) < 10 ? '✅ 接近！' : '❌ 差很多'}
                            </span>
                            <span className="text-gray-500">实际: ¥{item.realPrice} — {item.hint}</span>
                        </motion.div>
                    )}
                </div>
            ))}
            {!revealed && (
                <button onClick={() => setRevealed(true)}
                    className="w-full mt-2 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    揭晓答案 🎉
                </button>
            )}
            {revealed && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    💡 价格只是数字，价值才是真相。同样的咖啡豆，加上品牌和故事，价值翻了10倍！
                </div>
            )}
        </>
    );
}

// ── 互动2: 消费者 vs 生产者分类器 ──
function ClassifierGame() {
    const activities = [
        { text: '刷抖音3小时', type: 'consumer' }, { text: '写一篇公众号文章', type: 'producer' },
        { text: '打王者荣耀', type: 'consumer' }, { text: '用AI做了个小工具', type: 'producer' },
        { text: '看别人直播', type: 'consumer' }, { text: '教同学一个新技巧', type: 'producer' },
    ];
    const [sorted, setSorted] = useState<Record<number, string>>({});
    const [showResult, setShowResult] = useState(false);

    const handleDrop = (idx: number, zone: 'consumer' | 'producer') => {
        setSorted(prev => ({ ...prev, [idx]: zone }));
        const newSorted = { ...sorted, [idx]: zone };
        if (Object.keys(newSorted).length === activities.length) {
            setTimeout(() => setShowResult(true), 500);
        }
    };

    const correct = Object.entries(sorted).filter(([i, z]) => activities[parseInt(i)].type === z).length;

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🔄 消费者 vs 生产者</h3>
            <p className="text-gray-400 text-sm mb-4">把每个活动归类到正确的类别</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center text-red-400 text-xs font-bold">消费者 👇</div>
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center text-green-400 text-xs font-bold">生产者 👇</div>
            </div>
            <div className="space-y-2">
                {activities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-white text-sm flex-1">{a.text}</span>
                        {sorted[i] ? (
                            <span className={`text-xs px-2 py-1 rounded ${sorted[i] === a.type ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {sorted[i] === 'consumer' ? '消费者' : '生产者'} {sorted[i] === a.type ? '✓' : '✗'}
                            </span>
                        ) : (
                            <div className="flex gap-1">
                                <button onClick={() => handleDrop(i, 'consumer')} className="px-2 py-1 text-xs bg-red-500/20 rounded text-red-400 hover:bg-red-500/30">消费</button>
                                <button onClick={() => handleDrop(i, 'producer')} className="px-2 py-1 text-xs bg-green-500/20 rounded text-green-400 hover:bg-green-500/30">生产</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎯 正确率 {Math.round(correct / activities.length * 100)}%！记住：消费让你花时间，生产让你赚时间。
                </motion.div>
            )}
        </>
    );
}

// ── 互动3: 睡后收入计算器 ──
function PassiveIncomeGame() {
    const [hours, setHours] = useState(10);
    const [price, setPrice] = useState(20);
    const sales = Math.min(hours * 50, 1000);
    const totalIncome = sales * price;
    const activeIncome = hours * 100;

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">😴 睡后收入模拟器</h3>
            <p className="text-gray-400 text-sm mb-4">调节参数，看看做一次能赚多久</p>
            <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">创作投入时间</span>
                    <span className="text-cyan-400 font-mono">{hours}小时</span>
                </div>
                <input type="range" min={1} max={100} value={hours} onChange={e => setHours(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </div>
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">单份售价</span>
                    <span className="text-pink-400 font-mono">¥{price}</span>
                </div>
                <input type="range" min={1} max={200} value={price} onChange={e => setPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="text-red-400 text-xs mb-1">打工收入（一次性）</div>
                    <div className="text-white font-bold text-lg">¥{activeIncome}</div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-green-400 text-xs mb-1">睡后收入（持续赚）</div>
                    <div className="text-white font-bold text-lg">¥{totalIncome.toLocaleString()}</div>
                </div>
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 做一次，卖 {sales} 次。生产者的秘密：一次创造，无限复制！
            </div>
        </>
    );
}

// ── 场景选择器 ──
export default function PricingScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a0a3e] to-[#0a1a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'classifier' ? <ClassifierGame /> :
                    game === 'passive' ? <PassiveIncomeGame /> :
                        <PricingGame />}
            </motion.div>
        </div>
    );
}
