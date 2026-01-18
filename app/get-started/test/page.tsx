"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Heart, Check } from 'lucide-react';
import { SKILLS } from '@/lib/data'; // Import SKILLS instead of TEST_QUESTIONS

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill');
  
  // Find the skill object
  const selectedSkill = SKILLS.find(s => s.id === skillId);
  
  // Use specific questions or fallback to empty array
  const questions = selectedSkill?.questions || [];

  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Guard clause if skill is invalid
  if (!selectedSkill || questions.length === 0) {
     return <div className="p-10 text-center">Skill not found or has no test. <button onClick={() => router.push('/')} className="text-blue-500 underline">Go Home</button></div>;
  }

  const currentQuestion = questions[step];
  const progress = ((step) / questions.length) * 100;

  const handleCheck = () => {
    if (!selectedOption) return;
    if (selectedOption === currentQuestion.correctId) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const handleContinue = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelectedOption(null);
      setStatus('idle');
    } else {
      // Test complete, go to registration
      router.push(`/register?skill=${skillId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl p-6 flex items-center gap-4">
        <X className="text-slate-300 cursor-pointer" onClick={() => router.push('/')} />
        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0ea5e9] transition-all duration-500 ease-out"
            style={{ width: `${progress + (status === 'correct' ? 50 : 0)}%` }}
          />
        </div>
        <div className="flex items-center text-red-500 font-bold gap-1">
           <Heart fill="#ef4444" size={24} /> 3
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 w-full max-w-2xl px-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          {currentQuestion.question}
        </h2>

        {currentQuestion.type === 'image-select' ? (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => status === 'idle' && setSelectedOption(opt.id)}
                className={`card-select p-6 flex flex-col items-center gap-4 ${selectedOption === opt.id ? 'selected' : ''}`}
              >
                <span className="text-6xl">{'emoji' in opt ? opt.emoji : '❓'}</span>
                <span className="text-lg font-bold">{opt.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => status === 'idle' && setSelectedOption(opt.id)}
                className={`card-select p-4 flex items-center gap-4 text-lg font-bold ${selectedOption === opt.id ? 'selected' : ''}`}
              >
                <div className={`w-8 h-8 border-2 rounded-xl flex items-center justify-center font-bold text-sm ${selectedOption === opt.id ? 'border-[#0ea5e9] bg-[#0ea5e9] text-white' : 'border-slate-300 text-slate-300'}`}>
                  {opt.id}
                </div>
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className={`w-full p-8 border-t-2 transition-colors duration-300 ${status === 'correct' ? 'bg-green-100 border-green-300' : status === 'wrong' ? 'bg-red-100 border-red-300' : 'bg-white border-slate-200'}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
            {status === 'correct' && (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm"><Check size={36} strokeWidth={4} /></div>
                <div className="font-extrabold text-green-700 text-xl">Excellent!</div>
              </div>
            )}
             {status === 'wrong' && (
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"><X size={36} strokeWidth={4} /></div>
                 <div><div className="font-extrabold text-red-700 text-xl">Correct Answer:</div><div className="font-bold text-red-700">Option {currentQuestion.correctId}</div></div>
              </div>
            )}
          </div>

          <button 
            onClick={status === 'idle' ? handleCheck : handleContinue}
            disabled={!selectedOption}
            className={`w-full md:w-40 py-3 rounded-2xl text-lg font-extrabold uppercase tracking-widest transition-all
              ${status === 'idle' 
                ? selectedOption ? 'bg-[#0ea5e9] text-white border-b-4 border-[#0284c7] hover:bg-sky-400' : 'bg-slate-200 text-slate-400 border-b-4 border-slate-200 pointer-events-none' 
                : status === 'correct' ? 'bg-green-500 text-white border-b-4 border-green-600 hover:bg-green-400' : 'bg-red-500 text-white border-b-4 border-red-600 hover:bg-red-400'}
            `}
          >
            {status === 'idle' ? 'Check' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep the Suspense wrapper in the default export
import { Suspense } from 'react';
export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestContent />
    </Suspense>
  );
}