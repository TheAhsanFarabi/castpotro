"use client";
import { useState, useRef } from "react";
import { X, Upload, CheckCircle, AlertCircle, Loader2, Camera, ArrowRight, FileText, Image as ImageIcon } from "lucide-react";
import { submitQuest } from "@/app/actions/quests";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function QuestSubmissionModal({ 
  quest, 
  onClose 
}: { 
  quest: any, 
  onClose: () => void 
}) {
  const router = useRouter();
  
  // --- States ---
  const [step, setStep] = useState<'briefing' | 'submission'>('briefing');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState("");
  
  // Image Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const result = await submitQuest(formData);

    if (result.success) {
      setStatus('success');
      setFeedback(result.feedback || "Quest Complete!");
      router.refresh(); 
      setTimeout(onClose, 2500); 
    } else {
      setStatus('error');
      setFeedback(result.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 relative flex flex-col max-h-[90vh]">
        
        {/* Header (Sticky) */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
                <h2 className="text-xl font-black text-slate-800 leading-tight">{quest.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        Step {step === 'briefing' ? '1/2' : '2/2'}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">•</span>
                    <span className="text-amber-500 font-bold text-xs">{quest.xp} XP Reward</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors">
               <X size={20} />
            </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
            
            {status === 'success' ? (
                /* --- SUCCESS STATE --- */
                <div className="flex flex-col items-center py-10 text-center animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Verified!</h3>
                    <p className="text-slate-500 font-medium">{feedback}</p>
                </div>
            ) : step === 'briefing' ? (
                /* --- STEP 1: BRIEFING / DOCUMENTATION --- */
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                        <div className="flex items-center gap-2 mb-3 text-sky-700 font-bold uppercase text-xs tracking-wider">
                            <FileText size={14} /> Mission Brief
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">
                            {quest.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Requirements:</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                <CheckCircle size={16} className="text-slate-300" />
                                Read the instructions carefully.
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                <CheckCircle size={16} className="text-slate-300" />
                                {quest.verificationType === 'AI_IMAGE' ? 'Take a clear photo as proof.' : 'Prepare your written reflection.'}
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                /* --- STEP 2: SUBMISSION --- */
                <form id="questForm" onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <input type="hidden" name="questId" value={quest.id} />
                    
                    {quest.verificationType === 'AI_IMAGE' ? (
                        <div className="space-y-4">
                             <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
                                <span>Evidence Upload</span>
                                {previewUrl && <span className="text-emerald-500">Ready to submit</span>}
                             </label>
                             
                             {/* Image Preview Area */}
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                                    ${previewUrl ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50 hover:border-indigo-300'}
                                `}
                             >
                                 {previewUrl ? (
                                     <>
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold backdrop-blur-sm">
                                            <Camera size={24} className="mr-2" /> Retake Photo
                                        </div>
                                     </>
                                 ) : (
                                     <div className="text-center p-6">
                                         <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                             <ImageIcon size={32} />
                                         </div>
                                         <p className="font-bold text-slate-600">Click to Upload</p>
                                         <p className="text-xs text-slate-400 mt-1">AI Scan: {quest.aiPrompt || "Standard verification"}</p>
                                     </div>
                                 )}
                                 <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    name="proofImage" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                 />
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase">Reflection / Answer</label>
                             <textarea 
                                name="proofText" 
                                required 
                                rows={5} 
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all" 
                                placeholder="Type your answer here..."
                             />
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-bold animate-pulse">
                            <AlertCircle size={16} /> {feedback}
                        </div>
                    )}
                </form>
            )}
        </div>

        {/* Footer Actions */}
        {status !== 'success' && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                {step === 'briefing' ? (
                    <button 
                        onClick={() => setStep('submission')}
                        className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        I'm Ready to Submit <ArrowRight size={16} />
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => setStep('briefing')}
                            className="px-6 py-4 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            form="questForm"
                            disabled={status === 'loading' || (quest.verificationType === 'AI_IMAGE' && !previewUrl)}
                            className="flex-1 py-4 bg-[#0ea5e9] text-white rounded-xl font-bold text-sm shadow-[0_4px_0_#0284c7] hover:shadow-[0_2px_0_#0284c7] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                        >
                            {status === 'loading' ? <><Loader2 className="animate-spin" /> Verifying...</> : "Submit Proof"}
                        </button>
                    </>
                )}
            </div>
        )}

      </div>
    </div>
  );
}