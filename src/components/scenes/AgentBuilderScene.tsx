'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 痛点选择器 ──
function PainPointGame({ onComplete }: { onComplete: () => void }) {
    const painPoints = [
        { text: '📝 每天做作业不知道先做哪科', grade: 'A', emoji: '😩', why: '高频 + 每天都会遇到 + AI 可以帮你做优先级排序' },
        { text: '🎮 想做游戏但不会编程', grade: 'B', emoji: '🤔', why: '中频 + 有现成工具可以帮忙 + 但不是每天都需要' },
        { text: '🌧️ 下雨天不想出门', grade: 'C', emoji: '😐', why: '低频 + AI 无法改变天气 + 不是真正的问题' },
        { text: '🧠 背单词总是忘', grade: 'A', emoji: '😤', why: '超高频 + AI 可以定制复习计划 + 非常适合做 AI 工具' },
        { text: '👽 想去火星旅行', grade: 'D', emoji: '🛸', why: '不可行 + 完全超出当前能力 + 放弃' },
    ];
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);

    const handleReveal = () => {
        setRevealed(true);
        setTimeout(onComplete, 3000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 痛点选择器</h3>
            <p className="text-gray-400 text-sm mb-4">哪些生活烦恼最适合做成 AI 工具？点击选择你认为最好的</p>

            <div className="space-y-2 mb-4">
                {painPoints.map((p, i) => (
                    <button key={i} onClick={() => setSelected(i)} disabled={revealed}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${selected === i ? 'bg-pink-500/10 border-pink-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{p.emoji}</span>
                            <span className="text-white text-sm flex-1">{p.text}</span>
                            {revealed && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.grade === 'A' ? 'bg-green-500/20 text-green-400' : p.grade === 'B' ? 'bg-yellow-500/20 text-yellow-400' : p.grade === 'C' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}
                                >
                                    {p.grade}级
                                </motion.span>
                            )}
                        </div>
                        {revealed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500 mt-1">{p.why}</motion.div>
                        )}
                    </button>
                ))}
            </div>

            {!revealed && selected !== null && (
                <button onClick={handleReveal} className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold">
                    揭晓评级 📊
                </button>
            )}
        </motion.div>
    );
}

// ── 互动2: AI 员工组装台 ──
function AgentAssemblerGame({ onComplete }: { onComplete: () => void }) {
    const parts = [
        { id: 'brain', label: '🧠 思考引擎', desc: 'GPT / Claude', placed: false },
        { id: 'manual', label: '📋 工作手册', desc: '系统提示词', placed: false },
        { id: 'memory', label: '💾 记忆模块', desc: '上下文/历史', placed: false },
        { id: 'tool', label: '🔧 工具包', desc: 'API/插件', placed: false },
        { id: 'ui', label: '🖥️ 界面', desc: '用户交互', placed: false },
    ];
    const [assembled, setAssembled] = useState<string[]>([]);

    const addPart = (id: string) => {
        if (!assembled.includes(id)) {
            const next = [...assembled, id];
            setAssembled(next);
            if (next.length === parts.length) setTimeout(onComplete, 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 AI 员工组装台</h3>
            <p className="text-gray-400 text-sm mb-4">选择零件，组装你的第一个 AI 员工</p>

            {/* 零件库 */}
            <div className="flex flex-wrap gap-2 mb-4">
                {parts.filter(p => !assembled.includes(p.id)).map(p => (
                    <button key={p.id} onClick={() => addPart(p.id)}
                        className="px-3 py-2 bg-white/10 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 rounded-lg text-sm text-white transition-all"
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* 组装区 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-h-[100px]">
                <div className="text-xs text-gray-500 mb-2">🤖 你的 AI 员工</div>
                {assembled.length === 0 ? (
                    <div className="text-gray-600 text-sm text-center py-4">点击上方零件开始组装</div>
                ) : (
                    <div className="space-y-1">
                        {assembled.map((id, i) => {
                            const part = parts.find(p => p.id === id)!;
                            return (
                                <motion.div key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm"
                                >
                                    <span>{part.label}</span>
                                    <span className="text-gray-500 text-xs">— {part.desc}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {assembled.length === parts.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 你的 AI 员工组装完毕！它可以 24/7 为你工作！
                </motion.div>
            )}
        </motion.div>
    );
}

// ── 互动3: MVP 迭代模拟器 ──
function MVPIteratorGame({ onComplete }: { onComplete: () => void }) {
    const versions = [
        { v: 'v0.1', desc: '最简版：只能背10个单词', quality: 20, emoji: '🥚' },
        { v: 'v0.2', desc: '加入艾宾浩斯遗忘曲线', quality: 45, emoji: '🐣' },
        { v: 'v0.3', desc: '加入语音跟读功能', quality: 65, emoji: '🐥' },
        { v: 'v1.0', desc: '完整版：AI 智能出题 + 错题本', quality: 90, emoji: '🦅' },
    ];
    const [currentVersion, setCurrentVersion] = useState(0);

    const iterate = () => {
        if (currentVersion < versions.length - 1) {
            setCurrentVersion(v => v + 1);
        }
        if (currentVersion === versions.length - 2) {
            setTimeout(onComplete, 2500);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 MVP 迭代模拟器</h3>
            <p className="text-gray-400 text-sm mb-4">从最小可行产品开始，一步步迭代进化</p>

            {/* 进化条 */}
            <div className="relative mb-4">
                <div className="h-3 bg-gray-800 rounded-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
                        animate={{ width: `${versions[currentVersion].quality}%` }}
                        transition={{ duration: 0.8 }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    {versions.map((v, i) => (
                        <div key={i} className={`text-xs ${i <= currentVersion ? 'text-cyan-400' : 'text-gray-600'}`}>
                            {v.emoji}
                        </div>
                    ))}
                </div>
            </div>

            {/* 当前版本信息 */}
            <AnimatePresence mode="wait">
                <motion.div key={currentVersion} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 mb-3 text-center"
                >
                    <div className="text-3xl mb-2">{versions[currentVersion].emoji}</div>
                    <div className="text-cyan-400 font-bold">{versions[currentVersion].v}</div>
                    <div className="text-white text-sm mt-1">{versions[currentVersion].desc}</div>
                    <div className="text-gray-500 text-xs mt-2">完成度: {versions[currentVersion].quality}%</div>
                </motion.div>
            </AnimatePresence>

            {currentVersion < versions.length - 1 ? (
                <button onClick={iterate} className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                    🚀 迭代到 {versions[currentVersion + 1].v}
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 完美！从一个简单的原型迭代成了完整产品。永远先做 MVP！
                </div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function AgentBuilderScene() {
    const [activeGame, setActiveGame] = useState<'pain' | 'agent' | 'mvp' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a1a] to-[#0a2a1a] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'pain' && <PainPointGame key="p" onComplete={() => handleComplete('pain')} />}
                {activeGame === 'agent' && <AgentAssemblerGame key="a" onComplete={() => handleComplete('agent')} />}
                {activeGame === 'mvp' && <MVPIteratorGame key="m" onComplete={() => handleComplete('mvp')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent mb-2">🤖 打造AI员工 · 互动环节</h2>
                        {[
                            { key: 'pain' as const, icon: '🎯', title: '痛点选择器', desc: '哪些问题最适合做AI工具？' },
                            { key: 'agent' as const, icon: '🔧', title: 'AI员工组装台', desc: '5个零件组装你的AI助手' },
                            { key: 'mvp' as const, icon: '🚀', title: 'MVP迭代模拟', desc: '从v0.1到v1.0的进化之路' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-cyan-500/30'}`}>
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
