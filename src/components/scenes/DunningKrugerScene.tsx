'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 达克效应登山 ──
function DunningKrugerGame() {
    const stages = [
        { name: '😎 愚昧之巅', y: 20, desc: '刚学了一点皮毛，觉得自己是专家了' },
        { name: '😰 绝望之谷', y: 80, desc: '深入学习后发现什么都不会，信心崩溃' },
        { name: '🧗 开悟之坡', y: 50, desc: '坚持过来了，慢慢建立真实的能力' },
        { name: '🏔️ 稳定高原', y: 30, desc: '有底气的自信，知道自己知道什么、不知道什么' },
    ];
    const [currentStage, setCurrentStage] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🏔️ 达克效应登山</h3>
            <p className="text-gray-400 text-sm mb-4">点击按钮经历每个阶段</p>
            <div className="relative h-32 bg-gradient-to-b from-transparent to-gray-900/30 rounded-xl mb-4 overflow-hidden">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                    <path d="M 0 100 Q 50 100 100 20 Q 150 -10 200 100 Q 250 130 300 60 Q 350 40 400 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <motion.circle r="8" fill="#ec4899" animate={{ cx: currentStage * 100 + 50, cy: stages[currentStage].y }} transition={{ type: 'spring' }} />
                </svg>
            </div>
            <div className="flex gap-2 mb-3">
                {stages.map((s, i) => (
                    <button key={i} onClick={() => setCurrentStage(i)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${currentStage === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
            <motion.div key={currentStage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-3 bg-white/5 rounded-lg">
                <div className="text-white font-bold text-sm mb-1">{stages[currentStage].name}</div>
                <div className="text-gray-400 text-xs">{stages[currentStage].desc}</div>
            </motion.div>
        </>
    );
}

// ── 互动2: 幸存者偏差揭示器 ──
function SurvivorBiasGame() {
    const [spotlightOn, setSpotlightOn] = useState(true);
    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🔦 幸存者偏差</h3>
            <p className="text-gray-400 text-sm mb-4">点击按钮切换聚光灯，看看完整的真相</p>
            <div className="relative h-48 bg-black/50 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                    {spotlightOn ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                            <div className="text-5xl mb-2">🌟</div>
                            <div className="text-yellow-400 font-bold">1 个成功者</div>
                            <div className="text-gray-500 text-xs">新闻只报道他</div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                            <div className="text-3xl mb-2">🌟</div>
                            <div className="flex flex-wrap justify-center gap-1 mb-2">
                                {Array(30).fill(0).map((_, i) => <span key={i} className="text-xs opacity-40">👤</span>)}
                            </div>
                            <div className="text-red-400 font-bold text-sm">9999 个失败者被隐藏了</div>
                            <div className="text-gray-500 text-xs">你只看到了冰山一角</div>
                        </motion.div>
                    )}
                </div>
            </div>
            <button onClick={() => setSpotlightOn(!spotlightOn)}
                className="w-full py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-bold text-sm">
                {spotlightOn ? '🔦 关闭聚光灯（看完整真相）' : '💡 打开聚光灯（只看成功者）'}
            </button>
        </>
    );
}

// ── 互动3: 反共识选择题 ──
function AntiConsensusGame() {
    const questions = [
        {
            q: '所有同学都在刷短视频，你应该？', options: ['跟着刷，大家都在刷', '不刷，把时间花在学习新技能上'], answer: 1,
            explain: '当所有人都往一个方向跑时，停下来想想是否正确。不随波逐流本身就是竞争力。'
        },
        {
            q: 'AI 很聪明，所以我们不需要学习了？', options: ['对，AI可以替我做一切', '错，AI是工具，你的认知决定工具的上限'], answer: 1,
            explain: 'AI是杠杆，但支点是你的认知。没有认知，杠杆再长也撬不动。'
        },
    ];
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🤔 反共识思维</h3>
            <div className="flex gap-2 mb-3">
                {questions.map((_, i) => (
                    <button key={i} onClick={() => { setCurrentQ(i); setSelected(null); }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${currentQ === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        题目 {i + 1}
                    </button>
                ))}
            </div>
            <div className="text-white text-sm font-bold mb-3">{questions[currentQ].q}</div>
            <div className="space-y-2">
                {questions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => setSelected(i)}
                        className={`w-full p-3 rounded-lg text-left text-sm border transition-all ${selected === null ? 'border-white/10 bg-white/5 hover:border-pink-500/30' :
                                i === questions[currentQ].answer ? 'border-green-500/50 bg-green-500/10' :
                                    selected === i ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    {selected === questions[currentQ].answer ? '✅ 正确！' : '❌ 再想想'} {questions[currentQ].explain}
                </motion.div>
            )}
        </>
    );
}

export default function DunningKrugerScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'survivor' ? <SurvivorBiasGame /> :
                    game === 'anti' ? <AntiConsensusGame /> :
                        <DunningKrugerGame />}
            </motion.div>
        </div>
    );
}
