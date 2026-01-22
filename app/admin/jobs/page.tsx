import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Users, Eye } from "lucide-react";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    where: { isOpen: true },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Recruitment Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-sky-50 text-[#0ea5e9] rounded-xl"><Briefcase size={24} /></div>
                <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">Active</span>
             </div>
             <h3 className="font-bold text-lg text-slate-800 mb-1">{job.role}</h3>
             <p className="text-slate-500 text-sm font-medium mb-6">{job.company}</p>
             
             <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <Users size={16} /> {job._count.applications} Applicants
                </div>
                <Link href={`/admin/jobs/${job.id}`} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0ea5e9] transition">
                    <Eye size={16} /> View
                </Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}