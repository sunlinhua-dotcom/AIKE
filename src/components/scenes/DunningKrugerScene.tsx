'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 达克效应登山 ──
function DunningKrugerGame({ onComplete }: { onComplete: () => void }) {
    const stages = [
        { name: '起点', x: 5, y: 80, emoji: '🚶', info: '你刚开始学习，一切都是全新的' },
        { name: '愚昧之巅', x: 25, y: 15, emoji: '🤴', info: '看了两个视频就觉得自己什么都懂了——\"这也太简单了吧！\"', color: 'text-yellow-400' },
        { name: '绝望之谷', x: 50, y: 85, emoji: '😭', info: '真正深入后发现自己一无所知。90%的人在这里放弃了。', color: 'text-red-400' },
        { name: '开悟之坡', x: 75, y: 40, emoji: '🧗', info: '坚持下来的人开始真正理解，能力慢慢增长。', color: 'text-cyan-400' },
        { name: '大师平台', x: 95, y: 30, emoji: '🏆', info: '持续努力，最终成为真正的高手！', color: 'text-green-400' },
    ];
    const [currentStage, setCurrentStage] = useState(0);

    const advance = () => {
        if (currentStage < stages.length - 1) {
            setCurrentStage(s => s + 1);
        } else {
            onComplete();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 达克效应登山图</h3>

            {/* 山的简化视图 */}
            <div className="relative h-48 bg-gradient-to-b from-transparent to-gray-900/30 rounded-xl mb-4 overflow-hidden">
                {/* 山的曲线 - 用 CSS 模拟 */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <path d="M 0,80 Q 15,80 25,15 Q 35,50 50,85 Q 65,60 75,40 Q 85,30 100,30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <path d="M 0,80 Q 15,80 25,15 Q 35,50 50,85 Q 65,60 75,40 Q 85,30 100,30 L 100,100 L 0,100 Z" fill="rgba(255,255,255,0.02)" />
                </svg>

                {/* 标记点 */}
                {stages.map((s, i) => (
                    <motion.div key={i}
                        className={`absolute text-center transition-all ${i <= currentStage ? 'opacity-100' : 'opacity-20'}`}
                        style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}
                        animate={i === currentStage ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: i === currentStage ? Infinity : 0, duration: 1.5 }}
                    >
                        <div className="text-2xl">{s.emoji}</div>
                        <div className={`text-[10px] font-bold whitespace-nowrap ${s.color || 'text-gray-400'}`}>{s.name}</div>
                    </motion.div>
                ))}
            </div>

            {/* 信息卡 */}
            <AnimatePresence mode="wait">
                <motion.div key={currentStage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className={`p-4 rounded-xl bg-white/5 border border-white/10 mb-3`}
                >
                    <div className={`font-bold mb-1 ${stages[currentStage].color || 'text-white'}`}>
                        {stages[currentStage].emoji} {stages[currentStage].name}
                    </div>
                    <div className="text-gray-400 text-sm">{stages[currentStage].info}</div>
                </motion.div>
            </AnimatePresence>

            <button onClick={advance}
                className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold">
                {currentStage < stages.length - 1 ? `继续攀登 → ${stages[currentStage + 1].name}` : '🏆 登顶完成！'}
            </button>
        </motion.div>
    );
}

// ── 互动2: 幸存者偏差揭示器 ──
function SurvivorBiasGame({ onComplete }: { onComplete: () => void }) {
    const [spotlightOn, setSpotlightOn] = useState(false);
    const total = 100; // 显示100个图标

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 幸存者偏差揭示器</h3>
            <p className="text-gray-400 text-sm mb-4">10000 个创业者中，新闻只报道了谁？</p>

            <div className="relative p-4 rounded-xl bg-black/40 mb-3 min-h-[120px]">
                <div className="flex flex-wrap gap-[2px] justify-center">
                    {Array.from({ length: total }, (_, i) => (
                        <motion.span key={i}
                            className="text-xs transition-all duration-500"
                            animate={{
                                opacity: spotlightOn ? (i === 0 ? 1 : 0.1) : 1,
                                scale: spotlightOn ? (i === 0 ? 2 : 0.8) : 1,
                                filter: spotlightOn ? (i === 0 ? 'brightness(2)' : 'brightness(0.3)') : 'brightness(1)',
                            }}
                        >
                            {i === 0 ? '⭐' : '👤'}
                        </motion.span>
                    ))}
                </div>
                {spotlightOn && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 rounded text-yellow-400 text-xs font-bold">
                        新闻：「天才少年成功创业！」
                    </motion.div>
                )}
            </div>

            <button onClick={() => { setSpotlightOn(!spotlightOn); if (!spotlightOn) setTimeout(onComplete, 3000); }}
                className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-bold">
                {spotlightOn ? '关闭聚光灯（看全貌）' : '打开聚光灯 🔦'}
            </button>

            {spotlightOn && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    💡 你只看到了 1 个成功者（⭐），但背后有 9999 个失败者（👤）。这就是「幸存者偏差」。
                </div>
            )}
        </motion.div>
    );
}

