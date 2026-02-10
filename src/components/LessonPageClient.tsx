'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Volume2, VolumeX, CheckCircle, GraduationCap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { allLessons } from '@/data/lessons';
import { useAudioManager } from '@/components/AudioManager';

// ─── PRO MAX 商务级互动组件（动态导入）───
const DecisionMatrix = dynamic(() => import('@/components/games/DecisionMatrix'), { ssr: false });
const ROICalculator = dynamic(() => import('@/components/games/ROICalculator'), { ssr: false });
const PromptWorkshop = dynamic(() => import('@/components/games/PromptWorkshop'), { ssr: false });
const ArchitectureBuilder = dynamic(() => import('@/components/games/ArchitectureBuilder'), { ssr: false });
const CaseAnalyzer = dynamic(() => import('@/components/games/CaseAnalyzer'), { ssr: false });
const ModelComparator = dynamic(() => import('@/components/games/ModelComparator'), { ssr: false });
const TimelineExplorer = dynamic(() => import('@/components/games/TimelineExplorer'), { ssr: false });
const QuizChallenge = dynamic(() => import('@/components/games/QuizChallenge'), { ssr: false });
const ScenarioSimulator = dynamic(() => import('@/components/games/ScenarioSimulator'), { ssr: false });

interface LessonPageClientProps {
    lessonId: number;
}

// ─── 工具函数 ───

function getDialogueImagePath(lessonId: number, globalIndex: number): string {
    const paddedIndex = String(globalIndex + 1).padStart(2, '0');
    return `/images/lessons/l${lessonId}_${paddedIndex}.webp`;
}

/** 根据 speaker 确定幻灯片模板类型 */
function getSlideTemplate(speaker: string, avatar: string, hasGame?: boolean): 'narrative' | 'highlight' | 'interactive' {
    if (hasGame) return 'interactive';
    if (avatar === 'alert' || avatar === 'case' || speaker === '系统' || speaker === '案例') return 'highlight';
    return 'narrative';
}

/** speaker 对应的颜色 */
function getSpeakerAccent(speaker: string, avatar: string): string {
    if (avatar === 'alert' || speaker === '系统') return 'rgb(251, 191, 36)';
    if (avatar === 'case' || speaker === '案例') return 'var(--accent-teal, #5eead4)';
    return 'var(--accent-gold, #ca8a04)';
}

// ─── 背景粒子 ───
const PARTICLES = Array.from({ length: 20 }, (_, i) => {
    const golden = 0.618033988749895;
    return {
        left: ((i * golden + 0.1) % 1) * 100,
        top: ((i * golden + 0.7) % 1) * 100,
        duration: 4 + (i % 4) * 1.2,
        delay: (i % 6) * 0.5,
    };
});

// ═══════════════════════════════════════════════
//          PPT 幻灯片风格课程页面
// ═══════════════════════════════════════════════

