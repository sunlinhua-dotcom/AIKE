'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

// ═══════════════════════════════════════════════
//  高品质 Web Audio 音效 & 生成式氛围音乐引擎
//  暗金商务风格 · AI 超级个体实战课
// ═══════════════════════════════════════════════

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

// ── 工具函数：创建简易混响 ──
function createReverb(ctx: AudioContext, duration = 1.5, decay = 2): ConvolverNode {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const buffer = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
    }
    convolver.buffer = buffer;
    return convolver;
}

// ── 工具函数：创建延迟效果 ──
function createDelay(ctx: AudioContext, time = 0.3, feedback = 0.3): { input: GainNode; output: GainNode } {
    const input = ctx.createGain();
    const output = ctx.createGain();
    const delay = ctx.createDelay(2);
    const fb = ctx.createGain();
    delay.delayTime.value = time;
    fb.gain.value = feedback;
    input.connect(output);
    input.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(output);
    return { input, output };
}

// ── 工具函数：柔和正弦音符（钢琴质感） ──
function playTone(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    startTime: number,
    duration: number,
    volume = 0.15,
    waveType: OscillatorType = 'sine'
) {
    // 基音
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveType;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(dest);

    // ADSR 包络：快速起音 → 自然衰减
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
    gain.gain.setTargetAtTime(volume * 0.6, startTime + 0.008, 0.05);
    gain.gain.setTargetAtTime(0.001, startTime + duration * 0.4, duration * 0.3);

    osc.start(startTime);
    osc.stop(startTime + duration);

    // 第 2 泛音（八度上方），增加温暖感
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    osc2.connect(gain2);
    gain2.connect(dest);
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.008);
    gain2.gain.setTargetAtTime(0.001, startTime + duration * 0.3, duration * 0.25);
    osc2.start(startTime);
    osc2.stop(startTime + duration);

    // 第 3 泛音（1.5 倍频），增加色彩
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 3;
    osc3.connect(gain3);
    gain3.connect(dest);
    gain3.gain.setValueAtTime(0, startTime);
    gain3.gain.linearRampToValueAtTime(volume * 0.05, startTime + 0.008);
    gain3.gain.setTargetAtTime(0.001, startTime + duration * 0.2, duration * 0.15);
    osc3.start(startTime);
    osc3.stop(startTime + duration);
}

// ═══════════════════════════════════════════════
//  上下文感知 SFX 音效系统
//  · 5 模块主题各自不同点击音
//  · 3 角色各自不同对话推进音
// ═══════════════════════════════════════════════

// ── 通用音效合成工具 ──
function synthClick(ctx: AudioContext, freq1: number, freq2: number, vol = 0.2, dur = 0.08) {
    const t = ctx.currentTime;
    const m = ctx.createGain(); m.gain.value = vol; m.connect(ctx.destination);
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq1, t);
    o.frequency.exponentialRampToValueAtTime(freq2, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(m); o.start(t); o.stop(t + dur);
    // 泛音
    const h = ctx.createOscillator(); const hg = ctx.createGain();
    h.type = 'sine'; h.frequency.setValueAtTime(freq1 * 2, t);
    h.frequency.exponentialRampToValueAtTime(freq2 * 2, t + dur * 0.7);
    hg.gain.setValueAtTime(0, t); hg.gain.linearRampToValueAtTime(0.12, t + 0.002);
    hg.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.6);
    h.connect(hg); hg.connect(m); h.start(t); h.stop(t + dur);
}

// ── 模块主题点击音（lessonId → 模块） ──
function getModuleFromLesson(lessonId: number): number {
    if (lessonId <= 4) return 1;  // 认知破局
    if (lessonId <= 8) return 2;  // 武器锻造
    if (lessonId <= 12) return 3; // 实战部署
    if (lessonId <= 18) return 4; // 项目工坊
    return 5;                     // 战略升维
}

