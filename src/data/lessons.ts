import { DialogueLine } from '@/store/gameStore';

export interface LessonScene {
    id: string;
    bg: 'intro' | 'entropy' | 'dopamine' | 'ruins' | 'dark' | 'cyber' | 'lab' | 'market' | 'arena' | 'forge' | 'summit';
    dialogue: DialogueLine[];
}

export interface LessonData {
    id: number;
    title: string;
    subtitle: string;
    module: string;
    icon: string;
    scenes: LessonScene[];
}

// ─── Lesson 1: 时间的真相 ───────────────────────────────
const lesson1: LessonData = {
    id: 1, title: '时间的真相', subtitle: 'The Truth About Time',
    module: '模块一 · 时间觉醒', icon: '⏳',
    scenes: [
        {
            id: 'l1-intro', bg: 'intro',
            dialogue: [
                { speaker: '系统', avatar: '🤖', text: '检测到时空波动。正在连接 2024 年的节点... 连接成功。' },
                { speaker: '小智', avatar: '🤖', text: '警报！警报！小米，快放下你手里的发光板（手机）！' },
                { speaker: '小米', avatar: '🧒', text: '哎呀小智，别吵。我再刷最后一个视频... 哈哈这个猫好搞笑。' },
                { speaker: '小智', avatar: '🤖', text: '这不是玩笑！看看你的房间！物理定律正在失效！' },
                { speaker: '系统', avatar: '⚠️', text: '警告：局部熵值（Entropy）超过临界点。物质结构开始瓦解。' },
                { speaker: '小米', avatar: '🧒', text: '等等... 我的书桌怎么在... 融化？我的书变成了沙子？！' },
            ],
        },
        {
            id: 'l1-entropy', bg: 'entropy',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '欢迎来到物理学的残酷真相：【熵增】。在这个宇宙里，混乱是自动的，秩序是昂贵的。', action: 'initEntropy' },
                { speaker: '小智', avatar: '🤖', text: '看屏幕中间。那些发光的粒子组成了你未来的理想形态 —— 一个充满能量的人。' },
                { speaker: '小智', avatar: '🤖', text: '大白话说就是：如果你啥都不做，你的未来就会像沙堡一样自己塌掉。不是因为有人破坏它，而是因为宇宙的规则就是这样 —— 不努力 = 自动变差。', action: 'startDecay' },
                { speaker: '小米', avatar: '🧒', text: '它在掉渣！每秒钟都在掉！我的未来在消失！' },
                { speaker: '小智', avatar: '🤖', text: '没错。这就是【热力学第二定律】。大白话：房间不收拾会越来越乱，身体不锻炼会越来越胖，知识不学习会越来越少。一切都在自动走向混乱。' },
                { speaker: '系统', avatar: '🔮', text: '【互动环节】点击左边的"刷短视频"看看会发生什么，或者点击"深度思考"来对抗熵增。', action: 'enableControls' },
            ],
        },
        {
            id: 'l1-dopamine', bg: 'dopamine',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '现在带你去一个更危险的地方 —— 多巴胺赌场。你的大脑最喜欢来这里。', action: 'initDopamine' },
                { speaker: '小智', avatar: '🤖', text: '大白话：多巴胺就是大脑里的"糖果小怪兽"。它不管一件事对你好不好，只管这件事爽不爽。刷视频很爽？那就疯狂分泌多巴胺，让你停不下来。' },
                { speaker: '系统', avatar: '🧠', text: '【任务】试着点击那些闪烁的金币（快乐）。观察下方的 DOPAMINE 和 SURVIVAL RATE 数据变化。' },
                { speaker: '小智', avatar: '🤖', text: '看到了吗？每次你获得"快乐"（多巴胺飙升），你的"生存率"就在下降。大白话：你在用注意力换快感，但注意力花完了，你就什么真本事都没学到。' },
                { speaker: '小智', avatar: '🤖', text: '更可怕的是【耐受性】。大白话：就像吃辣一样，第一次吃微辣就觉得辣，后来要吃变态辣才有感觉。刷视频也一样，越刷越无聊，但就是停不下来。' },
            ],
        },
        {
            id: 'l1-ruins', bg: 'ruins',
            dialogue: [
                { speaker: '小米', avatar: '🧒', text: '带我离开这里！那些数字太吓人了！', action: 'initRuins' },
                { speaker: '神秘人', avatar: '🧙‍♂️', text: '欢迎来到未来。如你所见，因为你刚刚在赌场耗尽了能量，这里是一片废墟。' },
                { speaker: '神秘人', avatar: '🧙‍♂️', text: '这就是【机会成本】。大白话：你选了A，就杀死了B、C、D所有其他选择。你选了1小时刷视频，就等于亲手杀死了1小时学画画、练钢琴、写代码的机会。' },
                { speaker: '神秘人', avatar: '🧙‍♂️', text: '想修复它吗？这就是交易。把你的"游戏手柄"扔进火炉。用现在的痛苦，换未来的秩序。', action: 'enableExchange' },
                { speaker: '系统', avatar: '⚖️', text: '【抉择】点击游戏手柄（🎮），将其献祭给未来。' },
                { speaker: '小米', avatar: '🧒', text: '（看着废墟中开出的花）我明白了。痛苦不是惩罚，痛苦是能量。' },
                { speaker: '小智', avatar: '🤖', text: '最后一个知识：【复利效应】。大白话：每天进步1%，一年后你会变成原来的37倍（1.01的365次方=37.78）。但每天退步1%，一年后你只剩0.03。' },
                { speaker: '小智', avatar: '🤖', text: '欢迎觉醒，生产者。第一课结束。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 2: 生产者转身 ───────────────────────────────
const lesson2: LessonData = {
    id: 2, title: '生产者转身', subtitle: 'The Producer Shift',
    module: '模块一 · 时间觉醒', icon: '🏭',
    scenes: [
        {
            id: 'l2-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '上一课你学到了时间的真相。今天我们要搞清楚一个更深层的问题：为什么有些人越来越富，有些人越来越穷？' },
                { speaker: '小智', avatar: '🤖', text: '答案就藏在两个字里：【消费者】和【生产者】。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：世界上只有两种人。一种人花钱买别人做的东西（消费者），一种人做东西卖给别人（生产者）。打游戏的是消费者，做游戏的是生产者。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l2-market', bg: 'market',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '欢迎来到价值交易所。这里展示了一个残酷的真相：【价格 ≠ 价值】。', action: 'initMarket' },
                { speaker: '小智', avatar: '🤖', text: '大白话：一杯星巴克咖啡卖38块，但咖啡豆的成本只要3块。那多出来的35块是什么？是品牌、是体验、是故事。这就是"附加价值"。' },
                { speaker: '系统', avatar: '📊', text: '【互动】在下方的交易模拟器中，尝试给不同的产品定价。看看消费者愿意为"创意"付多少钱。' },
                { speaker: '小智', avatar: '🤖', text: '【边际成本】大白话：画家画第一幅画要花10小时，但把它复制成1万张海报，每张只要1秒。这就是生产者的秘密武器 —— 一次创造，无限复制。' },
                { speaker: '小智', avatar: '🤖', text: '【睡后收入】大白话：你睡着了还在赚钱。怎么做到？写一本书、做一个App、拍一个视频课。你只做一次，但它可以被无限次购买。' },
            ],
        },
        {
            id: 'l2-transform', bg: 'cyber',
            dialogue: [
                { speaker: '神秘人', avatar: '🧙‍♂️', text: '看看这面镜子。左边是消费者的一天，右边是生产者的一天。', action: 'initMirror' },
                { speaker: '系统', avatar: '🪞', text: '消费者的一天：起床→刷手机→上学→回家→打游戏→刷视频→睡觉。循环。什么都没留下。' },
                { speaker: '系统', avatar: '🪞', text: '生产者的一天：起床→写日记→上学→回家→用AI做了个小工具→教会了同学一个技巧→记录今天的成长→睡觉。每天都在积累。' },
                { speaker: '小智', avatar: '🤖', text: '【注意力经济】大白话：如果一个App是免费的，那你就不是顾客，你是商品。抖音不收你的钱，但它收走了你的注意力，然后把你的注意力卖给广告商。' },
                { speaker: '小智', avatar: '🤖', text: '从今天起，问自己一个问题：我现在是在消费，还是在生产？', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 3: AI 不是魔法 ───────────────────────────────
const lesson3: LessonData = {
    id: 3, title: 'AI 不是魔法', subtitle: 'AI is Not Magic',
    module: '模块二 · 杠杆锻造', icon: '🔧',
    scenes: [
        {
            id: 'l3-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '很多人以为AI是万能的。今天我要告诉你一个真相：AI不是魔法，AI是杠杆。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：杠杆就是那个能让你用小力气撬动大石头的棍子。阿基米德说"给我一个支点，我能撬动地球"。AI就是你的数字杠杆。' },
                { speaker: '小智', avatar: '🤖', text: '但是！杠杆需要一个支点。你的支点是什么？是你的【认知】和【判断力】。如果你自己不懂，AI再强也帮不了你。垃圾进去，垃圾出来（Garbage In, Garbage Out）。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l3-lever', bg: 'lab',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '看这个实验：我让AI写一篇作文。', action: 'initLab' },
                { speaker: '系统', avatar: '🧪', text: '指令A："帮我写一篇作文"→ AI输出：一篇普通的、谁都能写的作文。分数：60分。' },
                { speaker: '系统', avatar: '🧪', text: '指令B："我是一个10岁的孩子，刚在海洋馆看到了巨型章鱼，我非常震撼。请用第一人称帮我写一篇300字的观察日记，要求有细节描写、情感变化和一个出人意料的结尾"→ AI输出：一篇生动、独特的满分作文。分数：95分。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：同样的AI，不同的人用，得到完全不同的结果。差别在哪里？在你的提问能力。这就是为什么说"提问即编程"。' },
                { speaker: '小智', avatar: '🤖', text: '【边际成本趋零】大白话：以前请一个翻译要花500块/小时。现在用AI翻译，1秒钟，0块钱。以前请画师画一张图要3天。现在用AI，3分钟。成本降到了几乎为零。' },
                { speaker: '小智', avatar: '🤖', text: '这意味着什么？意味着【会用AI的人】和【不会用AI的人】之间的差距，会越来越大。就像工业革命时，会用蒸汽机的工厂碾压了手工作坊。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 4: 提问的艺术 ───────────────────────────────
const lesson4: LessonData = {
    id: 4, title: '提问的艺术', subtitle: 'The Art of Prompting',
    module: '模块二 · 杠杆锻造', icon: '🎯',
    scenes: [
        {
            id: 'l4-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '上一课说了AI是杠杆。今天我们来锻造这根杠杆的关键部件：提问能力。' },
                { speaker: '小智', avatar: '🤖', text: '你知道吗？在Google工作的人，最重要的技能不是写代码，而是【提问】。因为你问对了问题，答案自然就出来了。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l4-arena', bg: 'arena',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '欢迎来到提示词竞技场！', action: 'initArena' },
                { speaker: '小智', avatar: '🤖', text: '【达克效应】大白话：为什么越不懂的人越觉得自己懂？因为他们不知道自己不知道什么。一个从没出过村子的人会觉得自己的村子就是全世界。' },
                { speaker: '系统', avatar: '⚔️', text: '【实战演练】下面有两个提示词。观察它们的区别，思考哪个能得到更好的结果。' },
                { speaker: '小智', avatar: '🤖', text: '好提示词公式：【角色 + 背景 + 任务 + 格式 + 限制】。大白话：就像你去餐厅点菜，不能只说"给我来点好吃的"，你得说"我想要一碗不辣的、加蛋的、少油的番茄牛肉面"。越具体，结果越好。' },
                { speaker: '小智', avatar: '🤖', text: '【元认知】大白话：就是"思考你是怎么思考的"。普通人直接问AI问题。高手先想：我应该怎么问，才能得到最好的答案？这就是元认知 —— 对自己思维方式的反思。' },
                { speaker: '小智', avatar: '🤖', text: '记住：AI的天花板，就是你提问能力的天花板。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 5: 拒绝平庸 ───────────────────────────────
const lesson5: LessonData = {
    id: 5, title: '拒绝平庸', subtitle: 'Refuse to be Average',
    module: '模块二 · 杠杆锻造', icon: '🏔️',
    scenes: [
        {
            id: 'l5-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '今天的课有点扎心。我们来聊聊：为什么大多数人注定平庸？' },
                { speaker: '小智', avatar: '🤖', text: '注意，我说的不是"笨"，而是"平庸"。平庸的意思是：做着和所有人一样的事情，得到和所有人一样的结果。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l5-dunning', bg: 'dark',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '【达克效应完整版】', action: 'initDunning' },
                { speaker: '小智', avatar: '🤖', text: '第一阶段："愚昧之巅"。大白话：刚学会一点皮毛就觉得自己是专家了。比如看了两个做饭视频就觉得自己能开餐厅。' },
                { speaker: '小智', avatar: '🤖', text: '第二阶段："绝望之谷"。大白话：真正深入学习后发现自己什么都不会，信心跌到谷底。大多数人在这里放弃了。' },
                { speaker: '小智', avatar: '🤖', text: '第三阶段："开悟之坡"。大白话：坚持过来的人开始真正理解，慢慢建立起真实的能力。自信也慢慢回来了，但这次是有底气的自信。' },
                { speaker: '小智', avatar: '🤖', text: '【幸存者偏差】大白话：你只看到成功的人，看不到失败的人。10000个创业者里9999个失败了，但新闻只报道那1个成功的，让你以为创业很容易。' },
                { speaker: '小智', avatar: '🤖', text: '【反共识思维】大白话：当所有人都往一个方向跑的时候，你要停下来想想：他们真的对吗？别人都在刷短视频，你不刷，这本身就是一种超级竞争力。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 6: 信息免疫力 ───────────────────────────────
const lesson6: LessonData = {
    id: 6, title: '信息免疫力', subtitle: 'Information Immunity',
    module: '模块二 · 杠杆锻造', icon: '🛡️',
    scenes: [
        {
            id: 'l6-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '在AI时代，最危险的不是不知道，而是被错误的信息欺骗还不自知。今天我们来打造你的信息免疫系统。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：就像身体有免疫系统来抵抗病毒，你的大脑也需要一个"信息免疫系统"来抵抗假信息、烂信息和有毒信息。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l6-lab', bg: 'lab',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '【确认偏误】大白话：你相信什么，就只会看到支持你观点的信息。如果你觉得猫比狗好，你的推荐算法就会不断给你推"猫比狗好"的内容，让你越来越坚定。但这不代表你是对的。', action: 'initLab' },
                { speaker: '小智', avatar: '🤖', text: '【信息茧房】大白话：算法把你包在了一个"信息气泡"里。你以为你看到了整个世界，其实你只看到了算法想让你看到的那个小角落。' },
                { speaker: '系统', avatar: '🔬', text: '【实验室】现在看这段文字。它看起来很有道理对吧？试着找出里面的逻辑漏洞。' },
                { speaker: '小智', avatar: '🤖', text: '【批判性三问法】看到任何信息，先问三个问题：①谁说的？（来源可靠吗？）②证据是什么？（有数据支持吗？）③他想让我做什么？（背后有什么目的？）' },
                { speaker: '小智', avatar: '🤖', text: '【AI幻觉】大白话：AI有时候会一本正经地胡说八道。它说的话听起来像真的，但可能完全是编的。所以永远不要100%相信AI的输出，要学会验证。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 7: 拆解大象 ───────────────────────────────
const lesson7: LessonData = {
    id: 7, title: '拆解大象', subtitle: 'Breaking Down Elephants',
    module: '模块三 · 价值创造', icon: '🧩',
    scenes: [
        {
            id: 'l7-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '恭喜你进入第三模块——价值创造。从现在开始，你不再是学生，你是一个创造者。' },
                { speaker: '小智', avatar: '🤖', text: '今天学一个所有程序员、设计师、CEO都在用的思维方式：【模块化思维】。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：怎么吃掉一头大象？答案是一口一口吃。把一个大到吓人的问题，拆成一个个小到不怕的子问题。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l7-forge', bg: 'forge',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '看这个例子：老师让你做一个"班级新闻网站"，你觉得好难，不知道从哪开始。', action: 'initForge' },
                { speaker: '系统', avatar: '🧩', text: '拆解过程：班级新闻网站 → ①新闻列表页面 ②单篇新闻页面 ③发布新闻功能 ④评论功能。每个子问题再拆：新闻列表 → 标题 + 图片 + 日期 + 作者。' },
                { speaker: '小智', avatar: '🤖', text: '大白话就是【乐高积木】思维。你不是在造一个城堡，你是在拼一块一块的积木。每块积木都很小，都能单独完成。拼在一起就是个城堡。' },
                { speaker: '小智', avatar: '🤖', text: '【MECE原则】大白话：拆的时候要做到"不重叠、不遗漏"。就像切披萨，每一刀都要切到底，而且不能切重复的地方。' },
                { speaker: '小智', avatar: '🤖', text: '现在你知道了为什么程序员写代码要分成一个个"函数"和"组件"了吧？因为他们在用模块化思维拆解大象。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 8: 第一性原理 ───────────────────────────────
const lesson8: LessonData = {
    id: 8, title: '第一性原理', subtitle: 'First Principles',
    module: '模块三 · 价值创造', icon: '💎',
    scenes: [
        {
            id: 'l8-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '今天学习马斯克最推崇的思维方式：【第一性原理】。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：别人怎么做不重要，重要的是回到事情最根本的道理。就像剥洋葱一样，一层一层剥，直到找到最核心的那个东西。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l8-example', bg: 'lab',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '经典案例：2005年，所有人都觉得电池很贵，不可能做便宜的电动车。', action: 'initLab' },
                { speaker: '小智', avatar: '🤖', text: '类比思维（大多数人）："电池一直很贵，所以以后也会很贵。电动车没戏。"' },
                { speaker: '小智', avatar: '🤖', text: '第一性原理（马斯克）："电池是由什么组成的？镍、钴、锂、碳等原材料。这些原材料的价格是多少？在市场上买只要电池价格的1/10。那问题出在哪里？在制造方式上。"' },
                { speaker: '小智', avatar: '🤖', text: '大白话：所有人都说"不可能"的时候，不要跟着说"不可能"。回到最基本的事实，重新想一遍。也许只是方法不对，不是方向不对。' },
                { speaker: '小智', avatar: '🤖', text: '【思维实验】如果你要帮学校食堂解决"排队太长"的问题，用第一性原理会怎么想？', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 9: 打造AI员工 ───────────────────────────────
const lesson9: LessonData = {
    id: 9, title: '打造AI员工', subtitle: 'Build Your AI Agent',
    module: '模块三 · 价值创造', icon: '🤖',
    scenes: [
        {
            id: 'l9-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '之前的课你学会了思维方式。现在，让我们用这些思维方式来做一件真正的事情：打造你的第一个AI员工。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：AI员工就是一个你训练出来的、能自动帮你完成某个任务的AI程序。它不会累，不会请假，7x24小时工作。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l9-build', bg: 'forge',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '步骤一：找到一个"痛点"。大白话：你或者你身边的人，有什么事情觉得很烦、很重复、很浪费时间？比如每天整理课堂笔记？比如给作文找错别字？', action: 'initForge' },
                { speaker: '小智', avatar: '🤖', text: '步骤二：设计"系统提示词"。这是AI员工的"工作手册"。你需要告诉它：你是谁、你的任务是什么、你要遵守什么规则、你的输出格式是什么。' },
                { speaker: '小智', avatar: '🤖', text: '步骤三：测试和迭代。大白话：做出来先试用，发现问题就改，改完再试，反复循环。没有人一次就能做到完美，连马斯克的火箭都炸了好多次。' },
                { speaker: '小智', avatar: '🤖', text: '【MVP思维】大白话：先做一个"最小可用版本"（Minimum Viable Product）。别想着一上来就做得完美，先做一个能用的，然后再慢慢改进。' },
                { speaker: '小智', avatar: '🤖', text: '你的第一个AI员工不需要很厉害。它只需要能帮你解决一个小问题。但从零到一的这一步，比从一到一百重要一万倍。', action: 'completeLesson' },
            ],
        },
    ],
};

// ─── Lesson 10: 产品发布会 ───────────────────────────────
const lesson10: LessonData = {
    id: 10, title: '产品发布会', subtitle: 'Demo Day',
    module: '模块三 · 价值创造', icon: '🎤',
    scenes: [
        {
            id: 'l10-intro', bg: 'intro',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '这是最后一课。也是最重要的一课。因为今天你要做的事情，99%的成年人都没做过：把你的作品展示给世界看。' },
                { speaker: '小智', avatar: '🤖', text: '大白话：做出东西只是成功的一半。另一半是让别人知道你做了什么、为什么做、它能帮谁解决什么问题。这叫【价值传达】。', action: 'triggerInteraction' },
            ],
        },
        {
            id: 'l10-summit', bg: 'summit',
            dialogue: [
                { speaker: '小智', avatar: '🤖', text: '产品发布会的三个要素：', action: 'initSummit' },
                { speaker: '小智', avatar: '🤖', text: '第一：【痛点故事】。大白话：不要上来就说"我做了个AI工具"，而是说"我发现我妈妈每天花2小时整理购物清单，很辛苦。所以我做了一个AI助手来帮她。"' },
                { speaker: '小智', avatar: '🤖', text: '第二：【现场演示】。大白话：不要只说你的东西有多好，直接打开让大家看。活的演示比100页PPT有说服力。' },
                { speaker: '小智', avatar: '🤖', text: '第三：【用户反馈】。大白话：让真正用过你产品的人说话。"我妈妈用了我的AI助手后，每天省下1小时。"这句话比你自己说100句都管用。' },
                { speaker: '小智', avatar: '🤖', text: '【成长型思维】大白话：这不是终点，这只是起点。你今天做的第一个产品可能很粗糙，但这不重要。重要的是你已经从消费者变成了生产者。你已经完成了最困难的那一步。' },
                { speaker: '小智', avatar: '🤖', text: '恭喜你完成了全部10节课。你现在拥有了同龄人中最稀缺的东西：时间意识、生产者思维和AI杠杆能力。去创造吧，未来的生产者。🚀', action: 'completeCourse' },
            ],
        },
    ],
};

export const allLessons: LessonData[] = [
    lesson1, lesson2, lesson3, lesson4, lesson5,
    lesson6, lesson7, lesson8, lesson9, lesson10,
];
