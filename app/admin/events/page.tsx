import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar, MapPin, Users, MoreVertical, Trash2, Edit, BarChart3 } from "lucide-react";
import { deleteEvent } from "@/app/actions/admin";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: { select: { registrations: true } }
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Event Management</h1>
            <p className="text-slate-500">Create, edit, and track your events.</p>
        </div>
        <Link href="/admin/events/new" className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-600 transition shadow-lg shadow-sky-200">
            <Plus size={20} /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map(event => {
            const fillPercent = Math.round((event._count.registrations / event.capacity) * 100);
            
            return (
              <div key={event.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition">
                 
                 {/* Date Box */}
                 <div className="bg-slate-100 p-4 rounded-xl text-center min-w-[80px]">
                    <div className="text-xs font-bold text-slate-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-2xl font-black text-slate-800">{new Date(event.date).getDate()}</div>
                 </div>

                 {/* Info */}
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${event.type === 'Workshop' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {event.type}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {event.capacity} Capacity</span>
                    </div>
                 </div>

                 {/* Stats Mini */}
                 <div className="w-full md:w-48">
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">Registrations</span>
                        <span className="text-[#0ea5e9]">{event._count.registrations}/{event.capacity}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0ea5e9]" style={{ width: `${fillPercent}%` }}></div>
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="flex items-center gap-2">
                    <Link href={`/admin/events/${event.id}`} className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 rounded-lg transition" title="View Stats">
                        <BarChart3 size={20} />
                    </Link>
                    <Link href={`/admin/events/${event.id}/edit`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Edit">
                        <Edit size={20} />
                    </Link>
                    <form action={deleteEvent.bind(null, event.id)}>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <Trash2 size={20} />
                        </button>
                    </form>
                 </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}