'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Bot, AlertTriangle, Briefcase, User, ArrowRight, BookOpen } from 'lucide-react';
import { DialogueLine } from '@/store/gameStore';

interface DialogueBoxProps {
    line: DialogueLine | null;
    onNext: () => void;
    isLastDialogue?: boolean;
}

// 将 avatar/speaker 映射到 Lucide 图标
function getSpeakerIcon(speaker: string, avatar: string) {
    // 优先使用语义标签
    if (avatar === 'bot' || /小智|AI 顾问|顾问/.test(speaker)) return <Bot size={20} className="text-[var(--accent-gold)]" />;
    if (avatar === 'alert' || speaker === '系统') return <AlertTriangle size={20} className="text-amber-400" />;
    if (avatar === 'case' || speaker === '案例') return <Briefcase size={20} className="text-[var(--accent-teal)]" />;
    if (avatar === 'persona' || /总|经理|老板/.test(speaker)) return <User size={20} className="text-purple-400" />;
    // 旧版 emoji 兜底
    if (/🤖/.test(avatar)) return <Bot size={20} className="text-[var(--accent-gold)]" />;
    if (/⚠️|💰|✨|📝/.test(avatar)) return <AlertTriangle size={20} className="text-amber-400" />;
    if (/🧸|🔧|⚔️|🧐|🎨|🇨🇳|🧠|🧮|🎓/.test(avatar)) return <BookOpen size={20} className="text-[var(--accent-teal)]" />;
    return <Bot size={20} className="text-[var(--accent-gold)]" />;
}

function getSpeakerColor(speaker: string, avatar: string): string {
    if (avatar === 'bot' || /小智|AI 顾问|顾问/.test(speaker) || /🤖/.test(avatar)) return 'var(--accent-gold)';
    if (avatar === 'alert' || speaker === '系统' || /⚠️/.test(avatar)) return 'rgb(251, 191, 36)';
    if (avatar === 'case' || speaker === '案例') return 'var(--accent-teal)';
    if (avatar === 'persona' || /总|经理/.test(speaker)) return 'rgb(192, 132, 252)';
    return 'var(--accent-gold)';
}

export default function DialogueBox({ line, onNext, isLastDialogue = false }: DialogueBoxProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // 打字机效果
    useEffect(() => {
        if (!line) return;
        setDisplayedText('');
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
            if (i < line.text.length) {
                setDisplayedText(line.text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 25);
        return () => clearInterval(interval);
    }, [line]);

    const handleClick = useCallback(() => {
        if (isTyping && line) {
            setDisplayedText(line.text);
            setIsTyping(false);
        } else {
            onNext();
        }
    }, [isTyping, line, onNext]);

    // 键盘支持
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleClick();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleClick]);

    if (!line) return null;

    const speakerColor = getSpeakerColor(line.speaker, line.avatar);

    return (
        <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 w-full z-50"
        >
            <div
                className="glass border-t border-[var(--border-subtle)] px-4 py-4 md:px-8 md:py-6 cursor-pointer min-h-[100px] md:min-h-[160px] flex items-start gap-3 md:gap-5"
                style={{ background: 'rgba(10, 10, 10, 0.92)', backdropFilter: 'blur(24px)' }}
                onClick={handleClick}
            >
                {/* Avatar 图标 */}
                <div
                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: `${speakerColor}10`,
                        border: `1px solid ${speakerColor}30`,
                    }}
                >
                    {getSpeakerIcon(line.speaker, line.avatar)}
                </div>

                {/* 文本区域 */}
                <div className="flex-1 flex flex-col justify-center min-h-[50px] md:min-h-[90px]">
                    <div
                        className="font-semibold mb-1 md:mb-2 text-[10px] md:text-xs tracking-[0.2em] uppercase"
                        style={{ color: speakerColor, fontFamily: 'var(--font-heading)' }}
                    >
                        {line.speaker}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={line.text.slice(0, 20)}
                            className="text-[var(--text-primary)] text-sm md:text-lg leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {displayedText}
                            {isTyping && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6 }}
                                    className="inline-block ml-0.5 w-[2px] h-4 md:h-5"
                                    style={{ background: speakerColor }}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 继续按钮 */}
                {!isTyping && (
                    <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="self-end flex-shrink-0"
                    >
                        {isLastDialogue ? (
                            <div className="bg-[var(--accent-gold)] text-black px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 shadow-[0_0_16px_rgba(202,138,4,0.25)]">
                                <span>下一课</span>
                                <ArrowRight size={14} />
                            </div>
                        ) : (
                            <div className="glass px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30 transition-colors">
                                <span>继续</span>
                                <ArrowRight size={14} />
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
