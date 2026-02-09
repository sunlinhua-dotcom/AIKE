import { DialogueLine } from '@/store/gameStore';

export interface LessonScene {
    id: string;
    bg: string;
    dialogue: DialogueLine[];
    game?: string;      // 互动游戏标识
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameProps?: any;     // 互动组件配置参数（Decision Matrix / ROI Calculator 等）
}

export interface LessonData {
    id: number;
    title: string;
    subtitle: string;
    module: string;
    icon: string;
    scenes: LessonScene[];
}

// ─── Module 1: 认知破局 (L1-L4) ───────────────────────────────

const lesson1: LessonData = {
    id: 1, title: '被浪费的 ChatGPT', subtitle: 'The Wasted Potential',
    module: '模块一 · 认知破局', icon: 'trending-down',
    scenes: [
        {
            id: 'l1-pain', bg: 'intro',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '你好，欢迎来到 AI 超级个体实战课。我是你的 AI 顾问。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '先做个小调查：你给公司买了 ChatGPT 账号吗？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果答案是「买了」，那我有一个坏消息——你大概率在浪费钱。' },
                { speaker: '案例', avatar: 'case', text: '数据说话：全球企业用户中，83% 的人每天只用 AI 聊天、翻译、写邮件。真正用它替代工作流的不到 7%。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '换句话说，你花了 20 美元/月买了一辆法拉利，然后一直用它来听广播。' },
                { speaker: '系统', avatar: 'alert', text: '检测到典型症状：「AI 玩具化」。核心问题不是工具不好，而是使用方式不对。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你一直在「试驾」。ChatGPT 就像 4S 店的试驾车——你开了很久，但从来没真正把它开回公司。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这不怪你。因为没有人教过你正确的使用方式。这门课要解决的就是这个问题。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '我们要做的不是教你「怎么用 AI 聊天」，而是教你「怎么用 AI 替代一个团队」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '准备好了吗？让我们先理解一个关键概念——AI 的三个层次。' },
            ],
        },
        {
            id: 'l1-layers', bg: 'layers',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI 的世界分三层。你在哪一层，决定了你能获得多大的回报。' },
                { speaker: '系统', avatar: 'alert', text: '第一层：玩具层。用 APP 聊天。像打出租车，每次都要重新说地址，等车，讲价。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '95% 的人停留在这一层。打开 ChatGPT，问一个问题，复制答案，关掉。明天再重复。' },
                { speaker: '系统', avatar: 'alert', text: '第二层：工具层。用 API 调用。像包车服务，路线固定，司机记住你的习惯，效率提升 5-10 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '到了这一层，AI 开始真正帮你干活了。自动处理客服、自动生成报告、自动分析数据。' },
                { speaker: '系统', avatar: 'alert', text: '第三层：武器层。用 AI 构建系统。你不再是乘客，你建造了一整个出行平台。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是超级个体的终极形态：一个人 + AI 系统 = 一支团队。' },
                { speaker: '案例', avatar: 'case', text: '王总是食品厂老板。他每天用 ChatGPT 查食品法规——这是玩具层。但他工厂的排产、库存管理还在用 Excel。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果王总学会搭建 AI 排产系统，他可以把 3 个文员的工作交给 AI，一年省下 30 万人力成本。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这门课的目标：把你从玩具层，直接拉到武器层。20 节课，一步到位。' },
            ],
        },
        {
            id: 'l1-klarna', bg: 'news',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '你可能觉得这些离你很远。那看一个真实案例。' },
                { speaker: '案例', avatar: 'case', text: 'Klarna，北欧金融科技巨头，2024 年用 AI 替代了 700 名客服的工作量。' },
                { speaker: '案例', avatar: 'case', text: '效率提升 3 倍。年省 4000 万美元。客户满意度没有下降反而提升了 2 个点。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '注意：他们不是「裁员 700 人」。而是用 AI 做了 700 人的工作量，现有员工转去做更高价值的事。' },
                { speaker: '案例', avatar: 'case', text: '类似的案例还有：Bloomberg 用 AI 自动生成 80% 的财经新闻摘要；Duolingo 用 AI 替代了大量内容编辑工作。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这些不是科幻故事，都是 2024-2025 年发生的真事。而且它们有一个共同点——' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这些公司的 CEO 没有学编程。他们只是学会了如何「管理 AI」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '管理 AI 的能力 = 管理人的能力。你已经有后者了，前者我们来教你。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你一直在用望远镜看 AI。这门课，我们教你把 AI 请进公司大门。' },
                { speaker: '系统', avatar: 'alert', text: '第一课完成。下一课，我们来认识你的 AI 员工团队。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson2: LessonData = {
    id: 2, title: 'AI 员工图鉴', subtitle: 'The 2026 AI Talent Market',
    module: '模块一 · 认知破局', icon: 'users',
    scenes: [
        {
            id: 'l2-market', bg: 'market',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '上节课我们说，要把 AI 请进公司。那第一个问题是——请哪个？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '别再问「哪个 AI 最好」了。这就像问「哪个员工最好」——这个问题本身就是错的。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你需要的不是一个全能员工，而是一个团队。每个 AI 都有专长。' },
                { speaker: '案例', avatar: 'case', text: '2026 年的 AI 人才市场有 50+ 主流模型。但你只需要了解 5-6 个核心选手。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '想象一下，你在招聘。面前有五份简历。让我们来面试。' },
                { speaker: '系统', avatar: 'alert', text: '进入「AI 面试室」——每个模型的核心优势、适用场景和成本一目了然。' },
            ],
        },
        {
            id: 'l2-models', bg: 'models',
            dialogue: [
                { speaker: '案例', avatar: 'case', text: 'Claude Opus 4.6 — 首席合规官。逻辑严谨度最高，适合审合同、做法律分析。成本：每百万 token $15。' },
                { speaker: '案例', avatar: 'case', text: 'Gemini-3-Pro — 创意总监。多模态之王，一次性处理视频+图片+万字长文。适合做市场分析、内容创作。' },
                { speaker: '案例', avatar: 'case', text: 'GLM-4.7 — 中国通特助。中文语境理解最强，价格是 Claude 的 1/10，通过国内合规审查。' },
                { speaker: '案例', avatar: 'case', text: 'GPT-5 / O3 — 全能 CEO。综合能力最强，万事通。但价格也是最贵的。' },
                { speaker: '案例', avatar: 'case', text: 'DeepSeek-R3 — 数学天才。代码、推理、数据分析无敌。关键是价格白菜价，性价比之王。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '看清了吗？每个 AI 的「岗位」不同。你不会让法务去做设计，也不该让 DeepSeek 去写品牌文案。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '核心策略：用便宜的 AI 处理海量简单任务，用贵的 AI 处理关键决策任务。' },
                { speaker: '案例', avatar: 'case', text: '陈总的电商公司：用 GLM-4.7 自动回复 80% 的客服咨询（每条 0.01 元），用 Claude 处理退款纠纷和投诉（每条 0.5 元）。月客服成本从 15 万降到 2 万。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这不是选美，是排兵布阵。就像足球队——不需要 11 个梅西，需要前锋、中场、后卫各司其职。' },
            ],
        },
        {
            id: 'l2-strategy', bg: 'office',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '现在你知道有哪些 AI 了。但怎么组建你的 AI 团队呢？三个原则。' },
                { speaker: '系统', avatar: 'alert', text: '原则一：任务优先。先列出你公司最耗人力的 3 个工作，再匹配 AI。' },
                { speaker: '系统', avatar: 'alert', text: '原则二：成本梯度。80% 任务用低成本 AI，15% 用中等 AI，5% 关键任务用顶级 AI。' },
                { speaker: '系统', avatar: 'alert', text: '原则三：国产优先。如果你的业务在中国，能用国产 AI 就用国产。合规风险最低，延迟最小。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住这句话：不选最贵的，只选最配的。AI 不是一个员工，是一个人才市场。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一课，我们学最关键的技能——怎么跟这些 AI 员工「说话」。' },
                { speaker: '系统', avatar: 'alert', text: '第二课完成。你的 AI 团队蓝图已初步成型。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson3: LessonData = {
    id: 3, title: '说人话即编程', subtitle: 'Prompting as Management',
    module: '模块一 · 认知破局', icon: 'terminal',
    scenes: [
        {
            id: 'l3-pain', bg: 'meeting',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '为什么你的 AI 输出像实习生写的，别人的像麦肯锡出品？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '因为你只会说「帮我搞一下」。作为老板，这叫「指令模糊」。' },
                { speaker: '案例', avatar: 'case', text: '差的指令：「帮我写个营销方案」。结果：AI 给你一篇大学生水平的泛泛而谈。' },
                { speaker: '案例', avatar: 'case', text: '好的指令：「你是一位 10 年经验的美妆品牌营销总监，针对 25-35 岁女性用户，为 618 大促设计一个为期 7 天的小红书种草方案，预算 50 万，用 Markdown 表格输出每日内容计划」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '看到差距了吗？后者的输出质量会比前者好 10 倍。不是 AI 不行，是你不会给指令。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '好消息是：你已经有这个能力了。你管人的时候，从来不会只说「你去把那个事搞一下」对吧？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你会说清楚：谁来做、做什么、做成什么样、什么时候交。这就是 Prompt Engineering。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '所以我们不教你「编程」，我们教你升级你已有的管理能力。' },
            ],
        },
        {
            id: 'l3-formula', bg: 'board', game: 'prompt-workshop',
            gameProps: {
                scenario: {
                    title: 'Prompt 实战工坊：排产计划',
                    role: '你是王总，一家食品加工厂的老板，有 3 条产线（A/B/C），目前日均产能 15 吨。',
                    businessTask: '你需要 AI 帮你制定下周的排产计划。B 线周三保养停产，A 线优先高毛利品类（牛肉干 > 鱼片 > 坚果），C 线只能做坚果。',
                    hints: ['指定角色', '给出背景', '明确任务', '规定格式', '设定约束'],
                    examples: [
                        {
                            label: '排产计划场景',
                            bad: '帮我排一下下周的生产计划',
                            good: '你是一位 10 年经验的生产总监。我是食品加工厂老板，有 A/B/C 三条产线，日均产能 15 吨。B 线周三保养停产，A 线优先高毛利品类（牛肉干 > 鱼片 > 坚果），C 线只能做坚果。请用 Excel 表格输出下周一至周五的排产计划，包含日期、产线、品类、产量四列。',
                            explanation: '好的 Prompt 包含了角色、背景、任务、格式、约束五要素，AI 输出质量提升 10 倍。',
                        },
                    ],
                    scoringCriteria: ['角色设定', '业务背景', '明确任务', '输出格式', '约束条件'],
                },
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '现在记住这个黄金公式，它会贯穿整门课。' },
                { speaker: '系统', avatar: 'alert', text: '黄金管理公式：角色 + 背景 + 任务 + 格式 + 约束。五个要素，缺一不可。' },
                { speaker: '案例', avatar: 'case', text: '角色 = 告诉 AI 它是谁。「你是 20 年经验的生产总监」比「你是 AI 助手」好 100 倍。' },
                { speaker: '案例', avatar: 'case', text: '背景 = 给 AI 上下文。「现有订单如下表，B 线周三保养」。没有背景，AI 只能瞎猜。' },
                { speaker: '案例', avatar: 'case', text: '任务 = 明确目标。「排出最少停机时间的生产计划」。越具体，输出越好。' },
                { speaker: '案例', avatar: 'case', text: '格式 = 规定输出样式。「用 Excel 表格输出，包含日期、产线、品类三列」。' },
                { speaker: '案例', avatar: 'case', text: '约束 = 划定边界。「注意 B 线周三停机保养，A 线优先高毛利品类」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '王总用这个公式给 AI 写排产指令，输出的排产表直接就能用。之前需要 3 个文员做 2 天的工作，现在 30 秒出结果。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是「说人话即编程」。你不用写代码，你只需要把话说清楚。' },
            ],
        },
        {
            id: 'l3-practice', bg: 'workshop',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '理论讲完了，来看看怎么在实际工作中应用。' },
                { speaker: '案例', avatar: 'case', text: '场景 1：老板说「帮我分析一下竞品」。这是个烂指令。怎么升级？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '升级版：「你是行业分析师，我是做宠物食品的，主要竞品是皇家、渴望、麦富迪。请从价格定位、渠道分布、核心卖点三个维度对比分析，用表格输出。」' },
                { speaker: '案例', avatar: 'case', text: '场景 2：「帮我写条朋友圈」→ 升级为 →「你是小红书爆文写手，为我的手工皮具品牌写一条 300 字的朋友圈文案，目标用户是 30-45 岁的男性企业主，风格要低调奢华不炫耀，结尾引导私聊不留电话」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '看到套路了吗？永远是角色 + 背景 + 任务 + 格式 + 约束。管 AI 和管人是一回事。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '一个好的 Prompt，就是一份好的工作 Brief。你管 AI 的能力，就是你管团队的能力。' },
                { speaker: '系统', avatar: 'alert', text: '第三课完成。你已掌握 Prompt 公式。但 AI 不是万能的——下节课我们聊它的致命弱点。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson4: LessonData = {
    id: 4, title: '驯服 AI 幻觉', subtitle: 'Taming Hallucinations',
    module: '模块一 · 认知破局', icon: 'shield-alert',
    scenes: [
        {
            id: 'l4-case', bg: 'court',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '上节课学了怎么跟 AI 说话。但今天要给你泼一盆冷水。' },
                { speaker: '案例', avatar: 'case', text: '2023 年，纽约律师 Steven Schwartz 用 ChatGPT 写了一份法律诉状，引用了 6 个判例。问题是——这 6 个判例全是 AI 编的。他被法官罚了 5000 美元。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是 AI 的致命弱点——幻觉 (Hallucination)。它会一本正经地胡说八道。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '为什么？因为 AI 的本质是「预测下一个词」。它不理解真假，它只追求「听起来合理」。' },
                { speaker: '案例', avatar: 'case', text: '更可怕的案例：某公司用 AI 自动生成财务报告，里面有一个数据被 AI 自作主张「修正」了。差点造成税务事故。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '所以你必须记住一条铁律：AI 是你的实习生，不是你的导师。它的每一份报告都需要审核。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '不恐惧，不盲信。这是使用 AI 的黄金心态。那具体怎么防御呢？' },
            ],
        },
        {
            id: 'l4-sop', bg: 'office', game: 'case-analyzer',
            gameProps: {
                caseStudy: {
                    title: 'AI 幻觉防御诊断',
                    company: 'Levidow & Oberman 律所',
                    industry: '法律行业',
                    problem: '2023 年，纽约律师 Steven Schwartz 使用 ChatGPT 撰写法律诉状，引用了 6 个判例——这 6 个判例全是 AI 编造的。法官发现后对其罚款 $5,000，律所声誉严重受损。',
                    data: [
                        { label: '虚假判例数', value: '6 个' },
                        { label: '罚款金额', value: '$5,000' },
                        { label: '声誉损失', value: '严重' },
                        { label: '根因', value: 'AI 幻觉' },
                    ],
                    question: '如果你是这家律所的合伙人，事后应该建立什么防御机制？',
                    options: [
                        { id: 'a', text: '禁止所有员工使用 AI 工具', isCorrect: false, explanation: '完全禁止 AI 会让你的竞争力下降。正确做法是建立使用规范，而不是因噎废食。' },
                        { id: 'b', text: '建立三道防线 SOP：要求 AI 标注来源 → 交叉验证 → 人工审核', isCorrect: true, explanation: '正确！三道防线是最佳实践：让 AI 标注来源、多模型交叉验证、关键内容人工审核。这样既用了 AI 的效率，又规避了幻觉风险。' },
                        { id: 'c', text: '换一个更贵的 AI 模型就不会出问题', isCorrect: false, explanation: '所有大语言模型都会产生幻觉，这是技术本质决定的。更贵的模型幻觉率更低，但不可能完全消除。' },
                        { id: 'd', text: '让 AI 自己检查自己的输出', isCorrect: false, explanation: 'AI 无法可靠地检测自己的幻觉——它生成「错误」信息时，自己也「认为」是对的。必须引入外部验证。' },
                    ],
                },
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '答案是建立 SOP（标准操作流程）。三步防线。' },
                { speaker: '系统', avatar: 'alert', text: '第一道防线：要求 AI 标注来源。在 Prompt 里加一句「请标注所有数据的来源，如果无法确认来源请注明」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '大部分 AI 如果加了这个约束，幻觉率会降低 60%。因为它被迫「承认不知道」。' },
                { speaker: '系统', avatar: 'alert', text: '第二道防线：交叉验证。重要数据让 2-3 个不同 AI 分别回答，取共识部分。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '就像你不会只听一个员工的汇报就做决策一样——交叉验证是管理常识。' },
                { speaker: '系统', avatar: 'alert', text: '第三道防线：人工审核。所有 AI 产出在对外发布前必须经人工确认。尤其是数字、法律、医疗类内容。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '流程就是：AI 输出 → 来源核查 → 交叉验证 → 人工审核 → 最终提交。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '听起来麻烦？其实不会。因为 AI 帮你完成了 80% 的工作，你只需要审核 20%。效率依然提升了 5 倍。' },
            ],
        },
        {
            id: 'l4-mindset', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '最后总结一下你对 AI 应该有的心态。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果你把 AI 当成「通过图灵测试的顾问」，完全信任它——你会栽跟头。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果你把 AI 当成「勤快但爱吹牛的实习生」——你会用得很爽。' },
                { speaker: '案例', avatar: 'case', text: '正确的使用姿势：让 AI 做初稿，你做审核。让 AI 做分析，你做决策。让 AI 做执行，你做判断。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '永远记住：你是老板，AI 是员工。老板的价值不在于自己干活，而在于做出正确的判断。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '到这里，模块一「认知破局」的四节课就全部学完了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你已经知道了：AI 的三个层次、AI 团队怎么搭、怎么给 AI 下指令、以及怎么防止 AI 犯错。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个模块，我们开始搭建你的 AI 武器库。准备好了吗？' },
                { speaker: '系统', avatar: 'alert', text: '模块一全部完成。认知已破局。接下来进入模块二「武器锻造」。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Module 2: 5层积木 (L5-L8) ───────────────────────────────

const lesson5: LessonData = {
    id: 5, title: '需求与界面', subtitle: 'Layer 1 & 2: Requirement & UI',
    module: '模块二 · 五层积木', icon: 'layers',
    scenes: [
        {
            id: 'l5-pain', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '从这节课开始，我们进入模块二「五层积木」。这是整门课最核心的方法论。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '先说一个真实的痛。赵总做珠宝品牌，想做一个高端官网。' },
                { speaker: '案例', avatar: 'case', text: '赵总找了 3 家外包公司，报价 3 万到 8 万不等。选了最便宜的那家，预付 50%。' },
                { speaker: '案例', avatar: 'case', text: '结果：改需求 10 轮，3 个月没上线，甲乙双方互相拉黑。钱花了，网站没有。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这是典型的「甲方乙方博弈」。你说不清楚要什么，他做不出你想要的。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '但如果你自己就能做呢？不用会编程，只需要会「说人话」。' },
                { speaker: '系统', avatar: 'alert', text: '五层积木的核心理念：把造应用拆成 5 个标准化步骤，每一步都可以用 AI 完成。' },
            ],
        },
        {
            id: 'l5-concept', bg: 'layers',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '五层积木，从下往上：① 需求 → ② 界面 → ③ API → ④ 技能包 → ⑤ 数据连接。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '今天讲前两层。第一层「需求」——用一段话描述你要什么。' },
                { speaker: '案例', avatar: 'case', text: '对比两种说法：❌「做个好看的网站」→ AI 不知道你要什么。✅「做一个黑金风格的珠宝品牌官网，包含品牌故事、产品展示、在线咨询、买家秀四个板块」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '好的需求描述 = 好的领导力。你给下属布置任务也是这样——说清楚目标、范围、标准。' },
                { speaker: '系统', avatar: 'alert', text: '第二层「界面」——AI 根据你的需求描述，直接生成可交互的页面。不需要画原型图，不需要写代码。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '传统流程：需求文档→原型图→UI设计→前端开发→测试，要 30-60 天。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'Vibe Coding 流程：一段话→AI 秒生成界面→你看着调整→5 分钟搞定。' },
            ],
        },
        {
            id: 'l5-interactive', bg: 'demo', game: 'architecture-builder',
            gameProps: {
                layers: [
                    { id: 'req', label: '需求层', description: '用自然语言描述你要什么' },
                    { id: 'ui', label: '界面层', description: 'AI 自动生成可交互页面' },
                    { id: 'api', label: 'API 层', description: '连接大模型的大脑' },
                    { id: 'skill', label: '技能包层', description: '注入行业专属知识' },
                    { id: 'mcp', label: '数据连接层', description: '打通企业实时数据' },
                ],
                correctOrder: ['req', 'ui', 'api', 'skill', 'mcp'],
                title: '五层积木架构',
                instruction: '把五层积木按正确顺序从底到顶排列',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '动手试试——把五层积木按正确顺序搭起来。' },
                { speaker: '系统', avatar: 'alert', text: '提示：最底层是最基础的，最顶层是最高级的数据能力。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住这个架构图。后面四节课，我们会逐层拆解。每一层都会让你的 AI 能力翻一倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '对了，你发现了吗——这五层积木和盖房子一模一样。打地基→建框架→装大脑→培训员工→接水电。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而且每一层都是独立的积木块。你可以先搭两层用起来，后面再加。' },
                { speaker: '案例', avatar: 'case', text: '赵总就是这么干的——先用前两层做了个能用的官网，后面再慢慢加 AI 客服和数据分析。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就对了。不要追求一步到位，先跑起来，再升级。' },
            ],
        },
        {
            id: 'l5-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '回到赵总的故事。他用 Vibe Coding，花了 5 分钟写需求，AI 生成了官网原型。' },
                { speaker: '案例', avatar: 'case', text: '结果：不满意？改一句话重新生成。10 分钟内迭代了 3 个版本，选了最好的那个。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '零成本试错。这才是 AI 时代的正确打开方式。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '但现在这个官网是「死」的——只能看不能交互。下一课，我们给它接上大脑。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住今天的核心：你的需求描述就是代码。说清楚你要什么，AI 就能给你什么。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '不需要会编程。需要的是你的判断力——什么该做，什么不该做。' },
                { speaker: '系统', avatar: 'alert', text: '第五课完成。你已经掌握了五层积木的前两层：需求 + 界面。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson6: LessonData = {
    id: 6, title: '接入大脑 API', subtitle: 'Layer 3: API',
    module: '模块二 · 五层积木', icon: 'cpu',
    scenes: [
        {
            id: 'l6-pain', bg: 'server',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '上一课我们做了一个「能看」的官网。但它有个致命缺陷——不会说话。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '张总的教培机构也碰到了这个问题。网站流量不错，但转化率只有 3%。' },
                { speaker: '案例', avatar: 'case', text: '家长凌晨 1 点刷到广告，点进官网想问课程详情。没人回。第二天忘了。线索流失。' },
                { speaker: '案例', avatar: 'case', text: '白天呢？3 个客服接电话，高峰期占线。家长等 5 分钟没人接，直接打给竞品。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '张总算了一笔账：每月流失 200 条线索 × 平均客单价 8000 元 = 160 万/月的潜在营收在蒸发。' },
                { speaker: '系统', avatar: 'alert', text: '核心矛盾：用户 24 小时咨询，人工客服 8 小时在线。缺口 = 16 小时的商机真空。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '解决方案就是五层积木的第三层——API。给你的应用接上 AI 大脑。' },
            ],
        },
        {
            id: 'l6-concept', bg: 'connection',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: 'API 是什么？打个比方：你的官网是餐厅前台，AI 大模型是后厨大厨。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'API 就是中间的传菜口——前台把顾客的问题传进去，后厨做好答案传出来。' },
                { speaker: '系统', avatar: 'alert', text: '关键概念：Token（令牌）。大模型按 Token 收费。1 个中文字 ≈ 1-2 个 Token。一次对话成本约 0.01-0.1 元。' },
                { speaker: '案例', avatar: 'case', text: '算笔账：一个人工客服月薪 5000 元。一个 AI 客服每月对话 10000 次，总成本不到 100 元。差 50 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而且 AI 客服的优势不只是便宜。它 24 小时在线、秒级响应、永不疲倦、永不发脾气。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你不需要选择「AI 还是人」。正解是：AI 做前线接待，人做高价值跟进。' },
                { speaker: '系统', avatar: 'alert', text: '多模型策略：不同问题给不同 AI。简单问题用便宜快速的 GLM，复杂问题用精准的 Claude。成本可控，质量有保障。' },
            ],
        },
        {
            id: 'l6-interactive', bg: 'demo', game: 'roi-calculator',
            gameProps: {
                title: 'AI 客服 ROI 计算器',
                inputs: [
                    { id: 'staff_count', label: '当前客服人数', default: 3, unit: '人' },
                    { id: 'monthly_salary', label: '人均月薪', default: 5000, unit: '元' },
                    { id: 'daily_inquiries', label: '日均咨询量', default: 100, unit: '条' },
                    { id: 'miss_rate', label: '当前漏接率', default: 40, unit: '%' },
                ],
                formula: '(staff_count * monthly_salary * 12) - (daily_inquiries * 365 * 0.05)',
                resultLabel: '年节省金额',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '来算一笔账，看看你的企业接入 AI 客服能省多少钱。' },
                { speaker: '系统', avatar: 'alert', text: '输入你公司的实际数据，计算器会告诉你 AI 客服的投资回报率。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '大多数老板算完都会沉默 3 秒——因为数字太震撼了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '但省钱不是最大的价值。最大的价值是：你再也不会错过任何一条线索。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '凌晨 2 点的咨询、节假日的咨询、高峰期排队的咨询——全部被 AI 接住。' },
                { speaker: '案例', avatar: 'case', text: '张总接入 API 后：线索流失率从 60% 降到 15%，月营收增长 23 万。3 个客服转做顾问式销售，每人产出翻倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是 API 的力量——让你的应用从「展示型」变成「对话型」。' },
            ],
        },
        {
            id: 'l6-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '总结一下第三层 API 的核心要点。' },
                { speaker: '系统', avatar: 'alert', text: '三个关键词：选模型（不同任务配不同 AI）、控成本（Token 计费透明可控）、保质量（Prompt 决定输出水平）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '选模型就像招聘——不是最贵的最好，而是最适合岗位的最好。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '到这里你的应用有了界面和大脑。但它还是个「通才」，什么都懂一点，什么都不精。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '怎么让它变成你的行业专家？下一课——技能包。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '想象一下：一个了解你公司所有产品、价格、话术的 AI 员工。它不只是个聊天机器人，它是你的超级销售。' },
                { speaker: '系统', avatar: 'alert', text: '第六课完成。五层积木第三层「API」已解锁。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson7: LessonData = {
    id: 7, title: '技能包 Skills', subtitle: 'Layer 4: Skills',
    module: '模块二 · 五层积木', icon: 'book-open',
    scenes: [
        {
            id: 'l7-pain', bg: 'library',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '上一课你给应用接了大脑。但你有没有发现一个问题？' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你问它「你们工厂 A 线能不能排 200 箱苹果汁？」，它说「我不了解您的工厂产线信息。」' },
                { speaker: '案例', avatar: 'case', text: '王总就碰到了这个问题。他用通用 GPT 做排产助手，结果 AI 不知道工厂有几条线、每条线产能多少、交期规则是什么。' },
                { speaker: '案例', avatar: 'case', text: '输出的排产表全是废话——看起来合理，但完全不符合工厂实际情况。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '问题出在哪里？AI 的大脑很聪明，但它不了解你的公司。它是个刚入职的高材生——学历好，但不懂行。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '解决方案就是第四层积木——技能包（Skills）。' },
                { speaker: '系统', avatar: 'alert', text: '技能包 = 岗位培训手册。你把公司的专业知识「喂」给 AI，它就从通才变成专家。' },
            ],
        },
        {
            id: 'l7-concept', bg: 'store',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '技能包本质上就是把你的行业知识结构化后喂给 AI。有三种方式。' },
                { speaker: '系统', avatar: 'alert', text: '方式一：System Prompt——在对话开头告诉 AI「你是谁、你知道什么」。最简单，适合短对话。' },
                { speaker: '系统', avatar: 'alert', text: '方式二：RAG（检索增强生成）——把文档切片存到向量数据库，AI 回答时自动检索相关内容。适合大量文档。' },
                { speaker: '系统', avatar: 'alert', text: '方式三：Fine-tuning（微调）——直接训练模型。效果最好但成本最高。中小企业一般用前两种就够了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '王总用了哪种？他让 AI 读了 200 页排产规则文档 + 3 年历史排产数据——这就是 RAG。' },
                { speaker: '案例', avatar: 'case', text: '效果立竿见影：AI 现在知道 A 线产能 500 箱/天、B 线只能做饮料、C 线正在检修到下周三。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '技能包的来源不只是自己写。GitHub 上有大量开源 Skill——搜索→安装→即用。就像手机的 App Store。' },
            ],
        },
        {
            id: 'l7-interactive', bg: 'demo', game: 'decision-matrix',
            gameProps: {
                title: 'Skill 优先级决策矩阵',
                description: '你是一个拥有 3 条产线的食品厂老板。预算有限，只能先给 AI 装 2 个 Skill。请评估优先级。',
                criteria: ['成本节省', '实施难度', '见效速度', '战略价值'],
                options: [
                    { id: 'prod', name: '排产优化 Skill', scores: [9, 6, 7, 9] },
                    { id: 'cs', name: '客服应答 Skill', scores: [7, 9, 9, 5] },
                    { id: 'fin', name: '财务分析 Skill', scores: [5, 7, 6, 7] },
                    { id: 'legal', name: '法规合规 Skill', scores: [4, 8, 5, 6] },
                    { id: 'hr', name: 'HR 考勤 Skill', scores: [6, 8, 8, 3] },
                ],
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '假设你是王总。预算只够装 2 个 Skill，你怎么选？' },
                { speaker: '系统', avatar: 'alert', text: '用决策矩阵评估：每个 Skill 在成本节省、实施难度、见效速度、战略价值四个维度打分。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这个矩阵本身就是一个管理工具——你以后给公司做任何 AI 项目决策都可以用它。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '秘诀：先选见效快的项目（让团队尝到甜头），再选战略价值高的项目（决定长期竞争力）。' },
                { speaker: '案例', avatar: 'case', text: '王总先装了客服 Skill（1 周见效），再装排产 Skill（1 个月调试）。两步走，稳扎稳打。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '通用 AI 是大学毕业生，加了 Skill 的 AI 是你公司的老员工。懂行，上手就能干活。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '王总给 AI 装了 Skills 后，排产预测准确率从 65% 提升到 97%——这就是知识注入的威力。' },
            ],
        },
        {
            id: 'l7-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '总结第四层。技能包让 AI 从「通才」变成「你公司的专家」。' },
                { speaker: '系统', avatar: 'alert', text: '三步走：① 整理公司知识文档 → ② 选择注入方式（Prompt/RAG/微调）→ ③ 持续更新维护。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '但即使装了技能包，AI 也只是在用「静态知识」回答问题。它看不到你公司实时发生的数据变化。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '比如：今天库存变了、昨天有一条线坏了、上周新进了一批原料——这些 AI 不知道。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '怎么解决？下一课——数据连接 MCP。让 AI 实时读取你的企业数据。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '五层积木快集齐了。一层层叠上去，每一层都让你的 AI 系统更强大。' },
                { speaker: '系统', avatar: 'alert', text: '第七课完成。五层积木第四层「技能包」已解锁。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson8: LessonData = {
    id: 8, title: '数据连接 MCP', subtitle: 'Layer 5: MCP',
    module: '模块二 · 五层积木', icon: 'plug',
    scenes: [
        {
            id: 'l8-pain', bg: 'data',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '五层积木的最后一层——也是威力最大的一层。数据连接。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '李总在全国开了 30 家连锁快餐店。每天面对的是什么？' },
                { speaker: '案例', avatar: 'case', text: '30 家店的数据分散在 5 个系统里：POS 收银、美团外卖、进货系统、员工排班、会员系统。' },
                { speaker: '案例', avatar: 'case', text: '每周一，李总要花整整 2 天把各系统数据导出到 Excel，手动做汇总表。等他看到数据时，已经是上周的了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '更要命的是：周三某家店的成本异常飙高——但李总周一才看报表。等发现时，已经亏了 5 天。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是数据孤岛。AI 再聪明，看不到你的实时数据也白搭。' },
                { speaker: '系统', avatar: 'alert', text: 'MCP（模型上下文协议）就是解决这个问题的。它是连接 AI 和你企业数据的万能适配器。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你可以把 MCP 理解成 USB-C 接口——不管你的数据在哪个系统，MCP 都能帮 AI 直接读取。' },
            ],
        },
        {
            id: 'l8-concept', bg: 'network',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: 'MCP 和传统 API 有什么区别？传统 API 是定制化的——每个系统都要写单独的接口代码。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'MCP 是标准化的——定义了一个通用协议，让 AI 能跟任何兼容的数据源对话。' },
                { speaker: '系统', avatar: 'alert', text: '打个比方：传统 API 像万国插头转换器（每个国家一个），MCP 像 USB-C（一个接口通吃所有设备）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '接上 MCP 后会发生什么？AI 不再是回答历史问题的助手——它能看到「现在」正在发生的事。' },
                { speaker: '案例', avatar: 'case', text: '李总接了 MCP 之后：每天早上 AI 自动分析 30 家店的昨日数据，异常自动预警推送到他手机。' },
                { speaker: '案例', avatar: 'case', text: '有一天，AI 凌晨 3 点推送：「回龙观店的鸡翅进货成本比上月高 30%，建议核查供应商报价。」第二天核实，果然被供应商偷偷涨价。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '不是 AI 替你管店，是 AI 帮你盯住每一个你看不到的角落。' },
            ],
        },
        {
            id: 'l8-interactive', bg: 'demo', game: 'architecture-builder',
            gameProps: {
                layers: [
                    { id: 'pos', label: 'POS 收银系统', description: '门店销售数据' },
                    { id: 'mcp', label: 'MCP 数据连接层', description: '统一数据协议' },
                    { id: 'ai', label: 'AI 大脑', description: '分析决策引擎' },
                    { id: 'dash', label: '看板输出', description: '可视化展示' },
                    { id: 'alert', label: '预警系统', description: '异常推送通知' },
                ],
                correctOrder: ['pos', 'mcp', 'ai', 'dash', 'alert'],
                title: 'MCP 数据架构流',
                instruction: '把 MCP 数据流的 5 个环节按正确顺序从底到顶排列',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '动手搭一下：一个完整的 MCP 数据架构是怎么连起来的？' },
                { speaker: '系统', avatar: 'alert', text: '从最底层的数据源开始，到最顶层的预警输出。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是数据驱动决策的完整链条。数据→连接→分析→展示→行动。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '每一个环节都可以自动化。李总现在每天只花 10 分钟看 AI 生成的日报，就能掌控 30 家店。' },
                { speaker: '案例', avatar: 'case', text: '效果量化：补货预测准确率 92%，单店月损耗降低 8000 元，30 家店年省 288 万。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '没有 MCP 的 AI 是笼子里的老虎。有了 MCP，它才能真正出来干活。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住：数据是 AI 的食物。你喂给它的数据越新鲜、越全面，它做出的判断就越准确。' },
            ],
        },
        {
            id: 'l8-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '恭喜！五层积木全部集齐。让我们回顾一下。' },
                { speaker: '系统', avatar: 'alert', text: '① 需求（说人话）→ ② 界面（AI 秒生成）→ ③ API（接大脑）→ ④ 技能包（变专家）→ ⑤ MCP（通数据）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '五层积木不是理论——后面四节课（模块三），你会亲手搭建四个真实项目。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '每个项目都会用到这五层积木。从下往上搭，一步步把想法变成能跑的 AI 应用。' },
                { speaker: '案例', avatar: 'case', text: '四个项目分别是：智能品牌官网、商业数据看板、7×24 AI 客服、智能排产系统。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '模块二结束。你已经掌握了方法论。下一步，动手干。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '准备好了吗？下一课我们直接开始第一个实战项目。' },
                { speaker: '系统', avatar: 'alert', text: '模块二「五层积木」全部完成。接下来进入模块三「亲手造」。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Module 3: 亲手造 (L9-L12) ───────────────────────────────

const lesson9: LessonData = {
    id: 9, title: '智能品牌官网', subtitle: 'Build: Brand Website',
    module: '模块三 · 亲手造', icon: 'globe',
    scenes: [
        {
            id: 'l9-pain', bg: 'studio',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '模块三正式开始。接下来四节课，你会亲手搭建四个真实项目。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一个项目：帮赵总做一个智能品牌官网。' },
                { speaker: '案例', avatar: 'case', text: '赵总做高端珠宝定制。线下口碑很好，但没有线上展示。客户想看作品只能跑到店里。' },
                { speaker: '案例', avatar: 'case', text: '之前找外包做官网：报价 5 万，工期 60 天，改了 10 版还不满意。最后项目流产。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '赵总的核心需求其实很简单：让客户在手机上就能看到作品、了解品牌、在线咨询。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这正好用上五层积木。15 分钟搞定外包报价 5 万的活。' },
            ],
        },
        {
            id: 'l9-requirements', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一步：拆需求。赵总的官网需要哪些板块？' },
                { speaker: '系统', avatar: 'alert', text: '四个核心板块：① 品牌故事（建立信任）② 作品展示（视觉冲击）③ 在线咨询（即时转化）④ 客户评价（社交证明）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '注意：需求不是越多越好。做减法比做加法更难。先上线核心功能，再迭代。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '赵总花了 15 分钟写完需求，一段话就够了。' },
                { speaker: '案例', avatar: 'case', text: '赵总的需求原文：「做一个黑金风格的珠宝品牌官网。首页要视频展示，二页品牌故事，三页作品瀑布流，四页客户评价墙，底部放微信二维码和在线咨询入口。」' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你看，不需要 PRD 文档、不需要线框图。一段话就把需求说清楚了。' },
            ],
        },
        {
            id: 'l9-build', bg: 'demo',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二步到第五步，一口气走完。' },
                { speaker: '系统', avatar: 'alert', text: '② 界面：把需求喂给 AI，5 分钟生成黑金风格页面。不满意？改一句话重新生成。' },
                { speaker: '系统', avatar: 'alert', text: '③ API：接入 GLM 大模型做在线客服。客户问「你们能做翡翠镶嵌吗？」，AI 秒回。' },
                { speaker: '系统', avatar: 'alert', text: '④ 技能包：把赵总的品牌故事、工艺介绍、价格体系导入，让 AI 像老员工一样回答。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第五步 MCP 暂时不用——品牌官网不需要连接后台数据系统。先上线再说。' },
                { speaker: '案例', avatar: 'case', text: '从写需求到上线：2 小时。外包报价 5 万+60 天的活，赵总自己搞定了。' },
            ],
        },
        {
            id: 'l9-interactive', bg: 'charts', game: 'roi-calculator',
            gameProps: {
                title: '官网自建 vs 外包 ROI 对比',
                inputs: [
                    { id: 'outsource_cost', label: '外包报价', default: 50000, unit: '元' },
                    { id: 'outsource_days', label: '外包工期', default: 60, unit: '天' },
                    { id: 'iterations', label: '年迭代次数', default: 6, unit: '次' },
                    { id: 'iteration_cost', label: '每次迭代成本', default: 3000, unit: '元' },
                ],
                formula: '(outsource_cost + iterations * iteration_cost) - 200',
                resultLabel: '年节省金额',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '来算一笔账：自建 vs 外包，到底差多少？' },
                { speaker: '系统', avatar: 'alert', text: '外包的隐性成本：每次改需求都要追加费用。一年改 6 次，每次 3000 元起步。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而 AI 自建的迭代成本几乎为零——你改一句话的事。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '真正的差距不只是钱，是速度。外包改一版等一周，AI 改一版等一分钟。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '在移动互联网时代，速度就是生命。快一天上线，就多一天抢占市场。' },
                { speaker: '案例', avatar: 'case', text: '赵总官网上线后第一周：线上咨询 47 条，其中 AI 自动接待 39 条，人工只处理了 8 条高意向客户。成交 3 单，营收 12 万。' },
            ],
        },
        {
            id: 'l9-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一个实战项目完成。来看看你学到了什么。' },
                { speaker: '系统', avatar: 'alert', text: '核心收获：你不需要学编程，你需要学做自己的乙方。需求描述力 = 一个人的核心竞争力。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '赵总说了一句话：「以前觉得做网站是技术活，现在发现做网站是决策活。」' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就对了。老板的价值从来不在执行，在于判断——做什么、不做什么、怎么呈现。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '官网是对外展示的窗口。下一课，我们做一个对内管理的工具——商业数据看板。' },
                { speaker: '系统', avatar: 'alert', text: '第九课完成。第一个实战项目「智能品牌官网」搭建完毕。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson10: LessonData = {
    id: 10, title: '智能商业看板', subtitle: 'Build: Business Dashboard',
    module: '模块三 · 亲手造', icon: 'bar-chart-2',
    scenes: [
        {
            id: 'l10-pain', bg: 'dashboard',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二个实战项目：帮李总做一个智能商业看板。' },
                { speaker: '案例', avatar: 'case', text: '李总的 30 家快餐连锁店，每天产生海量数据。但他面对的是什么？一堆 Excel 表格。' },
                { speaker: '案例', avatar: 'case', text: '老板娘凌晨 2 点还在对账。周一看的是上周的数据，相当于开车只看后视镜。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '做决策靠的是什么？数据。但过时的数据比没有数据更危险——它给你虚假的安全感。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '李总需要的是一个数据看板：实时、可视化、能自动预警异常。' },
                { speaker: '系统', avatar: 'alert', text: '这次用到五层积木的全部五层。这是迄今为止最完整的一次搭建。' },
            ],
        },
        {
            id: 'l10-design', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '看板需要展示什么？不是越多越好——抓住 4 个核心指标就够。' },
                { speaker: '系统', avatar: 'alert', text: '① 营收趋势（整体健不健康？）② 毛利分析（赚不赚钱？）③ 单品排名（什么卖得好？）④ 异常预警（哪里出问题？）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '好的看板设计讲究「30 秒原则」——李总打开看板，30 秒内就知道今天整体情况。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '细节在第二层。点进任何一个指标，都能看到门店维度的拆解。' },
                { speaker: '案例', avatar: 'case', text: '搭建步骤：① 需求（4 个指标） → ② UI（动态图表） → ③ API（AI 分析引擎）→ ④ Skill（餐饮专业知识） → ⑤ MCP（POS 数据实时连接）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '最关键的是第五层 MCP——让 AI 直接读 POS 系统的实时数据，不需要再导 Excel。' },
            ],
        },
        {
            id: 'l10-demo', bg: 'charts',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '接上 MCP 后，看板变「活」了。它不只是展示数据，它能分析数据。' },
                { speaker: '案例', avatar: 'case', text: '李总对着看板说：「为什么昨天毛利跌了？」' },
                { speaker: '案例', avatar: 'case', text: 'AI 回答：「回龙观店外卖损耗异常增加 15%，原因是暴雨导致配送时间延长，餐品退单率上升。」' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '注意：AI 不只是告诉你「跌了」，它告诉你「为什么跌了」。这是传统 BI 工具做不到的。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '传统 BI：你要自己看报表→发现异常→分析原因→做决策。AI 看板：AI 帮你发现异常→分析原因→甚至给出建议。' },
                { speaker: '系统', avatar: 'alert', text: 'AI 看板 vs 传统 BI：从「人找数据」变成「数据找人」。决策延迟从周级降到分钟级。' },
            ],
        },
        {
            id: 'l10-interactive', bg: 'office', game: 'case-analyzer',
            gameProps: {
                caseStudy: {
                    title: '看板异常诊断',
                    company: '李记快餐连锁',
                    industry: '餐饮连锁',
                    problem: '周三看板显示整体日营收下降 12%，毛利率降低 3 个百分点。你是李总，需要在 AI 看板中快速定位问题。',
                    data: [
                        { label: '营收同比', value: '-12%' },
                        { label: '毛利率', value: '降 3 个百分点' },
                        { label: '客单价', value: '正常' },
                        { label: '天气', value: '暴雨' },
                    ],
                    question: '根据以上数据，你判断最可能的原因是什么？',
                    options: [
                        { id: 'a', text: '竞品降价，客户被分流', isCorrect: false, explanation: '客单价正常说明来的客户消费习惯没变，问题在客流量和成本端。' },
                        { id: 'b', text: '暴雨导致外卖退单+损耗增加', isCorrect: true, explanation: '正确！暴雨→配送延长→退单率上升→食材损耗增加。毛利下降主因是损耗成本。看板+AI 能在当天就发现这个问题。' },
                        { id: 'c', text: '食材供应商偷偷涨价', isCorrect: false, explanation: '供应商涨价会影响多日，但这里是单日异常。天气因素更可能。' },
                        { id: 'd', text: '员工偷吃导致食材消耗增加', isCorrect: false, explanation: '这种情况不会导致 12% 的营收下降和毛利整体下滑。' },
                    ],
                },
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '模拟一下：你是李总，看板报警了，你怎么判断？' },
                { speaker: '系统', avatar: 'alert', text: '看板给你 4 个关键数据，你需要用逻辑判断最可能的原因。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是老板的价值——AI 给你数据，你做判断。人机协作的典范。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '看板不是替你做决策，是加速你做决策。从看到数据到做出应对，以前 3 天现在 3 分钟。' },
                { speaker: '案例', avatar: 'case', text: '李总现在的日常：早上 8 点看 AI 看板日报（5 分钟）→ 处理异常预警（10 分钟）→ 剩下的时间专注战略。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '以前是开夜路不开灯，现在灯全开了。你看得清路，自然开得快。' },
            ],
        },
        {
            id: 'l10-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二个实战项目完成。你已经能搭建对外的官网和对内的看板了。' },
                { speaker: '系统', avatar: 'alert', text: '核心收获：数据看板的价值不在于「展示」，在于「预警」和「分析」。AI 让看板从仪表盘变成了副驾驶。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一课更刺激——搭建一个 7×24 小时不下班的 AI 员工。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '它不需要底薪，不需要五险一金，不会请假，不会撂挑子。而且永远微笑服务。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '李总说：「如果早两年知道这些，我至少能多赚 500 万。」' },
                { speaker: '系统', avatar: 'alert', text: '第十课完成。第二个实战项目「智能商业看板」搭建完毕。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson11: LessonData = {
    id: 11, title: '7x24 AI 员工', subtitle: 'Build: AI Staff',
    module: '模块三 · 亲手造', icon: 'headphones',
    scenes: [
        {
            id: 'l11-pain', bg: 'chatops',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第三个实战项目：帮张总搭建一个 7×24 小时在线的 AI 员工。' },
                { speaker: '案例', avatar: 'case', text: '张总的教培机构有个致命问题：客服下班后，家长的咨询石沉大海。' },
                { speaker: '案例', avatar: 'case', text: '教培行业有个特点：家长往往在晚上 8-11 点决策，但这正好是客服下班时间。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '更要命的是：竞品已经用了 AI 客服，10 秒内自动回复。你次日回复，客户早被截走了。' },
                { speaker: '系统', avatar: 'alert', text: '关键数据：教培行业线索的「黄金响应窗口」是 5 分钟。超过 5 分钟，转化率下降 80%。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '张总不需要雇一个不睡觉的客服——他需要一个 AI。' },
            ],
        },
        {
            id: 'l11-build', bg: 'server',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '这次的搭建重点在第四层——技能包。因为 AI 客服最怕的是「答非所问」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '张总准备了 200 页课程资料：课程大纲、师资介绍、收费标准、常见问题、退费政策。' },
                { speaker: '系统', avatar: 'alert', text: '这 200 页文档通过 RAG 技术向量化后导入 AI——它现在了解张总教培的每一个细节。' },
                { speaker: '案例', avatar: 'case', text: '技能注入后的效果：家长问「5 岁小孩适合什么课？」，AI 回答准确率 95%，和资深顾问水平相当。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '然后部署到公众号和企业微信。家长从任何入口来咨询，都能被 AI 秒级接住。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI 还有一个人做不到的优势：它能同时接待 100 个家长。人工客服高峰期只能一对一。' },
            ],
        },
        {
            id: 'l11-results', bg: 'charts',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '看看部署后的效果数据。' },
                { speaker: '案例', avatar: 'case', text: '深夜 2 点，一位家长问：「你们芭蕾课的老师是什么资历？」AI 秒回，附带老师简介和证书链接。' },
                { speaker: '案例', avatar: 'case', text: '家长被专业度打动，第二天就报了名。这条线索如果没有 AI 接住，100% 流失。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI 客服还有一个隐藏功能：自动给每条咨询打标签——「高意向」「价格敏感」「在比较竞品」。' },
                { speaker: '系统', avatar: 'alert', text: '人工客服第二天上班，看到的是 AI 整理好的「今日待跟进」列表，按优先级排好。效率翻倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是人机协作的最佳模式：AI 做前线筛选，人做精准转化。各干各擅长的事。' },
            ],
        },
        {
            id: 'l11-interactive', bg: 'demo', game: 'roi-calculator',
            gameProps: {
                title: 'AI 客服增量营收计算器',
                inputs: [
                    { id: 'monthly_leads', label: '月咨询线索数', default: 500, unit: '条' },
                    { id: 'current_rate', label: '当前转化率', default: 15, unit: '%' },
                    { id: 'ai_rate', label: 'AI 辅助后转化率', default: 28, unit: '%' },
                    { id: 'avg_price', label: '平均客单价', default: 8000, unit: '元' },
                ],
                formula: 'monthly_leads * (ai_rate - current_rate) / 100 * avg_price * 12',
                resultLabel: '年增量营收',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '算一下：AI 客服能给你带来多少增量营收？' },
                { speaker: '系统', avatar: 'alert', text: '核心逻辑：转化率提升 × 线索量 × 客单价 = 增量营收。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '大部分教培老板算完这笔账都会后悔——「怎么没有早点用？」' },
                { speaker: '案例', avatar: 'case', text: '张总的实际数据：线索转化率从 15% 提升到 28%。夜间咨询覆盖率从 0% 到 100%。月增营收 23 万。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而 AI 客服的月成本不到 200 元。ROI 超过 1000 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你不需要不睡觉的员工，你需要一个 AI。' },
            ],
        },
        {
            id: 'l11-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第三个实战项目完成。你的 AI 军团又多了一员——7×24 全天候客服。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '回顾一下：官网（对外展示）+ 看板（对内管理）+ AI 客服（客户接待）。三个项目覆盖了经营的三大核心场景。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '还差最后一个——生产端。下一课，我们挑最难的：智能排产系统。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这是王总的终极一战。也是这门课技术含量最高的一个项目。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '但别担心——你已经掌握了五层积木，搭建方法都是一样的。只是这次的数据更复杂。' },
                { speaker: '系统', avatar: 'alert', text: '第十一课完成。第三个实战项目「7×24 AI 员工」搭建完毕。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson12: LessonData = {
    id: 12, title: '智能排产系统', subtitle: 'Build: Smart Scheduling',
    module: '模块三 · 亲手造', icon: 'factory',
    scenes: [
        {
            id: 'l12-pain', bg: 'factory',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '最后一个实战项目，也是最复杂的一个：帮王总食品厂搭建智能排产系统。' },
                { speaker: '案例', avatar: 'case', text: '王总的工厂：3 条产线、50 个 SKU、每天 20-30 张订单，交期、原料库存、产能约束全都要考虑。' },
                { speaker: '案例', avatar: 'case', text: '现在的排产全靠老师傅张叔——40 年经验，脑子里装着所有规则。问题是：张叔要退休了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而且就算张叔在，排一次产表也要 2 小时。遇到紧急插单，改排产表又得 1 小时。' },
                { speaker: '系统', avatar: 'alert', text: '更致命的风险：张叔生病请假一天，整个工厂的生产调度就瘫痪了。人在知识在，人走知识亡。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是经典的「关键人依赖」问题。解决方案不是再培养一个张叔——而是把张叔的经验变成 AI。' },
            ],
        },
        {
            id: 'l12-design', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '排产系统的设计比前三个项目复杂在哪里？它需要多模型协作。' },
                { speaker: '系统', avatar: 'alert', text: 'GLM 负责快速决策——读订单→匹配产能→生成初版排产表。速度快，适合做第一轮计算。' },
                { speaker: '系统', avatar: 'alert', text: 'Claude 负责逻辑纠错——检查排产表有没有约束冲突（比如 A 线在检修期被安排了生产）。' },
                { speaker: '系统', avatar: 'alert', text: 'MCP 连接实时库存系统——排产前先看还有多少原料，避免排了产却没料可用。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就像你管一个部门：一个人出初稿，一个人审核，再看看资源够不够。只不过全是 AI 在做。' },
                { speaker: '案例', avatar: 'case', text: '张叔的 200 页排产规则文档 + 3 年历史数据全部灌进技能包。AI 现在比张叔还了解这个工厂。' },
            ],
        },
        {
            id: 'l12-demo', bg: 'dashboard',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '看看实际运行效果。' },
                { speaker: '案例', avatar: 'case', text: '王总输入今天的订单清单，AI 10 分钟内输出排产表：每条线排什么、产多少、几点开始几点结束。' },
                { speaker: '案例', avatar: 'case', text: '还自动标注风险点：「B 线周四需要检修，建议把苹果汁提前到周三生产」。' },
                { speaker: '系统', avatar: 'alert', text: '原来 2 小时的手工排产，现在 10 分钟。而且 AI 不会忘记约束条件——张叔偶尔会忘。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '遇到紧急插单怎么办？以前张叔要重新排 1 小时。现在 AI 重新跑一次，3 分钟出结果。' },
                { speaker: '案例', avatar: 'case', text: '最让王总满意的功能：AI 会根据库存自动建议「今天该补哪些原料」，避免断供。' },
            ],
        },
        {
            id: 'l12-interactive', bg: 'demo', game: 'architecture-builder',
            gameProps: {
                layers: [
                    { id: 'order', label: '订单输入', description: '今日订单清单' },
                    { id: 'glm', label: 'GLM 快速排产', description: '初版排产方案' },
                    { id: 'claude', label: 'Claude 约束检查', description: '检测冲突和风险' },
                    { id: 'mcp', label: 'MCP 库存校验', description: '实时原料确认' },
                    { id: 'output', label: '排产表输出', description: '最终方案+风险标注' },
                ],
                correctOrder: ['order', 'glm', 'claude', 'mcp', 'output'],
                title: '多模型排产流水线',
                instruction: '把排产系统的 5 个环节按执行顺序排列',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '动手搭一下排产系统的多模型流水线。' },
                { speaker: '系统', avatar: 'alert', text: '注意：每个环节的输出是下一个环节的输入。顺序很重要。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是「多模型协作」的精髓——每个 AI 各司其职，像一个团队一样配合。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你不需要一个全能的 AI，你需要一个配合默契的 AI 团队。' },
                { speaker: '案例', avatar: 'case', text: '王总现在最开心的是：张叔终于可以安心退休了，经验已经被 AI 完整继承。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这不是取代人，是让知识永生。企业最怕的不是人走了，是人走了把知识也带走了。' },
            ],
        },
        {
            id: 'l12-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '四个实战项目全部完成！回顾一下模块三你造了什么：' },
                { speaker: '系统', avatar: 'alert', text: '① 智能品牌官网（对外展示）② 商业数据看板（对内管理）③ 7×24 AI 客服（客户接待）④ 智能排产系统（生产调度）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '覆盖了企业经营的四大核心场景：品牌、数据、销售、生产。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而且每个项目都用了同一套方法论——五层积木。方法是通用的，场景可以无限扩展。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个模块更精彩——项目工坊。6 个更垂直的行业案例，教你把 AI 用到极致。' },
                { speaker: '系统', avatar: 'alert', text: '模块三「亲手造」全部完成。4 个实战项目搭建完毕。准备进入模块四「项目工坊」。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Module 4: 项目工坊 (L13-L18) ───────────────────────────────

const lesson13: LessonData = {
    id: 13, title: 'AI 图片加工厂', subtitle: 'Workshop: Image Factory',
    module: '模块四 · 项目工坊', icon: 'image',
    scenes: [
        {
            id: 'l13-pain', bg: 'studio',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '模块四「项目工坊」开始。6 个垂直行业案例，教你把 AI 用到极致。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一个工坊：帮陈总的电商品牌搭建 AI 图片加工厂。' },
                { speaker: '案例', avatar: 'case', text: '陈总做女装电商，每季上新 200 个 SKU。传统做法：摄影师拍照 + 修图师后期 = 3 天 + 1.5 万。' },
                { speaker: '案例', avatar: 'case', text: '换季清仓来不及拍新图，用旧图上架——点击率暴跌 40%。图片决定了电商的生死。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '更痛的是「测款」：传统模式要先备货→拍图→上架→看数据。一个款测下来成本 2000+。' },
                { speaker: '系统', avatar: 'alert', text: 'AI 做图的逻辑完全不同：先出图→测点击率→数据好再备货。零库存测款，风险归零。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这不是降本，这是改变了「先生产后验证」的商业逻辑。' },
            ],
        },
        {
            id: 'l13-solution', bg: 'demo',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '具体怎么做？三步流水线。' },
                { speaker: '系统', avatar: 'alert', text: '① AI 生图：用 Midjourney 或 SDXL 生成模特穿搭效果图。一张图成本不到 1 元。' },
                { speaker: '系统', avatar: 'alert', text: '② 批量处理：ComfyUI 搭建自动流水线——换背景、调色、加水印，200 张图一键处理。' },
                { speaker: '系统', avatar: 'alert', text: '③ 质检上架：AI 自动检测图片质量（分辨率/构图/色彩），合格的直接推送到电商后台。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '200 个 SKU 的图片，传统方式 3 天 1.5 万。AI 方式：10 分钟 + 50 元。' },
                { speaker: '案例', avatar: 'case', text: '陈总的数据：上新速度从每月 1 次提升到每周 2 次。测款成本从 2000 元/款降到 5 元/款。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '快 10 倍 + 便宜 300 倍。这就是 AI 在电商场景的碾压级优势。' },
            ],
        },
        {
            id: 'l13-interactive', bg: 'charts', game: 'model-comparator',
            gameProps: {
                title: 'AI 图片生成模型对比',
                models: [
                    { name: 'Midjourney', scores: { quality: 9, speed: 7, cost: 5, ease: 8 }, description: '最佳艺术质量，适合品牌视觉' },
                    { name: 'SDXL', scores: { quality: 8, speed: 9, cost: 9, ease: 6 }, description: '开源免费，批量处理首选' },
                    { name: 'DALL·E 3', scores: { quality: 7, speed: 8, cost: 6, ease: 9 }, description: '最易上手，适合快速原型' },
                ],
                dimensions: ['quality', 'speed', 'cost', 'ease'],
                dimensionLabels: { quality: '画质', speed: '速度', cost: '性价比', ease: '易用性' },
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '三款主流 AI 图片模型，各有什么优劣？对比看看。' },
                { speaker: '系统', avatar: 'alert', text: '评估维度：画质、速度、性价比、易用性。不同场景选不同模型。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '陈总的选择：日常出图用 SDXL（免费+快），品牌主图用 Midjourney（质量高）。混合使用最划算。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住：没有最好的工具，只有最适合的工具。就像你不会用大炮打蚊子。' },
                { speaker: '案例', avatar: 'case', text: '电商 AI 产图的隐藏收益：A/B 测试成本归零。同一个款式生成 5 套不同风格的图，看哪套点击率高。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '陈总说：「以前我靠直觉选首图，现在我靠数据。AI 把我从赌徒变成了科学家。」' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '数据驱动的直觉才是真正的商业嗅觉。' },
            ],
        },
        {
            id: 'l13-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一个工坊完成。AI 图片加工厂的价值不只是省钱。' },
                { speaker: '系统', avatar: 'alert', text: '三个核心价值：① 上新速度碾压（快 10 倍）② 测款零成本（先图后货）③ 数据驱动选品（A/B 测试）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '适用行业：电商、服装、家居、食品包装——任何需要大量产品图的行业。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个工坊：AI 标书工匠。帮刘总 2 小时搞定 3 天的标书。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '每一个工坊都是一个独立的商业武器。学完 6 个，你就拥有了一个 AI 武器库。' },
                { speaker: '系统', avatar: 'alert', text: '第十三课完成。工坊一「AI 图片加工厂」结业。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson14: LessonData = {
    id: 14, title: 'AI 标书工匠', subtitle: 'Workshop: Proposal Master',
    module: '模块四 · 项目工坊', icon: 'file-text',
    scenes: [
        {
            id: 'l14-pain', bg: 'meeting',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二个工坊：帮刘总的建筑公司用 AI 写标书。' },
                { speaker: '案例', avatar: 'case', text: '刘总明天下午 3 点投标。技术标 80 页还没写完。3 个造价师通宵加班，眼睛都红了。' },
                { speaker: '案例', avatar: 'case', text: '上次投标就因为技术标有 2 处细节错误被扣了 5 分——差那 5 分就中标了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '标书写作的痛点：① 时间紧（通常 5-7 天）② 容易出错（数据/格式/计算）③ 人力成本高。' },
                { speaker: '系统', avatar: 'alert', text: '建筑行业的标书平均 80-200 页。手写一份标书的平均成本：3 人 × 3 天 × 人均日薪 500 = 4500 元。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '关键问题不是写不出来——是写得慢、容易出错、很难优化。AI 可以在三个方面碾压人工。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '速度：2 小时 vs 3 天。准确率：AI 不会漏填公式。优化：AI 能模拟评标。' },
            ],
        },
        {
            id: 'l14-solution', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '多模型协作在标书场景的应用。' },
                { speaker: '系统', avatar: 'alert', text: '① Gemini：读招标文件 + 图纸。它的多模态能力可以直接理解 PDF 和 CAD 截图。' },
                { speaker: '系统', avatar: 'alert', text: '② Claude：写技术方案。它的逻辑严谨、长文本能力强，适合写 80 页的技术标。' },
                { speaker: '系统', avatar: 'alert', text: '③ GPT-4o：润色排版。语言流畅度最好，适合最后一轮修饰和格式统一。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '三个 AI 接力赛：Gemini 读题 → Claude 答题 → GPT 润色。各司其职，2 小时搞定。' },
                { speaker: '案例', avatar: 'case', text: '最厉害的功能：让 AI 模拟评标专家打分。它能按照评分细则逐项打分，指出扣分风险点。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '刘总看到预打分结果，针对性修改了 3 处薄弱环节。最终得分比预期高了 8 分。' },
            ],
        },
        {
            id: 'l14-interactive', bg: 'office', game: 'case-analyzer',
            gameProps: {
                caseStudy: {
                    title: '标书 AI 化评估',
                    company: '刘氏建筑',
                    industry: '建筑工程',
                    problem: '一份 120 页的市政工程技术标，需要在 48 小时内完成。当前团队 3 人，以往同类标书需要 4 天。你是刘总，如何用 AI 提效？',
                    data: [
                        { label: '标书页数', value: '120 页' },
                        { label: '剩余时间', value: '48 小时' },
                        { label: '传统工期', value: '4 天' },
                        { label: '团队人数', value: '3 人' },
                    ],
                    question: '以下哪种 AI 分工策略最优？',
                    options: [
                        { id: 'a', text: '让 AI 直接写完全部 120 页，人工只做最终审核', isCorrect: false, explanation: 'AI 一次生成 120 页质量不稳定，容易出现逻辑不连贯、数据不一致的问题。' },
                        { id: 'b', text: 'AI 读招标文件提炼要点 → AI 分章节写初稿 → 人工审核修改 → AI 润色定稿', isCorrect: true, explanation: '正确！分步协作才是最稳方案：AI 做 80% 的初稿工作，人把控 20% 的质量关。既快又准。' },
                        { id: 'c', text: '用 AI 翻译往期中标标书，换个项目名交上去', isCorrect: false, explanation: '每个项目的技术参数不同，照搬旧标书会被评委一眼看出。而且可能构成虚假投标。' },
                        { id: 'd', text: '先通宵手写，写不完的部分再让 AI 补', isCorrect: false, explanation: '这样 AI 只在边角发挥作用。应该让 AI 做主力，人做质控。' },
                    ],
                },
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '模拟决策：你是刘总，48 小时赶标书，怎么分配人和 AI 的工作？' },
                { speaker: '系统', avatar: 'alert', text: '注意：不是人 OR AI，而是人 AND AI。关键是分工策略。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '最佳实践：AI 打底稿（速度），人审核把关（质量）。这个模式适用于所有文档密集型工作。' },
                { speaker: '案例', avatar: 'case', text: '刘总的最终成绩：48 小时内完成 120 页技术标。评分 92 分（历史最高），中标。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '中标概率从 15% 提升到 35%。不是因为 AI 写得好，是因为你有更多时间优化策略。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI 让你从「写标书」升级到「做策略」。层次不一样了。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这个模式的适用场景：标书、方案书、可研报告、商业计划书——所有长文档都适用。' },
            ],
        },
        {
            id: 'l14-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二个工坊完成。核心收获：' },
                { speaker: '系统', avatar: 'alert', text: 'AI 标书工匠的三板斧：① 多模型接力（读-写-润色）② 模拟评分（预判扣分点）③ 人机协作（AI 初稿+人审核）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个工坊更有意思——OpenClaw 指挥官。一个能潜伏在微信群里帮你管项目的 AI Agent。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果你管过多个项目的微信群，你一定懂那种被各种扯皮淹没的绝望。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '从这一课开始，扯皮终结。' },
                { speaker: '系统', avatar: 'alert', text: '第十四课完成。工坊二「AI 标书工匠」结业。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson15: LessonData = {
    id: 15, title: 'OpenClaw 指挥官', subtitle: 'Workshop: Project Commander',
    module: '模块四 · 项目工坊', icon: 'terminal',
    scenes: [
        {
            id: 'l15-pain', bg: 'construction',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第三个工坊：用 AI Agent 管理多项目协作——OpenClaw 指挥官。' },
                { speaker: '案例', avatar: 'case', text: '孙总的装修公司同时管 8 个工地。每个工地一个微信群。每天群消息 2000+。' },
                { speaker: '案例', avatar: 'case', text: '最头疼的问题：谁承诺了什么没记录，到点没人干也没人催，一出问题各方互相甩锅。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '孙总每天 80% 的时间在群里「裁判」——谁的责任、该催谁、谁逾期了。管理成了催作业。' },
                { speaker: '系统', avatar: 'alert', text: '项目管理的核心痛点：承诺无记录、进度无追踪、责任无界定。全靠人盯人。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你需要的不是更多的项目经理——你需要一个永远不漏任何承诺的 AI Agent。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'OpenClaw 是一个开源的 AI 项目管理 Agent。它潜伏在微信群里，默默工作。' },
            ],
        },
        {
            id: 'l15-solution', bg: 'server',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: 'OpenClaw 的三个核心能力。' },
                { speaker: '系统', avatar: 'alert', text: '① 自动识别承诺：群里有人说「我周三前把水电改好」，Agent 自动记录为一条待办。' },
                { speaker: '系统', avatar: 'alert', text: '② 智能催办：周三上午 Agent 自动@那个人：「提醒：水电改造今天到期，请更新进度。」' },
                { speaker: '系统', avatar: 'alert', text: '③ 生成证据链：谁说了什么、什么时候说的、做没做到——全自动记录。扯皮的时候翻记录。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '最巧妙的是：它不打扰日常沟通。它只是默默地听、默默地记、到时候才出来催。' },
                { speaker: '案例', avatar: 'case', text: '孙总用了 OpenClaw 后的变化：每周生成一份「8 个工地进度周报」，自动标注延期项目和风险点。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '原来孙总写周报要 4 小时。现在 Agent 自动生成，他花 10 分钟看完就行。' },
            ],
        },
        {
            id: 'l15-interactive', bg: 'demo', game: 'timeline-explorer',
            gameProps: {
                title: 'AI 项目管理效率对比',
                phases: [
                    { id: 'before1', label: '传统模式·第1周', description: '承诺散落在聊天记录里，3 个延期未被发现', status: 'problem' },
                    { id: 'before2', label: '传统模式·第2周', description: '孙总手动催办 15 次，团队抱怨被微管', status: 'problem' },
                    { id: 'before3', label: '传统模式·第4周', description: '2 个工地延期交付，客户投诉，赔偿违约金', status: 'critical' },
                    { id: 'after1', label: 'AI 模式·第1周', description: 'Agent 自动识别 47 条承诺，零遗漏', status: 'success' },
                    { id: 'after2', label: 'AI 模式·第2周', description: 'Agent 自动催办 23 次，孙总只处理 3 个需决策的问题', status: 'success' },
                    { id: 'after3', label: 'AI 模式·第4周', description: '8 个工地全部按期交付，零投诉', status: 'success' },
                ],
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '拖拽时间线，看看传统管理 vs AI 管理的差异。' },
                { speaker: '系统', avatar: 'alert', text: '对比两种模式在同一个月内的项目效果。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '核心差异不在于 AI 多做了什么，而在于它「不会遗漏」。人会忘，AI 不会。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '很多项目延期不是因为能力不行，是因为「忘了催」。AI 消灭了人为疏忽。' },
                { speaker: '案例', avatar: 'case', text: '孙总的数据：工期延误率从 45% 降到 8%。客户满意度从 72 分升到 95 分。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI 不替你吵架，但它帮你终结扯皮。用证据说话，比拍桌子有效 100 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这种 Agent 不只适用于装修——任何多方协作的场景都能用：广告项目、软件开发、活动策划。' },
            ],
        },
        {
            id: 'l15-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第三个工坊完成。OpenClaw 指挥官的价值：' },
                { speaker: '系统', avatar: 'alert', text: '三个核心：① 承诺自动化记录 ② 到期自动催办 ③ 证据链自动生成。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这是 AI Agent 的典型应用——它不只是聊天机器人，它能主动行动。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: 'AI Agent 和普通 AI 的区别：普通 AI 回答问题，Agent 主动解决问题。这是未来最重要的能力分界线。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个工坊：AI 内容矩阵。一个人管 5 个平台的全域营销。' },
                { speaker: '系统', avatar: 'alert', text: '第十五课完成。工坊三「OpenClaw 指挥官」结业。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson16: LessonData = {
    id: 16, title: 'AI 内容矩阵', subtitle: 'Workshop: Content Matrix',
    module: '模块四 · 项目工坊', icon: 'pen-tool',
    scenes: [
        {
            id: 'l16-pain', bg: 'social',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第四个工坊：搭建 AI 内容矩阵。一个人做全域营销。' },
                { speaker: '案例', avatar: 'case', text: '赵总的珠宝品牌要做全域营销：抖音、小红书、公众号、视频号、知乎——5 个平台 5 种调性。' },
                { speaker: '案例', avatar: 'case', text: '传统做法：文案 + 运营 + 剪辑 = 3 人团队，年薪 80 万。还经常出现内容断更。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '问题的本质不是人不够——是工作重复度太高。同一个卖点要改写 5 种风格，这不就是 AI 最擅长的事？' },
                { speaker: '系统', avatar: 'alert', text: 'AI 内容矩阵的核心思路：一个卖点 → 裂变 5 种平台内容 → 自动配图 → 自动排期发布。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这是把「内容生产」从手工作坊变成工厂流水线。产出提升 10 倍，成本降低 90%。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '关键不只是写得快——是写得「对」。每个平台的调性、字数、格式都有讲究。' },
            ],
        },
        {
            id: 'l16-solution', bg: 'demo',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '怎么做到「一个卖点裂变 5 个平台」？秘诀在 Prompt 模板。' },
                { speaker: '系统', avatar: 'alert', text: '小红书 Prompt：「你是小红书博主，风格种草安利，用口语化表达，500 字以内，加 emoji，写 XX 的使用体验」。' },
                { speaker: '系统', avatar: 'alert', text: '抖音 Prompt：「写一条抖音短视频脚本，15 秒，开头 3 秒设悬念，节奏快，口播风格」。' },
                { speaker: '系统', avatar: 'alert', text: '公众号 Prompt：「写一篇 1500 字深度文章，理性风格，有数据支撑，标题要有 SEO 关键词」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '同样的产品卖点「手工镶嵌，独一无二」，在三个平台变成了三种完全不同的表达。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而且内容配图也可以 AI 生成——不需要拍照，用 Midjourney 直接出图。' },
                { speaker: '案例', avatar: 'case', text: '赵总现在的工作流：周一定卖点 → AI 批量生成 5 平台内容 → 人工审核 10 分钟 → 排期发布。全程 1 小时。' },
            ],
        },
        {
            id: 'l16-interactive', bg: 'studio', game: 'prompt-workshop',
            gameProps: {
                title: '全域内容 Prompt 工坊',
                scenario: '你的产品是一款手工镶嵌翡翠吊坠，核心卖点是「每一颗翡翠都有独一无二的纹路」。请为小红书平台撰写一条 Prompt。',
                examplePrompt: '你是一位小红书珠宝博主，风格是真实种草。用口语化风格写一篇 400 字分享帖，关于手工镶嵌翡翠吊坠「每颗纹路独一无二」的卖点，加入个人体验感受，适当使用 emoji，结尾加 3 个相关标签。',
                tips: ['指定平台角色', '明确风格（种草/理性/悬念）', '控制字数', '要求格式（emoji/标签/CTA）'],
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '来练习：同一个卖点，怎么写出不同平台的 Prompt？' },
                { speaker: '系统', avatar: 'alert', text: '关键要素：角色 + 平台风格 + 字数 + 格式要求 + CTA（行动号召）。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '好的 Prompt 和好的公司 brief 一样——越具体，输出质量越高。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你甚至可以把 Prompt 做成模板，以后换一个卖点就能批量生产。' },
                { speaker: '案例', avatar: 'case', text: '赵总积累了 20 个 Prompt 模板（5 平台 × 4 种内容类型）。现在新产品上线，1 小时铺满全网。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '月产出从 20 篇→200 篇。流量成本下降 80%。关键词覆盖率提升 5 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '一人管 5 平台矩阵。这不是科幻，这是现在进行时。' },
            ],
        },
        {
            id: 'l16-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第四个工坊完成。AI 内容矩阵的核心：' },
                { speaker: '系统', avatar: 'alert', text: '① 一个卖点裂变多平台 ② Prompt 模板化生产 ③ AI 配图+排期自动化。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '适用对象：任何需要做内容营销的企业。电商、教培、餐饮、美业……都逃不过内容战争。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个工坊：AI 经营分析。教你用自然语言跟数据库对话。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '不需要学 SQL，不需要看 Excel。直接问：「为什么昨天亏了？」AI 告诉你答案。' },
                { speaker: '系统', avatar: 'alert', text: '第十六课完成。工坊四「AI 内容矩阵」结业。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson17: LessonData = {
    id: 17, title: 'AI 经营分析', subtitle: 'Workshop: Business Analyst',
    module: '模块四 · 项目工坊', icon: 'trending-up',
    scenes: [
        {
            id: 'l17-pain', bg: 'data',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第五个工坊：AI 经营分析——用自然语言跟数据对话。' },
                { speaker: '案例', avatar: 'case', text: '李总每次分析数据的流程：① 找 IT 导数据 → ② 打开 Excel → ③ 建透视表 → ④ 画图 → ⑤ 做结论。全程 2 天。' },
                { speaker: '案例', avatar: 'case', text: '更痛的是：分析完了才发现数据有问题，要重来。或者做了分析才发现自己问错了问题。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '传统数据分析的最大问题不是技术门槛——是反馈太慢。你提一个问题要等 2 天才有答案。' },
                { speaker: '系统', avatar: 'alert', text: 'AI 经营分析的核心价值：把数据分析从「IT 工程」变成「对话」。你问，AI 答。3 秒见结果。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '不需要学 SQL、不需要建模型、不需要画图表。直接说人话。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '「为什么昨天亏了？」「哪个产品利润最高？」「预测下个月营收」——直接问就行。' },
            ],
        },
        {
            id: 'l17-solution', bg: 'dashboard',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '技术上怎么实现？Text2SQL + 可视化。' },
                { speaker: '系统', avatar: 'alert', text: 'Text2SQL：你说自然语言 → AI 翻译成 SQL 查询 → 数据库返回结果 → AI 用人话解读给你。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '整个过程你完全感受不到 SQL 的存在。就像你不需要懂引擎才能开车。' },
                { speaker: '案例', avatar: 'case', text: '李总的对话实录：「对比上月，哪 3 家店毛利下降最多？」' },
                { speaker: '案例', avatar: 'case', text: 'AI 回答：「回龙观店 -8%（食材成本上升）、望京店 -5%（客流下降）、通州店 -3%（打折促销力度过大）。建议重点关注回龙观店的供应商报价。」' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '注意：AI 不只给你数据——它给你原因和建议。这是传统 BI 做不到的。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '从「我知道发生了什么」升级到「我知道为什么发生+下一步该怎么做」。' },
            ],
        },
        {
            id: 'l17-interactive', bg: 'office', game: 'decision-matrix',
            gameProps: {
                title: '数据分析工具选型',
                criteria: ['学习门槛低', '实时分析', '自然语言交互', '成本可控', '自定义报表'],
                options: [
                    { name: '传统 BI（Tableau/PowerBI）', scores: [3, 6, 2, 5, 9], description: '功能强大但门槛高' },
                    { name: 'AI 对话分析', scores: [9, 9, 10, 8, 6], description: '零门槛实时分析' },
                    { name: 'Excel 手动分析', scores: [7, 2, 1, 10, 7], description: '免费但极慢' },
                ],
                weights: [0.3, 0.25, 0.2, 0.15, 0.1],
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '帮李总选工具：传统 BI、AI 对话分析、还是继续用 Excel？' },
                { speaker: '系统', avatar: 'alert', text: '从五个维度评分：学习门槛、实时性、自然语言交互、成本、自定义能力。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '对大部分中小企业来说，AI 对话分析是最优解。零门槛、实时、成本低。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '大企业可以用 Tableau + AI 对话双模式。兼顾深度定制和快速查询。' },
                { speaker: '案例', avatar: 'case', text: '李总的效率提升：数据分析从 2 天→3 秒。每周多出 8 小时做战略思考。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '老板最稀缺的资源是时间。AI 帮你从数据搬运工变成决策指挥官。' },
            ],
        },
        {
            id: 'l17-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '第五个工坊完成。AI 经营分析的核心：' },
                { speaker: '系统', avatar: 'alert', text: '① 自然语言 → SQL（零门槛分析）② AI 自动解读原因 ③ 给出可行动建议。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '数据分析民主化——不再是技术人员的专属技能，而是每个老板都能用的日常工具。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '还剩最后一个工坊——销售供应链闭环。也是整个模块四的收官之作。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '从生产到销售的完整链条，全部用 AI 打通。' },
                { speaker: '系统', avatar: 'alert', text: '第十七课完成。工坊五「AI 经营分析」结业。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson18: LessonData = {
    id: 18, title: '销售供应链闭环', subtitle: 'Workshop: Sales & Supply',
    module: '模块四 · 项目工坊', icon: 'link',
    scenes: [
        {
            id: 'l18-pain', bg: 'factory',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '最后一个工坊：帮王总打通销售到供应链的全链条。' },
                { speaker: '案例', avatar: 'case', text: '王总的食品厂有两个部门最头疼：销售部说「有单没货」，生产部说「有货没单」。' },
                { speaker: '案例', avatar: 'case', text: '销售不知道产能，乱接单。生产不知道订单，盲目排产。两个部门像隔了一堵墙。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是典型的「产销脱节」。根源是信息不透明——两个部门看不到彼此的数据。' },
                { speaker: '系统', avatar: 'alert', text: '产销脱节的代价：库存积压（多生产的卖不掉）+ 交期违约（来单了却产不出来）= 双重亏损。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '解决方案不是多开会——是用 AI 打通数据墙，让销售和生产共享实时信息。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这是整门课最后一个工坊，也是最综合的一个——用到了前面所有的方法论。' },
            ],
        },
        {
            id: 'l18-solution', bg: 'network',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '用 MCP 把 ERP、CRM、排产系统全部打通。一套数据驱动两个部门。' },
                { speaker: '系统', avatar: 'alert', text: '① 销售端：AI 实时显示产能。销售接单前就知道「这个单能不能按时交」。' },
                { speaker: '系统', avatar: 'alert', text: '② 生产端：AI 实时同步订单。产线知道「下周要交什么」，提前备料备人。' },
                { speaker: '系统', avatar: 'alert', text: '③ 智能调度：AI 自动匹配订单和产能。产线空了，AI 通知销售：「A 线下周有空，重点推这 3 款」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '最精彩的功能：AI 还会给销售发提成激励。「下周 A 线空闲产能 200 箱，推动指定 SKU 提成翻倍。」' },
                { speaker: '案例', avatar: 'case', text: '效果量化：库存周转天数从 45 天降到 22 天，交期达标率从 78% 升到 96%。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '信息透明带来的效率提升，远超任何管理手段。数据墙推倒，两个部门变成一个团队。' },
            ],
        },
        {
            id: 'l18-interactive', bg: 'charts', game: 'roi-calculator',
            gameProps: {
                title: '产销协同 ROI 计算器',
                inputs: [
                    { id: 'inventory_cost', label: '月平均库存成本', default: 200000, unit: '元' },
                    { id: 'turnover_improvement', label: '周转率提升比例', default: 50, unit: '%' },
                    { id: 'penalty_cost', label: '月违约赔偿成本', default: 30000, unit: '元' },
                    { id: 'penalty_reduction', label: '违约减少比例', default: 80, unit: '%' },
                ],
                formula: '(inventory_cost * turnover_improvement / 100 + penalty_cost * penalty_reduction / 100) * 12',
                resultLabel: '年节省成本',
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '算一下：打通产销链条能省多少钱？' },
                { speaker: '系统', avatar: 'alert', text: '两个维度：库存成本节省 + 违约赔偿减少。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '大部分工厂老板算完这笔账都很震惊——浪费的钱比想象中多得多。' },
                { speaker: '案例', avatar: 'case', text: '王总的真实数据：年节省库存成本 120 万 + 年减少违约赔偿 29 万 = 年省 149 万。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '而整套 AI 系统的搭建+运维成本：年 5 万。ROI 接近 30 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这就是为什么说 AI 不是成本开支——它是投资。而且是回报率极高的投资。' },
            ],
        },
        {
            id: 'l18-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '模块四全部 6 个工坊完成！来做一个总回顾。' },
                { speaker: '系统', avatar: 'alert', text: '6 个工坊 6 大武器：① 图片加工厂 ② 标书工匠 ③ OpenClaw 指挥官 ④ 内容矩阵 ⑤ 经营分析 ⑥ 产销闭环。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '每个工坊都是独立可落地的方案。你不需要全部用——选最匹配你行业痛点的 1-2 个先做。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一个模块是最终章——「战略升维」。教你回到公司后，如何系统性地落地 AI 转型。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '学了方法论、搭了项目、做了工坊。最后一步：变成战略。' },
                { speaker: '系统', avatar: 'alert', text: '模块四「项目工坊」全部完成。6 大工坊结业。准备进入模块五「战略升维」。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Module 5: 战略升维 (L19-L20) ───────────────────────────────

const lesson19: LessonData = {
    id: 19, title: '回公司怎么落地', subtitle: 'Implementation Strategy',
    module: '模块五 · 战略升维', icon: 'flag',
    scenes: [
        {
            id: 'l19-pain', bg: 'office',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '很多老板学完 AI 课程回到公司，发现落不了地。为什么？' },
                { speaker: '案例', avatar: 'case', text: '「团队不配合」「员工觉得 AI 会淘汰他们」「不知道从哪里开始」「试了一下没效果就放弃了」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这些问题的根源只有一个：你缺一个系统化的落地路径。学了 18 课的方法论，现在需要「落地手册」。' },
                { speaker: '系统', avatar: 'alert', text: '四步落地法：审计→评估→试点→推广。每一步都有明确的动作和检查标准。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '上来就搞全公司 AI 转型的，99% 会失败。正确的方式是从一个小切口开始。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '这节课教你的不是技术——是变革管理。' },
            ],
        },
        {
            id: 'l19-method', bg: 'blueprint',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '四步走，一步步来。' },
                { speaker: '系统', avatar: 'alert', text: '第 1 步·审计：列出公司所有重复低效的工作。哪些岗位每天在做 Ctrl+C、Ctrl+V？哪些报表是手动拼的？' },
                { speaker: '系统', avatar: 'alert', text: '第 2 步·评估：在审计出来的痛点中，筛选 AI 能解决的。标准：① 重复度高 ② 有数据 ③ 效果可量化。' },
                { speaker: '系统', avatar: 'alert', text: '第 3 步·试点：选一个部门、一个场景先跑通。别贪多。用 2 周跑出可量化的结果。' },
                { speaker: '系统', avatar: 'alert', text: '第 4 步·推广：用试点的成果说服其他部门。数据说话比画饼有效 100 倍。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '关键心法：不要讲「AI 多厉害」——讲「这个月省了 XX 万」。老板的语言是数字，不是技术。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '如果你就是老板：不要问「AI 能做什么」——问「我公司最痛的问题是什么，AI 能不能解？」' },
            ],
        },
        {
            id: 'l19-interactive', bg: 'demo', game: 'decision-matrix',
            gameProps: {
                title: 'AI 落地优先级评估',
                criteria: ['重复度高', '数据已有', '效果可量化', '团队配合度', '投入产出比'],
                options: [
                    { name: '客服自动化', scores: [9, 8, 9, 7, 9], description: '最容易起步，效果最快' },
                    { name: '数据看板', scores: [7, 6, 8, 5, 7], description: '需要数据基础设施' },
                    { name: '全面 AI 转型', scores: [5, 3, 4, 2, 3], description: '风险最高，不适合起步' },
                ],
                weights: [0.25, 0.2, 0.25, 0.15, 0.15],
            },
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '用决策矩阵帮你选：回公司后第一个 AI 项目做什么？' },
                { speaker: '系统', avatar: 'alert', text: '从五个维度评估。得分最高的场景就是你的「突破口」。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '99% 的企业第一个 AI 项目应该从客服或内容生产开始——门槛低、效果快、容易说服团队。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '千万不要一上来就搞「全面 AI 转型」。这跟减肥一样——不是所有人都适合直接跑马拉松。' },
                { speaker: '案例', avatar: 'case', text: '最佳实践：先用 AI 客服省下 3 个人的薪资→ 用省下的钱投入数据看板→ 逐步扩展到全链条。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '小步快跑、以战养战。每一个成功的小项目都是下一步的信心和预算来源。' },
            ],
        },
        {
            id: 'l19-wrap', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '落地手册已经给你了。四步走：审计→评估→试点→推广。' },
                { speaker: '系统', avatar: 'alert', text: '最重要的心法：先解决最痛的问题、先跑通一个闭环、先用数据说话。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '回去后第一件事：列一张「公司最重复的 10 项工作」清单。这就是你的 AI 机会图。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '下一课是最后一课——毕业路演。回顾整门课的精华，颁发你的 AI 指挥官证书。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你已经不是学员了。你是你所在行业里最懂 AI 的变革者。' },
                { speaker: '系统', avatar: 'alert', text: '第十九课完成。最后一课前的战略复盘完毕。', action: 'completeLesson' },
            ],
        },
    ],
};

const lesson20: LessonData = {
    id: 20, title: '毕业路演', subtitle: 'Graduation Day',
    module: '模块五 · 战略升维', icon: 'award',
    scenes: [
        {
            id: 'l20-review', bg: 'stage',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '恭喜你走到了最后一课。来回顾一下这 20 节课你走过的路。' },
                { speaker: '系统', avatar: 'alert', text: '模块一「认知重启」：你理解了 AI 是什么、为什么必须现在用、以及提示词的力量。' },
                { speaker: '系统', avatar: 'alert', text: '模块二「五层积木」：你掌握了搭建 AI 应用的方法论——需求→界面→API→技能→数据。' },
                { speaker: '系统', avatar: 'alert', text: '模块三「亲手造」：你亲手搭建了 4 个真实项目——官网、看板、客服、排产。' },
                { speaker: '系统', avatar: 'alert', text: '模块四「项目工坊」：你学会了 6 个行业武器——图片、标书、协作、内容、分析、供应链。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '模块五「战略升维」：你拿到了落地手册。从方法论到实战，再到战略。完整闭环。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '20 节课，从零到指挥官。这不是终点——这是你 AI 之旅的起点。' },
            ],
        },
        {
            id: 'l20-future', bg: 'cosmos',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '最后，分享三个判断未来趋势的关键认知。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第一：AI 的能力在指数级增长。今天做不到的事，6 个月后可能就能做了。保持关注。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第二：AI 不会淘汰人——但会用 AI 的人会淘汰不会用的人。这已经在发生。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '第三：最大的竞争优势不是技术——是速度。谁先用 AI 落地，谁就吃到最大的红利。' },
                { speaker: '系统', avatar: 'alert', text: '这不是未来学——这是正在发生的现实。你在这门课里看到的所有案例，都是 2024-2025 年的真实故事。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '你现在拥有的知识，比 95% 的企业管理者都多。问题只有一个：你行动了吗？' },
            ],
        },
        {
            id: 'l20-graduation', bg: 'summit',
            dialogue: [
                { speaker: 'AI 顾问', avatar: 'bot', text: '现在，我正式授予你「AI 指挥官」的称号。' },
                { speaker: '系统', avatar: 'alert', text: '🎖️ AI 指挥官·认证：你已掌握 5 层积木方法论、完成 4 个实战项目、学会 6 个行业工坊。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '今天你是学员，明天你是团队里最懂 AI 的变革者。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '去创造吧。不是因为 AI 厉害——是因为你厉害。AI 只是放大了你的能力。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '记住这门课的核心理念：未来属于那些能指挥 AI 的人。而你，已经是其中之一。' },
                { speaker: 'AI 顾问', avatar: 'bot', text: '感谢你的信任。期待听到你落地 AI 后的好消息。课程到此结束。🎓', action: 'completeCourse' },
            ],
        },
    ],
};

export const allLessons: LessonData[] = [
    lesson1, lesson2, lesson3, lesson4,
    lesson5, lesson6, lesson7, lesson8,
    lesson9, lesson10, lesson11, lesson12,
    lesson13, lesson14, lesson15, lesson16, lesson17, lesson18,
    lesson19, lesson20
];
