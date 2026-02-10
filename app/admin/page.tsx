// gemini/app/admin/page.tsx

import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Target, TrendingUp, Activity } from "lucide-react";
import { getUserGrowthData } from "@/app/actions/admin";
import UserGrowthChart from "./UserGrowthChart";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Unauthorized. Please log in.</p>
      </div>
    );
  }

  // Identify the user's role
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  // Fetch data based on Role
  const [
    userCount,
    courseCount,
    questCount,
    pendingSubmissions,
    recentActivityData,
    recentSubmissions,
    myCourses,
    initialGrowthData,
  ] = await Promise.all([
    // User Count
    isSuperAdmin
      ? prisma.user.count({ where: { role: "USER" } })
      : prisma.enrollment.count({ where: { course: { creatorId: userId } } }),

    // Course Count
    isSuperAdmin
      ? prisma.course.count()
      : prisma.course.count({ where: { creatorId: userId } }),

    prisma.quest.count({ where: { isActive: true } }),

    // Pending Review Count
    prisma.questSubmission.count({
      where: {
        status: "PENDING",
        ...(isSuperAdmin
          ? {}
          : {
              user: {
                enrollments: { some: { course: { creatorId: userId } } },
              },
            }),
      },
    }),

    // Recent Activity Feed
    isSuperAdmin
      ? prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, createdAt: true, role: true },
        })
      : prisma.enrollment.findMany({
          where: { course: { creatorId: userId } },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, role: true } },
            course: { select: { title: true } },
          },
        }),

    // Recent Quest Submissions
    prisma.questSubmission.findMany({
      where: isSuperAdmin
        ? {}
        : {
            user: { enrollments: { some: { course: { creatorId: userId } } } },
          },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, quest: true },
    }),

    prisma.course.findMany({
      where: { creatorId: userId },
      select: { id: true, title: true },
    }),

    getUserGrowthData("monthly"),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">
            {isSuperAdmin ? "Admin Dashboard" : "Instructor Dashboard"}
          </h1>
          <p className="text-slate-400 max-w-lg">
            {isSuperAdmin
              ? "Platform-wide overview."
              : "Your course performance overview."}
            {isSuperAdmin && (
              <>
                {" "}
                You have{" "}
                <strong className="text-white">
                  {pendingSubmissions} pending
                </strong>{" "}
                quest submissions to review.
              </>
            )}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Activity size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6`}
      >
        <StatCard
          title={isSuperAdmin ? "Total Learners" : "My Learners"}
          value={userCount}
          icon={Users}
          color="bg-indigo-500"
          trend={isSuperAdmin ? "+12% vs last week" : "Total Enrollments"}
        />
        <StatCard
          title={isSuperAdmin ? "Active Courses" : "My Courses"}
          value={courseCount}
          icon={BookOpen}
          color="bg-emerald-500"
          trend="Active"
        />

        {/* Only show these cards if the user is a SUPER_ADMIN */}
        {isSuperAdmin && (
          <>
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
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <UserGrowthChart initialData={initialGrowthData} courses={myCourses} />

        {/* Live Activity Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-xl text-slate-800 mb-6">
            Live Activity
          </h3>
          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {recentActivityData.map((item: any) => {
              const isEnrollment = "course" in item;
              const user = isEnrollment ? item.user : item;
              const title = isEnrollment ? "New Enrollment" : "New User Joined";
              const detail = isEnrollment
                ? `joined your course "${item.course.title}"`
                : `started their journey as a ${user.role.toLowerCase()}`;

              return (
                <div key={item.id} className="flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                      {title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="font-bold text-slate-800">
                        {user.name || "Anonymous"}
                      </span>{" "}
                      {detail}.
                    </p>
                    <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}

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

            {recentActivityData.length === 0 &&
              recentSubmissions.length === 0 && (
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