const MODULE_CLICK: Record<number, () => void> = {
    // M1 认知破局：深沉低频共鸣，像深海回声
    1: () => { const ctx = getAudioContext(); synthClick(ctx, 500, 280, 0.22, 0.1); },
    // M2 武器锻造：金属锻造质感，清脆有力
    2: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        synthClick(ctx, 1400, 700, 0.18, 0.06);
        // 金属余音
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = 2800;
        g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        o.connect(g); g.connect(ctx.destination); o.start(t + 0.02); o.stop(t + 0.14);
    },
    // M3 实战部署：数字科技，短促电子脉冲
    3: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        synthClick(ctx, 1800, 900, 0.15, 0.04);
        // 数字余波
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(3200, t);
        o.frequency.exponentialRampToValueAtTime(1600, t + 0.05);
        g.gain.setValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        o.connect(g); g.connect(ctx.destination); o.start(t + 0.01); o.stop(t + 0.07);
    },
    // M4 项目工坊：工具操作，干脆的木质触感
    4: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        synthClick(ctx, 800, 400, 0.2, 0.07);
        // 木质共鸣
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.15;
        const s = ctx.createBufferSource(); s.buffer = buf;
        const g = ctx.createGain(); g.gain.value = 0.15;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 3;
        s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t);
    },
    // M5 战略升维：水晶/钟声，辉煌高贵
    5: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        synthClick(ctx, 2000, 1200, 0.15, 0.06);
        // 水晶泛音
        [2400, 3600].forEach((f, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04, t + 0.005);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.15 - i * 0.03);
            o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.15);
        });
    },
};

// ── 角色对话推进音 ──
const ROLE_DIALOGUE: Record<string, () => void> = {
    // AI 顾问（bot）：温暖金色和弦，像导师轻声
    bot: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.12; m.connect(ctx.destination);
        [440, 554].forEach((f, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25 - i * 0.08, t + 0.005);
            g.gain.setTargetAtTime(0.001, t + 0.06, 0.04);
            o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.12);
        });
    },
    // 系统（alert）：清脆琥珀音，短促有力
    alert: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.14; m.connect(ctx.destination);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(1100, t);
        o.frequency.exponentialRampToValueAtTime(880, t + 0.04);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.06);
    },
    // 案例（case）：柔和蓝绿音，像水波纹
    case: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.1; m.connect(ctx.destination);
        [660, 784].forEach((f, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, t + i * 0.04);
            g.gain.linearRampToValueAtTime(0.2, t + i * 0.04 + 0.008);
            g.gain.setTargetAtTime(0.001, t + i * 0.04 + 0.06, 0.04);
            o.connect(g); g.connect(m); o.start(t + i * 0.04); o.stop(t + i * 0.04 + 0.12);
        });
    },
};

// ── 模块主题翻页过渡音 ──
const MODULE_WHOOSH: Record<number, () => void> = {
    1: () => { // 深海涌动
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.15; m.connect(ctx.destination);
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI) * 0.3;
        const s = ctx.createBufferSource(); s.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.6;
        f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(1500, t + 0.2); f.frequency.exponentialRampToValueAtTime(150, t + 0.45);
        const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.08); g.gain.setTargetAtTime(0.001, t + 0.2, 0.1);
        s.connect(f); f.connect(g); g.connect(m); s.start(t);
    },
    2: () => { // 金属滑行
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.12; m.connect(ctx.destination);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(1200, t + 0.15); o.frequency.exponentialRampToValueAtTime(400, t + 0.35);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.15, t + 0.03); g.gain.setTargetAtTime(0.001, t + 0.12, 0.08);
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
        o.connect(lp); lp.connect(g); g.connect(m); o.start(t); o.stop(t + 0.4);
    },
    3: () => { // 数据流
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.12; m.connect(ctx.destination);
        [600, 1200, 2400].forEach((freq, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = freq;
            g.gain.setValueAtTime(0, t + i * 0.04); g.gain.linearRampToValueAtTime(0.1 / (i + 1), t + i * 0.04 + 0.01);
            g.gain.setTargetAtTime(0.001, t + i * 0.04 + 0.08, 0.04);
            o.connect(g); g.connect(m); o.start(t + i * 0.04); o.stop(t + i * 0.04 + 0.15);
        });
    },
    4: () => { // 翻页
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.15; m.connect(ctx.destination);
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((i / d.length) * Math.PI) * 0.2;
        const s = ctx.createBufferSource(); s.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1000;
        const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02); g.gain.setTargetAtTime(0.001, t + 0.08, 0.06);
        s.connect(f); f.connect(g); g.connect(m); s.start(t);
    },
    5: () => { // 星辰划过
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.12; m.connect(ctx.destination);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(800, t); o.frequency.exponentialRampToValueAtTime(2000, t + 0.1); o.frequency.exponentialRampToValueAtTime(1200, t + 0.3);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2, t + 0.01); g.gain.setTargetAtTime(0.001, t + 0.1, 0.08);
        o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.35);
        // 泛音尾巴
        const h = ctx.createOscillator(); const hg = ctx.createGain();
        h.type = 'sine'; h.frequency.value = 3200;
        hg.gain.setValueAtTime(0, t + 0.05); hg.gain.linearRampToValueAtTime(0.03, t + 0.06); hg.gain.setTargetAtTime(0.001, t + 0.15, 0.08);
        h.connect(hg); hg.connect(m); h.start(t + 0.05); h.stop(t + 0.3);
    },
};

