'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 大象拆解器 ──
function ElephantSplitterGame() {
    const [level, setLevel] = useState(0);
    const tree = [
        { label: '🐘 做一个班级新闻网站', children: null },
        { label: '📄 新闻列表 / 📝 发布功能 / 💬 评论功能 / 👤 个人中心', children: 4 },
        { label: '标题+图片+日期 / 编辑器+提交 / 输入框+显示 / 头像+设置', children: 8 },
    ];

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🐘 大象拆解器</h3>
            <p className="text-gray-400 text-sm mb-4">点击拆解，把大问题变成小问题</p>
            <div className="space-y-3 mb-4">
                {tree.slice(0, level + 1).map((node, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className={`p-3 rounded-xl border ${i === 0 ? 'bg-red-500/10 border-red-500/20' : i === 1 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                        <div className="text-xs text-gray-400 mb-1">第{i + 1}层拆解</div>
                        <div className="text-white text-sm font-bold">{node.label}</div>
                        {node.children && <div className="text-gray-500 text-xs mt-1">→ 拆成了 {node.children} 个小任务</div>}
                    </motion.div>
                ))}
            </div>
            {level < tree.length - 1 ? (
                <button onClick={() => setLevel(l => l + 1)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    ✂️ 继续拆解！
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 一头大象被拆成了8块小积木！每块都很简单。这就是模块化思维。
                </div>
            )}
        </>
    );
}

// ── 互动2: 乐高拼装器 ──
function LegoBuilderGame() {
    const parts = [
        { id: 'header', label: '🧱 网页头部', color: 'bg-blue-500/20 border-blue-500/30' },
        { id: 'list', label: '🧱 新闻列表', color: 'bg-green-500/20 border-green-500/30' },
        { id: 'detail', label: '🧱 文章详情', color: 'bg-yellow-500/20 border-yellow-500/30' },
        { id: 'comment', label: '🧱 评论区域', color: 'bg-purple-500/20 border-purple-500/30' },
        { id: 'footer', label: '🧱 网页底部', color: 'bg-pink-500/20 border-pink-500/30' },
    ];
    const [placed, setPlaced] = useState<string[]>([]);

    const handlePlace = (id: string) => {
        if (!placed.includes(id)) setPlaced([...placed, id]);
    };

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🧩 乐高拼装器</h3>
            <p className="text-gray-400 text-sm mb-3">按顺序点击积木，拼装你的网站</p>
            <div className="grid grid-cols-5 gap-1 mb-4">
                {parts.map(p => (
                    <button key={p.id} onClick={() => handlePlace(p.id)} disabled={placed.includes(p.id)}
                        className={`p-2 rounded-lg text-xs text-center border transition-all ${placed.includes(p.id) ? 'opacity-30' : p.color}`}>
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="space-y-1 min-h-[120px]">
                <div className="text-xs text-gray-400 mb-2">🏗️ 你的网站：</div>
                {placed.map(id => {
                    const part = parts.find(p => p.id === id)!;
                    return (
                        <motion.div key={id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className={`p-2 rounded border text-xs text-white text-center ${part.color}`}>
                            {part.label}
                        </motion.div>
                    );
                })}
            </div>
            {placed.length === parts.length && (
                <div className="mt-2 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 网站拼装完成！每块积木独立完成，组合起来就是完整产品。
                </div>
            )}
        </>
    );
}

// ── 互动3: MECE 切割器 ──
function MECECutterGame() {
    const [cuts, setCuts] = useState(0);
    const maxCuts = 4;
    const slices = ['👩‍🎓 学生', '👨‍🏫 老师', '👨‍👩‍👧 家长', '🧑‍💼 访客'];

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🍕 MECE 切割器</h3>
            <p className="text-gray-400 text-sm mb-4">把学校里的人不重叠、不遗漏地分类</p>
            <div className="relative h-40 flex items-center justify-center mb-3">
                <div className="relative w-36 h-36">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20" />
                    {slices.slice(0, cuts).map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute text-center" style={{
                                top: `${50 + 35 * Math.sin(i * Math.PI / 2)}%`,
                                left: `${50 + 35 * Math.cos(i * Math.PI / 2)}%`,
                                transform: 'translate(-50%, -50%)',
                            }}>
                            <div className="text-xs text-white bg-black/50 rounded px-2 py-1">{s}</div>
                        </motion.div>
                    ))}
                    {cuts === 0 && <div className="absolute inset-0 flex items-center justify-center text-3xl">🏫</div>}
                </div>
            </div>
            {cuts < maxCuts ? (
                <button onClick={() => setCuts(c => c + 1)}
                    className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold text-sm">
                    ✂️ 切一刀（{cuts}/{maxCuts}）
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎯 完美MECE切割！4类人不重叠、不遗漏，涵盖了学校里所有人。
                </div>
            )}
        </>
    );
}

export default function ElephantScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'lego' ? <LegoBuilderGame /> :
                    game === 'mece' ? <MECECutterGame /> :
                        <ElephantSplitterGame />}
            </motion.div>
        </div>
    );
}
