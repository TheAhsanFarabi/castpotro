import { createQuest } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewQuestPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/quests" className="flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600">
        <ArrowLeft size={18} /> Cancel
      </Link>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Quest</h1>
        
        <form action={createQuest} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Quest Title</label>
                <input name="title" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-[#0ea5e9]" placeholder="e.g. Plant a Tree" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea name="description" required rows={3} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="Instructions for the user..." />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">XP Reward</label>
                    <input type="number" name="xp" required defaultValue={100} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">SDG Category (1-17)</label>
                    <input type="number" name="sdgId" min="1" max="17" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. 13 for Climate" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Frequency</label>
                    <select name="frequency" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <option value="ONCE">One-time</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Verification Type</label>
                    <select name="verificationType" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <option value="TEXT">Text Reflection</option>
                        <option value="AI_IMAGE">AI Photo Verification</option>
                        <option value="LINK">External Link</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">AI Prompt (Optional)</label>
                <p className="text-xs text-slate-400">If using AI Image verification, what should the AI look for?</p>
                <input name="aiPrompt" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="e.g. Check if image contains a recycled bottle" />
            </div>

            <button className="w-full bg-[#0ea5e9] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-600 transition shadow-lg shadow-sky-200">
                <Save size={20} /> Publish Quest
            </button>
        </form>
      </div>
    </div>
  );
}