"use client";
import { 
  Zap, Flame, Star, Users, Shield, Smile, 
  Edit2, MapPin, Calendar, Mail, Award, CheckCircle, 
  Camera, Save, X, Sparkles, Crown, Share2, UserPlus, Gift,
  FileBadge, Download, ExternalLink, Palette, FileDown
} from 'lucide-react';
import { useState, Suspense, useEffect } from 'react';
import { getUserProfile } from '../../actions'; // Import the new action

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

// --- Avatar Creator Component ---
type AvatarData = {
  color: string;
  shape: string;
  icon: string;
};

function AvatarCreator({ isOpen, onClose, onSave, currentData }: { isOpen: boolean; onClose: () => void; onSave: (data: AvatarData) => void; currentData: AvatarData }) {
  const [localAvatar, setLocalAvatar] = useState<AvatarData>(currentData);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setIsVisible(true);
        setLocalAvatar(currentData);
    } else {
        const timer = setTimeout(() => setIsVisible(false), 300);
        return () => clearTimeout(timer);
    }
  }, [isOpen, currentData]);

  if (!isVisible && !isOpen) return null;

  const COLORS = [
    "bg-[#0ea5e9]", "bg-rose-500", "bg-orange-500", "bg-emerald-500", 
    "bg-purple-600", "bg-slate-800", "bg-indigo-500", "bg-pink-500"
  ];

  const SHAPES = [
    { name: "Circle", class: "rounded-full" },
    { name: "Soft", class: "rounded-3xl" }, 
    { name: "Square", class: "rounded-2xl" }
  ];

  const EMOJIS = ["😎", "🚀", "🦄", "🔥", "💻", "👾", "🐱", "👑", "JD", "👻", "🤖", "⭐"];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-[32px] p-6 w-full max-w-md shadow-2xl transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <Palette size={24} className="text-[#0ea5e9]" /> Customize Avatar
            </h3>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors duration-200">
                <X size={20} />
            </button>
        </div>

        <div className="flex justify-center mb-8 py-6 bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,transparent)]" />
            <div 
                key={`${localAvatar.color}-${localAvatar.shape}-${localAvatar.icon}`} 
                className={`
                    w-32 h-32 ${localAvatar.color} ${localAvatar.shape} 
                    border-[6px] border-white shadow-2xl shadow-slate-200
                    flex items-center justify-center text-5xl font-black text-white 
                    transform transition-all duration-500 
                    animate-in zoom-in-50 spin-in-12 relative z-10
                `}
            >
                {localAvatar.icon}
            </div>
        </div>

        <div className="space-y-6">
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-backwards">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Background Color</label>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((c) => (
                        <button 
                           key={c}
                           onClick={() => setLocalAvatar({...localAvatar, color: c})}
                           className={`w-10 h-10 rounded-full ${c} border-4 transition-all duration-300 ease-out hover:scale-110 active:scale-90 ${localAvatar.color === c ? 'border-slate-300 scale-110 ring-2 ring-[#0ea5e9] ring-offset-2 shadow-lg' : 'border-transparent hover:shadow-md'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 fill-mode-backwards">
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shape</label>
                 <div className="flex gap-3">
                    {SHAPES.map(s => (
                        <button
                           key={s.name}
                           onClick={() => setLocalAvatar({...localAvatar, shape: s.class})}
                           className={`h-10 flex-1 bg-white border-2 rounded-xl font-bold text-slate-600 text-xs transition-all duration-200 active:scale-95 ${localAvatar.shape === s.class ? 'border-[#0ea5e9] bg-sky-50 text-[#0ea5e9] shadow-inner' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            {s.name}
                        </button>
                    ))}
                 </div>
            </div>
            
             <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-backwards">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Avatar Icon</label>
                <div className="grid grid-cols-6 gap-2">
                   {EMOJIS.map(e => (
                       <button
                          key={e}
                          onClick={() => setLocalAvatar({...localAvatar, icon: e})}
                          className={`aspect-square flex items-center justify-center text-xl bg-white border-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90 ${localAvatar.icon === e ? 'border-[#0ea5e9] bg-sky-50 shadow-inner scale-105' : 'border-slate-200 hover:border-[#0ea5e9]'}`}
                       >
                           {e}
                       </button>
                   ))}
                </div>
                <div className="mt-3 relative group">
                   <input 
                      type="text" 
                      placeholder="Or type custom text..." 
                      maxLength={2}
                      className="w-full h-10 px-4 font-bold text-sm bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#0ea5e9] focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300"
                      onChange={(e) => setLocalAvatar({...localAvatar, icon: e.target.value})}
                      value={localAvatar.icon}
                    />
                </div>
            </div>
        </div>

        <button 
            onClick={() => onSave(localAvatar)}
            className="w-full mt-8 py-3.5 bg-[#0ea5e9] text-white rounded-xl font-extrabold text-sm uppercase tracking-wide shadow-lg shadow-sky-200 hover:bg-sky-500 hover:shadow-sky-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
            <Save size={18} /> Save Avatar
        </button>

      </div>
    </div>
  );
}

