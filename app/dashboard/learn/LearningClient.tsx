"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Play,
  BookOpen,
  Brain,
  ChevronRight,
  X,
  Sparkles,
  Clock,
  Target,
  Zap,
  Loader2,
  Trophy,
  Save,
  PenTool,
  PanelRightOpen,
  PanelRightClose
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chatWithGemini, completeLesson } from "@/app/actions";
import { saveNote, getNote } from "@/app/actions/notes";
import dynamic from "next/dynamic";

// --- Dynamic Imports ---
// We import BlockEditor dynamically to disable Server-Side Rendering (SSR)
// because rich text editors rely heavily on the browser's 'window' object.
const BlockEditor = dynamic(() => import("@/app/components/BlockEditor"), { 
  ssr: false,
  loading: () => <div className="p-4 text-slate-400 text-sm animate-pulse">Loading Editor...</div>
});

// --- Helper: Fix YouTube Links ---
const getEmbedUrl = (url: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

export default function LearningClient({
  lesson,
  questions,
  courseId,
  courseTitle = "Soft Skills Course",
}: {
  lesson: any;
  questions: any[];
  courseId: string;
  courseTitle?: string;
}) {
  const router = useRouter();

  // --- Main State ---
  const [step, setStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);

  // --- Notes State ---
  const [noteContent, setNoteContent] = useState<string>("");
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(true); // <--- NEW: Prevents empty editor bug

  // --- Load User Notes (Fixed Logic) ---
  useEffect(() => {
    let isActive = true; // Prevent race conditions if user switches lessons fast

    async function load() {
      setIsNotesLoading(true); // Start loading UI
      try {
        const saved = await getNote(lesson.id);
        if (isActive) {
          if (saved) {
            setNoteContent(saved);
          } else {
            setNoteContent(""); // Reset if no note exists
          }
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        if (isActive) setIsNotesLoading(false); // Show editor
      }
    }

    load();

    return () => { isActive = false; };
  }, [lesson.id]);

  // --- Note Handlers ---
  const handleNoteChange = useCallback((content: string) => {
    setNoteContent(content);
  }, []);

  const handleManualSave = async () => {
    setIsSavingNote(true);
    await saveNote(lesson.id, noteContent);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  // --- Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // --- Quiz Handlers ---
  const handleQuizSelect = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[qIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const handleAiEvaluation = async () => {
    let currentScore = 0;
    const quizContext = questions
      .map((q, i) => {
        const isCorrect = quizAnswers[i] === q.correct;
        if (isCorrect) currentScore++;
        return `Q: "${q.question}" - Result: ${isCorrect ? "Correct" : "Incorrect"}`;
      })
      .join("\n");

    setScore(currentScore);
    setStep(4);
    setIsAiLoading(true);

    const prompt = `
      Context: I am a student taking the course "${courseTitle}" on Castpotro.
      Activity: I just completed the lesson "${lesson.title}".
      My Quiz Performance:
      ${quizContext}
      Total Score: ${currentScore} out of ${questions.length}.
      TASK: Feedback: A single, specific sentence evaluating my understanding of "${lesson.title}". If I got questions wrong, mention the specific concept I missed.
    `;

    try {
      const response = await chatWithGemini([{ role: "user", text: "Start" }], prompt);
      setAiFeedback(response);
    } catch (e) {
      setAiFeedback("Great work! Try to apply these concepts in your next conversation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFinishLesson = async () => {
    setIsCompleting(true);
    await completeLesson(courseId, lesson.id);
    router.refresh();
    router.push(`/dashboard?course=${courseId}`);
  };

  const parseOptions = (options: any) => {
    if (typeof options === "string") {
      try {
        return JSON.parse(options);
      } catch (e) {
        return [];
      }
    }
    return options || [];
  };

  // Helper to verify if theory is JSON (Rich Text) or Plain String
  const isRichText = (text: string) => {
    return text && text.trim().startsWith("[");
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden flex-col md:flex-row">
      
      {/* --- LEFT / CENTER: MAIN LEARNING CONTENT --- */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-40 shrink-0">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-100 rounded-xl"
          >
            <X size={28} />
          </Link>

          <div className="flex-1 mx-4 md:mx-12 max-w-2xl">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
              <div
                className="h-full bg-[#0ea5e9] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Note Toggle Button */}
             {(step === 1 || step === 2) && (
                <button 
                  onClick={() => setIsNotesOpen(!isNotesOpen)}
                  className={`p-2 rounded-xl border transition-all ${isNotesOpen ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-white text-slate-400 border-slate-200'}`}
                  title={isNotesOpen ? "Close Notes" : "Open Notes"}
                >
                   {isNotesOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
                </button>
             )}
            
            <div className="hidden sm:flex items-center gap-2 text-[#0ea5e9] font-black bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
              <Brain size={20} /> <span className="text-sm">AI Active</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-4xl">
            {/* STEP 1: THEORY */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right duration-500 w-full">
                <div className="bg-white p-8 md:p-12 rounded-[32px] border-2 border-slate-100 shadow-xl mb-8 animate-in zoom-in duration-300">
                  <div className="text-center mb-8">
                    <div className="bg-sky-100 text-[#0ea5e9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={40} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                        {lesson.title}
                    </h1>
                  </div>

                  {/* RICH TEXT RENDERER */}
                  <div className="prose prose-slate prose-lg max-w-none">
                    {isRichText(lesson.theory) ? (
                        <BlockEditor initialContent={lesson.theory} editable={false} />
                    ) : (
                        <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                           {lesson.theory || "No content available."}
                        </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-5 bg-[#0ea5e9] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500"
                >
                  Watch Video <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* STEP 2: VIDEO */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right duration-500 text-center w-full">
                <h1 className="text-3xl font-black text-slate-700 mb-8 flex items-center justify-center gap-3">
                  <span className="bg-rose-100 text-rose-500 p-2 rounded-xl">
                    <Play size={32} fill="currentColor" />
                  </span>
                  Watch & Learn
                </h1>
                <div className="aspect-video w-full rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-black mb-10">
                  {lesson.videoUrl ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(lesson.videoUrl)}
                      title="Lesson Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white font-bold bg-slate-800">
                      No Video Available
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                     setStep(3);
                     setIsNotesOpen(false); // Auto-close notes for quiz focus
                  }}
                  className="w-full py-5 bg-[#0ea5e9] text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#0284c7] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 hover:bg-sky-500"
                >
                  Start Quiz <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* STEP 3: QUIZ */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right duration-500 w-full">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-black text-slate-700 flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-500 p-2 rounded-xl">
                      <Target size={32} />
                    </span>
                    Knowledge Check
                  </h1>
                  <div className="text-2xl font-black text-slate-700 flex items-center gap-2">
                    <Clock className="text-slate-400" /> {timeLeft}s
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="bg-white p-8 rounded-[24px] border-2 border-slate-200 shadow-sm"
                    >
                      <h3 className="font-extrabold text-xl text-slate-800 mb-6 flex items-start gap-4">
                        <span className="bg-slate-100 text-slate-500 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm">
                          {qIndex + 1}
                        </span>
                        {q.question}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parseOptions(q.options).map(
                          (opt: string, optIndex: number) => (
                            <button
                              key={optIndex}
                              onClick={() => handleQuizSelect(qIndex, optIndex)}
                              className={`w-full text-left p-5 rounded-2xl font-bold border-2 transition-all flex items-center gap-3 ${
                                quizAnswers[qIndex] === optIndex
                                  ? "border-[#0ea5e9] bg-sky-50 text-[#0ea5e9] shadow-[0_4px_0_#bae6fd] -translate-y-1"
                                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  quizAnswers[qIndex] === optIndex
                                    ? "border-[#0ea5e9] bg-[#0ea5e9]"
                                    : "border-slate-300"
                                }`}
                              >
                                {quizAnswers[qIndex] === optIndex && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              {opt}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAiEvaluation}
                  disabled={quizAnswers.length < questions.length}
                  className="w-full mt-10 py-5 bg-green-500 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400"
                >
                  Submit & Get Feedback <Sparkles size={24} />
                </button>
              </div>
            )}

            {/* STEP 4: AI FEEDBACK & COMPLETION */}
            {step === 4 && (
              <div className="animate-in zoom-in duration-500 w-full">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 md:p-14 rounded-[40px] text-white shadow-2xl relative overflow-hidden ring-8 ring-indigo-50">
                   <div className="relative z-10">
                    <div className="flex flex-col items-center text-center gap-4 mb-10">
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-lg">
                        <Trophy className="text-yellow-300" size={48} />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Lesson Complete!
                      </h1>

                      {!isAiLoading && (
                        <div className="mt-2 bg-white/10 px-6 py-2 rounded-full border border-white/20 text-xl font-bold">
                          Your Score:{" "}
                          <span className="text-yellow-300">{score}</span> /{" "}
                          {questions.length}
                        </div>
                      )}
                    </div>

                    {isAiLoading ? (
                      <div className="h-64 flex flex-col items-center justify-center space-y-6 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/10">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                        <p className="font-bold text-xl animate-pulse text-indigo-200">
                          Analyzing your performance...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-lg">
                          <div className="flex items-start gap-4">
                            <Brain
                              size={32}
                              className="text-yellow-300 shrink-0 mt-1"
                            />
                            <div className="prose prose-invert prose-lg max-w-none font-medium leading-relaxed">
                              {aiFeedback}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isAiLoading && (
                  <button
                    onClick={handleFinishLesson}
                    disabled={isCompleting}
                    className="w-full mt-8 py-5 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_6px_0_#cbd5e1] active:shadow-none active:translate-y-[6px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:shadow-none disabled:translate-y-0"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="animate-spin" /> Saving Progress...
                      </>
                    ) : (
                      <>
                        Complete Lesson <CheckCircle size={24} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RIGHT: SMART NOTEPAD --- */}
      {(step === 1 || step === 2) && isNotesOpen && (
         <div className="w-full md:w-[400px] bg-yellow-50/50 border-l border-yellow-200 flex flex-col h-[400px] md:h-full shrink-0 transition-all shadow-xl z-30">
            <div className="p-4 border-b border-yellow-200 bg-yellow-100/50 flex items-center justify-between">
               <h3 className="font-bold text-yellow-900 flex items-center gap-2">
                  <PenTool size={18} /> My Smart Notes
               </h3>
               <button 
                 onClick={handleManualSave}
                 disabled={isSavingNote || isNotesLoading}
                 className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold hover:bg-yellow-500 transition-colors shadow-sm active:translate-y-0.5 disabled:opacity-50"
               >
                 <Save size={14} /> {isSavingNote ? "Saved" : "Save"}
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white/50 relative">
               
               {/* Loading State for Notes */}
               {isNotesLoading ? (
                 <div className="absolute inset-0 flex items-center justify-center text-yellow-600/50 gap-2 font-bold animate-pulse">
                    <Loader2 className="animate-spin" size={20} /> Loading Notes...
                 </div>
               ) : (
                 <BlockEditor 
                    key={lesson.id} 
                    initialContent={noteContent} 
                    onChange={handleNoteChange} 
                 />
               )}

            </div>
            <div className="p-3 text-[10px] text-yellow-700 text-center bg-yellow-100/30">
               Notes are saved automatically for this lesson.
            </div>
         </div>
      )}

    </div>
  );
}