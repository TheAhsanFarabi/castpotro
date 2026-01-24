"use client";
import React, { useState } from "react";
import {
  Users,
  Ticket,
  CheckCircle,
  BookOpen,
  Globe,
  Mic,
  MessageCircle,
  Flame,
  ArrowRight,
  Zap,
  Bell,
  Video,
  Loader2,
  Calendar,
  Clock,
  Lock,
  Search,
  MapPin,
  Trophy,
  Crown,
  Sparkles,
} from "lucide-react";
import { registerForEvent } from "@/app/actions";
import { useRouter } from "next/navigation";

// ... (keep your getEventStyle helper function as is) ...
const getEventStyle = (type: string) => {
  const t = type || "General";
  if (t.includes("Lit") || t.includes("Book"))
    return {
      icon: BookOpen,
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    };
  if (t.includes("Soc") || t.includes("Cult"))
    return {
      icon: Globe,
      color: "bg-indigo-500",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    };
  if (t.includes("Deb") || t.includes("Speak"))
    return {
      icon: MessageCircle,
      color: "bg-rose-500",
      bg: "bg-rose-50",
      text: "text-rose-600",
    };
  if (t.includes("Med") || t.includes("Tech"))
    return {
      icon: Mic,
      color: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    };
  return {
    icon: Zap,
    color: "bg-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  };
};

export default function EventsClient({ events }: { events: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const myTickets = events.filter((e) => e.isRegistered);
  const ticketCount = myTickets.length;

  const handleRegister = async (eventId: string) => {
    setLoadingId(eventId);
    await registerForEvent(eventId);
    setLoadingId(null);
    router.refresh();
  };

  return (
    <div className="flex w-full h-full bg-slate-50">
      {/* ... (Keep Header and Hero Banner code exactly the same) ... */}

      {/* === CENTER CONTENT (Fluid) === */}
      <div className="flex-1 overflow-y-auto scroll-smooth border-r border-slate-100 p-6 lg:p-10 relative">
        {/* Sticky Header (Keep as is) */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 mb-6 sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600 border border-purple-200 shadow-sm">
              <Users size={28} />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-700 text-xl leading-tight">
                Events
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Join & Network
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
              <Ticket size={18} /> {ticketCount}{" "}
              <span className="hidden sm:inline">Tickets</span>
            </div>
          </div>
        </div>

        <main className="space-y-8 pb-24 lg:pb-0 max-w-5xl mx-auto">
          {/* Hero Banner (Keep as is) */}
          <div className="w-full bg-slate-900 rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-slate-300 relative overflow-hidden group">
            {/* ... (Keep Hero content) ... */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-90"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div className="flex-1">
                <span className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-sm border border-white/10">
                  <Flame
                    size={12}
                    className="text-yellow-300"
                    fill="currentColor"
                  />{" "}
                  Featured Event
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  Nitro Win <br /> Championship 🏆
                </h2>
                <p className="opacity-90 max-w-lg font-medium text-lg leading-relaxed mb-8 text-indigo-100">
                  The ultimate soft-skills scavenger hunt. Compete with 100+
                  students, solve challenges, and win exclusive prizes.
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

              <button className="px-8 py-4 bg-[#00ff9d] text-emerald-950 hover:bg-[#00e68d] shadow-emerald-500/20 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 w-full md:w-auto justify-center">
                Coming Soon <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Filter & Search (Keep as is) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-extrabold text-slate-700 text-xl">
              Upcoming Events
            </h3>
            <div className="w-full sm:w-auto flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border-2 border-slate-100 focus-within:border-purple-200 focus-within:ring-4 focus-within:ring-purple-50 transition-all shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by topic..."
                className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none w-full sm:w-48 placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* 3. Event Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => {
              const style = getEventStyle(event.type);
              const EventIcon = style.icon;
              const dateObj = new Date(event.date);
              const timeString = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const dateString = dateObj.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

              // NEW: Logic to check if full
              const isFull = event.currentRegistrations >= event.capacity;

              return (
                <div
                  key={event.id}
                  className="group bg-white border-2 border-slate-100 rounded-[24px] p-6 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${style.color}`}
                    >
                      <EventIcon size={24} />
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.bg} ${style.text}`}
                    >
                      {event.type}
                    </div>
                  </div>

                  <div className="flex-1 relative z-10">
                    <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Calendar size={14} /> {dateString}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Clock size={14} /> {timeString}
                      </span>

                      {/* NEW: Updated Capacity Indicator */}
                      <span
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-colors ${
                          isFull
                            ? "bg-rose-50 border-rose-100 text-rose-500"
                            : "bg-slate-50 border-slate-100"
                        }`}
                      >
                        <Users size={14} />
                        {event.currentRegistrations} / {event.capacity} Spots
                      </span>
                    </div>
                  </div>

                  {/* LOGIC BLOCK: Registered -> Full -> Join */}
                  {event.isRegistered ? (
                    <div className="space-y-2">
                      <div className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 relative z-10">
                        <CheckCircle size={16} /> Registered
                      </div>
                      {event.meetingLink && (
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#0ea5e9] text-white shadow-md hover:bg-sky-600 relative z-10"
                        >
                          <Video size={16} /> Join Now
                        </a>
                      )}
                    </div>
                  ) : isFull ? (
                    // NEW: "House Full" Message
                    <div className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed relative z-10">
                      <Lock size={16} /> House Full
                    </div>
                  ) : (
                    // Existing Join Button
                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={loadingId === event.id}
                      className={`
                                       w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-[4px] flex items-center justify-center gap-2 relative z-10
                                       bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600
                                       ${loadingId === event.id ? "opacity-70 cursor-not-allowed" : ""}
                                    `}
                    >
                      {loadingId === event.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />{" "}
                          processing
                        </>
                      ) : (
                        "Join Event"
                      )}
                    </button>
                  )}

                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${style.color}`}
                  ></div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* === RIGHT SIDEBAR (Keep as is) === */}
      <div className="hidden lg:flex flex-col w-[350px] 2xl:w-[400px] bg-slate-50/50 p-6 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-6 shrink-0 border-l-2 border-slate-100">
        {/* ... (Keep Sidebar Widgets) ... */}
        {/* Widget 1: My Tickets */}
        <div className="bg-white border-2 border-slate-200 rounded-[24px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
              <Ticket size={18} className="text-purple-500" /> My Tickets
            </h3>
            <button className="text-xs font-bold text-slate-400 hover:text-purple-500">
              View All
            </button>
          </div>

          {ticketCount === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
              <Ticket size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-400">
                No upcoming events.
              </p>
              <p className="text-[10px] text-slate-300 mt-1">
                Register for an event to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((e) => {
                const style = getEventStyle(e.type);
                const EventIcon = style.icon;
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${style.color}`}
                    >
                      <EventIcon size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-sm truncate text-slate-700">
                        {e.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        {new Date(e.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                <p className="text-xs font-bold text-slate-600 leading-tight">
                  Welcome to the Events Portal!
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  Just now
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Castpotro Plus */}
        <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-[24px] p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 transition-all duration-500">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown
                size={24}
                className="text-yellow-300 animate-pulse"
                fill="currentColor"
              />
              <h3 className="font-black text-lg uppercase tracking-wide">
                VIP Access
              </h3>
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
    </div>
  );
}
