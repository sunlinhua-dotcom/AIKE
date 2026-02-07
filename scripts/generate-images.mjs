/**
 * 批量生成课程配图脚本
 * 使用 seedream-4-5-251128 模型
 * 用法: node scripts/generate-images.mjs
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

// 全部 88 张图的提示词
const ALL_PROMPTS = [
    // ─── L1: 时间的真相（13张）───
    { id: 'l1_01', prompt: 'Cyberpunk control room with holographic time portal, neon blue and pink lights, futuristic screens showing timeline data, dark sci-fi atmosphere, illustration for children, 16:9' },
    { id: 'l1_02', prompt: 'Cute robot character urgently waving arms at a child holding a glowing smartphone, sparks flying from the phone screen, futuristic bedroom background, cyberpunk style, 16:9' },
    { id: 'l1_03', prompt: 'Child laughing at phone screen showing funny cat video, surrounded by floating dopamine molecule icons, cozy but slightly messy futuristic bedroom, neon glow, 16:9' },
    { id: 'l1_04', prompt: 'Futuristic bedroom furniture melting and dissolving into digital particles, books turning to sand, warped reality effect, glitch art style, dramatic lighting, 16:9' },
    { id: 'l1_05', prompt: 'Giant holographic warning sign with entropy critical alert floating in a disintegrating room, red alarm lights, sci-fi control panels, danger atmosphere, 16:9' },
    { id: 'l1_06', prompt: 'Close-up of a desk dissolving into golden sand particles, books crumbling, a child reaching out in shock, cyberpunk room, dramatic particle effects, 16:9' },
    { id: 'l1_07', prompt: 'Split image: left side orderly crystal structure glowing blue, right side chaotic scattered particles glowing red, entropy concept visualization, sci-fi educational, 16:9' },
    { id: 'l1_08', prompt: 'Glowing cyan particle figure of a human standing in dark void, thousands of luminous dots forming body shape, ethereal and beautiful, futuristic, 16:9' },
    { id: 'l1_09', prompt: 'Beautiful sand castle on beach slowly crumbling and dissolving, time-lapse style, particles drifting away in wind, metaphor for entropy, cinematic lighting, 16:9' },
    { id: 'l1_10', prompt: 'Glowing human figure made of particles actively disintegrating, pieces flying away into dark void, dramatic and emotional, cyberpunk aesthetic, 16:9' },
    { id: 'l1_11', prompt: 'Infographic-style illustration showing three examples: messy room, unfit body, empty head, all connected by arrow labeled entropy, clean cyberpunk design, 16:9' },
    { id: 'l1_12', prompt: 'Neon-lit casino interior with brain-shaped slot machines, golden coins floating, dopamine molecule decorations, dark and seductive atmosphere, cyberpunk, 16:9' },
    { id: 'l1_13', prompt: 'Dramatic exponential growth curve glowing gold on dark background, small 1 percent at start becoming massive 37x at end, inspirational, futuristic data visualization, 16:9' },

    // ─── L2: 生产者转身（13张）───
    { id: 'l2_01', prompt: 'Split scene: left side person in shadows with empty hands, right side person in light surrounded by created products, wealth contrast, cyberpunk cityscape, 16:9' },
    { id: 'l2_02', prompt: 'Two doors side by side: left door labeled Consumer dark and consuming, right door labeled Producer bright and creating, futuristic corridor, neon signs, 16:9' },
    { id: 'l2_03', prompt: 'Split image: left child passively playing game on screen looking tired, right child coding a game on screen looking excited, code floating around, cyberpunk room, 16:9' },
    { id: 'l2_04', prompt: 'Giant price tag showing 38 yuan next to tiny cost label showing 3 yuan on a coffee cup, futuristic cafe, holographic price breakdown, 16:9' },
    { id: 'l2_05', prompt: 'Exploded view of coffee cup: bottom layer raw beans with small price, middle layers brand experience story icons, top golden crown of value, futuristic infographic style, 16:9' },
    { id: 'l2_06', prompt: 'Futuristic marketplace with holographic price sliders on products, child adjusting prices, floating value indicators, cyberpunk shopping district, 16:9' },
    { id: 'l2_07', prompt: 'Artist painting one masterpiece on left, then thousands of print copies rolling off assembly line on right, cost arrow dropping to zero, futuristic factory, 16:9' },
    { id: 'l2_08', prompt: 'Person sleeping peacefully while golden coins and dollar signs float up from laptop and book beside them, dream-like quality, passive income concept, cyberpunk bedroom, 16:9' },
    { id: 'l2_09', prompt: 'Circular daily routine: phone to school to game to video to sleep, all in gray, hamster wheel visual, trapped feeling, dark cyberpunk style, 16:9' },
    { id: 'l2_10', prompt: 'Upward spiral daily routine: journal to learn to create to teach to grow, all in golden light, ladder staircase visual, empowering, bright cyberpunk, 16:9' },
    { id: 'l2_11', prompt: 'Giant eyeball being sucked into phone screen by tentacles labeled social media, child as product on conveyor belt, dark warning illustration, 16:9' },
    { id: 'l2_12', prompt: 'Child sitting inside a glass display case with price tag, surrounded by advertisers bidding, dystopian marketplace, critical commentary style, 16:9' },
    { id: 'l2_13', prompt: 'Mirror reflection: child looking in mirror sees two versions gray consumer self vs golden producer self, pivotal moment, dramatic lighting, 16:9' },

    // ─── L3: AI 不是魔法（9张）───
    { id: 'l3_01', prompt: 'Child using a giant glowing lever crowbar to lift enormous boulder labeled complex task, fulcrum labeled AI, sci-fi style, empowering, 16:9' },
    { id: 'l3_02', prompt: 'Futuristic Archimedes standing on small planet, using enormous glowing digital lever to move Earth, stars background, epic sci-fi painting, 16:9' },
    { id: 'l3_03', prompt: 'Funnel machine: garbage going in top with messy prompts, garbage coming out bottom with bad results, clean input on side showing perfect output, cyberpunk infographic, 16:9' },
    { id: 'l3_04', prompt: 'Robot at desk writing on paper, two results floating: gray mediocre essay with 60 score stamp vs golden brilliant essay with 95 score stamp, comparison layout, 16:9' },
    { id: 'l3_05', prompt: 'Simple plain text bubble saying just write essay floating over AI robot looking confused, minimal effort visual, gray tones, 16:9' },
    { id: 'l3_06', prompt: 'Detailed colorful text bubble with specific instructions floating over AI robot looking excited and inspired, rainbow output flowing, vibrant, 16:9' },
    { id: 'l3_07', prompt: 'Child words transforming into flowing code streams that control a robot, question equals programming holographic text, matrix-style, cyberpunk, 16:9' },
    { id: 'l3_08', prompt: 'Timeline showing falling costs: 2000 year 500 yuan translator to 2025 year 0 yuan AI, dramatic cliff drop in price chart, futuristic data visualization, 16:9' },
    { id: 'l3_09', prompt: 'Split image: left side hand workshop crumbling, right side steam-powered factory rising, industrial revolution metaphor applied to AI era, dramatic, 16:9' },

    // ─── L4: 提问的艺术（8张）───
    { id: 'l4_01', prompt: 'Blacksmith forging a glowing key on anvil, sparks flying, key is labeled with question mark, dramatic forge environment, cyberpunk meets medieval, 16:9' },
    { id: 'l4_02', prompt: 'Futuristic tech headquarters interior with giant neon sign The Best Skill is Asking Questions, engineers discussing around holographic displays, 16:9' },
    { id: 'l4_03', prompt: 'Roman coliseum reimagined as digital arena, two prompt cards battling with lightning between them, audience of AI robots watching, epic cyberpunk, 16:9' },
    { id: 'l4_04', prompt: 'Person on tiny hill thinking they see the whole world, but vast mountain range hidden behind clouds, ignorance vs knowledge metaphor, dramatic landscape, 16:9' },
    { id: 'l4_05', prompt: 'Two scroll documents side by side: left one short and vague glowing red, right one detailed and specific glowing gold, battle versus format, 16:9' },
    { id: 'l4_06', prompt: 'Five colorful puzzle pieces floating together: Role blue plus Context green plus Task yellow plus Format orange plus Constraints red, assembling into perfect prompt, 16:9' },
    { id: 'l4_07', prompt: 'Brain inside a brain inside a brain, Russian nesting doll concept with glowing neural connections, recursive thinking visualization, cyberpunk, 16:9' },
    { id: 'l4_08', prompt: 'Child reaching up toward glass ceiling, the ceiling has text Your Questions etched on it, above ceiling is infinite universe of answers, inspiring, 16:9' },

    // ─── L5: 拒绝平庸（8张）───
    { id: 'l5_01', prompt: 'Crowd of identical gray figures all walking same direction on conveyor belt, one golden figure standing still and looking around differently, dramatic, 16:9' },
    { id: 'l5_02', prompt: 'Thousands of identical paths all leading to same mediocre destination marked AVERAGE, one hidden path leading upward to stars, aerial view, 16:9' },
    { id: 'l5_03', prompt: 'Person standing on small mound triumphantly with dunce cap glowing, not seeing the enormous mountain behind them, Dunning-Kruger peak of confidence, 16:9' },
    { id: 'l5_04', prompt: 'Person at bottom of dark valley looking up at impossibly tall cliffs, heavy rain, other people giving up and turning back, emotional and dark, 16:9' },
    { id: 'l5_05', prompt: 'Person climbing gentle upward slope with morning sunlight breaking through clouds, each step leaving glowing footprint, hope and growth, inspiring, 16:9' },
    { id: 'l5_06', prompt: 'One person in golden spotlight on stage, behind them 9999 shadowy figures in darkness, audience only sees the lit one, powerful metaphor, 16:9' },
    { id: 'l5_07', prompt: 'Everyone running left in panicked crowd, one calm child walking right against the flow, glowing golden in contrast to gray crowd, heroic, 16:9' },
    { id: 'l5_08', prompt: 'Child reading book while holographic shield blocks incoming wave of social media icons and notifications, peaceful vs chaos, cyberpunk, 16:9' },

    // ─── L6: 信息免疫力（7张）───
    { id: 'l6_01', prompt: 'Child wearing VR headset sees beautiful garden, but removing headset reveals standing in wasteland, reality vs illusion, dramatic reveal, 16:9' },
    { id: 'l6_02', prompt: 'Glowing shield bubble around child brain, deflecting incoming virus-shaped fake news icons and misinformation arrows, immune system metaphor, cyberpunk, 16:9' },
    { id: 'l6_03', prompt: 'Person surrounded only by mirrors reflecting same opinion back, echo chamber visualization, all screens showing identical content, distorted reality, 16:9' },
    { id: 'l6_04', prompt: 'Person trapped inside translucent silk cocoon, only seeing a tiny filtered view of the vast colorful world outside, claustrophobic, metaphorical, 16:9' },
    { id: 'l6_05', prompt: 'Detective child with magnifying glass examining a news article, red circles highlighting logical fallacies, investigation scene, cyberpunk noir, 16:9' },
    { id: 'l6_06', prompt: 'Three giant glowing magnifying glasses labeled WHO said it and WHAT evidence and WHY, shining beams on suspicious document, investigative, 16:9' },
    { id: 'l6_07', prompt: 'Friendly-looking robot confidently presenting a document that dissolves into gibberish on closer inspection, looks real but is not concept, humorous warning, 16:9' },

    // ─── L7: 拆解大象（8张）───
    { id: 'l7_01', prompt: 'Grand doorway opening to bright workshop forge, MODULE 3 CREATION text above door, child stepping from darkness into light, epic transition, 16:9' },
    { id: 'l7_02', prompt: 'Giant complex machine made of clearly labeled colorful LEGO-like modules, each module simple and removable, engineering beauty, cyberpunk, 16:9' },
    { id: 'l7_03', prompt: 'Cute cartoon elephant made of building blocks, child taking one block at a time, elephant getting smaller piece by piece, humorous and educational, 16:9' },
    { id: 'l7_04', prompt: 'Giant intimidating screen showing BUILD A NEWS WEBSITE with confused child below, task looks overwhelmingly complex, dramatic scale contrast, 16:9' },
    { id: 'l7_05', prompt: 'One big block splitting into 4 medium blocks, then splitting into 16 small blocks, all floating and organized, tree structure visualization, holographic, 16:9' },
    { id: 'l7_06', prompt: 'Colorful LEGO bricks floating and assembling into a miniature castle, each brick labeled with a sub-task, satisfying assembly process, bright, 16:9' },
    { id: 'l7_07', prompt: 'Perfect pizza being sliced into even pieces, each slice a different color, no overlap no gap, mathematical beauty, clean infographic style, 16:9' },
    { id: 'l7_08', prompt: 'Programmer screen showing beautiful organized code blocks, each block a different color representing a function, code as architecture, cyberpunk dev room, 16:9' },

    // ─── L8: 第一性原理（7张）───
    { id: 'l8_01', prompt: 'Silhouette of visionary entrepreneur standing before blueprint of rocket, peeling away layers of conventional thinking, first principles diagram, futuristic, 16:9' },
    { id: 'l8_02', prompt: 'Giant glowing onion with translucent layers, each layer labeled with an assumption, core glowing gold with TRUTH label, dramatic lighting, 16:9' },
    { id: 'l8_03', prompt: 'Giant battery with price tag showing TOO EXPENSIVE, crowd of people shaking heads, dark pessimistic atmosphere, 2005 tech setting, 16:9' },
    { id: 'l8_04', prompt: 'Group of people all looking in same direction through tunnel vision, gray and limited perspective, following the crowd, conformity, 16:9' },
    { id: 'l8_05', prompt: 'Battery exploding into individual chemical elements Ni Co Li C each with small price tag, sum much less than whole, eureka moment, 16:9' },
    { id: 'l8_06', prompt: 'Two paths: left path blocked by wall labeled impossible, right path going around under the wall labeled different method, creative problem solving, 16:9' },
    { id: 'l8_07', prompt: 'School cafeteria with very long queue, thought bubble above child head showing root cause analysis diagram, problem-solving moment, 16:9' },

    // ─── L9: 打造AI员工（7张）───
    { id: 'l9_01', prompt: 'Bridge connecting Knowledge Island to Action Island, child walking across bridge carrying toolbox, journey from learning to doing, epic landscape, 16:9' },
    { id: 'l9_02', prompt: 'Cute robot assistant working at desk 24 7, clock showing all hours, tireless and reliable, friendly workspace, cyberpunk office, 16:9' },
    { id: 'l9_03', prompt: 'Child observing daily frustrations: stack of messy notes, red-marked homework, forgotten vocab cards, each with pain icon, relatable, 16:9' },
    { id: 'l9_04', prompt: 'Blueprint manual for robot, writing detailed instructions, flowing text filling robot brain module, technical but kid-friendly, 16:9' },
    { id: 'l9_05', prompt: 'Three rocket versions: first exploding, second wobbly flight, third perfect launch, iteration improvement cycle, SpaceX inspired, 16:9' },
    { id: 'l9_06', prompt: 'Minimum product comparison: left side tiny rough prototype glowing, right side imaginary perfect product in gray clouds, Start Small message, 16:9' },
    { id: 'l9_07', prompt: 'Giant number 0 transforming into glowing 1 with explosion of light, most important step visualization, dramatic and inspiring, 16:9' },

    // ─── L10: 产品发布会（8张）───
    { id: 'l10_01', prompt: 'Child standing on futuristic stage with spotlight and holographic screens showing their creation, TED talk style, audience in shadows, epic, 16:9' },
    { id: 'l10_02', prompt: 'Two halves: left half is building a product 50 percent, right half is presenting it to the world 50 percent, balanced scale, complete success formula, 16:9' },
    { id: 'l10_03', prompt: 'Three golden pillars on stage: STORY DEMO FEEDBACK, each pillar glowing, grand presentation setup, keynote atmosphere, 16:9' },
    { id: 'l10_04', prompt: 'Child on stage telling story with holographic illustration of mom struggling with shopping lists, emotional connection moment, warm lighting, 16:9' },
    { id: 'l10_05', prompt: 'Live demo on giant holographic screen, audience leaning forward in interest, working product visible, excitement, futuristic presentation, 16:9' },
    { id: 'l10_06', prompt: 'Happy mom holding phone showing the AI assistant, speech bubble with genuine testimonial, authentic and heartwarming, futuristic home, 16:9' },
    { id: 'l10_07', prompt: 'Seedling growing into mighty tree, roots labeled first product, branches showing future possibilities, growth mindset visualization, inspiring, 16:9' },
    { id: 'l10_08', prompt: 'Grand graduation ceremony with confetti, child wearing futuristic graduation cap, fireworks, rocket launch in background, epic celebration, 16:9' },
];

// ── 并发控制 ──────────────────────────────────────────
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

    // Download image
    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const outPath = path.join(OUTPUT_DIR, `${item.id}.jpg`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ ${item.id} → ${outPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return outPath;
}

async function runBatch(items, concurrency = 3) {
    const results = [];
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchNum = Math.floor(i / concurrency) + 1;
        const totalBatches = Math.ceil(items.length / concurrency);
        console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')})`);

        const batchResults = await Promise.all(batch.map(item => generateImage(item)));
        results.push(...batchResults);

        // 短暂等待避免速率限制
        if (i + concurrency < items.length) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return results;
}

// ── 主程序 ──────────────────────────────────────────
async function main() {
    // 创建输出目录
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    console.log(`📸 开始批量生成 ${ALL_PROMPTS.length} 张课程配图...`);
    console.log(`📂 输出目录: ${OUTPUT_DIR}`);
    console.log(`🤖 模型: ${MODEL}`);
    console.log(`📐 尺寸: ${SIZE}\n`);

    // 检查已存在的图片，跳过已生成的
    const existing = new Set(
        fs.readdirSync(OUTPUT_DIR)
            .filter(f => f.endsWith('.jpg'))
            .map(f => f.replace('.jpg', ''))
    );

    const toGenerate = ALL_PROMPTS.filter(p => !existing.has(p.id));
    console.log(`📊 已存在: ${existing.size} / 需生成: ${toGenerate.length}\n`);

    if (toGenerate.length === 0) {
        console.log('🎉 全部图片已生成！');
        return;
    }

    const results = await runBatch(toGenerate, 3);
    const success = results.filter(Boolean).length;
    const failed = results.length - success;

    console.log(`\n\n═══════════════════════════════════`);
    console.log(`📊 生成完毕！成功: ${success}, 失败: ${failed}, 总计: ${ALL_PROMPTS.length}`);
    console.log(`═══════════════════════════════════`);
}

main().catch(console.error);
