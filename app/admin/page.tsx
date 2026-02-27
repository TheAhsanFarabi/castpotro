// // gemini/app/admin/page.tsx

// import { prisma } from "@/lib/prisma";
// import { Users, BookOpen, Target, TrendingUp, Activity } from "lucide-react";
// import { getUserGrowthData } from "@/app/actions/admin";
// import UserGrowthChart from "./UserGrowthChart";
// import { cookies } from "next/headers";

// export const dynamic = "force-dynamic";

// export default async function AdminDashboard() {
//   const cookieStore = await cookies();
//   const userId = cookieStore.get("userId")?.value;

//   if (!userId) {
//     return (
//       <div className="p-8 text-center">
//         <p className="text-slate-500">Unauthorized. Please log in.</p>
//       </div>
//     );
//   }

//   // Identify the user's role
//   const currentUser = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { role: true },
//   });

//   const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

//   // Fetch data based on Role
//   const [
//     userCount,
//     courseCount,
//     questCount,
//     pendingSubmissions,
//     recentActivityData,
//     recentSubmissions,
//     myCourses,
//     initialGrowthData,
//   ] = await Promise.all([
//     // User Count
//     isSuperAdmin
//       ? prisma.user.count({ where: { role: "USER" } })
//       : prisma.enrollment.count({ where: { course: { creatorId: userId } } }),

//     // Course Count
//     isSuperAdmin
//       ? prisma.course.count()
//       : prisma.course.count({ where: { creatorId: userId } }),

//     prisma.quest.count({ where: { isActive: true } }),

//     // Pending Review Count
//     prisma.questSubmission.count({
//       where: {
//         status: "PENDING",
//         ...(isSuperAdmin
//           ? {}
//           : {
//               user: {
//                 enrollments: { some: { course: { creatorId: userId } } },
//               },
//             }),
//       },
//     }),

//     // Recent Activity Feed
//     isSuperAdmin
//       ? prisma.user.findMany({
//           take: 5,
//           orderBy: { createdAt: "desc" },
//           select: { id: true, name: true, createdAt: true, role: true },
//         })
//       : prisma.enrollment.findMany({
//           where: { course: { creatorId: userId } },
//           take: 5,
//           orderBy: { createdAt: "desc" },
//           include: {
//             user: { select: { id: true, name: true, role: true } },
//             course: { select: { title: true } },
//           },
//         }),

//     // Recent Quest Submissions
//     prisma.questSubmission.findMany({
//       where: isSuperAdmin
//         ? {}
//         : {
//             user: { enrollments: { some: { course: { creatorId: userId } } } },
//           },
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       include: { user: true, quest: true },
//     }),

//     prisma.course.findMany({
//       where: { creatorId: userId },
//       select: { id: true, title: true },
//     }),

//     getUserGrowthData("monthly"),
//   ]);

//   return (
//     <div className="space-y-8">
//       {/* Welcome Banner */}
//       <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-black mb-2">
//             {isSuperAdmin ? "Admin Dashboard" : "Instructor Dashboard"}
//           </h1>
//           <p className="text-slate-400 max-w-lg">
//             {isSuperAdmin
//               ? "Platform-wide overview."
//               : "Your course performance overview."}
//             {isSuperAdmin && (
//               <>
//                 {" "}
//                 You have{" "}
//                 <strong className="text-white">
//                   {pendingSubmissions} pending
//                 </strong>{" "}
//                 quest submissions to review.
//               </>
//             )}
//           </p>
//         </div>
//         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
//           <Activity size={200} />
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div
//         className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-6`}
//       >
//         <StatCard
//           title={isSuperAdmin ? "Total Learners" : "My Learners"}
//           value={userCount}
//           icon={Users}
//           color="bg-indigo-500"
//           trend={isSuperAdmin ? "+12% vs last week" : "Total Enrollments"}
//         />
//         <StatCard
//           title={isSuperAdmin ? "Active Courses" : "My Courses"}
//           value={courseCount}
//           icon={BookOpen}
//           color="bg-emerald-500"
//           trend="Active"
//         />

//         {/* Only show these cards if the user is a SUPER_ADMIN */}
//         {isSuperAdmin && (
//           <>
//             <StatCard
//               title="Active Quests"
//               value={questCount}
//               icon={Target}
//               color="bg-amber-500"
//               trend="High engagement"
//             />
//             <StatCard
//               title="Pending Review"
//               value={pendingSubmissions}
//               icon={TrendingUp}
//               color={
//                 pendingSubmissions > 0
//                   ? "bg-rose-500 animate-pulse"
//                   : "bg-slate-400"
//               }
//               trend="Needs attention"
//             />
//           </>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <UserGrowthChart initialData={initialGrowthData} courses={myCourses} />

