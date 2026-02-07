'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 提示词拼装工坊 ──
function PromptBuilderGame() {
    const parts = [
        { id: 'role', label: '🎭 角色', text: '你是一位儿童科普作家' },
        { id: 'context', label: '📖 背景', text: '要给8-12岁的孩子解释' },
        { id: 'task', label: '📝 任务', text: '写一段300字的说明' },
        { id: 'format', label: '📐 格式', text: '用比喻和例子，分3段' },
        { id: 'constraint', label: '🚧 限制', text: '不用专业术语' },
    ];
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [scored, setScored] = useState(false);
    const score = Math.min(selected.size * 20, 100);

    const toggle = (id: string) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🧩 提示词拼装工坊</h3>
            <p className="text-gray-400 text-sm mb-4">选择你认为好提示词应该包含的要素</p>
            <div className="space-y-2 mb-4">
                {parts.map(p => (
                    <button key={p.id} onClick={() => toggle(p.id)}
                        className={`w-full p-3 rounded-lg text-left text-sm transition-all ${selected.has(p.id) ? 'bg-cyan-500/20 border border-cyan-500/30 text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                        <span className="font-bold">{p.label}</span>: {p.text}
                    </button>
                ))}
            </div>
            {!scored && selected.size > 0 && (
                <button onClick={() => setScored(true)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    查看得分 📊
                </button>
            )}
            {scored && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 p-3 bg-white/5 rounded-lg text-center">
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">{score}分</div>
                    <div className="text-xs text-gray-400 mt-1">{score === 100 ? '🎉 完美！你已掌握提示词公式！' : '💡 提示：5个要素全选才能得满分'}</div>
                </motion.div>
            )}
        </>
    );
}

// ── 互动2: 好坏提示词 PK ──
function PromptPKGame() {
    const rounds = [
        { topic: '写日记', a: '帮我写日记', b: '我是10岁男孩，今天去了动物园，看到大象喷水很震撼。用第一人称写200字日记', answer: 'b' },
        { topic: '画海报', a: '给学校运动会画一张卡通海报，蓝色主题，包含跑步剪影和奖杯', b: '画张海报', answer: 'a' },
        { topic: '讲故事', a: '讲个故事', b: '给5岁小孩讲一个3分钟的睡前故事，主角是一只害怕黑暗的小猫', answer: 'b' },
    ];
    const [currentRound, setCurrentRound] = useState(0);
    const [choices, setChoices] = useState<string[]>([]);
    const [revealed, setRevealed] = useState<Set<number>>(new Set());

    const handleChoice = (c: 'a' | 'b') => {
        if (revealed.has(currentRound)) return;
        setChoices(prev => { const n = [...prev]; n[currentRound] = c; return n; });
        setRevealed(prev => new Set(prev).add(currentRound));
    };

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">⚡ 提示词 PK</h3>
            <div className="flex gap-2 mb-4">
                {rounds.map((r, i) => (
                    <button key={i} onClick={() => setCurrentRound(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${currentRound === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        {r.topic} {revealed.has(i) && (choices[i] === r.answer ? '✓' : '✗')}
                    </button>
                ))}
            </div>
            <p className="text-gray-400 text-sm mb-3">哪个提示词更好？点击选择：</p>
            <div className="space-y-2">
                <button onClick={() => handleChoice('a')} className={`w-full p-3 rounded-lg text-left text-sm border transition-all ${revealed.has(currentRound) ? (rounds[currentRound].answer === 'a' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/30 bg-red-500/5') : 'border-white/10 bg-white/5 hover:border-cyan-500/30'}`}>
                    <span className="font-bold text-cyan-400">A: </span><span className="text-white">{rounds[currentRound].a}</span>
                </button>
                <button onClick={() => handleChoice('b')} className={`w-full p-3 rounded-lg text-left text-sm border transition-all ${revealed.has(currentRound) ? (rounds[currentRound].answer === 'b' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/30 bg-red-500/5') : 'border-white/10 bg-white/5 hover:border-cyan-500/30'}`}>
                    <span className="font-bold text-pink-400">B: </span><span className="text-white">{rounds[currentRound].b}</span>
                </button>
            </div>
            {revealed.has(currentRound) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    {choices[currentRound] === rounds[currentRound].answer ? '✅ 正确！' : '❌ 再想想？'} 好提示词的关键是：具体、有角色、有格式。
                </motion.div>
            )}
        </>
    );
}

// ── 互动3: 元认知镜子 ──
function MetaCognitionGame() {
    const layers = [
        { q: '你想用AI做什么？', example: '写一篇读书笔记', color: 'from-blue-500/20' },
        { q: '你怎么提问才能得到好结果？', example: '给AI设定角色+背景+任务', color: 'from-purple-500/20' },
        { q: '你怎么评估AI的回答？', example: '检查逻辑、事实、是否切题', color: 'from-pink-500/20' },
    ];
    const [revealed, setRevealed] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🪞 元认知镜子</h3>
            <p className="text-gray-400 text-sm mb-4">层层深入，看看你的思维有几层</p>
            <div className="space-y-3">
                {layers.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0.3 }} animate={{ opacity: i <= revealed ? 1 : 0.3 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${l.color} to-transparent border border-white/10`}>
                        <div className="text-white text-sm font-bold mb-1">第{i + 1}层: {l.q}</div>
                        {i <= revealed && <div className="text-gray-400 text-xs">💡 例如: {l.example}</div>}
                    </motion.div>
                ))}
            </div>
            {revealed < layers.length - 1 && (
                <button onClick={() => setRevealed(r => r + 1)}
                    className="w-full mt-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-sm">
                    揭开下一层 🧅
                </button>
            )}
            {revealed >= layers.length - 1 && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 三层元认知全部解锁！普通人只到第1层，高手能到第3层。你已经是高手了！
                </div>
            )}
        </>
    );
}

export default function PromptBuilderScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'pk' ? <PromptPKGame /> :
                    game === 'meta' ? <MetaCognitionGame /> :
                        <PromptBuilderGame />}
            </motion.div>
        </div>
    );
}
