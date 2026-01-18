"use client";
import { 
  HelpCircle, Search, MessageCircle, FileText, ChevronDown, 
  ChevronRight, Mail, Phone, ExternalLink, LifeBuoy, Zap, 
  Book, AlertCircle, Crown, Sparkles 
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Mock Data ---
const FAQS = [
  { 
    id: 1, 
    question: "How do I earn XP and level up?", 
    answer: "You earn XP by completing lessons, daily quests, and participating in community events. As you gain XP, you'll climb the weekly leaderboard leagues." 
  },
  { 
    id: 2, 
    question: "Can I reset my progress?", 
    answer: "Yes, you can reset specific courses from the course settings menu. However, this action is permanent and you will lose the XP associated with that specific course." 
  },
  { 
    id: 3, 
    question: "How do the Leagues work?", 
    answer: "There are 5 leagues: Bronze, Silver, Gold, Platinum, and Diamond. The top 10 learners in each league at the end of the week are promoted to the next tier." 
  },
  { 
    id: 4, 
    question: "Is Castpotro free to use?", 
    answer: "Castpotro is free to use! We offer a premium subscription called 'Castpotro Plus' which removes ads and gives you unlimited hearts, but it is not required to learn." 
  },
  { 
    id: 5, 
    question: "How do I unlock job applications?", 
    answer: "Jobs are skill-locked. You must complete the specific course required by the employer (e.g., 'Public Speaking') to unlock the 'Apply' button." 
  }
];

function HelpContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-sky-500 bg-sky-100 p-2 rounded-lg">
                   <LifeBuoy size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Help Center</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Support & FAQs</p>
                </div>
              </div>
           </div>
        </div>

        {/* HELP BODY */}
        <div className="px-6 lg:px-10 pb-20 max-w-4xl mx-auto">
            
            {/* 1. Search Bar */}
            <div className="relative mb-10">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-slate-400" size={24} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search for articles, guides, or questions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-lg font-bold text-slate-700 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all shadow-sm"
                />
            </div>

            {/* 2. Quick Action Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
                <div className="border-2 border-slate-100 rounded-2xl p-6 hover:border-sky-200 hover:shadow-lg transition cursor-pointer group bg-white text-center flex flex-col items-center">
                    <div className="bg-sky-100 text-[#0ea5e9] p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Book size={28} />
                    </div>
                    <h3 className="font-extrabold text-slate-700">User Guide</h3>
                    <p className="text-slate-400 text-xs font-bold mt-1">Getting started basics</p>
                </div>
                <div className="border-2 border-slate-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition cursor-pointer group bg-white text-center flex flex-col items-center">
                    <div className="bg-emerald-100 text-emerald-500 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <MessageCircle size={28} />
                    </div>
                    <h3 className="font-extrabold text-slate-700">Live Chat</h3>
                    <p className="text-slate-400 text-xs font-bold mt-1">Talk to support</p>
                </div>
                <div className="border-2 border-slate-100 rounded-2xl p-6 hover:border-orange-200 hover:shadow-lg transition cursor-pointer group bg-white text-center flex flex-col items-center">
                    <div className="bg-orange-100 text-orange-500 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Zap size={28} />
                    </div>
                    <h3 className="font-extrabold text-slate-700">Report Bug</h3>
                    <p className="text-slate-400 text-xs font-bold mt-1">Fix a problem</p>
                </div>
            </div>

            {/* 3. FAQ Accordion */}
            <h2 className="text-xl font-extrabold text-slate-700 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                        <div 
                            key={faq.id} 
                            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                            className={`border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${openFaq === faq.id ? 'border-[#0ea5e9] bg-sky-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="p-5 flex justify-between items-center">
                                <span className={`font-bold text-lg ${openFaq === faq.id ? 'text-[#0ea5e9]' : 'text-slate-700'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    className={`text-slate-400 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180 text-[#0ea5e9]' : ''}`} 
                                />
                            </div>
                            <div className={`px-5 text-slate-500 font-medium leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {faq.answer}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-50">
                        <HelpCircle size={48} className="mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-400">No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {/* 4. Contact Footer */}
            <div className="mt-12 bg-slate-50 rounded-3xl p-8 text-center border-2 border-slate-100">
                <h3 className="text-lg font-black text-slate-700 mb-2">Still need help?</h3>
                <p className="text-slate-500 font-medium mb-6">Our team is available 24/7 to assist you with any issues.</p>
                <div className="flex justify-center gap-4">
                    <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-slate-700 transition flex items-center gap-2">
                        <Mail size={18} /> Email Us
                    </button>
                    <button className="bg-white text-slate-700 border-2 border-slate-200 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider hover:border-slate-300 transition flex items-center gap-2">
                        <Phone size={18} /> Call Us
                    </button>
                </div>
            </div>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: System Status */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <AlertCircle size={20} className="text-slate-400" /> System Status
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Operational
                </span>
             </div>
             <p className="text-xs font-bold text-slate-400">All systems functioning normally.</p>
          </div>
          
          {/* Widget 2: Popular Topics */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4">Popular Topics</h3>
             <div className="space-y-2">
                {["Reset Password", "Subscription Billing", "Course Certificates"].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition">
                        <span className="text-sm font-bold text-slate-600 group-hover:text-[#0ea5e9]">{topic}</span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0ea5e9]" />
                    </div>
                ))}
             </div>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Premium Support</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Skip the queue! Get priority 24/7 support with Castpotro Plus.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Upgrade Now
                </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700">
                <Sparkles size={140} />
            </div>
        </div>

      </div>

    </div>
  );
}

// --- Main Page Component ---
export default function HelpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <HelpContent />
    </Suspense>
  );
}
