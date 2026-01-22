"use client";
import { 
  Briefcase, MapPin, DollarSign, Lock, CheckCircle, 
  ArrowRight, Search, Building2, Clock, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { applyForJob } from '@/app/actions';

export default function JobsClient({ jobs, userApplications, completedCourses }: { jobs: any[], userApplications: string[], completedCourses: string[] }) {
  const [applying, setApplying] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    await applyForJob(jobId);
    setApplying(null);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 overflow-y-auto bg-white relative">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 mb-6">
           <div className="flex items-center gap-3">
                <div className="text-emerald-500 bg-emerald-100 p-2 rounded-lg"><Briefcase size={28} /></div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Career Portal</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unlock Jobs with Skills</p>
                </div>
           </div>
        </div>

        <div className="px-6 lg:px-10 pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {jobs.map((job) => {
                    const isUnlocked = !job.requiredCourse || completedCourses.includes(job.requiredCourse);
                    const hasApplied = userApplications.includes(job.id);

                    return (
                        <div key={job.id} className={`relative group border-2 rounded-3xl p-6 transition-all duration-300 ${isUnlocked ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl' : 'bg-slate-50 border-slate-100'}`}>
                            
                            {/* Locked Overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-3xl text-center p-6">
                                    <div className="bg-white p-4 rounded-full shadow-lg mb-3"><Lock size={28} className="text-slate-400" /></div>
                                    <h3 className="font-black text-slate-600 text-lg mb-1">Skill Locked</h3>
                                    <p className="text-sm font-medium text-slate-500">Complete required course to unlock.</p>
                                </div>
                            )}

                            {/* Job Details */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md bg-slate-800">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-xl text-slate-700">{job.role}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building2 size={14} className="text-slate-400" />
                                            <p className="font-bold text-slate-400 text-sm">{job.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><MapPin size={14} /> {job.location}</div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={14} /> {job.type}</div>
                                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700"><DollarSign size={14} /> {job.salary}</div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                {job.requiredCourse && (
                                    <div className="flex items-center gap-2 text-[#0ea5e9] text-xs font-bold">
                                        <Sparkles size={14} /> Needs Course Cert
                                    </div>
                                )}
                                
                                {hasApplied ? (
                                    <button disabled className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-default">
                                        <CheckCircle size={16} /> Applied
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleApply(job.id)}
                                        disabled={!isUnlocked || applying === job.id}
                                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-slate-800 text-white shadow-lg hover:bg-[#0ea5e9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {applying === job.id ? 'Applying...' : 'Apply Now'} <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}