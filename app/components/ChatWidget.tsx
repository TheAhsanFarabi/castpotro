"use client";
import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { chatWithGemini } from '../actions';
import { AnimatePresence, motion } from 'framer-motion';

// --- 3D SALY ROBOT COMPONENT ---
const SalyRobot = ({ mood }: { mood: 'idle' | 'happy' | 'thinking' }) => {
  const src = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png";
  
  // Animation variants based on mood
  const variants = {
    idle: { y: [0, -5, 0], rotate: [0, 2, -2, 0], scale: 1 },
    happy: { y: [0, -10, 0], rotate: [0, 10, -10, 0], scale: 1.1 },
    thinking: { y: 0, rotate: 0, scale: [1, 0.95, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }
  };

  return (
    <motion.img 
      src={src}
      alt="Casty AI"
      className="w-full h-full object-contain drop-shadow-lg"
      animate={mood}
      variants={variants}
      transition={{ 
        repeat: Infinity, 
        duration: mood === 'thinking' ? 1 : 4, 
        ease: "easeInOut" 
      }}
    />
  );
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', text: 'Beep boop! 🤖 I am Casty. Ask me anything about your courses or skills!' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    const newHistory = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);

    try {
      const aiResponseText = await chatWithGemini(messages, userText);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Systems overloaded! Try again later. 💥" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine Robot Mood
  const currentMood = isLoading ? 'thinking' : isOpen ? 'happy' : 'idle';

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {/* CHAT WINDOW */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-slate-100 flex flex-col overflow-hidden origin-bottom-right"
        >
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full border border-slate-200 p-1">
                 <SalyRobot mood={currentMood} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Casty Mentor</h3>
                <p className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span> 
                  {isLoading ? 'Processing...' : 'Online'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-slate-200 p-2 rounded-lg transition text-slate-400">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar for AI messages */}
                {msg.role === 'ai' && (
                    <div className="w-6 h-6 mr-2 mt-2 flex-shrink-0">
                         <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="AI" className="w-full h-full object-contain" />
                    </div>
                )}
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#0ea5e9] text-white rounded-tr-none shadow-md shadow-sky-100' 
                    : 'bg-slate-50 border border-slate-100 text-slate-600 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Casty..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border-2 border-transparent focus:border-[#0ea5e9] rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-medium placeholder:text-slate-400"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-3 rounded-xl transition-all shadow-lg shadow-sky-100 disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON (THE 3D ROBOT HEAD) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 bg-white hover:border-[#0ea5e9] border-2 border-slate-100 rounded-full shadow-xl shadow-slate-200/50 transition-all"
      >
        <div className="w-12 h-12">
            <SalyRobot mood={currentMood} />
        </div>
        
        {/* Notification Dot (Only show when closed) */}
        {!isOpen && (
             <span className="absolute top-0 right-0 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white"></span>
             </span>
        )}
      </motion.button>
    </div>
  );
}