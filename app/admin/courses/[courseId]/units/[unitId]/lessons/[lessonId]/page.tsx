import { prisma } from "@/lib/prisma";
import { createQuizQuestion, deleteQuizQuestion } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, HelpCircle, CheckCircle, PlayCircle, BookOpen } from "lucide-react";

export default async function LessonDetailsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string, unitId: string, lessonId: string }> 
}) {
  const { courseId, unitId, lessonId } = await params;

  // Fetch Lesson with its Questions
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: true
    }
  });

  if (!lesson) return <div>Lesson not found</div>;

  const currentPath = `/admin/courses/${courseId}/units/${unitId}/lessons/${lessonId}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/courses/${courseId}/units/${unitId}`} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                <span className="flex items-center gap-1"><PlayCircle size={14} /> Video: {lesson.videoUrl ? 'Linked' : 'None'}</span>
                <span className="flex items-center gap-1"><HelpCircle size={14} /> Questions: {lesson.questions.length}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COL: Add New Question --- */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
                <div className="flex items-center gap-2 mb-6 text-slate-700">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Plus size={20} /></div>
                    <h3 className="font-bold">Add Question</h3>
                </div>

                <form action={createQuizQuestion} className="space-y-4">
                    <input type="hidden" name="lessonId" value={lessonId} />
                    <input type="hidden" name="path" value={currentPath} />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Question</label>
                        <textarea name="question" required rows={3} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-indigo-500" placeholder="e.g. What does CPU stand for?" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">Options</label>
                        <input name="option0" required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" placeholder="Option A (Index 0)" />
                        <input name="option1" required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" placeholder="Option B (Index 1)" />
                        <input name="option2" required className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" placeholder="Option C (Index 2)" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Correct Answer</label>
                        <select name="correct" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold">
                            <option value="0">Option A</option>
                            <option value="1">Option B</option>
                            <option value="2">Option C</option>
                        </select>
                    </div>

                    <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                        Save Question
                    </button>
                </form>
            </div>
        </div>

        {/* --- RIGHT COL: Existing Questions --- */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-slate-700 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><HelpCircle size={20} /></div>
                <h3 className="font-bold">Existing Quiz ({lesson.questions.length})</h3>
            </div>

            {lesson.questions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                    No questions added yet.
                </div>
            )}

            {lesson.questions.map((q, i) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            <span className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0">
                                {i + 1}
                            </span>
                            <h4 className="font-bold text-slate-800 pt-1">{q.question}</h4>
                        </div>
                        <form action={deleteQuizQuestion.bind(null, q.id, currentPath)}>
                            <button className="text-slate-300 hover:text-red-500 p-2 transition">
                                <Trash2 size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-11">
                        {(q.options as string[]).map((opt, optIndex) => (
                            <div 
                                key={optIndex} 
                                className={`p-3 rounded-xl text-sm font-medium border-2 flex items-center gap-2 ${
                                    optIndex === q.correct 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                    : 'bg-white border-slate-100 text-slate-500'
                                }`}
                            >
                                {optIndex === q.correct ? <CheckCircle size={16} /> : <div className="w-4" />}
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}