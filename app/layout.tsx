import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Castpotro", 
  description: "Master soft skills for free", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* --- GLOBAL BACKGROUND DECORATION (Intensified) --- */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
           {/* Base Layer: Slightly tinted for warmth */}
           <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50" /> 
           
           {/* Gradient Overlay */}
           <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-sky-100/80 to-transparent" />
           
           {/* Pink Blob: Stronger Color & Opacity */}
           <div className="absolute top-[-100px] right-[-100px] w-[700px] h-[700px] bg-pink-400/30 rounded-full blur-[120px] opacity-80 animate-pulse" style={{ animationDuration: '6s' }} />
           
           {/* Blue Blob: Stronger Color & Opacity */}
           <div className="absolute top-[300px] left-[-200px] w-[600px] h-[600px] bg-sky-500/30 rounded-full blur-[120px] opacity-70" />
        </div>

        <ChatWidget />
        
        {children}
      </body>
    </html>
  );
}