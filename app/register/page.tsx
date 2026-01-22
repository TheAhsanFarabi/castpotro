"use client";
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { registerAction } from '../actions';
import confetti from 'canvas-confetti';
import { Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const initialState = {
  message: '',
  success: false,
};

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, speed = 100, delay = 2000 }: { text: string[], speed?: number, delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);

  useEffect(() => {
    const i = loopNum % text.length;
    const fullText = text[i];

    const handleTyping = () => {
      setTypingSpeed(isDeleting ? speed / 2 : speed);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      } else {
        setCurrentText(
          isDeleting 
            ? fullText.substring(0, currentText.length - 1) 
            : fullText.substring(0, currentText.length + 1)
        );
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typingSpeed, text, speed, delay]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {currentText}
      <span className="animate-pulse text-sky-500 font-bold">|</span>
    </span>
  );
};

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      // Confetti Effect
      const end = Date.now() + 3 * 1000; 
      const colors = ['#0ea5e9', '#ffffff', '#f59e0b'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      }());

      setTimeout(() => router.push('/dashboard'), 2500);
    }
  }, [state?.success, router]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 p-6">
      
      {/* --- LEFT: FORM --- */}
      <div className="w-full max-w-md bg-white p-8 rounded-[32px] shadow-xl border-2 border-slate-100 relative">
          
          <div className="flex justify-between items-center mb-6">
              <Link href="/" className="text-slate-400 hover:text-slate-600 p-2 -ml-2 rounded-full hover:bg-slate-50 transition">
                  <ArrowLeft size={24} />
              </Link>
              <Link href="/login" className="text-sm font-bold text-[#0ea5e9] uppercase tracking-wider hover:underline">
                  Log in
              </Link>
          </div>

          <div className="flex flex-col items-start mb-6">
              <div className="bg-sky-50 p-3 rounded-2xl mb-4 text-[#0ea5e9]">
                  <Zap size={28} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">Create Profile</h2>
              <p className="text-slate-500 font-medium">Join us and start your streak.</p>
          </div>
          
          <form className="flex flex-col gap-4" action={formAction}>
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="age" placeholder="Age" className="input-field" required />
                  <input type="text" name="name" placeholder="Name" className="input-field" />
              </div>
              <input type="email" name="email" placeholder="Email Address" className="input-field" required />
              <input type="password" name="password" placeholder="Password" className="input-field" required />
              
              {state?.message && (
                  <div className={`p-3 rounded-xl text-sm font-bold text-center ${state.success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {state.message}
                  </div>
              )}

              <button 
                  disabled={isPending || state?.success} 
                  className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-sky-200 mt-2 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                  {isPending ? <Loader2 className="animate-spin" /> : null}
                  {isPending ? 'Creating...' : state?.success ? 'Welcome!' : 'Start Learning'}
              </button>
          </form>

          <p className="text-center text-xs text-slate-400 font-bold mt-6">
              By joining, you agree to our Terms.
          </p>
      </div>

      {/* --- RIGHT: ROBOT WITH TYPEWRITER CONVO --- */}
      <div className="hidden lg:flex flex-col items-center justify-center relative">
          
          {/* Speech Bubble with Typewriter */}
          <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white px-8 py-5 rounded-[2rem] rounded-bl-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-slate-100 mb-2 transform -translate-x-12 relative z-20 min-w-[280px]"
          >
              <div className="text-slate-700 font-bold text-xl">
                 <Typewriter 
                    text={[
                        "Initializing...", 
                        "Hello human! 👋", 
                        "I am Casty v1.0 🤖", 
                        "Create an account...", 
                        "And let's learn together!", 
                        "Waiting for input... ⏳"
                    ]} 
                    speed={80}
                    delay={1500}
                 />
              </div>
              {/* Pointer */}
              <div className="absolute -bottom-3 left-0 w-6 h-6 bg-white border-b-2 border-l-2 border-slate-100 transform -rotate-45"></div>
          </motion.div>

          {/* The Robot */}
          <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -20, 0], opacity: 1 }}
              transition={{ 
                  y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  opacity: { duration: 0.8 }
              }}
              className="w-[400px] h-[400px] relative z-10 drop-shadow-2xl"
          >
              <img 
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" 
                  alt="Robot Mascot" 
                  className="w-full h-full object-contain"
              />
          </motion.div>
          
          {/* Floor Shadow */}
          <motion.div 
              className="w-48 h-6 bg-black/10 rounded-full blur-2xl mt-2"
              animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />

      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}