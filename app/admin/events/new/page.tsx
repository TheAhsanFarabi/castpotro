import { createEvent } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/events" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Cancel
      </Link>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Event</h1>
        
        <form action={createEvent} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Event Title</label>
                <input name="title" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]" placeholder="e.g. Annual Tech Summit" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Date & Time</label>
                    <input type="datetime-local" name="date" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Type</label>
                    <select name="type" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
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
                    <input name="location" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Hall A / Zoom" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Capacity</label>
                    <input type="number" name="capacity" required defaultValue={50} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea name="description" required rows={4} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="Describe the event..." />
            </div>

            <button className="w-full bg-[#0ea5e9] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-600 transition shadow-lg shadow-sky-200">
                <Save size={20} /> Publish Event
            </button>
        </form>
      </div>
    </div>
  );
}