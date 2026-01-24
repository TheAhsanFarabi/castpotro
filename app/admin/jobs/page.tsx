import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Power,
  Trash2,
  Edit,
  Eye,
  Archive,
} from "lucide-react";
import { toggleJobStatus, deleteJob } from "@/app/actions/admin";
import JobSearch from "./JobSearch"; // Import the new component

export default async function AdminJobsPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  // 1. Fetch filtered jobs
  const allJobs = await prisma.job.findMany({
    where: {
      OR: [
        { role: { contains: query } }, // Remove mode: 'insensitive' for MySQL
        { company: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  // 2. Split into groups
  const activeJobs = allJobs.filter((job) => job.isOpen);
  const closedJobs = allJobs.filter((job) => !job.isOpen);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Recruitment Board
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage job postings and track applicants.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* THE NEW SEARCH BOX */}
          <JobSearch />

          <Link
            href="/admin/jobs/new"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            <Plus size={20} /> Post New Job
          </Link>
        </div>
      </div>

      {/* === SECTION 1: ACTIVE ROLES === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-sky-100 text-[#0ea5e9] rounded-lg">
            <Briefcase size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-700">
            Active Roles
          </h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
            {activeJobs.length}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeJobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">
                {query
                  ? `No jobs found matching "${query}"`
                  : "No active job listings."}
              </p>
            </div>
          ) : (
            activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group relative overflow-hidden"
              >
                {/* Promoted Badge */}
                {job.isPromoted && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                    Promoted
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center border border-sky-100">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#0ea5e9] transition-colors">
                        {job.role}
                      </h3>
                      <p className="text-slate-500 font-medium text-sm">
                        {job.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-500 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} /> {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} /> {job.salary}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Users size={14} /> {job._count.applications} Applicants
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition"
                  >
                    <Eye size={16} /> View Applicants
                  </Link>

                  {/* Edit */}
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="p-2.5 text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition border border-transparent hover:border-sky-100"
                  >
                    <Edit size={18} />
                  </Link>

                  {/* Close Job (Toggle) */}
                  <form
                    action={async () => {
                      "use server";
                      await toggleJobStatus(job.id, false);
                    }}
                  >
                    <button
                      className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition border border-transparent hover:border-amber-100"
                      title="Close Job"
                    >
                      <Power size={18} />
                    </button>
                  </form>

                  {/* Delete */}
                  <form
                    action={async () => {
                      "use server";
                      await deleteJob(job.id);
                    }}
                  >
                    <button
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* === SECTION 2: CLOSED POSITIONS === */}
      <section className="opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
            <Archive size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-700">
            Closed Positions
          </h2>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
            {closedJobs.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {closedJobs.length === 0 ? (
            <p className="text-slate-400 font-medium text-sm italic ml-2">
              {query
                ? "No closed jobs match your search."
                : "No closed positions history."}
            </p>
          ) : (
            closedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between grayscale-[0.5] hover:grayscale-0 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-600">{job.role}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {job._count.applications} Applicants • {job.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Re-open Job */}
                  <form
                    action={async () => {
                      "use server";
                      await toggleJobStatus(job.id, true);
                    }}
                  >
                    <button
                      className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                      title="Re-open Job"
                    >
                      <Power size={18} />
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await deleteJob(job.id);
                    }}
                  >
                    <button
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