// ── 上下文感知的核心 SFX 调度 ──
function playContextSfx(name: string, lessonId = 1, avatar = 'bot') {
    const ctx = getAudioContext();
    const mod = getModuleFromLesson(lessonId);

    switch (name) {
        case 'click':
            (MODULE_CLICK[mod] || MODULE_CLICK[1])();
            return;
        case 'whoosh':
            (MODULE_WHOOSH[mod] || MODULE_WHOOSH[1])();
            return;
        case 'dialogue':
            (ROLE_DIALOGUE[avatar] || ROLE_DIALOGUE.bot)();
            return;
        default:
            break;
    }
    // 其他通用 SFX
    const synth = GENERIC_SFX[name];
    if (synth) synth();
}

// ── 通用音效（不区分主题） ──
const GENERIC_SFX: Record<string, () => void> = {
    success: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const rev = createReverb(ctx, 1.0, 2.5); const dry = ctx.createGain(); const wet = ctx.createGain();
        dry.gain.value = 0.7; wet.gain.value = 0.3; dry.connect(ctx.destination); rev.connect(wet); wet.connect(ctx.destination);
        const mix = ctx.createGain(); mix.gain.value = 0.18; mix.connect(dry); mix.connect(rev);
        [523, 659, 784, 1047].forEach((f, i) => playTone(ctx, mix, f, t + i * 0.1, 0.6, 0.18));
    },
    fail: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.12; m.connect(ctx.destination);
        [392, 311].forEach((freq, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = freq;
            g.gain.setValueAtTime(0, t + i * 0.2); g.gain.linearRampToValueAtTime(0.2, t + i * 0.2 + 0.01);
            g.gain.setTargetAtTime(0.001, t + i * 0.2 + 0.15, 0.1);
            o.connect(g); g.connect(m); o.start(t + i * 0.2); o.stop(t + i * 0.2 + 0.4);
        });
    },
    coin: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.13; m.connect(ctx.destination);
        [1318, 1760].forEach((f, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            g.gain.setValueAtTime(0, t + i * 0.07); g.gain.linearRampToValueAtTime(0.3, t + i * 0.07 + 0.003);
            g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.18);
            o.connect(g); g.connect(m); o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.18);
        });
    },
    typing: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.06; m.connect(ctx.destination);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 3000 + Math.random() * 1000;
        g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        o.connect(g); g.connect(m); o.start(t); o.stop(t + 0.02);
    },
    levelup: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const rev = createReverb(ctx, 1.5, 2); const del = createDelay(ctx, 0.12, 0.2);
        const dry = ctx.createGain(); const wet = ctx.createGain();
        dry.gain.value = 0.6; wet.gain.value = 0.4; dry.connect(ctx.destination);
        del.output.connect(rev); rev.connect(wet); wet.connect(ctx.destination);
        const mix = ctx.createGain(); mix.gain.value = 0.16; mix.connect(dry); mix.connect(del.input);
        [523, 659, 784, 988, 1047].forEach((f, i) => playTone(ctx, mix, f, t + i * 0.08, 0.5, 0.18));
    },
    slide: () => { synthClick(getAudioContext(), 500, 800, 0.1, 0.1); },
    pop: () => { synthClick(getAudioContext(), 800, 300, 0.15, 0.06); },
    alarm: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.08; m.connect(ctx.destination);
        for (let i = 0; i < 2; i++) {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = 660;
            g.gain.setValueAtTime(0, t + i * 0.2); g.gain.linearRampToValueAtTime(0.3, t + i * 0.2 + 0.01);
            g.gain.setTargetAtTime(0.001, t + i * 0.2 + 0.08, 0.04);
            o.connect(g); g.connect(m); o.start(t + i * 0.2); o.stop(t + i * 0.2 + 0.15);
        }
    },
    confetti: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const rev = createReverb(ctx, 2, 1.8); const del = createDelay(ctx, 0.1, 0.2);
        const dry = ctx.createGain(); const wet = ctx.createGain();
        dry.gain.value = 0.5; wet.gain.value = 0.5; dry.connect(ctx.destination);
        del.output.connect(rev); rev.connect(wet); wet.connect(ctx.destination);
        const mix = ctx.createGain(); mix.gain.value = 0.12; mix.connect(dry); mix.connect(del.input);
        [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => playTone(ctx, mix, f, t + i * 0.06, 0.8, 0.13));
    },
    explosion: () => {
        const ctx = getAudioContext(); const t = ctx.currentTime;
        const m = ctx.createGain(); m.gain.value = 0.18; m.connect(ctx.destination);
        const sub = ctx.createOscillator(); const sg = ctx.createGain();
        sub.type = 'sine'; sub.frequency.setValueAtTime(80, t); sub.frequency.exponentialRampToValueAtTime(30, t + 0.5);
        sg.gain.setValueAtTime(0, t); sg.gain.linearRampToValueAtTime(0.5, t + 0.01); sg.gain.setTargetAtTime(0.001, t + 0.15, 0.15);
        sub.connect(sg); sg.connect(m); sub.start(t); sub.stop(t + 0.6);
    },
};

