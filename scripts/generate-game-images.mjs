/**
 * 生成互动游戏场景配图（补充缺失的图片）
 * 用法: node scripts/generate-game-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'lessons');

const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';

// 只生成缺失的图片（每课对话总数 - 已有图片数）
const NEW_PROMPTS = [
    // L2: 16 dialogues, have 13, need l2_14 ~ l2_16
    { id: 'l2_14', prompt: 'Futuristic marketplace with holographic price tags floating, child adjusting prices on a slider interface, neon glow, cyberpunk trading floor, 16:9' },
    { id: 'l2_15', prompt: 'Split screen comparison: left side child passively watching phone in gray, right side child actively creating on computer in golden light, dramatic contrast, cyberpunk, 16:9' },
    { id: 'l2_16', prompt: 'Person sleeping peacefully on futuristic bed while golden coins and revenue streams float upward from laptop beside them, passive income dream visualization, cyberpunk bedroom, 16:9' },

    // L3: 11 dialogues, have 9, need l3_10 ~ l3_11
    { id: 'l3_10', prompt: 'Timeline chart showing dramatic cost drops: expensive translator fee in 2000 falling to free AI in 2025, cliff-drop visualization with glowing data points, futuristic infographic, 16:9' },
    { id: 'l3_11', prompt: 'Split scene: crumbling hand workshop on left vs rising automated AI factory on right, industrial revolution metaphor applied to AI era, dramatic lighting, 16:9' },

    // L4: 11 dialogues, have 8, need l4_09 ~ l4_11
    { id: 'l4_09', prompt: 'Five colorful puzzle pieces assembling into a perfect prompt formula: Role blue plus Context green plus Task yellow plus Format orange plus Constraints red, holographic floating, 16:9' },
    { id: 'l4_10', prompt: 'Roman coliseum reimagined as digital arena with two glowing prompt cards battling, lightning between them, audience of AI robots watching, epic cyberpunk battle, 16:9' },
    { id: 'l4_11', prompt: 'Brain inside a brain inside a brain, Russian nesting doll concept with glowing neural connections, meta-cognition thinking about thinking visualization, cyberpunk, 16:9' },

    // L5: 11 dialogues, have 8, need l5_09 ~ l5_11
    { id: 'l5_09', prompt: 'Person standing on small mound triumphantly with arms raised, not seeing the enormous mountain range behind them, Dunning-Kruger peak of confidence illusion, dramatic landscape, 16:9' },
    { id: 'l5_10', prompt: 'One person in golden spotlight on grand stage, behind them 9999 shadowy figures in complete darkness, audience only sees the illuminated one, powerful survivorship bias metaphor, 16:9' },
    { id: 'l5_11', prompt: 'Child calmly walking right against a frantic crowd running left, golden glow around the child contrasting with gray panicked crowd, heroic anti-consensus thinking, 16:9' },

    // L6: 11 dialogues, have 7, need l6_08 ~ l6_11
    { id: 'l6_08', prompt: 'Glowing shield bubble around child brain, deflecting incoming virus-shaped fake news icons and misinformation arrows, immune system metaphor, cyberpunk defense, 16:9' },
    { id: 'l6_09', prompt: 'Child wearing VR headset sees beautiful garden, removing headset reveals standing in desolate wasteland, reality vs illusion dramatic reveal, 16:9' },
    { id: 'l6_10', prompt: 'Person trapped inside translucent silk cocoon bubble, only seeing filtered tiny view of vast colorful world outside, claustrophobic information bubble metaphor, 16:9' },
    { id: 'l6_11', prompt: 'Three giant magnifying glasses labeled WHO WHAT WHY shining investigation beams on suspicious glowing document, detective analysis scene, cyberpunk noir style, 16:9' },

    // L7: 11 dialogues, have 8, need l7_09 ~ l7_11
    { id: 'l7_09', prompt: 'Cute cartoon elephant made of colorful building blocks, child carefully removing one block at a time, elephant getting smaller piece by piece, fun educational deconstruction, 16:9' },
    { id: 'l7_10', prompt: 'Colorful LEGO bricks floating and assembling into a miniature website interface, each brick a different color representing UI components, satisfying assembly process, bright, 16:9' },
    { id: 'l7_11', prompt: 'Perfect pizza being sliced into even pieces, each slice a different color representing different categories, no overlap no gap, MECE mathematical beauty, clean infographic, 16:9' },

    // L8: 11 dialogues, have 7, need l8_08 ~ l8_11
    { id: 'l8_08', prompt: 'Giant glowing onion with translucent layers being peeled, each layer labeled with an assumption, golden core labeled TRUTH visible, dramatic first principles thinking, 16:9' },
    { id: 'l8_09', prompt: 'Battery exploding into individual chemical elements Ni Co Li C each with tiny price tag, sum much less than assembled battery price, eureka moment visualization, 16:9' },
    { id: 'l8_10', prompt: 'Two paths diverging: left path analogy following others footsteps in gray, right path first principles creating new trail in gold, creative problem solving metaphor, 16:9' },
    { id: 'l8_11', prompt: 'School cafeteria with very long queue of students, thought bubble above child head showing five WHY questions drill-down diagram, problem-solving moment, cyberpunk school, 16:9' },

    // L9: 11 dialogues, have 7, need l9_08 ~ l9_11
    { id: 'l9_08', prompt: 'Child observing daily frustrations: piles of messy notes, red-marked homework, forgotten vocabulary cards, each item with pain point icon hovering above, relatable school scene, 16:9' },
    { id: 'l9_09', prompt: 'Blueprint of robot AI agent, child writing detailed instructions that flow as glowing text into robots brain module, technical but kid-friendly assembly scene, 16:9' },
    { id: 'l9_10', prompt: 'Three rocket versions side by side: first exploding on launchpad, second wobbly flight, third perfect launch with fire trail, iteration improvement cycle, SpaceX inspired, 16:9' },
    { id: 'l9_11', prompt: 'Giant golden number 0 transforming into glowing number 1 with explosion of light and confetti, from zero to one most important step visualization, dramatic and inspiring, 16:9' },

    // L10: 11 dialogues, have 8, need l10_09 ~ l10_11
    { id: 'l10_09', prompt: 'Child on stage telling emotional story with holographic illustration of mom struggling, audience members tearing up, warm spotlight, storytelling keynote atmosphere, 16:9' },
    { id: 'l10_10', prompt: 'Live demo on giant holographic screen showing working app, audience of children leaning forward in amazement, interactive presentation moment, futuristic auditorium, 16:9' },
    { id: 'l10_11', prompt: 'Grand celebration stage with confetti and fireworks, child wearing futuristic graduation cap holding trophy, rocket launching in background, epic course completion ceremony, 16:9' },
];

// ── 生成单张图片 ──
async function generateImage(item) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            prompt: item.prompt,
            n: 1,
            size: SIZE,
        }),
    });

    const json = await res.json();
    if (json.error) {
        console.error(`❌ ${item.id}: ${json.error.message}`);
        return null;
    }

    const imageUrl = json.data?.[0]?.url;
    if (!imageUrl) {
        console.error(`❌ ${item.id}: No URL in response`);
        return null;
    }

    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const outPath = path.join(OUTPUT_DIR, `${item.id}.jpg`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ ${item.id} → saved (${(buffer.length / 1024).toFixed(0)}KB)`);
    return outPath;
}

// ── 并发批量处理 ──
async function runBatch(items, concurrency = 3) {
    const results = [];
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchNum = Math.floor(i / concurrency) + 1;
        const totalBatches = Math.ceil(items.length / concurrency);
        console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')})`);
        const batchResults = await Promise.all(batch.map(item => generateImage(item)));
        results.push(...batchResults);
        if (i + concurrency < items.length) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return results;
}

// ── 转换为 WebP ──
async function convertToWebP() {
    const sharp = await import('sharp');
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg'));
    console.log(`\n🔄 Converting ${files.length} JPG files to WebP...`);

    for (const file of files) {
        const jpgPath = path.join(OUTPUT_DIR, file);
        const webpPath = path.join(OUTPUT_DIR, file.replace('.jpg', '.webp'));

        if (fs.existsSync(webpPath)) {
            // WebP already exists, skip
            continue;
        }

        try {
            await sharp.default(jpgPath)
                .webp({ quality: 80 })
                .toFile(webpPath);

            const origSize = fs.statSync(jpgPath).size;
            const newSize = fs.statSync(webpPath).size;
            console.log(`✅ ${file} → .webp (${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${Math.round((1 - newSize / origSize) * 100)}%)`);

            // Remove original JPG
            fs.unlinkSync(jpgPath);
        } catch (err) {
            console.error(`❌ Failed to convert ${file}: ${err.message}`);
        }
    }
}

// ── 主程序 ──
async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // 跳过已有的
    const existing = new Set(
        fs.readdirSync(OUTPUT_DIR)
            .filter(f => f.endsWith('.webp') || f.endsWith('.jpg'))
            .map(f => f.replace(/\.(webp|jpg)$/, ''))
    );

    const toGenerate = NEW_PROMPTS.filter(p => !existing.has(p.id));
    console.log(`📸 需生成: ${toGenerate.length} / 已有: ${existing.size}`);

    if (toGenerate.length > 0) {
        const results = await runBatch(toGenerate, 3);
        const success = results.filter(Boolean).length;
        console.log(`\n📊 生成完毕！成功: ${success}, 失败: ${toGenerate.length - success}`);
    }

    // 转换所有JPG为WebP
    await convertToWebP();

    console.log('\n🎉 全部完成！');
}

main().catch(console.error);
