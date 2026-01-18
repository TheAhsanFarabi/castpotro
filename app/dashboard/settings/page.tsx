"use client";
import { 
  User, Bell, Volume2, Moon, Lock, LogOut, ChevronRight, 
  Shield, CreditCard, HelpCircle, Smartphone, Mail, Globe, 
  CheckCircle, Crown, Sparkles 
} from 'lucide-react';
import { useState, Suspense } from 'react';
import { logoutAction } from '../../actions'; // Ensure this path is correct based on your file structure

function SettingsContent() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-slate-500 bg-slate-100 p-2 rounded-lg">
                   <User size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">Settings</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Manage your account</p>
                </div>
              </div>
           </div>
        </div>

        {/* SETTINGS LIST */}
        <div className="px-6 lg:px-10 pb-20 max-w-4xl mx-auto">
            
            {/* Section 1: Account */}
            <section className="mb-8">
               <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-2">Account</h2>
               <div className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                  
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group">
                     <div className="flex items-center gap-4">
                        <div className="bg-sky-50 text-[#0ea5e9] p-2 rounded-xl group-hover:scale-110 transition-transform"><User size={20} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">Personal Information</span>
                            <span className="text-xs font-bold text-slate-400">Name, Email, Age</span>
                        </div>
                     </div>
                     <ChevronRight className="text-slate-300 group-hover:text-[#0ea5e9]" />
                  </div>

                  <div className="p-5 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group">
                     <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 text-emerald-500 p-2 rounded-xl group-hover:scale-110 transition-transform"><Lock size={20} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">Password & Security</span>
                            <span className="text-xs font-bold text-slate-400">Manage your login details</span>
                        </div>
                     </div>
                     <ChevronRight className="text-slate-300 group-hover:text-emerald-500" />
                  </div>

                  <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group">
                     <div className="flex items-center gap-4">
                        <div className="bg-amber-50 text-amber-500 p-2 rounded-xl group-hover:scale-110 transition-transform"><CreditCard size={20} /></div>
                        <div>
                            <span className="font-bold text-slate-700 block">Subscription</span>
                            <span className="text-xs font-bold text-slate-400">Free Plan</span>
                        </div>
                     </div>
                     <span className="bg-amber-100 text-amber-600 text-xs font-black uppercase px-2 py-1 rounded-md">Upgrade</span>
                  </div>

               </div>
            </section>

            {/* Section 2: Preferences */}
            <section className="mb-8">
               <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-2">Preferences</h2>
               <div className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                  
                  {/* Notifications Toggle */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="bg-rose-50 text-rose-500 p-2 rounded-xl"><Bell size={20} /></div>
                        <span className="font-bold text-slate-700">Email Notifications</span>
                     </div>
                     <div 
                        onClick={() => setEmailNotifs(!emailNotifs)}
                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${emailNotifs ? 'bg-[#0ea5e9]' : 'bg-slate-200'}`}
                     >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </div>
                  </div>

                  {/* Sound Toggle */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="bg-violet-50 text-violet-500 p-2 rounded-xl"><Volume2 size={20} /></div>
                        <span className="font-bold text-slate-700">Sound Effects</span>
                     </div>
                     <div 
                        onClick={() => setSoundEffects(!soundEffects)}
                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${soundEffects ? 'bg-[#0ea5e9]' : 'bg-slate-200'}`}
                     >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${soundEffects ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </div>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="p-5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 text-indigo-500 p-2 rounded-xl"><Moon size={20} /></div>
                        <span className="font-bold text-slate-700">Dark Mode</span>
                     </div>
                     <div 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                     >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </div>
                  </div>
               </div>
            </section>

             {/* Section 3: Support & Danger Zone */}
             <section className="mb-8">
               <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-2">Support</h2>
               <div className="border-2 border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm mb-8">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-50 text-orange-500 p-2 rounded-xl"><HelpCircle size={20} /></div>
                            <span className="font-bold text-slate-700">Help Center</span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-orange-500" />
                    </div>
                    <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-100 text-slate-500 p-2 rounded-xl"><Shield size={20} /></div>
                            <span className="font-bold text-slate-700">Privacy Policy</span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-slate-500" />
                    </div>
               </div>

               <form action={logoutAction}>
                    <button className="w-full py-4 rounded-2xl border-2 border-red-100 text-red-500 font-extrabold uppercase tracking-wider hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center gap-2 shadow-sm">
                        <LogOut size={20} /> Sign Out
                    </button>
               </form>
            </section>

        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: Profile Summary */}
          <div className="border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-sm text-center">
            <div className="w-24 h-24 bg-[#0ea5e9] rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-white">
                JD
            </div>
            <h2 className="text-xl font-black text-slate-700">John Doe</h2>
            <p className="text-slate-400 font-bold text-sm mb-6">@johndoe_123</p>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-black text-slate-700 text-lg">2026</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Joined</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-black text-slate-700 text-lg">Gold</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">League</div>
                </div>
            </div>
          </div>
          
          {/* Widget 2: Connected Accounts */}
          <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-slate-400" /> Connected
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                        <Mail size={18} className="text-slate-400" />
                        <span className="font-bold text-slate-600 text-sm">Google</span>
                    </div>
                    <CheckCircle size={18} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                    <div className="flex items-center gap-3">
                        <Globe size={18} className="text-slate-400" />
                        <span className="font-bold text-slate-600 text-sm">Facebook</span>
                    </div>
                    <span className="text-xs font-bold text-[#0ea5e9] cursor-pointer hover:underline">Connect</span>
                </div>
            </div>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Castpotro Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Manage your subscription and billing details.
                </p>
                <button className="w-full py-3 bg-white text-[#0ea5e9] rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                    Manage Plan
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}