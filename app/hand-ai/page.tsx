import SignLanguageDetector from "@/app/components/SignLanguageDetector";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HandAIPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 mb-8 transition">
           <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        
        <div className="text-center mb-10">
           <h1 className="text-4xl font-black text-slate-800 mb-2">Sign Language Tutor <span className="text-[#0ea5e9]">Beta</span></h1>
           <p className="text-slate-500 font-medium text-lg">Practice your gestures with real-time AI feedback.</p>
        </div>

        <SignLanguageDetector />
      </div>
    </div>
  );
}