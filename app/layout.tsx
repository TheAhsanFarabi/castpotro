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
        {/* --- GLOBAL BACKGROUND DECORATION --- */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
           {/* Base Layer */}
           <div className="absolute top-0 left-0 w-full h-full bg-slate-50" /> 
           
           {/* Gradient Overlay */}
           <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-violet-100/60 to-transparent" />
           
           {/* Pink Blob */}
           <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '4s' }} />
           
           {/* Blue/Violet Blob */}
           <div className="absolute top-[200px] left-[-200px] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[100px] opacity-60" />
        </div>

        <ChatWidget />
        
        {children}
      </body>
    </html>
  );
}