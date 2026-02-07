'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function RuinsScene() {
    const [sacrificed, setSacrificed] = useState(false);

    const handleSacrifice = () => {
        setSacrificed(true);
    };

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 transition-all duration-[2000ms]"
                style={{
                    background: sacrificed
                        ? 'linear-gradient(to bottom, #0a1628 0%, #1a1a3e 40%, #1e3a5f 70%, #2d5a27 100%)'
                        : 'linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 40%, #2a2a2a 70%, #0a0a0a 100%)',
                }}
            />

            {/* Stars / particles */}
            <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`,
                            backgroundColor: sacrificed ? '#00ccff' : '#333',
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2 + Math.random() * 3,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <motion.h2
                    className="text-3xl font-extrabold mb-10 text-white"
                    style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                >
                    ⚖️ 时间交易所
                </motion.h2>

                {/* Balance Scale */}
                <div className="relative w-[400px] flex justify-between items-start">
                    {/* Left Pan - Your Pleasure */}
                    <div className="flex flex-col items-center">
                        <div className="text-pink-400 text-sm mb-3 font-bold">你的快乐</div>
                        <motion.div
                            className="w-24 h-24 rounded-full border-3 border-pink-500/50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            animate={!sacrificed ? { y: [0, -5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <AnimatePresence>
                                {!sacrificed && (
                                    <motion.button
                                        exit={{ scale: 0, rotate: 360, x: 200, opacity: 0 }}
                                        transition={{ duration: 0.8, ease: 'easeIn' }}
                                        onClick={handleSacrifice}
                                        className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                                        title="点击献祭"
                                    >
                                        🎮
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Scale bar */}
                    <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-600" />
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-8 bg-gray-600 rounded" />

                    {/* Right Pan - Future Energy */}
                    <div className="flex flex-col items-center">
                        <div className="text-cyan-400 text-sm mb-3 font-bold">未来能量</div>
                        <motion.div
                            className="w-24 h-24 rounded-full border-3 border-cyan-500/50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                            animate={sacrificed ? {
                                boxShadow: ['0 0 0px rgba(0,204,255,0)', '0 0 30px rgba(0,204,255,0.5)', '0 0 0px rgba(0,204,255,0)'],
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            {sacrificed && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: 'spring' }}
                                    className="text-4xl"
                                >
                                    ✨
                                </motion.span>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Result Message */}
                <AnimatePresence>
                    {sacrificed && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-12 text-center"
                        >
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                                交易成功
                            </div>
                            <div className="text-gray-400 mt-2 text-lg">
                                你用【游戏时间】换取了【未来才华】。废墟开始重生。
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Ground - Ruins/Bloom */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px]">
                {sacrificed && (
                    <>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0, scale: 0 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5 + i * 0.3, type: 'spring' }}
                                className="absolute bottom-8 text-3xl"
                                style={{ left: `${15 + i * 18}%` }}
                            >
                                {['🌸', '🌿', '🌻', '🌱', '🌺'][i]}
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
