import { updateEvent } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditEventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) return <div>Event not found</div>;

  // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
  const dateStr = new Date(event.date).toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/events" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Cancel
      </Link>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Event</h1>
        
        <form action={updateEvent.bind(null, event.id)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Event Title</label>
                <input name="title" defaultValue={event.title} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date & Time</label>
                    <input type="datetime-local" name="date" defaultValue={dateStr} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Type</label>
                    <select name="type" defaultValue={event.type} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <option value="Workshop">Workshop</option>
                        <option value="Networking">Networking</option>
                        <option value="Competition">Competition</option>
                        <option value="Seminar">Seminar</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input name="location" defaultValue={event.location} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Capacity</label>
                    <input type="number" name="capacity" defaultValue={event.capacity} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea name="description" defaultValue={event.description} required rows={4} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
            </div>

            <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition">
                <Save size={20} /> Update Event
            </button>
        </form>
      </div>
    </div>
  );
}