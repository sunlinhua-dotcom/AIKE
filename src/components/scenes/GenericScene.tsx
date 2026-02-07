'use client';

import { motion } from 'framer-motion';

interface GenericSceneProps {
    bg: string;
    title: string;
    icon: string;
}

const bgMap: Record<string, string> = {
    intro: 'from-[#0F0F2F] via-[#1a1a3e] to-[#0a0a1f]',
    dark: 'from-[#0a0a0a] via-[#111] to-[#0a0a0a]',
    cyber: 'from-[#0f0f2f] via-[#1a0a3e] to-[#0f0f2f]',
    lab: 'from-[#0a1a2e] via-[#0f2a3e] to-[#0a1628]',
    market: 'from-[#1a1a0a] via-[#2a2a1a] to-[#1a1a0a]',
    arena: 'from-[#2a0a0a] via-[#1a0a1a] to-[#0a0a2a]',
    forge: 'from-[#1a0a00] via-[#2a1a0a] to-[#1a0a00]',
    summit: 'from-[#0f1a2e] via-[#1a2a4e] to-[#0a1628]',
};

// Deterministic pseudo-random using golden ratio to avoid hydration mismatch
function seededPosition(i: number, offset: number): number {
    const golden = 0.618033988749895;
    return ((i * golden + offset) % 1) * 100;
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
    left: seededPosition(i, 0.1),
    top: seededPosition(i, 0.7),
    duration: 3 + (i % 5) * 0.8,
    delay: (i % 7) * 0.4,
}));

export default function GenericScene({ bg, title, icon }: GenericSceneProps) {
    const gradient = bgMap[bg] || bgMap.intro;

    return (
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`}>
            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden">
                {PARTICLES.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: p.duration,
                            delay: p.delay,
                        }}
                    />
                ))}
            </div>

            {/* Scene Title Overlay */}
            <div className="absolute top-8 left-8 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <span className="text-4xl">{icon}</span>
                    <div>
                        <div className="text-white/40 text-xs uppercase tracking-widest">Current Scene</div>
                        <div className="text-white text-lg font-bold">{title}</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
