'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 杠杆跷跷板 ──
function LeverGame() {
    const [leverPower, setLeverPower] = useState(20);
    const boulderSize = Math.min(leverPower * 2, 200);
    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">⚖️ 杠杆跷跷板</h3>
            <p className="text-gray-400 text-sm mb-4">拖动滑块提升认知水平，看看能撬动多大的石头</p>
            <div className="relative h-40 bg-gradient-to-b from-transparent to-gray-900/50 rounded-xl mb-4 overflow-hidden flex items-end justify-center">
                <div className="relative w-full flex items-end justify-center" style={{ height: '120px' }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-cyan-500" />
                    <motion.div className="absolute bottom-[28px] left-1/2 h-2 bg-gradient-to-r from-gray-600 to-cyan-400 rounded-full origin-center"
                        style={{ width: `${60 + leverPower}%`, x: '-50%' }} animate={{ rotate: leverPower > 50 ? -5 : 5 }} />
                    <div className="absolute bottom-[32px] left-[15%] text-2xl">🧒</div>
                    <motion.div className="absolute bottom-[32px] right-[15%] flex items-center justify-center" animate={{ y: leverPower > 50 ? -20 : 0 }}>
                        <span style={{ fontSize: `${20 + boulderSize / 8}px` }}>🪨</span>
                    </motion.div>
                </div>
            </div>
            <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">认知水平（杠杆长度）</span>
                    <span className="text-cyan-400 font-mono">{leverPower}%</span>
                </div>
                <input type="range" min={5} max={100} value={leverPower} onChange={e => setLeverPower(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 认知越强，AI 这根杠杆能帮你撬动的东西越大。{leverPower > 70 ? '🎉 认知足够强了！AI 能帮你做大事！' : '继续提升认知水平...'}
            </div>
        </>
    );
}

// ── 互动2: Prompt 对决场 ──
function PromptBattleGame() {
    const battles = [
        {
            category: '✍️ 作文',
            bad: { prompt: '帮我写一篇作文', result: '平淡无奇的流水账', score: 60 },
            good: { prompt: '我是10岁孩子，在海洋馆看到巨型章鱼，非常震撼。用第一人称写300字观察日记，要有细节描写、情感变化', result: '生动独特的满分作文', score: 95 },
        },
        {
            category: '🎨 画画',
            bad: { prompt: '画一只猫', result: '一只普通的卡通猫', score: 40 },
            good: { prompt: '赛博朋克风格的机械猫，蓝色霓虹眼睛，坐在雨夜的东京屋顶', result: '震撼的数字艺术作品', score: 98 },
        },
        {
            category: '🌐 翻译',
            bad: { prompt: '翻译这段话', result: '语法正确但像机器人', score: 55 },
            good: { prompt: '用初中生聊天口吻翻译，保留幽默感，文化差异用本土化表达替换', result: '地道有趣的翻译', score: 92 },
        },
    ];
    const [currentBattle, setCurrentBattle] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">⚔️ Prompt 对决场</h3>
            <div className="flex gap-2 mb-4">
                {battles.map((b, i) => (
                    <button key={i} onClick={() => setCurrentBattle(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentBattle === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {b.category}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="text-red-400 text-xs font-bold mb-2">❌ 烂提示词</div>
                    <div className="text-white text-xs font-mono bg-black/30 p-2 rounded mb-2">&ldquo;{battles[currentBattle].bad.prompt}&rdquo;</div>
                    <div className="text-gray-500 text-xs mb-2">{battles[currentBattle].bad.result}</div>
                    <div className="text-red-400 font-bold">{battles[currentBattle].bad.score} 分</div>
                </div>
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                    <div className="text-green-400 text-xs font-bold mb-2">✅ 好提示词</div>
                    <div className="text-white text-xs font-mono bg-black/30 p-2 rounded mb-2">&ldquo;{battles[currentBattle].good.prompt}&rdquo;</div>
                    <div className="text-gray-500 text-xs mb-2">{battles[currentBattle].good.result}</div>
                    <div className="text-green-400 font-bold">{battles[currentBattle].good.score} 分</div>
                </div>
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 差距 = <span className="text-yellow-400 font-bold">{battles[currentBattle].good.score - battles[currentBattle].bad.score} 分</span>！同样的 AI，不同的提示词，天壤之别。
            </div>
        </>
    );
}

// ── 互动3: 成本对比时间轴 ──
function CostTimelineGame() {
    const categories = ['翻译', '绘画', '写作'];
    const timeline = [
        { year: 2000, costs: ['¥500/时', '¥3000/张', '¥2000/篇'] },
        { year: 2010, costs: ['¥300/时', '¥1500/张', '¥1000/篇'] },
        { year: 2020, costs: ['¥100/时', '¥500/张', '¥300/篇'] },
        { year: 2025, costs: ['¥0(AI)', '¥0(AI 3分钟)', '¥0(AI 10秒)'] },
    ];
    const [activeYear, setActiveYear] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">📉 成本时间轴</h3>
            <p className="text-gray-400 text-sm mb-4">点击不同年份，看成本如何暴跌</p>
            <div className="flex gap-2 mb-4">
                {timeline.map((t, i) => (
                    <button key={i} onClick={() => setActiveYear(i)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeYear === i ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {t.year}
                    </button>
                ))}
            </div>
            <div className="space-y-2">
                {categories.map((cat, ci) => (
                    <div key={ci} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-12">{cat}</span>
                        <motion.div className="flex-1 rounded-lg p-2 text-sm font-mono"
                            animate={{ backgroundColor: activeYear === 3 ? 'rgba(0,255,100,0.1)' : 'rgba(255,255,255,0.05)' }}>
                            <span className={activeYear === 3 ? 'text-green-400 font-bold' : 'text-white'}>{timeline[activeYear].costs[ci]}</span>
                        </motion.div>
                    </div>
                ))}
            </div>
            <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                💡 AI 让创作成本趋近于零！{activeYear === 3 ? '🎉 2025年，几乎一切创作都免费了！' : '继续点击查看...'}
            </div>
        </>
    );
}

export default function PromptBattleScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'battle' ? <PromptBattleGame /> :
                    game === 'timeline' ? <CostTimelineGame /> :
                        <LeverGame />}
            </motion.div>
        </div>
    );
}