//         {/* Live Activity Section */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//           <h3 className="font-bold text-xl text-slate-800 mb-6">
//             Live Activity
//           </h3>
//           <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
//             {recentActivityData.map((item: any) => {
//               const isEnrollment = "course" in item;
//               const user = isEnrollment ? item.user : item;
//               const title = isEnrollment ? "New Enrollment" : "New User Joined";
//               const detail = isEnrollment
//                 ? `joined your course "${item.course.title}"`
//                 : `started their journey as a ${user.role.toLowerCase()}`;

//               return (
//                 <div key={item.id} className="flex gap-4 items-start group">
//                   <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
//                     <Users size={14} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
//                       {title}
//                     </p>
//                     <p className="text-xs text-slate-500 leading-relaxed">
//                       <span className="font-bold text-slate-800">
//                         {user.name || "Anonymous"}
//                       </span>{" "}
//                       {detail}.
//                     </p>
//                     <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
//                       {new Date(item.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}

//             {recentSubmissions.map((s) => (
//               <div key={s.id} className="flex gap-4 items-start group">
//                 <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
//                   <Target size={14} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700 group-hover:text-amber-700 transition-colors">
//                     Quest Submitted
//                   </p>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     <span className="font-bold text-slate-800">
//                       {s.user.name}
//                     </span>{" "}
//                     completed{" "}
//                     <span className="text-indigo-600 font-bold">
//                       "{s.quest.title}"
//                     </span>
//                     .
//                   </p>
//                   <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
//                     {new Date(s.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             ))}

//             {recentActivityData.length === 0 &&
//               recentSubmissions.length === 0 && (
//                 <div className="text-center py-10">
//                   <p className="text-slate-400 text-sm font-medium">
//                     No recent activity found.
//                   </p>
//                 </div>
//               )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon: Icon, color, trend }: any) {
//   return (
//     <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 group-hover:text-slate-700 transition-colors">
//             {title}
//           </p>
//           <h3 className="text-3xl font-black text-slate-800">{value}</h3>
//         </div>
//         <div
//           className={`p-3 rounded-xl text-white shadow-lg shadow-indigo-100 transform group-hover:rotate-12 transition-transform ${color}`}
//         >
//           <Icon size={24} />
//         </div>
//       </div>
//       <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
//         <TrendingUp size={12} /> {trend}
//       </div>
//     </div>
//   );
// }

// gemini/app/admin/page.tsx

