import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  Target,
  Zap,
  Clock,
  Shield,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import { deleteQuest } from "@/app/actions/admin";

export default async function AdminQuestsPage() {
  const quests = await prisma.quest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: { where: { status: "PENDING" } } },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Quest Management
          </h1>
          <p className="text-slate-500">
            Create SDG challenges and verify impact.
          </p>
        </div>
        <Link
          href="/admin/quests/new"
          className="bg-[#0ea5e9] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-600 transition shadow-lg shadow-sky-200"
        >
          <Plus size={20} /> Create Quest
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group"
          >
            {/* Pending Badge */}
            {quest._count.submissions > 0 && (
              <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Clock size={12} /> {quest._count.submissions} Pending
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-lg">
                  {quest.sdgId}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    {quest.frequency}
                  </span>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight">
                    {quest.title}
                  </h3>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-lg bg-sky-50 text-[#0ea5e9] text-xs font-bold flex items-center gap-1">
                  <Zap size={14} /> {quest.xp} XP
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold flex items-center gap-1">
                  <Shield size={14} /> {quest.verificationType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
              <Link
                href={`/admin/quests/${quest.id}`}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-center text-sm font-bold hover:bg-slate-700 flex items-center justify-center gap-2"
              >
                <Eye size={16} /> View & Verify
              </Link>

              {/* NEW EDIT BUTTON */}
              <Link
                href={`/admin/quests/${quest.id}/edit`}
                className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
              >
                <Edit size={20} />
              </Link>

              <form action={deleteQuest.bind(null, quest.id)}>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
