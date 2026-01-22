"use client";
import { Zap } from "lucide-react";

// SDG Colors Helper
const getSDGColor = (id: number) => {
  const colors = ["#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"];
  return colors[id - 1] || "#ccc";
};

export default function ImpactDNA({ dna }: { dna: Record<number, number> }) {
  // Sort top 5 active SDGs
  const topSDGs = Object.entries(dna)
    .map(([id, xp]) => ({ id: parseInt(id), xp }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  const maxXP = Math.max(...topSDGs.map(s => s.xp), 100);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
           <Zap size={20} />
        </div>
        <div>
           <h3 className="font-black text-slate-700">Your Impact DNA</h3>
           <p className="text-xs text-slate-400 font-bold uppercase">Top Areas of Change</p>
        </div>
      </div>

      {topSDGs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-bold bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Complete quests to build your DNA!
        </div>
      ) : (
        <div className="space-y-4">
          {topSDGs.map((item) => (
            <div key={item.id} className="group">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 uppercase tracking-wider">SDG {item.id}</span>
                <span className="text-slate-400">{item.xp} XP</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                   className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110"
                   style={{ 
                     width: `${(item.xp / maxXP) * 100}%`,
                     backgroundColor: getSDGColor(item.id)
                   }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}