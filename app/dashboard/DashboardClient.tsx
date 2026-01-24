"use client";
import {
  Flame,
  Star,
  Hexagon,
  Briefcase,
  Lock,
  ArrowLeft,
  Play,
  Trophy,
  Coins,
  CheckCircle,
  X,
  Loader2,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createEnrollment } from "@/app/actions";
import StreakWidget from "@/app/components/StreakWidget";

// --- Lesson Node Component ---
const LessonNode = ({
  status,
  icon,
  offset,
  courseId,
  lessonId,
}: {
  status: "completed" | "active" | "locked";
  icon: any;
  offset: string;
  courseId?: string;
  lessonId?: string;
}) => {
  const getStyles = () => {
    if (status === "completed")
      return "bg-amber-500 border-amber-600 text-white";
    if (status === "active") return "bg-[#0ea5e9] border-[#0284c7] text-white";
    return "bg-slate-200 border-slate-300 text-slate-400";
  };

  const href =
    status !== "locked" && courseId && lessonId
      ? `/dashboard/learn/${courseId}/${lessonId}`
      : "#";

  return (
    <div
      className="relative z-10"
      style={{ transform: `translateX(${offset})` }}
    >
      {status === "active" && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl border-2 border-slate-200 font-extrabold text-[#0ea5e9] shadow-sm animate-bounce whitespace-nowrap uppercase tracking-wider text-sm">
          Start
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
        </div>
      )}
      <Link
        href={href}
        className={status === "locked" ? "pointer-events-none" : ""}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-b-[8px] cursor-pointer transition-transform active:border-b-0 active:translate-y-2 shadow-xl ${getStyles()}`}
        >
          {icon}
        </div>
      </Link>
    </div>
  );
};

// --- Helper: Avatar Component ---
const UserAvatar = ({ name, rank }: { name: string; rank: number }) => {
  const colors = [
    "bg-yellow-200 text-yellow-700", // Rank 1
    "bg-slate-200 text-slate-700", // Rank 2
    "bg-orange-200 text-orange-700", // Rank 3
    "bg-sky-100 text-sky-600", // Others
  ];
  const style = colors[rank - 1] || colors[3];

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${style}`}
    >
      {rank <= 3 ? rank : name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

export default function DashboardClient({
  user,
  courses,
  streakData,
  leaderboard, // <--- New Prop
  myRank, // <--- New Prop
}: {
  user: any;
  courses: any[];
  streakData: { streak: number; weekActivity: boolean[] };
  leaderboard: any[];
  myRank: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course");

  const selectedCourse = courses.find((c) => c.id === courseId);

  // Flatten completed lessons into a Set for O(1) lookup
  const completedLessonIds = new Set(
    user.enrollments
      .flatMap((e: any) => e.completedLessons)
      .map((cl: any) => cl.lessonId),
  );

  const enrolledCourseIds = user.enrollments.map((e: any) => e.courseId);

  // --- State ---
  const [coins, setCoins] = useState(user.coins);
  const [myCourses, setMyCourses] = useState<string[]>(enrolledCourseIds);

  // Enrollment Modal
  const [enrollModal, setEnrollModal] = useState<{
    isOpen: boolean;
    courseId: string | null;
  }>({ isOpen: false, courseId: null });
  const [enrollStatus, setEnrollStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const courseToEnroll = courses.find((c) => c.id === enrollModal.courseId);
  const ENROLL_COST = 50;

  // --- Handlers ---
  const handleCourseClick = (skillId: string) => {
    if (myCourses.includes(skillId)) {
      router.push(`/dashboard?course=${skillId}`);
    } else {
      setEnrollModal({ isOpen: true, courseId: skillId });
      setEnrollStatus("idle");
    }
  };

  const confirmEnrollment = async () => {
    if (coins < ENROLL_COST) {
      alert("Not enough coins!");
      return;
    }

    setEnrollStatus("processing");

    try {
      const result = await createEnrollment(enrollModal.courseId!, ENROLL_COST);

      if (result.success) {
        setCoins((prev: number) => prev - ENROLL_COST);
        setMyCourses((prev: string[]) => [...prev, enrollModal.courseId!]);
        setEnrollStatus("success");

        setTimeout(() => {
          setEnrollModal({ isOpen: false, courseId: null });
          router.push(`/dashboard?course=${enrollModal.courseId}`);
        }, 1500);
      } else {
        alert("Enrollment failed. Please try again.");
        setEnrollStatus("idle");
      }
    } catch (e) {
      console.error(e);
      setEnrollStatus("idle");
    }
  };

  return (
    <div className="flex w-full max-w-[1920px] mx-auto">
      {/* --- CENTER CONTENT --- */}
      <div className="flex-1 overflow-y-auto bg-white relative scroll-smooth border-r border-slate-100 min-w-0">
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-8 py-4 mb-6">
          <div className="flex items-center gap-3">
            {selectedCourse ? (
              <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft size={24} />
              </Link>
            ) : null}

            <div className="flex items-center gap-3 p-2 rounded-xl transition">
              <div className="text-[#0ea5e9] bg-sky-100 p-2 rounded-lg shrink-0">
                <Hexagon size={28} />
              </div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block truncate">
                  {selectedCourse ? selectedCourse.title : "My Learning Path"}
                </h1>
                {!selectedCourse && (
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider truncate">
                    Select a course
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 shrink-0">
            {/* 1. COINS */}
            <div className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
              <Coins fill="#ca8a04" size={20} /> {coins}
            </div>

            {/* 2. XP */}
            <div className="flex items-center gap-2 text-sky-600 font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
              <Star fill="#0284c7" size={20} /> {user.xp}
            </div>

            {/* 3. STREAK */}
            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
              <Flame fill="#f97316" size={20} /> {streakData.streak}
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-20">
          {selectedCourse ? (
            // VIEW 1: Course Tree
            <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto pt-4">
              {selectedCourse.units
                .sort((a: any, b: any) => a.order - b.order)
                .map((unit: any, index: number) => {
                  const previousUnit =
                    index > 0 ? selectedCourse.units[index - 1] : null;
                  const isPreviousUnitCompleted = previousUnit
                    ? previousUnit.lessons.every((l: any) =>
                        completedLessonIds.has(l.id),
                      )
                    : true;

                  const isUnitLocked = !isPreviousUnitCompleted;

                  return (
                    <div
                      key={unit.id}
                      className={`w-full flex flex-col items-center ${isUnitLocked ? "opacity-60 grayscale" : ""}`}
                    >
                      <div
                        className={`w-full text-white rounded-3xl p-8 mb-8 flex justify-between items-center shadow-lg relative overflow-hidden ${index % 2 === 0 ? "bg-[#0ea5e9] shadow-sky-100" : "bg-[#8b5cf6] shadow-purple-100"}`}
                      >
                        <div className="relative z-10">
                          <h3 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                            {unit.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 opacity-90">
                            {isUnitLocked && <Lock size={18} />}
                            <p className="font-medium text-base sm:text-lg">
                              {isUnitLocked
                                ? "Complete previous unit to unlock"
                                : unit.description}
                            </p>
                          </div>
                        </div>
                        <button className="relative z-10 bg-white/20 hover:bg-white/30 transition px-4 sm:px-6 py-3 rounded-xl font-bold text-sm uppercase backdrop-blur-md flex items-center gap-2 border border-white/20 shrink-0">
                          <Briefcase size={18} />{" "}
                          <span className="hidden sm:inline">Guide</span>
                        </button>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                          <Hexagon size={180} />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-8 w-full relative mb-8">
                        {unit.lessons.map((lesson: any, i: number) => {
                          const offset =
                            i % 2 === 0
                              ? "0px"
                              : i % 4 === 1
                                ? "-60px"
                                : "60px";

                          const isCompleted = completedLessonIds.has(lesson.id);
                          const isFirstIncomplete =
                            !isCompleted &&
                            unit.lessons
                              .slice(0, i)
                              .every((prev: any) =>
                                completedLessonIds.has(prev.id),
                              );

                          let status: "completed" | "active" | "locked" =
                            "locked";

                          if (isUnitLocked) {
                            status = "locked";
                          } else if (isCompleted) {
                            status = "completed";
                          } else if (isFirstIncomplete) {
                            status = "active";
                          }

                          return (
                            <LessonNode
                              key={lesson.id}
                              status={status}
                              icon={<Zap size={32} />}
                              offset={offset}
                              courseId={selectedCourse.id}
                              lessonId={lesson.id}
                            />
                          );
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
                const totalLessons = course.units.reduce(
                  (acc: number, unit: any) => acc + unit.lessons.length,
                  0,
                );
                const enrollment = user.enrollments.find(
                  (e: any) => e.courseId === course.id,
                );
                const completedCount =
                  enrollment?.completedLessons?.length || 0;
                const progressPercent =
                  totalLessons > 0
                    ? Math.min(
                        Math.round((completedCount / totalLessons) * 100),
                        100,
                      )
                    : 0;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className={`group border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden h-full flex flex-col justify-between min-h-[260px] ${
                      isEnrolled
                        ? "bg-white border-slate-200 hover:border-sky-300"
                        : "bg-slate-50 border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Hexagon size={140} />
                    </div>
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`p-4 rounded-2xl text-white shadow-md transition-colors ${
                            isEnrolled
                              ? "bg-[#0ea5e9]"
                              : "bg-slate-400 group-hover:bg-amber-500"
                          }`}
                        >
                          <Briefcase size={32} />
                        </div>
                        {isEnrolled ? (
                          <span className="text-emerald-500 bg-emerald-50 font-black text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                            <CheckCircle size={14} /> Enrolled
                          </span>
                        ) : (
                          <span className="text-amber-600 bg-amber-100 font-black text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1">
                            <Lock size={14} /> Locked
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-slate-700 mb-2 group-hover:text-[#0ea5e9] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 font-medium mb-6 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="w-full pt-4 border-t border-slate-200/60">
                      {isEnrolled ? (
                        <>
                          <div className="mb-4">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                              <span className="uppercase tracking-wider">
                                Progress
                              </span>
                              <span className="text-[#0ea5e9]">
                                {progressPercent}%
                              </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0ea5e9] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                          <button className="w-full py-3.5 rounded-xl border-b-4 border-slate-200 bg-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-sm group-hover:bg-[#0ea5e9] group-hover:text-white group-hover:border-[#0284c7] transition-all flex items-center justify-center gap-2">
                            {progressPercent > 0
                              ? "Continue"
                              : "Start Learning"}{" "}
                            <Play size={16} fill="currentColor" />
                          </button>
                        </>
                      ) : (
                        <button className="w-full py-3.5 rounded-xl border-b-4 border-amber-200 bg-amber-100 text-amber-700 font-extrabold uppercase tracking-wider text-sm group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-700 transition-all flex items-center justify-center gap-2">
                          <Coins size={18} /> Unlock for {ENROLL_COST}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- ENROLLMENT MODAL --- */}
      {enrollModal.isOpen && courseToEnroll && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEnrollModal({ isOpen: false, courseId: null })}
              className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center flex flex-col items-center">
              {enrollStatus === "success" ? (
                <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={48} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">
                    Unlocked!
                  </h2>
                  <p className="text-slate-500 font-bold mb-6">
                    You're ready to start {courseToEnroll.title}.
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full animate-[wiggle_1s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-sky-100 text-[#0ea5e9] rounded-3xl flex items-center justify-center mb-6 shadow-sm transform -rotate-6">
                    <Briefcase size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">
                    {courseToEnroll.title}
                  </h2>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    Unlock access to interactive lessons and AI mentorship.
                  </p>
                  <div className="bg-amber-50 border-2 border-amber-100 p-4 rounded-2xl w-full mb-8 flex items-center justify-between">
                    <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                      Cost
                    </span>
                    <div className="flex items-center gap-2 text-amber-600 font-black text-xl">
                      <Coins size={24} fill="currentColor" /> {ENROLL_COST}
                    </div>
                  </div>
                  <button
                    onClick={confirmEnrollment}
                    disabled={enrollStatus === "processing"}
                    className="w-full py-4 bg-[#0ea5e9] text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {enrollStatus === "processing" ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />{" "}
                        Unlocking...
                      </>
                    ) : (
                      <>Unlock Now</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RIGHT SIDEBAR --- */}
      <div className="hidden xl:flex flex-col w-[240px] 2xl:w-[300px] bg-slate-50/50 p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-6 shrink-0 border-l-2 border-slate-100">
        <StreakWidget
          streak={streakData.streak}
          weekActivity={streakData.weekActivity}
        />

        {/* --- LEADERBOARD WIDGET (Fixed) --- */}
        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          <Link href="/dashboard/rank" className="group">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover:text-amber-500 transition-colors">
              <Trophy size={20} className="text-amber-500" /> Leaderboard
            </h3>
          </Link>
          <p className="text-slate-500 text-xs mb-4 font-medium">
            You're ranked{" "}
            <span className="text-amber-500 font-bold">#{myRank}</span>{" "}
            globally!
          </p>

          {/* DYNAMIC USERS LIST */}
          {leaderboard &&
            leaderboard.map((u: any, index: number) => {
              const rank = index + 1;
              const isMe = u.id === user.id;

              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-3 p-2 rounded-xl border mb-2 transition-all ${isMe ? "bg-sky-50 border-sky-100 shadow-sm scale-[1.02]" : "bg-white border-transparent hover:border-slate-100"}`}
                >
                  <UserAvatar name={u.name || "U"} rank={rank} />

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm truncate ${isMe ? "font-black text-sky-700" : "font-bold text-slate-700"}`}
                    >
                      {isMe ? "You" : u.name}
                    </div>
                  </div>

                  <div className="font-bold text-slate-400 text-xs whitespace-nowrap">
                    {u.xp} XP
                  </div>
                </div>
              );
            })}
        </div>

        {/* Ads Widget */}
        <Link href="/dashboard/plus">
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200 transition-transform hover:scale-[1.02] active:scale-95">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown
                  size={24}
                  className="text-yellow-300 animate-pulse"
                  fill="currentColor"
                />
                <h3 className="font-black text-lg uppercase tracking-wide">
                  Plus
                </h3>
              </div>
              <p className="text-white/90 text-xs font-medium mb-4 leading-relaxed">
                Boost XP by 2x & exclusive avatars.
              </p>
              <button className="w-full py-2.5 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                Try 7 Days Free
              </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
              <Sparkles size={140} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
