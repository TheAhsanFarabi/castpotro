import { prisma } from "@/lib/prisma";
import { hireApplicant, rejectApplicant } from "@/app/actions";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function JobApplicantsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!job) return <div>Job not found</div>;

  return (
    <div>
      <Link href="/admin/jobs" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Back to Jobs
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">{job.role}</h1>
            <p className="text-slate-500 font-medium">Applicants for {job.company}</p>
        </div>
        <div className="bg-sky-50 text-[#0ea5e9] px-4 py-2 rounded-xl font-bold">
            {job.applications.length} Candidates
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 font-bold text-slate-500 text-sm">Candidate</th>
                    <th className="p-4 font-bold text-slate-500 text-sm">Email</th>
                    <th className="p-4 font-bold text-slate-500 text-sm">Status</th>
                    <th className="p-4 font-bold text-slate-500 text-sm text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {job.applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-700">{app.user.name || "Unknown"}</td>
                        <td className="p-4 text-slate-500 text-sm">{app.user.email}</td>
                        <td className="p-4">
                            <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                                app.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                app.status === 'HIRED' ? 'bg-emerald-100 text-emerald-600' :
                                'bg-red-100 text-red-600'
                            }`}>
                                {app.status}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            {app.status === 'PENDING' && (
                                <div className="flex justify-end gap-2">
                                    <form action={hireApplicant.bind(null, app.id, job.id)}>
                                        <button className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 border border-emerald-200">
                                            <CheckCircle size={14} /> Hire
                                        </button>
                                    </form>
                                    <form action={rejectApplicant.bind(null, app.id)}>
                                        <button className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-200">
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </form>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {job.applications.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-medium">No applications yet.</div>
        )}
      </div>
    </div>
  );
}