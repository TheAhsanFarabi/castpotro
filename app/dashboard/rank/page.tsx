"use client";
import React, { useState } from 'react';
import { 
  Shield, Zap, ChevronUp, ChevronDown, 
  Minus, Crown, Clock, Sparkles, Flame, 
  Target, Star, Trophy
} from 'lucide-react';

// --- Mock Data ---
const LEADERBOARD = [
  { rank: 1, name: "Sarah J.", xp: 2450, avatar: "👩‍🚀", trend: "up" },
  { rank: 2, name: "Mike T.", xp: 2300, avatar: "👨‍💻", trend: "down" },
  { rank: 3, name: "You", xp: 2150, avatar: "👤", trend: "same", isMe: true }, // Current User
  { rank: 4, name: "Alex R.", xp: 1900, avatar: "🦸", trend: "up" },
  { rank: 5, name: "Emily W.", xp: 1850, avatar: "🧝‍♀️", trend: "down" },
  { rank: 6, name: "David K.", xp: 1600, avatar: "🧙‍♂️", trend: "same" },
  { rank: 7, name: "Lisa M.", xp: 1450, avatar: "🧚", trend: "up" },
  { rank: 8, name: "John D.", xp: 1300, avatar: "🕵️", trend: "down" },
  { rank: 9, name: "Anna K.", xp: 1200, avatar: "👩‍🎨", trend: "up" },
  { rank: 10, name: "Tom B.", xp: 1150, avatar: "👷", trend: "same" },
  { rank: 11, name: "Gary O.", xp: 900, avatar: "🧔", trend: "down" },
  { rank: 12, name: "Nina P.", xp: 850, avatar: "👩‍🔬", trend: "up" },
];

const RankChangeIcon = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <ChevronUp size={16} className="text-green-500" />;
  if (trend === 'down') return <ChevronDown size={16} className="text-red-400" />;
  return <Minus size={16} className="text-slate-300" />;
};

