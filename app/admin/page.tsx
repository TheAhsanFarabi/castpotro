// import { prisma } from "@/lib/prisma";
// import {
//   Users,
//   BookOpen,
//   Target,
//   TrendingUp,
//   Activity,
//   ArrowUpRight,
// } from "lucide-react";
// import Link from "next/link";

// export default async function AdminDashboard() {
//   // 1. Fetch Real Stats
//   const userCount = await prisma.user.count({ where: { role: "USER" } });
//   const courseCount = await prisma.course.count();
//   const questCount = await prisma.quest.count({ where: { isActive: true } });

//   // Fetch Pending Submissions
//   const pendingSubmissions = await prisma.questSubmission.count({
//     where: { status: "PENDING" },
//   });

//   // 2. Fetch Recent Activities (Combine new users + submissions)
//   const recentUsers = await prisma.user.findMany({
//     take: 5,
//     orderBy: { createdAt: "desc" },
//     select: { id: true, name: true, createdAt: true, role: true },
//   });

//   const recentSubmissions = await prisma.questSubmission.findMany({
//     take: 5,
//     orderBy: { createdAt: "desc" },
//     include: { user: true, quest: true },
//   });

//   // Mock Data for "Growth Chart" (Since we don't store historical snapshots)
//   const growthData = [
//     40,
//     65,
//     50,
//     85,
//     90,
//     100,
//     userCount > 100 ? 100 : userCount + 20,
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Welcome Banner */}
//       <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
//           <p className="text-slate-400 max-w-lg">
//             Platform overview. You have{" "}
//             <strong className="text-white">{pendingSubmissions} pending</strong>{" "}
//             quest submissions to review.
//           </p>
//         </div>
//         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
//           <Activity size={200} />
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Learners"
//           value={userCount}
//           icon={Users}
//           color="bg-indigo-500"
//           trend="+12% vs last week"
//         />
//         <StatCard
//           title="Active Courses"
//           value={courseCount}
//           icon={BookOpen}
//           color="bg-emerald-500"
//           trend="Stable"
//         />
//         <StatCard
//           title="Active Quests"
//           value={questCount}
//           icon={Target}
//           color="bg-amber-500"
//           trend="High engagement"
//         />
//         <StatCard
//           title="Pending Review"
//           value={pendingSubmissions}
//           icon={TrendingUp}
//           color={
//             pendingSubmissions > 0
//               ? "bg-rose-500 animate-pulse"
//               : "bg-slate-400"
//           }
//           trend="Needs attention"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Growth Chart (Mock Visual) */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="font-bold text-xl text-slate-800">User Growth</h3>
//               <p className="text-slate-400 text-sm">
//                 New registrations over the last 7 days
//               </p>
//             </div>
//             <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600">
//               <ArrowUpRight size={20} />
//             </button>
//           </div>

//           {/* CSS Bar Chart */}
//           <div className="flex items-end justify-between gap-4 h-48 w-full mt-auto">
//             {growthData.map((h, i) => (
//               <div
//                 key={i}
//                 className="w-full bg-slate-100 rounded-t-xl relative group"
//               >
//                 <div
//                   className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-600"
//                   style={{ height: `${h}%` }}
//                 ></div>
//                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
//                   {h} users
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase">
//             <span>Mon</span>
//             <span>Tue</span>
//             <span>Wed</span>
//             <span>Thu</span>
//             <span>Fri</span>
//             <span>Sat</span>
//             <span>Sun</span>
//           </div>
//         </div>

