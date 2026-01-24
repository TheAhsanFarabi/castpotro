import { prisma } from "@/lib/prisma";
import { createLesson } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Plus, Video, FileText, ChevronRight, BrainCircuit, BookOpen } from "lucide-react";

export default async function UnitDetailsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string, unitId: string }> 
}) {
  const { courseId, unitId } = await params;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      course: true,
      lessons: {
        orderBy: { title: 'asc' },
        include: { questions: true } // Fetch questions count
      }
    }
  });

  if (!unit) return <div>Unit not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/courses/${courseId}`} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{unit.title}</h1>
            <p className="text-slate-500 font-medium">Unit in {unit.course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COL: Add Lesson (Simplified) --- */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
                <div className="flex items-center gap-2 mb-6 text-slate-700">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Plus size={20} /></div>
                    <h3 className="font-bold">Add Lesson</h3>
                </div>

                <form action={createLesson} className="space-y-4">
                    <input type="hidden" name="unitId" value={unitId} />
                    <input type="hidden" name="courseId" value={courseId} />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Lesson Title</label>
                        <input name="title" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-indigo-500" placeholder="e.g. Introduction to React" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Video URL (Optional)</label>
                        <input name="videoUrl" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-indigo-500" placeholder="https://youtube.com/..." />
                    </div>
                    
                    {/* REMOVED: Theory Textarea (Use the rich editor instead) */}

                    <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                        Create Lesson
                    </button>
                </form>
            </div>
        </div>

        {/* --- RIGHT COL: Existing Lessons --- */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-700 mb-2">Lessons ({unit.lessons.length})</h3>

            {unit.lessons.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                    No lessons created yet.
                </div>
            )}

            {unit.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400">
                                {lesson.videoUrl && (
                                    <span className="flex items-center gap-1"><Video size={12} /> Video</span>
                                )}
                                <span className="flex items-center gap-1"><BrainCircuit size={12} /> {lesson.questions.length} Questions</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                         <Link 
                            href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}?tab=theory`}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2"
                         >
                            <BookOpen size={14} /> Content
                         </Link>
                         <Link 
                            href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}?tab=quiz`}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 transition flex items-center gap-2"
                         >
                            <BrainCircuit size={14} /> Quiz
                         </Link>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}