/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { useSystem } from './lib/SystemContext';
import { StatsDashboard } from './components/StatsDashboard';
import { QuestBoard } from './components/QuestBoard';
import { SyllabusMap } from './components/SyllabusMap';
import { MonarchArchive } from './components/MonarchArchive';
import { TrainingGrounds } from './components/TrainingGrounds';
import { FocusChamber } from './components/FocusChamber';
import { SkillEvolution } from './components/SkillEvolution';
import { HallOfFame } from './components/HallOfFame';
import { SystemLogs } from './components/SystemLogs';
import { ProfileEditor } from './components/ProfileEditor';
import { Inventory } from './components/Inventory';
import { Onboarding } from './components/Onboarding';
import { SystemShop } from './components/SystemShop';
import { Vault } from './components/Vault';
import { IntroAnimation } from './components/IntroAnimation';
import { AnimatePresence, motion } from 'motion/react';
import { Terminal, Database, MessageSquare, ChevronUp, Bell, Search, Zap, Activity, FolderOpen } from 'lucide-react';
import * as SystemUI from './components/SystemUI';
import { StripeShop } from './components/StripeShop';
import { ChallengeBoard } from './components/ChallengeBoard';

import { StatBar, RankBadge, SystemCard } from './components/SystemUI';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [showIntro, setShowIntro] = React.useState(true);
  const { activeTab, stats, logs } = useSystem();
  
  React.useEffect(() => {
    // Basic TTS check
    if ('speechSynthesis' in window) {
      const speak = () => {
        const msg = new SpeechSynthesisUtterance("Welcome back to the Solo System.");
        
        // Attempt to select a deeper sounding voice if available
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google UK English Male'));
        if (maleVoice) {
          msg.voice = maleVoice;
        }
        
        // Adjust pitch and rate for a deeper, calmer tone
        msg.pitch = 0.8; // Lower pitch
        msg.rate = 0.9;  // Slightly slower
        
        window.speechSynthesis.speak(msg);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setTimeout(speak, 1000);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null; // Prevent re-triggering
          setTimeout(speak, 1000);
        };
      }
    }
  }, []);
  
  const handleVoiceCommand = React.useCallback((text: string) => {
    console.log("Voice Command:", text);
    // Add command parsing logic here
  }, []);

  if (showIntro) return <IntroAnimation onComplete={() => setShowIntro(false)} />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'status': return <StatsDashboard />;
      case 'quests': return <QuestBoard />;
      case 'roadmap': return <SyllabusMap />;
      case 'library': return <MonarchArchive />;
      case 'training': return <TrainingGrounds />;
      case 'focus': return <FocusChamber />;
      case 'skills': return <SkillEvolution />;
      case 'inventory': return <Inventory />;
      case 'challenge': return <ChallengeBoard />;
      case 'voice': return <VoiceCommandPage />;
      case 'shop': return <StripeShop />;
      case 'vault': return <Vault />;
      case 'settings': return <ProfileEditor />;
      default: return <StatsDashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen min-h-screen bg-system-dark relative overflow-hidden font-system">
      <AnimatePresence>
        {!stats.onboarded && <Onboarding />}
      </AnimatePresence>

      {/* Background FX */}
      <div className="shadow-overlay" />
      <div className="system-grid" />
      <div className="scanline" />
      
      <div className="shadow-embers">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="ember" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }} 
          />
        ))}
      </div>
      
      {/* Navigation */}
      <Sidebar />
      <BottomNavigation />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-3xl relative">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-system-cyan/50 to-transparent opacity-30" />
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded bg-system-cyan/10 border border-system-cyan/30 flex items-center justify-center text-system-cyan group-hover:shadow-[0_0_15px_cyan] transition-all">
                <Zap size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic leading-none">Hunter System</span>
                <span className="text-[8px] font-mono text-system-cyan uppercase tracking-widest mt-0.5">Online • V1.0.4-β</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 text-[9px] font-mono text-neutral-500 border-l border-white/10 pl-6 uppercase tracking-[0.2em]">
              <div className="flex flex-col">
                <span className="text-neutral-600">Database Sync</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-600">Mana Pulse</span>
                <span className="text-system-cyan">Normal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Persistent HUD */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-2 bg-black/40 border-x border-white/5 mx-2 lg:mx-4">
              <div className="w-24 lg:w-32">
                <StatBar label="HP" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </div>
              <div className="w-24 lg:w-32">
                <StatBar label="MP" current={stats.mana} max={stats.maxMana} colorClass="bg-system-blue shadow-[0_0_10px_rgba(0,149,255,0.5)]" />
              </div>
              <div className="w-24 lg:w-32">
                <StatBar label="FAT" current={stats.fatigue} max={stats.maxFatigue} colorClass="bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-black/40 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-system-gold/5 group-hover:bg-system-gold/10 transition-colors" />
              <Database size={14} className="text-system-gold relative z-10" />
              <div className="flex flex-col relative z-10">
                <span className="text-[8px] font-black uppercase text-neutral-500 leading-none">Gold Reserve</span>
                <span className="text-xs font-mono font-bold text-white">{stats.gold.toLocaleString()}G</span>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-white/10" />
            
            <button className="p-2 text-neutral-500 hover:text-white transition-all hover:scale-110 relative group">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-system-purple rounded-full shadow-[0_0_8px_rgba(157,0,255,1)] group-hover:animate-ping" />
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0">
          <div className="sticky top-0 z-30 h-[2px] w-full bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.exp / stats.maxExp) * 100}%` }}
              className="h-full bg-system-purple shadow-[0_0_10px_rgba(157,0,255,1)]"
            />
          </div>
          <div className="p-8 container mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right Utility Bar (Desktop Only) */}
      <aside className="hidden 2xl:flex w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl flex-col z-20">
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <SystemLogs />
        </div>
        
        <div className="p-4 border-t border-white/5">
          <div className="p-4 bg-system-blue/5 border border-system-blue/20 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-system-blue tracking-widest">Active Passive Effect</span>
              <Activity size={12} className="text-system-blue animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-white italic">Monarch's Domain</h4>
            <p className="text-[9px] font-mono text-neutral-400 leading-relaxed">
              Increases all attribute stats by +2% when within 50 miles of a Shadow General.
            </p>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {stats.level >= 2 && stats.level < 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          >
            <div className="text-8xl font-black italic text-system-cyan opacity-20 uppercase tracking-tighter mix-blend-overlay">
              Level Up
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatInterface />
    </div>
  );
}
