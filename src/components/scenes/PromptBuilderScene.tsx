'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 提示词拼装工坊 ──
function PromptBuilderGame({ onComplete }: { onComplete: () => void }) {
    const components = [
        { id: 'role', label: '👤 角色', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', text: '你是一个儿童科普作家' },
        { id: 'context', label: '🌍 背景', color: 'bg-green-500/20 border-green-500/30 text-green-400', text: '面向8-12岁小学生' },
        { id: 'task', label: '🎯 任务', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400', text: '解释黑洞是什么' },
        { id: 'format', label: '📋 格式', color: 'bg-orange-500/20 border-orange-500/30 text-orange-400', text: '用3个生活中的比喻来解释' },
        { id: 'constraint', label: '🚧 限制', color: 'bg-red-500/20 border-red-500/30 text-red-400', text: '不许用专业术语，控制在200字以内' },
    ];

    const [assembled, setAssembled] = useState<string[]>([]);
    const [score, setScore] = useState<number | null>(null);

    const toggle = (id: string) => {
        if (assembled.includes(id)) {
            setAssembled(assembled.filter(a => a !== id));
        } else {
            setAssembled([...assembled, id]);
        }
        setScore(null);
    };

    const handleScore = () => {
        const s = assembled.length * 20;
        setScore(s);
        if (s === 100) setTimeout(onComplete, 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 提示词拼装工坊</h3>
            <p className="text-gray-400 text-sm mb-4">点击组件把它们加入提示词，看看得分如何</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {components.map(c => (
                    <button key={c.id} onClick={() => toggle(c.id)}
                        className={`px-3 py-2 rounded-lg text-sm border font-bold transition-all ${assembled.includes(c.id) ? c.color + ' scale-105' : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* 拼装区 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-h-[80px] mb-3">
                <div className="text-xs text-gray-500 mb-2">拼装后的提示词：</div>
                {assembled.length === 0 ? (
                    <div className="text-gray-600 text-sm italic">← 点击上方组件开始拼装</div>
                ) : (
                    <div className="text-sm text-white leading-relaxed">
                        {assembled.map(id => components.find(c => c.id === id)?.text).join('。')}。
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button onClick={handleScore} disabled={assembled.length === 0}
                    className="flex-1 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold disabled:opacity-30">
                    打分 📊
                </button>
            </div>

            {score !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 p-3 rounded-lg text-center font-bold ${score === 100 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    得分: {score}/100 {score === 100 ? '🎉 完美提示词！' : `缺少 ${5 - assembled.length} 个组件`}
                </motion.div>
            )}
        </motion.div>
    );
}

// ── 互动2: 好坏提示词 PK ──
function PromptPKGame({ onComplete }: { onComplete: () => void }) {
    const questions = [
        { a: '画一只狗', b: '画一只金毛犬在秋天的公园里玩飞盘，阳光透过树叶，照片风格', answer: 'b' },
        { a: '帮我翻译这段英文，用口语化的中文', b: '翻译一下', answer: 'a' },
        { a: '写代码', b: '用 Python 写一个统计班级数学成绩平均分的程序，输入为分数列表，输出平均分和最高分', answer: 'b' },
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [choice, setChoice] = useState<string | null>(null);

    const handleChoice = (c: 'a' | 'b') => {
        setChoice(c);
        setAnswered(true);
        if (c === questions[current].answer) setScore(s => s + 10);
    };

    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setAnswered(false);
            setChoice(null);
        } else {
            onComplete();
        }
    };

    const q = questions[current];
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 好坏提示词 PK（{current + 1}/{questions.length}）</h3>
            <p className="text-gray-400 text-sm mb-4">哪个提示词能得到更好的结果？ 得分: {score}</p>

            <div className="grid grid-cols-1 gap-3">
                {(['a', 'b'] as const).map(key => (
                    <button key={key} onClick={() => !answered && handleChoice(key)}
                        disabled={answered}
                        className={`p-4 rounded-xl border text-left transition-all ${answered
                                ? key === q.answer ? 'bg-green-500/10 border-green-500/30' : choice === key ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
                                : 'bg-white/5 border-white/10 hover:border-pink-500/30 hover:bg-white/10'
                            }`}
                    >
                        <div className="text-xs text-gray-500 mb-1">提示词 {key.toUpperCase()}</div>
                        <div className="text-white text-sm font-mono">"{q[key]}"</div>
                        {answered && key === q.answer && <div className="text-green-400 text-xs mt-1">✅ 这个更好！</div>}
                    </button>
                ))}
            </div>

            {answered && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNext}
                    className="w-full mt-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                    {current < questions.length - 1 ? '下一题 →' : '全部完成 ✓'}
                </motion.button>
            )}
        </motion.div>
    );
}

// ── 互动3: 元认知镜子 ──
function MetaCognitionGame({ onComplete }: { onComplete: () => void }) {
    const layers = [
        { level: 1, question: '你想问AI什么？', example: '帮我写一首诗', color: 'from-blue-500/20 to-blue-500/5' },
        { level: 2, question: '你为什么这么问？', example: '因为我想送给妈妈当生日礼物', color: 'from-purple-500/20 to-purple-500/5' },
        { level: 3, question: '有没有更好的问法？', example: '写一首感恩妈妈的诗，用孩子的口吻，押韵，8行以内', color: 'from-pink-500/20 to-pink-500/5' },
    ];
    const [revealed, setRevealed] = useState(0);

    const handleReveal = () => {
        if (revealed < 3) setRevealed(r => r + 1);
        if (revealed === 2) setTimeout(onComplete, 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 元认知镜子</h3>
            <p className="text-gray-400 text-sm mb-4">逐层深入思考你的思考过程</p>

            <div className="space-y-3">
                {layers.map((l, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: i < revealed ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${l.color} border border-white/10 ${i >= revealed ? 'blur-[2px]' : ''}`}
                    >
                        <div className="text-xs text-gray-500 mb-1">第 {l.level} 层思考 🧠</div>
                        <div className="text-white font-bold text-sm">{l.question}</div>
                        {i < revealed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 text-sm mt-2 font-mono">
                                → "{l.example}"
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {revealed < 3 && (
                <button onClick={handleReveal} className="w-full mt-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold">
                    揭开第 {revealed + 1} 层 🔮
                </button>
            )}
            {revealed === 3 && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 你刚刚做了一次「元认知」——思考你自己的思考方式！
                </div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function PromptBuilderScene() {
    const [activeGame, setActiveGame] = useState<'builder' | 'pk' | 'meta' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#2a1a3e] to-[#0a1a2e] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'builder' && <PromptBuilderGame key="b" onComplete={() => handleComplete('builder')} />}
                {activeGame === 'pk' && <PromptPKGame key="p" onComplete={() => handleComplete('pk')} />}
                {activeGame === 'meta' && <MetaCognitionGame key="m" onComplete={() => handleComplete('meta')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">🎯 提问的艺术 · 互动环节</h2>
                        {[
                            { key: 'builder' as const, icon: '🧩', title: '提示词拼装工坊', desc: '5个组件拼成完美提示词' },
                            { key: 'pk' as const, icon: '⚔️', title: '好坏提示词PK', desc: '选出更好的提示词' },
                            { key: 'meta' as const, icon: '🪞', title: '元认知镜子', desc: '逐层深入思考' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-yellow-500/30'}`}>
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
