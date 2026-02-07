import LessonPageClient from '@/components/LessonPageClient';
import { allLessons } from '@/data/lessons';

interface PageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return allLessons.map((lesson) => ({
        id: String(lesson.id),
    }));
}

export default async function LessonPage({ params }: PageProps) {
    const { id } = await params;
    const lessonId = parseInt(id, 10);

    return <LessonPageClient lessonId={lessonId} />;
}
