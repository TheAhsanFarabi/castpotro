"use client";

import { useState } from "react";
import { updateEventLink } from "@/app/actions";
import { Video, BellRing, CheckCircle, Loader2, Send } from "lucide-react";

export default function VirtualVenueCard({ eventId, initialLink }: { eventId: string, initialLink: string | null }) {
  const [link, setLink] = useState(initialLink || "");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async () => {
    setStatus('loading');
    
    // Call Server Action
    const result = await updateEventLink(eventId, link);
    
    if (result.success) {
      setStatus('success');
      // Reset to idle after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('idle');
      alert("Failed to update link");
    }
  };

  return (
    <div className="lg:col-span-1 bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        
        {/* Success Overlay Animation */}
        {status === 'success' && (
            <div className="absolute inset-0 bg-emerald-500/90 z-20 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
                <CheckCircle size={48} className="mb-2 animate-bounce" />
                <h3 className="font-black text-xl">Notified!</h3>
                <p className="text-sm font-medium opacity-90">Link sent to all attendees.</p>
            </div>
        )}

        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Video size={20} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Virtual Venue</h3>
                <p className="text-xs text-slate-400 font-medium">Add link & notify attendees</p>
            </div>
        </div>

        <div className="space-y-3">
            <input 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://zoom.us/j/..." 
                className="w-full p-3 rounded-xl border-2 border-slate-100 text-sm font-medium focus:border-indigo-300 focus:outline-none transition-colors"
            />
            
            <button 
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className={`
                    w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2
                    ${status === 'success' 
                        ? "bg-emerald-500 text-white" 
                        : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95"
                    }
                `}
            >
                {status === 'loading' ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                    <><BellRing size={16} /> Update & Notify All</>
                )}
            </button>
        </div>
        
        <p className="text-[10px] text-slate-400 mt-3 text-center leading-tight">
            Clicking update will immediately send a push notification.
        </p>
    </div>
  );
}