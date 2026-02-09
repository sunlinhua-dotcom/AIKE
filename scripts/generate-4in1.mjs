#!/usr/bin/env node
/**
 * 4-in-1 图片生成 + 切割脚本
 * 
 * 1 次 API = 生成 1 张 2K (2048×2048) 拼图
 * sharp 自动切割为 4 张 1024×1024 独立 webp
 * 节省 75% API 成本
 * 
 * 用法：
 *   node scripts/generate-4in1.mjs --test     # 只生成第 1 张测试
 *   node scripts/generate-4in1.mjs --all      # 全部生成
 *   node scripts/generate-4in1.mjs --batch 2  # 从第 2 批开始
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ─── 配置 ───
const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');

// ─── R4 强制风格后缀（防御规则） ───
const STYLE = [
    'dark OLED background',
    'executive professional presentation style',
    'cinematic moody lighting with muted gold and teal accents',
    'photorealistic or hyper-stylized illustration',
    'NO cartoon NO children NO neon NO rainbow NO cute robots NO bright colors',
    'ultra high quality 2K resolution',
    '4 distinct panels in precise 2x2 grid with thin dark divider lines',
].join(', ');

// ─── L1 + L2 图片 Prompt 数据 ───
// 每个 batch = 4 张图 = 1 次 API
const BATCHES = [
    // ══════ L1: 被浪费的 ChatGPT (31 张 → 8 批 = 8 次 API) ══════
    {
        id: 'L1_batch1', // l1_01 ~ l1_04
        targets: ['l1_01', 'l1_02', 'l1_03', 'l1_04'],
        prompt: 'Top-Left: A sleek dark executive office with a holographic AI assistant greeting a business person, golden glow. ' +
            'Top-Right: A corporate survey form floating in dark space with a glowing ChatGPT logo and a question mark. ' +
            'Bottom-Left: A luxury sports car (gold trim) parked in a garage with only the radio playing, metaphor for waste. ' +
            'Bottom-Right: An infographic showing 83 percent in large golden numbers against a dark dashboard background with small usage charts.',
    },
    {
        id: 'L1_batch2', // l1_05 ~ l1_08
        targets: ['l1_05', 'l1_06', 'l1_07', 'l1_08'],
        prompt: 'Top-Left: A luxury Ferrari parked in darkness with only the radio dial glowing gold, metaphor for buying but not using AI. ' +
            'Top-Right: A warning hologram display floating in dark space showing diagnostic text about AI being used as a toy. ' +
            'Bottom-Left: A 4S car showroom with a test drive car circling endlessly, dark cinematic lighting with gold accents. ' +
            'Bottom-Right: A mentor figure in silhouette extending a hand to help someone up stairs made of golden light.',
    },
    {
        id: 'L1_batch3', // l1_09 ~ l1_12
        targets: ['l1_09', 'l1_10', 'l1_11', 'l1_12'],
        prompt: 'Top-Left: A single person standing before a massive AI brain hologram, representing AI replacing a team, dark gold tones. ' +
            'Top-Right: Preparation moment: a hand reaching toward a glowing golden door labeled with circuit patterns, dark atmosphere. ' +
            'Bottom-Left: A three-tier pyramid floating in dark space, bottom toy layer dim, middle tool layer blue, top weapon layer glowing gold. ' +
            'Bottom-Right: A taxi metaphor: a person hailing a cab in rain at night with golden streetlights, representing inefficient one-off AI usage.',
    },
    {
        id: 'L1_batch4', // l1_13 ~ l1_16
        targets: ['l1_13', 'l1_14', 'l1_15', 'l1_16'],
        prompt: 'Top-Left: A person at a desk repeatedly opening and closing a laptop, monotonous repetition in dark room with golden desk lamp. ' +
            'Top-Right: An automated assembly line metaphor: golden API pipeline connecting systems, data flowing like liquid gold in dark factory. ' +
            'Bottom-Left: A person at control center with multiple golden screens showing auto-generated reports and AI dashboards. ' +
            'Bottom-Right: The third tier of AI: a glowing golden platform city built by one person, representing systemic AI deployment.',
    },
    {
        id: 'L1_batch5', // l1_17 ~ l1_20
        targets: ['l1_17', 'l1_18', 'l1_19', 'l1_20'],
        prompt: 'Top-Left: A single superhero silhouette standing atop a golden AI system tower, one person equals one team concept. ' +
            'Top-Right: A factory owner at messy desk covered in Excel spreadsheets with a dim ChatGPT window open, dark realistic scene. ' +
            'Bottom-Left: An AI scheduling system dashboard glowing gold showing production lines A B C with automated decisions. ' +
            'Bottom-Right: A golden staircase ascending from dim bottom to brilliantly lit top, with text-like steps representing 20 lessons to mastery.',
    },
    {
        id: 'L1_batch6', // l1_21 (interactive scene - 1 image needed)
        targets: ['l1_21', 'l1_22', 'l1_23', 'l1_24'],
        prompt: 'Top-Left: An interactive decision matrix floating in dark space with golden checkboxes and three tier labels. ' +
            'Top-Right: A business person looking at a giant golden newspaper headline about Klarna from a dark penthouse. ' +
            'Bottom-Left: The Klarna logo integrated into a futuristic golden tech wall showing 700 jobs automated, dark corporate aesthetic. ' +
            'Bottom-Right: A graph showing 3X efficiency boost in gold with 40 million dollars savings floating in dark space.',
    },
    {
        id: 'L1_batch7', // l1_25 ~ l1_28
        targets: ['l1_25', 'l1_26', 'l1_27', 'l1_28'],
        prompt: 'Top-Left: An executive in a dark boardroom with AI doing the work of 700 people shown as golden silhouette crowd behind. ' +
            'Top-Right: Bloomberg and Duolingo logos floating as golden holograms in a dark tech corridor, representing real AI success cases. ' +
            'Bottom-Left: A timeline ribbon from 2024-2025 glowing in gold showing major AI milestones, dark cinematic background. ' +
            'Bottom-Right: A CEO figure not coding but managing AI agents shown as golden chess pieces on a dark board.',
    },
    {
        id: 'L1_batch8', // l1_29 ~ l1_31 (only 3 needed, 4th is bonus)
        targets: ['l1_29', 'l1_30', 'l1_31', null],
        prompt: 'Top-Left: Management equals AI management: two golden scales balancing human team icon and AI brain icon in dark space. ' +
            'Top-Right: A telescope being put down and a golden door opening to let AI into a company building, dark dramatic lighting. ' +
            'Bottom-Left: A completion badge glowing gold with checkmark, lesson complete celebration in dark elegant environment. ' +
            'Bottom-Right: A preview teaser showing shadowy AI employee silhouettes lined up for the next lesson, dark gold anticipation.',
    },

    // ══════ L2: AI 员工图鉴 (23 张 → 6 批 = 6 次 API) ══════
    {
        id: 'L2_batch1', // l2_01 ~ l2_04
        targets: ['l2_01', 'l2_02', 'l2_03', 'l2_04'],
        prompt: 'Top-Left: A recruiter at a dark executive desk reviewing holographic AI candidate profiles floating in gold. ' +
            'Top-Right: A golden question mark shattering into pieces with text which AI is best, dark dramatic scene. ' +
            'Bottom-Left: Five diverse AI robot silhouettes standing in a lineup, each with unique specialty icons, dark gold palette. ' +
            'Bottom-Right: A 2026 AI talent marketplace visualization with 50+ model logos floating as golden cards in dark space.',
    },
    {
        id: 'L2_batch2', // l2_05 ~ l2_08
        targets: ['l2_05', 'l2_06', 'l2_07', 'l2_08'],
        prompt: 'Top-Left: Five golden resume cards spread on a dark mahogany desk, each with a different AI brand emblem. ' +
            'Top-Right: A golden holographic interview room with AI model avatars standing in interview positions. ' +
            'Bottom-Left: Claude AI as a golden judge figure with scales of justice and legal documents, dark courtroom aesthetic. ' +
            'Bottom-Right: Gemini AI as a creative director with golden paintbrush and camera surrounded by multimedia content, dark studio.',
    },
    {
        id: 'L2_batch3', // l2_09 ~ l2_12
        targets: ['l2_09', 'l2_10', 'l2_11', 'l2_12'],
        prompt: 'Top-Left: GLM AI as a Chinese operations assistant with calligraphy brush and golden yuan coins, traditional meets tech in dark room. ' +
            'Top-Right: GPT-5 as a golden CEO figure sitting at the head of a long boardroom table, commanding presence in darkness. ' +
            'Bottom-Left: DeepSeek AI as a math genius with golden equations floating around like a Beautiful Mind scene, dark background. ' +
            'Bottom-Right: A strategic mind map showing each AI positioned in the right department of a company org chart, golden nodes on dark background.',
    },
    {
        id: 'L2_batch4', // l2_13 ~ l2_16
        targets: ['l2_13', 'l2_14', 'l2_15', 'l2_16'],
        prompt: 'Top-Left: Cost gradient pyramid with cheap AI at wide bottom and expensive AI at narrow golden top, dark infographic style. ' +
            'Top-Right: An e-commerce company dashboard showing customer service cost dropping from 150K to 20K in golden charts, dark UI. ' +
            'Bottom-Left: A football team formation diagram but with AI models instead of players, golden jerseys on dark pitch. ' +
            'Bottom-Right: An interactive model comparison radar chart hologram floating in dark space, golden data visualization.',
    },
    {
        id: 'L2_batch5', // l2_17 ~ l2_20
        targets: ['l2_17', 'l2_18', 'l2_19', 'l2_20'],
        prompt: 'Top-Left: Three golden principle cards floating in dark space: Task Priority, Cost Gradient, Domestic First. ' +
            'Top-Right: A golden priority list with top 3 labor-intensive tasks highlighted at a dark executive desk. ' +
            'Bottom-Left: An 80-15-5 cost pyramid in golden tones showing task distribution strategy in dark elegant space. ' +
            'Bottom-Right: A China compliance shield icon glowing gold next to domestic AI logos, dark corporate security aesthetic.',
    },
    {
        id: 'L2_batch6', // l2_21 ~ l2_23 (only 3 needed)
        targets: ['l2_21', 'l2_22', 'l2_23', null],
        prompt: 'Top-Left: Golden calligraphy text: choose the right fit not the most expensive, floating in dark executive space. ' +
            'Top-Right: A preview of next lesson showing a person learning to communicate with AI employees through golden speech bubbles. ' +
            'Bottom-Left: A golden completion badge for Lesson 2 with checkmark and AI team blueprint icon in dark elegant setting. ' +
            'Bottom-Right: A dark abstract pattern with golden geometric shapes, suitable as a generic course background.',
    },
];

// ─── 工具函数 ───

async function generateImage(prompt) {
    const fullPrompt = prompt + ', ' + STYLE;
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({ model: MODEL, prompt: fullPrompt, n: 1, size: SIZE }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API ${res.status}: ${errorText}`);
    }

    const json = await res.json();
    const url = json.data?.[0]?.url;
    if (!url) throw new Error('No image URL in response');

    const imgRes = await fetch(url);
    return Buffer.from(await imgRes.arrayBuffer());
}

async function splitAndSave(buffer, targets) {
    const img = sharp(buffer);
    const meta = await img.metadata();
    const w = meta.width;
    const h = meta.height;
    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);

    const quadrants = [
        { left: 0, top: 0, width: halfW, height: halfH },         // 左上
        { left: halfW, top: 0, width: w - halfW, height: halfH },  // 右上
        { left: 0, top: halfH, width: halfW, height: h - halfH },  // 左下
        { left: halfW, top: halfH, width: w - halfW, height: h - halfH }, // 右下
    ];

    const results = [];
    for (let i = 0; i < 4; i++) {
        const target = targets[i];
        if (!target) continue; // null = 不需要的多余象限
        const outPath = path.join(OUTPUT_DIR, `${target}.webp`);
        await sharp(buffer)
            .extract(quadrants[i])
            .webp({ quality: 85 })
            .toFile(outPath);
        results.push(outPath);
    }
    return results;
}

// ─── 主逻辑 ───

async function main() {
    const args = process.argv.slice(2);
    const testMode = args.includes('--test');
    const batchStart = args.includes('--batch') ? parseInt(args[args.indexOf('--batch') + 1]) - 1 : 0;

    const batchesToRun = testMode ? [BATCHES[0]] : BATCHES.slice(batchStart);

    console.log(`\n📸 4-in-1 图片生成器`);
    console.log(`   模式: ${testMode ? '测试(仅第1批)' : `全量(从第${batchStart + 1}批开始)`}`);
    console.log(`   批次: ${batchesToRun.length}/${BATCHES.length}`);
    console.log(`   预计图片: ${batchesToRun.reduce((sum, b) => sum + b.targets.filter(Boolean).length, 0)} 张`);
    console.log(`   API 调用: ${batchesToRun.length} 次\n`);

    let totalSaved = 0;
    let totalFailed = 0;

    for (let i = 0; i < batchesToRun.length; i++) {
        const batch = batchesToRun[i];
        const batchNum = batchStart + i + 1;
        console.log(`[${batchNum}/${BATCHES.length}] 生成 ${batch.id}...`);

        try {
            // 1. API 生成 2K 拼图
            const buffer = await generateImage(batch.prompt);
            console.log(`   ✅ API 返回 ${(buffer.length / 1024).toFixed(0)}KB`);

            // 2. 切割为 4 张 webp
            const saved = await splitAndSave(buffer, batch.targets);
            totalSaved += saved.length;
            saved.forEach(p => console.log(`   📎 ${path.basename(p)}`));

            // 3. 每批间隔 2 秒避免限流
            if (i < batchesToRun.length - 1) {
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (err) {
            totalFailed++;
            console.error(`   ❌ 失败: ${err.message}`);
        }
    }

    console.log(`\n✅ 完成! 保存 ${totalSaved} 张, 失败 ${totalFailed} 批`);
}

main().catch(console.error);
