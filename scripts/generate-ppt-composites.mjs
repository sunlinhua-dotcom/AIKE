
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'ppt_export');

// Canvas size: 4K 16:9
const CANVAS_WIDTH = 3840;
const CANVAS_HEIGHT = 2160;
const GRID_W = CANVAS_WIDTH / 2;
const GRID_H = CANVAS_HEIGHT / 2;

async function createComposite(lessonId, images, index) {
    if (images.length === 0) return;

    const outputFilename = `L${lessonId}_Grid_${index + 1}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    console.log(`Creating ${outputFilename} from ${images.length} images...`);

    // Create a black canvas
    let composite = sharp({
        create: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    });

    const composites = [];

    // Positions for 2x2 grid
    // 0: TL, 1: TR, 2: BL, 3: BR
    const positions = [
        { left: 0, top: 0 },
        { left: GRID_W, top: 0 },
        { left: 0, top: GRID_H },
        { left: GRID_W, top: GRID_H }
    ];

    for (let i = 0; i < Math.min(images.length, 4); i++) {
        const imgPath = path.join(INPUT_DIR, images[i]);

        // Resize image to fit quadrant (cover or contain? Cover usually looks better for grid)
        // But input images are likely square (2048x2048). 
        // Showing a square in a 16:9 quadrant (1920x1080) means cropping top/bottom.
        // Let's crop to center.
        const buffer = await sharp(imgPath)
            .resize(GRID_W, GRID_H, {
                fit: 'cover',
                position: 'center'
            })
            .toBuffer();

        composites.push({
            input: buffer,
            left: positions[i].left,
            top: positions[i].top
        });
    }

    await composite
        .composite(composites)
        .jpeg({ quality: 90 })
        .toFile(outputPath);

    console.log(`  ✅ Saved ${outputFilename}`);
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Get all files
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.jpg'));

    // Group by lesson
    const lessons = {};
    for (const file of files) {
        // match l1_01.webp or L1_01.jpg
        const match = file.match(/^[lL](\d+)_(\d+)\.(webp|jpg)$/);
        if (match) {
            const lessonId = parseInt(match[1]);
            if (!lessons[lessonId]) lessons[lessonId] = [];
            lessons[lessonId].push(file);
        }
    }

    // Process each lesson
    for (const lessonId of Object.keys(lessons).sort((a, b) => a - b)) {
        const lessonImages = lessons[lessonId].sort((a, b) => {
            // Sort by index (l1_01 < l1_10)
            const numA = parseInt(a.match(/_(\d+)\./)[1]);
            const numB = parseInt(b.match(/_(\d+)\./)[1]);
            return numA - numB;
        });

        console.log(`Processing Lesson ${lessonId}: ${lessonImages.length} images`);

        // Chunk into groups of 4
        for (let i = 0; i < lessonImages.length; i += 4) {
            const chunk = lessonImages.slice(i, i + 4);
            await createComposite(lessonId, chunk, i / 4);
        }
    }

    console.log('\n🎉 All composites generated in public/images/ppt_export');
}

main().catch(console.error);
