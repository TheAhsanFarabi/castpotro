"use client";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Lock,
  CheckCircle,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
  X,
  Video,
  FileText,
  Link as LinkIcon,
  Calendar, // <-- Added for Interview status
  XCircle, // <-- Added for Rejected status
} from "lucide-react";
import { useState } from "react";
import { applyForJob } from "@/app/actions";

export default function JobsClient({
  jobs,
  userApplications,
  completedCourses,
}: {
  jobs: any[];
  userApplications: Record<string, string>; // <-- Changed from string[] to an object dictionary
  completedCourses: string[];
}) {
  const [applying, setApplying] = useState<string | null>(null);

  // Modal State
  const [screeningJob, setScreeningJob] = useState<any | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [error, setError] = useState("");

  const handleApplyClick = (job: any) => {
    // If the job requires a screening task, open the modal
    if (job.screeningPrompt && job.screeningType !== "none") {
      setScreeningJob(job);
      setSubmissionLink("");
      setError("");
    } else {
      // Otherwise, apply instantly
      submitApplication(job.id);
    }
  };

  const submitApplication = async (jobId: string, link?: string) => {
    setApplying(jobId);
    await applyForJob(jobId, link);
    setApplying(null);
    setScreeningJob(null); // Close modal if open
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink.trim()) {
      setError("Please provide a valid link or response.");
      return;
    }
    submitApplication(screeningJob.id, submissionLink);
  };

  return (
    <div className="flex w-full h-full relative">
      <div className="flex-1 overflow-y-auto bg-white relative">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-emerald-500 bg-emerald-100 p-2 rounded-lg">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">
                Career Portal
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Unlock Jobs with Skills
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-10 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const isUnlocked =
                !job.requiredCourse ||
                completedCourses.includes(job.requiredCourse);

              // NEW LOGIC: Get the specific status of this job from our dictionary map
              const appStatus = userApplications[job.id];

              return (
                <div
                  key={job.id}
                  className={`relative group border-2 rounded-3xl p-6 transition-all duration-300 ${isUnlocked ? "bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl" : "bg-slate-50 border-slate-100"}`}
                >
                  {/* Locked Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-3xl text-center p-6">
                      <div className="bg-white p-4 rounded-full shadow-lg mb-3">
                        <Lock size={28} className="text-slate-400" />
                      </div>
                      <h3 className="font-black text-slate-600 text-lg mb-1">
                        Skill Locked
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        Complete required course to unlock.
                      </p>
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md bg-slate-800">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl text-slate-700">
                          {job.role}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 size={14} className="text-slate-400" />
                          <p className="font-bold text-slate-400 text-sm">
                            {job.company}
                          </p>
                        </div>
                      </div>
                    </div>
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

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                      {job.requiredCourse && (
                        <div className="flex items-center gap-2 text-[#0ea5e9] text-xs font-bold">
                          <Sparkles size={14} /> Needs Course Cert
                        </div>
                      )}
                      {job.screeningPrompt && job.screeningType !== "none" && (
                        <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
                          <Video size={14} /> Requires Screening Task
                        </div>
                      )}
                    </div>

                    {/* NEW: Dynamic Status-Aware Buttons */}
                    {appStatus === "PENDING" ? (
                      <button
                        disabled
                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 cursor-default"
                      >
                        <Clock size={16} /> Under Review
                      </button>
                    ) : appStatus === "INTERVIEW_SCHEDULED" ? (
                      <button
                        disabled
                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 cursor-default"
                      >
                        <Calendar size={16} /> Interviewing
                      </button>
                    ) : appStatus === "HIRED" ? (
                      <button
                        disabled
                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-emerald-500 text-white shadow-lg cursor-default shadow-emerald-500/30"
                      >
                        <CheckCircle size={16} /> Hired! 🎉
                      </button>
                    ) : appStatus === "REJECTED" ? (
                      <button
                        disabled
                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-slate-100 text-slate-500 border border-slate-200 cursor-default opacity-75"
                      >
                        <XCircle size={16} /> Not Selected
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(job)}
                        disabled={!isUnlocked || applying === job.id}
                        className="px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider text-sm flex items-center gap-2 bg-slate-800 text-white shadow-lg hover:bg-[#0ea5e9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applying === job.id ? "Applying..." : "Apply Now"}{" "}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Screening Task Modal */}
      {screeningJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-xl text-purple-400">
                  {screeningJob.screeningType === "VIDEO_LINK" ? (
                    <Video size={24} />
                  ) : screeningJob.screeningType === "TEXT" ? (
                    <FileText size={24} />
                  ) : (
                    <LinkIcon size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-lg">Pre-Screening Task</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {screeningJob.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScreeningJob(null)}
                className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-6">
                <h4 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-2">
                  Instructions from Recruiter
                </h4>
                <p className="text-purple-700 font-medium text-sm leading-relaxed">
                  {screeningJob.screeningPrompt}
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your{" "}
                    {screeningJob.screeningType === "TEXT"
                      ? "Response"
                      : "Submission Link"}
                  </label>
                  {screeningJob.screeningType === "TEXT" ? (
                    <textarea
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-purple-500 resize-none transition-colors"
                    />
                  ) : (
                    <input
                      type="url"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  )}
                  {error && (
                    <p className="text-rose-500 text-xs font-bold">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={applying === screeningJob.id}
                  className="w-full bg-slate-900 text-white font-black uppercase tracking-wider text-sm py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {applying === screeningJob.id
                    ? "Submitting..."
                    : "Submit & Apply"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
