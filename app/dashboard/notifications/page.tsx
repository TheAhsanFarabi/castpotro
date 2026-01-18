"use client";
import { 
  Bell, Star, Heart, Trophy, CheckCircle, Flame, 
  Settings, Filter, Inbox, Crown, Sparkles, MessageSquare
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Mock Data ---
const NOTIFICATIONS = [
  { 
    id: 1, 
    type: "xp", 
    title: "Daily Goal Achieved!", 
    msg: "You earned 50 XP for completing your daily goal.", 
    time: "2 hours ago", 
    icon: Trophy, 
    color: "text-amber-500 bg-amber-100",
    read: false
  },
  { 
    id: 2, 
    type: "social", 
    title: "Sarah liked your achievement", 
    msg: "Sarah J. applauded your rank up to Gold League.", 
    time: "5 hours ago", 
    icon: Heart, 
    color: "text-rose-500 bg-rose-100",
    read: false
  },
  { 
    id: 3, 
    type: "system", 
    title: "New Quest Available", 
    msg: "A new 'Climate Action' quest is live. Check it out now!", 
    time: "1 day ago", 
    icon: Star, 
    color: "text-[#0ea5e9] bg-sky-100",
    read: true
  },
  { 
    id: 4, 
    type: "reminder", 
    title: "Streak Saver Used", 
    msg: "You missed yesterday, but your streak is safe thanks to Plus.", 
    time: "2 days ago", 
    icon: Flame, 
    color: "text-orange-500 bg-orange-100",
    read: true
  },
  { 
    id: 5, 
    type: "social", 
    title: "New Follower", 
    msg: "Mike T. started following your progress.", 
    time: "3 days ago", 
    icon: CheckCircle, 
    color: "text-emerald-500 bg-emerald-100",
    read: true
  },
];

function NotificationsContent() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-slate-500 bg-slate-100 p-2 rounded-lg">
                   <Bell size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Inbox</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Recent Updates</p>
                </div>
              </div>
           </div>

           <button className="flex items-center gap-2 text-[#0ea5e9] font-bold bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 hover:bg-sky-100 transition shadow-sm text-sm">
             <CheckCircle size={18} /> Mark all read
           </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="px-6 lg:px-10 pb-20">
            
            {/* Mobile Filter Tabs (Hidden on large screens where sidebar exists) */}
            <div className="flex 2xl:hidden gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Mentions', 'System'].map((tab) => (
                    <button key={tab} className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 transition text-sm first:bg-sky-50 first:text-[#0ea5e9] first:border-sky-200">
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                {NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className={`group flex gap-4 p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${notif.read ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-sky-50/50 border-sky-100 hover:border-sky-300 hover:shadow-md'}`}>
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.color}`}>
                            <notif.icon size={24} fill="currentColor" className="opacity-90" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 py-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold text-lg mb-1 ${notif.read ? 'text-slate-700' : 'text-slate-800'}`}>{notif.title}</h3>
                                {!notif.read && <div className="w-3 h-3 bg-[#0ea5e9] rounded-full shadow-sm animate-pulse"></div>}
                            </div>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-2">{notif.msg}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{notif.time}</p>
                        </div>
                    </div>
                ))}

                {/* Empty State / End of List */}
                <div className="text-center py-10 opacity-50">
                    <Inbox size={48} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-400">That's all for now!</p>
                </div>
            </div>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: Filters */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Filter size={20} className="text-slate-400" /> Filter View
            </h3>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50 text-[#0ea5e9] font-bold text-sm border border-sky-100">
                    <span>All Notifications</span>
                    <div className="bg-[#0ea5e9] text-white text-xs px-2 py-0.5 rounded-md">5</div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-500 font-bold text-sm transition">
                    <span>Mentions & Likes</span>
                    <div className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-md">2</div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-500 font-bold text-sm transition">
                    <span>System Updates</span>
                    <div className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-md">1</div>
                </button>
            </div>
          </div>
          
          {/* Widget 2: Quick Settings */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" /> Preferences
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Email Digest</span>
                    <div className="w-10 h-6 bg-[#0ea5e9] rounded-full p-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div></div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Push Notifications</span>
                    <div className="w-10 h-6 bg-[#0ea5e9] rounded-full p-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div></div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                    <span className="text-sm font-bold text-slate-600">Sound Effects</span>
                    <div className="w-10 h-6 bg-slate-200 rounded-full p-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                </div>
            </div>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Castpotro Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Get smarter notifications with AI summaries of your weekly progress.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Upgrade Now
                </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
                <Sparkles size={140} />
            </div>
        </div>

      </div>

    </div>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}