// ── 互动3: 反共识选择题 ──
function AntiConsensusGame({ onComplete }: { onComplete: () => void }) {
    const questions = [
        {
            scenario: '班里所有人都在刷短视频，你怎么办？',
            options: [
                { text: 'A: 大家都刷，那我也刷', score: 0, feedback: '从众思维。你变成了和所有人一样的人。' },
                { text: 'B: 我不刷，我用这个时间学编程', score: 10, feedback: '反共识！当别人消费时，你在生产。6个月后你就拉开了差距。' },
                { text: 'C: 我分析短视频的算法逻辑，然后自己做一个', score: 15, feedback: '超级反共识！你不仅不消费，还把消费品变成了研究对象。' },
            ],
        },
        {
            scenario: '老师说"AI会取代所有工作"，你怎么想？',
            options: [
                { text: 'A: 那学习还有什么用', score: 0, feedback: '放弃思维。被表面信息吓到了。' },
                { text: 'B: AI取代的是不会用AI的人', score: 10, feedback: '第一性原理！回到核心：工具从不淘汰人，不会用工具的人才会被淘汰。' },
                { text: 'C: 我要学会驾驭AI', score: 15, feedback: '生产者思维！把威胁变成杠杆。' },
            ],
        },
    ];
    const [currentQ, setCurrentQ] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (i: number) => {
        setSelected(i);
        setAnswered(true);
        setTotalScore(s => s + questions[currentQ].options[i].score);
    };

    const handleNext = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(q => q + 1);
            setAnswered(false);
            setSelected(null);
        } else {
            onComplete();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 反共识选择（{currentQ + 1}/{questions.length}）</h3>
            <div className="text-white font-bold mb-4">{questions[currentQ].scenario}</div>

            <div className="space-y-2">
                {questions[currentQ].options.map((opt, i) => (
                    <button key={i} onClick={() => !answered && handleSelect(i)} disabled={answered}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${answered && selected === i ? (opt.score > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-white/5 border-white/10 hover:border-pink-500/30'}`}
                    >
                        <div className="text-sm text-white">{opt.text}</div>
                        {answered && selected === i && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mt-1">
                                {opt.score > 0 ? '✅' : '❌'} {opt.feedback} (+{opt.score}分)
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>

            {answered && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNext}
                    className="w-full mt-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                    {currentQ < questions.length - 1 ? '下一题 →' : `总分: ${totalScore}！完成 ✓`}
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function DunningKrugerScene() {
    const [activeGame, setActiveGame] = useState<'dk' | 'survivor' | 'anti' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1e] via-[#1a1a2e] to-[#0a1a1e] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'dk' && <DunningKrugerGame key="dk" onComplete={() => handleComplete('dk')} />}
                {activeGame === 'survivor' && <SurvivorBiasGame key="sv" onComplete={() => handleComplete('survivor')} />}
                {activeGame === 'anti' && <AntiConsensusGame key="ac" onComplete={() => handleComplete('anti')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">🏔️ 拒绝平庸 · 互动环节</h2>
                        {[
                            { key: 'dk' as const, icon: '🏔️', title: '达克效应登山', desc: '翻越愚昧之巅和绝望之谷' },
                            { key: 'survivor' as const, icon: '🔦', title: '幸存者偏差揭示器', desc: '看看新闻没告诉你什么' },
                            { key: 'anti' as const, icon: '🧠', title: '反共识选择题', desc: '你敢和大多数人不一样吗？' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-orange-500/30'}`}>
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
