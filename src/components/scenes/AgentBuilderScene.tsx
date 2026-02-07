'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── 互动1: 痛点选择器 ──
function PainPointGame() {
    const pains = [
        { text: '📝 每天整理课堂笔记要花1小时', score: 9, ai: '用AI自动整理语音转文字' },
        { text: '✍️ 作文里总有错别字', score: 7, ai: '用AI校对器自动检查' },
        { text: '📚 背英语单词总是忘', score: 8, ai: '用AI做个智能复习提醒器' },
        { text: '🎨 想学画画但不知从哪开始', score: 6, ai: '用AI生成练习图和教程' },
    ];
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🎯 痛点选择器</h3>
            <p className="text-gray-400 text-sm mb-4">选一个你最想解决的问题</p>
            <div className="space-y-2 mb-3">
                {pains.map((p, i) => (
                    <button key={i} onClick={() => setSelected(i)}
                        className={`w-full p-3 rounded-lg text-left text-sm border transition-all ${selected === i ? 'border-pink-500/50 bg-pink-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                        {p.text}
                    </button>
                ))}
            </div>
            {selected !== null && !revealed && (
                <button onClick={() => setRevealed(true)}
                    className="w-full py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-bold text-sm">
                    🤖 看看AI怎么解决
                </button>
            )}
            {revealed && selected !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-xs font-bold mb-1">AI解决方案：</div>
                    <div className="text-white text-sm">{pains[selected].ai}</div>
                    <div className="text-gray-500 text-xs mt-2">痛点分数: {pains[selected].score}/10 — 分数越高，AI员工越有价值！</div>
                </motion.div>
            )}
        </>
    );
}

// ── 互动2: AI 员工组装台 ──
function AgentAssemblerGame() {
    const parts = [
        { id: 'role', label: '🎭 角色定义', text: '你是一个专业的课堂笔记整理助手' },
        { id: 'task', label: '📋 任务说明', text: '帮我把语音内容整理成结构化笔记' },
        { id: 'format', label: '📐 输出格式', text: '用Markdown格式，分标题、要点、总结' },
        { id: 'rule', label: '🚧 规则约束', text: '保留关键术语，理整理成通俗易懂的表达' },
    ];
    const [assembled, setAssembled] = useState<string[]>([]);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🤖 AI 员工组装台</h3>
            <p className="text-gray-400 text-sm mb-4">点击零件，一步步组装你的AI员工</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
                {parts.map(p => (
                    <button key={p.id} onClick={() => !assembled.includes(p.id) && setAssembled([...assembled, p.id])}
                        disabled={assembled.includes(p.id)}
                        className={`p-2 rounded-lg text-xs border text-left transition-all ${assembled.includes(p.id) ? 'opacity-30 border-gray-500/20' : 'border-cyan-500/30 bg-cyan-500/10 text-white hover:bg-cyan-500/20'}`}>
                        <div className="font-bold">{p.label}</div>
                    </button>
                ))}
            </div>
            <div className="bg-black/30 rounded-lg p-3 min-h-[80px]">
                <div className="text-xs text-gray-500 mb-2">📝 系统提示词预览：</div>
                {assembled.map(id => {
                    const part = parts.find(p => p.id === id)!;
                    return (
                        <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-cyan-400 mb-1">
                            {part.text}
                        </motion.div>
                    );
                })}
                {assembled.length === 0 && <div className="text-xs text-gray-600">点击上方零件开始组装...</div>}
            </div>
            {assembled.length === parts.length && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 AI员工组装完成！这就是一个完整的系统提示词。
                </div>
            )}
        </>
    );
}

// ── 互动3: MVP 迭代模拟器 ──
function MVPIteratorGame() {
    const versions = [
        { ver: 'v0.1', name: '最小可用版', desc: '只能整理3句话', quality: 20, emoji: '🚀' },
        { ver: 'v0.2', name: '基础版', desc: '能整理一段课文', quality: 45, emoji: '🛠️' },
        { ver: 'v0.3', name: '进阶版', desc: '能自动分段+加标题', quality: 70, emoji: '⚡' },
        { ver: 'v1.0', name: '正式版', desc: '完整笔记+重点标注+复习问题', quality: 95, emoji: '🏆' },
    ];
    const [iteration, setIteration] = useState(0);

    return (
        <>
            <h3 className="text-pink-400 font-bold text-lg mb-2">🔄 MVP 迭代模拟器</h3>
            <p className="text-gray-400 text-sm mb-4">看看产品如何从粗糙到完美</p>
            <motion.div key={iteration} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 mb-3 text-center">
                <div className="text-3xl mb-2">{versions[iteration].emoji}</div>
                <div className="text-cyan-400 font-bold">{versions[iteration].ver} — {versions[iteration].name}</div>
                <div className="text-white text-sm mt-1">{versions[iteration].desc}</div>
                <div className="mt-3 h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                        animate={{ width: `${versions[iteration].quality}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">完成度: {versions[iteration].quality}%</div>
            </motion.div>
            {iteration < versions.length - 1 ? (
                <button onClick={() => setIteration(i => i + 1)}
                    className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 font-bold text-sm">
                    🔄 迭代一次！({iteration + 1}/{versions.length})
                </button>
            ) : (
                <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                    🎉 从粗糙到完美只用了4次迭代！记住：先做出来，再慢慢改。从0到1比从1到100重要一万倍。
                </div>
            )}
        </>
    );
}

export default function AgentBuilderScene({ game }: { game?: string }) {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a2e] via-[#1a1a3e] to-[#0a2a2e] flex items-start justify-center pt-12 pb-56 px-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-lg">
                {game === 'assembler' ? <AgentAssemblerGame /> :
                    game === 'mvp' ? <MVPIteratorGame /> :
                        <PainPointGame />}
            </motion.div>
        </div>
    );
}
