"use client";
import { 
  Briefcase, MapPin, DollarSign, Lock, CheckCircle, 
  ArrowRight, Search, FileText, Building2, Clock, Sparkles, Crown
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Mock Data ---
// In a real app, fetch this from your DB or API
const COMPLETED_COURSES = ['public-speaking', 'teamwork']; 

const JOBS = [
  { 
    id: 1, 
    role: "Junior Sales Associate", 
    company: "TechFlow Inc.", 
    location: "Remote", 
    type: "Full-Time",
    salary: "$45k - $60k", 
    requiredCourseId: "public-speaking",
    requiredCourseName: "Public Speaking",
    color: "bg-emerald-500",
    posted: "2 days ago"
  },
  { 
    id: 2, 
    role: "Community Manager", 
    company: "SocialHive", 
    location: "New York, NY", 
    type: "Internship",
    salary: "$50k - $70k", 
    requiredCourseId: "public-speaking", 
    requiredCourseName: "Public Speaking",
    color: "bg-blue-500",
    posted: "5 hours ago"
  },
  { 
    id: 3, 
    role: "Team Lead Intern", 
    company: "StartUp Lab", 
    location: "San Francisco, CA", 
    type: "Internship",
    salary: "$30/hr", 
    requiredCourseId: "leadership", 
    requiredCourseName: "Leadership",
    color: "bg-purple-500",
    posted: "1 week ago"
  },
  { 
    id: 4, 
    role: "HR Assistant", 
    company: "PeopleFirst", 
    location: "Austin, TX", 
    type: "Contract",
    salary: "$55k", 
    requiredCourseId: "emotional-iq", 
    requiredCourseName: "Emotional IQ",
    color: "bg-rose-500",
    posted: "3 days ago"
  },
  { 
    id: 5, 
    role: "Customer Success Rep", 
    company: "CloudScale", 
    location: "Remote", 
    type: "Full-Time",
    salary: "$40k - $50k", 
    requiredCourseId: "negotiation", 
    requiredCourseName: "Negotiation",
    color: "bg-orange-500",
    posted: "Just now"
  }
];

function JobsContent() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-emerald-500 bg-emerald-100 p-2 rounded-lg">
                   <Briefcase size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Career Portal</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unlock Jobs with Skills</p>
                </div>
              </div>
           </div>

           {/* Search Bar (Visual Only) */}
           <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border-2 border-slate-100 focus-within:border-sky-300 focus-within:bg-white transition-all">
              <Search size={20} className="text-slate-400" />
              <input type="text" placeholder="Search roles..." className="bg-transparent font-bold text-slate-700 text-sm focus:outline-none w-32 lg:w-48 placeholder:text-slate-400" />
           </div>
        </div>

        {/* JOBS LIST CONTENT */}
        <div className="px-6 lg:px-10 pb-20">
            
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                {['All Jobs', 'Internships', 'Full-Time', 'Remote'].map((tab) => (
                    <button key={tab} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition whitespace-nowrap text-sm first:bg-sky-50 first:text-[#0ea5e9] first:border-sky-200">
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {JOBS.map((job) => {
                    const isUnlocked = COMPLETED_COURSES.includes(job.requiredCourseId);

                    return (
                        <div key={job.id} className={`relative group border-2 rounded-3xl p-6 transition-all duration-300 ${isUnlocked ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1' : 'bg-slate-50 border-slate-100'}`}>
                        
                            {/* Locked Overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-3xl text-center p-6">
                                    <div className="bg-white p-4 rounded-full shadow-lg mb-3 animate-in zoom-in duration-300">
                                        <Lock size={28} className="text-slate-400" />
                                    </div>
                                    <h3 className="font-black text-slate-600 text-lg mb-1">Skill Locked</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-[200px]">
                                        Master <span className="text-[#0ea5e9] font-bold">"{job.requiredCourseName}"</span> to unlock applications.
                                    </p>
                                </div>
                            )}

                            {/* Job Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md ${job.color}`}>
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-xl text-slate-700 group-hover:text-[#0ea5e9] transition-colors">{job.role}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Building2 size={14} className="text-slate-400" />
                                            <p className="font-bold text-slate-400 text-sm">{job.company}</p>
                                        </div>
                                    </div>
                                </div>
                                {isUnlocked && (
                                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                                        <CheckCircle size={12} strokeWidth={3} /> Eligible
                                    </span>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <MapPin size={14} /> {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Clock size={14} /> {job.type}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700">
                                    <DollarSign size={14} /> {job.salary}
                                </div>
                            </div>

                            {/* Requirements & Footer */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[#0ea5e9] text-xs font-bold bg-sky-50 px-3 py-2 rounded-lg border border-sky-100">
                                    <Sparkles size={14} /> Requires: {job.requiredCourseName} Certificate
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-xs font-bold text-slate-300">{job.posted}</span>
                                    <button 
                                        disabled={!isUnlocked}
                                        className={`px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 transition-all ${
                                            isUnlocked 
                                            ? "bg-slate-800 text-white shadow-lg hover:bg-[#0ea5e9] hover:shadow-sky-200 hover:scale-105 active:scale-95" 
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Apply <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: Profile Strength */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#0ea5e9]" /> Profile Strength
            </h3>
            <div className="flex items-center gap-4 mb-2">
                <div className="text-3xl font-black text-slate-700">85%</div>
                <div className="text-xs font-bold text-slate-400 max-w-[120px] leading-tight">Complete your bio to reach 100%</div>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-4">
                <div className="bg-[#0ea5e9] w-[85%] h-full rounded-full"></div>
            </div>
            <button className="w-full py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition">
                Update Resume
            </button>
          </div>
          
          {/* Widget 2: Applications */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4">My Applications</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">T</div>
                    <div className="flex-1">
                        <div className="font-bold text-slate-700 text-sm">TechFlow Inc.</div>
                        <div className="text-xs font-bold text-amber-500">In Review</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-bold">P</div>
                    <div className="flex-1">
                        <div className="font-bold text-slate-700 text-sm">PeopleFirst</div>
                        <div className="text-xs font-bold text-slate-400">Applied 1w ago</div>
                    </div>
                </div>
            </div>
            <button className="w-full mt-4 text-[#0ea5e9] text-xs font-extrabold uppercase tracking-widest hover:underline">
                View All History
            </button>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Premium</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Get priority application status and see who viewed your profile.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Upgrade Now
                </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
                <Sparkles size={140} />
            </div>
        </div>

      </div>

    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}