// 保持向后兼容的类型
const SFX_SYNTHS = { ...GENERIC_SFX, click: MODULE_CLICK[1], whoosh: MODULE_WHOOSH[1], dialogue: ROLE_DIALOGUE.bot };
export type SfxName = string;

// ═══════════════════════════════════════════════
//  生成式氛围音乐引擎（BGM）
// ═══════════════════════════════════════════════

// 和弦定义：每个和弦由一组频率组成
type Chord = number[];

interface BgmConfig {
    chords: Chord[];         // 和弦进行
    arpPattern: number[];    // 琶音模式（和弦内音符索引序列）
    tempo: number;           // 每个琶音音符的间隔（秒）
    padVolume: number;       // Pad 音量
    arpVolume: number;       // 琶音音量
    subFreq: number;         // 低频铺底频率
    filterFreq: number;      // 低通滤波截止频率
    delayTime: number;       // 延迟时间
    delayFeedback: number;   // 延迟反馈
}

// 音符频率表
const N = {
    C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
};

// 20 课不同的氛围配置
function getLessonBgmConfig(lessonId: number): BgmConfig {
    const configs: Record<number, BgmConfig> = {
        // M1·认知破局（L1-L4）—— 深邃、唤醒、沉思
        1: { // 被浪费的 ChatGPT — 宁静反思
            chords: [[N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4], [N.E3, N.G3, N.B3]],
            arpPattern: [0, 2, 1, 2, 0, 1],
            tempo: 0.6, padVolume: 0.04, arpVolume: 0.06, subFreq: N.A3 * 0.5,
            filterFreq: 2000, delayTime: 0.35, delayFeedback: 0.3,
        },
        2: { // AI 员工图鉴 — 探索好奇
            chords: [[N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4], [N.G3, N.B3, N.D4]],
            arpPattern: [0, 1, 2, 1, 0, 2],
            tempo: 0.55, padVolume: 0.035, arpVolume: 0.065, subFreq: N.C3,
            filterFreq: 2200, delayTime: 0.3, delayFeedback: 0.28,
        },
        3: { // 提示词的力量 — 理性精准
            chords: [[N.E3, N.G3, N.B3], [N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4]],
            arpPattern: [2, 0, 1, 0, 2, 1],
            tempo: 0.5, padVolume: 0.03, arpVolume: 0.07, subFreq: N.E3 * 0.5,
            filterFreq: 2500, delayTime: 0.25, delayFeedback: 0.25,
        },
        4: { // 你的 AI 方法论 — 体系构建
            chords: [[N.D4, N.F4, N.A4], [N.Bb3, N.D4, N.F4], [N.G3, N.Bb3, N.D4], [N.A3, N.C4, N.E4]],
            arpPattern: [0, 2, 1, 0, 1, 2],
            tempo: 0.55, padVolume: 0.04, arpVolume: 0.06, subFreq: N.D3,
            filterFreq: 2000, delayTime: 0.4, delayFeedback: 0.32,
        },

        // M2·武器锻造（L5-L8）—— 力量、构建、进取
        5: { // 五层积木 — 坚定构建
            chords: [[N.C4, N.E4, N.G4], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4], [N.C4, N.E4, N.G4]],
            arpPattern: [0, 1, 2, 0, 2, 1],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.07, subFreq: N.C3,
            filterFreq: 2400, delayTime: 0.3, delayFeedback: 0.28,
        },
        6: { // 界面即武器 — 科技感
            chords: [[N.A3, N.C4, N.E4], [N.E3, N.G3, N.B3], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4]],
            arpPattern: [2, 1, 0, 2, 0, 1],
            tempo: 0.45, padVolume: 0.035, arpVolume: 0.07, subFreq: N.A3 * 0.5,
            filterFreq: 2800, delayTime: 0.2, delayFeedback: 0.22,
        },
        7: { // API 是管道 — 流动连接
            chords: [[N.G3, N.B3, N.D4], [N.E3, N.G3, N.B3], [N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4]],
            arpPattern: [0, 2, 1, 2, 0, 1],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.065, subFreq: N.G3 * 0.5,
            filterFreq: 2200, delayTime: 0.35, delayFeedback: 0.3,
        },
        8: { // 数据即燃料 — 厚重蓄力
            chords: [[N.D4, N.F4, N.A4], [N.A3, N.C4, N.E4], [N.Bb3, N.D4, N.F4], [N.G3, N.Bb3, N.D4]],
            arpPattern: [0, 1, 0, 2, 1, 2],
            tempo: 0.6, padVolume: 0.045, arpVolume: 0.055, subFreq: N.D3 * 0.5,
            filterFreq: 1800, delayTime: 0.4, delayFeedback: 0.35,
        },

        // M3·实战部署（L9-L12）—— 动感、实操、成就
        9: { // AI 官网 — 创造力
            chords: [[N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4]],
            arpPattern: [0, 2, 1, 0, 1, 2],
            tempo: 0.45, padVolume: 0.035, arpVolume: 0.075, subFreq: N.C3,
            filterFreq: 2600, delayTime: 0.25, delayFeedback: 0.25,
        },
        10: { // AI 看板 — 数据之美
            chords: [[N.E3, N.G3, N.B3], [N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4], [N.G3, N.B3, N.D4]],
            arpPattern: [2, 0, 1, 2, 1, 0],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.065, subFreq: N.E3 * 0.5,
            filterFreq: 2400, delayTime: 0.3, delayFeedback: 0.28,
        },
        11: { // AI 客服 — 温暖服务
            chords: [[N.F3, N.A3, N.C4], [N.D4, N.F4, N.A4], [N.Bb3, N.D4, N.F4], [N.C4, N.E4, N.G4]],
            arpPattern: [0, 1, 2, 1, 0, 2],
            tempo: 0.55, padVolume: 0.04, arpVolume: 0.06, subFreq: N.F3 * 0.5,
            filterFreq: 2000, delayTime: 0.35, delayFeedback: 0.3,
        },
        12: { // AI 排产 — 精密运转
            chords: [[N.G3, N.B3, N.D4], [N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4]],
            arpPattern: [1, 0, 2, 0, 1, 2],
            tempo: 0.45, padVolume: 0.035, arpVolume: 0.07, subFreq: N.G3 * 0.5,
            filterFreq: 2600, delayTime: 0.2, delayFeedback: 0.22,
        },

        // M4·项目工坊（L13-L18）—— 实战、紧凑、行业
        13: { // 图片加工厂 — 视觉美学
            chords: [[N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4], [N.D4, N.F4, N.A4], [N.E3, N.G3, N.B3]],
            arpPattern: [0, 2, 1, 2, 0, 1],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.065, subFreq: N.A3 * 0.5,
            filterFreq: 2200, delayTime: 0.3, delayFeedback: 0.28,
        },
        14: { // 标书工匠 — 严谨专注
            chords: [[N.D4, N.F4, N.A4], [N.A3, N.C4, N.E4], [N.G3, N.B3, N.D4], [N.C4, N.E4, N.G4]],
            arpPattern: [0, 1, 0, 2, 1, 2],
            tempo: 0.6, padVolume: 0.04, arpVolume: 0.055, subFreq: N.D3 * 0.5,
            filterFreq: 1900, delayTime: 0.4, delayFeedback: 0.32,
        },
        15: { // OpenClaw 指挥官 — 指挥调度
            chords: [[N.E3, N.G3, N.B3], [N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.G3, N.B3, N.D4]],
            arpPattern: [2, 0, 1, 0, 2, 1],
            tempo: 0.45, padVolume: 0.035, arpVolume: 0.07, subFreq: N.E3 * 0.5,
            filterFreq: 2500, delayTime: 0.25, delayFeedback: 0.25,
        },
        16: { // 内容矩阵 — 创意灵感
            chords: [[N.C4, N.E4, N.G4], [N.G3, N.B3, N.D4], [N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4]],
            arpPattern: [0, 1, 2, 0, 2, 1],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.065, subFreq: N.C3,
            filterFreq: 2400, delayTime: 0.3, delayFeedback: 0.28,
        },
        17: { // 经营分析 — 数据洞察
            chords: [[N.G3, N.B3, N.D4], [N.E3, N.G3, N.B3], [N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4]],
            arpPattern: [1, 2, 0, 2, 1, 0],
            tempo: 0.55, padVolume: 0.04, arpVolume: 0.06, subFreq: N.G3 * 0.5,
            filterFreq: 2200, delayTime: 0.35, delayFeedback: 0.3,
        },
        18: { // 产销闭环 — 系统闭合
            chords: [[N.A3, N.C4, N.E4], [N.D4, N.F4, N.A4], [N.G3, N.B3, N.D4], [N.C4, N.E4, N.G4]],
            arpPattern: [0, 2, 1, 0, 1, 2],
            tempo: 0.5, padVolume: 0.04, arpVolume: 0.065, subFreq: N.A3 * 0.5,
            filterFreq: 2300, delayTime: 0.3, delayFeedback: 0.28,
        },

        // M5·战略升维（L19-L20）—— 壮阔、辉煌、毕业
        19: { // 回公司怎么落地 — 战略视野
            chords: [[N.C4, N.E4, N.G4], [N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4]],
            arpPattern: [0, 1, 2, 1, 2, 0],
            tempo: 0.55, padVolume: 0.045, arpVolume: 0.06, subFreq: N.C3,
            filterFreq: 2100, delayTime: 0.4, delayFeedback: 0.32,
        },
        20: { // 毕业路演 — 辉煌壮阔
            chords: [[N.C4, N.E4, N.G4], [N.G3, N.B3, N.D4], [N.A3, N.C4, N.E4], [N.F3, N.A3, N.C4], [N.G3, N.B3, N.D4], [N.C4, N.E4, N.G4]],
            arpPattern: [0, 1, 2, 0, 2, 1, 0],
            tempo: 0.5, padVolume: 0.05, arpVolume: 0.07, subFreq: N.C3,
            filterFreq: 2500, delayTime: 0.3, delayFeedback: 0.3,
        },
    };

    return configs[lessonId] || configs[1];
}

