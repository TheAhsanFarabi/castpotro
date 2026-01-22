import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, Zap, Users } from "lucide-react";
import VirtualVenueCard from "./VirtualVenueCard"; // Ensure this file exists in the same folder

export default async function EventStatsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  // 1. Fetch Event with Registrations
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!event) return <div className="p-8 text-center text-slate-500">Event not found</div>;

  // 2. Statistics Logic
  const totalRegistered = event.registrations.length;
  const capacity = event.capacity > 0 ? event.capacity : 1; // Prevent division by zero
  const fillRate = Math.round((totalRegistered / capacity) * 100);
  
  // Math for the SVG Circle Progress
  const visualRate = Math.min(fillRate, 100); // Cap at 100% for visual
  const CIRCUMFERENCE = 440; // 2 * PI * 70
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * visualRate) / 100;

  const remainingSpots = Math.max(0, event.capacity - totalRegistered);
  
  // Date Formatting
  const dateStr = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* --- Top Nav --- */}
      <div className="flex items-center justify-between">
        <Link href="/admin/events" className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${fillRate >= 100 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {fillRate >= 100 ? 'Sold Out' : 'Registration Open'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Hero Card: Event Details --- */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10 space-y-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{event.title}</h1>
                    <p className="text-slate-300 font-medium text-lg max-w-lg leading-relaxed opacity-90">{event.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/5 font-bold text-sm">
                        <Calendar size={16} className="text-sky-300" /> {dateStr}
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/5 font-bold text-sm">
                        <Clock size={16} className="text-amber-300" /> {timeStr}
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/5 font-bold text-sm">
                        <MapPin size={16} className="text-emerald-300" /> {event.location}
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none transform translate-x-10 translate-y-10">
                <Zap size={240} />
            </div>
        </div>

        {/* --- Stats Card: Capacity Gauge --- */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="transform -rotate-90 w-full h-full drop-shadow-lg">
                    {/* Background Circle */}
                    <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                    {/* Progress Circle */}
                    <circle 
                        cx="80" cy="80" r="70" 
                        stroke={fillRate >= 100 ? '#ef4444' : '#0ea5e9'} 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={CIRCUMFERENCE} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{fillRate}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Filled</span>
                </div>
            </div>
            
            <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <span>Registered</span>
                    <span className="text-slate-900">{totalRegistered}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <span>Remaining</span>
                    <span className="text-slate-900">{remainingSpots}</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- Action Row: Virtual Venue & Attendees --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Virtual Venue Controller (Client Component) */}
        <VirtualVenueCard eventId={event.id} initialLink={event.meetingLink} />

        {/* 2. Attendees List Table */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                    <h3 className="font-bold text-xl text-slate-800">Guest List</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Real-time Data</p>
                </div>
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {totalRegistered} Guests
                </div>
            </div>
            
            <div className="overflow-x-auto flex-1 max-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-100 sticky top-0 bg-white z-10">
                        <tr>
                            <th className="p-5 pl-8">Name</th>
                            <th className="p-5">Email</th>
                            <th className="p-5">Registered</th>
                            <th className="p-5 text-right pr-8">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {event.registrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-slate-50/80 transition group">
                                <td className="p-5 pl-8 font-bold text-slate-700 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                        {reg.user.name?.charAt(0) || "U"}
                                    </div>
                                    {reg.user.name || "Anonymous"}
                                </td>
                                <td className="p-5 text-slate-500 text-sm font-medium">
                                    {reg.user.email}
                                </td>
                                <td className="p-5 text-slate-500 text-sm font-bold font-mono">
                                    {new Date(reg.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-5 text-right pr-8">
                                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 border border-emerald-100">
                                        Confirmed
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {event.registrations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400 font-medium">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <Users size={48} className="text-slate-300 mb-2" />
                                        <p>No registrations yet.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}