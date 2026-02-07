'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── 互动1: 大象拆解器 ──
function ElephantSplitterGame({ onComplete }: { onComplete: () => void }) {
    interface Block { id: string; text: string; children?: Block[]; split: boolean; done: boolean; }

    const [tree, setTree] = useState<Block>({
        id: 'root', text: '🌐 做一个班级新闻网站', split: false, done: false,
        children: [
            {
                id: 'a', text: '📄 新闻列表页', split: false, done: false, children: [
                    { id: 'a1', text: '标题', split: false, done: false },
                    { id: 'a2', text: '图片', split: false, done: false },
                    { id: 'a3', text: '日期', split: false, done: false },
                ]
            },
            {
                id: 'b', text: '📝 新闻详情页', split: false, done: false, children: [
                    { id: 'b1', text: '正文', split: false, done: false },
                    { id: 'b2', text: '作者', split: false, done: false },
                ]
            },
            {
                id: 'c', text: '✏️ 发布功能', split: false, done: false, children: [
                    { id: 'c1', text: '输入框', split: false, done: false },
                    { id: 'c2', text: '提交按钮', split: false, done: false },
                ]
            },
            {
                id: 'd', text: '💬 评论功能', split: false, done: false, children: [
                    { id: 'd1', text: '评论列表', split: false, done: false },
                    { id: 'd2', text: '发表评论', split: false, done: false },
                ]
            },
        ],
    });

    const [splitLevel, setSplitLevel] = useState(0); // 0=未拆, 1=拆到子任务, 2=拆到最小

    const handleSplit = () => {
        if (splitLevel === 0) {
            setSplitLevel(1);
        } else if (splitLevel === 1) {
            setSplitLevel(2);
            setTimeout(onComplete, 3000);
        }
    };

    const renderBlocks = () => {
        if (splitLevel === 0) {
            return (
                <motion.div layoutId="root" className="p-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-center cursor-pointer hover:bg-red-500/20 transition-all" onClick={handleSplit}>
                    <div className="text-4xl mb-2">🐘</div>
                    <div className="text-white font-bold text-lg">{tree.text}</div>
                    <div className="text-red-400 text-xs mt-2">😱 好难！不知道从哪开始...</div>
                    <div className="text-gray-500 text-xs mt-1">（点击拆解大象）</div>
                </motion.div>
            );
        }

        if (splitLevel === 1) {
            return (
                <div className="space-y-2">
                    <div className="text-gray-500 text-xs mb-2 text-center">拆成 4 个子任务 👇</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tree.children!.map(c => (
                            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-white font-bold text-center cursor-pointer hover:bg-yellow-500/20"
                                onClick={handleSplit}
                            >
                                {c.text}
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-gray-500 text-xs text-center mt-2">（点击继续拆解到最小）</div>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="text-gray-500 text-xs mb-2 text-center">每个子任务再拆成最小模块 ✅</div>
                {tree.children!.map(c => (
                    <div key={c.id}>
                        <div className="text-xs text-yellow-400 font-bold mb-1">{c.text}</div>
                        <div className="flex flex-wrap gap-1">
                            {c.children!.map(gc => (
                                <motion.span key={gc.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                                    className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs font-bold"
                                >
                                    ✅ {gc.text}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="mt-2 p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🎉 一个吓人的大项目变成了 9 个简单的小任务！
                </div>
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-4">🎮 大象拆解器</h3>
            {renderBlocks()}
        </motion.div>
    );
}

// ── 互动2: 乐高拼装器 ──
function LegoBuilderGame({ onComplete }: { onComplete: () => void }) {
    const pieces = ['🏠 首页', '📰 新闻', '✍️ 编辑', '💬 评论', '👤 用户', '⚙️ 设置'];
    const [placed, setPlaced] = useState<number[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    const handlePlace = () => {
        if (selected !== null && !placed.includes(selected)) {
            setPlaced([...placed, selected]);
            setSelected(null);
            if (placed.length === 5) setTimeout(onComplete, 2000); // 最后一个
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 乐高拼装器</h3>
            <p className="text-gray-400 text-sm mb-4">选择模块，一块块拼成完整的网站</p>

            {/* 可用积木 */}
            <div className="flex flex-wrap gap-2 mb-4">
                {pieces.map((p, i) => !placed.includes(i) && (
                    <button key={i} onClick={() => setSelected(i)}
                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${selected === i ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {selected !== null && (
                <button onClick={handlePlace} className="w-full py-2 mb-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold">
                    放置「{pieces[selected]}」到网站 🧱
                </button>
            )}

            {/* 建造区 */}
            <div className="grid grid-cols-3 gap-1 p-3 bg-white/5 rounded-xl min-h-[80px]">
                {placed.map(i => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                        className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded text-xs text-white font-bold text-center"
                    >
                        {pieces[i]}
                    </motion.div>
                ))}
            </div>

            {placed.length === pieces.length && (
                <div className="mt-3 p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    🏰 完美！6 块积木拼成了一个完整的网站！
                </div>
            )}
        </motion.div>
    );
}

// ── 互动3: MECE 切割器 ──
function MECECutterGame({ onComplete }: { onComplete: () => void }) {
    const [cuts, setCuts] = useState(0);
    const maxCuts = 4;
    const sliceAngles = Array.from({ length: cuts }, (_, i) => (360 / cuts) * i);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg mx-auto">
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎮 MECE 披萨切割器</h3>
            <p className="text-gray-400 text-sm mb-4">不重叠、不遗漏地切披萨。点击切刀！</p>

            <div className="relative w-48 h-48 mx-auto mb-4">
                {/* 披萨 */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-600 to-orange-700 border-4 border-yellow-500/50 shadow-lg flex items-center justify-center">
                    <span className="text-4xl">🍕</span>
                </div>
                {/* 切线 */}
                {Array.from({ length: cuts }, (_, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute top-1/2 left-1/2 w-full h-[2px] bg-white/60 origin-left"
                        style={{ transform: `rotate(${(180 / Math.max(cuts, 1)) * i}deg) translateX(-50%)`, width: '100%', left: '50%', transformOrigin: '0% 50%' }}
                    />
                ))}
            </div>

            <div className="text-center mb-3">
                <span className="text-3xl font-bold text-yellow-400">{cuts === 0 ? 1 : cuts * 2} 块</span>
                <div className="text-xs text-gray-500 mt-1">
                    {cuts === 0 ? '还没切呢' : cuts < maxCuts ? '继续切！' : '完美的 MECE 切割！不重叠、不遗漏'}
                </div>
            </div>

            {cuts < maxCuts ? (
                <button onClick={() => { setCuts(c => c + 1); if (cuts === maxCuts - 1) setTimeout(onComplete, 2000); }}
                    className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 font-bold">
                    🔪 切一刀！
                </button>
            ) : (
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 text-sm text-center font-bold">
                    ✅ MECE = Mutually Exclusive, Collectively Exhaustive（不重叠、不遗漏）
                </div>
            )}
        </motion.div>
    );
}

// ── 主场景 ──
export default function ElephantScene() {
    const [activeGame, setActiveGame] = useState<'split' | 'lego' | 'mece' | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const handleComplete = (g: string) => { setCompleted(prev => new Set(prev).add(g)); setActiveGame(null); };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0a] via-[#1a2a1a] to-[#0a1a2a] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {activeGame === 'split' && <ElephantSplitterGame key="s" onComplete={() => handleComplete('split')} />}
                {activeGame === 'lego' && <LegoBuilderGame key="l" onComplete={() => handleComplete('lego')} />}
                {activeGame === 'mece' && <MECECutterGame key="m" onComplete={() => handleComplete('mece')} />}
                {activeGame === null && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 md:gap-4 px-4 md:px-0 max-w-md w-full">
                        <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">🧩 拆解大象 · 互动环节</h2>
                        {[
                            { key: 'split' as const, icon: '🐘', title: '大象拆解器', desc: '把大任务拆成小积木' },
                            { key: 'lego' as const, icon: '🧱', title: '乐高拼装器', desc: '选模块拼出完整网站' },
                            { key: 'mece' as const, icon: '🍕', title: 'MECE切割器', desc: '不重叠、不遗漏地切披萨' },
                        ].map(g => (
                            <motion.button key={g.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveGame(g.key)}
                                className={`p-4 rounded-xl border text-left transition-all ${completed.has(g.key) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-emerald-500/30'}`}>
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
