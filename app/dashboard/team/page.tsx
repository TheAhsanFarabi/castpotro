"use client";
import Image from 'next/image';
import { motion } from 'framer-motion'; 

const teamMembers = [
  { name: "Ahsan Farabi", image: "/Ahsan.jpeg", role: "Team Member" },
  { name: "Md Abdul Ahad Minhaz", image: "/Abdul Ahad.jpeg", role: "Team Member" },
  { name: "Israt Khandaker", image: "/Israt.jpeg", role: "Team Member" },
  { name: "SM Fahad Farabee", image: "/Fahad.jpeg", role: "Team Member" },
  { name: "Ibrahim Khalil Shanto", image: "/Ibrahim.jpeg", role: "Team Member" },
];

export default function TeamPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-pink-500">Dream Team</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          The brilliant minds behind Castpotro, working together to revolutionize soft skills learning.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="group relative bg-white/60 backdrop-blur-md border-2 border-slate-100 rounded-[40px] p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-200/50 hover:border-sky-200"
          >
            {/* Image Container */}
            <div className="relative w-40 h-40 mb-6 rounded-full p-1 bg-gradient-to-br from-[#0ea5e9] to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-slate-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            {/* Info */}
            <h3 className="text-xl font-extrabold text-slate-800 mb-1 group-hover:text-[#0ea5e9] transition-colors">
              {member.name}
            </h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-4">
              {member.role}
            </p>

            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-full rounded-[40px] bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Explicit Bottom Spacer to guarantee scroll space */}
      <div className="h-64 w-full" aria-hidden="true" />
    </div>
  );
}