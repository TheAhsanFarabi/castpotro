"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Hexagon, Users, Shield, Bell, Smile, LogOut, 
  Briefcase, Settings, HelpCircle, Compass, Calendar 
} from 'lucide-react';
import { logoutAction } from '../actions'; 

const NavItem = ({ icon, label, href }: { icon: any, label: string, href: string }) => {
  const pathname = usePathname();
  const isActive = href === '/dashboard' 
    ? pathname === '/dashboard' 
    : pathname.startsWith(href);

  return (
    <Link href={href} className="w-full">
      <div className={`
        flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive 
            ? 'bg-sky-50/80 text-[#0ea5e9] border-2 border-sky-200 shadow-sm backdrop-blur-sm' 
            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 border-2 border-transparent'}
      `}>
        {icon}
        <span className="hidden xl:block font-extrabold uppercase text-sm tracking-widest">{label}</span>
      </div>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <nav className="w-full md:w-20 xl:w-[240px] 2xl:w-[300px] md:h-screen bg-white/40 backdrop-blur-xl border-r-2 border-white/50 fixed md:static bottom-0 z-50 px-4 md:px-3 xl:px-4 py-2 md:py-8 flex md:flex-col justify-between gap-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none shrink-0 transition-all duration-300">
         
         {/* 1. Logo Section (Top) - ADDED FRAME */}
         <div className="shrink-0 mb-6">
            <Link href="/" className="hidden md:flex items-center justify-center xl:justify-start gap-3 px-4 py-4 group bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md shadow-sm transition-all hover:bg-white/20 hover:border-white/30 hover:shadow-md">
              <Image 
                src="/icon.png" 
                alt="Castpotro Logo" 
                width={70} 
                height={70} 
                className="object-contain shrink-0 transition-transform group-hover:scale-110"
              />
              <span className="hidden xl:block text-2xl font-black text-slate-700 tracking-tighter group-hover:text-[#0ea5e9] transition-colors">
                castpotro
              </span>
            </Link>
         </div>
         
         {/* 2. Main Navigation */}
         <div className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0 pr-1">
            <NavItem icon={<Hexagon size={28} />} label="Learn" href="/dashboard" />
            <NavItem icon={<Calendar size={28} />} label="Events" href="/dashboard/events" />
            <NavItem icon={<Shield size={28} />} label="Rank" href="/dashboard/rank" />
            <NavItem icon={<Compass size={28} />} label="Quests" href="/dashboard/quests" />
            <NavItem icon={<Briefcase size={28} />} label="Jobs" href="/dashboard/jobs" />
            <NavItem icon={<Bell size={28} />} label="Notifications" href="/dashboard/notifications" />
            <NavItem icon={<Smile size={28} />} label="Profile" href="/dashboard/profile" />
            <NavItem icon={<Settings size={28} />} label="Settings" href="/dashboard/settings" />
         </div>

         {/* 3. Bottom Section: Grouped Frame & Logout */}
         <div className="shrink-0 w-full flex flex-col gap-3 pt-2">
            
            {/* Symmetrical Frame for Team & Help */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-1.5 flex flex-col gap-1 backdrop-blur-md">
               <NavItem icon={<Users size={28} />} label="Meet Our Team" href="/dashboard/team" />
               <NavItem icon={<HelpCircle size={28} />} label="Help" href="/dashboard/help" />
            </div>
            
            {/* Differentiated Logout Button */}
            <form action={logoutAction}>
                <button className="group flex items-center justify-center xl:justify-start gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 text-slate-400 hover:text-red-600 w-full border-2 border-slate-100/50 hover:border-red-200 hover:bg-red-50/50 hover:shadow-sm">
                    <LogOut size={28} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden xl:block font-extrabold uppercase text-sm tracking-widest">Sign Out</span>
                </button>
            </form>
         </div>

      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex justify-center overflow-y-auto custom-scrollbar h-screen relative min-w-0">
        {children}
      </main>
    </div>
  );
}