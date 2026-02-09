/**
 * 批量生成课程配图脚本 — PRO MAX 商务版
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 模型:   seedream-4-5-251128
 * API:    api.apiyi.com (OpenAI-compatible)
 * 风格:   Dark Gold Executive — 深色背景 + 金色元素 + 商务场景
 * 用法:   node scripts/generate-pro-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'lessons');

// ── API 配置 ──────────────────────────────────────────
const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const CONCURRENCY = 3;          // 每批并发数
const BATCH_DELAY_MS = 1500;    // 批次间延迟

// ── 风格前缀（统一追加到每个 prompt 后面） ──
const STYLE_SUFFIX = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, 16:9 aspect ratio, ultra high quality, no text, no watermark';

// ── L1-L4 插画提示词（31 张） ──────────────────────────
const ALL_PROMPTS = [
    // ━━━ L1: 被浪费的 ChatGPT（12 张）━━━━━━━━━━━━━━━━━
    { id: 'l1_01', prompt: 'Executive sitting alone in a dark modern office, multiple screens showing AI chat interfaces with superficial conversations, wasted potential visualization, dim blue screen glow on face' },
    { id: 'l1_02', prompt: 'Split comparison: left side shows a luxury sports car being used to buy groceries, right side shows the same car racing on track, metaphor for wasted AI potential, dramatic lighting' },
    { id: 'l1_03', prompt: 'Business dashboard with warning indicators, holographic alert showing 90 percent of companies only use AI as chat toy, red warning lights, control room atmosphere' },
    { id: 'l1_04', prompt: 'Metaphor of test driving a luxury car forever but never buying it, car dealership with glowing neon, executive looking at the car through glass, yearning but hesitant' },

    { id: 'l1_05', prompt: 'Three-layer pyramid diagram floating holographically in dark boardroom: bottom layer labeled Toy with chat bubble icon, middle layer labeled Tool with gear icon, top layer labeled Weapon with diamond icon, golden light emanating from top' },
    { id: 'l1_06', prompt: 'Person hailing a taxi in rain representing AI chat usage, versus a private fleet of autonomous vehicles representing AI system deployment, city skyline at night, dramatic contrast' },
    { id: 'l1_07', prompt: 'Factory manager looking at Excel spreadsheet on old monitor while holographic AI production scheduler floats behind him unused, industrial setting, harsh fluorescent vs soft gold light contrast' },
    { id: 'l1_08', prompt: 'Business person building their own ride-hailing platform represented as glowing golden network nodes, versus single taxi ride, dark cityscape, power and scale visualization' },
    { id: 'l1_09', prompt: 'Ancient stone age tools next to modern Excel spreadsheet on factory desk, juxtaposition of old and new inefficiency, dusty golden light streaming through factory window' },

    { id: 'l1_10', prompt: 'Klarna fintech headquarters at night, massive building with glowing logo, 700 AI agents visualized as golden light streams flowing through the building, futuristic corporate' },
    { id: 'l1_11', prompt: 'Infographic visualization: 3x efficiency arrow going up, 40 million dollars savings counter, professional dark dashboard style with gold accents, data-driven business metrics' },
    { id: 'l1_12', prompt: 'Executive standing at massive glass door, looking out at AI landscape beyond, hand on door handle about to open it, golden light pouring through the crack, metaphor for letting AI into the company' },

    // ━━━ L2: AI 员工图鉴（9 张）━━━━━━━━━━━━━━━━━━━━━━
    { id: 'l2_01', prompt: 'Corporate hiring board with 5 AI model cards pinned like candidate profiles, each with headshot-style icons and qualification badges, HR office aesthetic, warm golden desk lamp' },
    { id: 'l2_02', prompt: 'AI talent marketplace visualization, multiple AI model logos arranged like a chess board, each piece representing a different capability, strategic deployment metaphor, dark polished table' },

    { id: 'l2_03', prompt: 'Elegant corporate badge card for Claude AI showing Chief Compliance Officer title, serious and prestigious design, embossed gold text on matte black, luxury corporate ID' },
    { id: 'l2_04', prompt: 'Creative director workspace with multiple screens showing design, video analysis, long documents, representing Gemini multimodal capabilities, artistic but professional studio' },
    { id: 'l2_05', prompt: 'Chinese-style business office with GLM AI assistant avatar, red and gold accents, Chinese calligraphy elements, cost-effective visualization with yuan symbols, cultural business aesthetic' },
    { id: 'l2_06', prompt: 'War room strategy table with AI models positioned like military units, commander figure placing pieces on map, strategic deployment of different AI for different tasks, dramatic overhead lighting' },
    { id: 'l2_07', prompt: 'Customer service center with thousands of golden AI agent icons handling requests versus expensive human agents on other side, cost comparison visualization, corporate efficiency' },
    { id: 'l2_08', prompt: 'Chess grandmaster making strategic move, each chess piece is a different AI model, strategic thinking about which model for which task, intense concentration, golden chess pieces on dark board' },

    { id: 'l2_09', prompt: 'Elegant conclusion scene: perfectly assembled AI team working in harmony, each at their designated station, golden connections between them, orchestra-like coordination in modern office' },

    // ━━━ L3: 说人话即编程（5 张）━━━━━━━━━━━━━━━━━━━━━
    { id: 'l3_01', prompt: 'CEO in boardroom giving vague instructions to confused AI assistant represented as hologram, messy thought bubbles, contrast between unclear input and garbled output, frustration visualization' },
    { id: 'l3_02', prompt: 'Split image: left shows sloppy handwritten brief producing garbage output, right shows structured corporate memo producing brilliant golden report, quality in equals quality out, professional contrast' },

    { id: 'l3_03', prompt: 'Five golden building blocks floating and assembling into a perfect prompt formula in boardroom setting: Role block, Context block, Task block, Format block, Constraints block, blueprint engineering style' },
    { id: 'l3_04', prompt: 'Factory production manager dictating precise instructions to AI hologram that transforms them into a detailed production schedule spreadsheet, manufacturing floor visible through office window' },
    { id: 'l3_05', prompt: 'Management skill equals AI skill metaphor: executive managing human team on left morphing into same executive managing AI team on right, seamless transition, golden light bridge between the two scenes' },

    // ━━━ L4: 驯服 AI 幻觉（5 张）━━━━━━━━━━━━━━━━━━━━━
    { id: 'l4_01', prompt: 'Courtroom scene with lawyer looking shocked at rejected AI-generated legal brief, judge holding gavel, fake case citations highlighted in red on document, professional legal drama' },
    { id: 'l4_02', prompt: 'AI robot in suit confidently presenting a report with fake data, but X-ray vision reveals the report is filled with fabricated numbers and citations, wolf in sheeps clothing corporate metaphor' },

    { id: 'l4_03', prompt: 'SOP workflow diagram showing AI Output flowing through Human Review checkpoint before reaching Final Submission, quality control factory line aesthetic, golden approval stamps, professional process' },
    { id: 'l4_04', prompt: 'Two contrasting frames: left frame shows trusting AI blindly as a passed Turing test genius leading to disaster, right frame shows treating AI as eager but sometimes wrong intern leading to success, professional office setting' },
    { id: 'l4_05', prompt: 'Executive applying a golden seal of approval after reviewing AI document on desk, review checklist glowing, trust but verify philosophy, sophisticated office with law books and screens' },
];

// ── 生成单张图片 ──────────────────────────────────────
async function generateImage(item) {
    const fullPrompt = item.prompt + STYLE_SUFFIX;

    console.log(`  → 生成 ${item.id}...`);
    console.log(`    Prompt: "${fullPrompt.slice(0, 80)}..."`);

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            prompt: fullPrompt,
            n: 1,
            size: SIZE,
        }),
    });

    const json = await res.json();
    if (json.error) {
        console.error(`  ❌ ${item.id}: ${json.error.message}`);
        return null;
    }

    const imageUrl = json.data?.[0]?.url;
    if (!imageUrl) {
        console.error(`  ❌ ${item.id}: No URL in response`);
        return null;
    }

    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const outPath = path.join(OUTPUT_DIR, `${item.id}.jpg`);
    fs.writeFileSync(outPath, buffer);
    console.log(`  ✅ ${item.id} → saved (${(buffer.length / 1024).toFixed(0)}KB)`);
    return outPath;
}

// ── 并发批量处理 ──────────────────────────────────────
async function runBatch(items, concurrency = CONCURRENCY) {
    const results = [];
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchNum = Math.floor(i / concurrency) + 1;
        const totalBatches = Math.ceil(items.length / concurrency);
        console.log(`\n━━━ Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')}) ━━━`);

        const batchResults = await Promise.all(batch.map(item => generateImage(item)));
        results.push(...batchResults);

        if (i + concurrency < items.length) {
            console.log(`  ⏳ 等待 ${BATCH_DELAY_MS}ms...`);
            await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
        }
    }
    return results;
}

// ── 转换为 WebP ──────────────────────────────────────
async function convertToWebP() {
    const sharp = await import('sharp');
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg'));
    console.log(`\n🔄 Converting ${files.length} JPG → WebP...`);

    for (const file of files) {
        const jpgPath = path.join(OUTPUT_DIR, file);
        const webpPath = path.join(OUTPUT_DIR, file.replace('.jpg', '.webp'));

        if (fs.existsSync(webpPath)) continue;

        try {
            await sharp.default(jpgPath)
                .webp({ quality: 85 })
                .toFile(webpPath);

            const origSize = fs.statSync(jpgPath).size;
            const newSize = fs.statSync(webpPath).size;
            console.log(`  ✅ ${file} → .webp (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${Math.round((1 - newSize / origSize) * 100)}%)`);

            fs.unlinkSync(jpgPath);
        } catch (err) {
            console.error(`  ❌ Convert failed ${file}: ${err.message}`);
        }
    }
}

// ── 主程序 ──────────────────────────────────────────
async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   AI 超级个体 — PRO MAX 插画生成器           ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║ 模型:    ${MODEL.padEnd(32)}║`);
    console.log(`║ API:     ${API_URL.slice(0, 32).padEnd(32)}║`);
    console.log(`║ 尺寸:    ${SIZE.padEnd(32)}║`);
    console.log(`║ 总图数:  ${String(ALL_PROMPTS.length).padEnd(32)}║`);
    console.log(`║ 并发:    ${String(CONCURRENCY).padEnd(32)}║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');

    // 跳过已有图片
    const existing = new Set(
        fs.readdirSync(OUTPUT_DIR)
            .filter(f => f.endsWith('.webp') || f.endsWith('.jpg'))
            .map(f => f.replace(/\.(webp|jpg)$/, ''))
    );

    const toGenerate = ALL_PROMPTS.filter(p => !existing.has(p.id));
    console.log(`📊 总计: ${ALL_PROMPTS.length} | 已有: ${existing.size} | 待生成: ${toGenerate.length}`);

    if (toGenerate.length === 0) {
        console.log('\n🎉 全部图片已存在！跳过生成。');
    } else {
        const results = await runBatch(toGenerate, CONCURRENCY);
        const success = results.filter(Boolean).length;
        const failed = results.length - success;
        console.log(`\n📊 生成完毕！成功: ${success} | 失败: ${failed}`);
    }

    // 转换为 WebP
    await convertToWebP();

    console.log('\n🎉 全部完成！');
}

main().catch(console.error);
