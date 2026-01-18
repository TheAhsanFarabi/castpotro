"use client";
import { 
  Zap, Flame, Star, Hexagon, Users, Shield, Bell, Smile, 
  Gift, X, CheckCircle, Wallet, Utensils, Heart, GraduationCap, 
  Scale, Droplets, TrendingUp, Lightbulb, Equal, Building2, 
  Recycle, Globe, Fish, TreePine, Gavel, Handshake, Target,
  Crown, Sparkles, Trophy
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Data: 17 SDGs ---
const SDGS = [
  { id: 1, title: "No Poverty", color: "bg-[#e5243b]", icon: Wallet, quests: ["Donate unused clothes.", "Buy a meal for someone.", "Research local poverty.", "Support fair wages.", "Volunteer 1 hour."] },
  { id: 2, title: "Zero Hunger", color: "bg-[#dda63a]", icon: Utensils, quests: ["Zero food waste day.", "Donate to food bank.", "Cook plant-based meal.", "Learn composting.", "Share a meal."] },
  { id: 3, title: "Good Health", color: "bg-[#4c9f38]", icon: Heart, quests: ["30 min exercise.", "Drink 2L water.", "10 min meditation.", "8 hours sleep.", "Walk with a friend."] },
  { id: 4, title: "Quality Education", color: "bg-[#c5192d]", icon: GraduationCap, quests: ["Read an article.", "Teach a friend.", "Donate books.", "Watch documentary.", "Online workshop."] },
  { id: 5, title: "Gender Equality", color: "bg-[#ff3a21]", icon: Scale, quests: ["Read about female leader.", "Support woman-owned biz.", "Call out stereotypes.", "Female-directed movie.", "Mentor someone."] },
  { id: 6, title: "Clean Water", color: "bg-[#26bde2]", icon: Droplets, quests: ["Short shower.", "Turn off tap.", "Fix a leak.", "Reusable bottle.", "Learn water source."] },
  { id: 7, title: "Clean Energy", color: "bg-[#fcc30b]", icon: Zap, quests: ["Lights off.", "Unplug electronics.", "Walk/Bike.", "Air dry laundry.", "Switch to LED."] },
  { id: 8, title: "Decent Work", color: "bg-[#a21942]", icon: TrendingUp, quests: ["Support small biz.", "Write good review.", "Learn labor rights.", "Help with resume.", "Buy Fair Trade."] },
  { id: 9, title: "Innovation", color: "bg-[#fd6925]", icon: Lightbulb, quests: ["Brainstorm solution.", "Read tech news.", "Fix don't replace.", "Learn digital tool.", "Crowdfund project."] },
  { id: 10, title: "Reduced Inequality", color: "bg-[#dd1367]", icon: Equal, quests: ["Listen to stories.", "Speak up.", "Donate to charity.", "Learn sign language.", "Make new friend."] },
  { id: 11, title: "Sustainable Cities", color: "bg-[#fd9d24]", icon: Building2, quests: ["Use public transport.", "Visit park.", "Recycle correctly.", "Pick up litter.", "Farmers market."] },
  { id: 12, title: "Consumption", color: "bg-[#bf8b2e]", icon: Recycle, quests: ["No single-use plastic.", "Meal prep.", "Buy second-hand.", "Repair clothes.", "Reusable bag."] },
  { id: 13, title: "Climate Action", color: "bg-[#3f7e44]", icon: Globe, quests: ["Meat-free meal.", "Check carbon footprint.", "Plant something.", "Share climate fact.", "Nature documentary."] },
  { id: 14, title: "Life Below Water", color: "bg-[#0a97d9]", icon: Fish, quests: ["No plastic straw.", "Ocean docu.", "Beach cleanup.", "Less seafood.", "Eco cleaning products."] },
  { id: 15, title: "Life on Land", color: "bg-[#56c02b]", icon: TreePine, quests: ["Nature walk.", "Save insects.", "Plant flowers.", "Go paperless.", "Support wildlife."] },
  { id: 16, title: "Peace & Justice", color: "bg-[#00689d]", icon: Gavel, quests: ["Peaceful resolution.", "Vote/Poll.", "Read laws.", "Report bullying.", "Community safety."] },
  { id: 17, title: "Partnerships", color: "bg-[#19486a]", icon: Handshake, quests: ["Collaborate.", "Join club.", "Share skills.", "Promote cause.", "Connect people."] },
];

function QuestsContent() {
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [coins, setCoins] = useState(150); 
  const [checkedQuests, setCheckedQuests] = useState<number[]>([]);

  // Toggle checklist item
  const toggleQuest = (index: number) => {
    if (checkedQuests.includes(index)) {
        setCheckedQuests(checkedQuests.filter(i => i !== index));
    } else {
        setCheckedQuests([...checkedQuests, index]);
    }
  };

  const completeAll = () => {
    setCoins(c => c + 100);
    setActiveQuest(null);
    setCheckedQuests([]);
    // In a real app, you'd trigger a toast/confetti here
  };

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-amber-500 bg-amber-100 p-2 rounded-lg">
                   <Target size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Impact Quests</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sustainable Development Goals</p>
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                <Flame fill="#f59e0b" size={20} /> 1
              </div>
              <div className="flex items-center gap-2 text-[#0ea5e9] font-bold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 shadow-sm">
                <Star fill="#0ea5e9" size={20} /> {coins}
              </div>
           </div>
        </div>

        {/* QUESTS GRID CONTENT */}
        <div className="px-6 lg:px-10 pb-20">
            
            {/* Hero Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl shadow-slate-200">
               <div className="relative z-10 max-w-lg">
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                      <Globe size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Global Goals</span>
                  </div>
                  <h2 className="text-3xl font-black mb-3">Change the World 🌍</h2>
                  <p className="font-medium opacity-80 text-lg leading-relaxed">
                      Complete daily tasks related to the 17 Sustainable Development Goals to earn coins, badges, and real-world impact.
                  </p>
               </div>
               {/* Background Decoration */}
               <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                  <Users size={280} />
               </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
               {SDGS.map((sdg) => (
                 <button 
                   key={sdg.id}
                   onClick={() => { setActiveQuest(sdg); setCheckedQuests([]); }}
                   className={`relative group p-4 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 text-center shadow-lg hover:shadow-xl border-b-[6px] border-black/10 overflow-hidden ${sdg.color}`}
                 >
                   <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                   
                   <div className="bg-white/20 p-3.5 rounded-2xl group-hover:scale-110 transition-transform shadow-sm backdrop-blur-sm">
                       <sdg.icon size={32} strokeWidth={2.5} className="text-white drop-shadow-md" />
                   </div>
                   <div className="z-10 text-white">
                       <span className="block text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Goal {sdg.id}</span>
                       <span className="block font-bold text-sm leading-tight">{sdg.title}</span>
                   </div>
                 </button>
               ))}
            </div>
        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: Weekly Goal */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-2">Weekly Goal</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Trophy size={24} className="text-amber-500" />
                    <div className="flex-1">
                    <div className="text-sm font-bold text-slate-700">Complete 5 SDGs</div>
                    <div className="h-3 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                        <div className="h-full bg-amber-500 w-[60%] rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-bold mt-1 text-right">3 / 5</div>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Widget 2: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Unlock exclusive Impact Badges and track your carbon footprint reduction.
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

      {/* --- MODAL (Absolute Overlay) --- */}
      {activeQuest && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className={`${activeQuest.color} p-8 text-white relative flex flex-col items-center text-center shrink-0`}>
                 <button onClick={() => setActiveQuest(null)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition">
                    <X size={24} />
                 </button>
                 <div className="bg-white/25 p-4 rounded-3xl mb-4 shadow-inner backdrop-blur-sm">
                    <activeQuest.icon size={48} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tight">{activeQuest.title}</h2>
                 <p className="font-bold opacity-80 uppercase tracking-widest text-xs mt-2 bg-black/10 px-3 py-1 rounded-full">Global Goal #{activeQuest.id}</p>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto bg-slate-50">
                 <h3 className="text-slate-400 font-extrabold uppercase text-xs tracking-widest mb-4 ml-1">Today's Challenges (Pick 5)</h3>
                 
                 <div className="space-y-3">
                    {activeQuest.quests.map((quest: string, index: number) => (
                        <div 
                           key={index}
                           onClick={() => toggleQuest(index)}
                           className={`p-4 rounded-2xl border-b-4 cursor-pointer transition-all flex items-center gap-4 group active:scale-[0.98] active:border-b-0 active:translate-y-1 ${
                               checkedQuests.includes(index) 
                               ? 'bg-emerald-50 border-emerald-500 shadow-none translate-y-1 border-b-0' 
                               : 'bg-white border-slate-200 hover:border-sky-300 shadow-sm'
                           }`}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                checkedQuests.includes(index) 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300 text-transparent group-hover:border-sky-300'
                            }`}>
                                <CheckCircle size={20} fill={checkedQuests.includes(index) ? "white" : "none"} />
                            </div>
                            <span className={`font-bold text-sm leading-relaxed select-none ${
                                checkedQuests.includes(index) ? 'text-emerald-800 line-through opacity-70' : 'text-slate-700'
                            }`}>
                                {quest}
                            </span>
                        </div>
                    ))}
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-4 bg-slate-50 mt-auto shrink-0 border-t border-slate-100">
                 <button 
                    onClick={completeAll}
                    disabled={checkedQuests.length < 5} 
                    className={`w-full py-4 rounded-2xl text-lg font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                        checkedQuests.length < 5 
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-[#0ea5e9] text-white shadow-xl shadow-sky-200 hover:bg-sky-400 hover:scale-[1.02] active:scale-95"
                    }`}
                 >
                    {checkedQuests.length < 5 ? (
                        <>Collect {5 - checkedQuests.length} more Stars</>
                    ) : (
                        <><Gift size={24} className="animate-bounce" /> Claim 100 Coins</>
                    )}
                 </button>
              </div>

           </div>
        </div>
      )}

    </div>
  );
}

export default function QuestsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <QuestsContent />
    </Suspense>
  );
}