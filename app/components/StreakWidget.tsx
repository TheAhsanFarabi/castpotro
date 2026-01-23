// app/components/StreakWidget.tsx
"use client";

import { Flame } from "lucide-react";

type StreakProps = {
  streak: number;
  weekActivity: boolean[];
};

export default function StreakWidget({ streak, weekActivity }: StreakProps) {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-black text-slate-700 text-lg">Daily Streak</h3>
          <p className="text-slate-400 text-xs font-bold uppercase">
            {streak > 0 ? "You're on fire!" : "Start a streak today!"}
          </p>
        </div>
        <div
          className={`p-2 rounded-lg ${streak > 0 ? "bg-orange-100 text-orange-600 animate-pulse" : "bg-slate-100 text-slate-300"}`}
        >
          <Flame size={24} fill="currentColor" />
        </div>
      </div>

      <div className="text-4xl font-black text-slate-800 mb-4">
        {streak} <span className="text-lg text-slate-400 font-bold">Days</span>
      </div>

      <div className="flex gap-1 justify-between">
        {weekDays.map((d, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 ${
              weekActivity[i]
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-slate-100 text-slate-300"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
