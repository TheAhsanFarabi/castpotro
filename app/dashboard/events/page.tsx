"use client";
import { 
  Users, Star, Calendar, MapPin, Clock, Ticket, CheckCircle, 
  BookOpen, Globe, Mic, MessageCircle, Trophy, Flame, 
  Sparkles, Crown, Search, ArrowRight 
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Events Data ---
const EVENTS = [
  { 
    id: 1, 
    title: "Bookverse", 
    type: "Literature",
    date: "Oct 24, 2026", 
    time: "10:00 AM", 
    location: "Library Hall", 
    description: "Dive into the universe of books. Join our community reading session and book swap.",
    color: "bg-emerald-500", 
    icon: BookOpen,
    spots: 12
  },
  { 
    id: 2, 
    title: "Cultural Exchange", 
    type: "Social",
    date: "Oct 26, 2026", 
    time: "2:00 PM", 
    location: "Main Auditorium", 
    description: "Experience global traditions. Food, music, and stories from 20+ countries.",
    color: "bg-indigo-500", 
    icon: Globe,
    spots: 45
  },
  { 
    id: 3, 
    title: "Chatter Box", 
    type: "Debate",
    date: "Oct 28, 2026", 
    time: "4:00 PM", 
    location: "Room 304", 
    description: "Speak your mind! A safe space for impromptu speaking and fun debates.",
    color: "bg-rose-500", 
    icon: MessageCircle,
    spots: 8
  },
  { 
    id: 4, 
    title: "The Podcast", 
    type: "Media",
    date: "Nov 01, 2026", 
    time: "6:00 PM", 
    location: "Online / Studio", 
    description: "Live recording session. Learn how to voice your thoughts to the world.",
    color: "bg-amber-500", 
    icon: Mic,
    spots: 20
  },
  { 
    id: 5, 
    title: "Nitro Win Event", 
    type: "Competition",
    date: "Nov 05, 2026", 
    time: "9:00 AM", 
    location: "Campus Grounds", 
    description: "High energy, big prizes. The ultimate soft-skills scavenger hunt.",
    color: "bg-sky-500", 
    icon: Trophy,
    spots: 100
  },
];

function EventsContent() {
  const [registered, setRegistered] = useState<number[]>([]);
  const [tickets, setTickets] = useState(0);

  const handleRegister = (id: number) => {
    if (registered.includes(id)) {
        // Unregister
        setRegistered(registered.filter(i => i !== id));
        setTickets(t => t - 1);
    } else {
        // Register
        setRegistered([...registered, id]);
        setTickets(t => t + 1);
    }
  };

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-purple-500 bg-purple-100 p-2 rounded-lg">
                   <Users size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Community Events</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Join & Network</p>
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-purple-500 font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 shadow-sm">
                <Ticket size={20} /> {tickets} Tickets
              </div>
              <div className="flex items-center gap-2 text-[#0ea5e9] font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 shadow-sm">
                <Star fill="#0ea5e9" size={20} /> 150
              </div>
           </div>
        </div>

        {/* EVENTS LIST BODY */}
        <div className="px-6 lg:px-10 pb-20">
            
            {/* Featured Banner (First Event) */}
            <div className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden mb-8 group">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block backdrop-blur-sm border border-white/10">Featured Event</span>
                        <h2 className="text-4xl font-black mb-3 tracking-tight">Nitro Win Event 🏆</h2>
                        <p className="opacity-90 max-w-md font-medium text-lg leading-relaxed">The biggest soft-skills competition of the year. Prove your worth and win amazing prizes.</p>
                        
                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"><Calendar size={16} /> Nov 05</div>
                            <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"><MapPin size={16} /> Campus Grounds</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleRegister(5)}
                        className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                            registered.includes(5) 
                            ? "bg-white text-emerald-600" 
                            : "bg-[#00ff9d] text-emerald-950 hover:bg-[#00e68d]"
                        }`}
                    >
                        {registered.includes(5) ? <><CheckCircle size={20} /> Going</> : "Register Now"}
                    </button>
                </div>
                {/* Decorative BG Icon */}
                <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-700">
                    <Trophy size={280} />
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
               <h3 className="font-extrabold text-slate-700 text-xl">Upcoming Events</h3>
               <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search events..." className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none w-32" />
               </div>
            </div>

            {/* Standard Event Cards Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {EVENTS.filter(e => e.id !== 5).map((event) => (
                    <div key={event.id} className="group border-2 border-slate-100 hover:border-purple-200 bg-white rounded-[24px] p-5 transition-all hover:shadow-xl hover:-translate-y-1 flex gap-5 items-start">
                        
                        {/* Date Box */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-20 h-24 bg-slate-50 rounded-2xl border-2 border-slate-100 shrink-0 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                            <span className="text-slate-400 group-hover:text-purple-400 text-xs font-black uppercase tracking-widest">{event.date.split(' ')[0]}</span>
                            <span className="text-slate-800 group-hover:text-purple-600 text-2xl font-black">{event.date.split(' ')[1].replace(',','')}</span>
                        </div>

                        {/* Icon & Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white shadow-sm ${event.color}`}>
                                    {event.type}
                                </span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                    <Clock size={12} /> {event.time}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-extrabold text-slate-700 group-hover:text-purple-600 transition-colors truncate">{event.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed line-clamp-2">{event.description}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                               <div className="flex sm:hidden gap-3 text-xs font-bold text-slate-400">
                                   <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                               </div>
                               <button 
                                   onClick={() => handleRegister(event.id)}
                                   className={`px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border-b-2 active:border-b-0 active:translate-y-[2px] flex items-center justify-center gap-2 ${
                                       registered.includes(event.id)
                                       ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                       : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-purple-500 hover:text-white hover:border-purple-700 hover:shadow-lg hover:shadow-purple-200"
                                   }`}
                               >
                                   {registered.includes(event.id) ? "Registered" : <>Join <ArrowRight size={14} /></>}
                               </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: My Tickets */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                 <Ticket size={20} className="text-purple-500" /> My Tickets
             </h3>
             {registered.length === 0 ? (
                 <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <Ticket size={32} className="mx-auto mb-2 opacity-50" />
                     <p className="text-xs font-bold">No upcoming events.</p>
                 </div>
             ) : (
                 <div className="space-y-3">
                     {EVENTS.filter(e => registered.includes(e.id)).map(e => (
                         <div key={e.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${e.color}`}>
                                 <e.icon size={16} />
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
          
          {/* Widget 2: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Castpotro Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Get early access to events and VIP seating.
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

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <EventsContent />
    </Suspense>
  );
}