import { prisma } from "@/lib/prisma";
import { createJob } from "@/app/actions/admin";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  BookOpen,
  Star,
  Save,
} from "lucide-react";

export default async function NewJobPage() {
  // 1. Fetch courses to populate the "Required Course" dropdown
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/jobs"
          className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft size={18} /> Back to Recruitment Board
        </Link>
        <h1 className="text-3xl font-black text-slate-800">Post a New Job</h1>
        <p className="text-slate-500 font-medium">
          Create a new opening for students.
        </p>
      </div>

      <form
        action={createJob}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8"
      >
        {/* Section 1: Core Details */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg border-b border-slate-100 pb-2">
            <Briefcase size={20} className="text-[#0ea5e9]" /> Job Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Role Title
              </label>
              <div className="relative">
                <Briefcase
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="role"
                  type="text"
                  required
                  placeholder="e.g. Frontend Intern"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Company Name
              </label>
              <div className="relative">
                <Building
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="company"
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="location"
                  type="text"
                  required
                  placeholder="e.g. Remote / Dhaka"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Salary Range
              </label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="salary"
                  type="text"
                  required
                  placeholder="e.g. $500 - $1000 / mo"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Employment Type
            </label>
            <select
              name="type"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Section 2: Requirements & Config */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg border-b border-slate-100 pb-2">
            <Star size={20} className="text-amber-500" /> Requirements &
            Visibility
          </h3>

          {/* Prerequisite Course */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <BookOpen size={14} /> Prerequisite Course (Optional)
            </label>
            <p className="text-xs text-slate-400 font-medium mb-2">
              Students must complete this course before applying.
            </p>
            <select
              name="requiredCourse"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] transition-colors"
            >
              <option value="none">No specific course required</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Promoted Toggle */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Star size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-700">Promote this Job</h4>
              <p className="text-xs font-medium text-slate-500">
                Pin this job to the top of the board.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPromoted"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
        >
          <Save size={20} /> Publish Job Post
        </button>
      </form>
    </div>
  );
}
