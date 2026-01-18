"use client";
import React, { useState } from 'react';
import { 
  LifeBuoy, Search, MessageCircle, FileText, ChevronDown, 
  ChevronRight, Mail, Phone, Zap, Book, AlertCircle, 
  Crown, Sparkles, HelpCircle, ArrowRight
} from 'lucide-react';

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

const CATEGORIES = [
    { icon: Book, title: "User Guide", desc: "Getting started basics", color: "text-sky-500 bg-sky-100 border-sky-200" },
    { icon: MessageCircle, title: "Live Chat", desc: "Talk to support", color: "text-emerald-500 bg-emerald-100 border-emerald-200" },
    { icon: Zap, title: "Report Bug", desc: "Fix a problem", color: "text-orange-500 bg-orange-100 border-orange-200" },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* --- GRID LAYOUT (75/25) --- */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 px-4 md:px-8 py-6">
        
        {/* === LEFT COLUMN: MAIN CONTENT (75%) === */}
        <div className="xl:col-span-3 w-full min-w-0 flex flex-col">
          
          {/* Sticky Header */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 mb-6 sticky top-4 z-30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-sky-100 p-2.5 rounded-xl text-sky-600 border border-sky-200 shadow-sm">
                    <LifeBuoy size={28} />
                </div>
                <div>
                  <h1 className="font-extrabold text-slate-700 text-xl leading-tight">Help Center</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Support & FAQs</p>
                </div>
              </div>
          </div>

          <main className="space-y-8 pb-24 lg:pb-0">
            
            {/* 1. Hero Search Section */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm text-center relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-700 mb-2">How can we help you?</h2>
                    <p className="text-slate-400 font-medium mb-8">Search for articles, troubleshooting, or guides.</p>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-sky-500 transition-colors" size={24} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Type your question..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-lg font-bold text-slate-700 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all shadow-sm placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>
                
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 to-transparent opacity-50 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 text-slate-100 opacity-50"><HelpCircle size={150} /></div>
                <div className="absolute -bottom-10 -left-10 text-slate-100 opacity-50"><MessageCircle size={150} /></div>
            </div>

            {/* 2. Quick Action Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {CATEGORIES.map((cat, i) => (
                    <div key={i} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center text-center">
                        <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 border ${cat.color}`}>
                            <cat.icon size={32} />
                        </div>
                        <h3 className="font-extrabold text-slate-700 text-lg">{cat.title}</h3>
                        <p className="text-slate-400 text-xs font-bold mt-1">{cat.desc}</p>
                    </div>
                ))}
            </div>

            {/* 3. FAQ Accordion */}
            <div>
                <h3 className="text-xl font-black text-slate-700 mb-6 px-2">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div 
                                key={faq.id} 
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border-2 ${openFaq === faq.id ? 'border-sky-500 shadow-md ring-4 ring-sky-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="p-5 flex justify-between items-center">
                                    <span className={`font-bold text-lg transition-colors ${openFaq === faq.id ? 'text-sky-600' : 'text-slate-700'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown 
                                        className={`text-slate-400 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180 text-sky-500' : ''}`} 
                                        strokeWidth={3}
                                    />
                                </div>
                                <div className={`px-5 text-slate-500 font-medium leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {faq.answer}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="font-bold text-slate-400 text-lg">No results found for "{searchQuery}"</p>
                            <button className="mt-4 text-sky-500 font-bold hover:underline" onClick={() => setSearchQuery("")}>Clear Search</button>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Contact Footer Block */}
            <div className="bg-slate-800 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden text-white shadow-xl shadow-slate-200">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-3">Still need help?</h3>
                    <p className="text-slate-300 font-medium mb-8 max-w-lg mx-auto">Our team is available 24/7 to assist you. Average response time is under 5 minutes.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-sky-500 text-white px-8 py-3.5 rounded-xl font-extrabold uppercase text-sm tracking-wider hover:bg-sky-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2">
                            <Mail size={18} /> Email Support
                        </button>
                        <button className="bg-slate-700 text-white border-2 border-slate-600 px-8 py-3.5 rounded-xl font-extrabold uppercase text-sm tracking-wider hover:bg-slate-600 hover:border-slate-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                            <Phone size={18} /> Call Us
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-5 text-white pointer-events-none">
                     <LifeBuoy size={300} />
                </div>
            </div>

          </main>
        </div>

        {/* === RIGHT COLUMN: WIDGETS (25%) === */}
        <div className="hidden xl:flex xl:col-span-1 flex-col gap-6 sticky top-6 h-fit shrink-0">
          
          {/* Widget 1: System Status */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors">
             <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                    <AlertCircle size={18} className="text-slate-400" /> System Status
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Operational
                </span>
             </div>
             <p className="text-xs font-bold text-slate-400">All systems functioning normally.</p>
          </div>
          
          {/* Widget 2: Popular Topics */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
             <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Popular Topics</h3>
             <div className="space-y-1">
                {["Reset Password", "Billing Issues", "Certificates", "Mobile App"].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-all">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-sky-600">{topic}</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
             </div>
          </div>

          {/* Widget 3: Premium Support Ad */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Crown size={22} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-sm uppercase tracking-wide">Priority Support</h3>
                </div>
                <p className="text-white/90 text-xs font-medium mb-6 leading-relaxed">
                    Skip the queue! Get priority 24/7 support with Castpotro Plus.
                </p>
                <button className="w-full py-2.5 bg-white text-sky-600 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    Upgrade <ArrowRight size={14} />
                </button>
            </div>
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[25deg] transition-transform duration-700">
                <Sparkles size={120} />
            </div>
          </div>

        </div>

      </div>

      {/* --- MOBILE STICKY FOOTER --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-5px_30px_rgba(0,0,0,0.08)] z-50 xl:hidden">
         <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-500">
                Need answers fast?
            </div>
             <button className="bg-sky-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-sky-200 hover:scale-105 transition active:scale-95 font-bold text-sm flex items-center gap-2">
                <MessageCircle size={16} fill="currentColor" />
                Live Chat
             </button>
         </div>
      </div>

    </div>
  );
}
