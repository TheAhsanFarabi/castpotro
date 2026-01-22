import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/app/actions/admin";
import { Users, Trash2, Search } from "lucide-react";
import RoleSelector from "./RoleSelector"; // <--- Import the new component

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
           <p className="text-slate-500">Manage access and roles for {users.length} users.</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-indigo-500 w-full md:w-64" placeholder="Search users..." />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
             <tr>
               <th className="p-6">User Identity</th>
               <th className="p-6">Role</th>
               <th className="p-6">Stats</th>
               <th className="p-6">Joined</th>
               <th className="p-6 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {users.map(user => (
               <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600">
                           {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800">{user.name || "Anonymous"}</div>
                           <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                     </div>
                  </td>
                  <td className="p-6">
                     {/* USE THE CLIENT COMPONENT HERE */}
                     <RoleSelector userId={user.id} initialRole={user.role} />
                  </td>
                  <td className="p-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-500">{user.xp} XP</span>
                        <span className="text-xs font-bold text-sky-500">{user.coins} Coins</span>
                     </div>
                  </td>
                  <td className="p-6 text-sm text-slate-500 font-medium">
                     {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                     <form action={deleteUser.bind(null, user.id)}>
                        <button 
                           className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                           title="Delete User"
                           disabled={user.role === 'SUPER_ADMIN'}
                        >
                           <Trash2 size={18} />
                        </button>
                     </form>
                  </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}