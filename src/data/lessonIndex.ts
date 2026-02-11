/**
 * 课程轻量索引 — 首页 & Sidebar 专用
 * 只包含 id / title / subtitle / module / icon，不含对话内容
 * 避免在首页加载 167KB 的完整课程数据
 */

export interface LessonMeta {
    id: number;
    title: string;
    subtitle: string;
    module: string;
    icon: string;
}

export const lessonIndex: LessonMeta[] = [
    { id: 1, title: '被浪费的 ChatGPT', subtitle: 'The Wasted Potential', module: '模块一 · 认知破局', icon: 'trending-down' },
    { id: 2, title: 'AI 员工图鉴', subtitle: 'AI Employee Almanac', module: '模块一 · 认知破局', icon: 'users' },
    { id: 3, title: '说人话即编程', subtitle: 'Speak Human = Code', module: '模块一 · 认知破局', icon: 'terminal' },
    { id: 4, title: '划清 AI 幻觉', subtitle: 'Drawing the Line on Hallucination', module: '模块一 · 认知破局', icon: 'shield-alert' },
    { id: 5, title: '需求与界面', subtitle: 'Requirements & UI', module: '模块二 · 武器锻造', icon: 'wrench' },
    { id: 6, title: '接入大脑 API', subtitle: 'Plug in the Brain', module: '模块二 · 武器锻造', icon: 'code-2' },
    { id: 7, title: '技能包 Skills', subtitle: 'Power-Up Skills', module: '模块二 · 武器锻造', icon: 'blocks' },
    { id: 8, title: '数据连接 MCP', subtitle: 'MCP Data Connection', module: '模块二 · 武器锻造', icon: 'cable' },
    { id: 9, title: '智能品牌官网', subtitle: 'Smart Brand Website', module: '模块三 · 实战部署', icon: 'bar-chart-3' },
    { id: 10, title: '智能商业看板', subtitle: 'Smart Biz Dashboard', module: '模块三 · 实战部署', icon: 'file-text' },
    { id: 11, title: '7x24 AI 员工', subtitle: '24/7 AI Employee', module: '模块三 · 实战部署', icon: 'brain-circuit' },
    { id: 12, title: '智能排产系统', subtitle: 'Smart Scheduling', module: '模块三 · 实战部署', icon: 'rocket' },
    { id: 13, title: 'AI 图片加工厂', subtitle: 'AI Image Factory', module: '模块四 · 组织升级', icon: 'building-2' },
    { id: 14, title: 'AI 标书工匠', subtitle: 'AI Bid Writer', module: '模块四 · 组织升级', icon: 'wallet' },
    { id: 15, title: 'AI 内容流水线', subtitle: 'AI Content Pipeline', module: '模块四 · 组织升级', icon: 'folder-kanban' },
    { id: 16, title: 'AI 私域运营官', subtitle: 'AI Community OPs', module: '模块四 · 组织升级', icon: 'network' },
    { id: 17, title: 'AI 数据分析师', subtitle: 'AI Data Analyst', module: '模块四 · 组织升级', icon: 'graduation-cap' },
    { id: 18, title: 'AI 总裁驾驶舱', subtitle: 'AI CEO Cockpit', module: '模块四 · 组织升级', icon: 'trophy' },
    { id: 19, title: '毕业路演准备', subtitle: 'Final Prep', module: '模块五 · 毕业演练', icon: 'graduation-cap' },
    { id: 20, title: '毕业路演', subtitle: 'Grand Finale', module: '模块五 · 毕业演练', icon: 'trophy' },
];
