'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { DialogueLine } from '@/store/gameStore';

interface DialogueBoxProps {
    line: DialogueLine | null;
    onNext: () => void;
}

export default function DialogueBox({ line, onNext }: DialogueBoxProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Typewriter effect
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
        }, 30);
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

    // Keyboard support
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

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 w-full z-50"
        >
            <div
                className="bg-black/90 backdrop-blur-xl border-t-2 border-pink-500/50 px-4 py-3 md:px-8 md:py-6 cursor-pointer min-h-[120px] md:min-h-[180px] flex items-start gap-3 md:gap-5"
                onClick={handleClick}
            >
                {/* Avatar */}
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-800 border-2 border-cyan-400 flex items-center justify-center text-xl md:text-3xl flex-shrink-0 shadow-lg shadow-cyan-500/20">
                    {line.avatar}
                </div>

                {/* Text */}
                <div className="flex-1 flex flex-col justify-center min-h-[60px] md:min-h-[100px]">
                    <div className="text-cyan-400 font-bold mb-1 md:mb-2 text-xs md:text-sm tracking-widest uppercase">
                        {line.speaker}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={displayedText.slice(0, 10)}
                            className="text-white text-base md:text-xl leading-relaxed"
                        >
                            {displayedText}
                            {isTyping && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="inline-block ml-1 w-2 h-5 bg-white"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Next indicator */}
                {!isTyping && (
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="self-end"
                    >
                        <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-pink-500/30">
                            <span>继续</span>
                            <span>▶</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
