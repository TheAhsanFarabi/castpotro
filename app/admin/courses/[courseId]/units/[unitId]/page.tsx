import { prisma } from "@/lib/prisma";
import { createLesson, deleteLesson } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, PlayCircle, BookOpen, HelpCircle } from "lucide-react";

export default async function UnitLessonsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string, unitId: string }> 
}) {
  // Await params
  const { courseId, unitId } = await params;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { lessons: true, course: true }
  });

  if (!unit) return <div>Unit not found</div>;

  return (
    <div>
      <Link href={`/admin/courses`} className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Back to Course
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{unit.title} <span className="text-slate-400">/ Lessons</span></h1>
      <p className="text-slate-500 mb-8">Manage lessons and their specific quizzes.</p>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-bold text-lg mb-4">Add New Lesson</h2>
        <form action={createLesson} className="flex flex-col gap-4">
          <input type="hidden" name="unitId" value={unitId} />
          <input type="hidden" name="courseId" value={courseId} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Lesson Title</label>
                <input name="title" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="e.g. Understanding Pitch" required />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Video URL (Optional)</label>
                <input name="videoUrl" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="YouTube Embed URL" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Theory Content</label>
            <textarea name="theory" rows={4} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm" placeholder="Write lesson content here... (Supports basic text)" required />
          </div>

          <button className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-sky-600 transition w-full">
            <Plus size={20} /> Add Lesson
          </button>
        </form>
      </div>

      {/* Lessons List */}
      <div className="grid gap-4">
        {unit.lessons.map(lesson => (
          <div key={lesson.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="bg-sky-50 text-[#0ea5e9] p-2 rounded-lg">
                        {lesson.videoUrl ? <PlayCircle size={24} /> : <BookOpen size={24} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">{lesson.title}</h3>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Lesson ID: {lesson.id.slice(-6)}</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* LINK TO QUIZ PAGE */}
                    <Link 
                        href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}`} 
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition border border-indigo-100 flex items-center gap-2"
                    >
                        <HelpCircle size={16} /> Manage Quiz
                    </Link>

                    <form action={deleteLesson.bind(null, lesson.id, unit.id, unit.courseId)}>
                        <button className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition">
                            <Trash2 size={20} />
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 font-medium line-clamp-2 border border-slate-100">
                {lesson.theory}
            </div>
          </div>
        ))}
        {unit.lessons.length === 0 && (
            <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                No lessons added yet.
            </div>
        )}
      </div>
    </div>
  );
}