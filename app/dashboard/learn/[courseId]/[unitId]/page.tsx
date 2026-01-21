"use client";
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, Play, BookOpen, Brain, 
  ChevronRight, X, Sparkles, MessageCircle, Clock, 
  Target, Zap, AlertCircle, ThumbsUp, ThumbsDown, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { chatWithGemini } from '@/app/actions';

// --- ENHANCED LESSON DATA ---
const LESSON_DATA = {
  title: "The Art of Active Listening",
  category: "Communication",
  xp: 50,
  // Split theory into interactive chunks
  theoryIntro: {
    title: "What is Active Listening?",
    content: "Active listening isn't just about hearing words. It's about fully concentrating, understanding, responding, and then remembering what is being said. It turns a conversation into a connection."
  },
  scenario: {
    context: "Your colleague, Sarah, is venting about a stressful project deadline.",
    badResponse: "Oh, that reminds me of when I had three deadlines last week! It was crazy.",
    badReason: "This shifts the focus to yourself (Conversational Narcissism).",
    goodResponse: "It sounds like you're feeling really overwhelmed by the workload. Is the timeline the main issue?",
    goodReason: "This validates her feelings and asks a clarifying question (Reflective Listening)."
  },
  miniPuzzle: {
    question: "Which body language signal shows you are listening?",
    options: [
      { text: "Crossing arms and looking away", correct: false },
      { text: "Nodding and maintaining eye contact", correct: true },
      { text: "Checking your phone occasionally", correct: false }
    ]
  },
  videoUrl: "https://www.youtube.com/embed/t2uQEztD5KE",
  quiz: [
    {
      question: "Which of the following is NOT a key principle of active listening?",
      options: ["Paying Attention", "Interrupting frequently", "Deferring Judgment", "Providing Feedback"],
      correct: 1
    },
    {
      question: "What is the primary goal of active listening?",
      options: ["To win the argument", "To hear the words", "To understand the intent", "To prepare your response"],
      correct: 2
    }
  ]
};

