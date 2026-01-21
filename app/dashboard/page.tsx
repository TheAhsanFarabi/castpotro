"use client";
import {
  Flame, Star, Hexagon, Briefcase, Lock,
  ArrowLeft, Play, Target, Sparkles, Crown, Lightbulb, Trophy, 
  Coins, CheckCircle, X, Loader2, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { SKILLS } from '@/lib/data';

// --- Lesson Node Component ---
const LessonNode = ({ 
  status, icon, offset, courseId, unitId 
}: { 
  status: 'completed' | 'active' | 'locked', 
  icon: any, offset: string, courseId?: string, unitId?: string
}) => {
  const getStyles = () => {
    if (status === 'completed') return 'bg-amber-500 border-amber-600 text-white';
    if (status === 'active') return 'bg-[#0ea5e9] border-[#0284c7] text-white';
    return 'bg-slate-200 border-slate-300 text-slate-400';
  };

  // Only link if active/completed
  const href = status !== 'locked' && courseId && unitId 
    ? `/dashboard/learn/${courseId}/${unitId}` 
    : '#';

  return (
    <div className="relative z-10" style={{ transform: `translateX(${offset})` }}>
      {status === 'active' && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl border-2 border-slate-200 font-extrabold text-[#0ea5e9] shadow-sm animate-bounce whitespace-nowrap uppercase tracking-wider text-sm">
          Start
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
        </div>
      )}
      <Link href={href} className={status === 'locked' ? 'pointer-events-none' : ''}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-b-[8px] cursor-pointer transition-transform active:border-b-0 active:translate-y-2 shadow-xl ${getStyles()}`}>
            {icon}
        </div>
      </Link>
    </div>
  );
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course');
  const selectedCourse = SKILLS.find(s => s.id === courseId);

  // --- Gamification State ---
  const [coins, setCoins] = useState(350); // Starting coins
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['public-speaking']); // Mock: User already owns one
  
  // --- Modal State ---
  const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean; courseId: string | null }>({ isOpen: false, courseId: null });
  const [enrollStatus, setEnrollStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const courseToEnroll = SKILLS.find(s => s.id === enrollModal.courseId);
  const ENROLL_COST = 50;

  // --- Handlers ---
  const handleCourseClick = (skillId: string) => {
    if (enrolledCourses.includes(skillId)) {
      // Already enrolled -> Go to course details
      router.push(`/dashboard?course=${skillId}`);
    } else {
      // Not enrolled -> Open Modal
      setEnrollModal({ isOpen: true, courseId: skillId });
      setEnrollStatus('idle');
    }
  };

  const confirmEnrollment = () => {
    if (coins < ENROLL_COST) {
      alert("Not enough coins!"); // In a real app, open a "Buy Coins" modal
      return;
    }

    setEnrollStatus('processing');

    // Simulate Network Request & Animation
    setTimeout(() => {
      setCoins(prev => prev - ENROLL_COST);
      setEnrolledCourses(prev => [...prev, enrollModal.courseId!]);
      setEnrollStatus('success');

      // Auto-navigate after success animation
      setTimeout(() => {
        setEnrollModal({ isOpen: false, courseId: null });
        router.push(`/dashboard?course=${enrollModal.courseId}`);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="flex w-full max-w-[1920px] mx-auto">
      
      {/* --- CENTER CONTENT (Expanded Area) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative scroll-smooth border-r border-slate-100 min-w-0">

        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-8 py-4 mb-6">
          <div className="flex items-center gap-3">
            {selectedCourse ? (
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-600">
                <ArrowLeft size={24} />
              </Link>
            ) : null}

            <div className="flex items-center gap-3 p-2 rounded-xl transition">
              <div className="text-[#0ea5e9] bg-sky-100 p-2 rounded-lg shrink-0">
                {selectedCourse ? <selectedCourse.icon size={28} /> : <Hexagon size={28} />}
              </div>
              <div className="min-w-0">
                <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block truncate">
                    {selectedCourse ? selectedCourse.name : "My Learning Path"}
                </h1>
                {!selectedCourse && <p className="text-slate-400 text-xs font-bold uppercase tracking-wider truncate">Select a course</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <Flame fill="#f59e0b" size={20} /> 1
            </div>
            <div className="flex items-center gap-2 text-[#0ea5e9] font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
              <Star fill="#0ea5e9" size={20} /> {coins}
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 pb-20">
            {selectedCourse ? (
                // VIEW 1: Course Tree (Only shown if enrolled/selected)
                <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto pt-4">
                    {selectedCourse.units.map((unit, index) => (
                    <div key={index} className="w-full flex flex-col items-center">
                        <div className={`w-full text-white rounded-3xl p-8 mb-8 flex justify-between items-center shadow-lg relative overflow-hidden ${index % 2 === 0 ? 'bg-[#0ea5e9] shadow-sky-100' : 'bg-[#8b5cf6] shadow-purple-100'}`}>
                        <div className="relative z-10">
                            <h3 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">{unit.title}</h3>
                            <p className="opacity-90 font-medium text-base sm:text-lg mt-1">{unit.description}</p>
                        </div>
                        <button className="relative z-10 bg-white/20 hover:bg-white/30 transition px-4 sm:px-6 py-3 rounded-xl font-bold text-sm uppercase backdrop-blur-md flex items-center gap-2 border border-white/20 shrink-0">
                            <Briefcase size={18} /> <span className="hidden sm:inline">Guide</span>
                        </button>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                            <Hexagon size={180} />
                        </div>
                        </div>
                        <div className="flex flex-col items-center gap-8 w-full relative mb-8">
                        {unit.levels.map((level, i) => {
                            const offset = i % 2 === 0 ? '0px' : (i % 4 === 1 ? '-60px' : '60px');
                            return (
                            <LessonNode
                                key={level.id}
                                status={level.status as any}
                                icon={<level.icon size={32} />}
                                offset={offset}
                                courseId={selectedCourse.id}
                                unitId={level.id}
                            />
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
            ) : (
                // VIEW 2: Course Grid (With Lock Logic)
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {SKILLS.map((skill) => {
                      const isEnrolled = enrolledCourses.includes(skill.id);
                      return (
                        <div 
                            key={skill.id} 
                            onClick={() => handleCourseClick(skill.id)}
                            className={`group border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden h-full flex flex-col justify-between min-h-[260px] ${
                                isEnrolled 
                                ? 'bg-white border-slate-200 hover:border-sky-300' 
                                : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                            }`}
                        >
                            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <skill.icon size={140} />
                            </div>
                            
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl text-white shadow-md transition-colors ${
                                        isEnrolled 
                                        ? (['public-speaking', 'leadership'].includes(skill.id) ? 'bg-amber-500' : 'bg-[#0ea5e9]') 
                                        : 'bg-slate-400 group-hover:bg-amber-500'
                                    }`}>
                                        <skill.icon size={32} />
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
                                <h3 className="text-2xl font-black text-slate-700 mb-2 group-hover:text-[#0ea5e9] transition-colors">{skill.name}</h3>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed line-clamp-2">Master the art of {skill.name.toLowerCase()} through interactive scenarios.</p>
                            </div>

                            <div className="w-full pt-4 border-t border-slate-200/60">
                                {isEnrolled ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-300 w-[0%]"></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-300">0%</span>
                                        </div>
                                        <button className="w-full py-3.5 rounded-xl border-b-4 border-slate-200 bg-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-sm group-hover:bg-[#0ea5e9] group-hover:text-white group-hover:border-[#0284c7] transition-all flex items-center justify-center gap-2">
                                            Start Learning <Play size={16} fill="currentColor" />
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
                
                {/* Close Button */}
                <button 
                    onClick={() => setEnrollModal({ isOpen: false, courseId: null })}
                    className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 text-center flex flex-col items-center">
                    {enrollStatus === 'success' ? (
                        // Success View
                        <div className="py-6 flex flex-col items-center animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <CheckCircle size={48} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Unlocked!</h2>
                            <p className="text-slate-500 font-bold mb-6">You're ready to start {courseToEnroll.name}.</p>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full animate-[wiggle_1s_ease-in-out_infinite]"></div>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Redirecting...</p>
                        </div>
                    ) : (
                        // Summary/Enroll View
                        <>
                            <div className="w-24 h-24 bg-sky-100 text-[#0ea5e9] rounded-3xl flex items-center justify-center mb-6 shadow-sm transform -rotate-6">
                                <courseToEnroll.icon size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">{courseToEnroll.name}</h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Unlock full access to interactive lessons, quizzes, and AI mentorship for this skill.
                            </p>

                            <div className="bg-amber-50 border-2 border-amber-100 p-4 rounded-2xl w-full mb-8 flex items-center justify-between">
                                <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Cost</span>
                                <div className="flex items-center gap-2 text-amber-600 font-black text-xl">
                                    <Coins size={24} fill="currentColor" /> {ENROLL_COST}
                                </div>
                            </div>

                            <button 
                                onClick={confirmEnrollment}
                                disabled={enrollStatus === 'processing'}
                                className="w-full py-4 bg-[#0ea5e9] text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {enrollStatus === 'processing' ? (
                                    <><Loader2 size={24} className="animate-spin" /> Unlocking...</>
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

      {/* --- RIGHT SIDEBAR (Symmetrical) --- */}
      <div className="hidden xl:flex flex-col w-[240px] 2xl:w-[300px] bg-slate-50/50 p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-6 shrink-0 border-l-2 border-slate-100">
        
        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" /> Weekly Ranking
            </h3>
            <p className="text-slate-500 text-xs mb-4 font-medium">You're in the <span className="text-amber-500 font-bold">Gold League</span>!</p>
            <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-xl border border-amber-100 mb-3">
               <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-700 text-sm">1</div>
               <div className="flex-1 font-bold text-slate-700 text-sm">Sarah J.</div>
               <div className="font-bold text-slate-400 text-xs">2400 XP</div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white rounded-xl border-2 border-sky-100 shadow-sm relative overflow-hidden">
               <div className="w-8 h-8 rounded-full bg-[#0ea5e9] flex items-center justify-center font-bold text-white z-10 text-sm">4</div>
               <div className="flex-1 font-bold text-slate-700 z-10 text-sm">You</div>
               <div className="font-bold text-[#0ea5e9] text-xs z-10">1250 XP</div>
               <div className="absolute inset-0 bg-sky-50 opacity-50"></div>
            </div>
        </div>

        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Daily Quests</h3>
                <Link href="/dashboard/quests" className="text-[#0ea5e9] text-xs font-bold uppercase hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-500 p-2 rounded-lg"><Zap size={20} fill="currentColor" /></div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-slate-700">Earn 50 XP</div>
                    <div className="h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[70%]"></div>
                    </div>
                </div>
                </div>
                <div className="flex items-center gap-3">
                <div className="bg-rose-100 text-rose-500 p-2 rounded-lg"><Target size={20} /></div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-slate-700">Complete 1 Lesson</div>
                    <div className="h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-rose-500 w-[0%]"></div>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Plus</h3>
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

        <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 flex gap-4 items-start">
             <Lightbulb className="text-indigo-500 shrink-0" size={24} />
             <div>
                <h4 className="font-bold text-indigo-900 text-sm mb-1">Daily Insight</h4>
                <p className="text-indigo-700/80 text-xs font-medium leading-relaxed">
                    "Active listening isn't just hearing; it's understanding."
                </p>
             </div>
        </div>
      </div>

    </div>
  );
}

// --- Main Page Component ---
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}