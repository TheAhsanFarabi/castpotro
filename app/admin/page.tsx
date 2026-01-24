import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Target, TrendingUp, Activity } from "lucide-react";
import { getUserGrowthData } from "@/app/actions/admin";
import UserGrowthChart from "./UserGrowthChart"; // Import the new component

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    userCount,
    courseCount,
    questCount,
    pendingSubmissions,
    recentUsers,
    recentSubmissions,
    initialGrowthData, // Get the default (monthly) data
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.course.count(),
    prisma.quest.count({ where: { isActive: true } }),
    prisma.questSubmission.count({ where: { status: "PENDING" } }),

    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true, role: true },
    }),

    prisma.questSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, quest: true },
    }),

    getUserGrowthData("monthly"), // Fetch initial data
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-slate-400 max-w-lg">
            Platform overview. You have{" "}
            <strong className="text-white">{pendingSubmissions} pending</strong>{" "}
            quest submissions to review.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Activity size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Learners"
          value={userCount}
          icon={Users}
          color="bg-indigo-500"
          trend="+12% vs last week"
        />
        <StatCard
          title="Active Courses"
          value={courseCount}
          icon={BookOpen}
          color="bg-emerald-500"
          trend="Stable"
        />
        <StatCard
          title="Active Quests"
          value={questCount}
          icon={Target}
          color="bg-amber-500"
          trend="High engagement"
        />
        <StatCard
          title="Pending Review"
          value={pendingSubmissions}
          icon={TrendingUp}
          color={
            pendingSubmissions > 0
              ? "bg-rose-500 animate-pulse"
              : "bg-slate-400"
          }
          trend="Needs attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Use the new Client Component here */}
        <UserGrowthChart initialData={initialGrowthData} />

        {/* Activity Feed */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-xl text-slate-800 mb-6">
            Live Activity
          </h3>
          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Users size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                    New User Joined
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-800">
                      {u.name || "Anonymous"}
                    </span>{" "}
                    just started their journey as a {u.role.toLowerCase()}.
                  </p>
                  <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentSubmissions.map((s) => (
              <div key={s.id} className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Target size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-amber-700 transition-colors">
                    Quest Submitted
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-800">
                      {s.user.name}
                    </span>{" "}
                    completed{" "}
                    <span className="text-indigo-600 font-bold">
                      "{s.quest.title}"
                    </span>
                    .
                  </p>
                  <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && recentSubmissions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm font-medium">
                  No recent activity found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 group-hover:text-slate-700 transition-colors">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl text-white shadow-lg shadow-indigo-100 transform group-hover:rotate-12 transition-transform ${color}`}
        >
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
        <TrendingUp size={12} /> {trend}
      </div>
    </div>
  );
}
