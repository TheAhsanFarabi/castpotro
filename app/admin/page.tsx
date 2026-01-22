import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Target, TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Fetch Real Stats
  const userCount = await prisma.user.count({ where: { role: 'USER' } });
  const courseCount = await prisma.course.count();
  const questCount = await prisma.quest.count({ where: { isActive: true } });
  
  // Fetch Pending Submissions
  const pendingSubmissions = await prisma.questSubmission.count({ where: { status: 'PENDING' } });

  // 2. Fetch Recent Activities (Combine new users + submissions)
  const recentUsers = await prisma.user.findMany({
    take: 5, orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, createdAt: true, role: true }
  });

  const recentSubmissions = await prisma.questSubmission.findMany({
    take: 5, orderBy: { createdAt: 'desc' },
    include: { user: true, quest: true }
  });

  // Mock Data for "Growth Chart" (Since we don't store historical snapshots)
  const growthData = [40, 65, 50, 85, 90, 100, userCount > 100 ? 100 : userCount + 20]; 

  return (
    <div className="space-y-8">
       
       {/* Welcome Banner */}
       <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-slate-400 max-w-lg">
               Platform overview. You have <strong className="text-white">{pendingSubmissions} pending</strong> quest submissions to review.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
             <Activity size={200} />
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Learners" value={userCount} icon={Users} color="bg-indigo-500" trend="+12% vs last week" />
          <StatCard title="Active Courses" value={courseCount} icon={BookOpen} color="bg-emerald-500" trend="Stable" />
          <StatCard title="Active Quests" value={questCount} icon={Target} color="bg-amber-500" trend="High engagement" />
          <StatCard title="Pending Review" value={pendingSubmissions} icon={TrendingUp} color={pendingSubmissions > 0 ? "bg-rose-500 animate-pulse" : "bg-slate-400"} trend="Needs attention" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Growth Chart (Mock Visual) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="font-bold text-xl text-slate-800">User Growth</h3>
                   <p className="text-slate-400 text-sm">New registrations over the last 7 days</p>
                </div>
                <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600"><ArrowUpRight size={20}/></button>
             </div>
             
             {/* CSS Bar Chart */}
             <div className="flex items-end justify-between gap-4 h-48 w-full mt-auto">
                {growthData.map((h, i) => (
                   <div key={i} className="w-full bg-slate-100 rounded-t-xl relative group">
                      <div 
                         className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-600"
                         style={{ height: `${h}%` }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                         {h} users
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
             <h3 className="font-bold text-xl text-slate-800 mb-6">Live Activity</h3>
             <div className="space-y-6">
                
                {recentUsers.map(u => (
                   <div key={u.id} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                      <div>
                         <p className="text-sm font-bold text-slate-700">New User Joined</p>
                         <p className="text-xs text-slate-500"><span className="font-medium text-slate-800">{u.name}</span> registered as {u.role.toLowerCase()}.</p>
                      </div>
                   </div>
                ))}

                {recentSubmissions.map(s => (
                   <div key={s.id} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                      <div>
                         <p className="text-sm font-bold text-slate-700">Quest Submitted</p>
                         <p className="text-xs text-slate-500"><span className="font-medium text-slate-800">{s.user.name}</span> completed <span className="text-indigo-600">{s.quest.title}</span>.</p>
                      </div>
                   </div>
                ))}

             </div>
          </div>

       </div>
    </div>
  );
}

// Reusable Stat Component
function StatCard({ title, value, icon: Icon, color, trend }: any) {
   return (
      <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition">
         <div className="flex justify-between items-start mb-4">
            <div>
               <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</p>
               <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl text-white shadow-lg shadow-indigo-100 ${color}`}>
               <Icon size={24} />
            </div>
         </div>
         <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <TrendingUp size={12} /> {trend}
         </div>
      </div>
   );
}