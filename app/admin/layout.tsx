import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Users, BookOpen, Target, Calendar, 
  Briefcase, Shield, LogOut, Settings, Bell 
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // 🔒 SECURITY CHECK: Only allow Admin roles
  if (!user || user.role === 'USER') {
    redirect('/dashboard'); // Kick normal users back to student dashboard
  }

  // Define Menu Items based on Role
  const allMenuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "INSTRUCTOR", "COMMUNITY_MANAGER"] },
    { label: "Users", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] },
    { label: "Courses", href: "/admin/courses", icon: BookOpen, roles: ["SUPER_ADMIN", "INSTRUCTOR"] },
    { label: "Quests", href: "/admin/quests", icon: Target, roles: ["SUPER_ADMIN", "COMMUNITY_MANAGER"] },
    { label: "Events", href: "/admin/events", icon: Calendar, roles: ["SUPER_ADMIN", "COMMUNITY_MANAGER"] },
    { label: "Jobs", href: "/admin/jobs", icon: Briefcase, roles: ["SUPER_ADMIN", "PARTNER_MANAGER"] },
    { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
  ];

  const allowedMenu = allMenuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-500 p-2 rounded-lg">
                <Shield size={24} className="text-white" />
             </div>
             <div>
                <h1 className="font-black text-lg tracking-tight">Admin<span className="text-indigo-400">Panel</span></h1>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{user.role.replace('_', ' ')}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
           {allowedMenu.map((item) => (
             <Link 
               key={item.href} 
               href={item.href}
               className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-medium"
             >
                <item.icon size={20} />
                {item.label}
             </Link>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <form action={async () => {
              'use server';
              const { cookies } = await import("next/headers");
              (await cookies()).delete("userId");
              redirect("/login");
           }}>
             <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-sm">
                <LogOut size={20} /> Sign Out
             </button>
           </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 ml-64 flex flex-col">
         
         {/* Top Header */}
         <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="font-bold text-slate-500">Overview</h2>
            <div className="flex items-center gap-4">
               <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
               </button>
               <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <div className="font-bold text-sm text-slate-700">{user.name}</div>
                     <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                     {user.name?.charAt(0)}
                  </div>
               </div>
            </div>
         </header>

         {/* Page Content */}
         <main className="flex-1 p-8 overflow-y-auto">
            {children}
         </main>
      </div>

    </div>
  );
}