export default function LearningPage() {
  const router = useRouter();
  
  // Main Steps: 1:Theory, 2:Video, 3:Quiz, 4:AI
  const [step, setStep] = useState(1); 
  
  // Sub-steps for Theory (0: Intro, 1: Scenario, 2: Puzzle)
  const [theorySubStep, setTheorySubStep] = useState(0); 
  const [puzzleSelected, setPuzzleSelected] = useState<number | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // --- Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // --- Handlers ---
  const handleQuizSelect = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const handleTheoryNext = () => {
    if (theorySubStep < 2) {
      setTheorySubStep(prev => prev + 1);
    } else {
      setStep(2); // Move to Video
    }
  };

  const handleAiEvaluation = async () => {
    setStep(4);
    setIsAiLoading(true);
    let score = 0;
    LESSON_DATA.quiz.forEach((q, i) => { if (quizAnswers[i] === q.correct) score++; });

    const prompt = `I completed "Active Listening". Scored ${score}/${LESSON_DATA.quiz.length}. Give brief feedback and 1 real-world challenge.`;
    
    try {
      const response = await chatWithGemini([{ role: 'user', text: 'Start' }], prompt);
      setAiFeedback(response);
    } catch (e) {
      setAiFeedback("Great work! Practice makes perfect.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
      
      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Sticky Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-50 shrink-0">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-100 rounded-xl">
                <X size={28} />
            </Link>
            
            {/* Progress Bar */}
            <div className="flex-1 mx-4 md:mx-12 max-w-2xl">
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                    <div 
                        className="h-full bg-[#0ea5e9] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[#0ea5e9] font-black bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
                <Brain size={20} /> <span className="text-sm">AI Active</span>
            </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                
                {/* --- STEP 1: INTERACTIVE THEORY --- */}
                {step === 1 && (
                <div className="animate-in slide-in-from-right duration-500 w-full">
                    
                    {/* Progress Dots for Theory */}
                    <div className="flex justify-center gap-2 mb-8">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === theorySubStep ? 'w-8 bg-[#0ea5e9]' : 'w-2 bg-slate-200'}`}></div>
                      ))}
                    </div>

                    {/* Sub-step 0: Intro Card */}
                    {theorySubStep === 0 && (
                      <div className="bg-white p-8 md:p-12 rounded-[32px] border-2 border-slate-100 shadow-xl mb-8 text-center animate-in zoom-in duration-300">
                          <div className="bg-sky-100 text-[#0ea5e9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                             <BookOpen size={40} />
                          </div>
                          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">{LESSON_DATA.theoryIntro.title}</h1>
                          <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            {LESSON_DATA.theoryIntro.content}
                          </p>
                      </div>
                    )}

                    {/* Sub-step 1: Scenario Comparison */}
                    {theorySubStep === 1 && (
                      <div className="animate-in zoom-in duration-300">
                         <h2 className="text-2xl font-black text-slate-700 text-center mb-6">Real-World Scenario</h2>
                         <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-xl mb-6">
                            <p className="text-lg font-bold text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                               "{LESSON_DATA.scenario.context}"
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Bad Example */}
                                <div className="border-2 border-red-100 bg-red-50/50 p-6 rounded-2xl relative overflow-hidden group">
                                    <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-xs mb-3">
                                        <ThumbsDown size={16} /> Bad Response
                                    </div>
                                    <p className="font-bold text-slate-700 mb-2">"{LESSON_DATA.scenario.badResponse}"</p>
                                    <p className="text-sm text-red-600 italic">Why: {LESSON_DATA.scenario.badReason}</p>
                                </div>

                                {/* Good Example */}
                                <div className="border-2 border-emerald-100 bg-emerald-50/50 p-6 rounded-2xl relative overflow-hidden group">
                                    <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-wider text-xs mb-3">
                                        <ThumbsUp size={16} /> Good Response
                                    </div>
                                    <p className="font-bold text-slate-700 mb-2">"{LESSON_DATA.scenario.goodResponse}"</p>
                                    <p className="text-sm text-emerald-700 italic">Why: {LESSON_DATA.scenario.goodReason}</p>
                                </div>
                            </div>
                         </div>
                      </div>
                    )}

                    {/* Sub-step 2: Mini Puzzle */}
                    {theorySubStep === 2 && (
                      <div className="animate-in zoom-in duration-300">
                         <h2 className="text-2xl font-black text-slate-700 text-center mb-6">Quick Warm-up</h2>
                         <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-xl mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">{LESSON_DATA.miniPuzzle.question}</h3>
                            <div className="space-y-3">
                               {LESSON_DATA.miniPuzzle.options.map((opt, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setPuzzleSelected(idx)}
                                    className={`w-full p-4 rounded-xl font-bold border-2 transition-all flex items-center justify-between ${
                                        puzzleSelected === idx 
                                        ? (opt.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-red-500 bg-red-50 text-red-700')
                                        : 'border-slate-200 text-slate-600 hover:border-sky-300'
                                    }`}
                                  >
                                     {opt.text}
                                     {puzzleSelected === idx && (
                                         opt.correct ? <CheckCircle size={20} /> : <X size={20} />
                                     )}
                                  </button>
                               ))}
                            </div>
                            {puzzleSelected !== null && (
                                <p className="text-center mt-4 font-bold text-slate-400 animate-pulse">
                                    {LESSON_DATA.miniPuzzle.options[puzzleSelected].correct ? "Correct! Let's move on." : "Not quite. Try again!"}
                                </p>
                            )}
                         </div>
                      </div>
                    )}

                    {/* Navigation Button */}
                    <button 
                        onClick={handleTheoryNext}
                        disabled={theorySubStep === 2 && puzzleSelected === null}
                        className="w-full py-5 bg-[#0ea5e9] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                    >
                        {theorySubStep < 2 ? "Next" : "Watch Video"} <ChevronRight size={24} />
                    </button>
                </div>
                )}

                {/* --- STEP 2: VIDEO --- */}
                {step === 2 && (
                <div className="animate-in slide-in-from-right duration-500 text-center">
                    <h1 className="text-3xl font-black text-slate-700 mb-8 flex items-center justify-center gap-3">
                        <span className="bg-rose-100 text-rose-500 p-2 rounded-xl"><Play size={32} fill="currentColor" /></span>
                        Watch & Learn
                    </h1>
                    <div className="aspect-video w-full rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-black mb-10">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={LESSON_DATA.videoUrl} 
                            title="Lesson Video" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                    <button 
                        onClick={() => setStep(3)}
                        className="w-full py-5 bg-[#0ea5e9] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500"
                    >
                        Start Quiz <ChevronRight size={24} />
                    </button>
                </div>
                )}

                {/* --- STEP 3: MCQ QUIZ --- */}
                {step === 3 && (
                <div className="animate-in slide-in-from-right duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-black text-slate-700 flex items-center gap-3">
                            <span className="bg-amber-100 text-amber-500 p-2 rounded-xl"><Target size={32} /></span>
                            Knowledge Check
                        </h1>
                    </div>
                    
                    <div className="space-y-6">
                    {LESSON_DATA.quiz.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-8 rounded-[24px] border-2 border-slate-200 shadow-sm hover:border-sky-100 transition-colors">
                            <h3 className="font-extrabold text-xl text-slate-800 mb-6 flex items-start gap-4">
                                <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm">{qIndex + 1}</span>
                                {q.question}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, optIndex) => (
                                <button
                                key={optIndex}
                                onClick={() => handleQuizSelect(qIndex, optIndex)}
                                className={`w-full text-left p-5 rounded-2xl font-bold border-2 transition-all flex items-center gap-3 ${
                                    quizAnswers[qIndex] === optIndex 
                                    ? 'border-[#0ea5e9] bg-sky-50 text-[#0ea5e9] shadow-[0_4px_0_#bae6fd] -translate-y-1' 
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                                >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    quizAnswers[qIndex] === optIndex ? 'border-[#0ea5e9] bg-[#0ea5e9]' : 'border-slate-300'
                                }`}>
                                    {quizAnswers[qIndex] === optIndex && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                {opt}
                                </button>
                            ))}
                            </div>
                        </div>
                    ))}
                    </div>

                    <button 
                        onClick={handleAiEvaluation}
                        disabled={quizAnswers.length < LESSON_DATA.quiz.length}
                        className="w-full mt-10 py-5 bg-green-500 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400"
                    >
                        Submit & Get Feedback <Sparkles size={24} />
                    </button>
                </div>
                )}

                {/* --- STEP 4: AI EVALUATION --- */}
                {step === 4 && (
                <div className="animate-in zoom-in duration-500">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 md:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden ring-8 ring-indigo-50">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                        <div className="relative z-10">
                        <div className="flex flex-col items-center text-center gap-4 mb-10">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-lg">
                                <Sparkles className="text-yellow-300" size={48} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">AI Evaluation</h1>
                        </div>

                        {isAiLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center space-y-6 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/10">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                                <p className="font-bold text-xl animate-pulse text-indigo-200">Analyzing...</p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-lg">
                                    <div className="flex items-start gap-4">
                                        <Brain size={32} className="text-yellow-300 shrink-0 mt-1" />
                                        <div className="prose prose-invert prose-lg max-w-none font-medium leading-relaxed">
                                            {aiFeedback}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex items-center gap-3 text-indigo-200 font-bold bg-black/20 px-6 py-3 rounded-full border border-white/10">
                                        <Zap size={20} className="text-yellow-400" fill="currentColor" /> 
                                        <span>+50 XP Earned</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>

                    {!isAiLoading && (
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full mt-8 py-5 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#cbd5e1] active:shadow-none active:translate-y-[6px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        Complete Lesson <CheckCircle size={24} />
                    </button>
                    )}
                </div>
                )}

            </div>
        </div>

      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 z-40 overflow-y-auto">
         
         <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Target size={20} className="text-[#0ea5e9]" /> Lesson Info
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-bold text-slate-500">Unit</span>
                    <span className="text-sm font-black text-slate-700">1. Listening</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-bold text-slate-500">XP Value</span>
                    <span className="text-sm font-black text-amber-500 flex items-center gap-1"><Zap size={14} fill="currentColor" /> 50</span>
                </div>
            </div>
         </div>

         <div className={`border-2 rounded-3xl p-6 shadow-sm mb-6 transition-all duration-300 ${step === 3 ? 'bg-slate-800 border-slate-700 scale-105 ring-4 ring-slate-200' : 'bg-white border-slate-200 opacity-60'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${step === 3 ? 'text-white' : 'text-slate-700'}`}>
                <Clock size={20} className={step === 3 ? 'text-green-400' : 'text-slate-400'} /> 
                {step === 3 ? 'Quiz Timer' : 'Time Remaining'}
            </h3>
            <div className="text-center py-4">
                <div className={`text-6xl font-black tabular-nums tracking-tight ${step === 3 ? 'text-white' : 'text-slate-300'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">AI Mentor</h4>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">
                            {step === 4 ? "Analyzing..." : "Standby"}
                        </p>
                    </div>
                </div>
                <p className="text-sm font-medium opacity-90 leading-relaxed">
                    I'm watching your progress. Complete the quiz to get my personalized feedback!
                </p>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-20">
                <Sparkles size={100} />
            </div>
         </div>

      </div>

    </div>
  );
}