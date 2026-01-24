"use client";

import { updateEvent } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditEventForm({ event }: { event: any }) {
  const [minDateTime, setMinDateTime] = useState("");

  // 1. Calculate local date-time string for the 'min' attribute
  useEffect(() => {
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM
    const formatted = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setMinDateTime(formatted);
  }, []);

  // Format existing date for the input
  const defaultDateStr = new Date(event.date).toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/events"
        className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600"
      >
        <ArrowLeft size={18} /> Cancel
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Event</h1>

        <form action={updateEvent.bind(null, event.id)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Event Title
            </label>
            <input
              name="title"
              defaultValue={event.title}
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                defaultValue={defaultDateStr}
                required
                min={minDateTime} // <--- Restrict past dates
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                Must be in the future.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <select
                name="type"
                defaultValue={event.type}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="Workshop">Workshop</option>
                <option value="Networking">Networking</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Location
              </label>
              <input
                name="location"
                defaultValue={event.location}
                required
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={event.capacity}
                min={1}
                required
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={event.description}
              required
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition">
            <Save size={20} /> Update Event
          </button>
        </form>
      </div>
    </div>
  );
}
