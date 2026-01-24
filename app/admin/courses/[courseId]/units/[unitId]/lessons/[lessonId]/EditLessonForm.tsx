"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Save, Loader2, Video, Type } from "lucide-react";
import { updateLesson } from "@/app/actions/admin";

// Dynamic import for the Editor (Client-side only)
const BlockEditor = dynamic(() => import("@/app/components/BlockEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-xl" />
});

export default function EditLessonForm({ lesson, path }: { lesson: any, path: string }) {
  const [formData, setFormData] = useState({
    title: lesson.title,
    videoUrl: lesson.videoUrl || "",
    theory: lesson.theory || ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLesson(lesson.id, {
        title: formData.title,
        videoUrl: formData.videoUrl,
        theory: formData.theory,
        path
      });
      alert("Lesson updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-700 text-lg">Edit Lesson Content</h3>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-xl font-bold hover:bg-sky-600 transition disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
             <Type size={14} /> Lesson Title
          </label>
          <input 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:border-[#0ea5e9] focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
             <Video size={14} /> Video URL (YouTube)
          </label>
          <input 
            value={formData.videoUrl}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            className="w-full p-3 border-2 border-slate-100 rounded-xl font-medium text-slate-600 focus:border-[#0ea5e9] focus:outline-none"
            placeholder="e.g. https://youtube.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
           Interactive Theory (Rich Text)
        </label>
        <div className="border-2 border-slate-100 rounded-xl min-h-[400px] p-2 focus-within:border-[#0ea5e9] transition-colors">
           <BlockEditor 
              initialContent={formData.theory}
              onChange={(json) => setFormData({...formData, theory: json})}
           />
        </div>
      </div>
    </div>
  );
}