export type BgmTrack = 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4' | 'lesson5' | 'lesson6' | 'lesson7' | 'lesson8' | 'lesson9' | 'lesson10'
    | 'lesson11' | 'lesson12' | 'lesson13' | 'lesson14' | 'lesson15' | 'lesson16' | 'lesson17' | 'lesson18' | 'lesson19' | 'lesson20';

// ── 生成式氛围音乐引擎 ──
class AmbientMusicEngine {
    private ctx: AudioContext;
    private masterGain: GainNode;
    private isPlaying = false;
    private schedulerTimer: ReturnType<typeof setInterval> | null = null;
    private activeNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
    private padOscillators: OscillatorNode[] = [];
    private config: BgmConfig | null = null;
    private chordIndex = 0;
    private arpIndex = 0;
    private arpMix: GainNode | null = null;
    private delayNode: { input: GainNode; output: GainNode } | null = null;
    private reverbNode: ConvolverNode | null = null;

    constructor(ctx: AudioContext) {
        this.ctx = ctx;
        this.masterGain = ctx.createGain();
        this.masterGain.gain.value = 0.08;
        this.masterGain.connect(ctx.destination);
    }

    play(lessonId: number, muted: boolean) {
        this.stop();
        this.isPlaying = true;
        this.masterGain.gain.value = muted ? 0 : 0.08;
        this.config = getLessonBgmConfig(lessonId);
        this.chordIndex = 0;
        this.arpIndex = 0;

        // 效果链：混响 + 低通
        const lpFilter = this.ctx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.value = this.config.filterFreq;
        lpFilter.Q.value = 0.5;
        lpFilter.connect(this.masterGain);

        // 延迟效果
        this.delayNode = createDelay(this.ctx, this.config.delayTime, this.config.delayFeedback);

        // 混响
        this.reverbNode = createReverb(this.ctx, 2.5, 2);
        const reverbGain = this.ctx.createGain();
        reverbGain.gain.value = 0.4;
        this.reverbNode.connect(reverbGain);
        reverbGain.connect(lpFilter);

        this.delayNode.output.connect(this.reverbNode);

        // Pad 层（持续和弦）
        this.playPadChord(lpFilter);

        // Sub bass
        this.playSub(lpFilter);

        // 琶音层——用定时器调度
        this.arpMix = this.ctx.createGain();
        this.arpMix.gain.value = this.config.arpVolume;
        this.arpMix.connect(this.delayNode.input);
        this.arpMix.connect(lpFilter);

        this.scheduleArpeggio();
    }

