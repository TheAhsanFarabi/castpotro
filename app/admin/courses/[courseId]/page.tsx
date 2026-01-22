import { prisma } from "@/lib/prisma";
import { createUnit, deleteUnit } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// 1. Change type to Promise
export default async function CourseUnitsPage({ params }: { params: Promise<{ courseId: string }> }) {
  
  // 2. Await the params
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId }, // 3. Use the awaited variable
    include: { units: { orderBy: { order: 'asc' }, include: { _count: { select: { lessons: true } } } } }
  });

  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Back to Courses
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-800 mb-2">{course.title} <span className="text-slate-400">/ Units</span></h1>
      <p className="text-slate-500 mb-8">Manage the structure of this course.</p>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-bold text-lg mb-4">Add New Unit</h2>
        <form action={createUnit} className="flex gap-4 items-end">
          <input type="hidden" name="courseId" value={courseId} /> {/* Use awaited ID */}
          <div className="w-24 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Order</label>
            <input type="number" name="order" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" defaultValue={course.units.length + 1} required />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Unit Title</label>
            <input name="title" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="e.g. Intro to Voice" required />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <input name="description" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="Unit summary..." required />
          </div>
          <button className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-600 transition">
            <Plus size={20} /> Add
          </button>
        </form>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {course.units.map(unit => (
          <div key={unit.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-6">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">
              {unit.order}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800">{unit.title}</h3>
              <p className="text-slate-500 text-sm">{unit.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-lg">
                {unit._count.lessons} Lessons
              </span>
              {/* Use awaited courseId in links */}
              <Link href={`/admin/courses/${courseId}/units/${unit.id}`} className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition">
                Manage Lessons
              </Link>
              <form action={deleteUnit.bind(null, unit.id, courseId)}>
                <button className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={20} /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}