"use client";

import { 
  Zap, Flame, Star, Trophy, Target, Shield, 
  CheckCircle, ArrowRight, Gift, X,
  // Icons for SDGs
  Wallet, Utensils, HeartPulse, BookOpen, Scale, Droplet, Sun, 
  Briefcase, Factory, ArrowLeftRight, Building2, Recycle, Globe, 
  Fish, TreePine, Gavel, Link as LinkIcon, Play
} from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';

// --- 1. Full 17 SDGs Data with Lucide Icons ---
const SDGs = [
  { id: 1, name: "No Poverty", color: "#E5243B", icon: Wallet },
  { id: 2, name: "Zero Hunger", color: "#DDA63A", icon: Utensils },
  { id: 3, name: "Good Health", color: "#4C9F38", icon: HeartPulse },
  { id: 4, name: "Quality Education", color: "#C5192D", icon: BookOpen },
  { id: 5, name: "Gender Equality", color: "#FF3A21", icon: Scale },
  { id: 6, name: "Clean Water", color: "#26BDE2", icon: Droplet },
  { id: 7, name: "Clean Energy", color: "#FCC30B", icon: Sun },
  { id: 8, name: "Decent Work", color: "#A21942", icon: Briefcase },
  { id: 9, name: "Innovation", color: "#FD6925", icon: Factory },
  { id: 10, name: "Reduced Inequalities", color: "#DD1367", icon: ArrowLeftRight },
  { id: 11, name: "Sustainable Cities", color: "#FD9D24", icon: Building2 },
  { id: 12, name: "Responsible Consumption", color: "#BF8B2E", icon: Recycle },
  { id: 13, name: "Climate Action", color: "#3F7E44", icon: Globe },
  { id: 14, name: "Life Below Water", color: "#0A97D9", icon: Fish },
  { id: 15, name: "Life on Land", color: "#56C02B", icon: TreePine },
  { id: 16, name: "Peace & Justice", color: "#00689D", icon: Gavel },
  { id: 17, name: "Partnerships", color: "#19486A", icon: LinkIcon },
];

// --- Mock Quests Data ---
const QUESTS = [
  // Daily / General
  {
    id: 101,
    title: "Daily Login",
    description: "Start your day with intent.",
    xp: 50,
    progress: 1,
    total: 1,
    sdgId: null, 
    type: "daily",
    status: "completed"
  },
  {
    id: 102,
    title: "Complete 1 Lesson",
    description: "Finish any soft skill module.",
    xp: 100,
    progress: 0,
    total: 1,
    sdgId: 4, 
    type: "daily",
    status: "active"
  },
  // SDG Specific
  {
    id: 1,
    title: "Donate Old Books",
    description: "Find a local library or school and donate 5 books.",
    xp: 300,
    progress: 0,
    total: 5,
    sdgId: 4,
    type: "weekly",
    status: "active"
  },
  {
    id: 2,
    title: "Zero Waste Day",
    description: "Go 24 hours without generating single-use plastic waste.",
    xp: 500,
    progress: 12,
    total: 24,
    sdgId: 12, 
    type: "challenge",
    status: "active"
  },
  {
    id: 3,
    title: "Community Clean-up",
    description: "Spend 1 hour cleaning up a local park.",
    xp: 450,
    progress: 0,
    total: 1,
    sdgId: 15, 
    type: "weekly",
    status: "locked"
  },
  {
    id: 4,
    title: "Food Drive Volunteer",
    description: "Volunteer at a food bank for a shift.",
    xp: 600,
    progress: 0,
    total: 1,
    sdgId: 2, 
    type: "challenge",
    status: "active"
  },
  {
    id: 5,
    title: "Mentorship Session",
    description: "Mentor a junior student for 30 minutes.",
    xp: 250,
    progress: 1,
    total: 1,
    sdgId: 4, 
    type: "weekly",
    status: "completed"
  },
  {
    id: 6,
    title: "Save Water Challenge",
    description: "Reduce your daily shower time by 2 minutes.",
    xp: 150,
    progress: 0,
    total: 1,
    sdgId: 6,
    type: "challenge",
    status: "active"
  }
];