    private playPadChord(dest: AudioNode) {
        if (!this.config) return;

        // 清除旧 pad
        this.padOscillators.forEach(o => { try { o.stop(); } catch { /* */ } });
        this.padOscillators = [];

        const chord = this.config.chords[this.chordIndex % this.config.chords.length];
        const t = this.ctx.currentTime;

        chord.forEach(freq => {
            // 基音 pad
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq * 0.5; // 低八度
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(this.config!.padVolume / chord.length, t + 1.5);
            osc.connect(g);
            g.connect(dest);
            osc.start(t);
            this.padOscillators.push(osc);
            this.activeNodes.push(osc);

            // 微失谐层（增加温暖感）
            const detune = this.ctx.createOscillator();
            const dg = this.ctx.createGain();
            detune.type = 'sine';
            detune.frequency.value = freq * 0.5 * 1.002;
            dg.gain.setValueAtTime(0, t);
            dg.gain.linearRampToValueAtTime(this.config!.padVolume / chord.length * 0.5, t + 2);
            detune.connect(dg);
            dg.connect(dest);
            detune.start(t);
            this.padOscillators.push(detune);
            this.activeNodes.push(detune);
        });
    }

    private playSub(dest: AudioNode) {
        if (!this.config) return;
        const t = this.ctx.currentTime;
        const sub = this.ctx.createOscillator();
        const sg = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.value = this.config.subFreq;
        sg.gain.setValueAtTime(0, t);
        sg.gain.linearRampToValueAtTime(0.03, t + 2);
        sub.connect(sg);
        sg.connect(dest);
        sub.start(t);
        this.padOscillators.push(sub);
        this.activeNodes.push(sub);
    }

