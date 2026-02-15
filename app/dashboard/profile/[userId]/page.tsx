
import { getPublicUserProfile } from "@/app/actions/profile";
import { getUserStreak } from "@/app/actions/quests";
import { 
  MapPin, 
  Calendar, 
  Flame, 
  Zap, 
  Shield, 
  Award, 
  Smile, 
  FileBadge, 
  ShieldCheck, 
  CheckCircle, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import StreakWidget from "@/app/components/StreakWidget";

// Force dynamic behavior so it always fetches fresh data
export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  // Fetch Data in Parallel
  const [data, streakData] = await Promise.all([
    getPublicUserProfile(userId),
    getUserStreak(userId)
  ]);

  if (!data) return notFound();

  const { user, certificates, activities } = data;

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
      
      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto relative scroll-smooth min-w-0">
        
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-4">
            <Link 
              href="/dashboard/rank" 
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-[#0ea5e9] hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-extrabold text-slate-700 text-lg sm:text-xl">Learner Profile</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Public View</p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-10 pb-20 max-w-7xl mx-auto pt-6">
          
          {/* BANNER & AVATAR CARD */}
          <div className="bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden mb-8 relative shadow-sm">
            <div className="h-48 w-full relative" style={user.banner.style} />
            <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 relative z-10">
              <div className={`w-36 h-36 shrink-0 ${user.avatar.color} ${user.avatar.shape} border-[6px] border-white shadow-xl flex items-center justify-center text-white text-5xl font-black`}>
                {user.avatar.icon}
              </div>
              <div className="flex-1 text-center md:text-left space-y-2 w-full pt-6 md:pt-0 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">{user.name}</h1>
                    <p className="text-slate-400 font-bold text-lg">{user.handle}</p>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <p className="text-slate-500 font-medium flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm">
                    <Calendar size={14} className="text-[#0ea5e9]" /> Joined 2026
                  </p>
                  <p className="text-slate-500 font-medium flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm">
                    <MapPin size={14} className="text-rose-500" /> {user.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBox icon={Flame} color="text-orange-500" bg="bg-orange-50" value={streakData.streak} label="Current Streak" />
            <StatBox icon={Zap} color="text-[#0ea5e9]" bg="bg-sky-50" value={user.xp} label="Total XP" />
            <StatBox icon={Shield} color="text-yellow-500" bg="bg-yellow-50" value={user.league} label="Current League" />
            <StatBox icon={Award} color="text-purple-500" bg="bg-purple-50" value={certificates.length} label="Certificates" />
          </div>

          {/* BIO & INFO */}
          <div className="grid xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2 space-y-4">
              <h3 className="text-xl font-extrabold text-slate-700">About</h3>
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-6">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {user.bio || "This user hasn't written a bio yet."}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
               <h3 className="text-xl font-extrabold text-slate-700">Badges</h3>
               <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 text-xs font-bold rounded-full border border-sky-100">Early Adopter</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">Verified Student</span>
               </div>
            </div>
          </div>

          {/* CERTIFICATES */}
          <div className="mb-8">
            <h3 className="text-xl font-extrabold text-slate-700 mb-4">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.length === 0 ? (
                <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                  No certificates earned yet.
                </div>
              ) : (
                certificates.map((cert: any) => (
                  <div key={cert.id} className="bg-white border-2 border-slate-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="bg-sky-50 text-[#0ea5e9] p-3 rounded-xl">
                      <FileBadge size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700">{cert.title}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">{cert.issuer}</p>
                      {cert.txHash && (
                         <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                           <ShieldCheck size={12}/> On-Chain Verified
                         </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-700">Recent Activity</h3>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">No recent activity.</div>
                ) : (
                  activities.map((item: any) => (
                    <div key={item.id} className="border-2 border-slate-100 rounded-2xl p-4 flex items-center gap-4 bg-white">
                      <div className={`p-3 rounded-xl ${item.type === "QUEST" ? "bg-amber-50 text-amber-500" : item.type === "EVENT" ? "bg-purple-50 text-purple-500" : "bg-sky-50 text-sky-500"}`}>
                        {item.type === "QUEST" ? <Shield size={20} /> : item.type === "EVENT" ? <Calendar size={20} /> : <CheckCircle size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-700 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-1">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{item.xp}</span>
                    </div>
                  ))
                )}
              </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDEBAR (Only Streak) */}
      <div className="hidden xl:flex flex-col w-[300px] bg-slate-50/50 p-8 h-screen sticky top-0 border-l-2 border-slate-100">
        <StreakWidget streak={streakData.streak} weekActivity={streakData.weekActivity} />
      </div>

    </div>
  );
}

function StatBox({ icon: Icon, color, bg, value, label }: any) {
  return (
    <div className="border-2 border-slate-100 rounded-2xl p-5 flex flex-col items-center gap-2 bg-white shadow-sm">
      <div className={`${bg} p-3 rounded-full`}><Icon size={24} className={color} fill="currentColor" /></div>
      <div className="text-center">
        <div className="text-2xl font-black text-slate-700">{value}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}
