"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Briefcase, Calendar, PlayCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getRecommendations, saveUserPlan } from '@/app/actions'; 

const INTERESTS = [
  { id: "AI", label: "Artificial Intelligence", emoji: "🤖" },
  { id: "Business", label: "Entrepreneurship", emoji: "🚀" },
  { id: "Communication", label: "Public Speaking", emoji: "🎤" },
  { id: "Python", label: "Coding & Dev", emoji: "💻" },
  { id: "Design", label: "Creative Design", emoji: "🎨" },
  { id: "Marketing", label: "Digital Marketing", emoji: "📱" }
];

const GOALS = [
  { id: "job", label: "Get Hired", desc: "I want a high-paying job." },
  { id: "startup", label: "Build a Startup", desc: "I have a big idea." },
  { id: "skill", label: "Upskill", desc: "I want to learn something new." }
];

export default function GetStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [recommendations, setRecommendations] = useState<any>(null);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinishTest = async () => {
    setStep(3); 
    setIsLoading(true);

    try {
      const data = await getRecommendations(selectedInterests);
      setTimeout(() => {
        setRecommendations(data);
        setStep(4); 
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Failed to get recommendations", error);
      setStep(4);
      setIsLoading(false);
    }
  };

  const handleSaveAndExit = async () => {
    if (!recommendations) return;
    setIsLoading(true);
    try {
        const courseIds = recommendations.courses.map((c: any) => c.id);
        await saveUserPlan(courseIds);
        router.push('/dashboard');
    } catch (error) {
        console.error("Failed to save", error);
        router.push('/dashboard');
    }
  };

  return (
    // Updated: Transparent background to show global layout blobs
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      
      {/* Glassmorphic Card */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-2 border-white/50 min-h-[600px] overflow-hidden relative flex flex-col">
        
        {/* PROGRESS BAR */}
        <div className="h-2 bg-slate-100/50 w-full">
            <motion.div 
                className="h-full bg-gradient-to-r from-[#0ea5e9] to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
            />
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center relative z-10">
          <AnimatePresence mode="wait">

            {/* --- STEP 1: INTERESTS --- */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl"
              >
                <h2 className="text-4xl font-black text-slate-800 mb-2">
                  What sparks your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-pink-500">curiosity?</span>
                </h2>
                <p className="text-slate-500 mb-8 font-medium text-lg">Select topics to personalize your feed.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {INTERESTS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleInterest(item.id)}
                            className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 backdrop-blur-sm ${
                                selectedInterests.includes(item.id) 
                                ? 'border-[#0ea5e9] bg-sky-50/80 text-[#0ea5e9] shadow-lg shadow-sky-100 scale-105' 
                                : 'border-slate-100/60 bg-white/60 text-slate-600 hover:border-[#0ea5e9]/50 hover:bg-white'
                            }`}
                        >
                            <span className="text-4xl">{item.emoji}</span>
                            <span className="font-bold text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setStep(2)}
                    disabled={selectedInterests.length === 0}
                    className="btn-primary py-3 px-8 text-lg shadow-xl shadow-sky-200 disabled:opacity-50 disabled:shadow-none"
                >
                    Continue <ArrowRight className="inline ml-2" size={20} />
                </button>
              </motion.div>
            )}

            {/* --- STEP 2: GOAL --- */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl"
              >
                <h2 className="text-4xl font-black text-slate-800 mb-2">
                  What is your main <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-[#0ea5e9]">goal?</span>
                </h2>
                <p className="text-slate-500 mb-8 font-medium text-lg">We'll tailor your learning path for this.</p>
                
                <div className="space-y-4 mb-8">
                    {GOALS.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal.id)}
                            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 text-left flex items-center justify-between group backdrop-blur-sm ${
                                selectedGoal === goal.id
                                ? 'border-[#0ea5e9] bg-sky-50/90 ring-2 ring-[#0ea5e9] ring-offset-2' 
                                : 'border-slate-100/60 bg-white/60 hover:border-pink-300 hover:bg-white'
                            }`}
                        >
                            <div>
                                <h3 className={`font-bold text-lg ${selectedGoal === goal.id ? 'text-[#0ea5e9]' : 'text-slate-700'}`}>{goal.label}</h3>
                                <p className="text-slate-400 text-sm font-medium">{goal.desc}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedGoal === goal.id ? 'border-[#0ea5e9] bg-[#0ea5e9] text-white' : 'border-slate-200'}`}>
                                {selectedGoal === goal.id && <Check size={14} />}
                            </div>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleFinishTest}
                    disabled={!selectedGoal}
                    className="btn-primary py-3 px-8 text-lg shadow-xl shadow-sky-200 disabled:opacity-50 disabled:shadow-none"
                >
                    Generate Plan <Sparkles className="inline ml-2" size={20} />
                </button>
              </motion.div>
            )}

            {/* --- STEP 3: LOADING AI --- */}
            {step === 3 && (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center"
               >
                   <div className="w-48 h-48 mb-6 relative">
                       <motion.img 
                           src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png"
                           className="w-full h-full object-contain drop-shadow-2xl"
                           animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                           transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                       />
                       <motion.div 
                           className="absolute -top-4 -right-4 bg-white p-3 rounded-xl rounded-bl-none shadow-lg border-2 border-slate-100"
                           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                       >
                           <Loader2 className="animate-spin text-[#0ea5e9]" />
                       </motion.div>
                   </div>
                   <h2 className="text-2xl font-black text-slate-800 mb-2">Analyzing your profile...</h2>
                   <p className="text-slate-400 font-bold">Curating the best courses for {selectedInterests[0] || 'you'}...</p>
               </motion.div>
            )}

            {/* --- STEP 4: RECOMMENDATIONS (THE RESULTS) --- */}
            {step === 4 && recommendations && (
                <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-left"
                >
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">Your Personal Plan</h2>
                            <p className="text-slate-500 font-medium">Based on your interest in <span className="text-[#0ea5e9] font-bold">{selectedInterests.join(", ")}</span>.</p>
                        </div>
                        <button onClick={handleSaveAndExit} className="text-sm font-bold text-slate-400 hover:text-[#0ea5e9] underline">Skip to Dashboard</button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        
                        {/* COURSES */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2"><PlayCircle size={14} /> Recommended Courses</h3>
                            {recommendations.courses.length > 0 ? (
                                recommendations.courses.map((c: any) => (
                                    <div key={c.id} className="bg-white/60 p-4 rounded-2xl border-2 border-slate-100 hover:border-[#0ea5e9] hover:bg-white transition-all cursor-pointer group shadow-sm backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-sky-50 text-[#0ea5e9] p-2 rounded-lg group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors">
                                                <PlayCircle size={20} />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-[#0ea5e9]">{c.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs font-bold">No exact matches found.</div>
                            )}
                        </div>

                        {/* JOBS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2"><Briefcase size={14} /> Career Opportunities</h3>
                            {recommendations.jobs.map((j: any) => (
                                <div key={j.id} className="bg-white/60 p-4 rounded-2xl border-2 border-slate-100 hover:border-pink-300 hover:bg-white hover:shadow-pink-50 transition-all cursor-pointer group shadow-sm backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-pink-50 text-pink-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{j.type}</span>
                                        <span className="text-xs font-bold text-slate-400">{j.salary}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-pink-600">{j.role}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{j.company} • {j.location}</p>
                                </div>
                            ))}
                        </div>

                        {/* EVENTS */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2"><Calendar size={14} /> Upcoming Events</h3>
                            {recommendations.events.map((e: any) => (
                                <div key={e.id} className="bg-white/60 p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-200 hover:bg-white hover:shadow-orange-50 transition-all cursor-pointer group shadow-sm backdrop-blur-sm">
                                    <div className="flex gap-3 items-center">
                                        <div className="bg-orange-50 text-orange-500 p-2 rounded-xl text-center min-w-[50px]">
                                            <div className="text-[10px] font-bold uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                                            <div className="text-lg font-black">{new Date(e.date).getDate()}</div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-500">{e.title}</h4>
                                            <p className="text-xs text-slate-400">{e.type} • {e.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleSaveAndExit}
                        disabled={isLoading}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-[#0ea5e9] to-pink-500 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-sky-200 hover:shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Saving Profile...
                            </>
                        ) : (
                            <>
                                Save Profile & Enter Dashboard <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}