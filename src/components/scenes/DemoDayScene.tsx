'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 好故事选择器 ──
function StoryPickerGame() {
    const stories = [
        { id: 'bad', text: '我做了一个AI工具，它很厉害。', style: '平淡技术描述', score: 3, emoji: '😐' },
        { id: 'good', text: '我发现我妈妈每天花2小时整理购物清单，很辛苦。所以我做了一个AI助手来帮她。现在她每天省下1小时陪我。', style: '痛点共情故事', score: 9, emoji: '🥰' },
    ];
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">📖 好故事选择器</h3>
            <p className="text-gray-400 text-sm mb-4">哪个开场白更能打动人？</p>
            <div className="space-y-3 mb-3">
                {stories.map(s => (
                    <button key={s.id} onClick={() => setSelected(s.id)}
                        className={`w-full p-4 rounded-xl text-left border transition-all ${selected === s.id ? (s.id === 'good' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10') : 'border-white/10 bg-white/5'}`}>
                        <div className="text-white text-sm mb-2">{s.text}</div>
                        {selected === s.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <span className="text-xl">{s.emoji}</span>
                                <div>
                                    <span className="text-xs text-gray-400">{s.style}</span>
                                    <div className="text-yellow-400 text-xs font-bold">感染力: {s.score}/10</div>
                                </div>
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>
            {selected && (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    💡 好故事的秘诀：先讲痛点，再讲方案，最后讲效果。让听众先共情再理解。
                </div>
            )}
        </>
    );
}

// ── 互动2: 演示排序器 ──
function DemoSorterGame() {
    const correctOrder = ['痛点故事', '现场演示', '用户反馈', '未来展望'];
    const [items, setItems] = useState(['未来展望', '现场演示', '痛点故事', '用户反馈']);
    const [checked, setChecked] = useState(false);

    const moveUp = (i: number) => {
        if (i === 0) return;
        const next = [...items];
        [next[i], next[i - 1]] = [next[i - 1], next[i]];
        setItems(next);
    };

    const isCorrect = items.every((item, i) => item === correctOrder[i]);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🔢 演示排序器</h3>
            <p className="text-gray-400 text-sm mb-4">按正确顺序排列产品发布会的流程</p>
            <div className="space-y-2 mb-3">
                {items.map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs w-4">{i + 1}.</span>
                        <div className={`flex-1 p-2 rounded-lg border text-sm text-white ${checked ? (item === correctOrder[i] ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10') : 'border-white/10 bg-white/5'}`}>
                            {item}
                        </div>
                        {!checked && i > 0 && (
                            <button onClick={() => moveUp(i)} className="text-gray-400 hover:text-white text-lg">⬆️</button>
                        )}
                    </div>
                ))}
            </div>
            {!checked ? (
                <button onClick={() => setChecked(true)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    ✅ 确认排序
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    {isCorrect ? '🎉 完美排序！' : '💡 正确顺序: 痛点故事 → 现场演示 → 用户反馈 → 未来展望'}
                </div>
            )}
        </>
    );
}

// ── 互动3: Slogan 生成器 ──
function SloganGeneratorGame() {
    const templates = [
        { prefix: '让', suffix: '变得简单', placeholder: '整理笔记' },
        { prefix: '从此不再为', suffix: '烦恼', placeholder: '忘记单词' },
        { prefix: '一键', suffix: '，省出时间做更棒的事', placeholder: '整理作业' },
    ];
    const [selected, setSelected] = useState(0);
    const [input, setInput] = useState('');
    const [generated, setGenerated] = useState(false);

    const slogan = `${templates[selected].prefix}${input || templates[selected].placeholder}${templates[selected].suffix}`;

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">✨ Slogan 生成器</h3>
            <p className="text-gray-400 text-sm mb-4">为你的产品想一句响亮的口号</p>
            <div className="flex gap-2 mb-3">
                {templates.map((_, i) => (
                    <button key={i} onClick={() => setSelected(i)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold ${selected === i ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                        模板{i + 1}
                    </button>
                ))}
            </div>
            <div className="p-3 bg-white/5 rounded-lg mb-3">
                <span className="text-gray-400 text-sm">{templates[selected].prefix}</span>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={templates[selected].placeholder}
                    className="bg-transparent border-b border-pink-500/50 text-pink-400 font-bold text-sm outline-none mx-1 w-24 text-center" />
                <span className="text-gray-400 text-sm">{templates[selected].suffix}</span>
            </div>
            {!generated ? (
                <button onClick={() => setGenerated(true)}
                    className="w-full py-2 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/30 rounded-lg text-white font-bold text-sm">
                    🚀 生成 Slogan
                </button>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-xl border border-pink-500/20 text-center">
                    <div className="text-xl font-extrabold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        {slogan}
                    </div>
                    <div className="text-gray-500 text-xs mt-2">这就是你产品的灵魂！一句好 Slogan 胜过千言万语。</div>
                </motion.div>
            )}
        </>
    );
}

export default function DemoDayScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'demo' ? <DemoSorterGame /> :
                    game === 'slogan' ? <SloganGeneratorGame /> :
                        <StoryPickerGame />}
            </motion.div>
        </div>
    );
}
