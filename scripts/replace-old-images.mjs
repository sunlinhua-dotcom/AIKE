#!/usr/bin/env node
/**
 * 替换 L1-L4 第一批旧图片 — 用新的 PRO MAX 暗金风格
 * 
 * 这 31 张图片最初是用旧内容的 prompt 生成的，现在需要和新扩展内容匹配。
 * l1_01~l1_12, l2_01~l2_09, l3_01~l3_05, l4_01~l4_05
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = process.env.APIYI_API_KEY;
if (!API_KEY) throw new Error('APIYI_API_KEY is not set');
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const CONCURRENCY = 3;
const BATCH_DELAY_MS = 1500;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');

const STYLE_SUFFIX = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, 16:9 aspect ratio, ultra high quality, no text, no watermark';

const ALL_PROMPTS = [
    // ═══ L1 场景1: 痛点觉醒（l1_01 ~ l1_10）═══
    { id: 'l1_01', prompt: 'Executive welcome scene in dark gold boardroom, AI holographic advisor materializing, premium business consultation atmosphere' },
    { id: 'l1_02', prompt: 'Survey question floating holographically: ChatGPT subscription card on dark desk, corporate credit card payment for AI tools' },
    { id: 'l1_03', prompt: 'Money being wasted metaphor, golden dollar signs dissolving into smoke, AI subscription going unused in corporate setting' },
    { id: 'l1_04', prompt: 'Data visualization: 83 percent bar chart in gold against dark background, showing wasted AI potential in enterprises' },
    { id: 'l1_05', prompt: 'Ferrari car being used only as a radio, absurd luxury waste metaphor, expensive tool severely underutilized' },
    { id: 'l1_06', prompt: 'Warning diagnostic dashboard in dark control room, red alert signs indicating AI toyification syndrome in business' },
    { id: 'l1_07', prompt: 'Test drive car at dealership metaphor, businessman forever test-driving but never purchasing, representing perpetual AI trial mode' },
    { id: 'l1_08', prompt: 'Supportive mentor scene, wise advisor in dark gold setting explaining that lack of training is the real problem, not the tool' },
    { id: 'l1_09', prompt: 'One person commanding an entire AI team, holographic army of digital workers surrounding single executive, superindividual concept' },
    { id: 'l1_10', prompt: 'Cinematic transition scene, golden light beam illuminating path forward, preparing to enter the three layers of AI understanding' },

    // ═══ L1 场景2: 三层（l1_11 ~ l1_12 → 前两句）═══
    { id: 'l1_11', prompt: 'Three-tier architectural visualization of AI usage levels, pyramid with toy-tool-weapon layers, dark golden holographic display' },
    { id: 'l1_12', prompt: 'Taxi hailing in the rain metaphor, inefficient one-time AI interaction, casual user asking the same questions repeatedly' },

    // ═══ L2 场景1: 市场（l2_01 ~ l2_06）═══
    { id: 'l2_01', prompt: 'Transition from previous lesson, executive opening door to AI talent marketplace, golden light streaming through doorway' },
    { id: 'l2_02', prompt: 'Recruitment interview metaphor gone wrong, asking which AI is best is like asking which employee is best, wrong question illustration' },
    { id: 'l2_03', prompt: 'AI team assembly concept, diverse holographic AI agents each with different specializations standing in formation' },
    { id: 'l2_04', prompt: 'Marketplace of 50 plus AI models displayed on dark screens, but spotlight on 5-6 key players, focused selection' },
    { id: 'l2_05', prompt: 'Job interview scene with five AI candidate resumes laid out on dark desk, gold-lit assessment environment' },
    { id: 'l2_06', prompt: 'AI interview room entrance, glass door opening to reveal candidate profiles, each with unique capability badges' },

    // ═══ L2 场景2: 模型介绍（l2_07 ~ l2_09）═══
    { id: 'l2_07', prompt: 'Claude AI as chief compliance officer, scales of justice in one hand, legal documents in other, premium dark gold portrait' },
    { id: 'l2_08', prompt: 'Gemini AI as creative director, multimodal capabilities shown as video film and canvas simultaneously, creative studio dark gold' },
    { id: 'l2_09', prompt: 'GLM Chinese AI specialist, dragon and digital elements merge, China flag accents, cost-effective badge, compliance checkmark' },

    // ═══ L3 场景1: 指令之痛（l3_01 ~ l3_05）═══
    { id: 'l3_01', prompt: 'Contrast between intern-quality AI output and McKinsey-quality AI output, split screen comparison on dark gold monitors' },
    { id: 'l3_02', prompt: 'Boss giving vague instructions to confused employee, messy unclear communication metaphor in dark boardroom setting' },
    { id: 'l3_03', prompt: 'Bad AI prompt example: crumpled paper with vague request producing garbage output, failed communication in gold-lit office' },
    { id: 'l3_04', prompt: 'Perfect AI prompt example: detailed structured brief on golden paper producing brilliant analysis output, clear communication' },
    { id: 'l3_05', prompt: 'Dramatic quality gap visualization: 10x difference shown as escalator going up from basic to expert-level AI outputs' },

    // ═══ L4 场景1: 律师案例（l4_01 ~ l4_05）═══
    { id: 'l4_01', prompt: 'Cold water splash metaphor, wake-up call warning about AI limitations after learning prompt skills, dark dramatic lighting' },
    { id: 'l4_02', prompt: 'Courtroom scandal scene, lawyer presenting fake AI-generated legal cases, judge discovering fabricated citations, dramatic dark gold' },
    { id: 'l4_03', prompt: 'AI hallucination concept visualization, confident-looking AI generating plausible but completely fictional information, sinister glow' },
    { id: 'l4_04', prompt: 'Brain prediction mechanism: next-word prediction engine that does not understand truth, neural network producing convincing lies' },
    { id: 'l4_05', prompt: 'Financial report with one wrong number highlighted in red, AI auto-correcting data incorrectly, near-miss tax disaster scenario' },
];

async function generateImage(id, prompt) {
    const fullPrompt = prompt + STYLE_SUFFIX;
    const jpgPath = path.join(OUTPUT_DIR, `${id}.jpg`);
    const webpPath = path.join(OUTPUT_DIR, `${id}.webp`);

    console.log(`  → 替换 ${id}...`);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ model: MODEL, prompt: fullPrompt, n: 1, size: SIZE }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`);
        }

        const json = await res.json();
        const imageUrl = json.data?.[0]?.url;
        if (!imageUrl) throw new Error('No image URL');

        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(jpgPath, buffer);
        console.log(`  ✅ ${id} → saved (${(buffer.length / 1024).toFixed(0)}KB)`);

        return { id, status: 'ok', size: buffer.length };
    } catch (err) {
        console.error(`  ❌ ${id} 失败: ${err.message}`);
        return { id, status: 'error', error: err.message };
    }
}

async function main() {
    console.log(`\n╔══════════════════════════════════════════════╗`);
    console.log(`║  替换旧图片 — KID 项目图 → PRO MAX 暗金      ║`);
    console.log(`╠══════════════════════════════════════════════╣`);
    console.log(`║ 待替换:  ${ALL_PROMPTS.length} 张                             ║`);
    console.log(`╚══════════════════════════════════════════════╝\n`);

    let ok = 0, failed = 0;

    for (let i = 0; i < ALL_PROMPTS.length; i += CONCURRENCY) {
        const batch = ALL_PROMPTS.slice(i, i + CONCURRENCY);
        const batchNum = Math.floor(i / CONCURRENCY) + 1;
        const totalBatches = Math.ceil(ALL_PROMPTS.length / CONCURRENCY);

        console.log(`\n━━━ Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')}) ━━━`);
        const results = await Promise.all(batch.map(p => generateImage(p.id, p.prompt)));

        for (const r of results) {
            if (r.status === 'ok') ok++;
            else if (r.status === 'error') failed++;
        }

        if (i + CONCURRENCY < ALL_PROMPTS.length) {
            console.log(`  ⏳ 等待 ${BATCH_DELAY_MS}ms...`);
            await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
        }
    }

    console.log(`\n📊 生成完毕！成功: ${ok} | 失败: ${failed}`);

    // 转 WebP（覆盖旧的 .webp）
    const jpgs = ALL_PROMPTS.map(p => p.id + '.jpg');
    console.log(`\n🔄 Converting ${jpgs.length} JPG → WebP (覆盖旧图)...`);
    for (const jpg of jpgs) {
        const jpgPath = path.join(OUTPUT_DIR, jpg);
        const webpPath = path.join(OUTPUT_DIR, jpg.replace('.jpg', '.webp'));
        if (fs.existsSync(jpgPath)) {
            try {
                const origSize = fs.statSync(jpgPath).size;
                await sharp(jpgPath).webp({ quality: 85 }).toFile(webpPath + '.tmp');
                // 覆盖旧 WebP
                fs.renameSync(webpPath + '.tmp', webpPath);
                const newSize = fs.statSync(webpPath).size;
                const savings = ((1 - newSize / origSize) * 100).toFixed(0);
                console.log(`  ✅ ${jpg} → .webp (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${savings}%)`);
                // 清理 JPG
                fs.unlinkSync(jpgPath);
            } catch (err) {
                console.error(`  ❌ ${jpg} 转换失败: ${err.message}`);
            }
        }
    }

    console.log(`\n🎉 全部旧图已替换为 PRO MAX 暗金风格！`);
}

main();
