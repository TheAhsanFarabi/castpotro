"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SKILLS } from '@/lib/data';

export default function SkillSelection() {
  const router = useRouter();

  const handleSelect = (id: string) => {
    // Navigate to test with selected skill
    router.push(`/get-started/test?skill=${id}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <Link href="/" className="text-slate-400 hover:text-slate-600 mb-6 font-bold uppercase text-sm flex items-center gap-2">
          ← Back
        </Link>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
          Which skill do you want to master first?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {SKILLS.map((skill) => {
            const Icon = skill.icon;
            return (
              <div 
                key={skill.id}
                onClick={() => handleSelect(skill.id)}
                className="card-select p-6 flex flex-col items-center gap-4 group text-slate-600 hover:text-[#0ea5e9]"
              >
                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-sky-100 transition-colors text-[#0ea5e9]">
                    <Icon size={32} />
                </div>
                <div className="flex flex-col text-center">
                  <span className="font-bold text-lg">{skill.name}</span>
                  <span className="text-xs text-slate-400 font-bold mt-1">{skill.learners} learners</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}