#!/usr/bin/env node
/**
 * PRO MAX 增量图片生成器 — 补齐 L1-L4 扩展内容的插画
 * 
 * L1=30 句 (已有 12 张, 需补 18 张: l1_13 ~ l1_30)
 * L2=22 句 (已有 9 张, 需补 13 张: l2_10 ~ l2_22)
 * L3=24 句 (已有 5 张, 需补 19 张: l3_06 ~ l3_24)
 * L4=24 句 (已有 5 张, 需补 19 张: l4_06 ~ l4_24)
 * 总计 69 张
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ━━━ API 配置 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const CONCURRENCY = 3;
const BATCH_DELAY_MS = 1500;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');

const STYLE_SUFFIX = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, 16:9 aspect ratio, ultra high quality, no text, no watermark';

// ━━━ 需要补齐的图片 Prompts ━━━━━━━━━━━━━━━━━━━━━━━

const ALL_PROMPTS = [
    // ═══ L1: 被浪费的 ChatGPT（补 l1_13 ~ l1_30）═══
    // 场景2: AI 三层（l1_11~l1_20 → 补 l1_13~l1_20）
    { id: 'l1_13', prompt: 'Taxi cab hailing metaphor for AI usage, businessman standing in rain hailing a gold taxi, representing inefficient one-time AI queries' },
    { id: 'l1_14', prompt: 'Horizontal pyramid infographic showing three layers: toy layer taxi, tool layer private car, weapon layer ride-hailing platform, dark gold theme' },
    { id: 'l1_15', prompt: 'Person scrolling through ChatGPT on phone while sitting in office, distracted casual use, contrasted with AI automation dashboard on monitor behind' },
    { id: 'l1_16', prompt: 'Private chauffeur service metaphor, luxury black car with AI dashboard, representing API-level integration, efficient route planning' },
    { id: 'l1_17', prompt: 'Executive building AI automated pipeline, holographic assembly line in dark boardroom, representing tool-level automation' },
    { id: 'l1_18', prompt: 'One person standing at the center of a holographic command center, autonomous AI agents working around them, weapon-layer superindividual concept' },
    { id: 'l1_19', prompt: 'Factory manager looking at both Excel spreadsheet and AI production planning system side by side, contrast between old and new methods' },
    { id: 'l1_20', prompt: 'Three staffers at desks being replaced by one person with AI dashboard, savings calculation floating holographically showing 300K RMB saved' },

    // 场景3: 案例（l1_21~l1_30）
    { id: 'l1_21', prompt: 'Telescope metaphor, businessman looking through telescope at distant AI landscape, but never crossing the threshold' },
    { id: 'l1_22', prompt: 'Klarna headquarters at night with massive glowing logo, Nordic fintech building, AI processing visualized as golden data streams' },
    { id: 'l1_23', prompt: 'Infographic showing 3x efficiency arrow and 40 million dollars savings number, golden statistics floating in dark space' },
    { id: 'l1_24', prompt: 'Customer service center transformation, 700 human agents morphing into sleek AI terminals while humans move to strategy desks' },
    { id: 'l1_25', prompt: 'Bloomberg terminal with AI-generated financial news summaries, Duolingo owl mascot with AI content pipeline, dual case study visualization' },
    { id: 'l1_26', prompt: 'Timeline of 2024-2025 AI milestones floating as golden cards in dark space, each card highlighting a real business transformation' },
    { id: 'l1_27', prompt: 'CEO in suit managing AI dashboard rather than coding, emphasizing management skills transfer to AI leadership' },
    { id: 'l1_28', prompt: 'Management equals AI skill metaphor, hand managing human team on left, same hand managing AI agents on right, symmetrical composition' },
    { id: 'l1_29', prompt: 'Executive standing at massive glass door, looking at AI landscape beyond, hand on door handle about to open it' },
    { id: 'l1_30', prompt: 'Golden completion badge or seal floating in dark space, text-free, signifying first lesson completion, minimal elegant design' },

    // ═══ L2: AI 员工图鉴（补 l2_10 ~ l2_22）═══
    // 场景2 续: 模型详情（l2_07~l2_15 → 补 l2_10~l2_15）
    { id: 'l2_10', prompt: 'Chess board with different AI model logos as chess pieces, each piece in different style representing strategic positioning' },
    { id: 'l2_11', prompt: 'E-commerce customer service center split screen: left side mass auto-replies by cheap AI, right side premium dispute handling by elite AI agent' },
    { id: 'l2_12', prompt: 'Football team formation diagram with AI models as players, striker attacker and defender positions, tactical board aesthetic' },
    { id: 'l2_13', prompt: 'Strategic thinking scene, executive at whiteboard mapping company tasks to AI models, task-first matching methodology' },

    // 场景3: 策略（l2_16~l2_22）
    { id: 'l2_14', prompt: 'Task priority matrix on dark glass board, most labor-intensive tasks highlighted in gold, AI matching arrows pointing to each' },
    { id: 'l2_15', prompt: 'Cost pyramid showing 80-15-5 distribution, bulk tasks at base in silver, mid-tier in bronze, critical tasks at peak in gold' },
    { id: 'l2_16', prompt: 'China compliance shield icon with checkmark, representing domestic AI priority for Chinese businesses, tech sovereignty theme' },
    { id: 'l2_17', prompt: 'Quote card floating in dark space: not the most expensive, but the best fit, elegant gold text on dark glass' },
    { id: 'l2_18', prompt: 'Transition scene: AI team blueprint on desk, hand ready to pick up next tool, leading into communication skills lesson' },
    { id: 'l2_19', prompt: 'Blueprint for AI talent team laid out on dark desk, golden annotations showing different AI roles and responsibilities' },
    { id: 'l2_20', prompt: 'Course milestone marker: lesson 2 complete seal, AI team blueprint formed, dark gold achievement badge design' },
    { id: 'l2_21', prompt: 'Manager speaking to holographic AI assistants, communication visualization, speech bubbles transforming into code' },
    { id: 'l2_22', prompt: 'AI team organizational chart floating holographically, each position filled with a different AI model logo, gold-themed' },

    // ═══ L3: 说人话即编程（补 l3_06 ~ l3_24）═══
    { id: 'l3_06', prompt: 'Bad instruction chaos: messy handwritten note producing garbage AI output, tangled lines representing confused communication' },
    { id: 'l3_07', prompt: 'Good instruction perfection: precise brief document producing crystal clear AI output, clean golden lines of communication' },
    { id: 'l3_08', prompt: 'Boss giving clear team briefing in meeting room, professional delegation scene, paralleling AI prompt engineering with management' },
    { id: 'l3_09', prompt: 'Five golden building blocks assembling into prompt formula: Role, Context, Task, Format, Constraints, floating in dark space' },
    { id: 'l3_10', prompt: 'Golden formula banner: Role + Context + Task + Format + Constraints, displayed on dark executive screen' },
    { id: 'l3_11', prompt: 'Role assignment card: 20-year production director badge, professional ID card design with gold accents' },
    { id: 'l3_12', prompt: 'Context data: spreadsheet with orders and inventory flowing into AI system, structured data visualization' },
    { id: 'l3_13', prompt: 'Task definition: target board with bullseye showing minimize downtime objective, precision targeting metaphor' },
    { id: 'l3_14', prompt: 'Format specification: Excel table template with date, production line, category columns, clean structured output' },
    { id: 'l3_15', prompt: 'Constraint rules: boundary fence with warning signs showing maintenance schedule and priority rules, golden barriers' },
    { id: 'l3_16', prompt: 'Factory production manager reviewing AI-generated schedule on tablet, perfect plan output, satisfied expression' },
    { id: 'l3_17', prompt: 'Code-free programming concept: speech bubble transforming into golden code lines, natural language equals programming' },
    { id: 'l3_18', prompt: 'Workshop setting with practical exercises, hands-on prompt engineering training environment' },
    { id: 'l3_19', prompt: 'Bad prompt example: vague competitor analysis request on crumpled paper, versus golden upgraded version on clean brief' },
    { id: 'l3_20', prompt: 'Upgraded prompt in action: detailed analysis table comparing pet food brands across dimensions, professional output' },
    { id: 'l3_21', prompt: 'Social media copywriting transformation: simple post request versus detailed creative brief with target audience specs' },
    { id: 'l3_22', prompt: 'Pattern recognition: all good prompts following same 5-element formula, golden template overlay on various business scenarios' },
    { id: 'l3_23', prompt: 'Brief equals prompt: professional work brief document morphing into AI prompt, management skill transfer visualization' },
    { id: 'l3_24', prompt: 'Course milestone: lesson 3 complete, prompt formula mastery badge, golden seal with five-pointed formula star' },

    // ═══ L4: 驯服 AI 幻觉（补 l4_06 ~ l4_24）═══
    { id: 'l4_06', prompt: 'Intern at desk producing mixed quality work, some excellent some terrible, representing AI unreliability without oversight' },
    { id: 'l4_07', prompt: 'Golden mindset scale: balancing not fearing and not blindly trusting, equilibrium of healthy AI skepticism' },
    { id: 'l4_08', prompt: 'SOP standard operating procedure document floating in dark space with golden guidelines, three defense lines visualized' },
    { id: 'l4_09', prompt: 'First defense: AI output with source citations highlighted in gold, footnotes and references visible' },
    { id: 'l4_10', prompt: 'Statistic visualization: 60 percent reduction in hallucination rate when source requirements added, dramatic golden bar chart' },
    { id: 'l4_11', prompt: 'Cross-validation scene: three different AI screens showing same question with answers being compared, consensus highlighted in gold' },
    { id: 'l4_12', prompt: 'Management meeting parallel: executive listening to multiple reports before deciding, same logic for AI validation' },
    { id: 'l4_13', prompt: 'Human review checkpoint: golden stamping mechanism approving AI output before publication, quality control metaphor' },
    { id: 'l4_14', prompt: 'Complete SOP flowchart: AI Output to Source Check to Cross Validation to Human Review to Final Submit, golden pipeline' },
    { id: 'l4_15', prompt: '80-20 efficiency visualization, AI handling 80% of work in gold, human reviewing 20% precision work, still 5x efficiency gain' },
    { id: 'l4_16', prompt: 'Summit meeting room scene, executive at peak of learning curve, panoramic window showing AI landscape below' },
    { id: 'l4_17', prompt: 'Warning sign: treating AI as infallible oracle leads to disaster, crumbling Turing test certificate' },
    { id: 'l4_18', prompt: 'Correct approach: enthusiastic but boastful intern being managed properly by experienced boss, productive collaboration' },
    { id: 'l4_19', prompt: 'Three golden rules: AI does drafts you review, AI analyzes you decide, AI executes you judge, elegant cards in dark space' },
    { id: 'l4_20', prompt: 'Boss evolution metaphor: from worker to judge, the value is in correct judgment not manual labor' },
    { id: 'l4_21', prompt: 'Module 1 recap infographic: four lessons covering three layers, team building, prompt formula, hallucination defense' },
    { id: 'l4_22', prompt: 'Four golden keys or pillars representing completed lessons: AI layers, AI team, prompt skills, safety protocols' },
    { id: 'l4_23', prompt: 'Transition bridge: from cognitive breakthrough module to weapon forging module, golden bridge connecting two phases' },
    { id: 'l4_24', prompt: 'Module 1 completion celebration: elegant golden achievement emblem, cognitive breakthrough unlocked, dark minimal design' },
];

// ━━━ 生成逻辑（同原脚本）━━━━━━━━━━━━━━━━━━━━━━━━

async function generateImage(id, prompt) {
    const fullPrompt = prompt + STYLE_SUFFIX;
    const jpgPath = path.join(OUTPUT_DIR, `${id}.jpg`);
    const webpPath = path.join(OUTPUT_DIR, `${id}.webp`);

    // 跳过已存在的 WebP
    if (fs.existsSync(webpPath)) {
        console.log(`  ⏭  ${id} 已存在 — 跳过`);
        return { id, status: 'skipped' };
    }

    console.log(`  → 生成 ${id}...`);
    console.log(`    Prompt: "${fullPrompt.slice(0, 80)}..."`);

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
        if (!imageUrl) throw new Error('No image URL in response');

        // 下载图片
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
    console.log(`║   增量插画生成器 — 补齐 L1-L4 扩展内容       ║`);
    console.log(`╠══════════════════════════════════════════════╣`);
    console.log(`║ 待生成:  ${ALL_PROMPTS.length} 张                             ║`);
    console.log(`║ 并发:    ${CONCURRENCY}                                ║`);
    console.log(`╚══════════════════════════════════════════════╝\n`);

    // 检查哪些已存在
    const existing = ALL_PROMPTS.filter(p => fs.existsSync(path.join(OUTPUT_DIR, `${p.id}.webp`)));
    const toGenerate = ALL_PROMPTS.filter(p => !fs.existsSync(path.join(OUTPUT_DIR, `${p.id}.webp`)));

    console.log(`📊 总计: ${ALL_PROMPTS.length} | 已有: ${existing.length} | 待生成: ${toGenerate.length}\n`);

    let ok = 0, failed = 0;

    // 分批并发
    for (let i = 0; i < toGenerate.length; i += CONCURRENCY) {
        const batch = toGenerate.slice(i, i + CONCURRENCY);
        const batchNum = Math.floor(i / CONCURRENCY) + 1;
        const totalBatches = Math.ceil(toGenerate.length / CONCURRENCY);

        console.log(`\n━━━ Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')}) ━━━`);

        const results = await Promise.all(batch.map(p => generateImage(p.id, p.prompt)));

        for (const r of results) {
            if (r.status === 'ok') ok++;
            else if (r.status === 'error') failed++;
        }

        if (i + CONCURRENCY < toGenerate.length) {
            console.log(`  ⏳ 等待 ${BATCH_DELAY_MS}ms...`);
            await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
        }
    }

    console.log(`\n📊 生成完毕！成功: ${ok} | 失败: ${failed}\n`);

    // 转 WebP
    const jpgs = fs.readdirSync(OUTPUT_DIR).filter(f => /^l[1-4]_\d+\.jpg$/.test(f));
    if (jpgs.length > 0) {
        console.log(`🔄 Converting ${jpgs.length} JPG → WebP...`);
        for (const jpg of jpgs) {
            const jpgPath = path.join(OUTPUT_DIR, jpg);
            const webpPath = path.join(OUTPUT_DIR, jpg.replace('.jpg', '.webp'));
            try {
                const origSize = fs.statSync(jpgPath).size;
                await sharp(jpgPath).webp({ quality: 85 }).toFile(webpPath);
                const newSize = fs.statSync(webpPath).size;
                const savings = ((1 - newSize / origSize) * 100).toFixed(0);
                console.log(`  ✅ ${jpg} → .webp (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${savings}%)`);
            } catch (err) {
                console.error(`  ❌ ${jpg} 转换失败: ${err.message}`);
            }
        }
    }

    console.log(`\n🎉 全部完成！`);
}

main();
