"use client";
import {
  Flame, Star, Hexagon, Briefcase, Lock, ArrowLeft, Play,
  Sparkles, Crown, Trophy, Coins, CheckCircle, X, Loader2, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createEnrollment } from "@/app/actions";
import StreakWidget from "@/app/components/StreakWidget"; 

// --- Lesson Node Component (Recolored) ---
const LessonNode = ({ status, icon, offset, courseId, lessonId }: any) => {
  const getStyles = () => {
    if (status === "completed") return "bg-pink-500 border-pink-600 text-white"; // Pink for done
    if (status === "active") return "bg-violet-500 border-violet-600 text-white"; // Violet for active
    return "bg-slate-200 border-slate-300 text-slate-400";
  };
  const href = status !== "locked" && courseId && lessonId ? `/dashboard/learn/${courseId}/${lessonId}` : "#";

  return (
    <div className="relative z-10" style={{ transform: `translateX(${offset})` }}>
      {status === "active" && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl border-2 border-slate-200 font-extrabold text-violet-600 shadow-sm animate-bounce whitespace-nowrap uppercase tracking-wider text-sm">
          Start
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
        </div>
      )}
      <Link href={href} className={status === "locked" ? "pointer-events-none" : ""}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-b-[8px] cursor-pointer transition-transform active:border-b-0 active:translate-y-2 shadow-xl ${getStyles()}`}>
          {icon}
        </div>
      </Link>
    </div>
  );
};

export default function DashboardClient({ user, courses, streakData }: { user: any; courses: any[]; streakData: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course");
  const selectedCourse = courses.find((c) => c.id === courseId);
  
  const completedLessonIds = new Set(user.enrollments.flatMap((e: any) => e.completedLessons).map((cl: any) => cl.lessonId));
  const enrolledCourseIds = user.enrollments.map((e: any) => e.courseId);

  const [coins, setCoins] = useState(user.coins);
  const [myCourses, setMyCourses] = useState<string[]>(enrolledCourseIds);
  const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean; courseId: string | null; }>({ isOpen: false, courseId: null });
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "processing" | "success">("idle");
  const courseToEnroll = courses.find((c) => c.id === enrollModal.courseId);
  const ENROLL_COST = 50;

  const handleCourseClick = (skillId: string) => {
    if (myCourses.includes(skillId)) router.push(`/dashboard?course=${skillId}`);
    else { setEnrollModal({ isOpen: true, courseId: skillId }); setEnrollStatus("idle"); }
  };

  const confirmEnrollment = async () => {
    if (coins < ENROLL_COST) { alert("Not enough coins!"); return; }
    setEnrollStatus("processing");
    try {
      const result = await createEnrollment(enrollModal.courseId!, ENROLL_COST);
      if (result.success) {
        setCoins((prev) => prev - ENROLL_COST);
        setMyCourses((prev) => [...prev, enrollModal.courseId!]);
        setEnrollStatus("success");
        setTimeout(() => { setEnrollModal({ isOpen: false, courseId: null }); router.push(`/dashboard?course=${enrollModal.courseId}`); }, 1500);
      } else { alert("Failed."); setEnrollStatus("idle"); }
    } catch (e) { setEnrollStatus("idle"); }
  };

  return (
    <div className="flex w-full max-w-[1920px] mx-auto">
      {/* --- CENTER CONTENT --- */}
      <div className="flex-1 overflow-y-auto bg-white relative scroll-smooth border-r border-slate-100 min-w-0">
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-8 py-4 mb-6">
          <div className="flex items-center gap-3">
            {selectedCourse ? (
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-600">
                <ArrowLeft size={24} />
              </Link>
            ) : null}
            <div className="flex items-center gap-3 p-2 rounded-xl transition">
              <div className="text-violet-600 bg-violet-100 p-2 rounded-lg shrink-0"><Hexagon size={28} /></div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block truncate">{selectedCourse ? selectedCourse.title : "My Learning Path"}</h1>
                {!selectedCourse && <p className="text-slate-400 text-xs font-bold uppercase tracking-wider truncate">Select a course</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
              <Coins fill="#ca8a04" size={20} /> {coins}
            </div>
            <div className="flex items-center gap-2 text-violet-600 font-bold bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100">
              <Star fill="#7c3aed" size={20} /> {user.xp}
            </div>
            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
              <Flame fill="#f97316" size={20} /> {streakData.streak}
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-20">
          {selectedCourse ? (
            // VIEW 1: Course Tree
            <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto pt-4">
              {selectedCourse.units.sort((a: any, b: any) => a.order - b.order).map((unit: any, index: number) => {
                  const previousUnit = index > 0 ? selectedCourse.units[index - 1] : null;
                  const isPreviousUnitCompleted = previousUnit ? previousUnit.lessons.every((l: any) => completedLessonIds.has(l.id)) : true;
                  const isUnitLocked = !isPreviousUnitCompleted;

                  return (
                    <div key={unit.id} className={`w-full flex flex-col items-center ${isUnitLocked ? "opacity-60 grayscale" : ""}`}>
                      <div className={`w-full text-white rounded-3xl p-8 mb-8 flex justify-between items-center shadow-lg relative overflow-hidden ${index % 2 === 0 ? "bg-violet-500 shadow-violet-200" : "bg-pink-500 shadow-pink-200"}`}>
                        <div className="relative z-10">
                          <h3 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">{unit.title}</h3>
                          <p className="font-medium text-base sm:text-lg mt-1">{isUnitLocked ? "Complete previous unit to unlock" : unit.description}</p>
                        </div>
                        <button className="relative z-10 bg-white/20 hover:bg-white/30 transition px-4 sm:px-6 py-3 rounded-xl font-bold text-sm uppercase backdrop-blur-md flex items-center gap-2 border border-white/20 shrink-0"><Briefcase size={18} /> <span className="hidden sm:inline">Guide</span></button>
                      </div>
                      <div className="flex flex-col items-center gap-8 w-full relative mb-8">
                        {unit.lessons.map((lesson: any, i: number) => {
                          const offset = i % 2 === 0 ? "0px" : i % 4 === 1 ? "-60px" : "60px";
                          const isCompleted = completedLessonIds.has(lesson.id);
                          const isFirstIncomplete = !isCompleted && unit.lessons.slice(0, i).every((prev: any) => completedLessonIds.has(prev.id));
                          let status: "completed" | "active" | "locked" = isUnitLocked ? "locked" : isCompleted ? "completed" : isFirstIncomplete ? "active" : "locked";
                          return <LessonNode key={lesson.id} status={status} icon={<Zap size={32} />} offset={offset} courseId={selectedCourse.id} lessonId={lesson.id} />;
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            // VIEW 2: Course Grid
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {courses.map((course) => {
                const isEnrolled = myCourses.includes(course.id);
                const totalLessons = course.units.reduce((acc: number, unit: any) => acc + unit.lessons.length, 0);
                const enrollment = user.enrollments.find((e: any) => e.courseId === course.id);
                const completedCount = enrollment?.completedLessons?.length || 0;
                const progressPercent = totalLessons > 0 ? Math.min(Math.round((completedCount / totalLessons) * 100), 100) : 0;

                return (
                  <div key={course.id} onClick={() => handleCourseClick(course.id)} className={`group border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden h-full flex flex-col justify-between min-h-[260px] ${isEnrolled ? "bg-white border-slate-200 hover:border-violet-300" : "bg-slate-50 border-slate-200 hover:border-pink-300"}`}>
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl text-white shadow-md transition-colors ${isEnrolled ? "bg-violet-500" : "bg-slate-400 group-hover:bg-pink-500"}`}><Briefcase size={32} /></div>
                        {isEnrolled ? <span className="text-emerald-500 bg-emerald-50 font-black text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1"><CheckCircle size={14} /> Enrolled</span> : <span className="text-pink-600 bg-pink-50 font-black text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-pink-200 flex items-center gap-1"><Lock size={14} /> Locked</span>}
                      </div>
                      <h3 className="text-2xl font-black text-slate-700 mb-2 group-hover:text-violet-600 transition-colors">{course.title}</h3>
                      <p className="text-slate-500 font-medium mb-6 leading-relaxed line-clamp-2">{course.description}</p>
                    </div>
                    <div className="w-full pt-4 border-t border-slate-200/60">
                      {isEnrolled ? (
                        <>
                          <div className="mb-4">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2"><span className="uppercase tracking-wider">Progress</span><span className="text-violet-600">{progressPercent}%</span></div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div></div>
                          </div>
                          <button className="w-full py-3.5 rounded-xl border-b-4 border-slate-200 bg-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-sm group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-700 transition-all flex items-center justify-center gap-2">{progressPercent > 0 ? "Continue" : "Start Learning"} <Play size={16} fill="currentColor" /></button>
                        </>
                      ) : (
                        <button className="w-full py-3.5 rounded-xl border-b-4 border-amber-200 bg-amber-100 text-amber-700 font-extrabold uppercase tracking-wider text-sm group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-700 transition-all flex items-center justify-center gap-2"><Coins size={18} /> Unlock for {ENROLL_COST}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- ENROLL MODAL --- */}
      {enrollModal.isOpen && courseToEnroll && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setEnrollModal({ isOpen: false, courseId: null })} className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition z-20"><X size={20} /></button>
            <div className="p-8 text-center flex flex-col items-center">
              {enrollStatus === "success" ? (
                <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce"><CheckCircle size={48} strokeWidth={3} /></div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Unlocked!</h2>
                  <p className="text-slate-500 font-bold mb-6">You're ready to start {courseToEnroll.title}.</p>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm transform -rotate-6"><Briefcase size={48} /></div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">{courseToEnroll.title}</h2>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">Unlock access to interactive lessons.</p>
                  <button onClick={confirmEnrollment} disabled={enrollStatus === "processing"} className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_6px_0_#5b21b6] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-violet-500 disabled:opacity-70 disabled:cursor-not-allowed">
                    {enrollStatus === "processing" ? <><Loader2 size={24} className="animate-spin" /> Unlocking...</> : <>Unlock Now ({ENROLL_COST} Coins)</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RIGHT SIDEBAR --- */}
      <div className="hidden xl:flex flex-col w-[240px] 2xl:w-[300px] bg-slate-50/50 p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-6 shrink-0 border-l-2 border-slate-100">
        <StreakWidget streak={streakData.streak} weekActivity={streakData.weekActivity} coins={coins} />

        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Weekly Ranking</h3>
          <p className="text-slate-500 text-xs mb-4 font-medium">You're in the <span className="text-yellow-500 font-bold">Gold League</span>!</p>
          <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-xl border border-yellow-100 mb-3">
            <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-700 text-sm">1</div>
            <div className="flex-1 font-bold text-slate-700 text-sm">Sarah J.</div>
            <div className="font-bold text-slate-400 text-xs">2400 XP</div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border-2 border-violet-100 shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white z-10 text-sm">4</div>
            <div className="flex-1 font-bold text-slate-700 z-10 text-sm">You</div>
            <div className="font-bold text-violet-600 text-xs z-10">1250 XP</div>
            <div className="absolute inset-0 bg-violet-50 opacity-50"></div>
          </div>
        </div>

        <Link href="/dashboard/plus">
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-violet-200 transition-transform hover:scale-[1.02] active:scale-95">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2"><Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" /><h3 className="font-black text-lg uppercase tracking-wide">Plus</h3></div>
              <p className="text-white/90 text-xs font-medium mb-4 leading-relaxed">Boost XP by 2x & exclusive avatars.</p>
              <button className="w-full py-2.5 bg-white text-violet-600 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">Try 7 Days Free</button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700"><Sparkles size={140} /></div>
          </div>
        </Link>
      </div>
    </div>
  );
}