export default function QuestsPage() {
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const [enrolledQuests, setEnrolledQuests] = useState<number[]>([]);
  // New state to track items that are currently animating out
  const [exitingQuests, setExitingQuests] = useState<number[]>([]);

  // Filter Logic
  const filteredQuests = selectedSDG 
    ? QUESTS.filter(q => q.sdgId === selectedSDG)
    : QUESTS;

  const getSDG = (id: number | null) => SDGs.find(s => s.id === id);

  // Enrollment Handlers
  const handleEnroll = (questId: number) => {
    if (!enrolledQuests.includes(questId)) {
        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0ea5e9', '#f59e0b', '#10b981']
        });
        setEnrolledQuests([...enrolledQuests, questId]);
    }
  };

  const handleUnenroll = (questId: number) => {
    // 1. Add to exiting list to trigger animation
    setExitingQuests(prev => [...prev, questId]);

    // 2. Wait for animation to finish (300ms) before removing from actual list
    setTimeout(() => {
        setEnrolledQuests(prev => prev.filter(id => id !== questId));
        setExitingQuests(prev => prev.filter(id => id !== questId));
    }, 300);
  };

  return (
    <div className="flex w-full h-full bg-white">
      
      {/* --- CENTER CONTENT --- */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center transition-all">
            <div className="flex items-center gap-3">
                <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl animate-in zoom-in duration-500">
                    <Target size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quests Board</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                        {selectedSDG ? `Filtered by: ${getSDG(selectedSDG)?.name}` : 'All Active Quests'}
                    </p>
                </div>
            </div>
            
            {/* XP Counter */}
            <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-xl border-2 border-sky-100 hover:scale-105 transition-transform">
                <Zap size={20} className="text-[#0ea5e9]" fill="currentColor" />
                <span className="font-black text-[#0ea5e9] text-lg">1,250 XP</span>
            </div>
        </div>

        <div className="p-8 max-w-6xl mx-auto space-y-10">
            
            {/* 1. SDG Selector */}
            <section className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-slate-700 flex items-center gap-2">
                        <Globe size={20} className="text-emerald-500" /> Filter by Impact (SDGs)
                    </h2>
                    {selectedSDG && (
                        <button 
                            onClick={() => setSelectedSDG(null)}
                            className="text-xs font-bold text-slate-400 hover:text-[#0ea5e9] uppercase transition-colors"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar px-1">
                    {SDGs.map((sdg) => (
                        <button
                            key={sdg.id}
                            onClick={() => setSelectedSDG(selectedSDG === sdg.id ? null : sdg.id)}
                            className={`
                                flex-shrink-0 w-32 h-32 rounded-2xl p-4 flex flex-col justify-between items-start 
                                transition-all duration-300 border-2 relative overflow-hidden group
                                ${selectedSDG === sdg.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-105 shadow-xl' : 'hover:scale-105 hover:shadow-lg hover:-translate-y-1'}
                            `}
                            style={{ 
                                backgroundColor: sdg.color, 
                                borderColor: sdg.color,
                                opacity: selectedSDG && selectedSDG !== sdg.id ? 0.4 : 1
                            }}
                        >
                            <span className="text-white drop-shadow-md transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <sdg.icon size={32} strokeWidth={2.5} />
                            </span>
                            <div className="relative z-10">
                                <span className="text-white/80 font-bold text-[10px] uppercase">SDG {sdg.id}</span>
                                <h3 className="text-white font-black text-sm leading-tight text-left">{sdg.name}</h3>
                            </div>
                            
                            {/* Texture overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </section>

            {/* 2. Main Quest List */}
            <section className="animate-in slide-in-from-bottom-8 duration-700">
                 <h2 className="text-lg font-extrabold text-slate-700 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-[#0ea5e9]" /> 
                    {selectedSDG ? `${getSDG(selectedSDG)?.name} Challenges` : 'Available Challenges'}
                </h2>
                
                <div className="space-y-4">
                    {filteredQuests.filter(q => q.type !== 'daily').length === 0 ? (
                         <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in">
                            <p className="text-slate-400 font-bold">No active quests found for this category.</p>
                            <button onClick={() => setSelectedSDG(null)} className="mt-2 text-[#0ea5e9] font-bold text-sm hover:underline">View all quests</button>
                        </div>
                    ) : (
                        filteredQuests.filter(q => q.type !== 'daily').map((quest) => {
                            const sdg = getSDG(quest.sdgId);
                            const isEnrolled = enrolledQuests.includes(quest.id);

                            return (
                                <div key={quest.id} className="relative bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                    
                                    {/* Left Color Stripe (SDG Color) */}
                                    <div 
                                        className="absolute left-0 top-0 bottom-0 w-2 transition-all group-hover:w-3" 
                                        style={{ backgroundColor: sdg?.color || '#cbd5e1' }}
                                    />

                                    {/* Icon Box */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-slate-50 border-2 border-slate-100 transition-transform group-hover:scale-105" style={{ color: sdg?.color }}>
                                        {sdg ? <sdg.icon size={32} /> : '🎯'}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                            <h3 className="text-xl font-extrabold text-slate-800">{quest.title}</h3>
                                            {sdg && (
                                                <span 
                                                    className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase text-white w-fit mx-auto md:mx-0 shadow-sm"
                                                    style={{ backgroundColor: sdg.color }}
                                                >
                                                    SDG {sdg.id}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm mb-3">{quest.description}</p>
                                        
                                        {/* Progress Bar (Only visible if enrolled or started) */}
                                        { (quest.progress > 0 || isEnrolled) && (
                                            <div className="w-full max-w-md bg-slate-100 h-2.5 rounded-full overflow-hidden mx-auto md:mx-0 animate-in fade-in duration-500">
                                                <div 
                                                    className="h-full transition-all duration-1000 ease-out" 
                                                    style={{ 
                                                        width: `${Math.max((quest.progress / quest.total) * 100, 5)}%`, 
                                                        backgroundColor: sdg?.color || '#0ea5e9'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action / XP */}
                                    <div className="flex flex-col items-center gap-3 shrink-0 min-w-[100px]">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={18} fill="currentColor" />
                                            <span className="font-black text-xl">{quest.xp}</span>
                                        </div>
                                        
                                        {quest.status === 'locked' ? (
                                            <button className="px-6 py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm cursor-not-allowed flex items-center gap-2">
                                                <Shield size={16} /> Locked
                                            </button>
                                        ) : quest.status === 'completed' ? (
                                            <button className="px-6 py-2 bg-green-100 text-green-600 font-bold rounded-xl text-sm cursor-default flex items-center gap-2">
                                                <CheckCircle size={16} /> Done
                                            </button>
                                        ) : isEnrolled ? (
                                             <button 
                                                className="px-6 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-sm cursor-default flex items-center gap-2 border-2 border-slate-200 animate-in zoom-in duration-300"
                                            >
                                                <Play size={16} fill="currentColor" /> Enrolled
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleEnroll(quest.id)}
                                                className="px-6 py-2 text-white font-bold rounded-xl text-sm shadow-lg hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                                style={{ backgroundColor: sdg?.color || '#0ea5e9' }}
                                            >
                                                Start <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

        </div>
      </div>

      {/* --- RIGHT SIDEBAR (Enrolled & Stats) --- */}
      <div className="hidden 2xl:flex flex-col w-[350px] bg-slate-50/50 border-l border-slate-100 p-6 h-full sticky top-0 overflow-y-auto custom-scrollbar">
         
         {/* 1. Enrolled Quests Section */}
         <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 mb-6 shadow-sm transition-all hover:shadow-md">
            <h3 className="font-black text-slate-700 text-lg mb-4 flex items-center gap-2">
                <Target size={20} className="text-[#0ea5e9]" /> My Active Quests
            </h3>
            
            {enrolledQuests.length === 0 ? (
                <div className="text-center py-6 text-slate-400 animate-in fade-in">
                    <p className="text-xs font-bold mb-2">No quests enrolled yet.</p>
                    <p className="text-[10px]">Pick a challenge to start!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {enrolledQuests.map(id => {
                        const q = QUESTS.find(quest => quest.id === id);
                        if (!q) return null;
                        const sdg = getSDG(q.sdgId);
                        const isExiting = exitingQuests.includes(id);
                        
                        return (
                            <div 
                                key={id} 
                                // Dynamic classes for entrance and exit animations
                                className={`
                                    bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-3 group relative hover:border-slate-300 hover:shadow-sm transition-all duration-300
                                    ${isExiting ? 'opacity-0 translate-x-10 scale-95' : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-4 fade-in'}
                                `}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm" style={{ backgroundColor: sdg?.color || '#ccc' }}>
                                    {sdg ? <sdg.icon size={16} /> : <Star size={16} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-700 text-xs leading-tight mb-1">{q.title}</h4>
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[10%] animate-pulse"></div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleUnenroll(id)}
                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-all"
                                    title="Unenroll"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
         </div>

         {/* 2. Streak Widget */}
         <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-black text-slate-700 text-lg">Daily Streak</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase">Keep it up!</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg animate-pulse">
                    <Flame size={24} fill="currentColor" />
                </div>
            </div>
            <div className="text-4xl font-black text-slate-800 mb-4">5 <span className="text-lg text-slate-400 font-bold">Days</span></div>
            <div className="flex gap-1 justify-between">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 ${i < 5 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {d}
                    </div>
                ))}
            </div>
         </div>

         {/* 3. Weekly Chest */}
         <div className="bg-gradient-to-br from-[#0ea5e9] to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden group mb-6 shadow-lg shadow-sky-200/50 hover:shadow-sky-300/50 transition-all hover:-translate-y-1">
            <div className="relative z-10">
                <h3 className="font-black text-xl mb-1">Weekly Chest</h3>
                <p className="text-sky-100 text-sm font-medium mb-4">Complete 3 SDG quests to unlock rare badges!</p>
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-yellow-400 w-[66%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                    </div>
                    <span className="font-bold text-sm">2/3</span>
                </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <Gift size={120} />
            </div>
         </div>

      </div>

    </div>
  );
}