    private scheduleArpeggio() {
        if (!this.config || !this.arpMix) return;

        let beatCount = 0;
        const beatsPerChord = this.config.arpPattern.length * 2; // 两轮琶音换一个和弦

        this.schedulerTimer = setInterval(() => {
            if (!this.isPlaying || !this.config || !this.arpMix) return;

            const chord = this.config.chords[this.chordIndex % this.config.chords.length];
            const noteIdx = this.config.arpPattern[this.arpIndex % this.config.arpPattern.length];
            const freq = chord[noteIdx % chord.length];

            // 播放琶音音符（带泛音）
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.2, t + 0.01);
            g.gain.setTargetAtTime(0.001, t + this.config.tempo * 0.6, this.config.tempo * 0.3);
            osc.connect(g);
            g.connect(this.arpMix);
            osc.start(t);
            osc.stop(t + this.config.tempo * 1.5);

            // 高八度泛音（微弱）
            const h = this.ctx.createOscillator();
            const hg = this.ctx.createGain();
            h.type = 'sine';
            h.frequency.value = freq * 2;
            hg.gain.setValueAtTime(0, t);
            hg.gain.linearRampToValueAtTime(0.05, t + 0.01);
            hg.gain.setTargetAtTime(0.001, t + this.config.tempo * 0.4, this.config.tempo * 0.2);
            h.connect(hg);
            hg.connect(this.arpMix);
            h.start(t);
            h.stop(t + this.config.tempo * 1.2);

            this.arpIndex++;
            beatCount++;

            if (beatCount >= beatsPerChord) {
                beatCount = 0;
                this.chordIndex++;
            }
        }, (this.config.tempo * 1000));
    }

    stop() {
        this.isPlaying = false;
        if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
        }
        // 渐弱停止
        const t = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(0, t, 0.3);
        setTimeout(() => {
            this.activeNodes.forEach(n => { try { n.stop(); } catch { /* */ } });
            this.activeNodes = [];
            this.padOscillators = [];
            this.masterGain.gain.value = 0.08;
        }, 1500);
    }

    setMuted(muted: boolean) {
        this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.08, this.ctx.currentTime, 0.1);
    }

    get playing() { return this.isPlaying; }
}