export default function LessonPageClient({ lessonId }: LessonPageClientProps) {
    const router = useRouter();
    const { nextStep, setLesson, addProducerScore, completeLesson, reset } = useGameStore();
    const [sceneIndex, setSceneIndex] = useState(0);
    const [localDialogueIndex, setLocalDialogueIndex] = useState(0);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [completionState, setCompletionState] = useState<'none' | 'lesson' | 'course'>('none');

    const { playSfx, playSfxForContext, toggleMute, isMuted, playBgmForLesson } = useAudioManager();

    const lesson = useMemo(() => allLessons.find(l => l.id === lessonId), [lessonId]);
    const scenes = useMemo(() => lesson?.scenes ?? [], [lesson]);
    const currentScene = scenes[sceneIndex];
    const currentLine = currentScene?.dialogue[localDialogueIndex] ?? null;

    // 全局对话索引 & 进度
    const totalDialogues = useMemo(() => scenes.reduce((acc, s) => acc + s.dialogue.length, 0), [scenes]);
    const globalDialogueIndex = useMemo(() =>
        scenes.slice(0, sceneIndex).reduce((acc, s) => acc + s.dialogue.length, 0) + localDialogueIndex
        , [scenes, sceneIndex, localDialogueIndex]);
    const progress = totalDialogues > 0 ? ((globalDialogueIndex + 1) / totalDialogues) * 100 : 0;
    const isLastSlide = sceneIndex === scenes.length - 1 && localDialogueIndex === (currentScene?.dialogue.length ?? 1) - 1;
    const isFirstSlide = sceneIndex === 0 && localDialogueIndex === 0;

    // 图片路径
    const imagePath = useMemo(() => getDialogueImagePath(lessonId, globalDialogueIndex), [lessonId, globalDialogueIndex]);

    // 初始化
    useEffect(() => {
        setLesson(lessonId);
        setSceneIndex(0);
        setLocalDialogueIndex(0);
        setCompletionState('none');
        reset();
        playBgmForLesson(lessonId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    // 图片切换时重置加载状态
    useEffect(() => { setImgLoaded(false); }, [imagePath]);

    // ─── 导航逻辑 ───

    const goNext = useCallback(() => {
        if (!currentScene || completionState !== 'none') return;
        const line = currentScene.dialogue[localDialogueIndex];
        playSfxForContext('dialogue', lessonId, line?.avatar || 'bot');

        // 检查是否为完成动作
        if (line?.action === 'completeLesson') {
            addProducerScore(10);
            completeLesson(lessonId);
            playSfx('levelup');
            setCompletionState('lesson');
            // 2 秒后自动跳转下一课
            const nextLessonId = lessonId + 1;
            const nextLesson = allLessons.find(l => l.id === nextLessonId);
            setTimeout(() => {
                if (nextLesson) router.push(`/lesson/${nextLessonId}`);
                else router.push('/');
            }, 2000);
            return;
        }
        if (line?.action === 'completeCourse') {
            addProducerScore(10);
            completeLesson(lessonId);
            playSfx('levelup');
            setCompletionState('course');
            return; // 毕业卡片，不自动跳转
        }

        // 正常翻页
        if (localDialogueIndex < currentScene.dialogue.length - 1) {
            setLocalDialogueIndex(prev => prev + 1);
            nextStep();
        } else if (sceneIndex < scenes.length - 1) {
            setSceneIndex(prev => prev + 1);
            setLocalDialogueIndex(0);
            nextStep();
            playSfxForContext('whoosh', lessonId);
        }
    }, [currentScene, localDialogueIndex, sceneIndex, scenes, nextStep, addProducerScore, completeLesson, lessonId, playSfx, playSfxForContext, router, completionState]);

    const goPrev = useCallback(() => {
        if (localDialogueIndex > 0) {
            setLocalDialogueIndex(prev => prev - 1);
        } else if (sceneIndex > 0) {
            const prevScene = scenes[sceneIndex - 1];
            setSceneIndex(prev => prev - 1);
            setLocalDialogueIndex(prevScene.dialogue.length - 1);
        }
        playSfxForContext('click', lessonId);
    }, [localDialogueIndex, sceneIndex, scenes, playSfx, playSfxForContext, lessonId]);

    // 键盘导航
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                goNext();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                goPrev();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goNext, goPrev]);

    // ─── 互动组件渲染 ───

    const renderGame = useCallback(() => {
        if (!currentScene?.game) return null;
        const g = currentScene.game;
        const p = currentScene.gameProps ?? {};
        if (g === 'decision-matrix') return <DecisionMatrix {...p} />;
        if (g === 'roi-calculator') return <ROICalculator {...p} />;
        if (g === 'prompt-workshop') return <PromptWorkshop {...p} />;
        if (g === 'architecture-builder') return <ArchitectureBuilder {...p} />;
        if (g === 'case-analyzer') return <CaseAnalyzer {...p} />;
        if (g === 'model-comparator') return <ModelComparator {...p} />;
        if (g === 'timeline-explorer') return <TimelineExplorer {...p} />;
        if (g === 'quiz-challenge') return <QuizChallenge {...p} />;
        if (g === 'scenario-simulator') return <ScenarioSimulator {...p} />;
        return null;
    }, [currentScene]);

    if (!lesson) return <div className="text-white p-10">课程未找到</div>;
    if (!currentLine) return null;

    const isLastDialogueInScene = localDialogueIndex === (currentScene?.dialogue.length ?? 1) - 1;
    const showGame = !!(currentScene?.game && currentScene?.gameProps && isLastDialogueInScene);
    const template = getSlideTemplate(currentLine.speaker, currentLine.avatar, showGame);
    const accentColor = getSpeakerAccent(currentLine.speaker, currentLine.avatar);

    // ═══ PPT 幻灯片布局 ═══
    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col">

            {/* ─── 背景粒子 ─── */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {PARTICLES.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-[1px] h-[1px] bg-white/15 rounded-full"
                        style={{ left: `${p.left}%`, top: `${p.top}%` }}
                        animate={{ y: [0, -15, 0], opacity: [0, 0.4, 0] }}
                        transition={{ repeat: Infinity, duration: p.duration, delay: p.delay }}
                    />
                ))}
            </div>

            {/* ─── 顶部进度条 ─── */}
            <div className="relative h-[2px] bg-white/[0.04] z-30 flex-shrink-0">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-teal)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ boxShadow: '0 0 8px rgba(202, 138, 4, 0.4)' }}
                />
            </div>

            {/* ─── 顶部导航栏 ─── */}
            <div className="flex items-center justify-between px-4 md:px-8 py-3 flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-[var(--accent-gold)]" />
                    <span className="text-white/80 text-xs md:text-sm font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
                        L{lesson.id}: {lesson.title}
                    </span>
                    <span className="text-white/30 text-xs hidden md:inline">
                        {lesson.module}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-white/40 text-xs font-mono">
                        {globalDialogueIndex + 1} / {totalDialogues}
                    </span>
                    <button
                        onClick={toggleMute}
                        className="text-white/40 hover:text-white/80 transition-colors p-1"
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                </div>
            </div>

            {/* ─── 主内容区域 ─── */}
            <div className="flex-1 flex items-center justify-center z-10 px-4 md:px-12 lg:px-20 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`slide-${globalDialogueIndex}`}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="w-full max-w-6xl"
                    >
                        {/* ──── 模板A: 标准叙述（左图右文）──── */}
                        {template === 'narrative' && (
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-14">
                                {/* 左：配图 */}
                                <div className="w-full md:w-[45%] flex-shrink-0">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.06]"
                                        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(202,138,4,0.08)' }}>
                                        <Image
                                            src={imagePath}
                                            alt=""
                                            fill
                                            className={`object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                                            onLoad={() => setImgLoaded(true)}
                                            onError={() => setImgLoaded(false)}
                                        />
                                        {!imgLoaded && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white/10 border-t-[var(--accent-gold)] rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 右：文字 */}
                                <div className="w-full md:w-[55%] flex flex-col justify-center">
                                    <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-[1.8] tracking-wide"
                                        style={{ fontFamily: 'var(--font-body)', wordBreak: 'keep-all', overflowWrap: 'anywhere', textWrap: 'pretty' }}>
                                        {currentLine.text}
                                    </p>
                                    <div className="mt-4 md:mt-6 flex items-center gap-2">
                                        <div className="w-5 h-[1px]" style={{ background: accentColor }} />
                                        <span className="text-xs tracking-[0.15em] uppercase" style={{ color: accentColor, fontFamily: 'var(--font-heading)' }}>
                                            {currentLine.speaker}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ──── 模板B: 数据/警告卡片（全宽居中大字）──── */}
                        {template === 'highlight' && (
                            <div className="flex flex-col items-center px-4 md:px-8">
                                {/* 背景暗图 */}
                                <div className="absolute inset-0 z-0 pointer-events-none">
                                    <Image
                                        src={imagePath}
                                        alt=""
                                        fill
                                        className={`object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-[0.08]' : 'opacity-0'}`}
                                        onLoad={() => setImgLoaded(true)}
                                        onError={() => setImgLoaded(false)}
                                    />
                                </div>

                                {/* 内容卡片 */}
                                <div className="relative z-10 max-w-4xl w-full">
                                    {/* 角色标签 */}
                                    <div className="mb-4 md:mb-6 flex justify-start">
                                        <span
                                            className="px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase border"
                                            style={{
                                                color: accentColor,
                                                borderColor: `${accentColor}40`,
                                                background: `${accentColor}10`,
                                            }}
                                        >
                                            {currentLine.speaker}
                                        </span>
                                    </div>

                                    {/* 大字 */}
                                    <p className="text-white text-lg md:text-2xl lg:text-[28px] font-medium leading-relaxed md:leading-[1.8] tracking-wide text-left"
                                        style={{ fontFamily: 'var(--font-body)', wordBreak: 'keep-all', overflowWrap: 'anywhere', textWrap: 'pretty' }}>
                                        {currentLine.text}
                                    </p>

                                    {/* 装饰线 */}
                                    <div className="mt-6 md:mt-8 w-16 h-[2px] rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
                                </div>
                            </div>
                        )}

                        {/* ──── 模板C: 互动页 ──── */}
                        {template === 'interactive' && (
                            <div className="flex flex-col gap-4">
                                {/* 顶部说明文字 */}
                                <div className="text-center">
                                    <p className="text-white text-base md:text-xl leading-relaxed mb-2"
                                        style={{ fontFamily: 'var(--font-body)' }}>
                                        {currentLine.text}
                                    </p>
                                    <span className="text-xs" style={{ color: accentColor }}>
                                        — {currentLine.speaker}
                                    </span>
                                </div>
                                {/* 互动组件 */}
                                <div className="flex-1 min-h-[300px]">
                                    {renderGame()}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ─── 课程完成覆盖层 ─── */}
            <AnimatePresence>
                {completionState !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="text-center max-w-md px-8"
                        >
                            {completionState === 'lesson' ? (
                                <>
                                    <CheckCircle size={56} className="mx-auto mb-4 text-[var(--accent-gold)]" />
                                    <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                        ✅ 本课完成
                                    </h2>
                                    <p className="text-white/50 text-sm">即将进入下一课…</p>
                                    <div className="mt-4 w-8 h-8 mx-auto border-2 border-white/10 border-t-[var(--accent-gold)] rounded-full animate-spin" />
                                </>
                            ) : (
                                <>
                                    <GraduationCap size={64} className="mx-auto mb-4 text-[var(--accent-gold)]" />
                                    <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                        🎓 恭喜毕业！
                                    </h2>
                                    <p className="text-white/60 text-base mb-6">全部 20 课已完成，你已获得「AI 指挥官」认证。</p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="px-6 py-3 rounded-xl bg-[var(--accent-gold)] text-black font-semibold text-sm hover:shadow-[0_0_24px_rgba(202,138,4,0.4)] transition-all"
                                    >
                                        返回首页
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── 底部导航栏 ─── */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 flex-shrink-0 z-20">
                {/* 左：上一页 */}
                <button
                    onClick={goPrev}
                    disabled={isFirstSlide}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${isFirstSlide
                        ? 'text-white/10 cursor-not-allowed'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                        }`}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden md:inline">上一页</span>
                </button>

                {/* 中：分页指示器 */}
                <div className="flex items-center gap-1.5">
                    {totalDialogues <= 15 ? (
                        /* 少于 15 页显示所有圆点 */
                        Array.from({ length: totalDialogues }, (_, i) => (
                            <div
                                key={i}
                                className={`rounded-full transition-all duration-300 ${i === globalDialogueIndex
                                    ? 'w-6 h-2 bg-[var(--accent-gold)]'
                                    : i < globalDialogueIndex
                                        ? 'w-2 h-2 bg-white/30'
                                        : 'w-2 h-2 bg-white/10'
                                    }`}
                            />
                        ))
                    ) : (
                        /* 多于 15 页显示压缩指示器 */
                        <>
                            {Array.from({ length: Math.min(7, totalDialogues) }, (_, i) => {
                                // 智能分页：显示当前附近的点
                                const half = 3;
                                let dotIndex: number;
                                if (globalDialogueIndex <= half) {
                                    dotIndex = i;
                                } else if (globalDialogueIndex >= totalDialogues - half - 1) {
                                    dotIndex = totalDialogues - 7 + i;
                                } else {
                                    dotIndex = globalDialogueIndex - half + i;
                                }
                                return (
                                    <div
                                        key={dotIndex}
                                        className={`rounded-full transition-all duration-300 ${dotIndex === globalDialogueIndex
                                            ? 'w-6 h-2 bg-[var(--accent-gold)]'
                                            : dotIndex < globalDialogueIndex
                                                ? 'w-2 h-2 bg-white/30'
                                                : 'w-2 h-2 bg-white/10'
                                            }`}
                                    />
                                );
                            })}
                        </>
                    )}
                </div>

                {/* 右：下一页 / 下一课 */}
                <button
                    onClick={goNext}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isLastSlide
                        ? 'bg-[var(--accent-gold)] text-black shadow-[0_0_16px_rgba(202,138,4,0.25)] hover:shadow-[0_0_24px_rgba(202,138,4,0.4)]'
                        : 'text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[var(--accent-gold)]/30'
                        }`}
                >
                    <span>{isLastSlide ? '下一课' : '下一页'}</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
