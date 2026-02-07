'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 杠杆跷跷板 ──
function LeverGame({ onComplete }: { onComplete: () => void }) {
    const [leverPower, setLeverPower] = useState(20);
    const boulderSize = Math.min(leverPower * 2, 200);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 杠杆跷跷板</h3>
            <p className="text-gray-400 text-sm mb-4">拖动滑块提升你的认知水平，看看能撬动多大的「石头」</p>

            <div className="relative h-40 bg-gradient-to-b from-transparent to-gray-900/50 rounded-xl mb-4 overflow-hidden flex items-end justify-center">
                {/* 杠杆 */}
                <div className="relative w-full flex items-end justify-center" style={{ height: '120px' }}>
                    {/* 支点 */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-cyan-500" />
                    {/* 杠杆杆 */}
                    <motion.div
                        className="absolute bottom-[28px] left-1/2 h-2 bg-gradient-to-r from-gray-600 to-cyan-400 rounded-full origin-center"
                        style={{ width: `${60 + leverPower}%`, x: '-50%' }}
                        animate={{ rotate: leverPower > 50 ? -5 : 5 }}
                    />
                    {/* 小人 */}
                    <div className="absolute bottom-[32px] left-[15%] text-2xl">🧒</div>
                    {/* 石头 */}
                    <motion.div
                        className="absolute bottom-[32px] right-[15%] flex items-center justify-center"
                        animate={{ y: leverPower > 50 ? -20 : 0 }}
                    >
                        <span style={{ fontSize: `${20 + boulderSize / 8}px` }}>🪨</span>
                    </motion.div>
                </div>
            </div>

            <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">认知水平（杠杆长度）</span>
                    <span className="text-cyan-400 font-mono">{leverPower}%</span>
                </div>
                <input type="range" min={5} max={100} value={leverPower}
                    onChange={e => setLeverPower(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>

            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 你的认知越强，AI 这根杠杆能帮你撬动的东西越大。{leverPower > 70 ? '🎉 认知足够强了！AI 能帮你做大事！' : '继续提升认知水平...'}
            </div>

            {leverPower > 70 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setTimeout(onComplete, 2000)}
                    className="w-full mt-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold">
                    我理解了！继续 →
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 互动2: Prompt 对决场 ──
function PromptBattleGame({ onComplete }: { onComplete: () => void }) {
    const battles = [
        {
            category: '✍️ 作文',
            bad: { prompt: '帮我写一篇作文', result: '春天来了，花开了，鸟叫了...（平淡无奇的流水账）', score: 60 },
            good: { prompt: '我是10岁孩子，在海洋馆看到巨型章鱼，非常震撼。用第一人称写300字观察日记，要有细节描写、情感变化和出人意料的结尾', result: '它的眼睛像外星人的望远镜，触手像会跳舞的彩虹...（生动独特的满分作文）', score: 95 },
        },
        {
            category: '🎨 画画',
            bad: { prompt: '画一只猫', result: '一只普通的、没有特色的卡通猫', score: 40 },
            good: { prompt: '赛博朋克风格的机械猫，蓝色霓虹眼睛，坐在雨夜的东京屋顶，远处有全息广告牌', result: '一幅震撼的数字艺术作品，充满细节和氛围', score: 98 },
        },
        {
            category: '🌐 翻译',
            bad: { prompt: '翻译这段话', result: '直译，语法正确但读起来像机器人说话', score: 55 },
            good: { prompt: '请用中国初中生日常聊天的口吻翻译，保留原文的幽默感，遇到文化差异时用中国本土化的表达替换', result: '地道、有趣、完全本土化的翻译', score: 92 },
        },
    ];
    const [currentBattle, setCurrentBattle] = useState(0);
    const [viewedAll, setViewedAll] = useState(false);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 Prompt 对决场</h3>

            {/* 分类标签 */}
            <div className="flex gap-2 mb-4">
                {battles.map((b, i) => (
                    <button key={i} onClick={() => { setCurrentBattle(i); if (i === battles.length - 1) setViewedAll(true); }}
                        className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${currentBattle === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        {b.category}
                    </button>
                ))}
            </div>

            {/* 对比 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 烂提示词 */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="text-red-400 text-xs font-bold mb-2">❌ 烂提示词</div>
                    <div className="text-white text-sm font-mono bg-black/30 p-2 rounded mb-2">"{battles[currentBattle].bad.prompt}"</div>
                    <div className="text-gray-500 text-xs mb-2">{battles[currentBattle].bad.result}</div>
                    <div className="text-red-400 font-bold text-lg">{battles[currentBattle].bad.score} 分</div>
                </div>
                {/* 好提示词 */}
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                    <div className="text-green-400 text-xs font-bold mb-2">✅ 好提示词</div>
                    <div className="text-white text-sm font-mono bg-black/30 p-2 rounded mb-2">"{battles[currentBattle].good.prompt}"</div>
                    <div className="text-gray-500 text-xs mb-2">{battles[currentBattle].good.result}</div>
                    <div className="text-green-400 font-bold text-lg">{battles[currentBattle].good.score} 分</div>
                </div>
            </div>

            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 差距 = <span className="text-yellow-400 font-bold">{battles[currentBattle].good.score - battles[currentBattle].bad.score} 分</span>！同样的 AI，不同的提示词，天壤之别。
            </div>

            {viewedAll && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setTimeout(onComplete, 2000)}
                    className="w-full mt-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold">
                    全部看完！继续 →
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 互动3: 成本对比时间轴 ──
function CostTimelineGame({ onComplete }: { onComplete: () => void }) {
    const categories = ['翻译', '绘画', '写作'];
    const timeline = [
        { year: 2000, costs: ['¥500/小时', '¥3000/张', '¥2000/篇'] },
        { year: 2010, costs: ['¥300/小时', '¥1500/张', '¥1000/篇'] },
        { year: 2020, costs: ['¥100/小时', '¥500/张', '¥300/篇'] },
        { year: 2025, costs: ['¥0（AI）', '¥0（AI 3分钟）', '¥0（AI 10秒）'] },
    ];
    const [activeYear, setActiveYear] = useState(0);
    const [clickedAll, setClickedAll] = useState(new Set<number>());

    const handleClick = (i: number) => {
        setActiveYear(i);
        const next = new Set(clickedAll);
        next.add(i);
        setClickedAll(next);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 成本对比时间轴</h3>
            <p className="text-gray-400 text-sm mb-4">点击不同年份，看成本如何随 AI 崛起暴跌</p>

            <div className="flex gap-2 mb-4">
                {timeline.map((t, i) => (
                    <button key={i} onClick={() => handleClick(i)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeYear === i ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                        {t.year}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {categories.map((cat, ci) => (
                    <div key={ci} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-12">{cat}</span>
                        <motion.div
                            className="flex-1 rounded-lg p-2 text-sm font-mono"
                            animate={{
                                backgroundColor: activeYear === 3 ? 'rgba(0, 255, 100, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <span className={activeYear === 3 ? 'text-green-400 font-bold' : 'text-white'}>
                                {timeline[activeYear].costs[ci]}
                            </span>
                        </motion.div>
                    </div>
                ))}
            </div>

            {clickedAll.size >= 4 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setTimeout(onComplete, 2000)}
                    className="w-full mt-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold">
                    震撼！继续 →
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function PromptBattleScene() {
    const [activeGame, setActiveGame] = useState<'lever' | 'battle' | 'timeline' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const handleComplete = (game: string) => {
        setCompleted(prev => new Set(prev).add(game));
        setActiveGame(null);
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'lever' && <LeverGame key="lever" onComplete={() => handleComplete('lever')} />}
                {activeGame === 'battle' && <PromptBattleGame key="battle" onComplete={() => handleComplete('battle')} />}
                {activeGame === 'timeline' && <CostTimelineGame key="timeline" onComplete={() => handleComplete('timeline')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                            🔧 AI 不是魔法 · 互动环节
                        </h2>
                        {[
                            { key: 'lever' as const, icon: '⚖️', title: '杠杆跷跷板', desc: '认知越强，AI 杠杆越长' },
                            { key: 'battle' as const, icon: '⚔️', title: 'Prompt 对决场', desc: '对比好坏提示词的结果差距' },
                            { key: 'timeline' as const, icon: '📉', title: '成本时间轴', desc: 'AI 让成本暴跌到零' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-cyan-500/30'}`}
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
