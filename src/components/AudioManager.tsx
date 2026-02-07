'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

// ── Web Audio API 合成音频 ──

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// ── SFX 合成函数 ──
const SFX_SYNTHS: Record<string, () => void> = {
    click: () => {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    },

    whoosh: () => {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        filter.Q.value = 2;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(ctx.currentTime);
    },

    success: () => {
        const ctx = getAudioContext();
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.3);
        });
    },

    fail: () => {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    },

    coin: () => {
        const ctx = getAudioContext();
        [1200, 1600].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.15);
        });
    },

    explosion: () => {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(ctx.currentTime);
    },

    typing: () => {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.value = 1800 + Math.random() * 400;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    },

    levelup: () => {
        const ctx = getAudioContext();
        const notes = [392, 523, 659, 784, 1047]; // G4→C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            const t = i * 0.08;
            gain.gain.setValueAtTime(0, ctx.currentTime + t);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
            osc.start(ctx.currentTime + t);
            osc.stop(ctx.currentTime + t + 0.25);
        });
    },

    slide: () => {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    },

    pop: () => {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    },

    alarm: () => {
        const ctx = getAudioContext();
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.value = 880;
            const t = i * 0.15;
            gain.gain.setValueAtTime(0.15, ctx.currentTime + t);
            gain.gain.setValueAtTime(0.001, ctx.currentTime + t + 0.08);
            osc.start(ctx.currentTime + t);
            osc.stop(ctx.currentTime + t + 0.08);
        }
    },

    confetti: () => {
        const ctx = getAudioContext();
        const notes = [523, 659, 784, 1047, 1319]; // C5→E6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const t = i * 0.06;
            gain.gain.setValueAtTime(0, ctx.currentTime + t);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
            osc.start(ctx.currentTime + t);
            osc.stop(ctx.currentTime + t + 0.2);
        });
    },
};

export type SfxName = keyof typeof SFX_SYNTHS;
export type BgmTrack = 'module1' | 'module2' | 'module3';

// ── BGM 合成器 ──
class BgmSynth {
    private ctx: AudioContext;
    private gainNode: GainNode;
    private oscillators: OscillatorNode[] = [];
    private lfoNode: OscillatorNode | null = null;
    private isPlaying = false;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.gainNode = ctx.createGain();
        this.gainNode.gain.value = 0.08;
        this.gainNode.connect(ctx.destination);
    }

    play(track: BgmTrack, muted: boolean) {
        this.stop();
        this.isPlaying = true;
        this.gainNode.gain.value = muted ? 0 : 0.08;

        // 根据模块选择不同的音阶和节奏
        const scales: Record<BgmTrack, number[]> = {
            module1: [261, 293, 329, 392, 440],    // C大调 - 明亮
            module2: [293, 329, 370, 440, 493],    // D大调 - 进取
            module3: [349, 392, 440, 523, 587],    // F大调 - 温暖
        };
        const scale = scales[track] || scales.module1;

        // 创建柔和氛围 pad
        scale.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq * 0.5; // 低八度
            oscGain.gain.value = 0.15 / scale.length;

            // 缓慢 "呼吸" 效果
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1 + i * 0.02;
            lfoGain.gain.value = oscGain.gain.value * 0.5;
            lfo.connect(lfoGain);
            lfoGain.connect(oscGain.gain);
            lfo.start();

            osc.connect(oscGain);
            oscGain.connect(this.gainNode);
            osc.start();

            this.oscillators.push(osc, lfo);
        });

        // 添加低频嗡鸣
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.value = scale[0] * 0.25;
        subGain.gain.value = 0.06;
        sub.connect(subGain);
        subGain.connect(this.gainNode);
        sub.start();
        this.oscillators.push(sub);
    }

    stop() {
        this.oscillators.forEach(osc => {
            try { osc.stop(); } catch { /* ignore */ }
        });
        this.oscillators = [];
        this.isPlaying = false;
    }

    setMuted(muted: boolean) {
        this.gainNode.gain.setTargetAtTime(muted ? 0 : 0.08, this.ctx.currentTime, 0.1);
    }

    get playing() { return this.isPlaying; }
}

// ── 全局音频管理 Hook ──
export function useAudioManager() {
    const [isMuted, setIsMuted] = useState(false);
    const [currentBgm, setCurrentBgm] = useState<BgmTrack | null>(null);
    const bgmSynthRef = useRef<BgmSynth | null>(null);
    const hasInteractedRef = useRef(false);

    // 确保用户交互后才可播放
    useEffect(() => {
        const handleInteraction = () => { hasInteractedRef.current = true; };
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const playBgm = useCallback((track: BgmTrack) => {
        if (currentBgm === track) return;
        try {
            const ctx = getAudioContext();
            if (!bgmSynthRef.current) {
                bgmSynthRef.current = new BgmSynth(ctx);
            }
            bgmSynthRef.current.play(track, isMuted);
            setCurrentBgm(track);
        } catch { /* AudioContext may not be ready */ }
    }, [currentBgm, isMuted]);

    const stopBgm = useCallback(() => {
        bgmSynthRef.current?.stop();
        setCurrentBgm(null);
    }, []);

    const playSfx = useCallback((name: SfxName) => {
        if (isMuted) return;
        try {
            const synth = SFX_SYNTHS[name];
            if (synth) synth();
        } catch { /* ignore */ }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            bgmSynthRef.current?.setMuted(next);
            return next;
        });
    }, []);

    const playBgmForLesson = useCallback((lessonId: number) => {
        if (lessonId <= 2) playBgm('module1');
        else if (lessonId <= 6) playBgm('module2');
        else playBgm('module3');
    }, [playBgm]);

    // 清理
    useEffect(() => {
        return () => { bgmSynthRef.current?.stop(); };
    }, []);

    return { playBgm, stopBgm, playSfx, toggleMute, isMuted, playBgmForLesson };
}

// ── 静音按钮组件 ──
export function MuteButton({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className="fixed top-4 right-4 z-[100] bg-black/50 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/10 hover:border-pink-500/30 transition-all"
            title={isMuted ? '取消静音' : '静音'}
        >
            <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
        </button>
    );
}
