"use client";
import React, { useState } from 'react';
import { 
  Users, Star, Calendar, MapPin, Clock, Ticket, CheckCircle, 
  BookOpen, Globe, Mic, MessageCircle, Trophy, Flame, 
  Sparkles, Crown, Search, ArrowRight, Zap, Bell
} from 'lucide-react';

// --- Events Data ---
const EVENTS = [
  { 
    id: 1, 
    title: "Bookverse", 
    type: "Literature",
    date: "Oct 24", 
    time: "10:00 AM", 
    location: "Library Hall", 
    description: "Dive into the universe of books. Join our community reading session and book swap.",
    color: "bg-emerald-500", 
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: BookOpen,
    spots: 12
  },
  { 
    id: 2, 
    title: "Cultural Exchange", 
    type: "Social",
    date: "Oct 26", 
    time: "2:00 PM", 
    location: "Main Auditorium", 
    description: "Experience global traditions. Food, music, and stories from 20+ countries.",
    color: "bg-indigo-500", 
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: Globe,
    spots: 45
  },
  { 
    id: 3, 
    title: "Chatter Box", 
    type: "Debate",
    date: "Oct 28", 
    time: "4:00 PM", 
    location: "Room 304", 
    description: "Speak your mind! A safe space for impromptu speaking and fun debates.",
    color: "bg-rose-500", 
    bg: "bg-rose-50",
    text: "text-rose-600",
    icon: MessageCircle,
    spots: 8
  },
  { 
    id: 4, 
    title: "The Podcast", 
    type: "Media",
    date: "Nov 01", 
    time: "6:00 PM", 
    location: "Online / Studio", 
    description: "Live recording session. Learn how to voice your thoughts to the world.",
    color: "bg-amber-500", 
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: Mic,
    spots: 20
  }
];

