"use client";

import { useState, useTransition } from "react";
import { Calendar, BarChart3, PieChart, Filter } from "lucide-react";
import { getUserGrowthData } from "@/app/actions/admin";

export default function UserGrowthChart({
  initialData,
  courses = [],
  type = "learner", // Add a type prop to determine the display mode
}: {
  initialData: { name: string; value: number }[];
  courses?: { id: string; title: string }[];
  type?: "learner" | "applicant";
}) {
  const [period, setPeriod] = useState<"monthly" | "daily" | "yearly">(
    "monthly",
  );
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const updateData = (
    newPeriod: "monthly" | "daily" | "yearly",
    courseId: string,
  ) => {
    startTransition(async () => {
      const newData = await getUserGrowthData(newPeriod, courseId);
      setData(newData);
    });
  };

  const handlePeriodToggle = (newPeriod: "monthly" | "daily" | "yearly") => {
    if (period === newPeriod) return;
    setPeriod(newPeriod);
    updateData(newPeriod, selectedCourse);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    updateData(period, courseId);
  };

  const maxGrowth = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[400px]">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            {/* Dynamic Title */}
            {type === "applicant" ? "Applicant Growth" : "Learner Growth"}
            {isPending && (
              <span className="text-xs font-normal text-indigo-500 animate-pulse">
                Updating...
              </span>
            )}
          </h3>
          <p className="text-slate-400 text-sm">
            {/* Dynamic Subtitle */}
            {type === "applicant" ? "New applicants" : "New enrollments"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hide the course filter if the user is viewing applicant data */}
          {type !== "applicant" && (
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={selectedCourse}
                onChange={handleCourseChange}
                className="pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none border-none cursor-pointer appearance-none hover:bg-slate-200 transition-colors"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["daily", "monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodToggle(p)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${period === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                {p === "daily" ? (
                  <BarChart3 size={14} />
                ) : p === "monthly" ? (
                  <Calendar size={14} />
                ) : (
                  <PieChart size={14} />
                )}
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`flex items-end justify-between gap-2 h-56 w-full mt-auto pb-2 border-b border-slate-100 border-dashed transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}
      >
        {data.map((item, i) => {
          const heightPercent = Math.round((item.value / maxGrowth) * 100);
          return (
            <div
              key={`${item.name}-${i}`}
              className="flex flex-col items-center justify-end h-full flex-1 group relative cursor-default"
            >
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl z-20 pointer-events-none whitespace-nowrap">
                {item.value} {type === "applicant" ? "Applicants" : "Users"}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>
              <div
                className="w-4 md:w-6 rounded-t-2xl bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-500 ease-out group-hover:w-5 md:group-hover:w-8 group-hover:brightness-110"
                style={{ height: `${Math.max(heightPercent, 8)}%` }}
              />
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mt-4 tracking-wider text-center w-full truncate">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
