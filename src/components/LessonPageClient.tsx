'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { allLessons } from '@/data/lessons';
import DialogueBox from '@/components/DialogueBox';
import GenericScene from '@/components/scenes/GenericScene';
import { useAudioManager, MuteButton } from '@/components/AudioManager';

// Dynamic imports for all scenes
const EntropyScene = dynamic(() => import('@/components/scenes/EntropyScene'), { ssr: false });
const DopamineScene = dynamic(() => import('@/components/scenes/DopamineScene'), { ssr: false });
const RuinsScene = dynamic(() => import('@/components/scenes/RuinsScene'), { ssr: false });
const PricingScene = dynamic(() => import('@/components/scenes/PricingScene'), { ssr: false });
const PromptBattleScene = dynamic(() => import('@/components/scenes/PromptBattleScene'), { ssr: false });
const PromptBuilderScene = dynamic(() => import('@/components/scenes/PromptBuilderScene'), { ssr: false });
const DunningKrugerScene = dynamic(() => import('@/components/scenes/DunningKrugerScene'), { ssr: false });
const FakeNewsScene = dynamic(() => import('@/components/scenes/FakeNewsScene'), { ssr: false });
const ElephantScene = dynamic(() => import('@/components/scenes/ElephantScene'), { ssr: false });
const OnionScene = dynamic(() => import('@/components/scenes/OnionScene'), { ssr: false });
const AgentBuilderScene = dynamic(() => import('@/components/scenes/AgentBuilderScene'), { ssr: false });
const DemoDayScene = dynamic(() => import('@/components/scenes/DemoDayScene'), { ssr: false });

interface LessonPageClientProps {
    lessonId: number;
}

// 生成对话图片路径
function getDialogueImagePath(lessonId: number, dialogueIndex: number): string {
    const paddedIndex = String(dialogueIndex + 1).padStart(2, '0');
    return `/images/lessons/l${lessonId}_${paddedIndex}.webp`;
}

