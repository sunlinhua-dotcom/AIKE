/**
 * 即梦视频 3.0 Pro 批量生成脚本
 * 
 * 用法：
 *   VOLC_AK=xxx VOLC_SK=xxx node scripts/generate-videos-jimeng.mjs
 *   
 * 可选参数：
 *   --ratio 16:9|3:4|9:16    画面比例（默认 16:9）
 *   --duration 5|10           视频时长（默认 10 秒）
 *   --start 1                 从第几课开始（默认 1）
 *   --end 20                  到第几课结束（默认 20）
 *   --dry                     预览 prompt 不实际调用
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/videos');

// ─── 配置 ───
const AK = process.env.VOLC_AK || '';
const SK = process.env.VOLC_SK || '';
const REGION = 'cn-north-1';
const SERVICE = 'cv';
const HOST = 'visual.volcengineapi.com';
const REQ_KEY = 'jimeng_ti2v_v30_pro';

// ─── 命令行参数 ───
const args = process.argv.slice(2);
const getArg = (name, def) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 && args[idx + 1] ? args[idx + 1] : def;
};
const RATIO = getArg('ratio', '16:9');
const DURATION = parseInt(getArg('duration', '10'));
const START = parseInt(getArg('start', '1'));
const END = parseInt(getArg('end', '20'));
const DRY_RUN = args.includes('--dry');
const FRAMES = DURATION === 10 ? 241 : 121;

// ─── 20 课视频提示词 ───
const PROMPTS = [
    // L1: 被浪费的 ChatGPT (痛点: 闲聊浪费)
    // Style: Comic Illustration, Motion Graphics. No Humans.
    `[Comic Style, No Humans] (Shot 1) Close-up of a computer screen showing a chat bubble with a hamburger 🍔 icon, floating lazily. (Shot 2) The chat bubble suddenly shatters into digital dust. (Shot 3) The dust reassembles into a golden rocket 🚀 launching upwards, with gold coins flowing out like a waterfall. Vibrant colors, flat illustration style, smooth animation.`,

    // L2: AI 员工图鉴 (痛点: 选人难)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A row of identical grey robot icons standing in a line. (Shot 2) The middle robot icon suddenly lights up and turns golden, a gear ⚙️ spinning in its center. (Shot 3) A frantic array of data charts appears behind the golden robot, while other grey robots fade away. Tech-minimalism.`,

    // L3: 说人话即编程 (痛点: 指令模糊)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) An icon of a crumpled paper ball 📄 rolling across the screen. (Shot 2) A glowing magical pen draws structured lines and checkboxes ✅ in the air. (Shot 3) A bright light bulb 💡 icon turns on, illuminating a perfectly organized document. Abstract visualization.`,

    // L4: 驯服 AI 幻觉 (痛点: 错误风险)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) Text lines on a document twisting like snakes 🐍, glowing red. (Shot 2) Three golden laser beams scan across the document horizontally. (Shot 3) The twisting lines straighten out instantly, turning green, and a shield 🛡️ icon stamps down. Security concept.`,

    // L5: 需求与界面 (痛点: 外包慢且贵)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) Split screen: Left shows an hourglass ⏳ running out of sand rapidly. (Shot 2) Right shows a 3D printer nozzle zipping around, building a wireframe. (Shot 3) The wireframe transforms into a colorful, glowing website interface tower stacking up. Fast-paced motion.`,

    // L6: 接入大脑 API (痛点: 哑巴网站)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A static website window with a "404" ⚠️ sign, looking dusty. (Shot 2) A blue glowing cable plugs into the side of the window. (Shot 3) The window bursts into life, with chat bubbles 💬 streaming out rapidly like a fountain. Cyberpunk aesthetics.`,

    // L7: 技能包 Skills (痛点: 通用AI不懂行)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A cute robot icon with a question mark ❓ hovering over its head. (Shot 2) A green microchip labeled with a wrench 🔧 slides into the robot's head slot. (Shot 3) The robot's eyes turn green, and it starts juggling gears ⚙️ efficiently. Industrial cartoon style.`,

    // L8: 数据连接 MCP (痛点: 数据孤岛)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) Five separate floating islands, dark and isolated. (Shot 2) Golden bridges shoot out from each island towards the center. (Shot 3) Bridges connect to form a glowing star ⭐ shape, with light pulses traveling along the networks. Isometric view.`,

    // L9: 智能品牌官网 (痛点: 线下展示受限)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A lonely, dusty display case in the dark. (Shot 2) A scanning beam of light sweeps across it. (Shot 3) The scene transforms into a dazzling digital showroom on a phone screen, featuring a rotating crown 👑. Magical transformation.`,

    // L10: 智能商业看板 (痛点: 表格满天飞)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A storm of flying paper sheets filling the screen. (Shot 2) A golden wind swirls the papers into a vortex. (Shot 3) The vortex compresses into a sleek, futuristic dashboard interface with a pie chart 📊 pulsing. Sci-fi UI style.`,

    // L11: 7x24 AI 员工 (痛点: 下班流失客户)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A simplified cityscape turning from day ☀️ to night 🌙. (Shot 2) A computer screen remains bright, chat bubbles popping continuously. (Shot 3) A money bag 💰 icon in the corner grows bigger and bigger as the sun rises again. Time-lapse effect.`,

    // L12: 智能排产系统 (痛点: 老师傅经验流失)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A silhouette of an old gear fading away. (Shot 2) Golden binary code streams flow upwards into a cloud ☁️. (Shot 3) The cloud rains down digital lines that form a precise grid over a factory map. Abstract tech.`,

    // L13: AI 图片加工厂 (痛点: 拍图成本高)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A camera shutter 📷 closes and opens. (Shot 2) One photo frame duplicates into ten frames, spreading out like cards. (Shot 3) The entire screen is tiled with colorful product images, and a "Cost" arrow 📉 points down. Pop art style.`,

    // L14: AI 标书工匠 (痛点: 通宵赶标书)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A coffee cup ☕ with steam rising, sitting next to a sleeping Zzz icon. (Shot 2) A magical cursor flies across a document, typing invisible text rapidly. (Shot 3) A stack of finished documents appears with a trophy 🏆 on top. Whimsical animation.`,

    // L15: OpenClaw 指挥官 (痛点: 消息爆炸)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A smartphone screen vibrating with red notification dots 🔴 exploding. (Shot 2) A mechanical claw grabs the red dots. (Shot 3) The dots are crushed and transformed into neat green checklist cards with checks ✅. Satisfying loop.`,

    // L16: AI 内容矩阵 (痛点: 分身乏术)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A conductor's baton waiting in the dark. (Shot 2) The baton waves, leaving a trail of light. (Shot 3) Five screens circle around, each playing a different video icon (Play button ▶️), syncing to the rhythm. Abstract viz.`,

    // L17: AI 经营分析 (痛点: 看不懂数据)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A chaotic mesh of numbers and grid lines. (Shot 2) A pair of AR glasses 👓 frames overlays the chaos. (Shot 3) Through the glasses, a clear golden trend line appears, hitting a target 🎯. Clean data viz.`,

    // L18: 销售供应链闭环 (痛点: 部门墙)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A thick grey brick wall blocking the view. (Shot 2) A golden energy beam blasts a hole through the wall. (Shot 3) The beam forms a Mobius strip loop, with package 📦 icons sliding along it endlessly. 3D cartoon style.`,

    // L19: 回公司怎么落地 (痛点: 员工抵触)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) Three grey, sad face icons 😐 floating. (Shot 2) A golden key 🔑 enters the frame. (Shot 3) The key touches the faces, turning them into colorful happy faces 😄 that bounce around. Emotional shift.`,

    // L20: 毕业路演 (痛点: 迷茫未来)
    // Style: Comic Illustration. No Humans.
    `[Comic Style, No Humans] (Shot 1) A view of a steep mountain peak 🏔️ shrouded in mist. (Shot 2) A golden path unfolds from the bottom to the top. (Shot 3) A star badge ⭐ shines brightly at the summit, clearing the mist. Inspirational cartoon.`,
];

// ─── 火山引擎 V4 签名 ───

function hmacSHA256(key, data) {
    return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function signRequest(method, queryParams, body, now) {
    const dateStr = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const dateShort = dateStr.substring(0, 8);
    const credentialScope = `${dateShort}/${REGION}/${SERVICE}/request`;

    const sortedQuery = Object.keys(queryParams).sort()
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
        .join('&');

    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
    const payloadHash = sha256Hex(bodyStr);

    const headers = {
        'Content-Type': 'application/json',
        'Host': HOST,
        'X-Date': dateStr,
        'X-Content-Sha256': payloadHash,
    };

    const signedHeaderKeys = Object.keys(headers).map(k => k.toLowerCase()).sort();
    const signedHeadersStr = signedHeaderKeys.join(';');
    const headerLines = signedHeaderKeys.map(k => `${k}:${headers[k.charAt(0).toUpperCase() + k.slice(1).replace(/-([a-z])/g, (_, c) => '-' + c.toUpperCase())]}`).join('\n');

    // 修正 header 值获取
    const canonicalHeaders = signedHeaderKeys.map(k => {
        const origKey = Object.keys(headers).find(h => h.toLowerCase() === k);
        return `${k}:${headers[origKey]}`;
    }).join('\n');

    const canonicalRequest = [
        method,
        '/',
        sortedQuery,
        canonicalHeaders + '\n',
        signedHeadersStr,
        payloadHash,
    ].join('\n');

    const stringToSign = [
        'HMAC-SHA256',
        dateStr,
        credentialScope,
        sha256Hex(canonicalRequest),
    ].join('\n');

    const kDate = hmacSHA256(SK, dateShort);
    const kRegion = hmacSHA256(kDate, REGION);
    const kService = hmacSHA256(kRegion, SERVICE);
    const kSigning = hmacSHA256(kService, 'request');
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

    const authorization = `HMAC-SHA256 Credential=${AK}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

    return { ...headers, Authorization: authorization };
}

// ─── HTTP 请求 ───

function httpsRequest(method, queryParams, body) {
    return new Promise((resolve, reject) => {
        const now = new Date();
        const bodyStr = JSON.stringify(body);
        const headers = signRequest(method, queryParams, bodyStr, now);

        const queryString = Object.keys(queryParams)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
            .join('&');

        const options = {
            hostname: HOST,
            port: 443,
            path: `/?${queryString}`,
            method,
            headers: {
                ...headers,
                'Content-Length': Buffer.byteLength(bodyStr),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    reject(new Error(`JSON parse error: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
}

// ─── 提交任务 ───

// ─── 分辨率计算 ───
function getResolution(ratio) {
    if (ratio === '16:9') return { w: 1920, h: 1088 };
    if (ratio === '9:16') return { w: 1088, h: 1920 };
    if (ratio === '3:4') return { w: 1248, h: 1664 };
    if (ratio === '4:3') return { w: 1664, h: 1248 };
    if (ratio === '1:1') return { w: 1024, h: 1024 };
    return { w: 1920, h: 1088 }; // Default
}

async function submitTask(prompt, ratio, frames) {
    const queryParams = {
        Action: 'CVSync2AsyncSubmitTask',
        Version: '2022-08-31',
    };

    // 强制 1080P
    const { w, h } = getResolution(ratio);

    const body = {
        req_key: REQ_KEY,
        prompt: prompt, // Ensure simplified chinese or english mapping if needed
        seed: -1,
        frames,
        aspect_ratio: ratio,
        width: w,
        height: h,
    };

    const result = await httpsRequest('POST', queryParams, body);
    if (result.code !== 10000) {
        throw new Error(`提交失败: code=${result.code}, message=${result.message}`);
    }
    return result.data.task_id;
}

// ─── 查询任务 ───

async function queryTask(taskId) {
    const queryParams = {
        Action: 'CVSync2AsyncGetResult',
        Version: '2022-08-31',
    };
    const body = {
        req_key: REQ_KEY,
        task_id: taskId,
    };

    return httpsRequest('POST', queryParams, body);
}

// ─── 下载视频 ───

async function downloadVideo(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, (res) => {
            // 处理重定向
            if (res.statusCode === 301 || res.statusCode === 302) {
                https.get(res.headers.location, (res2) => {
                    res2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                }).on('error', reject);
                return;
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
    });
}

// ─── 轮询等待 ───

async function waitForTask(taskId, lessonId) {
    const maxWait = 600; // 最多等 10 分钟
    const interval = 10; // 每 10 秒查一次
    let elapsed = 0;

    while (elapsed < maxWait) {
        await new Promise(r => setTimeout(r, interval * 1000));
        elapsed += interval;

        const result = await queryTask(taskId);

        if (result.code !== 10000) {
            // 可能还在处理，不算失败
            if (result.data?.status === 'in_queue' || result.data?.status === 'generating') {
                process.stdout.write(`  L${lessonId} [${result.data.status}] ${elapsed}s...\r`);
                continue;
            }
            throw new Error(`查询失败: code=${result.code}, message=${result.message}`);
        }

        const status = result.data?.status;
        process.stdout.write(`  L${lessonId} [${status}] ${elapsed}s...\r`);

        if (status === 'done') {
            console.log(`  L${lessonId} ✅ 完成 (${elapsed}s)`);
            return result.data.video_url;
        }
        if (status === 'not_found' || status === 'expired') {
            throw new Error(`任务 ${status}`);
        }
    }
    throw new Error(`超时 ${maxWait}s`);
}

// ─── 主流程 ───

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  即梦视频 3.0 Pro · 批量生成');
    console.log(`  比例: ${RATIO}  时长: ${DURATION}s  帧数: ${FRAMES}`);
    console.log(`  范围: L${START} → L${END}`);
    console.log('═══════════════════════════════════════════\n');

    if (!AK || !SK) {
        console.error('❌ 请设置环境变量 VOLC_AK 和 VOLC_SK');
        console.error('   用法: VOLC_AK=xxx VOLC_SK=xxx node scripts/generate-videos-jimeng.mjs');
        process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const tasks = [];

    // 步骤 1：提交所有任务
    console.log('📤 提交任务...\n');
    for (let i = START; i <= END; i++) {
        const prompt = PROMPTS[i - 1];
        if (!prompt) {
            console.log(`  L${i} ⚠️ 无提示词，跳过`);
            continue;
        }

        if (DRY_RUN) {
            console.log(`  L${i} [DRY] ${prompt.substring(0, 60)}...`);
            continue;
        }

        try {
            const taskId = await submitTask(prompt, RATIO, FRAMES);
            console.log(`  L${i} 📤 已提交 taskId=${taskId}`);
            tasks.push({ lessonId: i, taskId });
            // 避免 QPS 限制
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.error(`  L${i} ❌ 提交失败: ${err.message}`);
        }
    }

    if (DRY_RUN) {
        console.log('\n🔍 预览模式，不实际调用 API');
        return;
    }

    // 步骤 2：逐个等待 & 下载
    console.log(`\n⏳ 等待生成 (${tasks.length} 个任务)...\n`);
    let success = 0;
    let failed = 0;

    for (const { lessonId, taskId } of tasks) {
        try {
            const videoUrl = await waitForTask(taskId, lessonId);
            const filename = `l${lessonId}_intro.mp4`;
            const filePath = path.join(OUTPUT_DIR, filename);
            console.log(`  L${lessonId} 📥 下载中...`);
            await downloadVideo(videoUrl, filePath);
            const size = fs.statSync(filePath).size;
            console.log(`  L${lessonId} ✅ 已保存 ${filename} (${(size / 1024 / 1024).toFixed(1)}MB)`);
            success++;
        } catch (err) {
            console.error(`  L${lessonId} ❌ 失败: ${err.message}`);
            failed++;
        }
    }

    console.log('\n═══════════════════════════════════════════');
    console.log(`  完成! ✅ ${success} 成功  ❌ ${failed} 失败`);
    console.log(`  视频目录: ${OUTPUT_DIR}`);
    console.log('═══════════════════════════════════════════');
}

main().catch(err => {
    console.error('致命错误:', err);
    process.exit(1);
});
