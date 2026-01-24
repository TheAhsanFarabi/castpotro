"use client";

import { useState, useEffect } from "react";
import { 
  Coins, Crown, CheckCircle, Zap, Sparkles, Loader2, 
  ShieldCheck, Rocket, Star, Gem 
} from "lucide-react";
import { purchasePlusAction, refillCoinsAction } from "@/app/actions/billing";
import { useRouter } from "next/navigation";

export default function PlusClient({ userCoins }: { userCoins: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [isPlus, setIsPlus] = useState(false);

  useEffect(() => {
    const plusStatus = localStorage.getItem("castpotro_plus_active");
    if (plusStatus === "true") setIsPlus(true);
  }, []);

  // --- HANDLERS ---
  const handleBuyPlus = async (plan: "MONTHLY" | "YEARLY") => {
    const cost = plan === "MONTHLY" ? 1500 : 12000;
    
    if (userCoins < cost) {
      alert("Not enough coins! Scroll down to refill.");
      return;
    }

    if (!confirm(`Spend ${cost} coins for ${plan === "MONTHLY" ? "30 Days" : "1 Year"} of Plus?`)) return;
    
    setLoading(`plus-${plan}`);
    const res = await purchasePlusAction(cost);
    setLoading(null);

    if (res.success) {
      localStorage.setItem("castpotro_plus_active", "true");
      setIsPlus(true);
      alert(res.message);
      router.refresh();
    } else {
      alert(res.message);
    }
  };

  const handleRefill = async (amount: number, price: number) => {
    setLoading(`refill-${amount}`);
    await new Promise(r => setTimeout(r, 1000)); // Simulate delay
    const res = await refillCoinsAction(amount);
    setLoading(null);
    if (res.success) {
      alert(`Payment of $${price} successful! ${amount} coins added.`);
      router.refresh();
    } else {
      alert("Payment failed.");
    }
  };

  return (
    // FIXED: Changed overflow-hidden to overflow-x-hidden so vertical scroll works
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden pb-40">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-violet-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[200px] left-[-100px] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 animate-in fade-in zoom-in duration-300">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest mb-8 shadow-xl shadow-pink-200 hover:scale-105 transition-transform cursor-default">
            <Crown size={20} fill="currentColor" /> Castpotro Plus
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight">
            Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Potential</span>.
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            Get unlimited hearts, exclusive skins, blockchain certificates, and double XP. 
            Invest in your career with the ultimate learning toolkit.
          </p>
        </div>

        {/* --- PRICING CARDS --- */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-24 max-w-5xl mx-auto">
          
          {/* MONTHLY CARD */}
          <div className={`relative p-10 rounded-[48px] border-[3px] transition-all duration-300 group flex flex-col h-full ${
            isPlus 
              ? "bg-slate-50 border-slate-200 opacity-60" 
              : "bg-white border-slate-100 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-100 hover:-translate-y-2"
          }`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-800 mb-2">Monthly</h3>
                <p className="text-slate-400 font-bold">Flexible learning.</p>
              </div>
              <div className="bg-pink-50 text-pink-500 p-4 rounded-3xl group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Zap size={36} fill="currentColor" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">1,500</span>
              <div className="flex flex-col items-start">
                 <Coins size={24} className="text-yellow-500" fill="currentColor" />
                 <span className="text-xs font-bold text-slate-400 uppercase">Coins / Month</span>
              </div>
            </div>

            <div className="space-y-5 mb-10 flex-1">
              {[
                "Unlimited Hearts", 
                "Ad-Free Experience", 
                "Silver Profile Badge", 
                "Double XP (Weekends)"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-1 rounded-full bg-pink-100 text-pink-500">
                    <CheckCircle size={18} strokeWidth={4} />
                  </div>
                  <span className="font-bold text-slate-600 text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleBuyPlus("MONTHLY")}
              disabled={!!loading || isPlus}
              className="w-full py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg"
            >
               {loading === "plus-MONTHLY" ? <Loader2 className="animate-spin" /> : (isPlus ? "Active" : "Select Plan")}
            </button>
          </div>

          {/* YEARLY CARD */}
          <div className={`relative p-10 rounded-[48px] border-[3px] transition-all duration-300 flex flex-col h-full overflow-hidden ${
             isPlus 
             ? "bg-slate-100 border-slate-200" 
             : "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800 text-white shadow-2xl hover:-translate-y-2"
          }`}>
            {/* Best Value Badge */}
            {!isPlus && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-500 to-pink-500 text-white px-8 py-3 rounded-bl-[40px] font-black text-sm uppercase tracking-widest shadow-lg">
                Best Value
              </div>
            )}

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className={`text-3xl font-black mb-2 ${isPlus ? "text-slate-800" : "text-white"}`}>Yearly</h3>
                <p className={`font-bold ${isPlus ? "text-slate-400" : "text-slate-400"}`}>Commit to mastery.</p>
              </div>
              <div className="bg-white/10 text-white p-4 rounded-3xl backdrop-blur-sm">
                <Sparkles size={36} fill="currentColor" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-10 relative z-10">
              <span className={`text-6xl font-black tracking-tighter ${isPlus ? "text-slate-800" : "text-white"}`}>12,000</span>
              <div className="flex flex-col items-start">
                 <Coins size={24} className="text-yellow-400" fill="currentColor" />
                 <span className={`text-xs font-bold uppercase ${isPlus ? "text-slate-400" : "text-slate-400"}`}>Coins / Year</span>
              </div>
            </div>

            <div className="space-y-5 mb-10 flex-1 relative z-10">
              {[
                "Everything in Monthly", 
                "Exclusive Gold Avatar", 
                "Verified Blockchain Cert.", 
                "Priority Job Applications",
                "VIP Support Channel"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`p-1 rounded-full ${isPlus ? "bg-slate-200 text-slate-500" : "bg-violet-500/30 text-violet-300"}`}>
                    <CheckCircle size={18} strokeWidth={4} />
                  </div>
                  <span className={`font-bold text-lg ${isPlus ? "text-slate-500" : "text-slate-200"}`}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleBuyPlus("YEARLY")}
              disabled={!!loading || isPlus}
              className="relative z-10 w-full py-5 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-lg shadow-violet-900/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {loading === "plus-YEARLY" ? <Loader2 className="animate-spin" /> : (isPlus ? "Plan Active" : "Get Yearly Access")}
            </button>
            
            {/* Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600/30 rounded-full blur-[80px] pointer-events-none"></div>
          </div>
        </div>

        {/* --- REFILL SECTION --- */}
        <div className="max-w-6xl mx-auto">
           <div className="flex items-center gap-4 mb-10">
              <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                 <Coins size={32} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800">Refill Wallet</h2>
                <p className="text-slate-500 font-bold">Need more coins? Top up instantly.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { amount: 100, price: 1, icon: Star, color: "text-slate-600", bg: "bg-white" },
                { amount: 1000, price: 10, icon: Gem, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
                { amount: 5000, price: 45, icon: ShieldCheck, color: "text-violet-500", bg: "bg-violet-50 border-violet-100" },
                { amount: 12000, price: 99, icon: Rocket, color: "text-white", bg: "bg-gradient-to-br from-pink-500 to-violet-600 border-transparent text-white" },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => handleRefill(pack.amount, pack.price)}
                  disabled={!!loading}
                  className={`
                    group relative p-8 rounded-[32px] border-2 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95 flex flex-col justify-between min-h-[220px]
                    ${pack.bg} ${pack.amount === 12000 ? "shadow-lg shadow-pink-200" : "border-slate-100 hover:border-pink-300"}
                  `}
                >
                   {pack.amount === 12000 && (
                     <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                       Best Value
                     </span>
                   )}
                   
                   <div>
                     <pack.icon size={32} className={`mb-4 ${pack.amount === 12000 ? "text-pink-200" : pack.color}`} />
                     <div className={`text-4xl font-black mb-1 ${pack.amount === 12000 ? "text-white" : "text-slate-800"}`}>
                        {pack.amount.toLocaleString()}
                     </div>
                     <div className={`text-xs font-bold uppercase tracking-wider ${pack.amount === 12000 ? "text-pink-100" : "text-slate-400"}`}>
                        Coins
                     </div>
                   </div>

                   <div className="flex items-center justify-between mt-6">
                      <span className={`text-lg font-black ${pack.amount === 12000 ? "text-white" : "text-slate-700"}`}>
                        ${pack.price}
                      </span>
                      <div className={`p-2 rounded-full ${pack.amount === 12000 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-pink-500 group-hover:text-white"} transition-colors`}>
                        {loading === `refill-${pack.amount}` ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                      </div>
                   </div>
                </button>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}