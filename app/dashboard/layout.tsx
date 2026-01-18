"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, Hexagon, Users, Shield, Bell, Smile, LogOut, 
  Briefcase, Settings, HelpCircle, Compass 
} from 'lucide-react';
import { logoutAction } from '../actions'; 

// Sidebar Item Component
const NavItem = ({ icon, label, href }: { icon: any, label: string, href: string }) => {
  const pathname = usePathname();
  // Active state logic: exact match for root, startsWith for sub-pages
  const isActive = href === '/dashboard' 
    ? pathname === '/dashboard' 
    : pathname.startsWith(href);

  return (
    <Link href={href} className="w-full">
      <div className={`
        flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition
        ${isActive ? 'bg-sky-50 text-[#0ea5e9] border-2 border-sky-200' : 'text-slate-400 hover:bg-slate-50 border-2 border-transparent'}
      `}>
        {icon}
        <span className="hidden md:block font-extrabold uppercase text-sm tracking-widest">{label}</span>
      </div>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <nav className="w-full md:w-64 md:h-screen bg-white border-r-2 border-slate-100 fixed md:static bottom-0 z-50 px-4 md:px-6 py-2 md:py-8 flex md:flex-col justify-between md:justify-start gap-2 md:gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none">
         <Link href="/" className="hidden md:flex items-center gap-2 text-2xl font-extrabold text-[#0ea5e9] tracking-tighter mb-8 px-4">
           <Zap fill="#0ea5e9" size={24} /> castpotro
         </Link>
         
         <div className="flex flex-col gap-2 w-full overflow-y-auto no-scrollbar pb-20 md:pb-0">
            {/* --- Core Learning --- */}
            <NavItem icon={<Hexagon size={28} />} label="Learn" href="/dashboard" />
            <NavItem icon={<Users size={28} />} label="Events" href="/dashboard/events" />
            <NavItem icon={<Shield size={28} />} label="Rank" href="/dashboard/rank" />

            {/* Swapped Quests to Compass so Bell can be Notifications */}
            <NavItem icon={<Compass size={28} />} label="Quests" href="/dashboard/quests" />

            {/* --- Career & Growth (New) --- */}
            <NavItem icon={<Briefcase size={28} />} label="Jobs" href="/dashboard/jobs" />

            {/* --- Personal (New) --- */}
            <NavItem icon={<Bell size={28} />} label="Notifications" href="/dashboard/notifications" />
            <NavItem icon={<Smile size={28} />} label="Profile" href="/dashboard/profile" />
            <NavItem icon={<Settings size={28} />} label="Settings" href="/dashboard/settings" />

            {/* --- Support --- */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <NavItem icon={<HelpCircle size={28} />} label="Help" href="/dashboard/help" />
            </div>
         </div>

         {/* Logout Button */}
         <div className="md:mt-auto w-full pt-4 bg-white">
            <form action={logoutAction}>
                <button className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition text-slate-400 hover:bg-red-50 hover:text-red-500 w-full border-2 border-transparent hover:border-red-100">
                    <LogOut size={28} />
                    <span className="hidden md:block font-extrabold uppercase text-sm tracking-widest">Logout</span>
                </button>
            </form>
         </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 flex justify-center overflow-y-auto h-screen bg-white">
        {children}
      </main>
    </div>
  );
}