#!/usr/bin/env node
/**
 * 4-in-1 补齐缺口图片（跨课合并优化版）
 * 
 * L3 = 24 张 → 6 次 API
 * L4 = 24 张 → 6 次 API
 * 零散合并 = 30 张 → 8 次 API
 * 总计 = 78 张 → 20 次 API（省 58 次！）
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');

const STYLE = [
    'dark OLED background',
    'executive professional presentation style',
    'cinematic moody lighting with muted gold and teal accents',
    'photorealistic or hyper-stylized illustration',
    'NO cartoon NO children NO neon NO rainbow NO cute robots NO bright colors',
    'ultra high quality 2K resolution',
    '4 distinct panels in precise 2x2 grid with thin dark divider lines',
].join(', ');

// ════════════════════════════════════════
// L3: 说人话即编程 (24 张 → 6 批)
// ════════════════════════════════════════
const L3_BATCHES = [
    {
        id: 'L3_b1', targets: ['l3_01', 'l3_02', 'l3_03', 'l3_04'],
        prompt: 'Top-Left: A frustrated executive at desk comparing two AI outputs on screen, one mediocre and one excellent, dark gold tones. ' +
            'Top-Right: A boss pointing vaguely at a whiteboard with blur text saying just do something, dark office with gold lamp. ' +
            'Bottom-Left: A bad prompt example floating as dim grey text in dark space, generic marketing plan output shown below. ' +
            'Bottom-Right: A golden prompt example glowing with structured text showing role background task format constraints, professional dashboard style.',
    },
    {
        id: 'L3_b2', targets: ['l3_05', 'l3_06', 'l3_07', 'l3_08'],
        prompt: 'Top-Left: Split screen showing 10X quality difference between bad and good AI output, golden divider, dark background. ' +
            'Top-Right: A manager giving clear instructions to a team in a golden boardroom, metaphor for managing people equals managing AI. ' +
            'Bottom-Left: Five golden cards labeled WHO WHAT HOW WHEN RULES floating in dark space, representing prompt engineering elements. ' +
            'Bottom-Right: An executive upgrading their management skills with golden glow, skill tree visualization in dark tech environment.',
    },
    {
        id: 'L3_b3', targets: ['l3_09', 'l3_10', 'l3_11', 'l3_12'],
        prompt: 'Top-Left: A golden formula floating in dark space: Role plus Context plus Task plus Format plus Constraints, five golden blocks connected. ' +
            'Top-Right: A production director avatar with 20 years badge glowing gold versus a generic AI assistant icon dimmed, dark comparison view. ' +
            'Bottom-Left: A context document showing factory orders and maintenance schedule, golden data tables on dark background. ' +
            'Bottom-Right: A bullseye target with golden arrow hitting center labeled clear objective minimize downtime, dark dramatic lighting.',
    },
    {
        id: 'L3_b4', targets: ['l3_13', 'l3_14', 'l3_15', 'l3_16'],
        prompt: 'Top-Left: A golden Excel template with columns date production-line category floating holographically in dark space. ' +
            'Top-Right: Boundary lines and constraint rules displayed as golden guardrails on a dark road, B-line Wednesday maintenance highlighted. ' +
            'Bottom-Left: A factory owner smiling at a perfect production schedule on a golden screen, generated in 30 seconds timestamp shown, dark office. ' +
            'Bottom-Right: Text saying speak human language equals programming in golden calligraphy on dark premium background.',
    },
    {
        id: 'L3_b5', targets: ['l3_17', 'l3_18', 'l3_19', 'l3_20'],
        prompt: 'Top-Left: A golden prompt formula card being memorized, brain icon absorbing five elements, dark educational setting. ' +
            'Top-Right: A real work scenario with boss saying analyze competitors shown as a dim bad prompt bubble, dark office. ' +
            'Bottom-Left: An upgraded golden prompt for pet food competitor analysis with structured table format shown on holographic screen, dark space. ' +
            'Bottom-Right: A luxury leather goods brand social media post being crafted by AI with golden text bubbles, dark creative studio.',
    },
    {
        id: 'L3_b6', targets: ['l3_21', 'l3_22', 'l3_23', 'l3_24'],
        prompt: 'Top-Left: A golden pattern revealed: Role Background Task Format Constraints shown as a repeating successful formula in dark elevator display. ' +
            'Top-Right: An equation in gold: Good Prompt equals Good Work Brief, management skill transferring to AI management, dark executive boardroom. ' +
            'Bottom-Left: A golden completion badge for lesson 3 with prompt formula icon, dark elegant celebration. ' +
            'Bottom-Right: A warning sign preview for next lesson about AI weaknesses and hallucinations, dark dramatic teaser with golden caution symbol.',
    },
];

// ════════════════════════════════════════
// L4: 驯服 AI 幻觉 (24 张 → 6 批)
// ════════════════════════════════════════
const L4_BATCHES = [
    {
        id: 'L4_b1', targets: ['l4_01', 'l4_02', 'l4_03', 'l4_04'],
        prompt: 'Top-Left: A bucket of cold water being poured dramatically in dark space with golden splash, reality check metaphor. ' +
            'Top-Right: A courtroom scene with a lawyer holding a document marked FAKE in red, golden gavel, dark dramatic legal setting. ' +
            'Bottom-Left: A broken AI brain with cracks showing fabricated text leaking out, golden and red warning tones on dark background, hallucination concept. ' +
            'Bottom-Right: An AI neural network diagram showing next word prediction path, golden nodes connecting plausible but wrong outputs, dark tech visualization.',
    },
    {
        id: 'L4_b2', targets: ['l4_05', 'l4_06', 'l4_07', 'l4_08'],
        prompt: 'Top-Left: A financial report with one number glowing red showing AI auto-correction error, dark accounting office with golden desk lamp. ' +
            'Top-Right: An intern badge on an AI robot with text review required, golden chain of command hierarchy, dark corporate setting. ' +
            'Bottom-Left: A golden balance scale showing trust versus verify, healthy AI usage mindset, dark philosophical space. ' +
            'Bottom-Right: A first defense shield glowing gold with text cite your sources, dark command center displaying source requirements.',
    },
    {
        id: 'L4_b3', targets: ['l4_09', 'l4_10', 'l4_11', 'l4_12'],
        prompt: 'Top-Left: A 60 percent reduction meter going from red to golden green, hallucination rate dropping when sources required, dark dashboard. ' +
            'Top-Right: Three AI models side by side giving answers, golden checkmarks on consensus areas, cross-validation concept in dark space. ' +
            'Bottom-Left: A manager listening to multiple employee reports before deciding, golden conference table, dark meeting room metaphor. ' +
            'Bottom-Right: A human reviewer with golden magnifying glass checking AI output, especially numbers legal medical content, dark QA station.',
    },
    {
        id: 'L4_b4', targets: ['l4_13', 'l4_14', 'l4_15', 'l4_16'],
        prompt: 'Top-Left: A golden workflow pipeline: AI Output arrow Source Check arrow Cross Validate arrow Human Review arrow Submit, dark process diagram. ' +
            'Top-Right: A graph showing 80 percent done by AI plus 20 percent human review equals 5X efficiency, golden chart on dark background. ' +
            'Bottom-Left: A golden SOP document titled AI Hallucination Defense with three defensive lines diagram, dark executive presentation. ' +
            'Bottom-Right: An interactive case analyzer screen showing the lawyer case study with golden diagnostic indicators, dark courtroom UI.',
    },
    {
        id: 'L4_b5', targets: ['l4_17', 'l4_18', 'l4_19', 'l4_20'],
        prompt: 'Top-Left: A golden mindset framework displayed: AI as smart intern not guru, dark motivational poster style. ' +
            'Top-Right: Split image: left side showing blind trust with crash, right side showing healthy skepticism with success, golden divide on dark bg. ' +
            'Bottom-Left: An enthusiastic but unreliable intern metaphor for AI, golden personality traits floating around a robot character, dark humorous style. ' +
            'Bottom-Right: A workflow mantra in gold: AI drafts you review, AI analyzes you decide, AI executes you judge, dark executive wall art.',
    },
    {
        id: 'L4_b6', targets: ['l4_21', 'l4_22', 'l4_23', 'l4_24'],
        prompt: 'Top-Left: A boss silhouette in golden light with text your value is judgment not labor, dark inspirational setting. ' +
            'Top-Right: Module 1 completion celebration with 4 golden badges for lessons 1-4, dark trophy case display. ' +
            'Bottom-Left: A recap graphic: three layers plus AI team plus prompt formula plus hallucination defense, four golden icons arranged in dark grid. ' +
            'Bottom-Right: A golden gate opening to Module 2 Weapon Forge with weapons and tools silhouettes, dark dramatic transition scene.',
    },
];

// ════════════════════════════════════════
// 零散缺口 跨课合并 (30 张 → 8 批)
// ════════════════════════════════════════
const FILL_BATCHES = [
    // Batch A: L8(2) + L9(2) = 4
    {
        id: 'Fill_A', targets: ['l8_29', 'l8_30', 'l9_29', 'l9_30'],
        prompt: 'Top-Left: An excited person ready to start building, golden hard hat and blueprint, dark construction metaphor for first project. ' +
            'Top-Right: A golden completion banner for Module 2 Five Building Blocks with 5 block icons, dark celebration with teal accents. ' +
            'Bottom-Left: A website as a golden window to the world, with a golden arrow pointing to next lesson about data dashboards, dark transition scene. ' +
            'Bottom-Right: A golden completion badge for smart website project with checkmark and website icon, dark elegant setting.',
    },
    // Batch B: L10(2) + L11(2) = 4
    {
        id: 'Fill_B', targets: ['l10_29', 'l10_30', 'l11_29', 'l11_30'],
        prompt: 'Top-Left: A golden completion screen showing second project done, dashboard and website icons both checked, dark achievement display. ' +
            'Top-Right: A golden data insight: dashboards should warn and analyze not just display, AI copilot metaphor in dark cockpit setting. ' +
            'Bottom-Left: Five golden building blocks stacked together showing mastery, dark tech background with subtle glow. ' +
            'Bottom-Right: A golden completion badge for 7x24 AI employee project with always-on clock icon, dark elegant celebratory setting.',
    },
    // Batch C: L12(2) + L13(2) = 4
    {
        id: 'Fill_C', targets: ['l12_29', 'l12_30', 'l13_26', 'l13_27'],
        prompt: 'Top-Left: A golden preview card showing 6 vertical industry workshops ahead, exciting dark dramatic teaser with golden sparkles. ' +
            'Top-Right: Module 3 Hands On completion banner with 4 golden project badges, dark trophy shelf display. ' +
            'Bottom-Left: Six golden weapon icons representing 6 workshop skills laid out in an arsenal, dark armory aesthetic. ' +
            'Bottom-Right: A golden completion badge for AI Image Factory workshop with image and factory icons, dark elegant setting.',
    },
    // Batch D: L14(3) + L19(1) = 4
    {
        id: 'Fill_D', targets: ['l14_25', 'l14_26', 'l14_27', 'l19_25'],
        prompt: 'Top-Left: A simulation scenario with a boss named Liu making 48-hour bid deadline decisions, golden clock ticking, dark war room. ' +
            'Top-Right: A golden summary card for workshop 2 with core takeaways listed as golden bullet points, dark executive notepad style. ' +
            'Bottom-Left: A golden three-strike formula for AI bid writing: multi-model relay plus simulated scoring plus human-AI collab, dark infographic. ' +
            'Bottom-Right: A golden completion badge for Lesson 19 with strategy and integration icons, dark elegant celebration.',
    },
    // Batch E: L14(4) + nothing, need to cover L14 remaining
    {
        id: 'Fill_E', targets: ['l14_28', 'l14_29', 'l14_30', 'l14_31'],
        prompt: 'Top-Left: A preview of OpenClaw Commander workshop with a golden AI agent lurking in WeChat group interface, dark spy-tech aesthetic. ' +
            'Top-Right: A frustrated project manager drowning in multiple WeChat group notifications, golden chaos on dark phone screens. ' +
            'Bottom-Left: A golden transformation moment: chaos ending and order beginning with AI agent taking control, dark dramatic before-after. ' +
            'Bottom-Right: A golden completion badge for AI Bid Craftsman workshop with document and AI pen icons, dark elegant setting.',
    },
    // Batch F: L15(3) + L17(2) = 4 (take L15 all 3 + L17 first 1, leave 1)
    {
        id: 'Fill_F', targets: ['l15_25', 'l15_26', 'l15_27', 'l17_25'],
        prompt: 'Top-Left: A golden dividing line separating normal AI that answers questions from Agent AI that proactively solves problems, dark futuristic split screen. ' +
            'Top-Right: A golden preview card for AI Content Matrix workshop showing 5 platform icons managed by one person, dark multi-screen setup. ' +
            'Bottom-Left: A golden completion badge for OpenClaw Commander workshop with agent and chat icons, dark elegant setting. ' +
            'Bottom-Right: A golden completion badge for AI Business Analysis workshop with chart and AI icons, dark elegant setting.',
    },
    // Batch G: L16(3) + L17(1) = 4
    {
        id: 'Fill_G', targets: ['l16_25', 'l16_26', 'l16_27', 'l17_26'],
        prompt: 'Top-Left: A golden natural language data query concept: just ask why did we lose money yesterday instead of SQL, dark Q&A interface. ' +
            'Top-Right: A golden completion badge for AI Content Matrix workshop with content and multi-platform icons, dark elegant setting. ' +
            'Bottom-Left: A dark premium infographic showing AI answering business questions directly without technical knowledge needed, golden query bubbles. ' +
            'Bottom-Right: A golden completion badge for AI Business Analysis workshop five with chart analysis icons, dark elegant setting.',
    },
    // Batch H: L18(2) + L20(3) = 4 (take L18 all 2 + L20 first 2)
    {
        id: 'Fill_H', targets: ['l18_25', 'l18_26', 'l20_17', 'l20_18'],
        prompt: 'Top-Left: A golden transformation arrow from methods to strategy, showing the final evolution step in AI mastery, dark cinematic. ' +
            'Top-Right: Module 4 Project Workshop golden completion banner with 6 workshop badges arranged in a crown, dark trophy celebration. ' +
            'Bottom-Left: A person standing tall in golden light with text go create because YOU are powerful AI just amplifies, dark inspirational setting. ' +
            'Bottom-Right: A golden banner with text the future belongs to those who command AI and you are one of them, dark graduation ceremony aesthetic.',
    },
    // Batch I: L20(1) remaining
    {
        id: 'Fill_I', targets: ['l20_19', null, null, null],
        prompt: 'Top-Left: A golden graduation cap with mortarboard emoji and thank you message, course complete celebration in dark elegant setting with confetti. ' +
            'Top-Right: Abstract golden geometric art with dark background, generic course decoration. ' +
            'Bottom-Left: Abstract golden particles flowing on dark background, generic course decoration. ' +
            'Bottom-Right: Abstract golden light rays on dark background, generic course decoration.',
    },
];

const ALL_BATCHES = [...L3_BATCHES, ...L4_BATCHES, ...FILL_BATCHES];

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
    const meta = await sharp(buffer).metadata();
    const w = meta.width;
    const h = meta.height;
    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);

    const quadrants = [
        { left: 0, top: 0, width: halfW, height: halfH },
        { left: halfW, top: 0, width: w - halfW, height: halfH },
        { left: 0, top: halfH, width: halfW, height: h - halfH },
        { left: halfW, top: halfH, width: w - halfW, height: h - halfH },
    ];

    const results = [];
    for (let i = 0; i < 4; i++) {
        const target = targets[i];
        if (!target) continue;
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
    const batchesToRun = testMode ? [ALL_BATCHES[0]] : ALL_BATCHES.slice(batchStart);

    const totalImages = batchesToRun.reduce((sum, b) => sum + b.targets.filter(Boolean).length, 0);
    console.log(`\n📸 缺口图片补齐器（跨课合并优化版）`);
    console.log(`   模式: ${testMode ? '测试(仅第1批)' : `全量(从第${batchStart + 1}批开始)`}`);
    console.log(`   批次: ${batchesToRun.length}/${ALL_BATCHES.length}`);
    console.log(`   预计图片: ${totalImages} 张`);
    console.log(`   API 调用: ${batchesToRun.length} 次\n`);

    let totalSaved = 0;
    let totalFailed = 0;

    for (let i = 0; i < batchesToRun.length; i++) {
        const batch = batchesToRun[i];
        const batchNum = batchStart + i + 1;
        console.log(`[${batchNum}/${ALL_BATCHES.length}] 生成 ${batch.id}...`);

        try {
            const buffer = await generateImage(batch.prompt);
            console.log(`   ✅ API 返回 ${(buffer.length / 1024).toFixed(0)}KB`);

            const saved = await splitAndSave(buffer, batch.targets);
            totalSaved += saved.length;
            saved.forEach(p => console.log(`   📎 ${path.basename(p)}`));

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