export default function LessonPageClient({ lessonId }: LessonPageClientProps) {
    const router = useRouter();
    const { nextStep, setLesson, addProducerScore, completeLesson, reset } = useGameStore();
    const [sceneIndex, setSceneIndex] = useState(0);
    const [localDialogueIndex, setLocalDialogueIndex] = useState(0);

    // 双层配图交叉淡入淡出
    const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
    const [layerPaths, setLayerPaths] = useState<[string, string]>(['', '']);
    const [layerLoaded, setLayerLoaded] = useState<[boolean, boolean]>([false, false]);

    // 音频管理
    const { playSfx, toggleMute, isMuted, playBgmForLesson } = useAudioManager();

    const lesson = useMemo(() => allLessons.find(l => l.id === lessonId), [lessonId]);

    const scenes = lesson?.scenes ?? [];
    const currentScene = scenes[sceneIndex];
    const currentLine = currentScene?.dialogue[localDialogueIndex] ?? null;
    const totalDialogues = scenes.reduce((acc, s) => acc + s.dialogue.length, 0);
    const globalDialogueIndex = scenes.slice(0, sceneIndex).reduce((acc, s) => acc + s.dialogue.length, 0) + localDialogueIndex;
    const progress = totalDialogues > 0 ? ((globalDialogueIndex + 1) / totalDialogues) * 100 : 0;

    useEffect(() => {
        setLesson(lessonId);
        setSceneIndex(0);
        setLocalDialogueIndex(0);
        reset();
        playBgmForLesson(lessonId);
        // 初始化第一张图
        setLayerPaths([getDialogueImagePath(lessonId, 0), '']);
        setLayerLoaded([false, false]);
        setActiveLayer(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    const handleNext = useCallback(() => {
        if (!currentScene) return;

        const line = currentScene.dialogue[localDialogueIndex];

        // 播放点击音效
        playSfx('click');

        if (line?.action === 'completeLesson' || line?.action === 'completeCourse') {
            addProducerScore(10);
            completeLesson(lessonId);
            playSfx('levelup');
        }

        // 计算下一张图片路径
        let nextGlobalIndex = globalDialogueIndex;
        if (localDialogueIndex < currentScene.dialogue.length - 1) {
            nextGlobalIndex = globalDialogueIndex + 1;
        } else if (sceneIndex < scenes.length - 1) {
            nextGlobalIndex = scenes.slice(0, sceneIndex + 1).reduce((acc, s) => acc + s.dialogue.length, 0);
        }
        const nextPath = getDialogueImagePath(lessonId, nextGlobalIndex);

        // 交叉淡入淡出：将新图放到非活动层，加载后切换
        const nextLayer = activeLayer === 0 ? 1 : 0;
        setLayerPaths(prev => {
            const n = [...prev] as [string, string];
            n[nextLayer] = nextPath;
            return n;
        });
        setLayerLoaded(prev => {
            const n = [...prev] as [boolean, boolean];
            n[nextLayer] = false;
            return n;
        });
        setActiveLayer(nextLayer as 0 | 1);

        // 推进对话
        if (localDialogueIndex < currentScene.dialogue.length - 1) {
            setLocalDialogueIndex(prev => prev + 1);
            nextStep();
        } else if (sceneIndex < scenes.length - 1) {
            setSceneIndex(prev => prev + 1);
            setLocalDialogueIndex(0);
            nextStep();
            playSfx('whoosh');
        } else {
            // 已是最后一句对话，跳转下一课
            const nextLessonId = lessonId + 1;
            const nextLesson = allLessons.find(l => l.id === nextLessonId);
            if (nextLesson) {
                router.push(`/lesson/${nextLessonId}`);
            } else {
                router.push('/');
            }
        }
    }, [currentScene, localDialogueIndex, sceneIndex, scenes, nextStep, addProducerScore, completeLesson, lessonId, playSfx, globalDialogueIndex, activeLayer, router]);

    // 渲染场景背景（包含互动游戏）
    const renderScene = useCallback(() => {
        if (!currentScene) return null;
        const bg = currentScene.bg;
        const game = currentScene.game;

        switch (bg) {
            // L1 专属场景
            case 'entropy': return <EntropyScene />;
            case 'dopamine': return <DopamineScene />;
            case 'ruins': return <RuinsScene />;
            // L2-L10 互动游戏场景
            case 'pricing': return <PricingScene game={game} />;
            case 'promptBattle': return <PromptBattleScene game={game} />;
            case 'promptBuilder': return <PromptBuilderScene game={game} />;
            case 'dunningKruger': return <DunningKrugerScene game={game} />;
            case 'fakeNews': return <FakeNewsScene game={game} />;
            case 'elephant': return <ElephantScene game={game} />;
            case 'onion': return <OnionScene game={game} />;
            case 'agentBuilder': return <AgentBuilderScene game={game} />;
            case 'demoDay': return <DemoDayScene game={game} />;
            // 通用背景
            default: return <GenericScene bg={bg} title={lesson?.title ?? ''} icon={lesson?.icon ?? ''} />;
        }
    }, [currentScene, lesson?.title, lesson?.icon]);

    // 双层交叉淡入淡出图片渲染
    const renderImageLayer = useCallback((layerIndex: 0 | 1) => {
        const path = layerPaths[layerIndex];
        if (!path) return null;
        const isActive = layerIndex === activeLayer;
        return (
            <div
                key={`img-layer-${layerIndex}`}
                className="absolute inset-0 z-[2] transition-opacity duration-700 ease-in-out pointer-events-none"
                style={{ opacity: isActive && layerLoaded[layerIndex] ? 0.25 : 0 }}
            >
                <Image
                    src={path}
                    alt=""
                    fill
                    className="object-cover"
                    onLoad={() => setLayerLoaded(prev => {
                        const n = [...prev] as [boolean, boolean];
                        n[layerIndex] = true;
                        return n;
                    })}
                    onError={() => setLayerLoaded(prev => {
                        const n = [...prev] as [boolean, boolean];
                        n[layerIndex] = false;
                        return n;
                    })}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>
        );
    }, [layerPaths, activeLayer, layerLoaded]);

    if (!lesson) return <div className="text-white p-10">课程未找到</div>;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* 场景背景（最底层） */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentScene?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-0"
                >
                    {renderScene()}
                </motion.div>
            </AnimatePresence>

            {/* 配图叠加层（在场景之上） */}
            {renderImageLayer(0)}
            {renderImageLayer(1)}

            {/* 进度条 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/50 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* 课程信息 */}
            <div className="absolute top-2 left-12 md:top-4 md:left-4 z-40 flex items-center gap-2 md:gap-3">
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-2 py-1.5 md:px-4 md:py-2 border border-white/10">
                    <span className="text-base md:text-xl mr-1 md:mr-2">{lesson.icon}</span>
                    <span className="text-white font-bold text-xs md:text-base truncate max-w-[100px] md:max-w-none inline-block align-middle">L{lesson.id}: {lesson.title}</span>
                    <span className="hidden md:inline text-gray-500 ml-2 text-sm">{lesson.module}</span>
                </div>
            </div>

            {/* 静音按钮 */}
            <MuteButton isMuted={isMuted} onToggle={toggleMute} />

            {/* 对话框 */}
            <DialogueBox
                line={currentLine}
                onNext={handleNext}
                isLastDialogue={sceneIndex === scenes.length - 1 && localDialogueIndex === (currentScene?.dialogue.length ?? 1) - 1}
            />
        </div>
    );
}
