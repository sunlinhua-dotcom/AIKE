import fs from 'fs';
import path from 'path';

const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons', 'test_4in1');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const STYLE_SUFFIX = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, ultra high quality, no text, no watermark, 4 distinct panels in 2x2 grid layout';

const TEST_CASES = [
    {
        id: 'L5_grid',
        prompt: 'A 2x2 grid layout containing 4 distinct scenes for a business course. ' +
            'Top-Left: Corporate executive overwhelmed by fragmented data on multiple messy screens, dark office. ' +
            'Top-Right: A glowing golden universal USB-C adapter connecting disparate systems, metaphor for MCP technology. ' +
            'Bottom-Left: Future holographic interface showing a drag-and-drop system architecture builder, clean UI. ' +
            'Bottom-Right: A completed pyramid structure made of 5 layered golden blocks, symbolizing a finished framework.'
    },
    {
        id: 'L9_grid',
        prompt: 'A 2x2 grid layout containing 4 distinct scenes for a jewelry brand website project. ' +
            'Top-Left: Close up of a smartphone displaying a premium black and gold jewelry band website, luxury vibe. ' +
            'Top-Right: Visualization of AI writing code instantly, golden binary code stream turning into a webpage. ' +
            'Bottom-Left: Split screen showing a human agent and an AI robot agent high-fiving, collaboration. ' +
            'Bottom-Right: A mobile dashboard showing a sales graph rocketing upwards with gold coin particle effects.'
    }
];

async function generate(id, prompt) {
    console.log(`Generating ${id}...`);
    const fullPrompt = prompt + STYLE_SUFFIX;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ model: MODEL, prompt: fullPrompt, n: 1, size: SIZE }),
        });

        if (!res.ok) {
            console.error(`API Error: ${res.status} ${await res.text()}`);
            return;
        }

        const json = await res.json();
        const url = json.data[0].url;
        const imgRes = await fetch(url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());

        fs.writeFileSync(path.join(OUTPUT_DIR, `${id}.jpg`), buffer);
        console.log(`Saved ${id}.jpg`);
    } catch (e) {
        console.error(`Error generating ${id}:`, e);
    }
}

async function main() {
    for (const test of TEST_CASES) {
        await generate(test.id, test.prompt);
    }
}

main();
