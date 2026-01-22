"use client";

import { 
  Zap, Flame, Star, Trophy, Target, Shield, 
  CheckCircle, ArrowRight, Gift, X,
  Wallet, Utensils, HeartPulse, BookOpen, Scale, Droplet, Sun, 
  Briefcase, Factory, ArrowLeftRight, Building2, Recycle, Globe, 
  Fish, TreePine, Gavel, Link as LinkIcon, Play, Lock
} from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import ImpactDNA from './ImpactDNA'; // Ensure this file exists from previous step
import QuestSubmissionModal from './QuestSubmissionModal'; // Ensure this file exists from previous step

// --- 1. SDGs Data with Lucide Icons ---
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

export default function QuestsClient({ 
  quests, 
  dna, 
  userSubmissions 
}: { 
  quests: any[], 
  dna: any, 
  userSubmissions: any[] 
}) {
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  
  // Modal State
  const [activeQuest, setActiveQuest] = useState<any | null>(null);

  // Helper to check status
  const getQuestStatus = (questId: string) => {
    const sub = userSubmissions.find((s: any) => s.questId === questId);
    return sub ? sub.status : 'AVAILABLE'; // PENDING, APPROVED, REJECTED, AVAILABLE
  };

  const getSDG = (id: number | null) => SDGs.find(s => s.id === id);

  // Filter Logic
  const filteredQuests = selectedSDG 
    ? quests.filter(q => q.sdgId === selectedSDG)
    : quests;

  const handleStartQuest = (quest: any) => {
    setActiveQuest(quest);
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
                    {filteredQuests.length === 0 ? (
                         <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in">
                            <p className="text-slate-400 font-bold">No active quests found for this category.</p>
                            <button onClick={() => setSelectedSDG(null)} className="mt-2 text-[#0ea5e9] font-bold text-sm hover:underline">View all quests</button>
                        </div>
                    ) : (
                        filteredQuests.map((quest) => {
                            const sdg = getSDG(quest.sdgId);
                            const status = getQuestStatus(quest.id);

                            return (
                                <div key={quest.id} className="relative bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                    
                                    {/* Left Color Stripe */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 transition-all group-hover:w-3" style={{ backgroundColor: sdg?.color || '#cbd5e1' }} />

                                    {/* Icon Box */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-slate-50 border-2 border-slate-100 transition-transform group-hover:scale-105" style={{ color: sdg?.color }}>
                                        {sdg ? <sdg.icon size={32} /> : '🎯'}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                            <h3 className="text-xl font-extrabold text-slate-800">{quest.title}</h3>
                                            {sdg && (
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase text-white w-fit mx-auto md:mx-0 shadow-sm" style={{ backgroundColor: sdg.color }}>
                                                    SDG {sdg.id}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 font-medium text-sm mb-3">{quest.description}</p>
                                    </div>

                                    {/* Action / XP */}
                                    <div className="flex flex-col items-center gap-3 shrink-0 min-w-[100px]">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={18} fill="currentColor" />
                                            <span className="font-black text-xl">{quest.xp}</span>
                                        </div>
                                        
                                        {status === 'APPROVED' ? (
                                            <button disabled className="px-6 py-2 bg-green-100 text-green-600 font-bold rounded-xl text-sm cursor-default flex items-center gap-2">
                                                <CheckCircle size={16} /> Done
                                            </button>
                                        ) : status === 'PENDING' ? (
                                            <button disabled className="px-6 py-2 bg-amber-100 text-amber-600 font-bold rounded-xl text-sm cursor-default flex items-center gap-2">
                                                <Lock size={16} /> Reviewing
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleStartQuest(quest)}
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

      {/* --- RIGHT SIDEBAR --- */}
      <div className="hidden 2xl:flex flex-col w-[350px] bg-slate-50/50 border-l border-slate-100 p-6 h-full sticky top-0 overflow-y-auto custom-scrollbar">
         
         {/* 1. Impact DNA */}
         <ImpactDNA dna={dna} />

         {/* 2. Streak Widget */}
         <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 mt-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-black text-slate-700 text-lg">Daily Streak</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase">Keep it up!</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg animate-pulse">
                    <Flame size={24} fill="currentColor" />
                </div>
            </div>
            <div className="text-4xl font-black text-slate-800 mb-4">3 <span className="text-lg text-slate-400 font-bold">Days</span></div>
            <div className="flex gap-1 justify-between">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 ${i < 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {d}
                    </div>
                ))}
            </div>
         </div>

      </div>

      {/* Submission Modal */}
      {activeQuest && (
        <QuestSubmissionModal 
            quest={activeQuest} 
            onClose={() => setActiveQuest(null)} 
        />
      )}

    </div>
  );
}