// --- Component: Individual User Row ---
const UserRow = ({ user, rank }: { user: any, rank: number }) => {
  let rankStyle = "bg-white border-slate-100 hover:border-slate-300";
  let textStyle = "text-slate-500";
  let avatarBorder = "border-slate-200";

  // Hook: Make Top 3 look Special
  if (rank === 1) {
    rankStyle = "bg-gradient-to-r from-yellow-50 to-white border-yellow-200 shadow-sm hover:border-yellow-300";
    textStyle = "text-yellow-600 font-black";
    avatarBorder = "border-yellow-400";
  } else if (rank === 2) {
    rankStyle = "bg-slate-50 border-slate-300 hover:border-slate-400";
    textStyle = "text-slate-500 font-bold";
    avatarBorder = "border-slate-400";
  } else if (rank === 3) {
    rankStyle = "bg-orange-50 border-orange-200 hover:border-orange-300";
    textStyle = "text-orange-600 font-bold";
    avatarBorder = "border-orange-400";
  }

  // Hook: High Contrast for "Me"
  if (user.isMe) {
    rankStyle += " ring-2 ring-sky-400 bg-sky-50/50 z-10 relative";
  }

  return (
    <div className={`group flex items-center gap-4 md:gap-6 p-4 rounded-2xl border-b-[3px] transition-all hover:shadow-md hover:-translate-y-0.5 w-full ${rankStyle}`}>
      
      {/* Rank Number */}
      <div className={`w-10 text-center flex flex-col items-center justify-center shrink-0 ${textStyle}`}>
        <span className="text-xl md:text-2xl font-bold">{rank}</span>
      </div>

      {/* Avatar */}
      <div className={`relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-white flex items-center justify-center text-2xl md:text-3xl border-2 shadow-sm ${avatarBorder}`}>
        {user.avatar}
        {rank === 1 && <Crown size={20} className="absolute -top-3 text-yellow-500 fill-yellow-500 animate-bounce" />}
      </div>

      {/* Name & Trend */}
      <div className="flex-1 min-w-0">
        <h3 className={`truncate text-base md:text-lg ${user.isMe ? "font-black text-sky-700" : "font-bold text-slate-700"}`}>
          {user.name} 
          {user.isMe && <span className="ml-3 inline-block px-2 py-0.5 bg-sky-200 text-sky-700 text-[10px] rounded-full uppercase tracking-wider font-bold align-middle">You</span>}
        </h3>
        <div className="flex items-center gap-1 text-xs md:text-sm text-slate-400 font-medium mt-0.5">
          <RankChangeIcon trend={user.trend} />
          <span>{user.trend === 'same' ? 'Stable' : user.trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      </div>

      {/* XP Score */}
      <div className="text-right shrink-0">
        <div className="font-black text-slate-700 flex items-center justify-end gap-1.5 text-lg md:text-xl">
          {user.xp} <span className="text-xs font-bold text-slate-400 uppercase self-center pt-1">XP</span>
        </div>
      </div>
    </div>
  );
};

export default function RankPage() {
  const [timeLeft] = useState("2d 14h");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* --- GRID LAYOUT (Full Width) --- */}
      {/* 4 Columns Total: Left (3 cols = 75%) | Right (1 col = 25%) */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 px-4 md:px-8 py-6">
        
        {/* === LEFT COLUMN: LEADERBOARD LIST (75%) === */}
        <div className="xl:col-span-3 w-full min-w-0 flex flex-col">
          
          {/* Sticky Header */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 mb-6 sticky top-4 z-30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-2.5 rounded-xl text-yellow-600 border border-yellow-200 shadow-sm">
                    <Trophy size={28} />
                </div>
                <div>
                  <h1 className="font-extrabold text-slate-700 text-xl leading-tight">Gold League</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Top Learners</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Clock size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-600 tabular-nums">{timeLeft}</span>
              </div>
          </div>

          {/* List Content */}
          <main className="space-y-3 pb-24 lg:pb-0">
            {/* Context Text */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <Sparkles size={18} className="text-green-500" />
              <p className="text-sm font-medium text-slate-500">
                Top 7 advance to the <span className="text-cyan-600 font-bold">Diamond League</span>.
              </p>
            </div>

            {/* Render Users */}
            {LEADERBOARD.map((user, index) => {
              const rank = index + 1;
              const isPromotionZoneEnd = rank === 7; // Visual Hook

              return (
                <React.Fragment key={user.name}>
                  <UserRow user={user} rank={rank} />
                  
                  {/* Promotion Zone Separator (The Hook) */}
                  {isPromotionZoneEnd && (
                    <div className="py-4 flex items-center gap-4 opacity-80 w-full animate-pulse">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
                      <div className="shrink-0 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 uppercase tracking-wider shadow-sm">
                        Promotion Zone
                      </div>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </main>
        </div>

        {/* === RIGHT COLUMN: WIDGETS (25%) === */}
        {/* Hidden on mobile, sticky on desktop */}
        <div className="hidden xl:flex xl:col-span-1 flex-col gap-6 sticky top-6 h-fit shrink-0">
          
          {/* Widget 1: My Performance */}
          <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" fill="currentColor" /> My Performance
             </h3>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-center hover:scale-105 transition-transform cursor-default">
                   <Zap size={24} className="text-[#0ea5e9] mx-auto mb-2" fill="currentColor" />
                   <div className="font-black text-slate-700 text-xl">2,150</div>
                   <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Total XP</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center hover:scale-105 transition-transform cursor-default">
                   <Flame size={24} className="text-orange-500 mx-auto mb-2" fill="currentColor" />
                   <div className="font-black text-slate-700 text-xl">5</div>
                   <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Streak</div>
                </div>
             </div>
          </div>

          {/* Widget 2: Weekly Goal */}
          <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
               <span>Weekly Goal</span>
               <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Reset in 2d</span>
             </h3>
             <div className="flex items-center gap-3 mb-2">
                <Target size={28} className="text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                   <div className="text-sm font-bold text-slate-700 mb-1">Earn 500 XP</div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-red-500 w-[80%] rounded-full shadow-lg shadow-red-200"></div>
                   </div>
                   <div className="text-xs text-slate-400 font-bold mt-1 text-right">400 / 500</div>
                </div>
             </div>
          </div>

          {/* Widget 3: Castpotro Plus (Ad Hook) */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#0ea5e9] to-violet-600 text-white shadow-lg shadow-sky-200 group cursor-pointer">
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
             <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
                <Sparkles size={140} />
             </div>
          </div>

        </div>

      </div>

      {/* --- MOBILE STICKY FOOTER --- */}
      {/* Ensures user sees their rank even when list is long on mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-5px_30px_rgba(0,0,0,0.08)] z-50 xl:hidden">
         <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="font-black text-slate-400 text-lg w-8 text-center">{LEADERBOARD.find(u => u.isMe)?.rank}</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-xl">
                  {LEADERBOARD.find(u => u.isMe)?.avatar}
                </div>
                <div>
                   <div className="font-black text-slate-700 text-base">You</div>
                   <div className="text-xs font-medium text-slate-400">{LEADERBOARD.find(u => u.isMe)?.xp} XP</div>
                </div>
             </div>
             <button className="bg-sky-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-sky-200 hover:scale-105 transition active:scale-95 font-bold text-sm flex items-center gap-2">
                <Zap size={16} fill="currentColor" />
                Train
             </button>
         </div>
      </div>

    </div>
  );
}