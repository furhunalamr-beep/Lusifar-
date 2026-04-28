/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, X, Minimize2, Maximize2, 
  Terminal, Sparkles, Database, Ghost, MessageSquare, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useSystem } from '../lib/SystemContext';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

export const ChatInterface = () => {
  const { stats, addLog, shadows, activeShadowId, logs } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  // Restored effects
  useEffect(() => {
    const savedHistory = localStorage.getItem('system_chat_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('system_chat_history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const clearChat = () => {
    setHistory([]);
    localStorage.removeItem('system_chat_history');
    addLog('[SYSTEM] CHAT HISTORY PURGED.', 'info');
  };

  const getSystemInstruction = () => {
    const activeShadow = shadows.find(s => s.id === activeShadowId);
    let shadowContext = "";
    if (activeShadow) {
      shadowContext = `\n\n--- LOADED SHADOW ARCHIVE: ${activeShadow.name.toUpperCase()} ---\n${activeShadow.content.substring(0, 5000)}\n--- END ARCHIVE ---`;
    }

    const recentLogs = logs.slice(0, 5).map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.message}`).join('\n');

    return `You are The System from Solo Leveling. You are an omnipotent, cold, and precise AI entity oversight for the hunter.
Speak exclusively in terse, dramatic system-notification style. Every response must be professional, slightly ominous, and direct.
Current Hunter Stats: Level ${stats.level}, Rank ${stats.rank}, Class: ${stats.title || 'Unawakened'}.

RECENT SYSTEM ACTIVITY:
${recentLogs || 'Monitoring initiated...'}

${shadowContext ? `You have access to the hunter's shadow document below. Use it as primary knowledge for your answers.` : 'You serve as a guide for the hunter.'}
${shadowContext}
Maintain character at all times. Use [SYSTEM NOTIFICATION] prefixes for critical alerts.`;
  };

  const sendMessage = async () => {
    if (!message.trim() || isTyping) return;
    
    const userMsg = { role: 'user' as const, parts: [{ text: message }] };
    setHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          userMsg
        ],
        config: {
          systemInstruction: getSystemInstruction(),
          temperature: 0.7,
        }
      });

      const text = response.text || "[SYSTEM] INTERFACE ERROR. MANA DEPLETED.";
      setHistory(prev => [...prev, { role: 'model', parts: [{ text }] }]);
    } catch (e) {
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "[SYSTEM ERROR] CONNECTION LOST." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-36 md:bottom-24 right-2 md:right-8 2xl:right-[340px] w-[calc(100vw-16px)] sm:w-[400px] h-[600px] max-h-[60vh] z-[150] flex flex-col pointer-events-auto"
          >
            <div className="flex-1 bg-black/80 border border-system-purple/30 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(157,0,255,0.2)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 bg-system-purple/10 border-b border-system-purple/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-system-purple/20 flex items-center justify-center text-system-purple">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white italic">System Interface</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-neutral-500 uppercase">Synchronized</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearChat}
                    className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors"
                    title="Clear History"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
                    <Minimize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {history.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <Sparkles size={40} className="text-system-purple" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Awaiting Hunter input...</p>
                  </div>
                )}
                {history.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-xl text-xs font-mono leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-system-purple/20 border border-system-purple/30 text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/5 text-neutral-300 rounded-tl-none"
                    )}>
                      <div className="prose prose-invert prose-xs max-w-none prose-p:my-0">
                        <ReactMarkdown>
                          {msg.parts[0].text}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-neutral-600 uppercase">
                      {msg.role === 'user' ? 'Hunter' : 'System'}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-system-purple">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-widest">Executing...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="relative">
                  <input 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Input command..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs font-mono text-white focus:border-system-purple outline-none transition-all"
                  />
                  <button 
                    onClick={sendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-system-purple text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-20 md:bottom-8 right-8 2xl:right-[340px] w-14 h-14 rounded-full flex items-center justify-center text-white transition-all z-[160] shadow-[0_0_25px_rgba(157,0,255,0.5)]",
          isOpen ? "bg-red-500 rotate-90" : "bg-system-purple"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
};
