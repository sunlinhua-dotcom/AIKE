import { Suspense } from 'react';
import { lessonIndex } from '@/data/lessonIndex';
import HomeClient from '@/components/HomeClient';

const MODULES = [
  { name: '认知破局', desc: '打破你对 AI 的所有错误认知', icon: 'Brain', range: [1, 4], accent: 'var(--accent-gold)' },
  { name: '武器锻造', desc: '掌握 Prompt、API、UI 三大核心武器', icon: 'Swords', range: [5, 8], accent: 'var(--accent-teal)' },
  { name: '实战部署', desc: '在真实业务场景中部署 AI 系统', icon: 'Target', range: [9, 12], accent: '#8B5CF6' },
  { name: '组织升级', desc: '用 AI 重构团队，降本增效 10 倍', icon: 'Building2', range: [13, 18], accent: '#EC4899' },
  { name: '毕业演练', desc: '独立完成 AI 商业方案路演', icon: 'GraduationCap', range: [19, 20], accent: 'var(--accent-gold)' },
];

export default function HomePage() {
  // 在服务端预处理模块分组，只传序列化数据给客户端
  const modules = MODULES.map((mod, mi) => ({
    ...mod,
    index: mi,
    lessons: lessonIndex.filter(l => l.id >= mod.range[0] && l.id <= mod.range[1]),
  }));

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClient modules={modules} />
    </Suspense>
  );
}

function HomeLoading() {
  return (
    <div className="relative w-full h-full overflow-y-auto px-6 py-12 md:px-16 lg:px-24 md:py-20 max-w-7xl mx-auto">
      <div className="mb-24">
        <div className="h-4 w-48 bg-white/5 rounded mb-6" />
        <div className="h-16 w-96 bg-white/5 rounded mb-6" />
        <div className="h-6 w-80 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="glass rounded-xl p-4 h-24 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
