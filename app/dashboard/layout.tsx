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
        <span className="hidden xl:block font-extrabold uppercase text-sm tracking-widest">{label}</span>
      </div>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION - WIDTH INCREASED TO MATCH RIGHT SIDEBAR (400px on XL) */}
      <nav className="w-full md:w-20 xl:w-[350px] 2xl:w-[400px] md:h-screen bg-white border-r-2 border-slate-100 fixed md:static bottom-0 z-50 px-4 md:px-3 xl:px-6 py-2 md:py-8 flex md:flex-col justify-between md:justify-start gap-2 md:gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none shrink-0 transition-all duration-300">
         <Link href="/" className="hidden md:flex items-center justify-center xl:justify-start gap-2 text-2xl font-extrabold text-[#0ea5e9] tracking-tighter mb-8 px-0 xl:px-4">
           <Zap fill="#0ea5e9" size={28} /> 
           <span className="hidden xl:block">castpotro</span>
         </Link>
         
         <div className="flex flex-col gap-2 w-full overflow-y-auto no-scrollbar pb-20 md:pb-0">
            <NavItem icon={<Hexagon size={28} />} label="Learn" href="/dashboard" />
            <NavItem icon={<Users size={28} />} label="Events" href="/dashboard/events" />
            <NavItem icon={<Shield size={28} />} label="Rank" href="/dashboard/rank" />
            <NavItem icon={<Compass size={28} />} label="Quests" href="/dashboard/quests" />
            <NavItem icon={<Briefcase size={28} />} label="Jobs" href="/dashboard/jobs" />
            <NavItem icon={<Bell size={28} />} label="Notifications" href="/dashboard/notifications" />
            <NavItem icon={<Smile size={28} />} label="Profile" href="/dashboard/profile" />
            <NavItem icon={<Settings size={28} />} label="Settings" href="/dashboard/settings" />

            <div className="mt-4 border-t border-slate-100 pt-4">
              <NavItem icon={<HelpCircle size={28} />} label="Help" href="/dashboard/help" />
            </div>
         </div>

         <div className="md:mt-auto w-full pt-4 bg-white hidden md:block">
            <form action={logoutAction}>
                <button className="flex items-center justify-center xl:justify-start gap-4 px-4 py-3 rounded-xl cursor-pointer transition text-slate-400 hover:bg-red-50 hover:text-red-500 w-full border-2 border-transparent hover:border-red-100">
                    <LogOut size={28} />
                    <span className="hidden xl:block font-extrabold uppercase text-sm tracking-widest">Logout</span>
                </button>
            </form>
         </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex justify-center overflow-y-auto h-screen bg-white relative">
        {children}
      </main>
    </div>
  );
}