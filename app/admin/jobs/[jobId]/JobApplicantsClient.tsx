// "use client";

// import { useState, useTransition } from "react";
// import { hireApplicant, rejectApplicant } from "@/app/actions";
// import {
//   CheckCircle,
//   XCircle,
//   Eye,
//   X,
//   Star,
//   Award,
//   Video,
//   FileText,
//   Link as LinkIcon,
//   BookOpen,
// } from "lucide-react";

// export default function JobApplicantsClient({ job }: { job: any }) {
//   const [selectedApp, setSelectedApp] = useState<any>(null);
//   const [isPending, startTransition] = useTransition();

//   const handleAction = (appId: string, action: "hire" | "reject") => {
//     startTransition(async () => {
//       if (action === "hire") await hireApplicant(appId, job.id);
//       if (action === "reject") await rejectApplicant(appId, job.id);
//       setSelectedApp(null); // Close modal after action
//     });
//   };

//   return (
//     <>
//       {/* --- THE TABLE --- */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr>
//               <th className="p-4 font-bold text-slate-500 text-sm">
//                 Candidate
//               </th>
//               <th className="p-4 font-bold text-slate-500 text-sm">
//                 Experience / XP
//               </th>
//               <th className="p-4 font-bold text-slate-500 text-sm">Status</th>
//               <th className="p-4 font-bold text-slate-500 text-sm text-right">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {job.applications.map((app: any) => (
//               <tr
//                 key={app.id}
//                 className="hover:bg-slate-50/50 transition-colors"
//               >
//                 <td className="p-4">
//                   <p className="font-bold text-slate-700">
//                     {app.user.name || "Unknown"}
//                   </p>
//                   <p className="text-xs text-slate-400 font-medium">
//                     {app.user.email}
//                   </p>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-2">
//                     <Award size={16} className="text-amber-500" />
//                     <span className="font-bold text-slate-600">
//                       {app.user.xp} XP
//                     </span>
//                   </div>
//                 </td>
//                 <td className="p-4">
//                   <span
//                     className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
//                       app.status === "PENDING"
//                         ? "bg-amber-100 text-amber-600"
//                         : app.status === "HIRED"
//                           ? "bg-emerald-100 text-emerald-600"
//                           : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {app.status}
//                   </span>
//                 </td>
//                 <td className="p-4 text-right">
//                   <button
//                     onClick={() => setSelectedApp(app)}
//                     className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
//                   >
//                     <Eye size={14} /> Review Profile
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {job.applications.length === 0 && (
//           <div className="p-10 text-center text-slate-400 font-medium">
//             No applications have been submitted yet.
//           </div>
//         )}
//       </div>

//       {/* --- THE TALENT PROFILE MODAL --- */}
//       {selectedApp && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
//           <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
//             {/* Left Column: Castpotro DNA */}
//             <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-200">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
//                   {selectedApp.user.name?.charAt(0) || "U"}
//                 </div>
//                 <button
//                   onClick={() => setSelectedApp(null)}
//                   className="md:hidden text-slate-400 bg-slate-200 p-2 rounded-full hover:text-slate-700"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               <h2 className="text-2xl font-black text-slate-800 mb-1">
//                 {selectedApp.user.name}
//               </h2>
//               <p className="text-sm font-medium text-slate-500 mb-6">
//                 {selectedApp.user.email}
//               </p>

//               <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
//                   <Star size={14} className="text-amber-500" /> Castpotro DNA
//                 </p>
//                 <h3 className="text-3xl font-black text-slate-800">
//                   {selectedApp.user.xp}{" "}
//                   <span className="text-sm text-slate-400 font-bold">XP</span>
//                 </h3>
//               </div>

//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
//                   <BookOpen size={14} /> Enrolled Courses
//                 </p>
//                 <div className="space-y-2">
//                   {selectedApp.user.enrollments.map((enrollment: any) => (
//                     <div
//                       key={enrollment.id}
//                       className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex justify-between items-center"
//                     >
//                       <span className="truncate">
//                         {enrollment.course.title}
//                       </span>
//                       <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
//                         {enrollment.completedLessons.length} lessons
//                       </span>
//                     </div>
//                   ))}
//                   {selectedApp.user.enrollments.length === 0 && (
//                     <p className="text-sm text-slate-400 italic">
//                       No courses started yet.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Screening & Action */}
//             <div className="w-full md:w-2/3 p-8 flex flex-col">
//               <div className="flex justify-between items-center mb-8 hidden md:flex">
//                 <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm">
//                   Application Review
//                 </h3>
//                 <button
//                   onClick={() => setSelectedApp(null)}
//                   className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               <div className="flex-1">
//                 {/* Check if Job has a screening task */}
//                 {job.screeningType && job.screeningType !== "none" ? (
//                   <div className="space-y-6">
//                     <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl">
//                       <h4 className="text-purple-800 font-bold text-sm mb-2 flex items-center gap-2">
//                         {job.screeningType === "VIDEO_LINK" ? (
//                           <Video size={16} />
//                         ) : job.screeningType === "TEXT" ? (
//                           <FileText size={16} />
//                         ) : (
//                           <LinkIcon size={16} />
//                         )}
//                         Recruiter Prompt
//                       </h4>
//                       <p className="text-purple-700 text-sm font-medium leading-relaxed">
//                         {job.screeningPrompt}
//                       </p>
//                     </div>

//                     <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm">
//                       <h4 className="font-bold text-slate-800 mb-4 text-lg">
//                         Candidate's Submission
//                       </h4>

//                       {selectedApp.submissionLink ? (
//                         job.screeningType === "TEXT" ? (
//                           <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border border-slate-200">
//                             {selectedApp.submissionLink}
//                           </div>
//                         ) : (
//                           <a
//                             href={selectedApp.submissionLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold px-4 py-3 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 w-full justify-center"
//                           >
//                             <LinkIcon size={18} /> Open Candidate's Attachment
//                           </a>
//                         )
//                       ) : (
//                         <p className="text-rose-500 font-medium text-sm p-4 bg-rose-50 rounded-xl border border-rose-100">
//                           Candidate did not provide a submission.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//                     <CheckCircle size={48} className="text-emerald-400 mb-4" />
//                     <h3 className="text-lg font-bold text-slate-700">
//                       Instant Application
//                     </h3>
//                     <p className="text-slate-500 text-sm mt-2 max-w-sm">
//                       This job did not require a screening task. Review the
//                       candidate's Castpotro DNA on the left to make your
//                       decision.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               {selectedApp.status === "PENDING" && (
//                 <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => handleAction(selectedApp.id, "reject")}
//                     disabled={isPending}
//                     className="py-4 rounded-xl font-black uppercase tracking-wider text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     <XCircle size={18} /> Reject
//                   </button>
//                   <button
//                     onClick={() => handleAction(selectedApp.id, "hire")}
//                     disabled={isPending}
//                     className="py-4 rounded-xl font-black uppercase tracking-wider text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     <CheckCircle size={18} /> Hire Candidate
//                   </button>
//                 </div>
//               )}
//               {selectedApp.status !== "PENDING" && (
//                 <div className="mt-8 pt-6 border-t border-slate-100 text-center">
//                   <span
//                     className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${selectedApp.status === "HIRED" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
//                   >
//                     This candidate was {selectedApp.status.toLowerCase()}.
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import {
  hireApplicant,
  rejectApplicant,
  generateApplicantScore,
  sendInterviewInvite,
} from "@/app/actions";
import {
  CheckCircle,
  XCircle,
  Eye,
  X,
  Star,
  Award,
  Video,
  FileText,
  Link as LinkIcon,
  BookOpen,
  Sparkles,
  Calendar,
} from "lucide-react";

export default function JobApplicantsClient({ job }: { job: any }) {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Interview Modal State
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  const handleAction = (appId: string, action: "hire" | "reject") => {
    startTransition(async () => {
      if (action === "hire") await hireApplicant(appId, job.id);
      if (action === "reject") await rejectApplicant(appId, job.id);
      setSelectedApp(null);
    });
  };

  const handleGenerateScore = (appId: string) => {
    startTransition(async () => {
      await generateApplicantScore(appId);
      // We don't close the modal here, the page will revalidate and show the new score!
    });
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await sendInterviewInvite(selectedApp.id, meetingLink, meetingDate);
      setShowInterviewForm(false);
      setSelectedApp(null);
    });
  };

  return (
    <>
      {/* --- THE TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-500 text-sm">
                Candidate
              </th>
              <th className="p-4 font-bold text-slate-500 text-sm">
                Experience
              </th>
              <th className="p-4 font-bold text-slate-500 text-sm">AI Score</th>
              <th className="p-4 font-bold text-slate-500 text-sm">Status</th>
              <th className="p-4 font-bold text-slate-500 text-sm text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {job.applications.map((app: any) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4">
                  <p className="font-bold text-slate-700">
                    {app.user.name || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {app.user.email}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    <span className="font-bold text-slate-600">
                      {app.user.xp} XP
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {app.aiMatchScore ? (
                    <span className="font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {app.aiMatchScore}%
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      Not Scored
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      app.status === "PENDING"
                        ? "bg-amber-100 text-amber-600"
                        : app.status === "INTERVIEW_SCHEDULED"
                          ? "bg-blue-100 text-blue-600"
                          : app.status === "HIRED"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowInterviewForm(false);
                    }}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    <Eye size={14} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- THE TALENT PROFILE MODAL --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
            {/* Left Column: Castpotro DNA */}
            <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-200 flex flex-col relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 md:hidden text-slate-400 bg-slate-200 p-2 rounded-full hover:text-slate-700"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-lg mb-4">
                {selectedApp.user.name?.charAt(0) || "U"}
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-1">
                {selectedApp.user.name}
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-6">
                {selectedApp.user.email}
              </p>

              {/* NEW: Gemini Match Score Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm mb-6 text-center">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                  <Sparkles size={14} /> AI Match Score
                </p>
                {selectedApp.aiMatchScore ? (
                  <h3 className="text-4xl font-black text-indigo-700">
                    {selectedApp.aiMatchScore}
                    <span className="text-lg text-indigo-400">%</span>
                  </h3>
                ) : (
                  <button
                    onClick={() => handleGenerateScore(selectedApp.id)}
                    disabled={isPending}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Analyzing DNA..." : "Generate AI Score"}
                  </button>
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Star size={14} className="text-amber-500" /> Castpotro DNA
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  {selectedApp.user.xp}{" "}
                  <span className="text-sm text-slate-400 font-bold">XP</span>
                </h3>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen size={14} /> Enrolled Courses
                </p>
                <div className="space-y-2">
                  {selectedApp.user.enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 flex justify-between items-center"
                    >
                      <span className="truncate pr-2">
                        {enrollment.course.title}
                      </span>
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md shrink-0">
                        {enrollment.completedLessons.length} done
                      </span>
                    </div>
                  ))}
                  {selectedApp.user.enrollments.length === 0 && (
                    <p className="text-sm text-slate-400 italic">
                      No courses started yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Screening & Action */}
            <div className="w-full md:w-2/3 p-8 flex flex-col relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-8 right-8 hidden md:block text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex-1 mt-6 md:mt-0">
                {/* INTERVIEW SCHEDULING FORM */}
                {showInterviewForm ? (
                  <div className="h-full flex flex-col justify-center animate-in slide-in-from-right-4">
                    <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
                      <Calendar className="text-blue-500" /> Schedule Interview
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Send an automated email notification with the meeting
                      details.
                    </p>

                    <form
                      onSubmit={handleScheduleInterview}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Date & Time
                        </label>
                        <input
                          type="text"
                          required
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                          placeholder="e.g. Oct 24th at 3:00 PM EST"
                          className="w-full mt-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Meeting Link
                        </label>
                        <input
                          type="url"
                          required
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          placeholder="https://zoom.us/j/..."
                          className="w-full mt-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowInterviewForm(false)}
                          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isPending}
                          className="flex-1 bg-blue-600 text-white font-black uppercase tracking-wider text-sm py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
                        >
                          Send Invitation
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // STANDARD REVIEW VIEW
                  <>
                    {job.screeningType && job.screeningType !== "none" ? (
                      <div className="space-y-6">
                        <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl">
                          <h4 className="text-purple-800 font-bold text-sm mb-2 flex items-center gap-2">
                            {job.screeningType === "VIDEO_LINK" ? (
                              <Video size={16} />
                            ) : job.screeningType === "TEXT" ? (
                              <FileText size={16} />
                            ) : (
                              <LinkIcon size={16} />
                            )}
                            Recruiter Prompt
                          </h4>
                          <p className="text-purple-700 text-sm font-medium leading-relaxed">
                            {job.screeningPrompt}
                          </p>
                        </div>

                        <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm">
                          <h4 className="font-bold text-slate-800 mb-4 text-lg">
                            Candidate's Submission
                          </h4>
                          {selectedApp.submissionLink ? (
                            job.screeningType === "TEXT" ? (
                              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border border-slate-200">
                                {selectedApp.submissionLink}
                              </div>
                            ) : (
                              <a
                                href={selectedApp.submissionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold px-4 py-3 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 w-full justify-center"
                              >
                                <LinkIcon size={18} /> Open Candidate's
                                Attachment
                              </a>
                            )
                          ) : (
                            <p className="text-rose-500 font-medium text-sm p-4 bg-rose-50 rounded-xl border border-rose-100">
                              Candidate did not provide a submission.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <CheckCircle
                          size={48}
                          className="text-emerald-400 mb-4"
                        />
                        <h3 className="text-lg font-bold text-slate-700">
                          Instant Application
                        </h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-sm">
                          Review the candidate's Castpotro DNA on the left to
                          make your decision.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons (Only show if not in interview form mode) */}
              {!showInterviewForm && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  {selectedApp.status === "PENDING" ? (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAction(selectedApp.id, "reject")}
                        disabled={isPending}
                        className="py-3 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setShowInterviewForm(true)}
                        disabled={isPending}
                        className="py-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Calendar size={16} /> Interview
                      </button>
                      <button
                        onClick={() => handleAction(selectedApp.id, "hire")}
                        disabled={isPending}
                        className="py-3 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle size={16} /> Hire
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span
                        className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
                          selectedApp.status === "HIRED"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedApp.status === "INTERVIEW_SCHEDULED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        Current Status: {selectedApp.status.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
