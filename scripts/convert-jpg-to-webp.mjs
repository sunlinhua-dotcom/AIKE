/**
 * JPG → WebP 批量转换脚本
 * 1. 扫描 public/images 下所有 .jpg 文件
 * 2. 用 sharp 转成 .webp（质量 80）
 * 3. 删除原始 .jpg
 * 4. 输出转换报告
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');

// 递归查找所有 jpg 文件
function findJpgFiles(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findJpgFiles(fullPath));
        } else if (/\.jpe?g$/i.test(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}

async function main() {
    const jpgFiles = findJpgFiles(PUBLIC_IMAGES);
    console.log(`\n🔍 找到 ${jpgFiles.length} 个 JPG 文件\n`);

    let totalOriginal = 0;
    let totalConverted = 0;
    let successCount = 0;
    let failCount = 0;

    for (const jpgPath of jpgFiles) {
        const webpPath = jpgPath.replace(/\.jpe?g$/i, '.webp');
        const rel = path.relative(ROOT, jpgPath);

        try {
            const originalSize = fs.statSync(jpgPath).size;
            totalOriginal += originalSize;

            await sharp(jpgPath)
                .webp({ quality: 80 })
                .toFile(webpPath);

            const newSize = fs.statSync(webpPath).size;
            totalConverted += newSize;

            const ratio = ((1 - newSize / originalSize) * 100).toFixed(0);
            console.log(`✅ ${rel}  ${(originalSize / 1024).toFixed(0)}K → ${(newSize / 1024).toFixed(0)}K  (-${ratio}%)`);

            // 删除原始 jpg
            fs.unlinkSync(jpgPath);
            successCount++;
        } catch (err) {
            console.error(`❌ ${rel}: ${err.message}`);
            failCount++;
        }
    }

    const savedMB = ((totalOriginal - totalConverted) / 1024 / 1024).toFixed(1);
    const totalRatio = ((1 - totalConverted / totalOriginal) * 100).toFixed(0);

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`📊 转换报告`);
    console.log(`   成功: ${successCount}  失败: ${failCount}`);
    console.log(`   原始: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   转换: ${(totalConverted / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   节省: ${savedMB}MB (-${totalRatio}%)`);
    console.log(`${'═'.repeat(50)}\n`);
}

main().catch(console.error);
