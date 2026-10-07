const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = process.env.APIYI_API_KEY;
if (!API_KEY) throw new Error('APIYI_API_KEY is not set');
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const STYLE = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, 16:9 aspect ratio, ultra high quality, no text, no watermark';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');

const retry = [
    { id: 'l4_07', prompt: 'Golden mindset scale: balancing not fearing and not blindly trusting, equilibrium of healthy AI skepticism' },
    { id: 'l4_12', prompt: 'Management meeting parallel: executive listening to multiple reports before deciding, same logic for AI validation' },
];

async function gen(id, prompt) {
    console.log('Generating ' + id + '...');
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY },
        body: JSON.stringify({ model: MODEL, prompt: prompt + STYLE, n: 1, size: SIZE })
    });
    if (!res.ok) throw new Error('API ' + res.status);
    const json = await res.json();
    const url = json.data && json.data[0] && json.data[0].url;
    if (!url) throw new Error('No URL');
    const imgRes = await fetch(url);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(path.join(OUTPUT_DIR, id + '.jpg'), buf);
    console.log('OK: ' + id + ' (' + (buf.length / 1024).toFixed(0) + 'KB)');
}

(async () => {
    for (const r of retry) {
        try {
            await gen(r.id, r.prompt);
        } catch (e) {
            console.error('FAIL: ' + r.id + ': ' + e.message);
        }
    }
    // Convert to webp
    const sharp = require('sharp');
    for (const r of retry) {
        const jpgPath = path.join(OUTPUT_DIR, r.id + '.jpg');
        const webpPath = path.join(OUTPUT_DIR, r.id + '.webp');
        if (fs.existsSync(jpgPath)) {
            await sharp(jpgPath).webp({ quality: 85 }).toFile(webpPath);
            const orig = fs.statSync(jpgPath).size;
            const newS = fs.statSync(webpPath).size;
            console.log(r.id + '.webp: ' + (orig / 1024).toFixed(0) + 'KB -> ' + (newS / 1024).toFixed(0) + 'KB');
        }
    }
    console.log('Done!');
})();
