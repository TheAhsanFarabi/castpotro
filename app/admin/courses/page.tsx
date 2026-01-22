import { prisma } from "@/lib/prisma";
import { createCourse, deleteCourse } from "@/app/actions/admin";
import Link from "next/link";
import { Plus, Trash2, FolderOpen } from "lucide-react";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({ include: { _count: { select: { units: true } } } });

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Course Management</h1>

      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="font-bold text-lg mb-4">Add New Course</h2>
        <form action={createCourse} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
            <input name="title" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="e.g. Public Speaking" required />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <input name="description" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" placeholder="Short summary..." required />
          </div>
          <button className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-600 transition">
            <Plus size={20} /> Create
          </button>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-sky-100 text-[#0ea5e9] rounded-xl flex items-center justify-center mb-4">
                <FolderOpen size={24} />
              </div>
              <h3 className="font-bold text-xl text-slate-800">{course.title}</h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">{course.description}</p>
              <div className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg w-fit text-slate-500">
                {course._count.units} Units
              </div>
            </div>
            
            <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
              <Link href={`/admin/courses/${course.id}`} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-center text-sm font-bold hover:bg-slate-700">
                Manage Units
              </Link>
              <form action={deleteCourse.bind(null, course.id)}>
                <button className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100"><Trash2 size={20} /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}