export default function EventsPage() {
  const [registered, setRegistered] = useState<number[]>([]);
  const [tickets, setTickets] = useState(0);

  const handleRegister = (id: number) => {
    if (registered.includes(id)) {
        setRegistered(registered.filter(i => i !== id));
        setTickets(t => t - 1);
    } else {
        setRegistered([...registered, id]);
        setTickets(t => t + 1);
    }
  };

  return (
    <div className="flex w-full max-w-[1920px] mx-auto min-h-screen bg-slate-50">
      
      {/* === CENTER CONTENT (Fluid) === */}
      <div className="flex-1 overflow-y-auto scroll-smooth border-r border-slate-100 p-6 lg:p-10">
          
          {/* Sticky Header */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 mb-6 sticky top-0 z-30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600 border border-purple-200 shadow-sm">
                    <Users size={28} />
                </div>
                <div>
                  <h1 className="font-extrabold text-slate-700 text-xl leading-tight">Events</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Join & Network</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                 <div className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
                    <Ticket size={18} /> {tickets} <span className="hidden sm:inline">Tickets</span>
                 </div>
              </div>
          </div>

          <main className="space-y-8 pb-24 lg:pb-0 max-w-5xl mx-auto">
            
            {/* 1. Hero Banner */}
            <div className="w-full bg-slate-900 rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-slate-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-90"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                    <div className="flex-1">
                        <span className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/10">
                            <Flame size={12} className="text-yellow-300" fill="currentColor" /> Featured Event
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Nitro Win <br/> Championship 🏆</h2>
                        <p className="opacity-90 max-w-lg font-medium text-lg leading-relaxed mb-8 text-indigo-100">
                            The ultimate soft-skills scavenger hunt. Compete with 100+ students, solve challenges, and win exclusive prizes.
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/10">
                                <Calendar size={16} /> Nov 05, 2026
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/10">
                                <MapPin size={16} /> Campus Grounds
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleRegister(5)}
                        className={`
                           px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 w-full md:w-auto justify-center
                           ${registered.includes(5) 
                             ? "bg-white text-emerald-600 shadow-emerald-900/20" 
                             : "bg-[#00ff9d] text-emerald-950 hover:bg-[#00e68d] shadow-emerald-500/20"}
                        `}
                    >
                        {registered.includes(5) ? <><CheckCircle size={20} /> Registered</> : <>Register Now <ArrowRight size={18} /></>}
                    </button>
                </div>

                <div className="absolute -right-6 -bottom-10 opacity-10 rotate-12 group-hover:rotate-[20deg] group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                    <Trophy size={320} />
                </div>
            </div>

            {/* 2. Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
               <h3 className="font-extrabold text-slate-700 text-xl">Upcoming Events</h3>
               <div className="w-full sm:w-auto flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border-2 border-slate-100 focus-within:border-purple-200 focus-within:ring-4 focus-within:ring-purple-50 transition-all shadow-sm">
                  <Search size={18} className="text-slate-400" />
                  <input type="text" placeholder="Search by topic..." className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none w-full sm:w-48 placeholder:text-slate-300" />
               </div>
            </div>

            {/* 3. Event Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {EVENTS.map((event) => (
                    <div key={event.id} className="group bg-white border-2 border-slate-100 rounded-[24px] p-6 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${event.color}`}>
                               <event.icon size={24} />
                           </div>
                           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${event.bg} ${event.text}`}>
                               {event.type}
                           </div>
                        </div>

                        <div className="flex-1 relative z-10">
                           <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{event.title}</h3>
                           <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                               {event.description}
                           </p>

                           <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Calendar size={14} /> {event.date}</span>
                               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Clock size={14} /> {event.time}</span>
                           </div>
                        </div>

                        <button 
                            onClick={() => handleRegister(event.id)}
                            className={`
                               w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-[4px] flex items-center justify-center gap-2 relative z-10
                               ${registered.includes(event.id)
                                 ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                 : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600"}
                            `}
                        >
                            {registered.includes(event.id) ? "You're Going!" : "Join Event"}
                        </button>
                        
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${event.color}`}></div>
                    </div>
                ))}
            </div>

          </main>
      </div>

      {/* === RIGHT SIDEBAR (Fixed Width) === */}
      <div className="hidden lg:flex flex-col w-[350px] 2xl:w-[400px] bg-slate-50/50 p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-6 shrink-0 border-l-2 border-slate-100">
          
          {/* Widget 1: My Tickets */}
          <div className="bg-white border-2 border-slate-200 rounded-[24px] p-5 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                    <Ticket size={18} className="text-purple-500" /> My Tickets
                </h3>
                <button className="text-xs font-bold text-slate-400 hover:text-purple-500">View All</button>
             </div>
             
             {registered.length === 0 ? (
                 <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                     <Ticket size={32} className="mx-auto mb-2 text-slate-300" />
                     <p className="text-xs font-bold text-slate-400">No upcoming events.</p>
                     <p className="text-[10px] text-slate-300 mt-1">Register for an event to see it here.</p>
                 </div>
             ) : (
                 <div className="space-y-3">
                     {registered.includes(5) && (
                        <div className="relative overflow-hidden p-3 bg-slate-800 rounded-xl text-white border border-slate-700 group cursor-pointer hover:scale-105 transition-transform">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                                    <Trophy size={18} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-bold text-sm truncate">Nitro Win</h4>
                                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-wide">Nov 05 • 9:00 AM</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                     )}

                     {EVENTS.filter(e => registered.includes(e.id)).map(e => (
                         <div key={e.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${e.color}`}>
                                 <e.icon size={18} />
                             </div>
                             <div className="flex-1 overflow-hidden">
                                 <h4 className="font-bold text-sm truncate text-slate-700">{e.title}</h4>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{e.date} • {e.time}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
          
          {/* Widget 2: Notifications */}
          <div className="border-2 border-slate-200 rounded-[24px] p-5 bg-white shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm">
                 <Bell size={18} className="text-rose-500" /> Notifications
             </h3>
             <div className="space-y-4">
                 <div className="flex gap-3 items-start">
                     <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                     <div>
                         <p className="text-xs font-bold text-slate-600 leading-tight">"Bookverse" location changed to Room 101.</p>
                         <p className="text-[10px] text-slate-400 font-bold mt-1">2 hours ago</p>
                     </div>
                 </div>
                 <div className="flex gap-3 items-start opacity-60">
                     <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                     <div>
                         <p className="text-xs font-bold text-slate-600 leading-tight">New event added: "Code Jam"</p>
                         <p className="text-[10px] text-slate-400 font-bold mt-1">Yesterday</p>
                     </div>
                 </div>
             </div>
          </div>

          {/* Widget 3: Castpotro Plus */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-[24px] p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 transition-all duration-500">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">VIP Access</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Get early access to events and reserved front-row seating.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Upgrade Now
                </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={140} />
            </div>
          </div>

      </div>

      {/* --- MOBILE STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-5px_30px_rgba(0,0,0,0.08)] z-50 lg:hidden">
         <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                 <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                     <Ticket size={20} />
                 </div>
                 <div>
                    <div className="font-black text-slate-700 text-sm">{tickets} Tickets</div>
                    <div className="text-[10px] font-bold text-slate-400">Reserved</div>
                 </div>
             </div>
             <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-purple-200 hover:scale-105 transition active:scale-95 font-bold text-sm">
                View All
             </button>
         </div>
      </div>

    </div>
  );
}