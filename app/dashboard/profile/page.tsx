"use client";
import { 
  Zap, Flame, Star, Users, Shield, Smile, 
  Edit2, MapPin, Calendar, Mail, Award, CheckCircle, 
  Camera, Save, X, Sparkles, Crown, Share2, UserPlus, Gift,
  FileBadge, Download, ExternalLink // Added FileBadge, Download, ExternalLink
} from 'lucide-react';
import { useState, Suspense } from 'react';

// --- Mock Data ---
const BADGES = [
  { id: 1, name: "Early Bird", icon: "🌅", color: "bg-orange-100 text-orange-600" },
  { id: 2, name: "Fast Learner", icon: "🚀", color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Team Player", icon: "🤝", color: "bg-purple-100 text-purple-600" },
  { id: 4, name: "Quest Master", icon: "⚔️", color: "bg-red-100 text-red-600" },
  { id: 5, name: "Sharpshooter", icon: "🎯", color: "bg-emerald-100 text-emerald-600" },
];

const RECENT_ACTIVITY = [
  { id: 1, title: "Completed Unit 2: Leadership", date: "Today", xp: "+50 XP" },
  { id: 2, title: "Daily Quest: Zero Hunger", date: "Yesterday", xp: "+20 XP" },
  { id: 3, title: "Registered for Nitro Event", date: "2 days ago", xp: "+10 XP" },
];

// --- New Certificates Data ---
const CERTIFICATES = [
  { 
    id: 1, 
    title: "Mastering Public Speaking", 
    issuer: "Castpotro Academy", 
    issueDate: "Jan 15, 2026", 
    credentialId: "CP-MPS-2026-8842",
    skills: "Communication, Confidence"
  },
  { 
    id: 2, 
    title: "Emotional Intelligence 101", 
    issuer: "Castpotro Academy", 
    issueDate: "Dec 22, 2025", 
    credentialId: "CP-EI-2025-1102",
    skills: "Empathy, Self-Awareness"
  }
];

function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock State for Editing
  const [profile, setProfile] = useState({
    name: "John Doe",
    handle: "@johndoe_123",
    email: "john.doe@example.com",
    location: "New York, USA",
    bio: "Computer Science student passionate about AI and sustainable development."
  });

  return (
    <div className="flex w-full h-full">
      
      {/* --- CENTER CONTENT (Expands) --- */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Sticky Header */}
        <div className="flex justify-between items-center sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 mb-6">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl transition">
                <div className="text-slate-500 bg-slate-100 p-2 rounded-lg">
                   <Smile size={28} />
                </div>
                <div>
                   <h1 className="font-extrabold text-slate-700 text-xl hidden sm:block">My Profile</h1>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Public View</p>
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition border-2 ${
                    isEditing 
                    ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' 
                    : 'bg-sky-50 text-[#0ea5e9] border-sky-100 hover:bg-sky-100'
                }`}
              >
                {isEditing ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
              </button>
              {isEditing && (
                 <button 
                    onClick={() => setIsEditing(false)} 
                    className="flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition bg-[#0ea5e9] text-white shadow-lg shadow-sky-200 hover:bg-sky-600"
                 >
                    <Save size={18} /> Save
                 </button>
              )}
           </div>
        </div>

        {/* PROFILE BODY */}
        <div className="px-6 lg:px-10 pb-20 max-w-5xl mx-auto">
            
            {/* 1. Header Card */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden">
               {/* Decorative Circle */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3 opacity-50 pointer-events-none"></div>

               <div className="relative group cursor-pointer shrink-0">
                  <div className="w-32 h-32 bg-[#0ea5e9] rounded-full border-[6px] border-white shadow-xl flex items-center justify-center text-white text-4xl font-black">
                     JD
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-slate-100 text-slate-400 group-hover:text-[#0ea5e9] transition-colors hover:scale-110">
                     <Camera size={18} />
                  </div>
               </div>
               
               <div className="flex-1 text-center md:text-left space-y-2 w-full">
                  {isEditing ? (
                      <div className="space-y-3 max-w-md">
                          <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full text-2xl font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-[#0ea5e9] focus:outline-none" 
                          />
                          <input 
                            type="text" 
                            value={profile.handle} 
                            onChange={(e) => setProfile({...profile, handle: e.target.value})}
                            className="w-full text-slate-500 font-bold bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-[#0ea5e9] focus:outline-none" 
                          />
                      </div>
                  ) : (
                      <>
                        <h1 className="text-3xl font-extrabold text-slate-800">{profile.name}</h1>
                        <p className="text-slate-400 font-bold text-lg">{profile.handle}</p>
                      </>
                  )}
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                     <p className="text-slate-500 font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-sm">
                        <Calendar size={14} className="text-[#0ea5e9]" /> Joined January 2026
                     </p>
                     <p className="text-slate-500 font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-sm">
                        <MapPin size={14} className="text-rose-500" /> {profile.location}
                     </p>
                  </div>
               </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-orange-200 hover:-translate-y-1 transition-all">
                  <div className="bg-orange-50 p-3 rounded-full"><Flame size={24} className="text-orange-500" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">5</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Streak</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-sky-200 hover:-translate-y-1 transition-all">
                  <div className="bg-sky-50 p-3 rounded-full"><Zap size={24} className="text-[#0ea5e9]" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">1,250</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-yellow-200 hover:-translate-y-1 transition-all">
                  <div className="bg-yellow-50 p-3 rounded-full"><Shield size={24} className="text-yellow-500" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">Gold</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">League</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-purple-200 hover:-translate-y-1 transition-all">
                  <div className="bg-purple-50 p-3 rounded-full"><Award size={24} className="text-purple-500" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">12</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badges</div>
                  </div>
               </div>
            </div>

            {/* 3. Badges Section */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Achievements</h3>
                  <button className="text-[#0ea5e9] text-xs font-bold uppercase hover:underline">View All</button>
               </div>
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {BADGES.map((badge) => (
                     <div key={badge.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-transparent hover:scale-105 transition-transform ${badge.color}`}>
                        <div className="text-4xl drop-shadow-sm">{badge.icon}</div>
                        <span className="font-bold text-[10px] uppercase tracking-wide opacity-80 text-center">{badge.name}</span>
                     </div>
                  ))}
                  {/* Locked Slots */}
                  {[1,2,3].map((i) => (
                     <div key={i} className="aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300">
                        <Award size={32} />
                     </div>
                  ))}
               </div>
            </div>

            {/* 4. NEW: Certifications Section */}
            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Certifications</h3>
                  <button className="text-[#0ea5e9] text-xs font-bold uppercase hover:underline">View All</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CERTIFICATES.map((cert) => (
                     <div key={cert.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-start gap-4 hover:border-sky-200 transition-all shadow-sm group">
                        <div className="bg-sky-50 text-[#0ea5e9] p-3 rounded-xl group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors">
                           <FileBadge size={24} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-slate-700">{cert.title}</h4>
                           <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">{cert.issuer}</p>
                           <p className="text-xs text-slate-400 font-medium mt-0.5">Issued: {cert.issueDate}</p>
                           
                           <div className="flex gap-2 mt-3">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-lg border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition">
                                <ExternalLink size={12} /> View
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-[#0ea5e9] text-[10px] font-bold uppercase rounded-lg border border-sky-100 hover:bg-sky-100 hover:border-sky-200 transition">
                                <Download size={12} /> Download
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* 5. Split Layout: Activity & Details */}
            <div className="grid xl:grid-cols-2 gap-8">
               
               {/* Activity Feed */}
               <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Recent Activity</h3>
                  <div className="space-y-3">
                     {RECENT_ACTIVITY.map((item) => (
                        <div key={item.id} className="border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-4 bg-white hover:border-slate-200 transition">
                           <div className="bg-sky-50 text-[#0ea5e9] p-3 rounded-xl">
                              <CheckCircle size={20} />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-slate-700 text-sm">{item.title}</h4>
                              <p className="text-xs text-slate-400 font-bold mt-1">{item.date}</p>
                           </div>
                           <span className="text-amber-500 font-black text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">{item.xp}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Account Details Form */}
               <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Account Details</h3>
                  <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400"><Mail size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
                           {isEditing ? (
                               <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full font-bold text-slate-700 border-b-2 border-slate-200 focus:border-[#0ea5e9] focus:outline-none pb-1" />
                           ) : (
                               <div className="font-bold text-slate-700">{profile.email}</div>
                           )}
                        </div>
                     </div>
                     
                     <div className="flex items-start gap-4">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400"><MapPin size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                           {isEditing ? (
                               <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full font-bold text-slate-700 border-b-2 border-slate-200 focus:border-[#0ea5e9] focus:outline-none pb-1" />
                           ) : (
                               <div className="font-bold text-slate-700">{profile.location}</div>
                           )}
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400"><Smile size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bio</div>
                           {isEditing ? (
                               <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full font-medium text-slate-600 border-2 border-slate-200 rounded-xl p-2 focus:border-[#0ea5e9] focus:outline-none h-24 resize-none text-sm" />
                           ) : (
                               <div className="font-medium text-slate-600 text-sm leading-relaxed">{profile.bio}</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

            </div>
        </div>
      </div>
      
      {/* --- RIGHT SIDEBAR (Widgets) --- */}
      <div className="hidden 2xl:flex flex-col w-[400px] border-l-2 border-slate-100 bg-slate-50/50 p-8 h-screen sticky top-0 overflow-y-auto custom-scrollbar gap-8 shrink-0">
          
          {/* Widget 1: Invite */}
          <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-6 text-center relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">🎁</div>
                <h3 className="font-black text-[#0ea5e9] text-lg mb-2">Invite Friends</h3>
                <p className="text-sky-800 text-sm font-medium mb-6 leading-relaxed">
                    Get 1 week of Premium membership for every friend who joins using your link!
                </p>
                <button className="w-full py-3 bg-[#0ea5e9] text-white rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-sky-200 hover:bg-sky-600 transition flex items-center justify-center gap-2">
                    <Share2 size={18} /> Copy Link
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 text-[#0ea5e9]">
                 <Gift size={150} />
             </div>
          </div>
          
          {/* Widget 2: Friends List */}
          <div className="border-2 border-slate-200 rounded-3xl p-6 bg-white shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">Following</h3>
                <button className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 transition">
                    <UserPlus size={18} />
                </button>
             </div>
             
             <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${i % 2 === 0 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                            {i % 2 === 0 ? '👩‍🚀' : '🦸‍♂️'}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-700 text-sm">User {i}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{1200 - (i * 50)} XP</div>
                        </div>
                        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${i === 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    </div>
                ))}
             </div>
             <button className="w-full mt-4 py-2 text-slate-400 font-bold text-xs uppercase hover:text-[#0ea5e9]">View all connections</button>
          </div>

          {/* Widget 3: Castpotro Plus (Ad) */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Crown size={24} className="text-yellow-300 animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-lg uppercase tracking-wide">Castpotro Plus</h3>
                </div>
                <p className="text-white/90 text-sm font-medium mb-6 leading-relaxed">
                    Custom avatars and profile backgrounds available now.
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
export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}