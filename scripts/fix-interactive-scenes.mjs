/**
 * A1 互动 Scene 精简脚本
 * 
 * 规则：互动 scene（有 game 字段）的 dialogue 最多保留前 1 句。
 * 多余的对话移到前一个 scene 的 dialogue 末尾（在 completeLesson 行之前）。
 * 
 * 这个脚本读取 lessons.ts，用正则找出所有互动 scene，精简它们的 dialogue。
 */

import fs from 'fs';
import path from 'path';

const LESSONS_PATH = path.resolve('src/data/lessons.ts');
const content = fs.readFileSync(LESSONS_PATH, 'utf-8');
const lines = content.split('\n');

console.log(`总行数: ${lines.length}`);

// 找出所有有 game: 的行号
const gameLines = [];
lines.forEach((line, idx) => {
    if (/game:\s*'/.test(line)) {
        gameLines.push(idx); // 0-indexed
    }
});
console.log(`找到 ${gameLines.length} 个互动 scene`);

// 对于每个互动 scene，找到它的 dialogue 数组
// 策略：从 game 行向下找 dialogue: [，然后收集所有 { speaker: ... } 行
// 只保留第 1 句，其余移到前一个 scene

let result = [...lines];
let totalMoved = 0;

// 我们需要从后往前处理，避免行号偏移
for (let g = gameLines.length - 1; g >= 0; g--) {
    const gameLine = gameLines[g]; // 0-indexed

    // 找 dialogue: [ 开始
    let dialogueStart = -1;
    for (let i = gameLine; i < Math.min(gameLine + 80, result.length); i++) {
        if (/dialogue:\s*\[/.test(result[i])) {
            dialogueStart = i;
            break;
        }
    }
    if (dialogueStart === -1) {
        console.log(`⚠️ 第 ${gameLine + 1} 行的互动 scene 没找到 dialogue`);
        continue;
    }

    // 收集所有 dialogue 行（{ speaker: ... }）
    const dialogueEntries = [];
    let dialogueEnd = -1;
    let bracketDepth = 0;
    for (let i = dialogueStart; i < Math.min(dialogueStart + 50, result.length); i++) {
        if (result[i].includes('dialogue:')) bracketDepth = 1;

        // 检查是否是一条 dialogue entry
        const entryMatch = result[i].match(/^\s*\{.*speaker:.*\}/);
        if (entryMatch) {
            dialogueEntries.push({ line: i, content: result[i] });
        }

        // 检查 dialogue 数组结尾 '],\n'
        if (/^\s*\],?\s*$/.test(result[i]) && dialogueEntries.length > 0) {
            dialogueEnd = i;
            break;
        }
    }

    if (dialogueEntries.length <= 1) {
        console.log(`✅ L? scene at line ${gameLine + 1}: 已是 ${dialogueEntries.length} 句，跳过`);
        continue;
    }

    console.log(`🔧 Scene at line ${gameLine + 1}: ${dialogueEntries.length} 句 → 保留第 1 句，移走 ${dialogueEntries.length - 1} 句`);

    // 要移走的对话行（第 2 句到最后一句的内容）
    const toMove = dialogueEntries.slice(1).map(e => e.content);
    totalMoved += toMove.length;

    // 从 dialogue 中删除多余行（从后往前删）
    const linesToDelete = dialogueEntries.slice(1).map(e => e.line).reverse();
    for (const lineIdx of linesToDelete) {
        result.splice(lineIdx, 1);
    }

    // 找到前一个 scene 的 dialogue 数组的结尾 '],'
    // 从 gameLine 往上找最近的 '],\n        },' 模式
    let prevSceneDialogueEnd = -1;
    for (let i = gameLine - 1; i >= 0; i--) {
        // 前一个 scene 的 dialogue 结尾标记
        if (/^\s*\],?\s*$/.test(result[i])) {
            // 确认这是一个 dialogue 数组的结尾（上面的行应该有 speaker:）
            if (i > 0 && /speaker:/.test(result[i - 1])) {
                prevSceneDialogueEnd = i;
                break;
            }
        }
    }

    if (prevSceneDialogueEnd === -1) {
        console.log(`⚠️ 未找到前一个 scene 的 dialogue 结尾，将移走的对话丢弃`);
        continue;
    }

    // 在前一个 scene dialogue 结尾之前插入移走的对话
    // prevSceneDialogueEnd 是 '], 行，在它之前插入
    result.splice(prevSceneDialogueEnd, 0, ...toMove);

    console.log(`   → 移动 ${toMove.length} 句对话到 line ${prevSceneDialogueEnd + 1} 之前`);
}

console.log(`\n总计移动 ${totalMoved} 句对话`);
console.log(`修改后总行数: ${result.length}`);

// 写回文件
fs.writeFileSync(LESSONS_PATH, result.join('\n'), 'utf-8');
console.log('✅ 文件已保存');
