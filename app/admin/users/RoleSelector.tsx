"use client";

import { updateUserRole } from "@/app/actions/admin";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function RoleSelector({ 
  userId, 
  initialRole 
}: { 
  userId: string, 
  initialRole: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setLoading(true);
    
    // Call the server action directly
    await updateUserRole(userId, newRole);
    
    setLoading(false);
  };

  return (
    <div className="relative">
      <select 
         defaultValue={initialRole}
         onChange={handleChange}
         disabled={loading}
         className={`
            px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8
            ${initialRole === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 
              initialRole === 'INSTRUCTOR' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
         `}
      >
         <option value="USER">Student</option>
         <option value="INSTRUCTOR">Instructor</option>
         <option value="COMMUNITY_MANAGER">Community Mgr</option>
         <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      
      {loading && (
        <div className="absolute right-2 top-1.5 text-indigo-500">
           <Loader2 size={12} className="animate-spin" />
        </div>
      )}
    </div>
  );
}