import { prisma } from "@/lib/prisma";
import LearningClient from "../../LearningClient"; 

export default async function LearningPage({ params }: { params: Promise<{ courseId: string, unitId: string }> }) {
  // 1. Await params
  const { courseId, unitId: lessonId } = await params;

  // 2. Fetch Lesson
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { questions: true }
  });

  if (!lesson) return <div>Lesson not found.</div>;

  // 3. Pass courseId to Client
  return (
    <LearningClient 
      lesson={lesson} 
      questions={lesson.questions} 
      courseId={courseId} // <--- PASS THIS
    />
  );
}