// ═══════════════════════════════════════════════
//  全局音频管理 Hook
// ═══════════════════════════════════════════════

export function useAudioManager() {
    const [isMuted, setIsMuted] = useState(false);
    const [currentBgm, setCurrentBgm] = useState<number | null>(null);
    const engineRef = useRef<AmbientMusicEngine | null>(null);
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
        const lessonId = parseInt(track.replace('lesson', ''), 10);
        if (currentBgm === lessonId) return;
        try {
            const ctx = getAudioContext();
            if (!engineRef.current) {
                engineRef.current = new AmbientMusicEngine(ctx);
            }
            engineRef.current.play(lessonId, isMuted);
            setCurrentBgm(lessonId);
        } catch { /* AudioContext may not be ready */ }
    }, [currentBgm, isMuted]);

    const stopBgm = useCallback(() => {
        engineRef.current?.stop();
        setCurrentBgm(null);
    }, []);

    const playSfx = useCallback((name: SfxName) => {
        if (isMuted) return;
        try { playContextSfx(name); } catch { /* ignore */ }
    }, [isMuted]);

    // 上下文感知音效：按模块主题和角色播放不同音效
    const playSfxForContext = useCallback((name: string, lessonId: number, avatar?: string) => {
        if (isMuted) return;
        try { playContextSfx(name, lessonId, avatar || 'bot'); } catch { /* ignore */ }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            engineRef.current?.setMuted(next);
            return next;
        });
    }, []);

    const playBgmForLesson = useCallback((lessonId: number) => {
        const track = `lesson${lessonId}` as BgmTrack;
        playBgm(track);
    }, [playBgm]);

    // 清理
    useEffect(() => {
        return () => { engineRef.current?.stop(); };
    }, []);

    return { playBgm, stopBgm, playSfx, playSfxForContext, toggleMute, isMuted, playBgmForLesson };
}

// ── 静音按钮组件 ──
export function MuteButton({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className="fixed top-4 right-4 z-[100] bg-black/50 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[var(--accent-gold)]/30 transition-all"
            title={isMuted ? '取消静音' : '静音'}
        >
            <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
        </button>
    );
}
