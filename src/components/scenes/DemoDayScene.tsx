'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 好故事选择器 ──
function StoryPickerGame({ onComplete }: { onComplete: () => void }) {
    const stories = [
        {
            id: 'good',
            text: '我妈妈每天要列3张购物清单，总是忘记买东西。我想：能不能让AI帮她记住？于是我做了一个「智能购物助手」，现在她再也不会忘了。',
            grade: 'A',
            feedback: '✅ 完美！有场景 + 有痛点 + 有解决方案 + 有结果。听众能立刻共情。',
        },
        {
            id: 'ok',
            text: '我做了一个AI购物助手，它可以使用GPT-4模型，调用了3个API接口，支持自然语言处理...',
            grade: 'C',
            feedback: '❌ 太技术了！听众不关心你用什么模型，他们关心你解决了什么问题。',
        },
        {
            id: 'bad',
            text: '我做了一个应用程序。',
            grade: 'F',
            feedback: '❌ 太简单了！没有故事、没有细节、没有感情。听众完全无法被打动。',
        },
    ];
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 好故事选择器</h3>
            <p className="text-gray-400 text-sm mb-4">哪个开场白最能打动观众？</p>

            <div className="space-y-3">
                {stories.map(s => (
                    <button key={s.id} onClick={() => { setSelected(s.id); if (s.id === 'good') setTimeout(onComplete, 3000); }}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selected === s.id ? (s.grade === 'A' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-white/5 border-white/10 hover:border-pink-500/30'}`}
                    >
                        <div className="text-white text-sm leading-relaxed">"{s.text}"</div>
                        {selected === s.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.grade === 'A' ? 'bg-green-500/20 text-green-400' : s.grade === 'C' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {s.grade}级
                                </span>
                                <div className="text-xs text-gray-400 mt-1">{s.feedback}</div>
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

// ── 互动2: 演示排序器 ──
function DemoSorterGame({ onComplete }: { onComplete: () => void }) {
    const correctOrder = ['story', 'demo', 'testimonial'];
    const labels: Record<string, { emoji: string; text: string; desc: string }> = {
        story: { emoji: '📖', text: '讲故事', desc: '用真实场景引发共鸣' },
        demo: { emoji: '🖥️', text: '现场演示', desc: '让产品自己说话' },
        testimonial: { emoji: '💬', text: '用户反馈', desc: '真实用户的真实体验' },
    };
    const [order, setOrder] = useState(['testimonial', 'story', 'demo']); // 初始打乱
    const [checked, setChecked] = useState(false);

    const moveUp = (i: number) => {
        if (i === 0 || checked) return;
        const next = [...order];
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        setOrder(next);
    };

    const handleCheck = () => {
        setChecked(true);
        const isCorrect = order.every((o, i) => o === correctOrder[i]);
        if (isCorrect) setTimeout(onComplete, 2500);
    };

    const isCorrectOrder = order.every((o, i) => o === correctOrder[i]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 演示排序器</h3>
            <p className="text-gray-400 text-sm mb-4">发布会的三步曲，正确顺序是什么？点击 ↑ 向上移动</p>

            <div className="space-y-2 mb-4">
                {order.map((key, i) => {
                    const item = labels[key];
                    return (
                        <div key={key} className="flex items-center gap-2">
                            <button onClick={() => moveUp(i)} disabled={i === 0 || checked}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                            >
                                ↑
                            </button>
                            <motion.div layoutId={key}
                                className={`flex-1 p-3 rounded-xl border flex items-center gap-3 ${checked ? (key === correctOrder[i] ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30') : 'bg-white/5 border-white/10'}`}
                            >
                                <span className="text-2xl">{item.emoji}</span>
                                <div>
                                    <div className="text-white font-bold text-sm">{i + 1}. {item.text}</div>
                                    <div className="text-gray-500 text-xs">{item.desc}</div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {!checked ? (
                <button onClick={handleCheck} className="w-full py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-bold">
                    检查顺序 📊
                </button>
            ) : isCorrectOrder ? (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 完美顺序！先讲故事引发共鸣 → 再演示产品 → 最后用户反馈增加信任！
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400 text-sm text-center">
                        顺序不太对哦。正确顺序是：📖故事 → 🖥️演示 → 💬反馈
                    </div>
                    <button onClick={() => { setOrder(correctOrder); setChecked(false); }}
                        className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                        重试 🔄
                    </button>
                </div>
            )}
        </motion.div>
    );
}

// ── 互动3: Slogan 生成器 ──
function SloganGeneratorGame({ onComplete }: { onComplete: () => void }) {
    const templates = [
        { part: '让', placeholder: '谁', value: '' },
        { part: '不再', placeholder: '什么烦恼', value: '' },
        { part: '只需要', placeholder: '怎么做', value: '' },
    ];
    const [parts, setParts] = useState(templates.map(t => t.value));
    const [generated, setGenerated] = useState(false);

    const examples = [
        ['妈妈', '忘记买东西', '对手机说一句话'],
        ['同学们', '背不住单词', '每天5分钟'],
        ['爸爸', '加班写报告', '告诉AI你想说什么'],
    ];
    const [exampleIndex, setExampleIndex] = useState(0);

    const handleAutoFill = () => {
        const ex = examples[exampleIndex % examples.length];
        setParts(ex);
        setExampleIndex(i => i + 1);
    };

    const handleGenerate = () => {
        setGenerated(true);
        setTimeout(onComplete, 3000);
    };

    const slogan = `让${parts[0] || '___'}不再${parts[1] || '___'}，只需要${parts[2] || '___'}`;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 Slogan 生成器</h3>
            <p className="text-gray-400 text-sm mb-4">用一句话打动所有人——填入关键词</p>

            <div className="space-y-3 mb-4">
                {templates.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm w-16">{t.part}</span>
                        <input type="text" value={parts[i]} maxLength={20}
                            onChange={e => { const n = [...parts]; n[i] = e.target.value; setParts(n); setGenerated(false); }}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50 placeholder:text-gray-600"
                            placeholder={t.placeholder}
                        />
                    </div>
                ))}
            </div>

            <button onClick={handleAutoFill} className="w-full py-1.5 mb-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 text-xs">
                💡 看看示例
            </button>

            {/* 预览 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-center mb-3">
                <div className="text-lg font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {slogan}
                </div>
            </div>

            {!generated && parts.every(p => p.length > 0) && (
                <button onClick={handleGenerate} className="w-full py-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 border border-pink-500/30 rounded-lg text-white font-bold">
                    ✨ 确定这就是我的 Slogan！
                </button>
            )}

            {generated && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold"
                >
                    🎉 恭喜！你完成了整个课程！你已经从一个消费者变成了生产者！🚀
                </motion.div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function DemoDayScene() {
    const [activeGame, setActiveGame] = useState<'story' | 'sorter' | 'slogan' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a] via-[#2a1a1a] to-[#0a0a2a] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'story' && <StoryPickerGame key="s" onComplete={() => handleComplete('story')} />}
                {activeGame === 'sorter' && <DemoSorterGame key="d" onComplete={() => handleComplete('sorter')} />}
                {activeGame === 'slogan' && <SloganGeneratorGame key="sl" onComplete={() => handleComplete('slogan')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-2">🎤 产品发布会 · 互动环节</h2>
                        {[
                            { key: 'story' as const, icon: '📖', title: '好故事选择器', desc: '哪个开场白最打动人？' },
                            { key: 'sorter' as const, icon: '📋', title: '演示排序器', desc: '发布会三步曲顺序' },
                            { key: 'slogan' as const, icon: '✨', title: 'Slogan生成器', desc: '一句话征服所有人' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-red-500/30'}`}>
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