//         {/* Activity Feed */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
//           <h3 className="font-bold text-xl text-slate-800 mb-6">
//             Live Activity
//           </h3>
//           <div className="space-y-6">
//             {recentUsers.map((u) => (
//               <div key={u.id} className="flex gap-4 items-start">
//                 <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700">
//                     New User Joined
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     <span className="font-medium text-slate-800">{u.name}</span>{" "}
//                     registered as {u.role.toLowerCase()}.
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {recentSubmissions.map((s) => (
//               <div key={s.id} className="flex gap-4 items-start">
//                 <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700">
//                     Quest Submitted
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     <span className="font-medium text-slate-800">
//                       {s.user.name}
//                     </span>{" "}
//                     completed{" "}
//                     <span className="text-indigo-600">{s.quest.title}</span>.
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reusable Stat Component
// function StatCard({ title, value, icon: Icon, color, trend }: any) {
//   return (
//     <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
//             {title}
//           </p>
//           <h3 className="text-3xl font-black text-slate-800">{value}</h3>
//         </div>
//         <div
//           className={`p-3 rounded-xl text-white shadow-lg shadow-indigo-100 ${color}`}
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

// import { prisma } from "@/lib/prisma";
// import { getUserGrowthData } from "@/app/actions/admin"; // Ensure this action exists
// import UserGrowthChart from "./UserGrowthChart"; // Ensure this component exists
// import {
//   Users,
//   BookOpen,
//   Calendar,
//   Trophy,
//   TrendingUp,
//   Activity,
// } from "lucide-react";

// export const dynamic = "force-dynamic"; // Ensure fresh data on every visit

// export default async function AdminDashboard() {
//   // 1. Fetch all dashboard data in parallel for performance
//   const [userCount, courseCount, eventCount, questCount, growthData] =
//     await Promise.all([
//       prisma.user.count(),
//       prisma.course.count(),
//       prisma.event.count(),
//       prisma.quest.count(),
//       getUserGrowthData(),
//     ]);

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
//           <p className="text-slate-500">
//             Overview of platform performance and key metrics.
//           </p>
//         </div>
//         <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
//           <Activity size={16} /> System Operational
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard
//           icon={Users}
//           label="Total Users"
//           value={userCount}
//           color="bg-blue-50 text-blue-600"
//         />
//         <StatCard
//           icon={BookOpen}
//           label="Courses"
//           value={courseCount}
//           color="bg-purple-50 text-purple-600"
//         />
//         <StatCard
//           icon={Calendar}
//           label="Events"
//           value={eventCount}
//           color="bg-pink-50 text-pink-600"
//         />
//         <StatCard
//           icon={Trophy}
//           label="Active Quests"
//           value={questCount}
//           color="bg-amber-50 text-amber-600"
//         />
//       </div>

//       {/* Analytics Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* User Growth Chart (Takes up 2/3 width on large screens) */}
//         <div className="lg:col-span-2 h-full min-h-[400px]">
//           <UserGrowthChart data={growthData} />
//         </div>

//         {/* Recent Activity / Placeholder (Takes up 1/3 width) */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
//           <div className="mb-4">
//             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               <TrendingUp size={20} className="text-slate-400" />
//               Quick Insights
//             </h3>
//           </div>

//           <div className="flex-1 flex flex-col justify-center gap-6 text-sm">
//             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//               <span className="block text-slate-400 font-bold text-xs uppercase mb-1">
//                 Top Quest
//               </span>
//               <span className="font-bold text-slate-700">"The Early Bird"</span>
//             </div>

//             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//               <span className="block text-slate-400 font-bold text-xs uppercase mb-1">
//                 Upcoming Event
//               </span>
//               <span className="font-bold text-slate-700">
//                 AI Summit Dhaka 2026
//               </span>
//             </div>

//             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
//               <span className="block text-slate-400 font-bold text-xs uppercase mb-1">
//                 Newest Job
//               </span>
//               <span className="font-bold text-slate-700">
//                 Jr. AI Engineer (TigerIT)
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- Helper Component: Stat Card ---
// function StatCard({
//   icon: Icon,
//   label,
//   value,
//   color,
// }: {
//   icon: any;
//   label: string;
//   value: number;
//   color: string;
// }) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
//       <div
//         className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
//       >
//         <Icon size={24} />
//       </div>
//       <div>
//         <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
//         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
//           {label}
//         </p>
//       </div>
//     </div>
//   );
// }

// import { prisma } from "@/lib/prisma";
// import {
//   Users,
//   BookOpen,
//   Target,
//   TrendingUp,
//   Activity,
//   ArrowUpRight,
// } from "lucide-react";
// import { getUserGrowthData } from "@/app/actions/admin"; // Import the action we created
// import Link from "next/link";

// export const dynamic = "force-dynamic";

// export default async function AdminDashboard() {
//   // 1. Fetch Real Stats
//   const userCount = await prisma.user.count({ where: { role: "USER" } });
//   const courseCount = await prisma.course.count();
//   const questCount = await prisma.quest.count({ where: { isActive: true } });

//   // Fetch Pending Submissions
//   const pendingSubmissions = await prisma.questSubmission.count({
//     where: { status: "PENDING" },
//   });

//   // 2. Fetch Recent Activities
//   const recentUsers = await prisma.user.findMany({
//     take: 5,
//     orderBy: { createdAt: "desc" },
//     select: { id: true, name: true, createdAt: true, role: true },
//   });

//   const recentSubmissions = await prisma.questSubmission.findMany({
//     take: 5,
//     orderBy: { createdAt: "desc" },
//     include: { user: true, quest: true },
//   });

//   // 3. Fetch Real Growth Data
//   const growthRaw = await getUserGrowthData();

//   // Calculate max value to normalize bars to % height
//   const maxGrowth = Math.max(...growthRaw.map((d) => d.value), 1); // Avoid division by zero

//   return (
//     <div className="space-y-8">
//       {/* Welcome Banner (Restored Style) */}
//       <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
//           <p className="text-slate-400 max-w-lg">
//             Platform overview. You have{" "}
//             <strong className="text-white">{pendingSubmissions} pending</strong>{" "}
//             quest submissions to review.
//           </p>
//         </div>
//         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
//           <Activity size={200} />
//         </div>
//       </div>

//       {/* Stats Grid (Restored Style) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Learners"
//           value={userCount}
//           icon={Users}
//           color="bg-indigo-500"
//           trend="+12% vs last week"
//         />
//         <StatCard
//           title="Active Courses"
//           value={courseCount}
//           icon={BookOpen}
//           color="bg-emerald-500"
//           trend="Stable"
//         />
//         <StatCard
//           title="Active Quests"
//           value={questCount}
//           icon={Target}
//           color="bg-amber-500"
//           trend="High engagement"
//         />
//         <StatCard
//           title="Pending Review"
//           value={pendingSubmissions}
//           icon={TrendingUp}
//           color={
//             pendingSubmissions > 0
//               ? "bg-rose-500 animate-pulse"
//               : "bg-slate-400"
//           }
//           trend="Needs attention"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* User Growth Chart (Restored Style + Real Data) */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="font-bold text-xl text-slate-800">User Growth</h3>
//               <p className="text-slate-400 text-sm">
//                 New registrations over the last 6 months
//               </p>
//             </div>
//             <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600">
//               <ArrowUpRight size={20} />
//             </button>
//           </div>

//           {/* CSS Bar Chart */}
//           <div className="flex items-end justify-between gap-4 h-48 w-full mt-auto">
//             {growthRaw.map((item, i) => {
//               // Calculate height percentage
//               const heightPercent = Math.round((item.value / maxGrowth) * 100);
//               // Ensure a tiny bit of height even if 0 so the label container exists
//               const displayHeight = heightPercent < 5 ? 5 : heightPercent;

//               return (
//                 <div
//                   key={i}
//                   className="w-full bg-slate-100 rounded-t-xl relative group flex flex-col justify-end"
//                 >
//                   <div
//                     className="w-full bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-600"
//                     style={{ height: `${displayHeight}%` }}
//                   ></div>

//                   {/* Tooltip */}
//                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
//                     {item.value} users
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           {/* X-Axis Labels */}
//           <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase">
//             {growthRaw.map((item, i) => (
//               <span key={i} className="w-full text-center">
//                 {item.name}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Activity Feed (Restored Style) */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
//           <h3 className="font-bold text-xl text-slate-800 mb-6">
//             Live Activity
//           </h3>
//           <div className="space-y-6">
//             {recentUsers.map((u) => (
//               <div key={u.id} className="flex gap-4 items-start">
//                 <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700">
//                     New User Joined
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     <span className="font-medium text-slate-800">
//                       {u.name || "Anonymous"}
//                     </span>{" "}
//                     registered as {u.role.toLowerCase()}.
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {recentSubmissions.map((s) => (
//               <div key={s.id} className="flex gap-4 items-start">
//                 <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700">
//                     Quest Submitted
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     <span className="font-medium text-slate-800">
//                       {s.user.name}
//                     </span>{" "}
//                     completed{" "}
//                     <span className="text-indigo-600">{s.quest.title}</span>.
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {recentUsers.length === 0 && recentSubmissions.length === 0 && (
//               <p className="text-slate-400 text-sm">
//                 No recent activity found.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reusable Stat Component
// function StatCard({ title, value, icon: Icon, color, trend }: any) {
//   return (
//     <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
//             {title}
//           </p>
//           <h3 className="text-3xl font-black text-slate-800">{value}</h3>
//         </div>
//         <div
//           className={`p-3 rounded-xl text-white shadow-lg shadow-indigo-100 ${color}`}
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

// gemini/app/actions/admin.ts
// import { prisma } from "@/lib/prisma";
// import {
//   Users,
//   BookOpen,
//   Target,
//   TrendingUp,
//   Activity,
//   ArrowUpRight,
// } from "lucide-react";
// import { getUserGrowthData } from "@/app/actions/admin";
// import Link from "next/link";

// export const dynamic = "force-dynamic";

// export default async function AdminDashboard() {
//   // 1. Fetch Real Stats
//   const [
//     userCount,
//     courseCount,
//     questCount,
//     pendingSubmissions,
//     recentUsers,
//     recentSubmissions,
//     growthRaw,
//   ] = await Promise.all([
//     prisma.user.count({ where: { role: "USER" } }),
//     prisma.course.count(),
//     prisma.quest.count({ where: { isActive: true } }),
//     prisma.questSubmission.count({ where: { status: "PENDING" } }),

//     // Recent Users
//     prisma.user.findMany({
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       select: { id: true, name: true, createdAt: true, role: true },
//     }),

//     // Recent Submissions
//     prisma.questSubmission.findMany({
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       include: { user: true, quest: true },
//     }),

//     // Growth Data
//     getUserGrowthData(),
//   ]);

//   // Calculate max value for scaling
//   const maxGrowth = Math.max(...growthRaw.map((d) => d.value), 1);

//   return (
//     <div className="space-y-8">
//       {/* Welcome Banner */}
//       <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
//           <p className="text-slate-400 max-w-lg">
//             Platform overview. You have{" "}
//             <strong className="text-white">{pendingSubmissions} pending</strong>{" "}
//             quest submissions to review.
//           </p>
//         </div>
//         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
//           <Activity size={200} />
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Learners"
//           value={userCount}
//           icon={Users}
//           color="bg-indigo-500"
//           trend="+12% vs last week"
//         />
//         <StatCard
//           title="Active Courses"
//           value={courseCount}
//           icon={BookOpen}
//           color="bg-emerald-500"
//           trend="Stable"
//         />
//         <StatCard
//           title="Active Quests"
//           value={questCount}
//           icon={Target}
//           color="bg-amber-500"
//           trend="High engagement"
//         />
//         <StatCard
//           title="Pending Review"
//           value={pendingSubmissions}
//           icon={TrendingUp}
//           color={
//             pendingSubmissions > 0
//               ? "bg-rose-500 animate-pulse"
//               : "bg-slate-400"
//           }
//           trend="Needs attention"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Growth Chart - NEW BEAUTIFUL DESIGN */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[350px]">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="font-bold text-xl text-slate-800">User Growth</h3>
//               <p className="text-slate-400 text-sm">
//                 New registrations over the last 6 months
//               </p>
//             </div>
//             <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600">
//               <ArrowUpRight size={20} />
//             </button>
//           </div>

//           {/* Chart Area */}
//           <div className="flex items-end justify-between gap-2 h-56 w-full mt-auto pb-2 border-b border-slate-100 border-dashed">
//             {growthRaw.map((item, i) => {
//               const heightPercent = Math.round((item.value / maxGrowth) * 100);
//               const displayHeight = heightPercent < 8 ? 8 : heightPercent; // Min height for visibility

//               return (
//                 <div
//                   key={i}
//                   className="flex flex-col items-center justify-end h-full flex-1 group relative cursor-default"
//                 >
//                   {/* Tooltip */}
//                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl z-20 pointer-events-none whitespace-nowrap">
//                     {item.value} Users
//                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
//                   </div>

//                   {/* The Bar */}
//                   <div
//                     className="w-4 md:w-6 rounded-t-2xl bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-500 ease-out group-hover:w-5 md:group-hover:w-8 group-hover:brightness-110 relative z-10"
//                     style={{ height: `${displayHeight}%` }}
//                   >
//                     {/* Shine effect on top */}
//                     <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
//                   </div>

//                   {/* X-Axis Label */}
//                   <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mt-4 tracking-wider group-hover:text-indigo-600 transition-colors">
//                     {item.name}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Activity Feed */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//           <h3 className="font-bold text-xl text-slate-800 mb-6">
//             Live Activity
//           </h3>
//           <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
//             {recentUsers.map((u) => (
//               <div key={u.id} className="flex gap-4 items-start group">
//                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
//                   <Users size={14} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
//                     New User Joined
//                   </p>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     <span className="font-bold text-slate-800">
//                       {u.name || "Anonymous"}
//                     </span>{" "}
//                     just started their journey as a {u.role.toLowerCase()}.
//                   </p>
//                   <span className="text-[10px] font-bold text-slate-300 uppercase mt-1 block">
//                     {new Date(u.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             ))}

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

//             {recentUsers.length === 0 && recentSubmissions.length === 0 && (
//               <div className="text-center py-10">
//                 <p className="text-slate-400 text-sm font-medium">
//                   No recent activity found.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Reusable Stat Component
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