import { prisma } from "@/lib/prisma";
import {
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Activity,
  Briefcase,
} from "lucide-react";
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
  const isRecruiter = currentUser?.role === "RECRUITER";

  // Shared variables for the view
  let stat1 = {
    title: "",
    value: 0,
    icon: Users,
    color: "bg-indigo-500",
    trend: "",
    show: true,
  };
  let stat2 = {
    title: "",
    value: 0,
    icon: BookOpen,
    color: "bg-emerald-500",
    trend: "",
    show: true,
  };
  let stat3 = {
    title: "",
    value: 0,
    icon: Target,
    color: "bg-amber-500",
    trend: "",
    show: false,
  };
  let stat4 = {
    title: "",
    value: 0,
    icon: TrendingUp,
    color: "bg-slate-400",
    trend: "",
    show: false,
  };

  let recentActivityFeed: any[] = [];
  let recentSubmissionsData: any[] = [];
  let growthData: any[] = [];
  let myCoursesData: any[] = [];

  // ==========================================
  // RECRUITER DATA FETCHING
  // ==========================================
  if (isRecruiter) {
    const [jobCount, appCount, pendingApps, recentApps, allApps] =
      await Promise.all([
        prisma.job.count({ where: { recruiterId: userId } }),
        prisma.application.count({ where: { job: { recruiterId: userId } } }),
        prisma.application.count({
          where: { job: { recruiterId: userId }, status: "PENDING" },
        }),
        prisma.application.findMany({
          where: { job: { recruiterId: userId } },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, role: true } },
            job: { select: { role: true, company: true } },
          },
        }),
        prisma.application.findMany({
          where: { job: { recruiterId: userId } },
          select: { createdAt: true },
        }),
      ]);

    // Recruiter specific stats
    stat1 = {
      title: "Active Jobs",
      value: jobCount,
      icon: Briefcase,
      color: "bg-indigo-500",
      trend: "Your postings",
      show: true,
    };
    stat2 = {
      title: "Total Applicants",
      value: appCount,
      icon: Users,
      color: "bg-emerald-500",
      trend: "Pipeline",
      show: true,
    };
    stat3 = {
      title: "Pending Reviews",
      value: pendingApps,
      icon: TrendingUp,
      color: pendingApps > 0 ? "bg-rose-500 animate-pulse" : "bg-slate-400",
      trend: "Needs attention",
      show: true,
    };

    recentActivityFeed = recentApps.map((app) => ({
      ...app,
      type: "APPLICATION",
    }));

    // Generate Application Growth Data dynamically for the chart
    const monthMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthMap.set(
        d.toLocaleString("default", { month: "short", year: "2-digit" }),
        0,
      );
    }
    allApps.forEach((app) => {
      const key = app.createdAt.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (monthMap.has(key)) monthMap.set(key, monthMap.get(key)! + 1);
    });
    growthData = Array.from(monthMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // ==========================================
    // SUPER_ADMIN / INSTRUCTOR DATA FETCHING
    // ==========================================
  } else {
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
      isSuperAdmin
        ? prisma.user.count({ where: { role: "USER" } })
        : prisma.enrollment.count({ where: { course: { creatorId: userId } } }),
      isSuperAdmin
        ? prisma.course.count()
        : prisma.course.count({ where: { creatorId: userId } }),
      prisma.quest.count({ where: { isActive: true } }),
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
      prisma.questSubmission.findMany({
        where: isSuperAdmin
          ? {}
          : {
              user: {
                enrollments: { some: { course: { creatorId: userId } } },
              },
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

    // Setup stats mapping
    stat1 = {
      title: isSuperAdmin ? "Total Learners" : "My Learners",
      value: userCount,
      icon: Users,
      color: "bg-indigo-500",
      trend: isSuperAdmin ? "+12% vs last week" : "Total Enrollments",
      show: true,
    };
    stat2 = {
      title: isSuperAdmin ? "Active Courses" : "My Courses",
      value: courseCount,
      icon: BookOpen,
      color: "bg-emerald-500",
      trend: "Active",
      show: true,
    };

    if (isSuperAdmin) {
      stat3 = {
        title: "Active Quests",
        value: questCount,
        icon: Target,
        color: "bg-amber-500",
        trend: "High engagement",
        show: true,
      };
      stat4 = {
        title: "Pending Review",
        value: pendingSubmissions,
        icon: TrendingUp,
        color:
          pendingSubmissions > 0 ? "bg-rose-500 animate-pulse" : "bg-slate-400",
        trend: "Needs attention",
        show: true,
      };
    }

    recentActivityFeed = recentActivityData;
    recentSubmissionsData = recentSubmissions;
    myCoursesData = myCourses;
    growthData = initialGrowthData;
  }

  // Define Banner UI dynamically
  const dashboardTitle = isSuperAdmin
    ? "Admin Dashboard"
    : isRecruiter
      ? "Recruiter Dashboard"
      : "Instructor Dashboard";
  let dashboardSubtitle = isSuperAdmin
    ? "Platform-wide overview."
    : isRecruiter
      ? "Your job listings and applications overview."
      : "Your course performance overview.";

  if (isSuperAdmin) {
    dashboardSubtitle = `Platform-wide overview. You have ${stat4.value} pending quest submissions to review.`;
  } else if (isRecruiter) {
    dashboardSubtitle = `Your talent pipeline overview. You have ${stat3.value} pending job applications to review.`;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">{dashboardTitle}</h1>
          <p className="text-slate-400 max-w-lg">{dashboardSubtitle}</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Activity size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : isRecruiter ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}
      >
        {stat1.show && <StatCard {...stat1} />}
        {stat2.show && <StatCard {...stat2} />}
        {stat3.show && <StatCard {...stat3} />}
        {stat4.show && <StatCard {...stat4} />}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* We reuse the UserGrowthChart component, but pass our dynamically generated Application growth data to it if Recruiter */}
        {/* <UserGrowthChart initialData={growthData} courses={myCoursesData} /> */}
        <UserGrowthChart
          initialData={growthData}
          courses={myCoursesData}
          type={isRecruiter ? "applicant" : "learner"}
        />

        {/* Live Activity Section */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-xl text-slate-800 mb-6">
            Live Activity
          </h3>
          <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {recentActivityFeed.map((item: any) => {
              // 1. Recruiter Application Activity UI
              if (item.type === "APPLICATION") {
                return (
                  <div key={item.id} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        New Application
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-800">
                          {item.user.name || "Anonymous"}
                        </span>{" "}
                        applied for{" "}
                        <span className="text-indigo-600 font-bold">
                          "{item.job.role}"
                        </span>
                        .
                      </p>
                      <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              }

              // 2. Standard Admin/Instructor Activity UI
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

            {/* Admin/Instructor Quests Feed */}
            {recentSubmissionsData.map((s) => (
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

            {recentActivityFeed.length === 0 &&
              recentSubmissionsData.length === 0 && (
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
