'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    impact: string;
    category: 'breakthrough' | 'product' | 'market' | 'regulation';
}

interface TimelineExplorerProps {
    title: string;
    events: TimelineEvent[];
    onComplete?: () => void;
}

const categoryColors: Record<string, string> = {
    breakthrough: 'var(--accent-gold)',
    product: 'var(--accent-teal)',
    market: '#8B5CF6',
    regulation: '#EC4899',
};

const categoryLabels: Record<string, string> = {
    breakthrough: '技术突破',
    product: '产品发布',
    market: '市场变革',
    regulation: '监管动态',
};

export default function TimelineExplorer({ title, events, onComplete }: TimelineExplorerProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeEvent = events[activeIdx];

    const goPrev = () => setActiveIdx(Math.max(0, activeIdx - 1));
    const goNext = () => {
        const nextIdx = Math.min(events.length - 1, activeIdx + 1);
        setActiveIdx(nextIdx);
        if (nextIdx === events.length - 1 && onComplete) {
            setTimeout(onComplete, 1500);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className="text-[var(--accent-gold)]" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                </div>
            </div>

            {/* Timeline Bar */}
            <div className="relative mb-8">
                <div className="h-px bg-[var(--border-subtle)] w-full" />
                <div className="flex justify-between relative -mt-[5px]">
                    {events.map((ev, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            className="relative cursor-pointer group"
                        >
                            <div className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx
                                    ? 'scale-150 shadow-[0_0_8px]'
                                    : i < activeIdx ? 'opacity-80' : 'opacity-30'
                                }`}
                                style={{ background: categoryColors[ev.category], boxShadow: i === activeIdx ? `0 0 10px ${categoryColors[ev.category]}` : 'none' }}
                            />
                            <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap transition-opacity ${i === activeIdx ? 'text-[var(--text-primary)] opacity-100' : 'text-[var(--text-muted)] opacity-0 group-hover:opacity-100'
                                }`}>
                                {ev.year}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Detail */}
            <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-xl p-5 mb-4"
            >
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: categoryColors[activeEvent.category] }}>
                        {activeEvent.year}
                    </span>
                    <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: `${categoryColors[activeEvent.category]}20`, color: categoryColors[activeEvent.category] }}
                    >
                        {categoryLabels[activeEvent.category]}
                    </span>
                </div>

                <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{activeEvent.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{activeEvent.description}</p>

                <div className="p-3 rounded-lg bg-[var(--accent-gold-dim)] border border-[var(--accent-gold)]/10">
                    <div className="text-[10px] text-[var(--accent-gold)] uppercase tracking-wider mb-1">对你的商业影响</div>
                    <div className="text-sm text-[var(--text-primary)]">{activeEvent.impact}</div>
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goPrev}
                    disabled={activeIdx === 0}
                    className={`p-2 rounded-lg glass cursor-pointer transition-all ${activeIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'glass-hover'}`}
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="text-xs text-[var(--text-muted)]">
                    {activeIdx + 1} / {events.length}
                </span>
                <button
                    onClick={goNext}
                    disabled={activeIdx === events.length - 1}
                    className={`p-2 rounded-lg glass cursor-pointer transition-all ${activeIdx === events.length - 1 ? 'opacity-30 cursor-not-allowed' : 'glass-hover'}`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
