'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function DopamineScene() {
    const { dopamine, survivalRate, setDopamine, setSurvivalRate } = useGameStore();
    const [coins, setCoins] = useState<boolean[]>(new Array(25).fill(true));

    const collectCoin = (index: number) => {
        if (!coins[index]) return;
        const newCoins = [...coins];
        newCoins[index] = false;
        setCoins(newCoins);
        setDopamine(dopamine + 20);
        setSurvivalRate(survivalRate - 15);
    };

    return (
        <div className="absolute inset-0 bg-gradient-radial from-[#1a0a2e] to-black flex flex-col items-center justify-center">
            {/* Title */}
            <motion.h2
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-extrabold text-pink-500 mb-8"
                style={{ textShadow: '0 0 30px rgba(255,51,102,0.5)' }}
            >
                🧠 多巴胺赌场
            </motion.h2>

            {/* Maze Grid */}
            <div className="grid grid-cols-5 gap-1.5 p-2 border-2 border-pink-500/30 rounded-xl bg-black/50 backdrop-blur-sm shadow-lg shadow-pink-500/10">
                {coins.map((active, i) => (
                    <motion.div
                        key={i}
                        whileHover={active ? { scale: 1.15 } : {}}
                        whileTap={active ? { scale: 0.85 } : {}}
                        onClick={() => collectCoin(i)}
                        className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-200
              ${active
                                ? 'bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/30'
                                : 'bg-transparent border border-white/5'
                            }
            `}
                    >
                        {active && (
                            <motion.span
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                🪙
                            </motion.span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Dashboard */}
            <div className="flex gap-5 mt-8">
                <motion.div
                    className="bg-black/60 backdrop-blur-md border border-pink-500/20 rounded-xl px-6 py-4 text-center min-w-[140px]"
                    animate={dopamine > 150 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                >
                    <div className={`text-4xl font-extrabold ${dopamine > 100 ? 'text-pink-500' : 'text-pink-400'}`}>
                        {dopamine}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Dopamine</div>
                </motion.div>

                <motion.div
                    className="bg-black/60 backdrop-blur-md border border-cyan-500/20 rounded-xl px-6 py-4 text-center min-w-[140px]"
                    animate={survivalRate < 40 ? { borderColor: ['rgba(255,0,0,0.5)', 'rgba(255,0,0,0.1)'] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                >
                    <div className={`text-4xl font-extrabold ${survivalRate < 40 ? 'text-red-500' : 'text-cyan-400'}`}>
                        {survivalRate}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Survival Rate</div>
                </motion.div>
            </div>

            {/* Warning */}
            {survivalRate < 30 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-bold text-center"
                >
                    ⚠️ 警告：生存率过低！你的大脑已被劫持！
                </motion.div>
            )}
        </div>
    );
}
