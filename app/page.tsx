import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  ChevronDown,
  Users,
  Trophy,
  Target,
  Star,
  Brain,
  MessageCircle,
  Briefcase,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* --- HEADER --- */}
      <header className="w-full p-6 flex justify-between items-center max-w-[1200px] mx-auto z-50 sticky top-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center cursor-pointer">
          {/* Updated Logo: Bigger Size */}
          <Image
            src="/icon.png"
            alt="Castpotro Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-sm cursor-pointer hover:text-slate-500 transition-colors">
          Language: English <ChevronDown size={16} />
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-[1200px] mx-auto px-6 mt-8 lg:mt-20 mb-20">
        {/* Left Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-[500px] order-2 lg:order-1">
          <h1 className="text-4xl lg:text-[3.5rem] font-extrabold text-slate-800 leading-[1.1]">
            Master <span className="text-[#0ea5e9]">soft skills</span> the fun
            way.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Learn communication, leadership, and emotional intelligence with
            bite-sized, gamified lessons. Free forever.
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link href="/get-started" className="w-full sm:w-auto flex-1">
              <button className="btn-primary w-full py-4 text-lg shadow-xl shadow-sky-100 hover:scale-[1.02] active:scale-95 transition-all">
                Get Started
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto flex-1">
              <button className="btn-outline w-full py-4 text-lg hover:bg-slate-50 transition-colors">
                I have an account
              </button>
            </Link>
          </div>

          {/* Mini Social Proof */}
          <div className="flex items-center gap-4 text-sm font-bold text-slate-400 pt-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
            </div>
            <p>Join 10,000+ learners today</p>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="relative w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] order-1 lg:order-2">
          <Image
            src="/hero.png"
            alt="Learning Hero Illustration"
            fill
            className="object-contain drop-shadow-2xl animate-pulse"
            priority
          />
          {/* Floating badges for decoration */}
          <div className="absolute top-10 right-0 bg-white p-3 rounded-2xl shadow-lg animate-bounce duration-[3000ms] hidden lg:block">
            <Star className="text-yellow-400" size={32} fill="currentColor" />
          </div>
          <div className="absolute bottom-20 left-0 bg-white p-3 rounded-2xl shadow-lg animate-bounce duration-[4000ms] hidden lg:block">
            <Trophy className="text-[#0ea5e9]" size={32} fill="currentColor" />
          </div>
        </div>
      </main>

      {/* --- STATS SECTION --- */}
      <section className="w-full bg-slate-900 py-12 text-white border-y-8 border-[#0ea5e9]">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-[#0ea5e9]">100%</h3>
            <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">
              Free Forever
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-[#0ea5e9]">50+</h3>
            <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">
              Interactive Courses
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-[#0ea5e9]">15 mins</h3>
            <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">
              Daily Practice
            </p>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-700 mb-4">
            Why learn with Castpotro?
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            We replace boring lectures with fun, bite-sized challenges that
            actually stick.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap size={40} className="text-amber-500" fill="#f59e0b" />}
            title="Gamified Learning"
            desc="Earn points, keep your streak alive, and climb the leaderboards while you learn."
          />
          <FeatureCard
            icon={<Brain size={40} className="text-[#0ea5e9]" />}
            title="Science-backed"
            desc="Our spaced repetition method ensures you remember what you learn for the long term."
          />
          <FeatureCard
            icon={<Target size={40} className="text-rose-500" />}
            title="Real-world Scenarios"
            desc="Practice handling difficult conversations, interviews, and presentations."
          />
        </div>
      </section>

      {/* --- SKILLS PREVIEW --- */}
      <section className="py-10 pb-24 px-6 max-w-[1200px] mx-auto w-full border-t-2 border-slate-100">
        <h2 className="text-2xl font-bold text-slate-700 mb-8 text-center uppercase tracking-widest">
          Skills you can master
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <SkillBadge
            icon={<MessageCircle size={20} />}
            label="Communication"
          />
          <SkillBadge icon={<Users size={20} />} label="Leadership" />
          <SkillBadge icon={<Brain size={20} />} label="Critical Thinking" />
          <SkillBadge icon={<Briefcase size={20} />} label="Negotiation" />
          <SkillBadge icon={<Globe size={20} />} label="Public Speaking" />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-50 py-10 border-t-2 border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
          <Image src="/icon.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-extrabold text-slate-400">
            castpotro
          </span>
        </div>
        <p className="text-slate-400 font-bold text-sm">
          © 2026 Castpotro Inc.
        </p>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="border-2 border-slate-100 rounded-3xl p-8 hover:border-sky-200 hover:shadow-xl hover:-translate-y-1 transition-all bg-white">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-extrabold text-slate-700 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function SkillBadge({ icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-sky-400 hover:text-sky-500 transition-all cursor-default bg-slate-50">
      {icon}
      <span>{label}</span>
    </div>
  );
}
