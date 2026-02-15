"use client";
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { registerAction } from '../actions';
import confetti from 'canvas-confetti';
import { ArrowLeft, Loader2, School, Globe } from 'lucide-react'; 
import { motion } from 'framer-motion';

const initialState = {
  message: '',
  success: false,
};

// --- DATA: ALPHABETICAL COUNTRY LIST ---
const COUNTRIES = [
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "China", flag: "🇨🇳" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
];

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, speed = 100, delay = 2000 }: { text: string[], speed?: number, delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
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
      <span className="animate-pulse text-[#0ea5e9] font-bold">|</span>
    </span>
  );
};

// --- MAIN REGISTER PAGE COMPONENT ---
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const router = useRouter();

  // State for dynamic University fetching
  const [selectedCountry, setSelectedCountry] = useState("");
  const [universityList, setUniversityList] = useState<string[]>([]);
  const [isLoadingUnis, setIsLoadingUnis] = useState(false);

  // Confetti Effect on Success
  useEffect(() => {
    if (state?.success) {
      const end = Date.now() + 3 * 1000; 
      const colors = ['#0ea5e9', '#ec4899', '#ffffff'];

      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());

      setTimeout(() => router.push('/dashboard'), 2500);
    }
  }, [state?.success, router]);

  // Fetch Universities when Country changes
  useEffect(() => {
    if (!selectedCountry) {
        setUniversityList([]);
        return;
    }

    const fetchUniversities = async () => {
        setIsLoadingUnis(true);
        try {
            // Using Hipolabs free public API
            const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(selectedCountry)}`);
            const data = await response.json();
            const names = data.map((u: any) => u.name);
            // Remove duplicates and sort
            setUniversityList([...new Set(names)].sort() as string[]);
        } catch (error) {
            console.error("Failed to fetch universities", error);
        } finally {
            setIsLoadingUnis(false);
        }
    };

    // Debounce slightly to avoid rapid calls
    const timeoutId = setTimeout(() => fetchUniversities(), 500);
    return () => clearTimeout(timeoutId);

  }, [selectedCountry]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 p-6 min-h-screen relative">
      
      {/* --- LOGO --- */}
      <div className="absolute top-6 left-6 z-50">
         <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/icon.png" 
              alt="Castpotro Logo" 
              width={80} 
              height={80} 
              className="object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-pink-500 hidden sm:block">
              castpotro
            </span>
         </Link>
      </div>

      {/* --- LEFT: FORM --- */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-[32px] shadow-xl border-2 border-slate-100 relative mt-24 lg:mt-0">
          
          <div className="flex justify-between items-center mb-6">
              <Link href="/" className="text-slate-400 hover:text-slate-600 p-2 -ml-2 rounded-full hover:bg-slate-50 transition">
                  <ArrowLeft size={24} />
              </Link>
              <Link href="/login" className="text-sm font-bold text-[#0ea5e9] uppercase tracking-wider hover:text-sky-600 transition-colors">
                  Log in
              </Link>
          </div>

          <div className="flex flex-col items-start mb-6">
              <h2 className="text-3xl font-black text-slate-800">Create Profile</h2>
              <p className="text-slate-500 font-medium">Join our global community.</p>
          </div>
          
          <form className="flex flex-col gap-4" action={formAction}>
              
              {/* Row 1: Name & DOB */}
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Full Name" className="input-field" required />
                  
                  {/* Date of Birth Input */}
                  <div className="relative group">
                      <input 
                        type="date" 
                        name="dob" 
                        className="input-field w-full text-slate-500 valid:text-slate-800 pt-3" 
                        required 
                      />
                      <label className="absolute -top-1.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-focus-within:text-[#0ea5e9] transition-colors">
                        Date of Birth
                      </label>
                  </div>
              </div>

              {/* Row 2: Country Select */}
              <div className="relative">
                  <select 
                    name="country" 
                    className="input-field w-full bg-white appearance-none" 
                    required 
                    defaultValue=""
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                      <option value="" disabled>Select Country</option>
                      {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>
                              {c.flag} {c.name}
                          </option>
                      ))}
                      <option value="Other">🌍 Other</option>
                  </select>
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>

              {/* Row 3: Dynamic University Search */}
              <div className="relative">
                  <input 
                    type="text" 
                    name="university" 
                    list="university-list"
                    placeholder={selectedCountry ? `Search universities in ${selectedCountry}...` : "Select a country first"}
                    className="input-field w-full"
                    required 
                    disabled={!selectedCountry}
                  />
                  
                  {/* Icon or Loader */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      {isLoadingUnis ? <Loader2 className="animate-spin" size={18}/> : <School size={18} />}
                  </div>

                  {/* HTML Datalist for Native Autocomplete */}
                  <datalist id="university-list">
                      {universityList.map((uni, idx) => (
                          <option key={idx} value={uni} />
                      ))}
                  </datalist>
              </div>

              <input type="email" name="email" placeholder="Email Address" className="input-field" required />
              <input type="password" name="password" placeholder="Password" className="input-field" required />
              
              {state?.message && (
                  <div className={`p-3 rounded-xl text-sm font-bold text-center ${state.success ? 'bg-emerald-50 text-emerald-600' : 'bg-pink-50 text-pink-500'}`}>
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

      {/* --- RIGHT: ROBOT MASCOT --- */}
      <div className="hidden lg:flex flex-col items-center justify-center relative">
          
          {/* Speech Bubble */}
          <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/90 backdrop-blur px-8 py-5 rounded-[2rem] rounded-bl-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-slate-100 mb-2 transform -translate-x-12 relative z-20 min-w-[280px]"
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
              <div className="absolute -bottom-3 left-0 w-6 h-6 bg-white border-b-2 border-l-2 border-slate-100 transform -rotate-45"></div>
          </motion.div>

          {/* THE ROBOT */}
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
              className="w-48 h-6 bg-[#0ea5e9]/20 rounded-full blur-2xl mt-2"
              animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />

      </div>

    </div>
  );
}