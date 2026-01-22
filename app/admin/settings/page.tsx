import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { updateAdminProfile } from "@/app/actions/admin";
import { Save, Server, ShieldCheck, Database } from "lucide-react";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return <div>Access Denied</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>

       {/* Profile Settings */}
       <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <ShieldCheck className="text-indigo-500" /> Admin Profile
          </h2>
          <form action={updateAdminProfile} className="space-y-4 max-w-lg">
             <input type="hidden" name="userId" value={user.id} />
             
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                <input name="name" defaultValue={user.name || ''} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             </div>
             
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input name="email" defaultValue={user.email} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             </div>

             <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition">
                <Save size={18} /> Save Changes
             </button>
          </form>
       </div>

       {/* System Info (Static for now) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Server size={20} /> Application Status</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Version</span> <span className="font-bold">v1.0.0 (Beta)</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span> <span className="font-bold text-emerald-500">Operational</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Maintenance Mode</span> <span className="font-bold text-slate-400">Off</span></div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Database size={20} /> Database Metrics</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Provider</span> <span className="font-bold">MySQL (Prisma)</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Region</span> <span className="font-bold">Localhost</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Last Backup</span> <span className="font-bold text-slate-400">Just now</span></div>
             </div>
          </div>
       </div>
    </div>
  );
}