function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  const [avatar, setAvatar] = useState<AvatarData>({
    color: "bg-[#0ea5e9]",
    shape: "rounded-full",
    icon: "JD"
  });

  const [profile, setProfile] = useState({
    name: "User", // Default fallback
    handle: "@user",
    email: "user@example.com",
    location: "New York, USA",
    bio: "Computer Science student passionate about AI and sustainable development."
  });

  // --- Fetch User Data Effect ---
  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserProfile();
      if (userData) {
        setProfile(prev => ({
          ...prev,
          name: userData.name || "User",
          email: userData.email,
          // Generate a handle from the name since it's not in DB
          handle: userData.name 
            ? `@${userData.name.replace(/\s+/g, '').toLowerCase()}` 
            : prev.handle
        }));
      }
    }
    fetchUser();
  }, []);

  // --- PDF Generation Logic ---
  const generateCV = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text(profile.name, 20, 25);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(profile.handle, 20, 35);

    // Stats
    doc.setFontSize(10);
    doc.text(`XP: 1,250`, pageWidth - 50, 20);
    doc.text(`League: Gold`, pageWidth - 50, 26);
    doc.text(`Badges: 12`, pageWidth - 50, 32);

    // Content
    let yPos = 70;
    doc.setTextColor(51, 65, 85);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CONTACT", 20, yPos);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    yPos += 15;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${profile.email}`, 20, yPos);
    yPos += 8;
    doc.text(`Location: ${profile.location}`, 20, yPos);
    yPos += 20;

    doc.setFont("helvetica", "bold");
    doc.text("ABOUT ME", 20, yPos);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    yPos += 15;
    
    doc.setFont("helvetica", "normal");
    const bioLines = doc.splitTextToSize(profile.bio, pageWidth - 40);
    doc.text(bioLines, 20, yPos);
    yPos += (bioLines.length * 7) + 15;

    doc.setFont("helvetica", "bold");
    doc.text("ACHIEVEMENTS", 20, yPos);
    doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
    yPos += 15;
    
    doc.setFont("helvetica", "normal");
    BADGES.forEach((badge) => {
        doc.text(`• ${badge.name}`, 25, yPos);
        yPos += 8;
    });

    doc.save(`${profile.name.replace(/\s+/g, '_')}_CV.pdf`);
  };

  return (
    <div className="flex w-full h-full">
      <AvatarCreator 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={(data) => {
          setAvatar(data);
          setIsAvatarModalOpen(false);
        }}
        currentData={avatar}
      />

      {/* --- CENTER CONTENT --- */}
      <div className="flex-1 overflow-y-auto bg-white relative scroll-smooth">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
           <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 p-2 rounded-xl transition hover:bg-slate-50">
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
                        onClick={generateCV}
                        className="flex items-center gap-2 font-bold px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all active:scale-95 shadow-md shadow-slate-200"
                    >
                        <FileDown size={18} />
                        <span className="hidden sm:block">Download CV</span>
                    </button>

                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-all duration-300 border-2 active:scale-95 ${
                            isEditing 
                            ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' 
                            : 'bg-sky-50 text-[#0ea5e9] border-sky-100 hover:bg-sky-100'
                        }`}
                    >
                        {isEditing ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${isEditing ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="flex w-full items-center justify-center gap-2 font-bold px-4 py-2 rounded-xl transition-all bg-[#0ea5e9] text-white shadow-lg shadow-sky-200 hover:bg-sky-600 active:scale-95 whitespace-nowrap"
                        >
                            <Save size={18} /> Save
                        </button>
                    </div>
                </div>
           </div>
        </div>

        {/* PROFILE BODY */}
        <div className="px-6 lg:px-10 pb-20 max-w-7xl mx-auto pt-6">
            
            {/* 1. Header Card */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 mb-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3 opacity-50 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

               <div className="relative group/avatar cursor-pointer shrink-0" onClick={() => setIsAvatarModalOpen(true)}>
                  <div className={`w-32 h-32 ${avatar.color} ${avatar.shape} border-[6px] border-white shadow-xl flex items-center justify-center text-white text-4xl font-black transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/avatar:scale-105 group-hover/avatar:rotate-3`}>
                     {avatar.icon}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-slate-100 text-slate-400 group-hover/avatar:text-[#0ea5e9] group-hover/avatar:scale-110 transition-all duration-300">
                     <Camera size={18} />
                  </div>
               </div>
               
               <div className="flex-1 text-center md:text-left space-y-2 w-full transition-all duration-300">
                  {isEditing ? (
                      <div className="space-y-3 max-w-md animate-in slide-in-from-left-4 duration-300">
                          <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full text-2xl font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-[#0ea5e9] focus:outline-none transition-all shadow-sm focus:shadow-md" />
                          <input type="text" value={profile.handle} onChange={(e) => setProfile({...profile, handle: e.target.value})} className="w-full text-slate-500 font-bold bg-white border-2 border-slate-200 rounded-xl px-4 py-2 focus:border-[#0ea5e9] focus:outline-none transition-all shadow-sm focus:shadow-md" />
                      </div>
                  ) : (
                      <div className="animate-in fade-in duration-300">
                        <h1 className="text-3xl font-extrabold text-slate-800">{profile.name}</h1>
                        <p className="text-slate-400 font-bold text-lg">{profile.handle}</p>
                      </div>
                  )}
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                     <p className="text-slate-500 font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-sm hover:scale-105 transition-transform cursor-default"><Calendar size={14} className="text-[#0ea5e9]" /> Joined January 2026</p>
                     <p className="text-slate-500 font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-sm hover:scale-105 transition-transform cursor-default"><MapPin size={14} className="text-rose-500" /> {profile.location}</p>
                  </div>
               </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-orange-200 hover:-translate-y-1 hover:shadow-orange-100/50 hover:shadow-lg transition-all duration-300 group cursor-default">
                  <div className="bg-orange-50 p-3 rounded-full group-hover:scale-110 transition-transform duration-300"><Flame size={24} className="text-orange-500" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">5</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Streak</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-sky-200 hover:-translate-y-1 hover:shadow-sky-100/50 hover:shadow-lg transition-all duration-300 group cursor-default">
                  <div className="bg-sky-50 p-3 rounded-full group-hover:scale-110 transition-transform duration-300"><Zap size={24} className="text-[#0ea5e9]" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">1,250</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-yellow-200 hover:-translate-y-1 hover:shadow-yellow-100/50 hover:shadow-lg transition-all duration-300 group cursor-default">
                  <div className="bg-yellow-50 p-3 rounded-full group-hover:scale-110 transition-transform duration-300"><Shield size={24} className="text-yellow-500" fill="currentColor" /></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-slate-700">Gold</div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">League</div>
                  </div>
               </div>
               <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm hover:border-purple-200 hover:-translate-y-1 hover:shadow-purple-100/50 hover:shadow-lg transition-all duration-300 group cursor-default">
                  <div className="bg-purple-50 p-3 rounded-full group-hover:scale-110 transition-transform duration-300"><Award size={24} className="text-purple-500" fill="currentColor" /></div>
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
                     <div key={badge.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-transparent hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer ${badge.color}`}>
                        <div className="text-4xl drop-shadow-sm transition-transform duration-300 hover:rotate-12">{badge.icon}</div>
                        <span className="font-bold text-[10px] uppercase tracking-wide opacity-80 text-center">{badge.name}</span>
                     </div>
                  ))}
                  {[1,2,3].map((i) => (
                     <div key={i} className="aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300 hover:bg-slate-100 transition-colors">
                        <Award size={32} />
                     </div>
                  ))}
               </div>
            </div>

            {/* 4. Certifications Section */}
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
               <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Recent Activity</h3>
                  <div className="space-y-3">
                     {RECENT_ACTIVITY.map((item) => (
                        <div key={item.id} className="border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-4 bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer">
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

               <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-700">Account Details</h3>
                  <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 space-y-6">
                     <div className="flex items-start gap-4 group">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-sky-50 group-hover:text-[#0ea5e9] transition-colors"><Mail size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</div>
                           {isEditing ? (
                               <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full font-bold text-slate-700 border-b-2 border-slate-200 focus:border-[#0ea5e9] focus:outline-none pb-1 transition-colors" />
                           ) : (
                               <div className="font-bold text-slate-700">{profile.email}</div>
                           )}
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors"><MapPin size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                           {isEditing ? (
                               <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full font-bold text-slate-700 border-b-2 border-slate-200 focus:border-[#0ea5e9] focus:outline-none pb-1 transition-colors" />
                           ) : (
                               <div className="font-bold text-slate-700">{profile.location}</div>
                           )}
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors"><Smile size={20} /></div>
                        <div className="flex-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bio</div>
                           {isEditing ? (
                               <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full font-medium text-slate-600 border-2 border-slate-200 rounded-xl p-2 focus:border-[#0ea5e9] focus:outline-none h-24 resize-none text-sm transition-colors shadow-sm focus:shadow-md" />
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
          <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-6 text-center relative overflow-hidden group hover:shadow-xl hover:shadow-sky-100 transition-all duration-300">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🎁</div>
                <h3 className="font-black text-[#0ea5e9] text-lg mb-2">Invite Friends</h3>
                <p className="text-sky-800 text-sm font-medium mb-6 leading-relaxed">
                    Get 1 week of Premium membership for every friend who joins using your link!
                </p>
                <button className="w-full py-3 bg-[#0ea5e9] text-white rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-sky-200 hover:bg-sky-600 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2">
                    <Share2 size={18} /> Copy Link
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 text-[#0ea5e9] transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">
                 <Gift size={150} />
             </div>
          </div>
          <div className="border-2 border-slate-200 rounded-3xl p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700">Following</h3>
                <button className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-[#0ea5e9] hover:bg-sky-50 transition-colors">
                    <UserPlus size={18} />
                </button>
             </div>
             <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 ${i % 2 === 0 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                            {i % 2 === 0 ? '👩‍🚀' : '🦸‍♂️'}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-700 text-sm group-hover:text-[#0ea5e9] transition-colors">User {i}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{1200 - (i * 50)} XP</div>
                        </div>
                        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 ${i === 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    </div>
                ))}
             </div>
             <button className="w-full mt-4 py-2 text-slate-400 font-bold text-xs uppercase hover:text-[#0ea5e9] transition-colors">View all connections</button>
          </div>
          <div className="bg-gradient-to-br from-[#0ea5e9] to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-sky-200 hover:shadow-2xl hover:shadow-sky-400/50 transition-all duration-500">
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
            <div className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-700">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0ea5e9] font-bold animate-pulse">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}