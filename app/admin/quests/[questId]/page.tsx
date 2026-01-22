import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Image as ImageIcon, Bot, AlertTriangle, MessageSquare } from "lucide-react";
import { reviewSubmission } from "@/app/actions/admin";

export default async function QuestVerificationPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  // Fetch Quest with PENDING submissions
  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: {
      submissions: {
        where: { status: "PENDING" }, // Only show items needing human review
        include: { user: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!quest) return <div>Quest not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/quests" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600 transition">
        <ArrowLeft size={18} /> Back to Quests
      </Link>

      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
         <h1 className="text-3xl font-black text-slate-800 mb-2">{quest.title}</h1>
         <p className="text-slate-500">{quest.description}</p>
         <div className="mt-4 flex gap-4 text-sm font-bold text-slate-400">
            <span className="bg-slate-100 px-2 py-1 rounded">SDG {quest.sdgId}</span>
            <span>•</span>
            <span className="text-amber-500">{quest.xp} XP</span>
            <span>•</span>
            <span className="text-[#0ea5e9] flex items-center gap-1">
                <Clock size={14} /> {quest.submissions.length} Pending Review
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {quest.submissions.length === 0 && (
            <div className="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <CheckCircle size={48} className="mx-auto mb-4 text-emerald-200" />
                <p className="text-lg text-slate-600 font-bold">All caught up!</p>
                <p className="text-sm">No pending submissions to verify.</p>
            </div>
        )}

        {quest.submissions.map((sub) => (
            <div key={sub.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
                
                {/* 1. User & Evidence Section */}
                <div className="flex-1 space-y-6">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {sub.user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">{sub.user.name || "Anonymous"}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Submitted: {new Date(sub.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Text Proof */}
                    {sub.proofText && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <h5 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                <MessageSquare size={12} /> Reflection
                            </h5>
                            <p className="text-slate-700 font-medium italic">"{sub.proofText}"</p>
                        </div>
                    )}

                    {/* Image Proof */}
                    {sub.proofImage ? (
                        <div className="rounded-2xl overflow-hidden border-2 border-slate-100 relative group">
                            {/* In real app, replace with <Image /> */}
                            <img 
                                src={sub.proofImage} 
                                alt="Proof" 
                                className="w-full h-64 object-cover bg-slate-100" 
                            />
                            <a 
                                href={sub.proofImage} 
                                target="_blank" 
                                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                View Full Size
                            </a>
                        </div>
                    ) : null}
                </div>

                {/* 2. AI Analysis & Admin Actions */}
                <div className="lg:w-80 flex flex-col gap-6 border-l border-slate-100 lg:pl-8">
                    
                    {/* AI Insight Card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-sm">
                            <Bot size={18} /> AI Analysis
                        </div>
                        
                        {sub.aiConfidence ? (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                        <span>Confidence Score</span>
                                        <span>{Math.round(sub.aiConfidence * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${sub.aiConfidence > 0.8 ? 'bg-emerald-500' : sub.aiConfidence > 0.5 ? 'bg-amber-400' : 'bg-red-400'}`} 
                                            style={{ width: `${sub.aiConfidence * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {sub.feedback && (
                                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                                        <span className="font-bold text-slate-400 block mb-1">System Log:</span>
                                        "{sub.feedback}"
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic">
                                No AI analysis available for this submission type.
                            </div>
                        )}
                    </div>

                    {/* Manual Override Actions */}
                    <div className="space-y-3 mt-auto">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Decision</h5>
                        
                        <form action={reviewSubmission.bind(null, sub.id, "APPROVED", "Manually approved by admin.")} className="w-full">
                            <button className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                                <CheckCircle size={18} /> Approve Quest
                            </button>
                        </form>
                        
                        <form action={reviewSubmission.bind(null, sub.id, "REJECTED", "Evidence insufficient.")} className="w-full">
                            <button className="w-full py-3.5 bg-white text-rose-500 border-2 border-rose-100 rounded-xl font-bold text-sm hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2">
                                <XCircle size={18} /> Reject
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        ))}
      </div>
    </div>
  );
}