"use client";
import { 
  Zap, Flame, Shield, Trophy, Crown, 
  ArrowUp, Lock, Target, Sparkles, Star
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Mock Data ---
const LEAGUES = [
  { id: 1, name: "Bronze", color: "bg-amber-700", icon: Shield, unlocked: true },
  { id: 2, name: "Silver", color: "bg-slate-400", icon: Shield, unlocked: true },
  { id: 3, name: "Gold", color: "bg-yellow-400", icon: Shield, unlocked: true }, // Current
  { id: 4, name: "Platinum", color: "bg-cyan-400", icon: Shield, unlocked: false },
  { id: 5, name: "Diamond", color: "bg-indigo-400", icon: Shield, unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: "Sarah J.", xp: 2450, avatar: "👩‍🚀", trend: "up" },
  { rank: 2, name: "Mike T.", xp: 2300, avatar: "👨‍💻", trend: "down" },
  { rank: 3, name: "You", xp: 2150, avatar: "👤", trend: "same" }, // Current User
  { rank: 4, name: "Alex R.", xp: 1900, avatar: "🦸", trend: "up" },
  { rank: 5, name: "Emily W.", xp: 1850, avatar: "🧝‍♀️", trend: "down" },
  { rank: 6, name: "David K.", xp: 1600, avatar: "🧙‍♂️", trend: "same" },
  { rank: 7, name: "Lisa M.", xp: 1450, avatar: "🧚", trend: "up" },
  { rank: 8, name: "John D.", xp: 1300, avatar: "🕵️", trend: "down" },
  { rank: 9, name: "Anna K.", xp: 1200, avatar: "👩‍🎨", trend: "up" },
  { rank: 10, name: "Tom B.", xp: 1150, avatar: "👷", trend: "same" },
];

function RankContent() {
  const [currentLeague] = useState(3); // Gold League

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-yellow-500 bg-yellow-100 p-2 rounded-lg">
                   <Trophy size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Leaderboard</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Top Learners</p>
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-200 shadow-sm">
                <Shield size={20} /> Gold League
              </div>
           </div>
        </div>

        {/* RANK CONTENT BODY */}
        <div className="px-6 lg:px-10 pb-20">
            
            {/* 1. League Selector (Horizontal Scroll) */}
            <div className="w-full text-center py-6 mb-8 border-b-2 border-slate-50">
               <h2 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">Current League</h2>
               <div className="flex justify-center items-center gap-4 sm:gap-8 overflow-x-auto pb-4 no-scrollbar">
                  {LEAGUES.map((league) => (
                     <div key={league.id} className={`flex flex-col items-center gap-3 min-w-[80px] transition-all duration-300 group cursor-pointer ${league.id === currentLeague ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70 scale-90'}`}>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all ${league.color} ${league.id === currentLeague ? 'ring-4 ring-offset-4 ring-[#0ea5e9] shadow-sky-200' : ''}`}>
                           {league.unlocked ? <league.icon size={36} /> : <Lock size={28} />}
                        </div>
                        <span className={`font-bold text-sm uppercase tracking-wider ${league.id === currentLeague ? 'text-[#0ea5e9]' : 'text-slate-400'}`}>{league.name}</span>
                     </div>
                  ))}
               </div>
               <div className="text-sm font-medium text-slate-400 mt-4 bg-slate-50 inline-block px-4 py-2 rounded-full">
                  Top 10 advance to the <span className="text-indigo-500 font-black">Diamond League</span> in 3 days.
               </div>
            </div>

            {/* 2. Top 3 Podium */}
            <div className="flex justify-center items-end gap-4 mb-10 px-4 pt-10">
               {/* 2nd Place */}
               <div className="flex flex-col items-center gap-3 w-1/3 max-w-[140px]">
                  <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl relative">
                     {LEADERBOARD[1].avatar}
                     <div className="absolute -bottom-3 bg-slate-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">#2</div>
                  </div>
                  <div className="text-center w-full">
                     <div className="font-bold text-slate-700 text-sm truncate">{LEADERBOARD[1].name}</div>
                     <div className="text-slate-400 text-xs font-bold">{LEADERBOARD[1].xp} XP</div>
                  </div>
                  <div className="w-full h-32 bg-slate-100 rounded-t-2xl border-t-4 border-slate-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
                  </div>
               </div>

               {/* 1st Place */}
               <div className="flex flex-col items-center gap-3 relative -top-6 w-1/3 max-w-[160px]">
                  <Crown className="text-yellow-400 animate-bounce drop-shadow-sm" size={40} fill="currentColor" />
                  <div className="w-24 h-24 bg-yellow-100 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-5xl relative">
                     {LEADERBOARD[0].avatar}
                     <div className="absolute -bottom-3 bg-yellow-400 text-white text-sm font-bold px-3 py-0.5 rounded-full border-2 border-white">#1</div>
                  </div>
                  <div className="text-center w-full">
                     <div className="font-bold text-slate-700 text-lg truncate">{LEADERBOARD[0].name}</div>
                     <div className="text-yellow-500 text-sm font-bold">{LEADERBOARD[0].xp} XP</div>
                  </div>
                  <div className="w-full h-44 bg-yellow-50 rounded-t-2xl border-t-4 border-yellow-300 shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent"></div>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20"><Trophy size={60} /></div>
                  </div>
               </div>

               {/* 3rd Place */}
               <div className="flex flex-col items-center gap-3 w-1/3 max-w-[140px]">
                  <div className="w-20 h-20 bg-orange-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl relative">
                     {LEADERBOARD[2].avatar} 
                     <div className="absolute -bottom-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">#3</div>
                  </div>
                  <div className="text-center w-full">
                     <div className="font-bold text-slate-700 text-sm truncate">{LEADERBOARD[2].name}</div>
                     <div className="text-slate-400 text-xs font-bold">{LEADERBOARD[2].xp} XP</div>
                  </div>
                  <div className="w-full h-24 bg-orange-50 rounded-t-2xl border-t-4 border-orange-300 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
                  </div>
               </div>
            </div>

            {/* 3. The List (Rank 4+) */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
               {LEADERBOARD.slice(3).map((user) => (
                  <div 
                     key={user.rank} 
                     className={`flex items-center gap-4 p-4 md:p-6 border-b border-slate-100 last:border-b-0 transition hover:bg-slate-50 ${user.name === "You" ? "bg-sky-50 border-l-4 border-l-[#0ea5e9]" : ""}`}
                  >
                     <div className={`font-black w-8 text-center text-lg ${user.name === "You" ? "text-[#0ea5e9]" : "text-slate-400"}`}>{user.rank}</div>
                     <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl border-2 border-slate-200 shadow-sm">
                        {user.avatar}
                     </div>
                     <div className="flex-1">
                        <div className={`font-bold text-base ${user.name === "You" ? "text-[#0ea5e9]" : "text-slate-700"}`}>
                           {user.name} {user.name === "You" && <span className="text-xs bg-sky-200 text-sky-700 px-2 py-0.5 rounded-md ml-2 uppercase tracking-wider">Me</span>}
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{user.xp} XP</div>
                        <div className="hidden sm:block">
                            {user.trend === 'up' && <ArrowUp size={20} className="text-green-500" />}
                            {user.trend === 'down' && <ArrowUp size={20} className="text-red-500 rotate-180" />}
                            {user.trend === 'same' && <div className="w-5 h-1.5 bg-slate-300 rounded-full"></div>}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: My Stats */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" fill="currentColor" /> My Performance
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-center hover:scale-105 transition-transform">
                    <Zap size={24} className="text-[#0ea5e9] mx-auto mb-2" fill="currentColor" />
                    <div className="font-black text-slate-700 text-xl">2,150</div>
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Total XP</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center hover:scale-105 transition-transform">
                    <Flame size={24} className="text-orange-500 mx-auto mb-2" fill="currentColor" />
                    <div className="font-black text-slate-700 text-xl">5</div>
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Day Streak</div>
                </div>
            </div>
          </div>
          
          {/* Widget 2: Weekly Goal */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-2">Weekly Goal</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Target size={24} className="text-red-500" />
                    <div className="flex-1">
                    <div className="text-sm font-bold text-slate-700">Earn 500 XP</div>
                    <div className="h-3 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                        <div className="h-full bg-red-500 w-[80%] rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-bold mt-1 text-right">400 / 500</div>
                    </div>
                </div>
            </div>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Castpotro Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Boost your XP gain by 2x and unlock exclusive league avatars.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Upgrade Now
                </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
                <Sparkles size={140} />
            </div>
        </div>

      </div>

    </div>
  );
}

// --- Main Page Component ---
export default function RankPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <RankContent />
    </Suspense>
  );
}