import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { markNotificationRead } from "@/app/actions";
import { Bell, Video, Info } from "lucide-react";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 text-rose-500 rounded-xl"><Bell size={28} /></div>
        <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
            <p className="text-slate-400 font-bold text-center py-10">No new notifications.</p>
        )}

        {notifications.map(notif => (
          <div key={notif.id} className={`p-5 rounded-2xl border-2 flex gap-4 transition ${notif.isRead ? 'bg-white border-slate-100 opacity-70' : 'bg-sky-50 border-sky-100'}`}>
            <div className={`mt-1 p-2 rounded-full h-fit ${notif.type === 'EVENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {notif.type === 'EVENT' ? <Video size={20} /> : <Info size={20} />}
            </div>
            
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1">{notif.title}</h4>
                <p className="text-slate-600 text-sm mb-3">{notif.message}</p>
                
                {notif.link && (
                    <a href={notif.link} target="_blank" className="inline-block bg-[#0ea5e9] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-sky-600 transition">
                        Open Link
                    </a>
                )}
            </div>

            {!notif.isRead && (
                <form action={markNotificationRead.bind(null, notif.id)}>
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Mark Read</button>
                </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}