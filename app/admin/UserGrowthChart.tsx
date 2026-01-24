"use client";

import { useState, useTransition } from "react";
import { Calendar, BarChart3, PieChart } from "lucide-react";
import { getUserGrowthData } from "@/app/actions/admin";

type DataPoint = { name: string; value: number };
type Period = "monthly" | "daily" | "yearly";

export default function UserGrowthChart({
  initialData,
}: {
  initialData: DataPoint[];
}) {
  const [period, setPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (newPeriod: Period) => {
    if (period === newPeriod) return;
    setPeriod(newPeriod);

    startTransition(async () => {
      const newData = await getUserGrowthData(newPeriod);
      setData(newData);
    });
  };

  const maxGrowth = Math.max(...data.map((d) => d.value), 1);

  // Helper for dynamic description text
  const getDescription = () => {
    switch (period) {
      case "daily":
        return "New registrations (Last 7 Days)";
      case "monthly":
        return "New registrations (Last 6 Months)";
      case "yearly":
        return "New registrations (Last 5 Years)";
    }
  };

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[350px]">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            User Growth
            {isPending && (
              <span className="text-xs font-normal text-indigo-500 animate-pulse">
                Updating...
              </span>
            )}
          </h3>
          <p className="text-slate-400 text-sm">{getDescription()}</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => handleToggle("daily")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${period === "daily" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <BarChart3 size={14} /> Daily
          </button>
          <button
            onClick={() => handleToggle("monthly")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${period === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Calendar size={14} /> Monthly
          </button>
          <button
            onClick={() => handleToggle("yearly")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${period === "yearly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <PieChart size={14} /> Yearly
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div
        className={`flex items-end justify-between gap-2 h-56 w-full mt-auto pb-2 border-b border-slate-100 border-dashed transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}
      >
        {data.map((item, i) => {
          const heightPercent = Math.round((item.value / maxGrowth) * 100);
          const displayHeight = heightPercent < 8 ? 8 : heightPercent;

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end h-full flex-1 group relative cursor-default"
            >
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl z-20 pointer-events-none whitespace-nowrap">
                {item.value} Users
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>

              {/* The Bar */}
              <div
                className="w-4 md:w-6 rounded-t-2xl bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-500 ease-out group-hover:w-5 md:group-hover:w-8 group-hover:brightness-110 relative z-10"
                style={{ height: `${displayHeight}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
              </div>

              {/* X-Axis Label */}
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mt-4 tracking-wider group-hover:text-indigo-600 transition-colors text-center w-full truncate px-1">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
