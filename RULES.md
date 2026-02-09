# AI 超级个体实战课 — 全局开发规则

> ⚠️ 本文件为项目强制规范，所有开发步骤必须遵守，不可忽略。

## 一、日志与记录规范

1. **每次开发前**必须先更新 `task.md` 标记当前进度
2. **每次开发后**必须更新 `walkthrough.md` 记录完成内容
3. 关键决策和问题发现必须记录在本文件的「问题追踪」章节
4. 所有生成图片的脚本、prompt、结果必须有完整日志输出

## 二、图片生成规范

1. **禁止出现 KID 风格元素**：卡通机器人、霓虹色、儿童角色、emoji 表情包
2. **强制暗金商务风**：OLED 黑底 + 金色/琥珀色调 + 深灰辅助
3. 每条 prompt 必须包含前缀：`"Dark OLED black background, executive business style, gold and amber color palette, premium cinematic lighting, no cartoon, no children, no neon colors, no emoji, "`
4. **4-in-1 拼图降本**：每次 API 调用生成 2×2 网格图（4 张拼一张 2K 图），然后用 sharp 切割
5. 生成完毕后必须校验：逐张检查文件是否存在、大小是否合理（>10KB）
6. **不得擅自开始图片生成**，必须先报告数量和预估成本，等用户确认后执行

## 三、课程内容规范

1. 每课结构：3 个场景（叙述 + 互动1 + 互动2），每场景 8-12 条对话
2. speaker 只使用：`'AI 顾问'` / `'系统'` / `'案例'`
3. avatar 只使用：`'bot'` / `'alert'` / `'case'`
4. 每课的**最后一条对话**必须有 `action: 'completeLesson'`（最终课为 `'completeCourse'`）
5. 每课至少 2 个互动场景（`game` 字段），从以下组件中选择：
   - `decision-matrix` / `roi-calculator` / `prompt-workshop`
   - `architecture-builder` / `case-analyzer` / `model-comparator`
   - `timeline-explorer` / `quiz-challenge` / `scenario-simulator`
6. 互动场景必须配齐 `game` + `gameProps`（包含 `title` 和具体参数）
7. **不得出现 emoji 图标**，lesson icon 使用 Lucide 图标名称

## 四、UI/布局规范

1. 课程页面必须为 **PPT 幻灯片风格**（不是游戏式小对话框）
2. 三种模板自动切换：
   - narrative（AI 顾问）：左图 45% + 右文 55%，24px+ 大字
   - highlight（系统/案例）：全宽居中大字 36px+
   - interactive（有 game 的场景）：上方说明 + 下方互动组件
3. 底部分页指示器 + 页码 + 翻页按钮
4. 支持键盘 ←→ 翻页
5. 字体：标题 Cinzel，正文 Jost

## 五、构建与验证规范

1. 每次修改后必须运行 `npm run build`，0 errors 才算通过
2. 浏览器验证必须覆盖：L1 首页、L1 最后一页、至少 1 个互动场景
3. 互动组件必须实际可操作（不是只有标题的空壳）

---

## 问题追踪日志

| 日期 | 问题 | 原因 | 解决方案 | 状态 |
|------|------|------|----------|------|
| 2/8 | 图片 KID 风格 | prompt 约束不够 | 建立 prompt 前缀规范 | ✅ 已建规范 |
| 2/9 | 最后一页报错 | completeLesson 处理时序 | +completionState 覆盖层 | ✅ 已修复 |
| 2/9 | 互动环节缺失 | 缺 QuizChallenge 等组件 | +2 新组件 + props 兼容 | ✅ 已修复 |
| 2/9 | 34 个残留 .jpg | 4-in-1 脚本中间产物 | rm *.jpg | ✅ 已删除 |
| 2/9 | 45 张旧 KID 图未替换 | MD5 与 Git 旧提交完全一致 | 需用 4-in-1 重新生成 | ⬜ 待用户确认 |

### 45 张旧 KID 图片详细清单

| 课程 | 文件范围 | 数量 |
|------|----------|------|
| L5 | l5_01 ~ l5_08 | 8 |
| L6 | l6_01 ~ l6_07 | 7 |
| L7 | l7_01 ~ l7_08 | 8 |
| L8 | l8_01 ~ l8_07 | 7 |
| L9 | l9_01 ~ l9_07 | 7 |
| L10 | l10_01 ~ l10_08 | 8 |
| **合计** | | **45** |
